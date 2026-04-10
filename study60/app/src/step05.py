from fastapi import FastAPI, APIRouter, HTTPException, Depends
from src.core import get_app_state, Query, logger, extract_json, MovieDetailResponse



router = APIRouter(
  prefix="/step05",
  tags=["detail 가져오기"],
)

@router.post("/chat")
async def chat(query: Query, state=Depends(get_app_state)):
  try:
    agent = state.agent_executor
    inputs = {"messages": [("user", query.input)]}
    result = await agent.ainvoke(inputs)
    raw_content = result["messages"][-1].content
    json_data = extract_json(raw_content)
    validated_data = MovieDetailResponse(**json_data)
    return validated_data.model_dump()
  except Exception as e:
    logger.error(f"실행 중 에러: {str(e)}")
    raise HTTPException(
      status_code=500, 
      detail=f"에이전트 처리 중 오류: {str(e)}"
    )