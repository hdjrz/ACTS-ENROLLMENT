// ═══════════════ LOADING SCREEN ═══════════════
const loadingSteps = [
  { pct: 15, msg: 'Connecting to portal…' },
  { pct: 30, msg: 'Authenticating student…' },
  { pct: 48, msg: 'Loading academic records…' },
  { pct: 62, msg: 'Fetching enrollment data…' },
  { pct: 75, msg: 'Syncing grade information…' },
  { pct: 88, msg: 'Loading financial records…' },
  { pct: 97, msg: 'Almost ready…' },
  { pct: 100, msg: 'Welcome back, Juan!' },
];

let stepIdx = 0;
const bar = document.getElementById('loaderBar');
const status = document.getElementById('loaderStatus');

function runLoader() {
  if (stepIdx >= loadingSteps.length) {
    setTimeout(() => {
      const screen = document.getElementById('loading-screen');
      screen.classList.add('fade-out');
      screen.addEventListener('transitionend', () => {
        screen.style.display = 'none';
        renderPreSched(selectedSec.id);
      }, { once: true });
    }, 500);
    return;
  }
  const step = loadingSteps[stepIdx++];
  bar.style.width = step.pct + '%';
  status.textContent = step.msg;
  const delay = stepIdx === loadingSteps.length ? 600 : Math.random() * 220 + 160;
  setTimeout(runLoader, delay);
}
setTimeout(runLoader, 300);

// ═══════════════ VIEW SWITCHING ═══════════════
const pageTitles = {
  dashboard:'Dashboard', grades:'Grade Viewing', schedule:'Class Schedule',
  announcements:'Announcements', evaluation:'Professor Evaluation',
  enrollment:'Enrollment', sectioning:'Sectioning', subjects:'Subject Assignment',
  tuition:'Tuition Fee', payments:'Payment Monitoring',
  contact:'Contact Info', profile:'My Profile',
  library:'Library System', documents:'Documents', standing:'Academic Standing',
  scholarship:'Scholarships', settings:'Account Settings'
};

function showView(id, navEl) {
  const loader = document.getElementById('contentLoader');
  loader.classList.add('show');

  setTimeout(() => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const view = document.getElementById('view-' + id);
    if (view) view.classList.add('active');
    if (navEl) navEl.classList.add('active');
    else {
      document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + id + "'")) {
          n.classList.add('active');
        }
      });
    }

    document.getElementById('pageTitle').textContent = pageTitles[id] || id;
    loader.classList.remove('show');

    if (window.innerWidth <= 960) closeSidebar();
  }, 380);
}

// ═══════════════ SIDEBAR ═══════════════
function toggleSidebar() {
  const isOpen = document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.body.style.overflow = '';
}

// ═══════════════ STAR RATINGS ═══════════════
function rateStar(el) {
  const row = el.closest('.star-row');
  const stars = row.querySelectorAll('.star');
  const idx = Array.from(stars).indexOf(el);
  stars.forEach((s, i) => s.classList.toggle('filled', i <= idx));
}

// ═══════════════ SUBMIT EVALUATION ═══════════════
function submitEval(cardId) {
  const card = document.getElementById(cardId);
  const badge = card.querySelector('.eval-pending-badge');
  const submitRow = card.querySelector('.eval-submit-row');
  const criteriaArea = card.querySelector('.eval-criteria');
  const commentArea = card.querySelector('.eval-comment');

  badge.className = 'eval-done-badge';
  badge.textContent = '✓ Submitted';

  const ratingDiv = document.createElement('div');
  ratingDiv.style.cssText = 'display:flex;align-items:center;gap:12px;background:var(--off);border-radius:10px;padding:12px 16px;';
  ratingDiv.innerHTML = '<span style="font-size:13px;color:var(--muted);">Overall Rating</span><div style="display:flex;gap:3px;"><span style="color:#f5a623;font-size:20px;">★</span><span style="color:#f5a623;font-size:20px;">★</span><span style="color:#f5a623;font-size:20px;">★</span><span style="color:#f5a623;font-size:20px;">★</span><span style="color:var(--border);font-size:20px;">★</span></div><span style="font-family:\'Sora\',sans-serif;font-size:16px;font-weight:700;color:var(--text);">4.0 / 5.0</span><span style="font-size:12px;color:var(--muted);">Submitted just now</span>';

  criteriaArea.replaceWith(ratingDiv);
  commentArea.remove();
  submitRow.remove();

  showToast('Evaluation submitted successfully', 'success');
}

