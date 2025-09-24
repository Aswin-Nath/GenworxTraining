
        // Simple nav/sidebar content loader (keeps original structure as requested)
    fetch("/Features/Components/Navbars/AdminMainPageNavbar/index.html").then(res => res.text()).then(data => {
      document.getElementById("navbar").innerHTML = data;
    }).catch(() => {
      // fallback minimal nav if fetch fails in demo
      document.getElementById("navbar").innerHTML = `<div class="fixed top-0 left-0 right-0 bg-white shadow z-30"><div class="max-w-7xl mx-auto p-4 flex justify-between items-center"><div class="font-bold text-yellow-600">LuxuryStay</div></div></div>`;
    });

    fetch("/Features/Components/Sidebars/AdminMainPageSidebar/index.html").then(res => res.text()).then(data => {
      document.getElementById("sidebar").innerHTML = data;
      // color active link if any
      const currentPage = "backup";
      document.querySelectorAll("#sidebar a").forEach(link => {
        if (link.dataset.page === currentPage) {
          link.classList.add("text-yellow-600", "font-bold");
        }
      });
    }).catch(() => {
      // fallback mini sidebar
      document.getElementById("sidebar").innerHTML = `<div class="p-6"><div class="mb-6 font-bold text-yellow-600">LuxuryStay</div><nav class="space-y-2"><a class="block py-2 text-sm text-gray-700" data-page="dashboard">Dashboard</a><a class="block py-2 text-sm text-gray-700" data-page="rooms">Rooms</a><a class="block py-2 text-sm text-gray-700" data-page="customers">Customers</a></nav></div>`;
    });


    document.addEventListener("DOMContentLoaded", () => {

      /* ------------------------------
         Data & Simulated backend
         ------------------------------ */

      // utility
      const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
      const nowISO = () => new Date().toISOString();
      const formatDate = (iso) => new Date(iso).toLocaleString();

      // In-memory "backup index" and "restore log"
      const BACKUPS = []; // { id, type, createdAt, sizeMB, status, fileName, retentionDays }
      const RESTORES = []; // { id, backupId, mode, notes, createdAt, status }

      // Simulate existing backups
      for (let i=0;i<8;i++) {
        const t = ['full','database','bookings','customers'][rand(0,3)];
        const created = new Date(); created.setDate(created.getDate() - rand(1,90));
        BACKUPS.push({
          id: 'BK' + (1000 + i),
          type: t,
          createdAt: created.toISOString(),
          sizeMB: rand(50, 2048),
          status: Math.random()>0.05 ? 'SUCCESS' : 'FAILED',
          fileName: `backup_${t}_${i}.tar.gz`,
          retentionDays: [30,60,90,180][rand(0,3)]
        });
      }

      // helper to generate a backup object
      function createBackupObj(type, retention) {
        const id = 'BK' + (1000 + BACKUPS.length + 1);
        const sizeMB = Math.max(20, Math.round(Math.random()*2000));
        return {
          id,
          type,
          createdAt: new Date().toISOString(),
          sizeMB,
          status: 'SUCCESS',
          fileName: `${id}_${type}_${Date.now()}.tar.gz`,
          retentionDays: retention || 30
        };
      }

      // helper to generate restore object
      function createRestoreObj(backupId, mode, notes) {
        const id = 'RS' + (2000 + RESTORES.length + 1);
        return {
          id,
          backupId,
          mode,
          notes: notes || '',
          createdAt: new Date().toISOString(),
          status: 'COMPLETED'
        };
      }

      /* ------------------------------
         UI references
         ------------------------------ */
      const tabBackup = document.getElementById('tabBackup');
      const tabRecover = document.getElementById('tabRecover');
      const panelBackup = document.getElementById('panelBackup');
      const panelRecover = document.getElementById('panelRecover');

      const backupHistoryTbody = document.getElementById('backupHistoryTbody');
      const restoreHistoryTbody = document.getElementById('restoreHistoryTbody');
      const restoreSelect = document.getElementById('restoreSelect');
      const lastBackupTime = document.getElementById('lastBackupTime');
      const lastBackupCard = document.getElementById('lastBackupCard');
      const totalBackupsEl = document.getElementById('totalBackups');
      const storageUsedEl = document.getElementById('storageUsed');
      const storageBar = document.getElementById('storageBar');
      const activeSchedulesCount = document.getElementById('activeSchedulesCount');

      /* ------------------------------
         Tab behavior
         ------------------------------ */
      function showBackupTab() {
        tabBackup.classList.add('tab-active');
        tabRecover.classList.remove('tab-active');
        panelBackup.classList.remove('hidden');
        panelRecover.classList.add('hidden');
      }
      function showRecoverTab() {
        tabBackup.classList.remove('tab-active');
        tabRecover.classList.add('tab-active');
        panelBackup.classList.add('hidden');
        panelRecover.classList.remove('hidden');
      }
      tabBackup.addEventListener('click', showBackupTab);
      tabRecover.addEventListener('click', showRecoverTab);

      /* ------------------------------
         Render functions
         ------------------------------ */

      function renderBackupHistory(filterText = '') {
        backupHistoryTbody.innerHTML = '';
        const rows = BACKUPS
          .filter(b => {
            if (!filterText) return true;
            const q = filterText.toLowerCase();
            return b.id.toLowerCase().includes(q) || b.type.toLowerCase().includes(q) || b.fileName.toLowerCase().includes(q);
          })
          .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        rows.forEach(b => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 px-3"><div class="text-sm font-medium">${b.id}</div></td>
            <td class="py-2 px-3">${formatDate(b.createdAt)}</td>
            <td class="py-2 px-3">${b.type}</td>
            <td class="py-2 px-3">${b.sizeMB}</td>
            <td class="py-2 px-3"><span class="${b.status==='SUCCESS'?'text-green-600':'text-red-600'} font-semibold">${b.status}</span></td>
            <td class="py-2 px-3">
              <div class="flex items-center gap-2">
                <button class="px-2 py-1 bg-gray-100 rounded text-xs" data-action="download" data-id="${b.id}">Download</button>
                <button class="px-2 py-1 bg-yellow-500 text-white rounded text-xs" data-action="restore" data-id="${b.id}">Restore</button>
                <button class="px-2 py-1 bg-red-500 text-white rounded text-xs" data-action="delete" data-id="${b.id}">Delete</button>
              </div>
            </td>
          `;
          backupHistoryTbody.appendChild(tr);
        });

        // update summary
        totalBackupsEl.textContent = BACKUPS.length;
        const totalSize = BACKUPS.reduce((s,b)=>s+b.sizeMB,0);
        storageUsedEl.textContent = `${Math.round(totalSize/1024 * 100)/100} GB`;
        const pct = Math.min(100, Math.round(totalSize/1024 / 100 * 100)); // assume 100GB capacity in demo
        storageBar.style.width = `${pct}%`;
        lastBackupCard.textContent = BACKUPS.length ? formatDate(BACKUPS[0].createdAt) : '—';
        lastBackupTime.textContent = BACKUPS.length ? formatDate(BACKUPS[0].createdAt) : '—';
      }

      function renderRestoreHistory(filterText = '') {
        restoreHistoryTbody.innerHTML = '';
        const rows = RESTORES
          .filter(r => {
            if (!filterText) return true;
            const q = filterText.toLowerCase();
            return r.id.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q) || r.backupId.toLowerCase().includes(q);
          })
          .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        rows.forEach(r => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="py-2 px-3">${r.id}</td>
            <td class="py-2 px-3">${formatDate(r.createdAt)}</td>
            <td class="py-2 px-3">${r.backupId}</td>
            <td class="py-2 px-3">${r.notes || '-'}</td>
            <td class="py-2 px-3"><span class="${r.status==='COMPLETED'?'text-green-600':'text-yellow-600'} font-semibold">${r.status}</span></td>
            <td class="py-2 px-3">
              <button class="px-2 py-1 bg-gray-100 rounded text-xs" data-restore-id="${r.id}">View Log</button>
            </td>
          `;
          restoreHistoryTbody.appendChild(tr);
        });
      }

      function populateRestoreSelect() {
        restoreSelect.innerHTML = '';
        BACKUPS.slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).forEach(b => {
          const opt = document.createElement('option');
          opt.value = b.id;
          opt.textContent = `${b.id} · ${b.type} · ${formatDate(b.createdAt)}`;
          restoreSelect.appendChild(opt);
        });
      }

      /* ------------------------------
         Event listeners & core actions
         ------------------------------ */

      // Run backup now
      document.getElementById('runBackupNow').addEventListener('click', () => {
        const type = document.getElementById('backupType').value;
        const retention = parseInt(document.getElementById('retentionDays').value) || 30;
        // simulate running
        const newBk = createBackupObj(type, retention);
        BACKUPS.unshift(newBk); // add to front
        renderBackupHistory(document.getElementById('backupFilter').value);
        populateRestoreSelect();
        flashToast(`Backup ${newBk.id} created (${newBk.type}).`);
      });

      // Dry run (simulate)
      document.getElementById('dryRunBackup').addEventListener('click', () => {
        flashToast('Dry run complete — configuration OK.');
      });

      // Schedule button (very simple simulated)
      const schedules = [];
      document.getElementById('scheduleBtn').addEventListener('click', () => {
        const freq = document.getElementById('scheduleFreq').value;
        const time = document.getElementById('scheduleTime').value || '02:00';
        const type = document.getElementById('scheduleType').value;
        schedules.push({ id: `SCH${schedules.length+1}`, freq, time, type, createdAt: new Date().toISOString() });
        activeSchedulesCount.textContent = schedules.length;
        flashToast('Scheduled backup created.');
      });

      // List schedules (simple alert)
      document.getElementById('listSchedules').addEventListener('click', () => {
        if (!schedules.length) return alert('No schedules defined.');
        let txt = 'Active schedules:\\n';
        schedules.forEach(s => txt += `${s.id}: ${s.freq} at ${s.time} (${s.type})\\n`);
        alert(txt);
      });

      // Purge old backups
      document.getElementById('purgeOldBackups').addEventListener('click', () => {
        const days = parseInt(document.getElementById('retentionCleanupDays').value) || 90;
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
        const before = BACKUPS.length;
        for (let i = BACKUPS.length-1; i>=0; i--) {
          if (new Date(BACKUPS[i].createdAt) < cutoff) BACKUPS.splice(i,1);
        }
        renderBackupHistory();
        populateRestoreSelect();
        flashToast(`Purged ${before - BACKUPS.length} backups older than ${days} days.`);
      });

      // Integrity check
      document.getElementById('runIntegrityCheck').addEventListener('click', () => {
        flashToast('Integrity check passed for recent backups.');
      });

      // Download metadata
      document.getElementById('downloadAllBackupsMeta').addEventListener('click', () => {
        exportToCsv(BACKUPS, 'backup_metadata.csv');
      });

      // Backup history actions (delegated)
      document.getElementById('backupHistoryTbody').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const bk = BACKUPS.find(x=>x.id===id);
        if (!bk) return;
        if (action === 'download') {
          // simulate download
          flashToast(`Downloading ${bk.fileName}...`);
        } else if (action === 'restore') {
          // pre-select and show recover tab modal
          showRecoverTab();
          setTimeout(()=> {
            // set restore select to chosen
            populateRestoreSelect();
            restoreSelect.value = id;
            // scroll into view
            document.getElementById('panelRecover').scrollIntoView({behavior:'smooth'});
          }, 80);
        } else if (action === 'delete') {
          const idx = BACKUPS.findIndex(x=>x.id===id);
          if (idx>=0) {
            BACKUPS.splice(idx,1);
            renderBackupHistory();
            populateRestoreSelect();
            flashToast(`Backup ${id} deleted.`);
          }
        }
      });

      // Apply backup filter
      document.getElementById('backupFilter').addEventListener('input', (e) => {
        renderBackupHistory(e.target.value);
      });

      // Export backup logs
      document.getElementById('exportBackupLogs').addEventListener('click', () => {
        exportToCsv(BACKUPS, 'backup_logs.csv');
      });

      // Export restore logs
      document.getElementById('exportRestoreLogs').addEventListener('click', () => {
        exportToCsv(RESTORES, 'restore_logs.csv');
      });

      // Export all logs
      document.getElementById('exportAllLogs').addEventListener('click', () => {
        exportToCsv(BACKUPS, 'backup_logs.csv');
        exportToCsv(RESTORES, 'restore_logs.csv');
        flashToast('Triggered export for both backup and restore logs.');
      });

      // Restore preview button
      document.getElementById('previewRestore').addEventListener('click', () => {
        const sel = restoreSelect.value;
        if (!sel) return alert('Select a backup to preview.');
        const bk = BACKUPS.find(b => b.id === sel);
        if (!bk) return alert('Backup not found.');
        // create preview content
        const previewDiv = document.getElementById('previewContent');
        previewDiv.innerHTML = `<div><strong>Backup:</strong> ${bk.id} · ${bk.type} · ${formatDate(bk.createdAt)}</div>
          <div class="mt-2"><strong>Estimated overwritten tables:</strong></div>
          <ul class="list-disc ml-5 mt-2 text-sm">
            <li>Bookings (keys: id, guest, checkIn, checkOut)</li>
            <li>Customers (keys: id, name, contact)</li>
            <li>Transactions (refunds & payments)</li>
          </ul>
          <div class="mt-2 text-xs text-yellow-700">Note: preview is a simulation and does not perform changes.</div>`;
        // show preview modal
        document.getElementById('previewModal').classList.remove('hidden');
        document.getElementById('previewModal').classList.add('flex');
      });

      // close preview
      document.getElementById('closePreview').addEventListener('click', () => {
        document.getElementById('previewModal').classList.add('hidden');
        document.getElementById('previewModal').classList.remove('flex');
      });

      // Restore button: show confirm modal
      document.getElementById('restoreBtn').addEventListener('click', () => {
        const sel = restoreSelect.value;
        if (!sel) return alert('Select a backup to restore.');

        const bk = BACKUPS.find(b => b.id === sel);
        if (!bk) return alert('Backup not found.');

        const mode = document.getElementById('restoreMode').value;
        const notes = document.getElementById('restoreNotes').value;

        // attach to confirm modal dataset
        const confirmModal = document.getElementById('confirmModal');
        confirmModal.dataset.backupId = sel;
        confirmModal.dataset.mode = mode;
        confirmModal.dataset.notes = notes;

        // show chosen details
        document.getElementById('confirmModalText').textContent = `You're about to restore backup ${bk.id} (${bk.type}) in "${mode}" mode. This will overwrite live data. Proceed?`;
        confirmModal.classList.remove('hidden');
        confirmModal.classList.add('flex');
      });

      // Cancel restore
      document.getElementById('cancelRestoreBtn').addEventListener('click', () => {
        document.getElementById('confirmModal').classList.add('hidden');
        document.getElementById('confirmModal').classList.remove('flex');
      });

      // Confirm restore
      document.getElementById('confirmRestoreBtn').addEventListener('click', () => {
        const confirmModal = document.getElementById('confirmModal');
        const backupId = confirmModal.dataset.backupId;
        const mode = confirmModal.dataset.mode;
        const notes = confirmModal.dataset.notes;
        // simulate restore
        const r = createRestoreObj(backupId, mode, notes);
        RESTORES.unshift(r);
        renderRestoreHistory();
        // close modal
        confirmModal.classList.add('hidden');
        confirmModal.classList.remove('flex');
        flashToast(`Restore ${r.id} started for ${backupId}.`);
      });

      // Restore history click (view logs)
      document.getElementById('restoreHistoryTbody').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const restoreId = btn.dataset.restoreId;
        const r = RESTORES.find(rr => rr.id === restoreId);
        if (!r) return;
        alert(`Restore log for ${r.id}:\\nBackup: ${r.backupId}\\nMode: ${r.mode}\\nNotes: ${r.notes}\\nStatus: ${r.status}\\nTime: ${formatDate(r.createdAt)}`);
      });

      // Export functions
      function exportToCsv(data, filename = 'export.csv') {
        if (!data || !data.length) {
          alert('No data to export.');
          return;
        }
        const keys = Object.keys(data[0]);
        const csvRows = [];
        csvRows.push(keys.join(','));
        for (const row of data) {
          const vals = keys.map(k => {
            let v = row[k];
            if (v === null || v === undefined) return '';
            if (typeof v === 'string') return `"${v.replace(/"/g,'""')}"`;
            return `"${String(v)}"`;
          });
          csvRows.push(vals.join(','));
        }
        const csvString = csvRows.join('\\n');
        const blob = new Blob([csvString], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      // Simple toast (ephemeral)
      function flashToast(msg) {
        const el = document.createElement('div');
        el.className = 'fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(()=> el.remove(), 2800);
      }

      /* ------------------------------
         Init: render and wire up lists
         ------------------------------ */
      renderBackupHistory();
      renderRestoreHistory();
      populateRestoreSelect();

      // wire up export restore logs button (already above)
      document.getElementById('exportRestoreLogs').addEventListener('click', () => exportToCsv(RESTORES, 'restore_logs.csv'));

      // wire up restoreFilter
      document.getElementById('restoreFilter').addEventListener('input', (e) => renderRestoreHistory(e.target.value));

      // wire up download metadata button
      document.getElementById('downloadAllBackupsMeta').addEventListener('click', () => exportToCsv(BACKUPS, 'backups_meta.csv'));

      /* ------------------------------
         Accessibility & mobile niceties
         ------------------------------ */
      // keyboard shortcut: B -> Backup tab, R -> Recover
      window.addEventListener('keydown', (ev) => {
        if (ev.key === 'b' || ev.key === 'B') showBackupTab();
        if (ev.key === 'r' || ev.key === 'R') showRecoverTab();
      });

      // mobile: collapse side nav when below width (demo behavior)
      function responsiveSidebar() {
        if (window.innerWidth < 900) {
          document.getElementById('sidebar').classList.add('hidden');
        } else {
          document.getElementById('sidebar').classList.remove('hidden');
        }
      }
      responsiveSidebar();
      window.addEventListener('resize', responsiveSidebar);

      /* ------------------------------
         Extra: allow CSV export for both logs via top nav button
         ------------------------------ */
      document.getElementById('exportAllLogs').addEventListener('click', () => {
        exportToCsv(BACKUPS, 'backup_logs.csv');
        exportToCsv(RESTORES, 'restore_logs.csv');
        flashToast('Backup & restore logs exported.');
      });

      /* ------------------------------
         Tiny demo: clicking a backup in the list preselects restore
         ------------------------------ */
      // Already handled via restore action above

    });