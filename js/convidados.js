// js/convidados.js — lista de convidados do Quinta Podcast
// Pra adicionar um novo convidado: copie um bloco { ... } e preencha.
// foto: nome do arquivo dentro de assets/convidados/ (se não existir ainda, cai no placeholder automaticamente)

const CONVIDADOS = [
    { nome: "Alfredo Rollo", papel: "Dublador: Vegeta, Lucifer e Brook", foto: "alfredo-rollo.jpg" },
    { nome: "Bárbara Gutierrez", papel: "Apresentadora e E-sports", foto: "barbara-gutierrez.jpg" },
    { nome: "Isadora Basile", papel: "Apresentadora e E-sports", foto: "isadora-basile.jpg" },
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

    grid.innerHTML = CONVIDADOS.map((c) => `
        <div class="convidado-card">
            <img class="convidado-foto"
                 src="assets/convidados/${c.foto}"
                 alt="${escapeHtml(c.nome)}"
                 onerror="this.onerror=null; this.src='assets/convidados/placeholder.svg';">
            <h4>${escapeHtml(c.nome)}</h4>
            <p>${escapeHtml(c.papel)}</p>
        </div>
    `).join('');

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
})();