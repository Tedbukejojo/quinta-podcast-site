// js/app.js — Quinta Podcast — sem dependências
(function () {
    'use strict';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Header sticky + barra de progresso ---------- */
    const header = document.querySelector('.site-header');
    const progress = document.getElementById('scroll-progress');
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            header?.classList.toggle('is-scrolled', y > 20);
            ticking = false;
        });
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && !reduced && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const delay = Number(entry.target.dataset.revealDelay || 0);
                setTimeout(() => entry.target.classList.add('is-visible'), delay);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- Tema claro/escuro ---------- */
    const root = document.documentElement;
    const KEY = 'quinta:theme';
    const stored = localStorage.getItem(KEY);
    if (stored) root.dataset.theme = stored;

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        root.dataset.theme = next;
        localStorage.setItem(KEY, next);
    });

    /* ---------- Menu mobile ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
        });
    }

    /* ---------- Player custom ---------- */
    document.querySelectorAll('audio[data-custom-player]').forEach(setupPlayer);

    function setupPlayer(audio) {
        const wrap = audio.closest('.player');
        if (!wrap) return;
        const playBtn = wrap.querySelector('[data-play]');
        const track = wrap.querySelector('[data-track]');
        const bar = wrap.querySelector('[data-progress]');
        const time = wrap.querySelector('[data-time]');
        if (!playBtn || !track) return;

        playBtn.addEventListener('click', () => {
            audio.paused ? audio.play() : audio.pause();
        });
        audio.addEventListener('play', () => {
            playBtn.dataset.state = 'playing';
            playBtn.setAttribute('aria-label', 'Pausar');
        });
        audio.addEventListener('pause', () => {
            playBtn.dataset.state = 'paused';
            playBtn.setAttribute('aria-label', 'Reproduzir');
        });
        audio.addEventListener('timeupdate', () => {
            const pct = audio.duration ? audio.currentTime / audio.duration : 0;
            if (bar) bar.style.transform = `scaleX(${pct})`;
            if (time) time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`;
        });
        track.addEventListener('click', (e) => {
            const rect = track.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            if (audio.duration) audio.currentTime = ratio * audio.duration;
        });

        const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    }
})();