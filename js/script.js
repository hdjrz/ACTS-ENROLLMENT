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
      document.getElementById('loading-screen').classList.add('fade-out');
    }, 420);
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
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
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

// ═══════════════ LOGOUT ═══════════════
function handleLogout() {
  const loader = document.getElementById('loading-screen');
  loader.querySelector('.loader-status').textContent = 'Signing out securely…';
  document.getElementById('loaderBar').style.width = '100%';
  loader.style.opacity = '1';
  loader.style.visibility = 'visible';
  loader.classList.remove('fade-out');
  setTimeout(() => {
    sessionStorage.removeItem('acts_authenticated');
    sessionStorage.removeItem('acts_user');
    window.location.href = 'login.html';
  }, 1200);
}
