from fastapi import FastAPI, APIRouter, HTTPException, Depends
from src.core import get_app_state, Query, logger, extract_json, Data_collection

router = APIRouter(
  prefix="/step06",
  tags=["data 넣기"],
)

@router.post("/data")
async def chat(query: Query, state=Depends(get_app_state)):
  try:
    agent = state.agent_executor
    inputs = {"messages": [("user", query.input)]}
    result = await agent.ainvoke(inputs)
    raw_content = result["messages"][-1].content
    json_data = extract_json(raw_content)
    validated_data = Data_collection(**json_data)
    return validated_data.model_dump()
  except Exception as e:
    logger.error(f"실행 중 에러: {str(e)}")
    raise HTTPException(
      status_code=500, 
      detail=f"에이전트 처리 중 오류: {str(e)}"
    )