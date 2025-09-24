            fetch("/Features/Components/Navbars/LoggedCustomerNavbar/index.html").then(r => r.text()).then(d => { document.getElementById("navbar").innerHTML = d; }).catch(()=>{});
    fetch("/Features/Components/Footers/CustomerFooter/index.html").then(r => r.text()).then(d => { document.getElementById("footer").innerHTML = d; }).catch(()=>{});
    
     const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  let overlay;
  menuToggle.addEventListener("click", () => {
    const isClosed = sidebar.classList.contains("-translate-x-full");
    sidebar.classList.toggle("-translate-x-full");
    toggleOverlay(isClosed); // show overlay only if we just opened
  });

  function toggleOverlay(show) {
    if (window.innerWidth > 1024) return; // don't overlay on large screens
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "drawerOverlay";
      overlay.className = "fixed inset-0 bg-black bg-opacity-30 z-20";
      overlay.addEventListener("click", () => {
        sidebar.classList.add("-translate-x-full");
        overlay.remove();
      });
    }
    if (show && !document.body.contains(overlay)) {
      document.body.appendChild(overlay);
    } else if (!show) {
      overlay?.remove();
    }
    if (sidebar.classList.contains("-translate-x-full")) overlay?.remove();
  }

   const exportToggle = document.getElementById("exportToggle");
  const exportMenu = document.getElementById("exportMenu");
  exportToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle("hidden");
  });
  document.addEventListener("click", () => {
    if (!exportMenu.classList.contains("hidden")) exportMenu.classList.add("hidden");
  });


    const reportSearch = document.getElementById("reportSearch");
  const reportList = document.getElementById("reportList");
  reportSearch.addEventListener("input", () => {
    const q = reportSearch.value.trim().toLowerCase();
    Array.from(reportList.querySelectorAll("a")).forEach((a) => {
      const txt = a.textContent.trim().toLowerCase();
      a.style.display = txt.includes(q) ? "" : "none";
    });
  });


   const dateRange = document.getElementById("dateRange");
  const dateModal = document.getElementById("dateModal");
  const dateClose = document.getElementById("dateClose");
  const dateCancel = document.getElementById("dateCancel");
  const dateApply = document.getElementById("dateApply");

  dateRange.addEventListener("change", () => {
    if (dateRange.value === "custom") {
      openDateModal();
    }
  });

  function openDateModal() {
    dateModal.classList.remove("hidden");
    dateModal.classList.add("flex");
  }
  function closeDateModal() {
    dateModal.classList.add("hidden");
    dateModal.classList.remove("flex");
  }
  dateClose.addEventListener("click", closeDateModal);
  dateCancel.addEventListener("click", closeDateModal);
  dateApply.addEventListener("click", () => {
    const from = document.getElementById("customFrom").value;
    const to = document.getElementById("customTo").value;
    dateRange.value = `${from} → ${to}`;
    closeDateModal();
  });
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
      const arr = Array.from(row.querySelectorAll("td"))
        .slice(0, 6)
        .map((td) => td.textContent.trim());
      content += arr.join(" | ") + "\n";
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
    rows.push("Booking ID,Room Type,Check-In,Check-Out,Nights,Amount Paid");
    document.querySelectorAll("#reportBody tr").forEach((tr) => {
      const cols = Array.from(tr.querySelectorAll("td"))
        .slice(0, 6)
        .map((td) => td.textContent.trim().replace(/₹/g, "").replace(/,/g, ""));
      rows.push(cols.join(","));
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
  // ensure overlay var exists in this scope (if your other code also uses overlay that's fine)
  var overlay = window.__reportsDrawerOverlay || null;
  window.__reportsDrawerOverlay = overlay;

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
     Run Report button
     ------------------------ */
  var runBtn = document.getElementById('runReportBtn');
  if (runBtn) {
    runBtn.addEventListener('click', function () {
      showToast('Report applied — showing filtered results (demo)', 2500);
      recalcTotals();
    });
  }

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
     Recalculate totals from table rows
     ------------------------ */
  function recalcTotals() {
    var nights = 0;
    var amount = 0;
    var rows = document.querySelectorAll('#reportBody tr');
    rows.forEach(function (tr) {
      try {
        var nightsCell = tr.children[4];
        var amountCell = tr.children[5];
        var n = parseInt((nightsCell && nightsCell.textContent) ? nightsCell.textContent.trim() : '0', 10) || 0;
        var amtText = (amountCell && amountCell.textContent) ? amountCell.textContent.trim() : '0';
        amtText = amtText.replace(/₹/g, '').replace(/,/g, '').trim();
        var a = parseFloat(amtText) || 0;
        nights += n;
        amount += a;
      } catch (e) { /* skip malformed row */ }
    });

    var totalNightsEl = document.getElementById('totalNights');
    var totalAmountEl = document.getElementById('totalAmount');
    if (totalNightsEl) totalNightsEl.textContent = nights;
    if (totalAmountEl) totalAmountEl.textContent = '₹' + amount.toLocaleString('en-IN');
  }

  // initialize totals safely
  try { recalcTotals(); } catch (e) { /* ignore */ }

  /* ------------------------
     Keyboard & Escape behavior (defensive)
     ------------------------ */
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      var pdfModal = document.getElementById('pdfModal');
      var xlsModal = document.getElementById('xlsModal');
      var dateModal = document.getElementById('dateModal');
      var exportMenu = document.getElementById('exportMenu');
      var sb = document.getElementById('sidebar');

      if (pdfModal) pdfModal.classList.add('hidden');
      if (xlsModal) xlsModal.classList.add('hidden');
      if (dateModal) dateModal.classList.add('hidden');
      if (exportMenu) exportMenu.classList.add('hidden');
      if (sb) sb.classList.add('-translate-x-full');

      // overlay cleanup (if overlay exists and is attached)
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  });

  // responsive cleanup overlay when resizing
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024 && overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  });

  // expose recalc for external calls if needed
  window.recalcStayTotals = recalcTotals;
})();
