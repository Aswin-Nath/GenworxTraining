    // Navbar load
    const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

    let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html";

    if (isCustomerLoggedIn) {
      navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
    }

    fetch(navbarPath)
      .then(res => res.text())
      .then(data => {
        document.getElementById("navbar").innerHTML = data;

        const menuBtn = document.getElementById("menuBtn");
        const mobileMenu = document.getElementById("mobileMenu");
        if (menuBtn && mobileMenu) {
          menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
          });
        }
      });

    // Footer load
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

    // Sidebar highlight
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "report") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });