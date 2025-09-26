    const contents = {
      announcements: {
        used: [
          { title: "Welcome to LuxuryStay", desc: "Experience unmatched comfort & hospitality.", media: "/assets/hotel_luxury.jpg" },
          { title: "Safety First", desc: "Enhanced cleaning protocols in place.", media: "/assets/spa.png" }
        ],
        unused: [
          { title: "New Branch Opening", desc: "We're opening in Goa soon!", media: "/assets/pool.jpg" }
        ]
      },
      banners: {
        used: [{ title: "Beachfront View", desc: "Wake up to waves.", media: "/assets/room1.jpg" }],
        unused: [{ title: "Pool Paradise", desc: "Infinity pool experience.", media: "/assets/pool.jpg" }]
      }
    };

    let activeTab = "announcements";
    let currentEdit = null;

function renderContent() {
  const tab = contents[activeTab];
  document.getElementById("content-sections").innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-4 border rounded-lg shadow space-y-2 col-span-1">
        <h3 class="font-semibold">Currently Displaying Contents</h3>
        <div>
          ${tab.used.map((c,i)=>`
            <div class="relative p-3 bg-yellow-50 border rounded-lg">
              <button onclick="openEditModal('${activeTab}','used',${i})" class="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Edit</button>
              <div class="cursor-pointer">${c.title}</div>
            </div>
          `).join("")}
        </div>
      </div>
      
      <!-- ✅ Always show live preview -->
      <div class="bg-white p-4 border rounded-lg shadow col-span-2">
        <h3 class="font-semibold">Preview</h3>
        <iframe 
          src="/Features/LandingPages/Admin/index.html" 
          class="w-full h-[500px] rounded-lg border shadow">
        </iframe>
      </div>
    </div>

    <div class="bg-white p-4 border rounded-lg shadow">
      <h3 class="font-semibold">Unused Contents</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${tab.unused.map((c,i)=>`
          <div class="relative p-3 bg-gray-50 border rounded-lg">
            <button onclick="promoteContent('${activeTab}',${i})" class="absolute top-2 right-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Promote</button>
            <div class="cursor-pointer">${c.title}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

    function switchTab(tab) {
      activeTab = tab;
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("bg-yellow-500","text-white"));
      event.target.classList.add("bg-yellow-500","text-white");
      renderContent();
    }

    function showPreview(tab, type, index) {
      const item = contents[tab][type][index];
      currentEdit = {tab,type,index};
      document.getElementById("previewContent").innerHTML = `
        <h3 class="text-lg font-bold">${item.title}</h3>
        <p>${item.desc}</p>
        <img src="/assets/room1.jpg" class="w-full h-48 object-cover rounded-lg shadow my-2">
      `;
    }

    function promoteContent(tab,index) {
      const item = contents[tab].unused.splice(index,1)[0];
      contents[tab].used.push(item);
      renderContent();
    }

    function toggleAddContentModal() {
      document.getElementById("addContentModal").classList.toggle("hidden");
    }
    function toggleEditContentModal() {
      document.getElementById("editContentModal").classList.toggle("hidden");
    }

    document.getElementById("addContentForm").addEventListener("submit", e=>{
      e.preventDefault();
      const type=document.getElementById("addContentType").value;
      const title=document.getElementById("contentTitle").value;
      const desc=document.getElementById("contentDesc").value;
      const media="/assets/Hotel_logo.png";
      contents[type].unused.push({title,desc,media});
      toggleAddContentModal();
      renderContent();
    });

    function openEditModal(tab,type,index) {
      toggleEditContentModal();
      currentEdit = {tab,type,index};
      const item=contents[tab][type][index];
      document.getElementById("editContentType").value=tab;
      document.getElementById("editTitle").value=item.title;
      document.getElementById("editDesc").value=item.desc;
    }

    document.getElementById("editContentForm").addEventListener("submit", e=>{
      e.preventDefault();
      const {tab,type,index}=currentEdit;
      const newType=document.getElementById("editContentType").value;
      const newTitle=document.getElementById("editTitle").value;
      const newDesc=document.getElementById("editDesc").value;
      const item={title:newTitle,desc:newDesc,media:"/assets/Hotel_logo.png"};
      contents[tab][type].splice(index,1);
      contents[newType].used.push(item);
      toggleEditContentModal();
      renderContent();
    });

    function deleteContent() {
      const {tab,type,index}=currentEdit;
      contents[tab][type].splice(index,1);
      toggleEditContentModal();
      renderContent();
    }

    // Navbar + Sidebar injection
// ✅ Admin Navbar Loader (short form + init)
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(d => {
    document.getElementById("navbar").innerHTML = d;
    initNotifications(); // always run after navbar injection
  })
  .catch(err => console.error("❌ Navbar load failed:", err));


// ✅ Notifications initializer
function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "New booking: Room 201 confirmed", time: "2m ago" },
    { type: "issue", msg: "Issue reported in Room 105", time: "30m ago" },
    { type: "refund", msg: "Refund processed for BK#1234", time: "1h ago" }
  ];

  function notifIcon(type) {
    switch (type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "issue": return `<i class="fas fa-exclamation-triangle text-red-600"></i>`;
      case "refund": return `<i class="fas fa-money-bill-wave text-yellow-500"></i>`;
      default: return `<i class="fas fa-bell text-gray-500"></i>`;
    }
  }

  function renderNotifs(listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    list.innerHTML = latestNotifs.map(n => `
      <div class="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50">
        <div>${notifIcon(n.type)}</div>
        <div class="flex-1">
          <p class="text-sm text-gray-700">${n.msg}</p>
          <span class="text-xs text-gray-400">${n.time}</span>
        </div>
      </div>
    `).join("");
  }

  renderNotifs("notifList");
  renderNotifs("notifListMobile");

  document.getElementById("notifDot")?.classList.remove("hidden");
  document.getElementById("notifDotMobile")?.classList.remove("hidden");

  const toggleDropdown = (btnId, dropId) => {
    const btn = document.getElementById(btnId);
    const drop = document.getElementById(dropId);
    if (btn && drop) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        drop.classList.toggle("hidden");
      });
      document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !drop.contains(e.target)) {
          drop.classList.add("hidden");
        }
      });
    }
  };

  toggleDropdown("notifBtn", "notifDropdown");
  toggleDropdown("notifBtnMobile", "notifDropdownMobile");
}
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res=>res.text()).then(d=>{
      document.getElementById("sidebar").innerHTML=d;
      document.querySelectorAll("#sidebar a").forEach(link=>{
        if(link.dataset.page==="content"){ link.classList.add("text-yellow-600","font-bold"); }
      });
    });

    renderContent();
