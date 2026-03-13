from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  title: str ="FastAPI App2"
  root_path: str
  client_id: str
  client_secret: str
  dns : str
  secure : bool
  redirect_uri : str
  redis_host : str
  redis_port : str
  redis_access_db : int
  redis_refresh_db : int



  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
  )

settings = Settings()
