
    // Navbar + Footer
 const isAdminLoggedIn = localStorage.getItem("is_admin_logged_in") === "true";
const isCustomerLoggedIn = localStorage.getItem("is_customer_logged_in") === "true";

// ✅ Navbar loader
let navbarPath = "/Features/Components/Navbars/NotCustomerNavbar/index.html"; // default

if (isAdminLoggedIn) {
  navbarPath = "/Features/Components/Navbars/AdminLandingNavbar/index.html";
} else if (isCustomerLoggedIn) {
  navbarPath = "/Features/Components/Navbars/LoggedCustomerNavbar/index.html";
}
    fetch(navbarPath)
      .then(res => res.text()).then(data => { document.getElementById("navbar").innerHTML = data; });
    fetch("/Features/Components/Footers/CustomerFooter/index.html").then(res => res.text()).then(data => { document.getElementById("footer").innerHTML = data; });

    // Dummy Booking Data
    const bookingData = {
      id: "B1234",
      rooms: [
        { id: 1, type: "Deluxe Room", adults: 2, children: 0, checkIn: "2025-09-22", checkOut: "2025-09-24", img: "/assets/room1.jpg", price: 4500 },
        { id: 2, type: "Executive Suite", adults: 3, children: 1, checkIn: "2025-09-22", checkOut: "2025-09-24", img: "/assets/room2.jpg", price: 6200 }
      ]
    };
    // Render Flow Bar
    function renderFlowBar() {
      const flowBar = document.getElementById("flowBar");
      flowBar.innerHTML = "";
      bookingData.rooms.forEach((room, idx) => {
        const step = document.createElement("div");
        step.className = "step flex flex-col items-center cursor-pointer";
        step.dataset.step = idx + 1;
        step.innerHTML = `
          <div class="circle w-10 h-10 flex items-center justify-center rounded-full 
            ${idx === 0 ? "border-yellow-600 text-yellow-700" : "border-gray-400 text-gray-500"} 
            border-2 font-bold">${idx + 1}</div>
          <p class="text-sm mt-2">Room ${idx + 1}</p>
        `;
        flowBar.appendChild(step);
        if (idx < bookingData.rooms.length) {
          const line = document.createElement("div");
          line.className = "w-16 h-0.5 bg-gray-400";
          flowBar.appendChild(line);
        }
      });
      const finalStep = document.createElement("div");
      finalStep.className = "step flex flex-col items-center cursor-pointer";
      finalStep.dataset.step = bookingData.rooms.length + 1;
      finalStep.innerHTML = `
        <div class="circle w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-400 text-gray-500 font-bold">${bookingData.rooms.length + 1}</div>
        <p class="text-sm mt-2">Final Review</p>
      `;
      flowBar.appendChild(finalStep);
    }

    // Editable Summary Form
    function editableSummaryForm(room) {
      return `
        <div class="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Edit Current Booking</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Room Type</label>
              <select class="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500" id="roomType-${room.id}">
                <option ${room.type === "Deluxe Room" ? "selected" : ""}>Deluxe Room</option>
                <option ${room.type === "Executive Suite" ? "selected" : ""}>Executive Suite</option>
                <option ${room.type === "Presidential Suite" ? "selected" : ""}>Presidential Suite</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Adults</label>
              <input type="number" id="adults-${room.id}" value="${room.adults}" min="1" class="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Children</label>
              <input type="number" id="children-${room.id}" value="${room.children}" min="0" class="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Check-in</label>
              <input type="date" id="checkIn-${room.id}" value="${room.checkIn}" class="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Check-out</label>
              <input type="date" id="checkOut-${room.id}" value="${room.checkOut}" class="border rounded-lg p-3 w-full focus:ring-2 focus:ring-yellow-500">
            </div>
          </div>
        </div>
      `;
    }

    // Billing Sidebar Template
    function billingSidebar(room) {
      return `
        <div class="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 class="text-xl font-bold text-gray-800 border-b pb-2">Billing Summary</h3>
          <div class="flex justify-between text-gray-600"><span>Room Type</span><span>${room.type}</span></div>
          <div class="flex justify-between text-gray-600"><span>Price/Night</span><span>₹${room.price}</span></div>
          <div class="flex justify-between text-gray-600"><span>Guests</span><span>${room.adults}A, ${room.children}C</span></div>
          <div class="flex justify-between text-gray-600"><span>Nights</span><span>2</span></div>
          <hr>
          <div class="flex justify-between font-bold text-lg"><span>Total</span><span>₹${room.price * 2}</span></div>
        </div>
      `;
    }

    // Room Cards Template
    function roomCardsTemplate(room) {
      return `
        <div class="bg-white rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2 gap-6 p-6 md:p-10">
          <div>
            <img src="${room.img}" alt="${room.type}" class="w-full h-80 object-cover rounded-xl">
            <h2 class="mt-6 text-3xl font-bold text-gray-800">${room.type}</h2>
            <div class="flex space-x-6 mt-4 text-gray-600">
              <p>👤 ${room.adults} Adults</p>
              <p>🛏️ Queen Bed</p>
              <p>📐 28 Sq.mt</p>
            </div>
            <div class="mt-4 flex space-x-4">
              <button class="openModal text-red-600 font-medium hover:underline">Room details</button>
              <button class="openReviews text-yellow-600 font-medium hover:underline">View Reviews</button>
            </div>
          </div>
          <div class="space-y-6">
            <div class="border rounded-xl p-6 hover:shadow-md transition">
              <h3 class="font-bold text-lg text-gray-800">Room Only</h3>
              <ul class="list-disc ml-6 mt-2 text-gray-600 space-y-1">
                <li>Includes WiFi</li>
                <li>Flexible cancellation</li>
              </ul>
              <div class="mt-4 flex justify-between items-center">
                <p class="text-2xl font-bold">₹${room.price} / night</p>
                <button class="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">Select</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Render Step Sections
    function renderStepSections() {
      const container = document.getElementById("stepSections");
      container.innerHTML = "";

      bookingData.rooms.forEach((room, idx) => {
        const stepDiv = document.createElement("div");
        stepDiv.className = `step-content ${idx === 0 ? "" : "hidden"}`;
        stepDiv.dataset.step = idx + 1;

        stepDiv.innerHTML = `
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left (70%) -->
            <div class="lg:col-span-2 space-y-8">
              ${editableSummaryForm(room)}
              <div id="roomCardsContainer-${room.id}" class="space-y-8"></div>
            </div>
            <!-- Right (30%) -->
            <aside class="lg:col-span-1">
              ${billingSidebar(room)}
            </aside>
          </div>
        `;

        container.appendChild(stepDiv);
      });

      // ✅ Final Review step
      const finalDiv = document.createElement("div");
      finalDiv.className = "step-content hidden";
      finalDiv.dataset.step = bookingData.rooms.length + 1;
      finalDiv.innerHTML = `
        <div class="bg-white rounded-3xl shadow-lg p-10 space-y-6 text-center">
          <h2 class="text-3xl font-bold text-gray-800">Final Review</h2>
          <p class="text-gray-600">All booking details have been updated. Click below to proceed.</p>
          <div class="bg-gray-50 p-6 rounded-xl space-y-3 text-left">
            ${bookingData.rooms.map(r => `
              <div class="flex justify-between">
                <span>Room ${r.id}</span>
                <span>${r.type} | ${r.adults} Adults, ${r.children} Children | ${r.checkIn} → ${r.checkOut}</span>
              </div>
            `).join("")}
          </div>
          <button id="proceedBtn" 
            class="w-full md:w-1/2 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg shadow hover:opacity-90">
            Proceed to Payment →
          </button>
        </div>
      `;
      container.appendChild(finalDiv);
    }

    // Step Handling
    function showStep(stepNum) {
      document.querySelectorAll(".step-content").forEach(c => {
        c.classList.toggle("hidden", c.dataset.step != stepNum);
      });
      document.querySelectorAll(".step .circle").forEach(circle => {
        circle.classList.remove("border-yellow-600", "text-yellow-700");
        circle.classList.add("border-gray-400", "text-gray-500");
      });
      const activeCircle = document.querySelector(`.step[data-step='${stepNum}'] .circle`);
      if (activeCircle) {
        activeCircle.classList.remove("border-gray-400", "text-gray-500");
        activeCircle.classList.add("border-yellow-600", "text-yellow-700");
      }
    }

    // Init
    renderFlowBar();
    renderStepSections();
    let currentStep = 1;
    showStep(currentStep);

    // Buttons
    document.getElementById("nextRoomBtn").addEventListener("click", () => {
      if (currentStep < bookingData.rooms.length) {
        currentStep++;
        showStep(currentStep);
      } else {
        showStep(bookingData.rooms.length + 1);
      }
    });

    document.getElementById("searchRoomsBtn").addEventListener("click", () => {
      const room = bookingData.rooms[currentStep - 1];
      const selectedType = document.getElementById(`roomType-${room.id}`).value;
      const adults = document.getElementById(`adults-${room.id}`).value;
      const children = document.getElementById(`children-${room.id}`).value;
      const checkIn = document.getElementById(`checkIn-${room.id}`).value;
      const checkOut = document.getElementById(`checkOut-${room.id}`).value;

      const container = document.getElementById(`roomCardsContainer-${room.id}`);
      container.innerHTML = `
        <p class="text-gray-600 mb-4">Showing available rooms for <strong>${selectedType}</strong> (${adults} Adults, ${children} Children) from ${checkIn} to ${checkOut}:</p>
        ${roomCardsTemplate({ ...room, type: "Deluxe Room", price: 4500 })}
        ${roomCardsTemplate({ ...room, type: "Executive Suite", price: 6200 })}
        ${roomCardsTemplate({ ...room, type: "Presidential Suite", price: 9500 })}
      `;
    });
        // Sidebar highlight
    document.querySelectorAll("aside nav a").forEach(link => {
      if (link.dataset.page === "booking") {
        link.classList.add("text-yellow-700", "font-semibold");
      }
    });

    // ✅ Final Step Redirect
    document.addEventListener("click", (e) => {
      if (e.target.id === "proceedBtn") {
        window.location.href = "/Features/BookingManagement/Customer/PaymentsPage/index.html"; // change "X.html" to your desired page
      }
    });