// ═══════════════ CONTACT TABS ═══════════════
function switchContactTab(tabEl, sectionId) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  ['ctab-personal','ctab-guardian','ctab-address'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === sectionId ? '' : 'none';
  });
}

// ═══════════════ SETTINGS TABS ═══════════════
function switchSettingsTab(tabEl, sectionId) {
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
  ['stab-security','stab-privacy','stab-notif','stab-pref'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === sectionId ? '' : 'none';
  });
}

// ═══════════════ SAVE CONTACT ═══════════════
function saveContact() {
  const loader = document.getElementById('contentLoader');
  loader.querySelector('.cl-text').textContent = 'Saving changes…';
  loader.classList.add('show');
  setTimeout(() => {
    loader.classList.remove('show');
    loader.querySelector('.cl-text').textContent = 'Loading module…';
    showToast('Contact information saved successfully', 'success');
  }, 900);
}

// ═══════════════ TOAST ═══════════════
let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const icon = t.querySelector('.toast-icon');
  document.getElementById('toastMsg').textContent = msg;
  t.className = 'show ' + type;
  icon.textContent = type === 'success' ? '✓' : '✕';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ═══════════════ MODAL HELPERS ═══════════════
function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// ═══════════════ LOGOUT ═══════════════
function handleLogout() {
  openModal('logoutModal');
}

// ═══════════════ DOCUMENT UPLOAD ═══════════════
function uploadDoc(input, key, label) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const maxMB = 5;
  if (file.size > maxMB * 1024 * 1024) {
    showToast('File too large. Maximum size is 5 MB.', 'error');
    input.value = '';
    return;
  }
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  const tag = document.getElementById('doctag-' + key);
  const meta = document.getElementById('docmeta-' + key);
  const row = document.getElementById('docrow-' + key);
  if (tag) {
    tag.className = 'tag warn';
    tag.textContent = 'Pending';
  }
  if (meta) {
    meta.textContent = 'Uploaded ' + dateStr + ' · ' + file.name;
    meta.style.color = 'var(--muted)';
  }
  if (row) {
    row.style.borderLeft = '3px solid #c9a800';
    row.style.background = '#fdfbf0';
  }
  showToast(label + ' uploaded — awaiting review', 'success');
  input.value = '';
}

// ── ENROLLMENT: Program + Section Picker ──────────────────────────────────────

