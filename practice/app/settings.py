from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
  ollama_base_url: str
  ollama_model_name: str = "gemma4:e4b"
  graph_image_path: str = "images"
  
  db_host: str = "192.168.0.201"
  db_port: int = 3306
  db_user: str = "root"
  db_password: str = ""
  db_name: str = "hayoung_board"



  model_config = SettingsConfigDict(
    env_file=".env",
    env_file_encoding="utf-8",
  )

settings = Settings()