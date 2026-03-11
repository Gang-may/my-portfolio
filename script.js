document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------
       1. Theme Toggle (Dark/Light)
    ------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check Local Storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Option: Check system preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        htmlElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }

    // Toggle Function
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* -------------------------------------
       2. Scrollspy & Sticky Navbar
    ------------------------------------- */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjustment for nav height
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* -------------------------------------
       3. Fade-in on Scroll (Intersection Observer)
    ------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove the class when it leaves the viewport to create a fade-out effect
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    /* -------------------------------------
       4. Copy to Clipboard & Toast
    ------------------------------------- */
    const emailLink = document.getElementById('email-link');
    const toast = document.getElementById('toast');

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = emailLink.getAttribute('data-email');
        
        navigator.clipboard.writeText(email).then(() => {
            // Show Toast
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); // hide after 3 seconds
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });

    /* -------------------------------------
       5. Accordion (Experience Section)
    ------------------------------------- */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            // Close all first (if you want only one open at a time)
            accordionHeaders.forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* -------------------------------------
       6. Interactive Charts (Chart.js)
    ------------------------------------- */
    const initialTheme = htmlElement.getAttribute('data-theme');
    
    // Shared Chart Options
    const getChartOptions = (theme) => {
        const textColor = theme === 'dark' ? '#94a3b8' : '#475569';
        const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: gridColor },
                    grid: { color: gridColor },
                    pointLabels: {
                        color: textColor,
                        font: { family: "'Inter', 'Pretendard Variable', sans-serif", size: 12, weight: 600 }
                    },
                    min: 20,
                    max: 80,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) { return context.raw + '점'; }
                    }
                }
            }
        };
    };

    // 1. Personality Chart
    const ctxPersonality = document.getElementById('personalityChart').getContext('2d');
    const dataPersonality = {
        labels: ['정직겸손성 45', '정서안정성 53', '외향성 73', '원만성 61', '성실성 71', '개방성 62'],
        datasets: [{
            label: '응시자',
            data: [45, 53, 73, 61, 71, 62],
            backgroundColor: 'rgba(59, 130, 246, 0.4)', // Blue fill
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
        }, {
            label: '평균',
            data: [55, 55, 55, 55, 55, 55],
            backgroundColor: 'rgba(148, 163, 184, 0.1)', // Gray fill
            borderColor: '#94a3b8',
            borderWidth: 1,
            borderDash: [5, 5],
            pointBackgroundColor: '#94a3b8',
            pointRadius: 0
        }]
    };
    
    window.personalityChartInstance = new Chart(ctxPersonality, {
        type: 'radar',
        data: dataPersonality,
        options: getChartOptions(initialTheme)
    });

    // 2. Cognitive Chart
    const ctxCognitive = document.getElementById('cognitiveChart').getContext('2d');
    const dataCognitive = {
        labels: ['언어 B (59)', '수리 B (70)', '추리 B (66)', '공간 B (59)'],
        datasets: [{
            label: '점수',
            data: [59, 70, 66, 59],
            backgroundColor: 'rgba(59, 130, 246, 0.4)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
        }, {
            label: '평균/기준',
            data: [50, 50, 50, 50], // Placeholder inner shape
            backgroundColor: 'rgba(148, 163, 184, 0.1)',
            borderColor: '#94a3b8',
            borderWidth: 1,
            pointRadius: 0
        }]
    };

    window.cognitiveChartInstance = new Chart(ctxCognitive, {
        type: 'radar',
        data: dataCognitive,
        options: getChartOptions(initialTheme)
    });

    /* -------------------------------------
       7. Scroll to Top Button
    ------------------------------------- */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* -------------------------------------
       8. Typing Effect for Hero Title
    ------------------------------------- */
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const textToType = "황경민입니다.";
        const typingSpeed = 150; // ms per char
        let charIndex = 0;

        // Add cursor after span
        typingText.insertAdjacentHTML('afterend', '<span class="typing-cursor"></span>');

        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                // Done typing, maybe remove cursor or keep blinking
                setTimeout(() => {
                    document.querySelector('.typing-cursor').style.display = 'none';
                }, 3000);
            }
        }

        // Delay start slightly
        setTimeout(type, 800);
    }

    /* -------------------------------------
       9. Project Modals
    ------------------------------------- */
    const modalContainer = document.getElementById('modal-container');
    const projectCards = document.querySelectorAll('.project-card[data-modal]');

    // Modal data dictionary
    const modalData = {
        'modal-1': {
            title: "'휴먼노이드' 뉴스기사 크롤링 프로젝트",
            skills: "Python, BeautifulSoup, Pandas",
            content: "특정 키워드(휴먼노이드)와 관련된 뉴스 기사를 자동으로 수집(Crawling)하여 엑셀 파일로 저장하고, 주요 키워드의 빈도를 분석하는 프로젝트입니다.<br><br><strong>배운 점:</strong> 웹 구조(HTML/DOM)의 이해 및 동적 페이지에서의 데이터 추출 한계점 인식.",
            link: "https://lilac-abacus-fc4.notion.site/30c687ae97ff802087b0cfcbc90c392c"
        },
        'modal-2': {
            title: "군수품 입찰 현황 대시보드",
            skills: "Tableau, SQL, Excel",
            content: "방위사업청의 공공데이터를 활용하여 군수품 입찰 현황을 시각화한 대시보드입니다. 지역별, 품목별 입찰 현황을 한눈에 파악할 수 있도록 구성했습니다.<br><br><strong>배운 점:</strong> 대용량 데이터의 정제 과정과 사용자 친화적인 대시보드 UI/UX 설계 및 시각적 전달력 강화 방법.",
            link: "https://lilac-abacus-fc4.notion.site/30c687ae97ff80de9548e0afeba65302"
        },
        'modal-3': {
            title: "2025년 데이터 문제해결은행 활용 경진대회",
            skills: "Python, Scikit-learn, 데이터 전처리",
            content: "주어진 기업 현장 데이터를 분석하여 문제 해결 모델을 개발하는 경진대회 참가작입니다. 불균형 데이터셋에 대한 처리와 예측 모델 성능 개선에 집중했습니다.<br><br><strong>배운 점:</strong> 실무 데이터가 가진 다양한 결측치와 이상치를 다루는 방법 및 머신러닝 교차검증(Cross Validation)의 중요성.",
            link: "https://lilac-abacus-fc4.notion.site/2025-30c687ae97ff8099bb69fae2dd141423"
        },
        'modal-4': {
            title: "제주관광공사 데이터 활용 공모전",
            skills: "Python, 지리정보시스템(GIS), 통계분석",
            content: "제주도의 관광 데이터(유동인구, 소비, 날씨 등)를 결합하여 제주 관광객의 동선 및 소비 패턴을 분석하고 인사이트를 도출한 공모전 출품작입니다.<br><br><strong>배운 점:</strong> 서로 다른 성격의 데이터셋을 병합하는 기술과 지리적(공간적) 데이터 분석 및 시각화 역량 향상.",
            link: "https://lilac-abacus-fc4.notion.site/30c687ae97ff80f9960aec014014aa83"
        },
        'modal-5': {
            title: "AI & GIS 전술 기반 전술적 교전 및 실시간 지원 시스템",
            skills: "Python, AI Model 추론 시스템, GIS API",
            content: "전장 환경의 실시간 지리정보(GIS)와 AI 분석을 결합하여, 지휘관이 신속하고 정확한 전술적 의사결정을 내릴 수 있도록 돕는 시뮬레이션 및 의사결정 지원 시스템 기획/개발 프로젝트입니다.<br><br><strong>배운 점:</strong> AI 추론 결과를 지도 위에 실시간으로 매핑하는 기술력과 복잡한 센서/데이터 인터랙션을 설계하는 방법론.",
            link: "https://lilac-abacus-fc4.notion.site/AI-GIS-30c687ae97ff8061a253c78e4a19551f"
        },
        'modal-6': {
            title: "마케팅 전략 사례 <BAE JUICE>",
            skills: "시장조사, 마케팅 프레임워크(STP, 4P)",
            content: "해외(호주)에서 한국산 배(Bae) 음료를 숙취 해소 음료로 브랜딩하여 성공한 'Bae Juice' 사례를 심층 분석하고 시사점을 도출한 리포트입니다.<br><br><strong>배운 점:</strong> 현지 문화적 특성을 고려한 포지셔닝(Positioning) 전략의 중요성과 스토리텔링 마케팅의 위력.",
            link: "https://lilac-abacus-fc4.notion.site/BAE-JUICE-30c687ae97ff80daa73ed99b8227ad3f"
        },
        'modal-7': {
            title: "무인점포 시장 확대 방안",
            skills: "트렌드 분석, 소비자 행동 분석",
            content: "인건비 상승과 언택트 트렌드로 부상한 무인점포 시장의 현황 및 문제점(도난, 기술 소외 계층 등)을 분석하고, 이를 극복하기 위한 장기적 확산 전략을 제안했습니다.<br><br><strong>배운 점:</strong> 사회 변화에 따른 리테일 비즈니스의 구조적 변화 이해 및 한계점에 대한 창의적 타개책 마련.",
            link: "https://lilac-abacus-fc4.notion.site/30c687ae97ff80bfa7cfc09d7acc0f17"
        },
        'modal-8': {
            title: "부영-사랑으로 부영 리브랜딩",
            skills: "브랜드 아이덴티티, 포지셔닝 전략",
            content: "기존의 낙후되거나 특정 이미지에 고착화된 아파트 브랜드 '사랑으로 부영'의 문제점을 진단하고, 핵심 가치를 재정의하여 타겟 고객층에 소구하는 새로운 브랜드 아이덴티티와 커뮤니케이션 전략 모델을 수립한 기획서입니다.<br><br><strong>배운 점:</strong> 브랜드 진단 프로세스와 기존 자산(Brand Equity)을 활용하면서도 새로운 이미지를 부여하는 리브랜딩 프로세스.",
            link: "https://lilac-abacus-fc4.notion.site/30c687ae97ff80cbb6e6cfa566d8c215"
        },
        'modal-9': {
            title: "Notion 광고",
            skills: "콘텐츠 기획, 카피라이팅, 미디어 믹스",
            content: "생산성 툴 'Notion(노션)'을 아직 적극적으로 사용하지 않는 대학생 및 주니어 직장인을 타겟으로, 그들의 페인포인트(Pain-point)를 자극하고 솔루션을 제시하는 디지털 광고 캠페인 소재와 집행 전략을 기획했습니다.<br><br><strong>배운 점:</strong> 타겟 세분화에 따른 맞춤형 메시지(광고 카피) 도출 방법론과 효과적인 미디어 매체 선정 기준.",
            link: "https://lilac-abacus-fc4.notion.site/Notion-30c687ae97ff80e8bd0ce18b2d6af8d6"
        }
    };

    function openModal(modalId) {
        const data = modalData[modalId];
        if (!data) return;

        const modalHtml = `
            <div class="modal-content">
                <button class="modal-close" id="modalCloseBtn"><i class="fas fa-times"></i></button>
                <div class="modal-header">
                    <h3 class="modal-title">${data.title}</h3>
                </div>
                <div class="modal-body">
                    <p><strong><i class="fas fa-tools"></i> 기술 스택/역량:</strong> ${data.skills}</p>
                    <hr style="margin: 15px 0; border: 0; border-top: 1px solid var(--border-color);">
                    <p>${data.content}</p>
                </div>
                <div class="modal-footer">
                    <a href="${data.link}" target="_blank" class="btn btn-primary">
                        노션에서 자세히 보기 <i class="fas fa-external-link-alt ml-2"></i>
                    </a>
                </div>
            </div>
        `;

        modalContainer.innerHTML = modalHtml;
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        const closeBtn = document.getElementById('modalCloseBtn');
        closeBtn.addEventListener('click', closeModal);
    }

    function closeModal() {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalContainer.innerHTML = ''; // Clean up after transition
        }, 300);
    }

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Close modal when clicking entirely outside the content box
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });
});

