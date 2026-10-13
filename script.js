// Mobile Menu Navigation Toggle
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

// DOM Content Loaded Handler
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

  // Handle Netlify Booking Form Submission via AJAX
  const bookingForm = document.querySelector('.booking-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'SENDING... <span>⏳</span>';
      submitBtn.disabled = true;

      const formData = new FormData(bookingForm);

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          bookingForm.innerHTML = `
            <div style="padding: 2.5rem 1rem; text-align: center; background: #111; border: 1px solid #302a26;">
              <h3 style="color: #ff6337; font-size: 2rem; margin-bottom: 0.5rem; font-family: 'Barlow Condensed', sans-serif;">INQUIRY SENT ✦</h3>
              <p style="color: #aaa; font-size: 0.95rem; margin: 0; font-family: 'DM Sans', sans-serif;">Thanks for reaching out! I’ll review your details and get back to you soon.</p>
            </div>
          `;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        alert('There was an issue sending your request. Please try emailing directly at Keemshotitbooking@gmail.com');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
