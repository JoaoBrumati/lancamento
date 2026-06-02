const launchDate = new Date("June 15, 2026 00:00:00").getTime();

const countdown = setInterval(() => {

  const now = new Date().getTime();
  const distance = launchDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = String(days).padStart(2, '0');
  document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
  document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
  document.getElementById("seconds").innerHTML = String(seconds).padStart(2, '0');

  if(distance < 0){

    clearInterval(countdown);

    document.querySelector(".countdown").innerHTML = `
      <h2 style="font-size:3rem; color:#a259ff;">
        SITE LANÇADO 🚀
      </h2>
    `;
  }

}, 1000);