/* -------------------------------------
   7. Interactive Background Star Field
------------------------------------- */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];
const numStars = 100; // Adjust for density
let mouse = { x: null, y: null };

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Star size
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 5;
    }
    
    draw() {
        const theme = document.documentElement.getAttribute('data-theme');
        // Dark theme: white stars, Light theme: dark blue/grey stars
        ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    update() {
        // Mouse interaction (pull effect)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 250; // Radius of attraction
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < maxDistance) {
                // Pulling towards the mouse cursor
                this.x += directionX * 0.8;
                this.y += directionY * 0.8;
            } else {
                // Return to original position if mouse is far
                if (this.x !== this.baseX) {
                    let dxObj = this.x - this.baseX;
                    this.x -= dxObj / 20;
                }
                if (this.y !== this.baseY) {
                    let dyObj = this.y - this.baseY;
                    this.y -= dyObj / 20;
                }
            }
        } else {
            // Return slowly if no mouse
            if (this.x !== this.baseX) {
                let dxObj = this.x - this.baseX;
                this.x -= dxObj / 40;
            }
            if (this.y !== this.baseY) {
                let dyObj = this.y - this.baseY;
                this.y -= dyObj / 40;
            }
        }
        this.draw();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    connectStars();
    requestAnimationFrame(animateStars);
}

