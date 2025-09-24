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

    // Dummy Pagination Logic
    let currentPage = 1;
    const rowsPerPage = 5;
    function showPage(page) {
      const rows = document.querySelectorAll("#refundTableBody tr");
      const totalPages = Math.ceil(rows.length / rowsPerPage);
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      currentPage = page;
      rows.forEach((row, i) => {
        row.style.display = (i >= (page - 1) * rowsPerPage && i < page * rowsPerPage) ? "" : "none";
      });
    }
    function prevPage() { showPage(currentPage - 1); }
    function nextPage() { showPage(currentPage + 1); }
    function jumpToPage() {
      const pageInput = document.getElementById("pageInput").value;
      if (pageInput) showPage(parseInt(pageInput));
    }
    document.addEventListener("DOMContentLoaded", () => showPage(1));
