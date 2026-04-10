import logging
import httpx
import json
import re
from typing import Union
from langchain.tools import tool
from pydantic import BaseModel, Field
from settings import settings
from contextlib import asynccontextmanager
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from fastapi import FastAPI, Request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- [1] 데이터 모델 정의 ---

class Query(BaseModel):
    input: str

class MovieItem(BaseModel):
    """목록 검색용 아이템"""
    imdbID: str = Field(description="영화 고유 ID") 
    title: str = Field(description="제목")
    poster: str = Field(description="포스터 이미지 URL")
    year: str = Field(description="개봉 년도")
    type: str = Field(description="유형")

class MovieListResponse(BaseModel):
    """목록 검색 결과 응답"""
    movies: list[MovieItem] = Field(description="검색된 영화 리스트")
    count: int = Field(description="검색된 총 영화 개수")

class MovieDetailResponse(BaseModel):
    """상세 정보 결과 응답"""
    title: str = Field(description="제목")
    poster: str = Field(description="포스터 이미지 URL")
    year: str = Field(description="개봉 년도")
    genre: str = Field(description="장르")
    plot: str = Field(description="줄거리", default="N/A")

class Data_collection(BaseModel):
    """데이터 수집 여부 응답"""
    success: bool = Field(description="데이터 수집 성공 여부")
    message: str = Field(description="처리 결과 메시지")

class AgentFinalResponse(BaseModel):
    """최종 통합 응답 모델: 목록 또는 상세 정보를 모두 수용"""
    status: str = Field(description="'success' 또는 'error'")
    response_type: str = Field(description="'list' 또는 'detail'")
    data: Union[MovieListResponse, MovieDetailResponse, dict]

# --- [2] 도구(Tool) 정의 ---

@tool
async def search_movie_list(query: str) -> str:
    """
    여러 개의 영화 목록을 검색할 때 사용합니다. 
    결과로 영화 제목, ID, 포스터 리스트를 반환합니다.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                settings.movie_api_url,
                params={"s": query, "apikey": settings.movie_api_key},
                timeout=10.0
            )
            data = response.json()
            if data.get("Response") == "True":
                results = data.get("Search", [])
                formatted = [
                    {
                        "imdbID": m.get("imdbID"),
                        "title": m.get("Title"),
                        "poster": m.get("Poster"),
                        "year": m.get("Year"),
                        "type": m.get("Type")
                    } for m in results
                ]
                return json.dumps({"movies": formatted, "count": len(formatted)}, ensure_ascii=False)
            return json.dumps({"error": "검색 결과가 없습니다."})
        except Exception as e:
            return json.dumps({"error": str(e)})

@tool
async def get_movie_detail(title_or_id: str) -> str:
    """
    특정 영화 하나에 대한 상세 정보(장르, 줄거리 등)가 필요할 때 사용합니다.
    입력값은 영화 제목(title) 또는 imdbID입니다.
    """
    async with httpx.AsyncClient() as client:
        try:
            # 상세 정보는 't'(제목) 또는 'i'(ID)를 사용 (여기서는 유연하게 t 사용)
            params = {"t": title_or_id, "apikey": settings.movie_api_key, "plot": "short"}
            if title_or_id.startswith("tt"): # ID인 경우 i 파라미터로 변경
                params = {"i": title_or_id, "apikey": settings.movie_api_key, "plot": "short"}
                
            response = await client.get(settings.movie_api_url, params=params, timeout=10.0)
            data = response.json()
            if data.get("Response") == "True":
                return json.dumps({
                    "title": data.get("Title"),
                    "poster": data.get("Poster"),
                    "year": data.get("Year"),
                    "genre": data.get("Genre"),
                    "plot": data.get("Plot")
                }, ensure_ascii=False)
            return json.dumps({"error": "상세 정보를 찾을 수 없습니다."})
        except Exception as e:
            return json.dumps({"error": str(e)})

@tool
async def data_collect(query: str)-> str:
    async with connect.cursor() as cur:
        await cur.execute 
    try:
            params = {"t": title_or_id, "apikey": settings.movie_api_key, "plot": "short"}
            if title_or_id.startswith("tt"): # ID인 경우 i 파라미터로 변경
                params = {"i": title_or_id, "apikey": settings.movie_api_key, "plot": "short"} 
            response = await client.get(settings.movie_api_url, params=params, timeout=10.0)
            data = response.json()
            if data.get("Response") == "True":
                return json.dumps({
                    "title": data.get("Title"),
                    "poster": data.get("Poster"),
                    "year": data.get("Year"),
                    "genre": data.get("Genre"),
                    "plot": data.get("Plot")
                }, ensure_ascii=False)
            return json.dumps({"error": "상세 정보를 찾을 수 없습니다."})
    except Exception as e:
            return json.dumps({"error": str(e)})



# 에이전트가 사용할 도구 2개 등록
tools = [search_movie_list, get_movie_detail, data_collect]




# --- [3] 유틸리티 및 Lifespan ---

def extract_json(text: str) -> dict:
    text = re.sub(r"```json\s?|```", "", text).strip()
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    return json.loads(text)

def get_app_state(request: Request):
    return request.app.state



@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("에이전트 초기화 중...")
    try:
        llm = ChatOllama(
            model=settings.ollama_model_name, 
            base_url=settings.ollama_base_url, 
            format="json",
            temperature=0
        )
        
        # 통합 응답 스키마
        schema = AgentFinalResponse.model_json_schema()
        
        system_message = (
            "당신은 영화 전문가입니다. 상황에 맞는 도구를 사용하세요.\n"
            "1. 여러 영화를 찾거나 목록이 필요하면 'search_movie_list'를 쓰세요.\n"
            "2. 특정 영화의 장르, 줄거리 등 상세 정보가 필요하면 'get_movie_detail'을 쓰세요.\n"
            "3. 데이터를 수집할수 있으면 true, 안된다면 false를 반환하세요 .\n"
            f"응답은 반드시 다음 JSON 스키마를 따르는 객체 하나만 출력하세요: {schema}\n"
            "결과가 리스트면 response_type을 'list'로, 상세정보면 'detail'로 설정하세요."
        )
        
        app.state.agent_executor = create_react_agent(llm, tools, prompt=system_message, max_iterations=5)
        logger.info("도구 2개가 탑재된 에이전트 생성 완료!")
        yield
    except Exception as e:
        logger.error(f"초기화 오류: {e}")
        raise e
    
