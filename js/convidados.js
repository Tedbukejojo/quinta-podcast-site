// js/convidados.js — lista de convidados do Quinta Podcast
const CONVIDADOS = [
    { nome: "Alfredo Rollo", papel: "Dublador: Vegeta, Lucifer e Brook", foto: "alfredo-rollo.jpg" },
    { nome: "Bárbara Gutierrez", papel: "Apresentadora e E-sports", foto: "barbara-gutierrez.jpg" },
    { nome: "Isadora Basile", papel: "Apresentadora e E-sports", foto: "isadora-basile.jpg" },
    // DICA: Evite espaços e letras maiúsculas nos nomes dos arquivos. Renomeie para "luiz-teixeira.jpg" para evitar erros no Vercel.
    { nome: "Luiz Teixeira", papel: "Repórter - Rede Globo", foto: "Teixeira X Wes.jpg" },
    { nome: "Luisa Horta & Jeff", papel: "Dubladora e Apresentador de Podcast", foto: "luisa-horta-jeff.jpg" },
    { nome: "Manolo Rey & Marco Ribeiro", papel: "Dubladores: Sonic, Iron Man, Yusuke e Spider Man", foto: "manolo-marco.jpg" },

    // Convidados novos: cole aqui embaixo, seguindo o mesmo formato.
    // { nome: "Nome do Convidado", papel: "O que ele faz / participação", foto: "nome-do-arquivo.jpg" },
];

(function () {
    'use strict';

    const grid = document.getElementById('convidados-grid');
    if (!grid) return;

    grid.innerHTML = CONVIDADOS.map((c) => {
        // Se a foto não for encontrada, gera um avatar azul com a inicial do nome
        const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.nome)}&background=004b9b&color=ffffff&size=140&font-size=0.4`;

        return `
        <div class="convidado-card">
            <img class="convidado-foto"
                 src="assets/convidados/${c.foto}"
                 alt="${escapeHtml(c.nome)}"
                 onerror="this.onerror=null; this.src='${fallbackImage}';">
            <h2 style="font-family: var(--fonte-texto); font-size: 1.2rem; color: var(--azul-marca); margin-bottom: 8px;">${escapeHtml(c.nome)}</h2>
            <p style="font-size: 0.9rem; color: var(--cinza-texto);">${escapeHtml(c.papel)}</p>
        </div>
        `;
    }).join('');

    // Função de segurança para evitar problemas com caracteres especiais
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
})();