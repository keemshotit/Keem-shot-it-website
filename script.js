const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.textContent = open ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();
document.addEventListener("DOMContentLoaded", async () => {
  // Update footer year dynamically
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Load published portfolio entries
  try {
    const res = await fetch("/portfolio.json");
    if (!res.ok) return;
    const items = await res.json();

    const grids = {
      lifestyle: document.getElementById("lifestyle-grid"),
      portrait: document.getElementById("portrait-grid"),
      culture: document.getElementById("culture-grid")
    };

    // Reset default loading messages if items exist
    Object.values(grids).forEach(grid => {
      if (grid) grid.innerHTML = "";
    });

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "portfolio-item-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title || 'Portfolio Image'}" loading="lazy">
        <div class="portfolio-item-info">
          <h4>${item.title || ''}</h4>
          ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
      `;

      const cat = (item.category || "").toLowerCase();
      if (cat.includes("lifestyle") && grids.lifestyle) {
        grids.lifestyle.appendChild(card);
      } else if (cat.includes("portrait") && grids.portrait) {
        grids.portrait.appendChild(card);
      } else if (cat.includes("culture") && grids.culture) {
        grids.culture.appendChild(card);
      }
    });
  } catch (err) {
    console.warn("Portfolio JSON not available yet or build script pending.");
  }
});
