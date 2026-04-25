// ===== Device Detection =====
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth <= 768
    || ('ontouchstart' in window);

// ===== Font Awesome Icon Fallback =====
(function checkIcons() {
    const testEl = document.createElement('i');
    testEl.className = 'fas fa-check';
    testEl.style.cssText = 'position:absolute;visibility:hidden;font-size:20px';
    document.body.appendChild(testEl);
    setTimeout(() => {
        const computed = window.getComputedStyle(testEl, ':before').content;
        document.body.removeChild(testEl);
        if (!computed || computed === 'none' || computed === '') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css';
            document.head.appendChild(link);
        }
    }, 1000);
})();

// Background is now pure CSS aurora — no JS particles needed

// ===== Typing Animation — Full Name =====
(function typeWriter() {
    const el = document.getElementById('typingName');
    const fullName = 'Muhammad Hasham Arshad';
    let i = 0;

    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    el.appendChild(cursor);

    function type() {
        if (i < fullName.length) {
            el.insertBefore(document.createTextNode(fullName.charAt(i)), cursor);
            i++;
            // Vary speed for a natural feel — slower on spaces
            const delay = fullName.charAt(i - 1) === ' ' ? 220 : Math.random() * 60 + 70;
            setTimeout(type, delay);
        } else {
            // Blink cursor for 3s then fade it
            setTimeout(() => {
                cursor.style.transition = 'opacity 0.5s';
                cursor.style.opacity = '0';
            }, 3000);
        }
    }
    setTimeout(type, 1200);
})();

// ===== Sticky Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
});
navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinksEl.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    });
}, { passive: true });

// ===== Enhanced Scroll Animations with Staggered Delays =====
const aosElements = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            aosObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
aosElements.forEach(el => aosObserver.observe(el));

// ===== Skill Bar Animation =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.setProperty('--target-width', entry.target.dataset.width + '%');
                entry.target.classList.add('animate');
            }, idx * 80);
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObserver.observe(el));

// ===== Counter Animation with Easing =====
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const duration = 1800;
            const startTime = performance.now();

            function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                el.textContent = Math.round(easeOutQuart(progress) * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ===== Project Filtering with Smooth Animation =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        let visibleIndex = 0;

        projectCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            if (!match) {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9) translateY(20px)';
                setTimeout(() => card.classList.add('hidden'), 300);
            } else {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(30px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, 50 + visibleIndex * 80);
                visibleIndex++;
            }
        });
    });
});

// ===== Card Tilt Effect — desktop only =====
if (!isMobile) {
    document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -5;
            const rotY = ((x - cx) / cx) * 5;
            card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        });
    });
}

// ===== Magnetic Buttons — desktop only =====
if (!isMobile) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-2px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ===== Ripple Effect on Buttons =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        ripple.style.cssText = `
            left:${e.clientX - rect.left}px;
            top:${e.clientY - rect.top}px;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ===== Contact Form with Shake on Empty =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            this.reset();
        }, 3000);
    }, 1200);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== Cursor glow — desktop only =====
if (!isMobile) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        requestAnimationFrame(animateGlow);
    })();
}
