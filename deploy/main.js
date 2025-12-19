// Odyxy Showcase Website - Main JavaScript
// Handles all interactive elements, animations, and dynamic features

// Global variables
let neuralNetwork;
let particles = [];
let canvas;

// Helper to run init whether DOMContentLoaded already fired or not
function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
}

onReady(function() {
    initializeAnimations();
    initializeScrollReveal();
    initializeNavigation();
    initializePrivacyChart();
    if (typeof p5 !== 'undefined') {
        initializeParticleSystem();
    }
    initializeHoverEffects();
    initializeMobileMenu();
});

// Initialize reveal animations
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Initialize main animations
function initializeAnimations() {
    // Animate hero text on load
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.reveal-element',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(200)
    });
    
    // Animate feature cards
    anime({
        targets: '.feature-card',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(100, {start: 500}),
        duration: 800,
        easing: 'easeOutQuart'
    });
}

// Initialize smooth navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize privacy comparison chart
function initializePrivacyChart() {
    const chartContainer = document.getElementById('privacy-comparison');
    if (!chartContainer) return;
    
    const chart = echarts.init(chartContainer);
    
    const option = {
        backgroundColor: 'transparent',
        title: {
            text: 'Data Flow Comparison',
            textStyle: {
                color: '#FFFFFF',
                fontSize: 18,
                fontWeight: 'bold'
            },
            left: 'center',
            top: 20
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: '#2DD4BF',
            textStyle: {
                color: '#FFFFFF'
            }
        },
        legend: {
            orient: 'horizontal',
            bottom: 20,
            textStyle: {
                color: '#94A3B8'
            }
        },
        series: [
            {
                name: 'Traditional Apps',
                type: 'sankey',
                left: 50,
                top: 80,
                right: 50,
                bottom: 80,
                data: [
                    { name: 'Your Device', itemStyle: { color: '#2DD4BF' } },
                    { name: 'Cloud Servers', itemStyle: { color: '#EF4444' } },
                    { name: 'Advertisers', itemStyle: { color: '#F59E0B' } },
                    { name: 'Third Parties', itemStyle: { color: '#8B5CF6' } },
                    { name: 'Analytics', itemStyle: { color: '#6B7280' } }
                ],
                links: [
                    { source: 'Your Device', target: 'Cloud Servers', value: 100 },
                    { source: 'Cloud Servers', target: 'Advertisers', value: 40 },
                    { source: 'Cloud Servers', target: 'Third Parties', value: 30 },
                    { source: 'Cloud Servers', target: 'Analytics', value: 30 }
                ],
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#FFFFFF'
                },
                label: {
                    color: '#FFFFFF',
                    fontSize: 12
                }
            },
            {
                name: 'Odyxy',
                type: 'sankey',
                left: 50,
                top: 80,
                right: 50,
                bottom: 80,
                data: [
                    { name: 'Your Device', itemStyle: { color: '#10B981' } },
                    { name: 'Local AI', itemStyle: { color: '#2DD4BF' } },
                    { name: 'Encrypted Messages', itemStyle: { color: '#10B981' } }
                ],
                links: [
                    { source: 'Your Device', target: 'Local AI', value: 100 },
                    { source: 'Your Device', target: 'Encrypted Messages', value: 50 }
                ],
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                itemStyle: {
                    borderWidth: 1,
                    borderColor: '#FFFFFF'
                },
                label: {
                    color: '#FFFFFF',
                    fontSize: 12
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // Add animation to show data flow
    setTimeout(() => {
        chart.setOption({
            series: [
                {
                    data: option.series[0].data,
                    links: option.series[0].links,
                    animationDuration: 2000,
                    animationEasing: 'cubicOut'
                },
                {
                    data: option.series[1].data,
                    links: option.series[1].links,
                    animationDuration: 2000,
                    animationEasing: 'cubicOut'
                }
            ]
        });
    }, 500);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// Initialize p5.js neural network background
function initializeParticleSystem() {
    new p5((p) => {
        let nodes = [];
        let connections = [];
        let mouseInfluence = 100;
        
        p.setup = function() {
            canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.id('p5-canvas');
            canvas.position(0, 0);
            canvas.style('z-index', '-1');
            canvas.style('position', 'fixed');
            
            // Create nodes
            for (let i = 0; i < 50; i++) {
                nodes.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    alpha: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw nodes
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                
                // Wrap around edges
                if (node.x < 0) node.x = p.width;
                if (node.x > p.width) node.x = 0;
                if (node.y < 0) node.y = p.height;
                if (node.y > p.height) node.y = 0;
                
                // Mouse influence
                let mouseDistance = p.dist(p.mouseX, p.mouseY, node.x, node.y);
                if (mouseDistance < mouseInfluence) {
                    let force = (mouseInfluence - mouseDistance) / mouseInfluence;
                    let angle = p.atan2(node.y - p.mouseY, node.x - p.mouseX);
                    node.vx += p.cos(angle) * force * 0.01;
                    node.vy += p.sin(angle) * force * 0.01;
                }
                
                // Apply damping
                node.vx *= 0.99;
                node.vy *= 0.99;
                
                // Draw node
                p.fill(45, 212, 191, node.alpha * 255);
                p.noStroke();
                p.ellipse(node.x, node.y, node.size);
                
                // Draw connections
                for (let j = i + 1; j < nodes.length; j++) {
                    let other = nodes[j];
                    let distance = p.dist(node.x, node.y, other.x, other.y);
                    
                    if (distance < 150) {
                        let alpha = (150 - distance) / 150 * 0.3;
                        p.stroke(45, 212, 191, alpha * 255);
                        p.strokeWeight(1);
                        p.line(node.x, node.y, other.x, other.y);
                    }
                }
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Initialize hover effects
function initializeHoverEffects() {
    const audienceCards = document.querySelectorAll('.audience-card');
    
    audienceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const audience = this.dataset.audience;
            
            // Change particle colors based on audience
            if (audience === 'organizations') {
                // Change to blue theme
                document.documentElement.style.setProperty('--neural-teal', '#3B82F6');
            } else if (audience === 'users') {
                // Change to green theme
                document.documentElement.style.setProperty('--neural-teal', '#10B981');
            } else if (audience === 'advertisers') {
                // Change to orange theme
                document.documentElement.style.setProperty('--neural-teal', '#F59E0B');
            }
            
            // Add glow effect
            this.style.boxShadow = '0 20px 40px rgba(45, 212, 191, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset color
            document.documentElement.style.setProperty('--neural-teal', '#2DD4BF');
            
            // Remove glow effect
            this.style.boxShadow = '';
        });
    });
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (!mobileMenuBtn) return;

    // Build mobile menu DOM (Home uses index.html#home so it works from any page)
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobile-menu';
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = `
        <div class="mobile-menu-backdrop" data-role="backdrop"></div>
        <div class="menu-panel" role="dialog" aria-modal="true" aria-label="Mobile menu">
            <button class="close-btn" aria-label="Close menu">\u00d7</button>
            <nav class="mobile-nav" aria-label="Mobile primary">
                <a href="index.html#home">Home</a>
                <a href="organizations.html">For Organizations</a>
                <a href="advertisers.html">For Advertisers</a>
                <a href="privacy.html">Privacy & Trust</a>
                <a href="contact.html">Contact</a>
            </nav>
        </div>
    `;

    document.body.appendChild(menu);

    const panel = menu.querySelector('.menu-panel');
    const backdrop = menu.querySelector('[data-role="backdrop"]');
    const closeBtn = menu.querySelector('.close-btn');
    const links = panel.querySelectorAll('a');
    const focusable = [closeBtn, ...Array.from(links)];

    function openMenu() {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('mobile-menu-open');
        // Focus first item
        setTimeout(() => focusable[0].focus(), 120);
        document.addEventListener('keydown', trapHandler);
    }

    function closeMenu() {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-menu-open');
        mobileMenuBtn.focus();
        document.removeEventListener('keydown', trapHandler);
    }

    function trapHandler(e) {
        if (e.key === 'Escape') {
            closeMenu();
            return;
        }

        if (e.key !== 'Tab') return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    mobileMenuBtn.setAttribute('aria-controls', 'mobile-menu');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.addEventListener('click', function() {
        if (menu.classList.contains('open')) closeMenu();
        else openMenu();
    });

    closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    links.forEach(a => a.addEventListener('click', closeMenu));

    // Close menu on large viewport (user resized to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && menu.classList.contains('open')) {
            closeMenu();
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showComingSoon() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-slate-900 rounded-2xl p-8 max-w-md mx-4 border border-neural-teal">
            <h3 class="font-display text-2xl font-bold text-white mb-4">Coming Soon!</h3>
            <p class="text-slate-300 mb-6">
                Odyxy is currently in development. Join our waitlist to be notified when we launch.
            </p>
            <div class="flex gap-4">
                <button onclick="window.location.href='contact.html'" class="cta-button flex-1">
                    Join Waitlist
                </button>
                <button onclick="closeModal()" class="secondary-button flex-1">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: modal.querySelector('div'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutBack'
    });
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                modal.remove();
            }
        });
    }
}

// Handle scroll events for parallax effects
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.neural-node');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate layouts if needed
    if (window.innerWidth < 768) {
        // Mobile adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
});

// Performance optimization - lazy load heavy animations
function lazyLoadAnimations() {
    const heavyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load heavy animation
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    heavyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

// Initialize lazy loading
lazyLoadAnimations();

// Accessibility enhancements
function initializeAccessibility() {
    // Handle reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Initialize accessibility features
initializeAccessibility();

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showComingSoon = showComingSoon;
window.closeModal = closeModal;