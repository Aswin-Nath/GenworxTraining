
    const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";
    const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";

  // ✅ Navbar loader
  let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

  if (isAdminLoggedIn) {
    navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
  } else if (isCustomerLoggedIn) {
    navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
  }

  // ✅ Navbar loader
  fetch(navbarPath)
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;

      // mobile menu toggle
      const menuBtn = document.getElementById("menuBtn");
      const mobileMenu = document.getElementById("mobileMenu");
      if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("open");
        });
      }
    });

    // ✅ Footer loader
    fetch("/Features/Components/Footers/AdminLandingFooter/index.html")
      .then(res => res.text())
      .then(data => {
        document.getElementById("footer").innerHTML = data;
      });

