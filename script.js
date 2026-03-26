const navToggle = document.getElementById('nav-toggle');
const topnav = document.getElementById('topnav');

if (navToggle && topnav) {
  navToggle.addEventListener('click', () => {
    topnav.classList.toggle('open');
  });

  topnav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => topnav.classList.remove('open'));
  });
}
