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

      tableBody.innerHTML = currentIssues.map(issue => `
        <tr class="hover:bg-gray-50">
          <td class="p-3">${issue.id}</td>
          <td class="p-3">${issue.customerId}</td>
          <td class="p-3">${formatDate(issue.reportedOn)}</td>
          <td class="p-3">${issue.category}</td>
          <td class="p-3">
            <span class="px-3 py-1 rounded-full bg-${getStatusColor(issue.status)}-100 text-${getStatusColor(issue.status)}-700 text-xs font-medium">${issue.status}</span>
          </td>
          <td class="p-3">${issue.resolvedOn || '-'}</td>
          <td class="p-3 text-center flex justify-center space-x-2">
            <button onclick="window.location.href='/Features/IssueManagement/Admin/AdminIssueDetails/index.html'" 
                    class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
                    title="View Issue Details">
              <span class="material-icons text-sm">visibility</span>
            </button>
            <button class="p-2 ${issue.status === 'Resolved' ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg flex items-center justify-center"
                    ${issue.status === 'Resolved' ? 'disabled' : ''}
                    title="${issue.status === 'Resolved' ? 'Issue already resolved' : 'Mark as Resolved'}"
                    onclick="${issue.status !== 'Resolved' ? 'markResolved(\'' + issue.id + '\')' : ''}">
              <span class="material-icons text-sm">check_circle</span>
            </button>
            <button class="p-2 ${issue.status === 'Resolved' || issue.status === 'Rejected' ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg flex items-center justify-center"
                    ${issue.status === 'Resolved' || issue.status === 'Rejected' ? 'disabled' : ''}
                    title="${issue.status === 'Resolved' || issue.status === 'Rejected' ? 'Cannot reject resolved/rejected issue' : 'Reject Issue'}"
                    onclick="${issue.status !== 'Resolved' && issue.status !== 'Rejected' ? 'rejectIssue(\'' + issue.id + '\')' : ''}">
              <span class="material-icons text-sm">cancel</span>
            </button>
          </td>
        </tr>
      `).join('');
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
