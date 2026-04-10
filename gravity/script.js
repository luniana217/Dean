const artists = [
    {
        name: "신중현 (Shin Jung-hyeon)",
        category: "legend",
        description: "'한국 록의 대부'. 1960년대부터 사이키델릭 록과 소울을 한국 정서에 맞게 풀어내며 한국 록의 기틀을 마련했습니다.",
        hits: ["미인", "아름다운 강산", "님아"],
        detailed: "신중현은 한국 음악 역사상 가장 영향력 있는 인물 중 하나입니다. '신중현과 엽전들'을 통해 발표한 '미인'은 당시 한국에 엄청난 충격을 주었으며, 그가 작곡한 '아름다운 강산'은 시대를 초월한 명곡으로 평가받습니다."
    },
    {
        name: "산울림 (Sanulrim)",
        category: "legend",
        description: "김창완, 김창훈, 김창익 형제 밴드. 파격적인 가사와 실험적인 사운드로 독보적인 음악 세계를 구축했습니다.",
        hits: ["아니 벌써", "내 마음에 주단을 깔고", "청춘"],
        detailed: "1977년 데뷔한 산울림은 아마추어리즘이 주는 신선함과 천재적인 멜로디 감각으로 한국 록의 지평을 넓혔습니다. 특히 '내 마음에 주단을 깔고'에서의 베이스 라인은 지금 들어도 매우 세련된 감각을 자랑합니다."
    },
    {
        name: "들국화 (Deulgukhwa)",
        category: "legend",
        description: "1980년대 언더그라운드 음악의 제왕. 전인권의 폭발적인 보컬과 깊이 있는 가사로 세대의 울림을 전했습니다.",
        hits: ["행진", "그것만이 내 세상", "매일 그대와"],
        detailed: "들국화 1집은 한국 대중음악 역사상 최고의 명반으로 꼽힙니다. 복고풍의 포크와 강력한 록 사운드를 결합하여 주류 음악계에 커다란 균열을 일으켰습니다."
    },
    {
        name: "시나위 (Sinawe)",
        category: "metal",
        description: "한국 헤비메탈의 효시. 신대철을 중심으로 임재범, 서태지, 김종서 등 수많은 스타들을 배출한 '사관학교'이기도 합니다.",
        hits: ["크게 라디오를 켜고", "겨울비", "서커스"],
        detailed: "1986년 한국 최초의 헤비메탈 앨범을 발표하며 본격적인 메탈 시대를 열었습니다. 리더 신대철의 기타 테크닉은 한국 록 기타의 전범이 되었습니다."
    },
    {
        name: "YB (윤도현 밴드)",
        category: "modern",
        description: "가장 대중적인 한국 록 밴드. 월드컵 응원가부터 서정적인 발라드까지 록의 대중화를 이끌었습니다.",
        hits: ["너를 보내고", "잊을게", "나는 나비"],
        detailed: "윤도현의 파워풀하고 정직한 보컬을 바탕으로, 사회적 메시지와 대중적인 멜로디를 완벽하게 조화시킨 팀입니다. 전국 순회 공연을 통해 '공연의 제왕'으로 불립니다."
    },
    {
        name: "국카스텐 (Guckkasten)",
        category: "modern",
        description: "하현우의 압도적 보컬과 사이키델릭한 사운드. 현대 한국 록 밴드 중 가장 강력한 기술적 기량을 보유한 팀입니다.",
        hits: ["거울", "싱크홀", "붉은 밭"],
        detailed: "밴드명은 독일어로 '들여다보는 함(요술상자)'을 뜻합니다. 만화경 같은 환상적이고 난해하면서도 강렬한 사운드가 특징입니다. 보컬 하현우는 '복면가왕' 등에서 압도적 인지도를 쌓기도 했습니다."
    },
    {
        name: "자우림 (Jaurim)",
        category: "modern",
        description: "김윤아의 독보적인 아우라. 청춘의 아픔, 사회의 어두운 면, 환상적인 상상을 록으로 담아내는 밴드입니다.",
        hits: ["매직 카펫 라이드", "스물다섯, 스물하나", "하하하송"],
        detailed: "1997년 데뷔 이후 단 한 번의 멤버 교체 없이 활동해온 한국의 대표적인 혼성 밴드입니다. 얼터너티브 록을 기반으로 다양한 장르를 섭렵합니다."
    },
    {
        name: "크라잉넛 (Crying Nut)",
        category: "punk",
        description: "조선 펑크(Chosun Punk)의 창시자. 홍대 인디 문화의 상징과도 같은 밴드입니다.",
        hits: ["말달리자", "서커스 매직 유랑단", "명동콜링"],
        detailed: "1990년대 중반 홍대 '드럭'을 중심으로 한국 인디 씬을 폭발시킨 주역입니다. '말달리자'는 세대를 초월한 스트레스 해소곡으로 사랑받고 있습니다."
    },
    {
        name: "부활 (Boohwal)",
        category: "legend",
        description: "김태원을 중심으로 한 대한민국 대표 록 밴드. 서정적인 록 발라드로 대중적인 사랑을 받았습니다.",
        hits: ["희야", "네버 엔딩 스토리", "비와 당신의 이야기"],
        detailed: "1985년 결성된 부활은 김태원의 서정적인 작곡과 이승철, 박완규, 정동하 등 당대 최고의 보컬리스트들을 배출하며 한국 록 역사에 큰 족적을 남겼습니다."
    },
    {
        name: "N.EX.T (넥스트)",
        category: "metal",
        description: "고 신해철이 이끈 프로그레시브/헤비메탈 밴드. 철학적인 가사와 웅장한 사운드가 특징입니다.",
        hits: ["Lazenca, Save Us", "해에게서 소년에게", "도시인"],
        detailed: "넥스트는 압도적인 연주력과 신해철의 천재적인 프로듀싱이 결합된 밴드입니다. 사회 비판적인 메시지와 함께 사이버펑크적인 요소, 국악과의 크로스오버 등을 시도하며 다양한 실험을 전개했습니다."
    },
    {
        name: "노브레인 (No Brain)",
        category: "punk",
        description: "크라잉넛과 함께 한국 펑크 록을 양분하는 밴드. 거침없는 에너지와 유쾌한 무대 매너로 유명합니다.",
        hits: ["넌 내게 반했어", "비와 당신", "바다 사나이"],
        detailed: "1996년 결성되어 하드코어 펑크부터 팝 펑크까지 다양한 스펙트럼을 보여주었습니다. '넌 내게 반했어'는 국민적인 히트곡으로 펑크 록의 인지도를 크게 높였습니다."
    },
    {
        name: "넬 (NELL)",
        category: "modern",
        description: "한국 모던 록, 감성 록의 대표주자. 김종완의 독보적인 음색과 몽환적인 사운드가 일품입니다.",
        hits: ["기억을 걷는 시간", "Stay", "마음을 잃다"],
        detailed: "1999년 결성 이후 특유의 우울하고 몽환적인 색채로 두터운 팬층을 확보했습니다. 치밀한 사운드 디자인과 서정적인 가사로 새로운 지평을 열었습니다."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('artist-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('artist-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    // Render Artist Cards
    function renderArtists(filter = 'all') {
        grid.innerHTML = '';
        const filtered = filter === 'all' ? artists : artists.filter(a => a.category === filter);

        filtered.forEach(artist => {
            const card = document.createElement('div');
            card.className = 'artist-card';
            card.innerHTML = `
                <div class="tag">${artist.category}</div>
                <h3>${artist.name}</h3>
                <p>${artist.description}</p>
            `;
            card.addEventListener('click', () => openModal(artist));
            grid.appendChild(card);
        });
    }

    // Modal Control
    function openModal(artist) {
        modalBody.innerHTML = `
            <h2 style="color: var(--accent-orange); margin-bottom: 1rem;">${artist.name}</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 2rem;">
                <span class="tag">${artist.category}</span>
            </div>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">${artist.detailed}</p>
            <h4 style="margin-bottom: 1rem; color: var(--accent-blue);">대표곡 (Hits)</h4>
            <ul style="list-style: none;">
                ${artist.hits.map(song => `<li style="margin-bottom: 0.5rem;"><i class="fas fa-play-circle" style="margin-right: 10px; color: var(--accent-orange);"></i> ${song}</li>`).join('')}
            </ul>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderArtists(btn.dataset.filter);
        });
    });

    // AI Chat Bridge (Concept)
    const chatBtn = document.getElementById('ai-chat-btn');
    chatBtn.addEventListener('click', () => {
        alert('Ollama 연동 기능은 현재 개발 중입니다.\n\n백엔드 서버(Node.js)를 통해 Ollama API와 통신하여 실시간 가이드 기능을 추가할 수 있습니다.');
    });

    // Initial Render
    renderArtists();
});
