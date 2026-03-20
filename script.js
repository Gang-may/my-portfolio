document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    /* -------------------------------------
       1. Theme Toggle & Chart Sync
    ------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // 테마 변경 시 차트 색상도 즉시 업데이트
        updateChartTheme(window.personalityChartInstance, theme);
        updateChartTheme(window.cognitiveChartInstance, theme);
    };

    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);

        // GTM 트래킹
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'theme_toggle_click',
            'theme_state': newTheme 
        });
        console.log('[행동 추적] 테마 변경:', newTheme);
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
            if (window.scrollY >= (sectionTop - 150)) {
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
       3. Fade-in on Scroll
    ------------------------------------- */
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
            else entry.target.classList.remove('visible');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

    /* -------------------------------------
       4. Copy to Clipboard & Email Tracking
    ------------------------------------- */
    const emailLink = document.getElementById('email-link');
    const toast = document.getElementById('toast');

    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailLink.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
                
                // GTM 트래킹
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ 'event': 'email_copy_click' });
                console.log('[행동 추적] 이메일 복사됨');
            });
        });
    }

    /* -------------------------------------
       5. Accordion (Experience)
    ------------------------------------- */
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            document.querySelectorAll('.accordion-header').forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* -------------------------------------
       6. Interactive Charts (Chart.js)
    ------------------------------------- */
    const getChartOptions = (theme) => {
        const textColor = theme === 'dark' ? '#94a3b8' : '#475569';
        const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        return {
            responsive: true, maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: gridColor }, grid: { color: gridColor },
                    pointLabels: { color: textColor, font: { size: 12, weight: 600 } },
                    min: 20, max: 80, ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        };
    };

    const initialTheme = htmlElement.getAttribute('data-theme');
    
    // Personality Chart
    window.personalityChartInstance = new Chart(document.getElementById('personalityChart'), {
        type: 'radar',
        data: {
            labels: ['정직겸손성 45', '정서안정성 53', '외향성 73', '원만성 61', '성실성 71', '개방성 62'],
            datasets: [{
                data: [45, 53, 73, 61, 71, 62], backgroundColor: 'rgba(59, 130, 246, 0.4)', borderColor: '#3b82f6', borderWidth: 2
            }, {
                data: [55, 55, 55, 55, 55, 55], backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: '#94a3b8', borderWidth: 1, borderDash: [5, 5], pointRadius: 0
            }]
        },
        options: getChartOptions(initialTheme)
    });

    // Cognitive Chart
    window.cognitiveChartInstance = new Chart(document.getElementById('cognitiveChart'), {
        type: 'radar',
        data: {
            labels: ['언어 B (59)', '수리 B (70)', '추리 B (66)', '공간 B (59)'],
            datasets: [{
                data: [59, 70, 66, 59], backgroundColor: 'rgba(59, 130, 246, 0.4)', borderColor: '#3b82f6', borderWidth: 2
            }, {
                data: [50, 50, 50, 50], backgroundColor: 'rgba(148, 163, 184, 0.1)', borderColor: '#94a3b8', borderWidth: 1, pointRadius: 0
            }]
        },
        options: getChartOptions(initialTheme)
    });

    /* -------------------------------------
       7. Scroll to Top & Typing Effect
    ------------------------------------- */
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        window.scrollY > 300 ? scrollTopBtn.classList.add('show') : scrollTopBtn.classList.remove('show');
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const textToType = "황경민입니다.";
        let charIndex = 0;
        typingText.insertAdjacentHTML('afterend', '<span class="typing-cursor"></span>');
        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex++);
                setTimeout(type, 150);
            } else {
                setTimeout(() => document.querySelector('.typing-cursor').style.display = 'none', 3000);
            }
        }
        setTimeout(type, 800);
    }

    /* -------------------------------------
       8. Project Modals & Project Click Tracking
    ------------------------------------- */
    const modalContainer = document.getElementById('modal-container');
    const modalData = { /* ... 데이터 생략 (기존 데이터 유지) ... */ };

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const projectName = card.querySelector('h4').innerText;

            // GTM 트래킹
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'event': 'project_card_click', 'project_name': projectName });
            console.log(`[행동 추적] 프로젝트 클릭: ${projectName}`);

            if (modalId) openModal(modalId);
        });
    });

    function openModal(modalId) {
        const data = modalData[modalId];
        if (!data) return;
        modalContainer.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="modalCloseBtn"><i class="fas fa-times"></i></button>
                <div class="modal-header"><h3 class="modal-title">${data.title}</h3></div>
                <div class="modal-body"><p>${data.content}</p></div>
                <div class="modal-footer">
                    <a href="${data.link}" target="_blank" class="btn btn-primary notion-btn">
                        노션에서 자세히 보기 <i class="fas fa-external-link-alt ml-2"></i>
                    </a>
                </div>
            </div>`;
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('modalCloseBtn').onclick = closeModal;
    }

    function closeModal() {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* -------------------------------------
       9. Notion Time Tracking
    ------------------------------------- */
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('a[href*="notion.site"], a[href*="notion.so"]');
        if (btn) {
            const card = btn.closest('.project-card') || btn.closest('.modal-content');
            const projectName = card?.querySelector('h4, h3')?.innerText.trim() || '알 수 없는 프로젝트';
            
            localStorage.setItem('notion_departure_time', Date.now());
            localStorage.setItem('notion_project_name', projectName);

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'event': 'notion_button_click', 'project_name': projectName });
            console.log(`[행동 추적] 노션으로 떠남: ${projectName}`);
        }
    });

    window.checkReturnFromNotion = () => {
        const depTime = localStorage.getItem('notion_departure_time');
        const projName = localStorage.getItem('notion_project_name');
        if (depTime && projName) {
            const timeSpent = Math.floor((Date.now() - parseInt(depTime)) / 1000);
            if (timeSpent >= 1) {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'return_from_notion',
                    'project_name': projName,
                    'time_spent_seconds': timeSpent
                });
                console.log(`[행동 추적] 노션 복귀: ${projName} (${timeSpent}초)`);
            }
            localStorage.removeItem('notion_departure_time');
            localStorage.removeItem('notion_project_name');
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') window.checkReturnFromNotion();
    });

    /* -------------------------------------
       10. Company Tracking
    ------------------------------------- */
    const companyName = new URLSearchParams(window.location.search).get('c');
    if (companyName) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': 'company_visit', 'visitor_company': companyName });
        console.log(`[행동 추적] 회사 방문: ${companyName}`);
    }
});

/* --- Global Helpers --- */
function updateChartTheme(chart, theme) {
    if (!chart) return;
    const textColor = theme === 'dark' ? '#94a3b8' : '#475569';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    chart.options.scales.r.angleLines.color = gridColor;
    chart.options.scales.r.grid.color = gridColor;
    chart.options.scales.r.pointLabels.color = textColor;
    chart.update();
}
