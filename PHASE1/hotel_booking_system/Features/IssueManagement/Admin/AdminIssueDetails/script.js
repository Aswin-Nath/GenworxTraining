        // Navbar
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

    // Sidebar
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;
      const currentPage = "issue";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });
    (function () {
      const desc = document.getElementById('descText');
      const fade = document.getElementById('descFade');
      const btn = document.getElementById('toggleDescBtn');
      if (!desc || !btn) return;

      function isOverflowing(el) { return el.scrollHeight > el.clientHeight + 4; }
      function updateUI() {
        if (isOverflowing(desc)) { fade.style.display = ''; btn.style.display = ''; }
        else { fade.style.display = 'none'; btn.style.display = 'none'; }
      }
      updateUI();
      let expanded = false;
      btn.addEventListener('click', () => {
        expanded = !expanded;
        desc.style.maxHeight = expanded ? desc.scrollHeight + 'px' : '10rem';
        fade.style.display = expanded ? 'none' : '';
        btn.textContent = expanded ? 'Show less' : 'Show more';
      });
    })();