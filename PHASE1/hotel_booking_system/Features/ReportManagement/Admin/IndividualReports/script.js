// ✅ Navbar Loader with Notifications (no fallback)
fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    initNotifications(); // 🔔 call after navbar loads
  });

// ✅ Notifications Initializer
function initNotifications() {
  const latestNotifs = [
    { type: "booking", msg: "New booking: Room 201 confirmed", time: "2m ago" },
    { type: "issue", msg: "Issue reported in Room 105", time: "30m ago" },
    { type: "refund", msg: "Refund processed for BK#1234", time: "1h ago" }
  ];

  const notifIcon = (type) => {
    switch (type) {
      case "booking": return `<i class="fas fa-calendar-check text-green-600"></i>`;
      case "issue": return `<i class="fas fa-exclamation-triangle text-red-600"></i>`;
      case "refund": return `<i class="fas fa-money-bill-wave text-yellow-500"></i>`;
      default: return `<i class="fas fa-bell text-gray-500"></i>`;
    }
  };

  const renderNotifs = (listId) => {
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
  };

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

// Populate customer dropdown with unique customers from table data (global function)
function populateCustomerDropdown() {
  console.log('populateCustomerDropdown called');
  const customerSet = new Set();
  const rows = document.querySelectorAll('#reportBody tr');
  
  console.log('Found rows:', rows.length);
  
  rows.forEach(row => {
    const customer = row.getAttribute('data-customer');
    console.log('Row customer:', customer);
    if (customer && customer.trim() !== '') {
      customerSet.add(customer.trim());
    }
  });

  console.log('Unique customers found:', Array.from(customerSet));

  const customerFilter = document.getElementById('customerFilter');
  if (customerFilter) {
    // Clear existing options except "All Customers"
    customerFilter.innerHTML = '<option value="all">All Customers</option>';
    
    // Add unique customers sorted alphabetically
    const sortedCustomers = Array.from(customerSet).sort();
    sortedCustomers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer;
      option.textContent = customer;
      customerFilter.appendChild(option);
      console.log('Added option:', customer);
    });
    
    console.log('Customer dropdown populated with:', sortedCustomers);
    console.log('Total options in dropdown:', customerFilter.options.length);
  } else {
    console.log('customerFilter element not found');
  }
}

// Global apply filters function (handles both dropdown and custom dates)
function applyFilters() {
  var dateRange = document.getElementById('dateRange').value;
  var customerFilter = document.getElementById('customerFilter').value;
  var fromDateInput = document.getElementById('fromDate').value;
  var toDateInput = document.getElementById('toDate').value;
  var customInputsVisible = !document.getElementById('customDateInputs').classList.contains('hidden');
  var rows = document.querySelectorAll('#reportBody tr');

  console.log('Applying filters - Date Range:', dateRange, 'Customer:', customerFilter, 'Custom visible:', customInputsVisible);

  // Get date range bounds
  var fromDate = null;
  var toDate = null;
  var currentDate = new Date();

  // Check if custom date inputs are visible AND have values - prioritize them
  if (customInputsVisible && (fromDateInput || toDateInput)) {
    if (fromDateInput && toDateInput) {
      fromDate = new Date(fromDateInput);
      toDate = new Date(toDateInput);
      console.log('Using CUSTOM date inputs:', fromDate, toDate);
    } else if (fromDateInput) {
      fromDate = new Date(fromDateInput);
      toDate = new Date(); // Today
      console.log('Using CUSTOM from date only:', fromDate);
    } else if (toDateInput) {
      fromDate = new Date('2020-01-01'); // Far past date
      toDate = new Date(toDateInput);
      console.log('Using CUSTOM to date only:', toDate);
    }
  } else if (dateRange !== 'all') {
    // Use dropdown selection only if custom is not active
    console.log('Using DROPDOWN selection:', dateRange);
    switch (dateRange) {
      case 'thisMonth':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case 'last3Months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
        toDate = currentDate;
        break;
      case 'thisYear':
        fromDate = new Date(currentDate.getFullYear(), 0, 1);
        toDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
    }
  } else {
    // No date filtering (All Dates selected and no custom dates)
    console.log('No date filtering applied');
    fromDate = null;
    toDate = null;
  }

  filterRows(rows, fromDate, toDate, customerFilter);
}

// Toggle custom date inputs visibility - COMPLETE CONTROL
function toggleCustomDateInputs() {
  var customInputs = document.getElementById('customDateInputs');
  var customBtn = document.getElementById('customBtn');
  
  console.log('toggleCustomDateInputs called');
  
  if (customInputs && customBtn) {
    var isHidden = customInputs.classList.contains('hidden');
    console.log('Custom inputs currently hidden:', isHidden);
    
    if (isHidden) {
      // Show custom date inputs
      customInputs.classList.remove('hidden');
      customInputs.classList.add('flex');
      customBtn.textContent = 'Hide Custom Dates';
      customBtn.classList.add('bg-orange-600');
      customBtn.classList.remove('bg-orange-500');
      customBtn.classList.remove('hover:bg-orange-600');
      customBtn.classList.add('hover:bg-orange-700');
      
      console.log('Custom date inputs SHOWN');
    } else {
      // Hide custom date inputs
      customInputs.classList.add('hidden');
      customInputs.classList.remove('flex');
      customBtn.textContent = 'Custom Dates';
      customBtn.classList.add('bg-orange-500');
      customBtn.classList.remove('bg-orange-600');
      customBtn.classList.add('hover:bg-orange-600');
      customBtn.classList.remove('hover:bg-orange-700');
      
      // Clear custom date values when hiding
      var fromDate = document.getElementById('fromDate');
      var toDate = document.getElementById('toDate');
      if (fromDate) fromDate.value = '';
      if (toDate) toDate.value = '';
      
      console.log('Custom date inputs HIDDEN and cleared');
    }
  } else {
    console.error('Could not find custom inputs or button elements');
  }
}

// Hide custom inputs when dropdown is changed
function hideCustomInputsOnDropdownChange() {
  var customInputs = document.getElementById('customDateInputs');
  var customBtn = document.getElementById('customBtn');
  
  console.log('hideCustomInputsOnDropdownChange called');
  
  if (customInputs && customBtn) {
    var isVisible = !customInputs.classList.contains('hidden');
    console.log('Custom inputs currently visible:', isVisible);
    
    if (isVisible) {
      // Hide custom inputs
      customInputs.classList.add('hidden');
      customInputs.classList.remove('flex');
      customBtn.textContent = 'Custom';
      customBtn.classList.add('bg-orange-500');
      customBtn.classList.remove('bg-orange-600');
      
      // Clear custom date values when hiding
      var fromDate = document.getElementById('fromDate');
      var toDate = document.getElementById('toDate');
      if (fromDate) fromDate.value = '';
      if (toDate) toDate.value = '';
      
      console.log('Custom inputs hidden and cleared');
    }
  } else {
    console.log('Could not find custom inputs or button elements');
  }
}

// Common function to filter rows
function filterRows(rows, fromDate, toDate, customerFilter) {
  var visibleRows = 0;

  rows.forEach(function (row) {
    var shouldShow = true;
    
    // Customer filter
    if (customerFilter !== 'all') {
      var rowCustomer = row.getAttribute('data-customer') || '';
      console.log('Checking customer:', rowCustomer, 'against filter:', customerFilter);
      if (rowCustomer !== customerFilter) {
        shouldShow = false;
      }
    }

    // Date range filter
    if (fromDate && toDate && shouldShow) {
      var checkinDateStr = row.getAttribute('data-checkin');
      if (checkinDateStr) {
        var checkinDate = new Date(checkinDateStr);
        console.log('Comparing date:', checkinDate, 'between', fromDate, 'and', toDate);
        if (isNaN(checkinDate.getTime()) || checkinDate < fromDate || checkinDate > toDate) {
          shouldShow = false;
        }
      }
    }

    if (shouldShow) {
      row.style.display = '';
      visibleRows++;
    } else {
      row.style.display = 'none';
    }
  });

  // Recalculate totals
  if (typeof recalcTotals === 'function') {
    recalcTotals();
  }
  
  console.log('Filter applied, visible rows:', visibleRows);
  
  if (visibleRows === 0) {
    console.log('No records match the selected filters');
  }
}

    // Load Reports Sidebar
    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("old_sidebar").innerHTML = data;

      // Highlight current page
      document.querySelectorAll("#old_sidebar a").forEach(link => {
        if (link.dataset.page === "report") {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    });

   const exportToggle = document.getElementById("exportToggle");
  const exportMenu = document.getElementById("exportMenu");
  exportToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle("hidden");
  });
  document.addEventListener("click", () => {
    if (!exportMenu.classList.contains("hidden")) exportMenu.classList.add("hidden");
  });


  // Removed old modal-based date selection code that was conflicting with new inline custom date inputs
  const pdfModal = document.getElementById("pdfModal");
  const pdfClose = document.getElementById("pdfClose");
  const pdfCancel = document.getElementById("pdfCancel");
  const pdfExportBtn = document.getElementById("pdfExportBtn");
  const pdfCustomizeToggle = document.getElementById("pdfCustomizeToggle");
  const pdfDetails = document.getElementById("pdfDetails");
  let pdfDetailsVisible = true;

  document.getElementById("exportPDF").addEventListener("click", (e) => {
    e.preventDefault();
    pdfModal.classList.remove("hidden");
    pdfModal.classList.add("flex");
  });
  pdfClose.addEventListener("click", () => pdfModal.classList.add("hidden"));
  pdfCancel.addEventListener("click", () => pdfModal.classList.add("hidden"));
  pdfCustomizeToggle.addEventListener("click", () => {
    pdfDetailsVisible = !pdfDetailsVisible;
    pdfDetails.style.display = pdfDetailsVisible ? "block" : "none";
  });

  pdfExportBtn.addEventListener("click", () => {
    const note = document.getElementById("pdfNote").value || "";
    const density = document.getElementById("pdfDensity").value;
    const design = document.getElementById("pdfDesign").value;
    const paper = document.getElementById("pdfPaper").value;
    const font = document.getElementById("pdfFont").value;
    const top = document.getElementById("mTop").value;

    let content = `My Stay History Report\n\nGenerated: ${new Date().toLocaleString()}\n\nOptions:\n- Density: ${density}\n- Design: ${design}\n- Paper: ${paper}\n- Font: ${font}\n- Top margin: ${top} cm\n\nTemporary Note:\n${note}\n\nRows:\n`;

    document.querySelectorAll("#reportBody tr").forEach((row) => {
      if (row.style.display !== 'none') { // Only export visible rows
        const arr = Array.from(row.querySelectorAll("td"))
          .slice(0, 7)
          .map((td) => td.textContent.trim());
        content += arr.join(" | ") + "\n";
      }
    });

    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stay-history-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    pdfModal.classList.add("hidden");
  });

  /* ------------------------
     XLS / CSV modal
     ------------------------ */
  const xlsModal = document.getElementById("xlsModal");
  const xlsClose = document.getElementById("xlsClose");
  const xlsCancel = document.getElementById("xlsCancel");
  const xlsExportBtn = document.getElementById("xlsExportBtn");
  const xlsCustomizeBtn = document.getElementById("xlsCustomize");
  const xlsCustomizePanel = document.getElementById("xlsCustomizePanel");

  document.getElementById("exportXLS").addEventListener("click", (e) => {
    e.preventDefault();
    xlsModal.classList.remove("hidden");
    xlsModal.classList.add("flex");
  });
  document.getElementById("exportCSV").addEventListener("click", (e) => {
    e.preventDefault();
    xlsModal.classList.remove("hidden");
    xlsModal.classList.add("flex");
  });
  xlsClose.addEventListener("click", () => xlsModal.classList.add("hidden"));
  xlsCancel.addEventListener("click", () => xlsModal.classList.add("hidden"));
  xlsCustomizeBtn.addEventListener("click", () => {
    xlsCustomizePanel.classList.toggle("hidden");
  });
  xlsExportBtn.addEventListener("click", () => {
    const rows = [];
    rows.push("Booking ID,Customer,Room Type,Check-In,Check-Out,Nights,Amount Paid");
    document.querySelectorAll("#reportBody tr").forEach((tr) => {
      if (tr.style.display !== 'none') { // Only export visible rows
        const cols = Array.from(tr.querySelectorAll("td"))
          .slice(0, 7)
          .map((td) => td.textContent.trim().replace(/₹/g, "").replace(/,/g, ""));
        rows.push(cols.join(","));
      }
    });
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stay-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    xlsModal.classList.add("hidden");
  });
  (function () {

  /* ------------------------
     Print button (DOM-safe, no template backticks)
     ------------------------ */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      try {
        var table = document.querySelector('main table');
        if (!table) {
          showToast('Nothing to print', 3000);
          return;
        }

        // open new window and inject DOM nodes (avoid long string templates)
        var w = window.open('', '_blank');
        if (!w) {
          showToast('Popup blocked. Allow popups to print.', 4000);
          return;
        }

        var doc = w.document;

        // Create head + style safely
        var head = doc.head || doc.getElementsByTagName('head')[0] || doc.createElement('head');
        var styleEl = doc.createElement('style');
        styleEl.type = 'text/css';
        // simple print styles
        styleEl.appendChild(doc.createTextNode(
          'body{font-family:Arial,Helvetica,sans-serif;margin:20px;color:#222}' +
          'h3{font-size:18px;margin-bottom:12px}' +
          'table{width:100%;border-collapse:collapse}' +
          'th,td{padding:8px;border:1px solid #ddd;text-align:left}' +
          'thead{background:#f2f2f2}'
        ));
        head.appendChild(styleEl);

        // Build body content: heading + cloned table
        var body = doc.body || doc.getElementsByTagName('body')[0] || doc.createElement('body');
        // clear body
        body.innerHTML = '';
        var heading = doc.createElement('h3');
        heading.textContent = 'My Stay History';
        body.appendChild(heading);

        // Clone the table node into new document (preserves markup but not events)
        var clone = table.cloneNode(true);
        body.appendChild(clone);

        // If document wasn't attached, append head/body
        if (!doc.head) doc.appendChild(head);
        if (!doc.body) doc.appendChild(body);

        // Focus and print after a tiny delay to let browser render the DOM
        w.focus();
        setTimeout(function () { w.print(); }, 250);
      } catch (err) {
        console.error('Print failed:', err);
        showToast('Print failed — check console', 4000);
      }
    });
  }

  /* ------------------------
     Apply Filter button (handles both dropdown and custom dates)
     ------------------------ */
  var applyBtn = document.getElementById('applyFilterBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      console.log('Apply filter button clicked');
      applyFilters();
      showToast('Filters applied successfully', 2500);
    });
    console.log('Apply filter button event listener added');
  } else {
    console.error('Apply filter button not found');
  }

  /* ------------------------
     Custom Button - toggles date inputs
     ------------------------ */
  var customBtn = document.getElementById('customBtn');
  if (customBtn) {
    customBtn.addEventListener('click', function () {
      console.log('Custom button clicked');
      toggleCustomDateInputs();
    });
    console.log('Custom button event listener added');
  } else {
    console.error('Custom button not found');
  }

  /* ------------------------
     Clear Filters button
     ------------------------ */
  var clearBtn = document.getElementById('clearFilterBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      console.log('Clear filter button clicked');
      clearFilters();
      showToast('Filters cleared', 2000);
    });
    console.log('Clear filter button event listener added');
  } else {
    console.error('Clear filter button not found');
  }

  /* ------------------------
     Clear filters functionality
     ------------------------ */
  function clearFilters() {
    // Reset filter controls to default values
    document.getElementById('dateRange').value = 'all';
    document.getElementById('customerFilter').value = 'all';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    
    // Force hide custom date inputs
    var customInputs = document.getElementById('customDateInputs');
    var customBtn = document.getElementById('customBtn');
    if (customInputs && customBtn) {
      customInputs.classList.add('hidden');
      customInputs.classList.remove('flex');
      customBtn.textContent = 'Custom Dates';
      customBtn.classList.add('bg-orange-500');
      customBtn.classList.remove('bg-orange-600');
      customBtn.classList.add('hover:bg-orange-600');
      customBtn.classList.remove('hover:bg-orange-700');
      console.log('Custom date inputs hidden during clear filters');
    }
    
    // Show all rows
    var rows = document.querySelectorAll('#reportBody tr');
    rows.forEach(function (row) {
      row.style.display = '';
    });

    // Recalculate totals for all visible rows
    recalcTotals();
  }

  /* ------------------------
     Filter functionality (now handled globally)
     ------------------------ */

  /* ------------------------
     Toast utility (safe DOM)
     ------------------------ */
  function showToast(msg, timeout) {
    timeout = typeof timeout === 'number' ? timeout : 3000;
    var t = document.createElement('div');
    t.setAttribute('role', 'status');
    t.className = 'fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow z-50';
    t.style.fontFamily = 'Inter, Arial, Helvetica, sans-serif';
    t.textContent = msg;
    document.body.appendChild(t);

    // subtle fade-out
    setTimeout(function () {
      t.style.transition = 'opacity 300ms ease';
      t.style.opacity = '0';
      setTimeout(function () { try { t.remove(); } catch (e) { /* ignore */ } }, 300);
    }, timeout);
  }

  /* ------------------------
     Recalculate totals from visible table rows only
     ------------------------ */
  function recalcTotals() {
    var nights = 0;
    var amount = 0;
    var rows = document.querySelectorAll('#reportBody tr');
    rows.forEach(function (tr) {
      // Only count visible rows
      if (tr.style.display !== 'none') {
        try {
          var nightsCell = tr.children[5]; // Updated index for nights column
          var amountCell = tr.children[6]; // Updated index for amount column
          var n = parseInt((nightsCell && nightsCell.textContent) ? nightsCell.textContent.trim() : '0', 10) || 0;
          var amtText = (amountCell && amountCell.textContent) ? amountCell.textContent.trim() : '0';
          amtText = amtText.replace(/₹/g, '').replace(/,/g, '').trim();
          var a = parseFloat(amtText) || 0;
          nights += n;
          amount += a;
        } catch (e) { /* skip malformed row */ }
      }
    });

    var totalNightsEl = document.getElementById('totalNights');
    var totalAmountEl = document.getElementById('totalAmount');
    if (totalNightsEl) totalNightsEl.textContent = nights;
    if (totalAmountEl) totalAmountEl.textContent = '₹' + amount.toLocaleString('en-IN');
  }

  // initialize totals safely
  try { recalcTotals(); } catch (e) { /* ignore */ }

  // populate customer dropdown
  try { populateCustomerDropdown(); } catch (e) { /* ignore */ }

  /* ------------------------
     Keyboard & Escape behavior (defensive)
     ------------------------ */
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      var pdfModal = document.getElementById('pdfModal');
      var xlsModal = document.getElementById('xlsModal');
      var dateModal = document.getElementById('dateModal');
      var exportMenu = document.getElementById('exportMenu');

      if (pdfModal) pdfModal.classList.add('hidden');
      if (xlsModal) xlsModal.classList.add('hidden');
      if (dateModal) dateModal.classList.add('hidden');
      if (exportMenu) exportMenu.classList.add('hidden');
    }
  });



  // expose recalc for external calls if needed
  window.recalcStayTotals = recalcTotals;
})();

// Add global error handler
window.addEventListener('error', function(e) {
  console.error('Page error:', e.error);
});

// Ensure customer dropdown is populated when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for any dynamic content to load
  setTimeout(function() {
    try {
      populateCustomerDropdown();
      
      // Ensure custom inputs are hidden on page load
      var customInputs = document.getElementById('customDateInputs');
      var customBtn = document.getElementById('customBtn');
      if (customInputs && customBtn) {
        customInputs.classList.add('hidden');
        customInputs.classList.remove('flex');
        customBtn.textContent = 'Custom Dates';
        customBtn.classList.add('bg-orange-500');
        customBtn.classList.remove('bg-orange-600');
        customBtn.classList.add('hover:bg-orange-600');
        customBtn.classList.remove('hover:bg-orange-700');
        console.log('Custom date inputs initialized as hidden');
      }
      
      // Add change event listener to customer filter for debugging
      const customerFilter = document.getElementById('customerFilter');
      if (customerFilter) {
        customerFilter.addEventListener('change', function() {
          console.log('Customer filter changed to:', this.value);
          // Automatically apply filters when customer is selected
          if (typeof applyFilters === 'function') {
            applyFilters();
          }
        });
        
        // Test if dropdown is clickable
        customerFilter.addEventListener('click', function() {
          console.log('Customer dropdown clicked');
        });
        
        console.log('Customer dropdown setup complete. Options:', customerFilter.options.length);
      }

      // Add event listeners for date inputs (no auto-apply, just logging)
      const fromDate = document.getElementById('fromDate');
      const toDate = document.getElementById('toDate');
      const dateRange = document.getElementById('dateRange');

      // Add event listener to date range dropdown - NO AUTO HIDE
      if (dateRange) {
        dateRange.addEventListener('change', function() {
          console.log('Date range changed to:', this.value);
          // DO NOT auto-hide custom inputs - let user control it manually
        });
        console.log('Date range dropdown event listener added (no auto-hide)');
      }

      if (fromDate) {
        fromDate.addEventListener('change', function() {
          console.log('From date changed to:', this.value);
        });
      }

      if (toDate) {
        toDate.addEventListener('change', function() {
          console.log('To date changed to:', this.value);
        });
      }

      // Removed conflicting dateRange event listener that was causing toggle issues

    } catch (e) {
      console.log('Customer dropdown population failed:', e);
    }
  }, 500);
});

// Also try to populate on window load as a fallback
window.addEventListener('load', function() {
  setTimeout(function() {
    try {
      populateCustomerDropdown();
    } catch (e) {
      console.log('Customer dropdown population failed on window load:', e);
    }
  }, 100);
});

// Immediate call as soon as script loads
setTimeout(function() {
  try {
    console.log('Trying immediate population...');
    populateCustomerDropdown();
  } catch (e) {
    console.log('Immediate population failed:', e);
  }
}, 1000);
