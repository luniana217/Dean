from settings import settings
from langchain_ollama import ChatOllama
import logging
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from src.database import SessionLocal, Post



# 로깅 기본 설정 (INFO 레벨 이상 출력)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ollama LLM 초기화 - settings에서 모델명과 base URL을 불러옴
llm = ChatOllama(
  model=settings.ollama_model_name,
  base_url=settings.ollama_base_url,
  think=False,
)


def get_db():
   """Tool 함수 내부에서 직접 세션 사용하기 위한 헬퍼"""
   return SessionLocal()


# ────────────────────────────────────────
# Tool 함수 정의 (Agent가 호출할 수 있는 도구들)
# ────────────────────────────────────────
import logging
logger = logging.getLogger(__name__)

def create_post(author: str, title: str, content: str) -> dict:
    """ 게시글 작성시 사용. author, title, content 모두 필수. """
    db = get_db()
    # DB 저장
    try:
      post = Post(author=author, title=title, content=content)
      db.add(post)
      db.commit()
      db.refresh(post) 
      return {"status": "success","id": post.id, "message": "게시글 생성 완료"}
    except Exception as e:
      db.rollback()
      print(f" DB 오류 내용: {e}")
      return {"status": "error", "message": str(e)}
    finally:
      db.close()

def list_posts() -> list:
    """ 게시글 목록 요청시 사용"""
    db = get_db()
    try:
      posts = db.query(Post).order_by(Post.created_at.desc()).all()
      return [{"id": post.id, "title": post.title} for post in posts]
    except Exception as e:
      return {"status": "error", "message": str(e)}
    finally:
      db.close()
    

def get_post(post_id: int) -> dict:
    """ 게시글 조회시 사용. post_id 필수 """
    db = get_db()
    try:
      post = db.query(Post).filter(Post.id == post_id).first()
      if not post:
        return {"status": "error", "message": f"{post_id}번 게시글을 찾을 수 없습니다."}
      return {"id": post.id,  "author": post.author,   "title": post.title, "content": post.content,"created_at": str(post.created_at), "updated_at": str(post.updated_at) }
    finally:
      db.close()
   

def update_post(post_id: int, title: str, content: str) -> dict:
    """ 게시글 수정시 사용  """
    db = get_db()
    try:
      post = db.query(Post).filter(Post.id == post_id).first()
      if not post:
        return {"status": "error", "message": f"{post_id}번 게시글을 찾을 수 없습니다."}
      post.title = title
      post.content = content
      db.commit()
      return {"status": "success", "message": f"{post_id}번 게시글이 수정되었습니다."}
    except Exception as e:
      db.rollback()
      return {"status": "error", "message": str(e)}
    finally:
      db.close()
      

        

def delete_post(post_id: int) -> dict:
    """ 게시글 삭제시 사용. post_id 필수. """
    db = get_db()
    try:
      post = db.query(Post).filter(Post.id == post_id).first()
      if not post:
        return{"status": "error", "message": f"{post_id}번 게시글을 찾을 수 없습니다."}
      db.delete(post)
      db.commit()
      return {"status": "success", "message": f"{post_id}번 게시글이 삭제되었습니다."}
    except Exception as e:
      db.rollback()
      return{"status": "error", "message": str(e)}
    finally:
      db.close()
  
#   # 검색 전용 프롬프트 구성
# def board(query: str) -> str: board_prompt = ChatPromptTemplate.from_template(
#   """ you are the admin of the board. analyze the user's natural language and 

#   Args:
#   query: query string
#   """
# ) 함수반환 없고, 문법상 틀렸고 , 문제만 일으키니 삭제가 맞음
#handoff 의 경우 single agent 이기 때문에 있을필요 x, 삭제함




# ────────────────────────────────────────
# MemorySaver: 인메모리 checkpointer
# - thread_id 기준으로 대화 상태(메시지 히스토리)를 저장
# - 같은 thread_id로 invoke하면 이전 대화 문맥이 자동으로 유지됨
# - 프로세스 종료 시 메모리 초기화됨 (영속성 필요 시 SqliteSaver 등으로 교체)
# ────────────────────────────────────────
checkpointer = MemorySaver()


# ────────────────────────────────────────
# ReAct Agent 생성
# - create_react_agent: LLM + tools + prompt로 단일 에이전트 구성
# - checkpointer를 주입해야 thread_id 기반 멀티턴 메모리가 실제로 동작함
# ────────────────────────────────────────  
board_agent = create_react_agent(
  llm,tools=
  [create_post, list_posts, get_post, update_post, delete_post],checkpointer=checkpointer,
   prompt="""
  당신은 게시판 관리 AI입니다.

사용자의 요청을 분석하여 반드시 하나의 작업을 선택하고 실행해야 합니다.

[가능한 작업]

1. create_post
- 새로운 게시글을 작성할 때 사용
- 반드시 author, title, content 필요

2. list_posts
- 게시글 목록을 요청할 때 사용
- 예: "목록 보여줘", "게시글 뭐 있어?"

3. get_post
- 특정 게시글 조회
- 반드시 post_id 필요
- 예: "1번 글 보여줘"

4. update_post
- 게시글 수정
- 반드시 post_id 필요
- title 또는 content 변경

5. delete_post
- 게시글 삭제
- 반드시 post_id 필요

[작업 선택 규칙 - 매우 중요]

- "작성", "써줘", "등록" → create_post
- "목록", "리스트", "전체" → list_posts
- "몇 번 글", "게시글 보여줘" → get_post
- "수정", "바꿔", "고쳐" → update_post
- "삭제", "지워" → delete_post

[파라미터 추출 규칙]

- author: 작성자 이름
- title: 제목
- content: 내용
- post_id: 숫자

[중요 규칙]

- 반드시 하나의 tool만 호출하라
- 필요한 값이 없으면 사용자에게 질문하라
- 절대 직접 답변하지 말고 tool을 사용하라
  """
)


def run():
  """에이전트 실행 루프. 'quit' / 'exit' / 'q' 또는 Ctrl+C 입력 시 종료."""
  try:
   
    # graph = workflow.compile(checkpointer=checkpointer)
    
   
        # thread_id로 대화 세션을 구분
        # checkpointer가 이 thread_id를 키로 메시지 히스토리를 저장/불러옴
    config = {"configurable": {"thread_id": "test_session_123"}}
    logger.info("게시판 에이전트를 시작합니다. 종료하려면 'quit' 또는 'q'를 입력하세요.")
    while True:
       try:
        user_input = input("🧑‍💻 User: ").strip()
        #빈 입력 무시
        if not user_input:
          continue
        if user_input.lower() in ["quit", "exit", "q"]:
          logger.info("Goodbye!")
          break

         # 에이전트 호출
         # - checkpointer가 있으므로 매번 전체 히스토리를 직접 넘길 필요 없음
         # - thread_id 기준으로 이전 대화 문맥이 자동으로 이어짐  

        turn = board_agent.invoke(
          {"messages": [{"role": "user", "content": user_input}]},
          config,
        )
        messages = turn['messages']
        last_message = turn['messages'][-1]
        logger.info(f"🤖 Agent: {last_message.content}")
       except KeyboardInterrupt:
        # Ctrl+C 입력 시 스택 트레이스 없이 깔끔하게 종료
        logger.info("\n인터럽트로 종료합니다")
        break
       except Exception as e:
        logger.error(e)
        break
    
  except Exception as e:
    logger.error(f"실행 중 오류 발생: {str(e)}")

if __name__ == "__main__":
  run()
