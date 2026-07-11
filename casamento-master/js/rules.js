
function renderRules() {
  const container = document.getElementById('rules-container');

  rules.forEach((rule, index) => {
    const card = document.createElement('div');
    card.classList.add('rule-card');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');

    card.innerHTML = `
      <span class="rule-num">${String(index + 1).padStart(2, '0')}</span>
      <div class="rule-header">
        <span class="rule-icon">${rule.icon}</span>
        <p class="rule-title">${rule.title}</p>
        <span class="rule-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
        </span>
      </div>
      <p class="rule-desc">${rule.desc}</p>
    `;

    const toggleCard = () => {
      const isActive = card.classList.toggle('active');
      card.setAttribute('aria-expanded', String(isActive));
    };

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });

    container.appendChild(card);
  });
}