// Draw constellation lines
function connectStars() {
    let maxDistance = 120;
    for (let a = 0; a < stars.length; a++) {
        for (let b = a; b < stars.length; b++) {
            let dx = stars[a].x - stars[b].x;
            let dy = stars[a].y - stars[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                let opacity = 1 - (distance / maxDistance);
                let theme = document.documentElement.getAttribute('data-theme');
                // Adjust line colors for light/dark mode
                ctx.strokeStyle = theme === 'dark' ? `rgba(255, 255, 255, ${opacity * 0.3})` : `rgba(15, 23, 42, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(stars[a].x, stars[a].y);
                ctx.lineTo(stars[b].x, stars[b].y);
                ctx.stroke();
            }
        }
    }
}

// Track mouse position
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY; // Adjust if canvas scrolls with page?
    // Note: Since canvas is position: fixed, we only need clientX/Y
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Reset mouse position when leaving window or scrolling out
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

initStars();
animateStars();

// Helper function to update Chart Colors when Theme changes
function updateChartTheme(chart, theme) {
    if(!chart) return;
    const textColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    chart.options.scales.r.angleLines.color = gridColor;
    chart.options.scales.r.grid.color = gridColor;
    chart.options.scales.r.pointLabels.color = textColor;
    
    chart.update();
}

