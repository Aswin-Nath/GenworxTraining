document.addEventListener("DOMContentLoaded", () => {
  fetch("../CustomerFooter/index.html") // adjust path based on where footer.html is saved
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Footer load failed:", err));
});