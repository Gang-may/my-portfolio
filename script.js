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
                observer.unobserve(entry.target); // Only animate once
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
                    ticks: {
                        display: false,
                        min: 0,
                        max: 100
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
});

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
