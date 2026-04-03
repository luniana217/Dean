# step11.py
# train_model.py의 커스텀 레이어 이름을 HuggingFace GPT-2 표준 이름으로 변환하는 스크립트

import os
import torch
from safetensors.torch import load_file, save_file
from settings import settings


def merge_qkv(weights):
    """
    HF GPT-2는 Q, K, V가 c_attn 하나로 합쳐진 형태
    transformer.h.N.att.W_query/W_key/W_value → transformer.h.N.attn.c_attn 으로 병합
    """
    new_weights = {}
    processed = set()

    for key in weights:
        if "att.W_query.weight" in key:
            # prefix 예: "transformer.h.0."
            prefix = key.replace("att.W_query.weight", "")

            q = weights[prefix + "att.W_query.weight"]
            k = weights[prefix + "att.W_key.weight"]
            v = weights[prefix + "att.W_value.weight"]

            # Q, K, V를 dim=0 방향으로 이어붙여 c_attn 하나로 합침
            merged_weight = torch.cat([q, k, v], dim=0)
            new_weights[prefix + "attn.c_attn.weight"] = merged_weight

            # bias가 있으면 동일하게 처리 (현재 QKV_BIAS=False라 없을 수 있음)
            if prefix + "att.W_query.bias" in weights:
                qb = weights[prefix + "att.W_query.bias"]
                kb = weights[prefix + "att.W_key.bias"]
                vb = weights[prefix + "att.W_value.bias"]
                new_weights[prefix + "attn.c_attn.bias"] = torch.cat([qb, kb, vb])

            # 처리 완료 키 등록 (중복 방지)
            processed.update([
                prefix + "att.W_query.weight", prefix + "att.W_key.weight", prefix + "att.W_value.weight",
                prefix + "att.W_query.bias",   prefix + "att.W_key.bias",   prefix + "att.W_value.bias"
            ])

        # mask는 학습 파라미터가 아니므로 제외
        elif "att.mask" in key:
            processed.add(key)

        # 이미 처리했거나 W_key/W_value 단독 키는 건너뜀
        elif key not in processed and "att.W_key" not in key and "att.W_value" not in key:
            new_weights[key] = weights[key]

    return new_weights


def convert_keys(src_path, dst_path):
    """
    train_model.py의 커스텀 레이어 이름을
    HuggingFace GPT-2 표준 이름으로 변환 후 저장
    """
    weights = load_file(src_path)
    new_weights = {}

    for key, value in weights.items():
        new_key = key

        # 토큰/위치 임베딩
        new_key = new_key.replace("tok_emb", "transformer.wte")
        new_key = new_key.replace("pos_emb", "transformer.wpe")

        # 트랜스포머 블록
        new_key = new_key.replace("trf_blocks", "transformer.h")

        # LayerNorm 이름 표준화 (att. 치환 전에 먼저 처리)
        new_key = new_key.replace(".norm1.", ".ln_1.")
        new_key = new_key.replace(".norm2.", ".ln_2.")

        # LayerNorm 파라미터 이름 표준화 (scale→weight, shift→bias)
        new_key = new_key.replace(".scale", ".weight")
        new_key = new_key.replace(".shift", ".bias")

        # 어텐션 out_proj
        new_key = new_key.replace("att.out_proj", "attn.c_proj")

        # 피드포워드 레이어
        new_key = new_key.replace("ff.layers.0", "mlp.c_fc")
        new_key = new_key.replace("ff.layers.2", "mlp.c_proj")

        # 최종 정규화 및 출력 헤드
        new_key = new_key.replace("final_norm", "transformer.ln_f")
        new_key = new_key.replace("out_head", "lm_head")

        if "transformer.wpe.weight" in new_key:
            value = value.T.contiguous()

        new_weights[new_key] = value
        print(f"{key:50s} → {new_key}")

    # Q, K, V를 c_attn 하나로 병합
    merged = merge_qkv(new_weights)

    save_file(merged, dst_path)
    print(f"\n변환 완료 → {dst_path}")


def run():
    """
    hf_upload 폴더의 001.safetensors를
    HuggingFace GPT-2 표준 키 이름으로 변환하여 model.safetensors로 저장
    """
    src = os.path.join(settings.model_dir, "hf_upload", "001.safetensors")
    dst = os.path.join(settings.model_dir, "hf_upload", "model.safetensors")
    convert_keys(src, dst)