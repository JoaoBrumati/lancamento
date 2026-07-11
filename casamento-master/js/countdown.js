
const weddingDate = new Date('2026-08-15T16:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(minutes).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
