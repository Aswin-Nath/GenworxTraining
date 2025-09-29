        // Navbar
// ✅ Admin Navbar Loader (expanded with init)
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
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

    // Pagination Logic
    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredIssues = [];
function renderIssueTable(issues) {
  const tableBody = document.getElementById('issueTableBody');
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentIssues = issues.slice(startIndex, endIndex);

  if (currentIssues.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-12 text-center text-gray-500">
          <span class="material-icons text-4xl mb-4 block">search_off</span>
          No issues found matching your criteria
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = currentIssues.map(issue => {
    const statusColor = getStatusColor(issue.status);

    // 🔑 Dynamic category icon colors
    const categoryIconColors = {
      'Payment': 'text-red-600',
      'Booking': 'text-yellow-600',
      'Service': 'text-purple-600',
      'Technical': 'text-blue-600'
    };
    const categoryIconColor = categoryIconColors[issue.category] || 'text-gray-600';

    // 🔑 Status pill with matching icons
    const statusBadge = `
      <span class="px-3 py-1 rounded-full bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium flex items-center gap-1">
        <span class="material-icons text-sm ${issue.status === 'Open' ? 'animate-pulse' : ''}">
          ${issue.status === 'Open' ? 'error_outline' :
            issue.status === 'In-Progress' ? 'hourglass_empty' :
            issue.status === 'Resolved' ? 'check_circle' :
            'cancel'}
        </span>
        ${issue.status}
      </span>
    `;

    return `
      <tr class="hover:bg-gray-50">
        <!-- Issue ID -->
        <td class="p-3 font-medium text-blue-600">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">tag</span>
            ${issue.id}
          </div>
        </td>

        <!-- Customer -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">person</span>
            ${issue.customerId}
          </div>
        </td>

        <!-- Reported On -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="material-icons text-gray-600 text-sm">event</span>
            ${formatDate(issue.reportedOn)}
          </div>
        </td>

        <!-- Category -->
        <td class="p-3">
          <div class="flex items-center gap-2">
            <span class="material-icons ${categoryIconColor} text-sm">category</span>
            ${issue.category}
          </div>
        </td>

        <!-- Status -->
        <td class="p-3">${statusBadge}</td>

        <!-- Resolved On -->
        <td class="p-3">
          ${issue.resolvedOn 
            ? `<div class="flex items-center gap-2">
                 <span class="material-icons text-green-600 text-sm">check_circle</span>
                 ${formatDate(issue.resolvedOn)}
               </div>`
            : '-'}
        </td>

        <!-- Actions -->
        <td class="p-3 text-center">
          <div class="flex items-center justify-center gap-1 flex-wrap">
            <!-- View -->
            <button onclick="window.location.href='/Features/IssueManagement/Admin/AdminIssueDetails/index.html'"
              class="px-2 py-1 text-yellow-700 hover:bg-yellow-100 rounded transition text-sm"
              title="View Issue">
              <span class="material-icons text-sm">visibility</span>
            </button>

            <!-- Mark Resolved -->
            ${issue.status === 'Resolved' ? `
              <button disabled class="px-2 py-1 text-gray-400 rounded text-sm cursor-not-allowed" title="Already Resolved">
                <span class="material-icons text-sm">check_circle</span>
              </button>
            ` : `
              <button onclick="markResolved('${issue.id}')"
                class="px-2 py-1 text-green-700 hover:bg-green-100 rounded transition text-sm"
                title="Mark as Resolved">
                <span class="material-icons text-sm">check_circle</span>
              </button>
            `}

            <!-- Reject -->
            ${(issue.status === 'Resolved' || issue.status === 'Rejected') ? `
              <button disabled class="px-2 py-1 text-gray-400 rounded text-sm cursor-not-allowed" title="Cannot reject">
                <span class="material-icons text-sm">cancel</span>
              </button>
            ` : `
              <button onclick="rejectIssue('${issue.id}')"
                class="px-2 py-1 text-red-700 hover:bg-red-100 rounded transition text-sm"
                title="Reject Issue">
                <span class="material-icons text-sm">cancel</span>
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


    function updatePaginationInfo() {
      const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
      const startItem = filteredIssues.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
      const endItem = Math.min(currentPage * rowsPerPage, filteredIssues.length);

      document.getElementById('paginationInfo').textContent = 
        `Showing ${startItem}-${endItem} of ${filteredIssues.length} issues`;

      // Update pagination buttons
      document.getElementById('prevButton').disabled = currentPage === 1;
      document.getElementById('nextButton').disabled = currentPage === totalPages || totalPages === 0;

      // Update page numbers
      const pageNumbers = document.getElementById('pageNumbers');
      pageNumbers.innerHTML = '';

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.appendChild(createPageButton(i));
        }
      } else {
        pageNumbers.appendChild(createPageButton(1));
        if (currentPage > 4) pageNumbers.appendChild(createEllipsis());

        const start = Math.max(2, currentPage - 2);
        const end = Math.min(totalPages - 1, currentPage + 2);

        for (let i = start; i <= end; i++) {
          pageNumbers.appendChild(createPageButton(i));
        }

        if (currentPage < totalPages - 3) pageNumbers.appendChild(createEllipsis());
        if (totalPages > 1) pageNumbers.appendChild(createPageButton(totalPages));
      }
    }

    function createPageButton(pageNum) {
      const button = document.createElement('button');
      button.textContent = pageNum;
      button.className = `w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
        pageNum === currentPage 
          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 shadow-sm' 
          : 'text-gray-600 bg-white border-2 border-gray-100 hover:bg-yellow-50 hover:border-yellow-200'
      }`;
      button.onclick = () => goToPage(pageNum);
      return button;
    }

    function createEllipsis() {
      const span = document.createElement('span');
      span.textContent = '...';
      span.className = 'w-10 h-10 flex items-center justify-center text-gray-400';
      return span;
    }

    function goToPage(page) {
      currentPage = page;
      renderIssueTable(filteredIssues);
      updatePaginationInfo();
    }

    function prevPage() { 
      if (currentPage > 1) goToPage(currentPage - 1);
    }

    function nextPage() {
      const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
      if (currentPage < totalPages) goToPage(currentPage + 1);
    }

    function jumpToPage() {
      const pageInput = document.getElementById('pageInput').value;
      const page = parseInt(pageInput);
      const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
      if (page && page > 0 && page <= totalPages) {
        goToPage(page);
      }
      pageInput.value = '';
    }

    function getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'open': return 'yellow';
        case 'in-progress': return 'blue';
        case 'resolved': return 'green';
        case 'closed': return 'gray';
        default: return 'gray';
      }
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }

    function getIssues() {
      // This would normally fetch from an API/backend
      // For now, return dummy data
      return [
        {
          id: '#I1001',
          customerId: '#C3001',
          reportedOn: '2025-09-21',
          category: 'Payment',
          status: 'Open',
          resolvedOn: null
        },
        {
          id: '#I1002',
          customerId: '#C3002',
          reportedOn: '2025-09-20',
          category: 'Booking',
          status: 'In-Progress',
          resolvedOn: null
        },
        {
          id: '#I1003',
          customerId: '#C3003',
          reportedOn: '2025-09-19',
          category: 'Service',
          status: 'Resolved',
          resolvedOn: '2025-09-21'
        }
      ];
    }

    document.addEventListener('DOMContentLoaded', () => {
      filteredIssues = getIssues();
      renderIssueTable(filteredIssues);
      updatePaginationInfo();
    });
