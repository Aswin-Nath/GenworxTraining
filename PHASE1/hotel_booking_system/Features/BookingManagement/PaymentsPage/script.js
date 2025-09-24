    // Navbar + Footer load
 const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}
    fetch(isCustomerLoggedIn ? "/Features/Components/Navbars/LoggedWithoutBookNavbar/index.html" : "/Features/Components/Navbars/NotWithoutBookNavbar/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("navbar").innerHTML = data; });
    fetch("/Features/Components/Footers/CustomerFooter/index.html")
      .then(res => res.text())
      .then(data => { document.getElementById("footer").innerHTML = data; });

 const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardFields = document.getElementById("cardFields");
  const upiFields = document.getElementById("upiFields");
  const walletFields = document.getElementById("walletFields");

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      cardFields.classList.add("hidden");
      upiFields.classList.add("hidden");
      walletFields.classList.add("hidden");

      if (radio.value === "card") cardFields.classList.remove("hidden");
      if (radio.value === "upi") upiFields.classList.remove("hidden");
      if (radio.value === "wallet") walletFields.classList.remove("hidden");
    });
  });

  document.getElementById("confirmPayment").addEventListener("click", () => {
    alert("✅ Payment Successful! Your booking is confirmed.");
    window.location.href = "/Features/BookingManagement/MyBookings/index.html"; // Update path
  });
    
