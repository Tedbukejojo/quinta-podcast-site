// js/episodios.js — busca os episódios mais recentes do canal (YouTube Data API v3)
(function () {
    'use strict';

    // ===== CONFIGURAÇÃO =====
    const API_KEY = 'AIzaSyC6q_jCBXIjeC1btwjUBkvkvvO1b4eBJcE'; // chave restrita por referrer HTTP (ver passo 2.1)
    const UPLOADS_PLAYLIST_ID = 'UUKEVaLfTvcxEZwQsh-9KG3g'; // playlist de uploads do @quinta_podcast
    const MAX_EPISODES = 6;
    const CACHE_KEY = 'quinta:episodios';
    const CACHE_MINUTES = 30;

    const grid = document.getElementById('episodios-grid');
    if (!grid) return;

    init();

    async function init() {
        const cached = getCache();
        if (cached) {
            render(cached);
            return;
        }
        try {
            const videos = await fetchEpisodios();
            setCache(videos);
            render(videos);
        } catch (err) {
            console.error('Erro ao carregar episódios do YouTube:', err);
            grid.innerHTML = '<p class="episodios-erro">Não foi possível carregar os episódios agora. <a href="https://www.youtube.com/@quinta_podcast" target="_blank">Veja no YouTube</a>.</p>';
        }
    }

    async function fetchEpisodios() {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_EPISODES}&playlistId=${UPLOADS_PLAYLIST_ID}&key=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`YouTube API respondeu ${res.status}`);
        const data = await res.json();

        return data.items
            .map((item) => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumb: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
                publishedAt: item.snippet.publishedAt,
            }))
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // garante o mais novo primeiro
    }

    function render(videos) {
        grid.innerHTML = videos.map((v, i) => `
            <article class="episode-card" data-reveal data-reveal-delay="${i * 80}">
                <button class="episode-thumb" data-video-id="${v.id}" aria-label="Assistir ${escapeHtml(v.title)}">
                    <img src="${v.thumb}" alt="${escapeHtml(v.title)}" loading="lazy">
                    <span class="episode-play">▶</span>
                </button>
                <div class="episode-info">
                    <h3>${escapeHtml(v.title)}</h3>
                    <p class="episode-date">${formatDate(v.publishedAt)}</p>
                    <p class="episode-desc">${escapeHtml(truncate(v.description, 110))}</p>
                    <div class="episode-actions">
                        <button class="btn-primary btn-small" data-video-id="${v.id}">Assistir aqui</button>
                        <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Abrir no YouTube</a>
                    </div>
                </div>
            </article>
        `).join('');

        grid.querySelectorAll('[data-video-id]').forEach((el) => {
            el.addEventListener('click', () => openModal(el.dataset.videoId));
        });
    }

    function openModal(videoId) {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-backdrop" data-close></div>
            <div class="video-modal-box">
                <button class="video-modal-close" data-close aria-label="Fechar">✕</button>
                <iframe
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
                    title="Player do YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', (e) => {
            if (e.target.dataset.close !== undefined) closeModal(modal);
        });
        document.addEventListener('keydown', escListener);

        function escListener(e) {
            if (e.key === 'Escape') closeModal(modal);
        }
        function closeModal(m) {
            m.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escListener);
        }
    }

    function getCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const { timestamp, videos } = JSON.parse(raw);
            const ageMin = (Date.now() - timestamp) / 60000;
            return ageMin < CACHE_MINUTES ? videos : null;
        } catch { return null; }
    }

    function setCache(videos) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), videos }));
        } catch { /* localStorage indisponível (ex: modo privado) */ }
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function truncate(str, n) {
        return str.length > n ? str.slice(0, n).trim() + '…' : str;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
})();