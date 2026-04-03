import json
import os
import shutil
from settings import settings

def make_config():
    """
    train_model.py의 하이퍼파라미터를 기반으로
    HuggingFace 표준 GPT-2 형식의 config 딕셔너리를 생성
    """
    config = {
        "model_type": "gpt2",
        "vocab_size": 50257,       # tiktoken gpt2 어휘 사전 크기
        "n_positions": 128,        # CONTEXT_LENGTH
        "n_ctx": 128,              # # llama.cpp가 요구하는 context length 키
        "n_embd": 768,             # EMB_DIM
        "n_head": 12,              # NUM_HEADS
        "n_layer": 12,             # NUM_LAYERS
        "attn_pdrop": 0.1,         # 어텐션 드롭아웃 비율
        "resid_pdrop": 0.1,        # 잔차 연결 드롭아웃 비율
        "embd_pdrop": 0.1,         # 임베딩 드롭아웃 비율
        "architectures": ["GPT2LMHeadModel"],
        "torch_dtype": "float32"
    }
    return config

def run(safetensors_path, tokenizer_dir, upload_folder_name="hf_upload"):
    """
    Args:
        safetensors_path    : step7에서 만든 .safetensors 파일 경로
        tokenizer_dir       : step9에서 저장한 토크나이저 폴더 경로
        upload_folder_name  : 업로드 준비 파일들을 모아둘 폴더 이름
    """

    # 1. 업로드용 폴더 생성
    upload_dir = os.path.join(settings.model_dir, upload_folder_name)
    os.makedirs(upload_dir, exist_ok=True)
    print(f"업로드 폴더 생성: {upload_dir}")

    # 2. config.json 생성 및 저장
    config = make_config()
    config_path = os.path.join(upload_dir, "config.json")
    with open(config_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)
    print("config.json 생성 완료")

    # 3. safetensors 파일 복사
    shutil.copy(safetensors_path, os.path.join(upload_dir, "001.safetensors"))
    print("001.safetensors 복사 완료")

    # 4. 토크나이저 파일 전체 복사 (step9 저장 폴더 기준)
    for fname in os.listdir(tokenizer_dir):
        shutil.copy(
            os.path.join(tokenizer_dir, fname),
            os.path.join(upload_dir, fname)
        )
    print("토크나이저 파일 복사 완료")

    # 5. 최종 결과 확인
    print("-" * 30)
    print(f"준비된 파일 목록 (@ {upload_dir}):")
    for fname in os.listdir(upload_dir):
        print(f"  - {fname}")
    print("-" * 30)
    print("HuggingFace 업로드 준비 완료")