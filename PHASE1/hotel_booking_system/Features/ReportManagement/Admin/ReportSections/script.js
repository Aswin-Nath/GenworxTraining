    // Load Navbar
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    });

    // Load Reports Sidebar
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;

      // Highlight current page
      const currentPage = "report";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });
