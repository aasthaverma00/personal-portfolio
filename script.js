(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- NAV SCROLLSPY + HIGHLIGHT PILL ----------
    const navLinksWrap = document.getElementById('navLinks');
    const navHighlight = document.getElementById('navHighlight');
    const navAnchors = navLinksWrap.querySelectorAll('a');
    const navSections = ['about', 'projects', 'skills', 'certificates', 'contact'].map(id => document.getElementById(id));



    function moveHighlight(anchor) {
        if (!anchor) return;

        navHighlight.style.left = anchor.offsetLeft + 'px';
        navHighlight.style.width = anchor.offsetWidth + 'px';

        navAnchors.forEach(a => {
            a.classList.toggle('active', a === anchor);
        });
    }

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const match = [...navAnchors].find(a => a.dataset.target === entry.target.id);
                if (match) moveHighlight(match);
            }
        });
    }, { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' });
    navSections.forEach(s => spy.observe(s));

    navAnchors.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(a.dataset.target).scrollIntoView({ behavior: 'smooth' });
            moveHighlight(a);
        });
    });
    window.addEventListener('load', () => moveHighlight(navAnchors[0]));
    window.addEventListener('resize', () => {
        const active = [...navAnchors].find(a => a.classList.contains('active')) || navAnchors[0];
        moveHighlight(active);
    });

    // ---------- SCROLL REVEAL ----------
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));

    // ---------- SKILL RINGS ----------
    const RADIUS = 24;
    const CIRC = 2 * Math.PI * RADIUS;
    document.querySelectorAll('.ring-fill').forEach(ring => {
        ring.style.strokeDasharray = CIRC;
        ring.style.strokeDashoffset = CIRC;
    });
    const skillCards = document.querySelectorAll('.skill-card');
    const skillIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const pct = parseInt(card.dataset.pct, 10);
                const ring = card.querySelector('.ring-fill');
                const offset = CIRC - (pct / 100) * CIRC;
                requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
                skillIO.unobserve(card);
            }
        });
    }, { threshold: 0.5 });
    skillCards.forEach(c => skillIO.observe(c));

    // ---------- PROJECT CARD TILT ----------
    if (!reduced) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // ---------- CONTACT FORM + CONFETTI ----------
    const form = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');
    const confettiZone = document.getElementById('confettiZone');
    const confettiColors = ['#FF6B6A', '#FFC94A', '#3FC1C9', '#8C6FF0', '#FF8FB1'];

    function burstConfetti() {
        for (let i = 0; i < 26; i++) {
            const bit = document.createElement('div');
            bit.className = 'confetti-bit';
            bit.style.left = (45 + Math.random() * 10) + '%';
            bit.style.background = confettiColors[i % confettiColors.length];
            bit.style.transform = `rotate(${Math.random() * 360}deg)`;
            const dx = (Math.random() - 0.5) * 260;
            const dy = 120 + Math.random() * 140;
            bit.animate([
                { transform: bit.style.transform + ' translate(0,0)', opacity: 1 },
                { transform: `rotate(${Math.random() * 720}deg) translate(${dx}px, ${dy}px)`, opacity: 0 }
            ], { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
            confettiZone.appendChild(bit);
            setTimeout(() => bit.remove(), 1600);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        formResponse.textContent = 'Sending...';
        if (!reduced) burstConfetti();
        setTimeout(() => {
            formResponse.textContent = '✓ Message sent — thanks for reaching out!';
            form.reset();
        }, 700);
    });
})();
// =====================================================
// NEW INTERACTIVE ADDITIONS
// =====================================================
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- SCROLL PROGRESS BAR ----------
    const progressBar = document.getElementById('scrollProgress');
    function updateProgress() {
        const h = document.documentElement;
        const scrolled = h.scrollTop || document.body.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (scrolled / max) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // ---------- DARK MODE TOGGLE ----------
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('av-theme');
    if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('av-theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('av-theme', 'dark');
            }
        });
    }

    // ---------- TYPING EFFECT ----------
    const typedEl = document.getElementById('typedText');
    const roles = [
        'a creative coder',
        'a web developer',
        'a UI tinkerer',
        'a curious builder',
        'a problem solver'
    ];
    if (typedEl && !reduced) {
        let roleIdx = 0, charIdx = 0, deleting = false;
        function typeLoop() {
            const current = roles[roleIdx];
            if (!deleting) {
                charIdx++;
                typedEl.textContent = current.slice(0, charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, 1400);
                    return;
                }
            } else {
                charIdx--;
                typedEl.textContent = current.slice(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(typeLoop, deleting ? 35 : 65);
        }
        typeLoop();
    } else if (typedEl) {
        typedEl.textContent = roles[0];
    }

    // ---------- MOUSE PARALLAX ON HERO SHAPES ----------
    const heroSection = document.querySelector('.hero');
    const shapes = document.querySelectorAll('.hero .shape');
    if (heroSection && shapes.length && !reduced) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            shapes.forEach((shape, i) => {
                const depth = (i + 1) * 10;
                shape.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
        heroSection.addEventListener('mouseleave', () => {
            shapes.forEach(shape => { shape.style.transform = ''; });
        });
    }

    // ---------- MAGNETIC BUTTONS ----------
    if (!reduced) {
        document.querySelectorAll('.btn-solid, .btn-outline').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // ---------- ANIMATED STAT COUNTERS ----------
    const statNums = document.querySelectorAll('.stat-num');
    const statIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            if (isNaN(target)) { statIO.unobserve(el); return; }
            const suffix = el.dataset.suffix || '';
            if (reduced) {
                el.textContent = target + suffix;
            } else {
                const duration = 1200;
                const start = performance.now();
                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(eased * target) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }
            statIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => statIO.observe(el));

    // ---------- PROJECT MODAL ----------
    const projectData = {
        RandomPasswordGenrator: {
            title: 'Random Password Genrator',
            desc: 'A sleek and customizable password generator designed to create strong passwords quickly, with a clean interface and multiple useful options.',
            tags: ['HTML', 'CSS', 'JS'],
            features: [
                'Generate random passwords with customizable length and character options',
                'Password strength indicator with one-click copy functionality',
                'Light and dark mode for a personalized experience'
            ],
            demo: "https://aasthaverma00.github.io/Password-Generator-/",
            source: "https://github.com/aasthaverma00/Password-Generator-",
            gradient: 'linear-gradient(90deg,var(--grape),var(--coral))'
        },
        snakeGame: {
            title: 'Snake Game',
            desc: 'A classic Snake game built from scratch with HTML, CSS, and JavaScript, featuring score tracking, sound effects, and multiple controls',
            tags: ['HTML', 'CSS', 'JavaScript'],
            features: [
                'Score and best score tracking',
                'Sound effects with music toggle',
                'Keyboard, swipe, and on-screen controls'
            ],
            demo: "https://aasthaverma00.github.io/snake-game/",
            source: "https://github.com/aasthaverma00/snake-game",
            gradient: 'linear-gradient(90deg,var(--teal),var(--sun))'
        },
        quizGame: {
            title: 'Quiz Game',
            desc: 'An interactive quiz application built using HTML, CSS, and JavaScript, featuring multiple-choice questions and a simple, engaging interface.',
            tags: ['HTML', 'CSS', 'JavaScript'],
            features: [
                'Answer 15 multiple-choice quiz questions',
                'Track quiz progress as you move through questions',
                'View your final score after completing the quiz',
                'Restart the quiz and challenge yourself again'
            ],
            demo: "https://aasthaverma00.github.io/Quiz-game/",
            source: "https://github.com/aasthaverma00/Quiz-game",
            gradient: 'linear-gradient(90deg,var(--sun),var(--coral))'
        },
        safarnama: {
            title: 'Safarnama - Explore the World',
            desc: 'A beginner-friendly travel website built with HTML, CSS, and JavaScript, featuring popular destinations, travel search, booking options, and a responsive design. ✈️🌍',
            tags: ['HTML', 'CSS', 'Js'],
            features: [
                'Explore popular destinations with attractive travel cards',
                'Search and discover travel destinations easily',
                'View travel booking options and plan your next trip',
                'Browse a responsive design with smooth animations and engaging visuals'
            ],
            demo: "https://aasthaverma00.github.io/safarnama-travel-website/",
            source: "https://github.com/aasthaverma00/safarnama-travel-website",
            gradient: 'linear-gradient(90deg,var(--sun),var(--coral))'
        }
    };

    const modalBackdrop = document.getElementById('projModalBackdrop');
    const modalStrip = document.getElementById('projModalStrip');
    const modalTitle = document.getElementById('projModalTitle');
    const modalDesc = document.getElementById('projModalDesc');
    const modalTags = document.getElementById('projModalTags');
    const modalFeatures = document.getElementById('projModalFeatures');
    const modalLinks = document.getElementById('projModalLinks');
    const modalClose = document.getElementById('projModalClose');
    let lastFocused = null;

    function openModal(id) {
        const data = projectData[id];
        if (!data || !modalBackdrop) return;
        modalStrip.style.background = data.gradient;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalTags.innerHTML = data.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
        modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

        modalLinks.innerHTML = `${data.demo ? `<a href="${data.demo}" target="_blank" rel="noopener noreferrer">Live demo →</a>` : ''} 
        ${data.source ? `<a href="${data.source}" target="_blank" rel="noopener noreferrer">Source →</a>` : ''}
        `;

        lastFocused = document.activeElement;
        modalBackdrop.classList.add('open');
        modalClose.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.proj-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openModal(card.dataset.project);
        });
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
                e.preventDefault();
                openModal(card.dataset.project);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) closeModal();
    });

    // ---------- SKILL FACT BUBBLE ----------
    const skillBubble = document.getElementById('skillBubble');
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!skillBubble) return;
            const fact = card.dataset.fact;
            if (!fact) return;
            const rect = card.getBoundingClientRect();
            skillBubble.textContent = fact;
            skillBubble.style.left = Math.max(12, rect.left) + 'px';
            skillBubble.style.top = (rect.top - 10) + 'px';
            skillBubble.style.transform = 'translateY(-100%)';
            skillBubble.classList.add('show');
            e.stopPropagation();
        });
    });
    document.addEventListener('click', () => {
        if (skillBubble) skillBubble.classList.remove('show');
    });

    // ---------- BACK TO TOP ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    }
})();