// Pre-assigned subjects per section (freshman 1st semester)
const sectionSchedules = {
  '1a': [
    { code:'GE001', title:'Understanding the Self',                units:3, type:'Lec', sched:'MWF 7:30–8:30',   room:'Rm 101', faculty:'Ms. A. Reyes' },
    { code:'GE002', title:'Mathematics in the Modern World',       units:3, type:'Lec', sched:'MWF 8:30–9:30',   room:'Rm 101', faculty:'Mr. B. Santos' },
    { code:'GE003', title:'Purposive Communication',               units:3, type:'Lec', sched:'TTH 7:30–9:00',   room:'Rm 102', faculty:'Ms. C. Lim' },
    { code:'GE004', title:'Readings in Phil. History',             units:3, type:'Lec', sched:'TTH 9:00–10:30',  room:'Rm 103', faculty:'Mr. D. Cruz' },
    { code:'GE005', title:'Science, Tech &amp; Society',           units:3, type:'Lec', sched:'MW 1:00–2:30',    room:'Rm 104', faculty:'Ms. E. Garcia' },
    { code:'CS101', title:'Computer Fundamentals &amp; Prog. 1',   units:3, type:'Lec+Lab', sched:'TTH 1:00–3:00', room:'Lab 301', faculty:'Mr. F. Torres' },
    { code:'PE001', title:'Physical Education 1',                  units:2, type:'PE',  sched:'F 3:00–5:00',     room:'Gym',    faculty:'Mr. G. Villanueva' },
    { code:'NSTP01',title:'NSTP 1',                                units:3, type:'NSTP',sched:'SAT 7:00–10:00',  room:'Hall B', faculty:'NSTP Office' },
  ],
  '1b': [
    { code:'GE001', title:'Understanding the Self',                units:3, type:'Lec', sched:'MWF 9:00–10:00',  room:'Rm 102', faculty:'Ms. A. Reyes' },
    { code:'GE002', title:'Mathematics in the Modern World',       units:3, type:'Lec', sched:'MWF 10:00–11:00', room:'Rm 102', faculty:'Mr. B. Santos' },
    { code:'GE003', title:'Purposive Communication',               units:3, type:'Lec', sched:'TTH 10:30–12:00', room:'Rm 105', faculty:'Ms. C. Lim' },
    { code:'GE004', title:'Readings in Phil. History',             units:3, type:'Lec', sched:'TTH 1:00–2:30',   room:'Rm 106', faculty:'Mr. D. Cruz' },
    { code:'GE005', title:'Science, Tech &amp; Society',           units:3, type:'Lec', sched:'MW 3:00–4:30',    room:'Rm 107', faculty:'Ms. E. Garcia' },
    { code:'CS101', title:'Computer Fundamentals &amp; Prog. 1',   units:3, type:'Lec+Lab', sched:'TTH 3:00–5:00', room:'Lab 302', faculty:'Mr. F. Torres' },
    { code:'PE001', title:'Physical Education 1',                  units:2, type:'PE',  sched:'W 4:30–6:00',     room:'Gym',    faculty:'Mr. G. Villanueva' },
    { code:'NSTP01',title:'NSTP 1',                                units:3, type:'NSTP',sched:'SAT 7:00–10:00',  room:'Hall B', faculty:'NSTP Office' },
  ],
  '1c': [
    { code:'GE001', title:'Understanding the Self',                units:3, type:'Lec', sched:'TTH 7:30–9:00',   room:'Rm 103', faculty:'Ms. A. Reyes' },
    { code:'GE002', title:'Mathematics in the Modern World',       units:3, type:'Lec', sched:'TTH 9:00–10:30',  room:'Rm 103', faculty:'Mr. B. Santos' },
    { code:'GE003', title:'Purposive Communication',               units:3, type:'Lec', sched:'MWF 7:30–8:30',   room:'Rm 108', faculty:'Ms. C. Lim' },
    { code:'GE004', title:'Readings in Phil. History',             units:3, type:'Lec', sched:'MWF 8:30–9:30',   room:'Rm 109', faculty:'Mr. D. Cruz' },
    { code:'GE005', title:'Science, Tech &amp; Society',           units:3, type:'Lec', sched:'TTH 1:00–2:30',   room:'Rm 110', faculty:'Ms. E. Garcia' },
    { code:'CS101', title:'Computer Fundamentals &amp; Prog. 1',   units:3, type:'Lec+Lab', sched:'MWF 1:00–3:00', room:'Lab 303', faculty:'Mr. F. Torres' },
    { code:'PE001', title:'Physical Education 1',                  units:2, type:'PE',  sched:'TH 3:00–5:00',    room:'Gym',    faculty:'Mr. G. Villanueva' },
    { code:'NSTP01',title:'NSTP 1',                                units:3, type:'NSTP',sched:'SAT 7:00–10:00',  room:'Hall B', faculty:'NSTP Office' },
  ]
};

function renderPreSched(secId) {
  const tbody = document.getElementById('preSchedTbody');
  const unitsEl = document.getElementById('preSchedUnits');
  if (!tbody) return;
  const subjects = sectionSchedules[secId] || [];
  const totalUnits = subjects.reduce((s, r) => s + r.units, 0);
  const typeColors = { 'Lec': 'info', 'Lec+Lab': 'info', 'PE': 'general', 'NSTP': 'general' };
  tbody.innerHTML = subjects.map(s =>
    `<tr>
      <td style="font-weight:600;font-size:11.5px;color:var(--muted);">${s.code}</td>
      <td>${s.title}</td>
      <td>${s.units}</td>
      <td><span class="tag ${typeColors[s.type] || 'info'}">${s.type}</span></td>
      <td>${s.sched}</td>
      <td>${s.room}</td>
      <td>${s.faculty}</td>
    </tr>`
  ).join('');
  if (unitsEl) unitsEl.textContent = totalUnits + ' units total';
}

