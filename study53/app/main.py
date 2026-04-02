from konlpy.tag import Okt

# Okt(Open Korean Text) 형태소 분석기 객체를 생성합니다.
# Twitter 형태소 분석기에서 파생되었으며 속도가 빠르고 사용이 간편합니다.
okt = Okt()

def build_wordIndex(token):
    """
    토큰 리스트를 입력받아 각 단어에 고유한 정수 인덱스를 부여하는 
    단어 사전(Word Index)을 생성하는 함수입니다.
    """
    wordIndex = {}
    for voca in token:
        # 단어가 아직 사전에 없다면, 현재 사전의 길이를 인덱스로 사용하여 추가합니다.
        # dict.keys()를 체크하여 중복된 단어가 중복 인덱스를 갖지 않도록 방어합니다.
        if voca not in wordIndex.keys():
            wordIndex[voca] = len(wordIndex)
    return wordIndex

def one_hot_encoding(word, word2index):
    """
    특정 단어를 원-핫 벡터(0과 1로 구성된 배열)로 변환하는 함수입니다.
    """
    # 1. 전체 단어 집합 크기(Vocabulary Size)만큼 0으로 가득 찬 리스트를 만듭니다.
    # 예: 단어가 6개면 [0, 0, 0, 0, 0, 0]
    one_hot_vector = [0] * (len(word2index))
    
    # 2. 사전(word2index)에서 해당 단어에 매핑된 숫자를 가져옵니다.
    index = word2index[word]
    
    # 3. 해당 숫자에 해당하는 위치(index)만 1로 바꿉니다. (One-hot 성질)
    one_hot_vector[index] = 1
    
    return one_hot_vector

def main():
    # 1. 형태소 분석 (Morphological Analysis)
    # "나는" -> "나"(대명사) + "는"(조사) 등으로 분리됩니다.
    content = "나는 자연어 처리를 배운다"
    token = okt.morphs(content)
    print(f"1. 토큰화 결과 : {token}")

    # 2. 단어 사전 구축 (Vocabulary Building)
    # 각 단어에 0, 1, 2... 순서대로 고유 번호를 부여합니다.
    wordIndex = build_wordIndex(token)
    print(f"2. 단어 사전(Index) : {wordIndex}")

    # 3. 개별 단어 인코딩 테스트
    # '자연어'가 사전에서 2번 인덱스라면 [0, 0, 1, 0, 0, 0]이 출력됩니다.
    target_word = "자연어"
    result = one_hot_encoding(target_word, wordIndex)
    print(f"3. '{target_word}'의 원-핫 벡터 : {result}")

    # 4. 전체 문장의 벡터화 (Sentence to Vector List)
    # 문장 전체를 숫자로 이루어진 행렬(Matrix) 형태로 변환하는 과정입니다.
    vectorList = []
    for voca in token:
        result = one_hot_encoding(voca, wordIndex)
        vectorList.append(result)
    
    print("4. 문장 전체 원-핫 벡터 리스트 :")
    for i, v in enumerate(vectorList):
        print(f"   {token[i]:<5} : {v}")

if __name__ == "__main__":
    main()