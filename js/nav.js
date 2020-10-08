import {} from './pages/standings.js';
import Schedule from './pages/schedule.js';
import Saved from './pages/saved.js';
import Api from './api.js';
import {} from './service-worker-register.js';

const loadNav = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status != 200) return;

      // Muat daftar tautan menu
      document.querySelectorAll('.topnav, .sidenav').forEach((elm) => {
        elm.innerHTML = xhttp.responseText;
      });

      // Daftarkan event listener untuk setiap tautan menu
      document.querySelectorAll('.sidenav a, .topnav a').forEach((elm) => {
        elm.addEventListener('click', (event) => {
          // Tutup sidenav
          const sidenav = document.querySelector('.sidenav');
          M.Sidenav.getInstance(sidenav).close();

          // Muat konten halaman yang dipanggil
          const page = event.target.getAttribute('href').substr(1);
          loadPage(page);
        })
      })
    }
  };
  xhttp.open('GET', '/pages/nav.html', true);
  xhttp.send();
}

function loadPage(page) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      
      // tambahkan blok if berikut
      if (page === "standings") {
        Api.getStandings();
      }
      if (page === "schedule") {
        Schedule.fetchScheduleData() // in shedule.js
      }
      if (page === "saved") {
        Saved.getAllSavedSchedule() // in saved.js
      }

      const content = document.querySelector('#body-content');
      if (this.status === 200) {
        content.innerHTML = xhttp.responseText;
      } else if (this.status === 404) {
        content.innerHTML = '<p>404 Page Not Found.</p>';
      } else {
        content.innerHTML = `<p>Ups.. Page Can't Accessed.</p>`;
      }
    }
  };
  xhttp.open('GET', 'pages/' + page + '.html', true);
  xhttp.send();
}

$('.brand-logo').click((event) => {
  event.preventDefault();
  loadPage('standings');
});

// Active sidebar nav
const elems = document.querySelectorAll('.sidenav');
M.Sidenav.init(elems);
loadNav();

// Load page content
let page = window.location.hash.substr(1);
if (page === '') page = 'standings';
loadPage(page);