const programLabels = {
  bscs: 'BS Computer Science',
  bsit: 'BS Information Technology',
  bsba: 'BS Business Administration',
  bsed: 'BS Education'
};
let selectedProgram = 'bscs';
let selectedSec = { id: '1a', name: 'Block 1A', sched: 'MWF 7:30–9:00', adviser: 'Ms. A. Reyes' };

function selectProgram(id) {
  document.querySelectorAll('.enroll-prog-card').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('[id^="check-"]').forEach(el => el.style.display = 'none');
  document.getElementById('prog-' + id).classList.add('selected');
  document.getElementById('check-' + id).style.display = 'flex';
  selectedProgram = id;
  document.getElementById('summProgram').textContent = programLabels[id] || id;
}

function selectSection(id, name, sched, room, adviser, filled, total) {
  document.querySelectorAll('.enroll-sec-card').forEach(el => {
    el.classList.remove('selected');
    const radio = el.querySelector('.enroll-sec-radio');
    if (radio) radio.textContent = '';
  });
  const card = document.getElementById('sec-' + id);
  if (!card) return;
  card.classList.add('selected');
  const radio = card.querySelector('.enroll-sec-radio');
  if (radio) radio.textContent = '●';
  selectedSec = { id, name, sched, adviser };
  document.getElementById('summSection').textContent = name;
  document.getElementById('summSchedule').textContent = sched;
  document.getElementById('summAdviser').textContent = adviser;
  renderPreSched(id);
}

function confirmEnrollment() {
  const btn = document.getElementById('confirmEnrollBtn');
  btn.disabled = true;
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg> Confirmed!';
  btn.style.background = '#0a6651';

  const badge = document.getElementById('enrollStatusBadge');
  if (badge) {
    badge.className = 'tag success';
    badge.textContent = 'Section Selected';
    badge.style.padding = '6px 14px';
    badge.style.fontSize = '12px';
    badge.style.borderRadius = '8px';
  }

  // Disable all section cards after confirm
  document.querySelectorAll('.enroll-sec-card').forEach(el => {
    el.style.pointerEvents = 'none';
  });
  document.querySelectorAll('.enroll-prog-card').forEach(el => {
    el.style.pointerEvents = 'none';
  });

  showToast('Section ' + selectedSec.name + ' confirmed — awaiting registrar approval', 'success');
}

function resetEnrollment() {
  // Re-enable cards
  document.querySelectorAll('.enroll-sec-card:not([id="sec-1d"])').forEach(el => {
    el.style.pointerEvents = '';
  });
  document.querySelectorAll('.enroll-prog-card').forEach(el => {
    el.style.pointerEvents = '';
  });
  const btn = document.getElementById('confirmEnrollBtn');
  btn.disabled = false;
  btn.style.background = '#1a7a4a';
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg> Confirm Section';
  const badge = document.getElementById('enrollStatusBadge');
  if (badge) {
    badge.className = 'tag warn';
    badge.textContent = 'Section Not Yet Selected';
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function confirmLogout() {
  closeModal('logoutModal');
  const loader = document.getElementById('loading-screen');
  loader.querySelector('.loader-status').textContent = 'Signing out securely…';
  document.getElementById('loaderBar').style.width = '100%';
  loader.style.display = '';
  loader.style.opacity = '1';
  loader.style.visibility = 'visible';
  loader.classList.remove('fade-out');
  setTimeout(() => {
    sessionStorage.removeItem('acts_authenticated');
    sessionStorage.removeItem('acts_user');
    loader.classList.add('fade-out');
    window.location.href = 'index.html';
  }, 1200);
}
