        fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(r => r.text()).then(t => { document.getElementById('navbar').innerHTML = t; }).catch(()=>{ /* ignore */ });
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(r => r.text()).then(t => {
      document.getElementById('sidebar').innerHTML = t;
      const currentPage = "customer";
      document.querySelectorAll("#sidebar a").forEach(link => { if (link.dataset.page === currentPage) link.classList.add("text-yellow-600","font-bold"); });
    }).catch(()=>{ /* ignore */ });
    // ---------- sample data ----------
    const bookings = [
      { id: 'B001', room: 'Deluxe', checkin: '2025-09-01', checkout: '2025-09-05', amount: 5000, payment: 'Credit Card', status: 'Completed' },
      { id: 'B002', room: 'Suite', checkin: '2025-09-10', checkout: '2025-09-12', amount: 4000, payment: 'UPI', status: 'Completed' },
      { id: 'B003', room: 'Standard', checkin: '2025-09-15', checkout: '2025-09-20', amount: 8000, payment: 'Credit Card', status: 'Completed' },
      { id: 'B004', room: 'Deluxe', checkin: '2025-09-25', checkout: '2025-09-28', amount: 6000, payment: 'Netbanking', status: 'Cancelled' },
      { id: 'B005', room: 'Suite', checkin: '2025-10-01', checkout: '2025-10-05', amount: 7000, payment: 'Debit Card', status: 'Upcoming' },
    ];

    const issues = [
      { id: 'I001', title: 'AC not working', reportedOn: '2025-09-02', assignee: 'Maintenance', status: 'Resolved' },
      { id: 'I002', title: 'Food delayed', reportedOn: '2025-09-12', assignee: 'Room Service', status: 'Resolved' },
      { id: 'I003', title: 'Housekeeping delay', reportedOn: '2025-09-16', assignee: 'Housekeeping', status: 'Pending' },
      { id: 'I004', title: 'Wi-Fi not working', reportedOn: '2025-09-18', assignee: 'IT', status: 'Resolved' },
      { id: 'I005', title: 'Billing issue', reportedOn: '2025-09-20', assignee: 'Accounts', status: 'Rejected' },
    ];

    const paymentsMode = {
      'Credit Card': 2,
      'Debit Card': 1,
      'UPI': 1,
      'Netbanking': 1
    };

    const roomTypesOrdered = {
      'Deluxe': 2,
      'Suite': 2,
      'Standard': 1
    };

    // ---------- render payments mode and room types ----------
    const paymentsEl = document.getElementById('paymentsModeList');
    const roomsEl = document.getElementById('roomTypesList');

    function renderPaymentsAndRooms() {
      paymentsEl.innerHTML = '';
      for (const [mode, cnt] of Object.entries(paymentsMode)) {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-between';
        el.innerHTML = `<span>${mode}</span><span class="text-sm text-gray-600">${cnt}</span>`;
        paymentsEl.appendChild(el);
      }

      roomsEl.innerHTML = '';
      for (const [room, cnt] of Object.entries(roomTypesOrdered)) {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-between';
        el.innerHTML = `<span>${room}</span><span class="text-sm text-gray-600">${cnt}</span>`;
        roomsEl.appendChild(el);
      }
    }

    // ---------- Stats ----------
    function computeStats() {
      document.getElementById('bookingCount').textContent = bookings.length;
      let nights = 0, cancels = 0, amount = 0;
      bookings.forEach(b => {
        const d1 = new Date(b.checkin), d2 = new Date(b.checkout);
        nights += Math.max(0, Math.round((d2 - d1)/(1000*60*60*24)));
        if (b.status.toLowerCase() === 'cancelled') cancels++;
        amount += Number(b.amount || 0);
      });
      document.getElementById('statBookings').textContent = bookings.length;
      document.getElementById('statNights').textContent = nights;
      document.getElementById('statCancels').textContent = cancels;
      document.getElementById('statAmount').textContent = `₹ ${amount.toLocaleString('en-IN')}`;

      document.getElementById('issuesCount').textContent = issues.length;
      const resolved = issues.filter(i => i.status.toLowerCase() === 'resolved').length;
      const pending = issues.filter(i => i.status.toLowerCase() === 'pending').length;
      document.getElementById('statIssues').textContent = issues.length;
      document.getElementById('statResolved').textContent = resolved;
      document.getElementById('statPending').textContent = pending;
    }

    // ---------- Pagination helper for a dataset & table ----------
    function createPaginator({ data, rowsPerPage, tbodyEl, showingEl, pagesContainer, prevBtn, nextBtn, renderRow }) {
      let current = 1;
      const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
      function render() {
        tbodyEl.innerHTML = '';
        const start = (current - 1) * rowsPerPage;
        const pageItems = data.slice(start, start + rowsPerPage);
        pageItems.forEach(item => {
          const tr = renderRow(item);
          tbodyEl.appendChild(tr);
        });
        showingEl.textContent = `${Math.min(start+1, data.length)} - ${Math.min(start + rowsPerPage, data.length)} of ${data.length}`;
        // pages
        pagesContainer.innerHTML = '';
        for (let p = 1; p <= totalPages; p++) {
          const btn = document.createElement('button');
          btn.className = `px-3 py-1 rounded ${p === current ? 'bg-yellow-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`;
          btn.textContent = p;
          btn.onclick = () => { current = p; render(); };
          pagesContainer.appendChild(btn);
        }
        prevBtn.disabled = current === 1;
        nextBtn.disabled = current === totalPages;
      }
      prevBtn.onclick = () => { if (current > 1) { current--; render(); } };
      nextBtn.onclick = () => { if (current < totalPages) { current++; render(); } };
      return { render, setPage: (p) => { current = p; render(); } };
    }

    // ---------- render row builders ----------
    function buildBookingRow(b) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-3">${b.id}</td>
        <td class="p-3">${b.room}</td>
        <td class="p-3">${formatDate(b.checkin)}</td>
        <td class="p-3">${formatDate(b.checkout)}</td>
        <td class="p-3">₹${Number(b.amount).toLocaleString('en-IN')}</td>
        <td class="p-3">${b.payment}</td>
        <td class="p-3">
          <span class="${statusColorClass(b.status)} px-2 py-0.5 rounded text-sm font-medium">${b.status}</span>
        </td>
      `;
      return tr;
    }

    function buildIssueRow(i) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-3">${i.id}</td>
        <td class="p-3">${i.title}</td>
        <td class="p-3">${formatDate(i.reportedOn)}</td>
        <td class="p-3">${i.assignee}</td>
        <td class="p-3"><span class="${statusColorClass(i.status)} px-2 py-0.5 rounded text-sm font-medium">${i.status}</span></td>
      `;
      return tr;
    }

    function formatDate(d) {
      // expects 'YYYY-MM-DD' or ISO
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const opts = { day: '2-digit', month: 'short', year: 'numeric' };
      return dt.toLocaleDateString('en-GB', opts);
    }

    function statusColorClass(status) {
      const s = String(status).toLowerCase();
      if (s.includes('completed') || s.includes('resolved')) return 'text-green-700';
      if (s.includes('cancel') || s.includes('rejected')) return 'text-red-700';
      if (s.includes('upcoming') || s.includes('pending')) return 'text-yellow-600';
      return 'text-gray-700';
    }

    // ---------- instantiate paginators ----------
    const bookingsTbody = document.getElementById('bookingsTbody');
    const bookingsShowing = document.getElementById('bookingsShowing');
    const bookPages = document.getElementById('bookPages');
    const bookPrev = document.getElementById('bookPrev');
    const bookNext = document.getElementById('bookNext');

    const issuesTbody = document.getElementById('issuesTbody');
    const issuesShowing = document.getElementById('issuesShowing');
    const issuePages = document.getElementById('issuePages');
    const issuePrev = document.getElementById('issuePrev');
    const issueNext = document.getElementById('issueNext');

    // choose rows per page (adjust as needed)
    const bookingsPaginator = createPaginator({
      data: bookings,
      rowsPerPage: 2,
      tbodyEl: bookingsTbody,
      showingEl: bookingsShowing,
      pagesContainer: bookPages,
      prevBtn: bookPrev,
      nextBtn: bookNext,
      renderRow: buildBookingRow
    });

    const issuesPaginator = createPaginator({
      data: issues,
      rowsPerPage: 2,
      tbodyEl: issuesTbody,
      showingEl: issuesShowing,
      pagesContainer: issuePages,
      prevBtn: issuePrev,
      nextBtn: issueNext,
      renderRow: buildIssueRow
    });

    // ---------- Block/unblock logic ----------
    let isBlocked = false; // default false; flip to true to simulate blocked customer
    const actionContainer = document.getElementById('actionButtons');
    const statusBadge = document.getElementById('statusBadge');
    const custBlockedNote = document.getElementById('custBlockedNote');

    function renderStatusAndActions() {
      // status badge
      statusBadge.innerHTML = '';
      const badge = document.createElement('span');
      badge.className = `px-3 py-1 rounded-full text-sm font-semibold ${isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
      badge.textContent = isBlocked ? 'Blocked' : 'Active';
      statusBadge.appendChild(badge);

      // bottom action - only one visible
      actionContainer.innerHTML = '';
      if (isBlocked) {
        custBlockedNote.classList.remove('hidden');
        const unblockBtn = document.createElement('button');
        unblockBtn.className = 'px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow flex items-center gap-2';
        unblockBtn.innerHTML = `<span class="material-icons text-sm">check_circle</span> Unblock Customer`;
        unblockBtn.onclick = () => { isBlocked = false; renderStatusAndActions(); };
        actionContainer.appendChild(unblockBtn);
      } else {
        custBlockedNote.classList.add('hidden');
        const blockBtn = document.createElement('button');
        blockBtn.className = 'px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow flex items-center gap-2';
        blockBtn.innerHTML = `<span class="material-icons text-sm">block</span> Block Customer`;
        blockBtn.onclick = () => { isBlocked = true; renderStatusAndActions(); };
        actionContainer.appendChild(blockBtn);
      }
    }

    // ---------- init render ----------
    function init() {
      renderPaymentsAndRooms();
      computeStats();
      bookingsPaginator.render();
      issuesPaginator.render();
      renderStatusAndActions();
    }

    init();
