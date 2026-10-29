/**
 * DeepRoots Foundation - Interactive Logic
 * Handles Sticky Donation Bar, Modals, Live Progress, Donor Wall,
 * Preview Switcher, and Confetti Celebrations.
 */

// State Management
const STATE = {
  selectedAmount: 750,
  costPerMeal: 25,
  mealsFunded: 7450,
  mealsGoal: 10000,
  donorsCount: 248,
  activePreviewMode: 'desktop'
};

// Stories data for full report modal
const STORIES = {
  melghat: {
    category: 'Activities',
    date: 'October 2026',
    title: 'Over 1,200 Hot Meals Distributed in Melghat Tribal Belt During Daan Utsav',
    image: 'assets/images/daan-serving.jpg',
    content: `
      <p>Melghat, nestled in the Satpura hill ranges of Amravati district, has long wrestled with endemic child malnutrition. During the Daan Utsav 2026 drive, our DeepRoots field team mobilized 18 volunteers to navigate unpaved forest trails across 6 isolated korku tribal hamlets.</p>
      <br>
      <p>Working in close coordination with local Anganwadi workers, our team prepared fresh, wholesome meals consisting of fortified multigrain khichdi, seasonal greens, and fresh buttermilk. Over 1,200 meals were served with warmth and dignity to children, nursing mothers, and elderly persons.</p>
      <br>
      <p><strong>Impact Highlight:</strong> Identified 34 severely underweight infants who have now been enrolled into DeepRoots' 90-day targeted nutritional recovery monitoring program.</p>
    `
  },
  amravati: {
    category: 'Events',
    date: 'October 2026',
    title: 'Nutrition & Health Screening Camp Organized for 150+ Elders in Amravati',
    image: 'assets/images/community-smile.jpg',
    content: `
      <p>At our partner senior shelter in Rukhmini Nagar, Amravati, DeepRoots Foundation hosted a special Day of Care. Many elderly residents suffer from chronic age-related ailments compounded by poor nutritional absorption.</p>
      <br>
      <p>A voluntary medical team conducted hemoglobin checks, blood pressure screenings, and personalized dietary consultations. Every elder was treated to a traditional, freshly prepared multi-course meal designed specifically for geriatric digestive health.</p>
      <br>
      <p><strong>Ground Voice:</strong> <em>"Sitting together, sharing a hot meal, and laughing with young volunteers felt like family visiting us after years."</em> — Parvati-bai, 72.</p>
    `
  },
  'first-meal': {
    category: 'Announcements',
    date: 'September 2026',
    title: "DeepRoots Launches 'First Meal' Initiative Across 12 Vidarbha Villages",
    image: 'assets/images/hero-children.jpg',
    content: `
      <p>DeepRoots Foundation is proud to inaugurate the 'First Meal' program — our flagship school-readiness nutrition intervention designed to eradicate classroom hunger before the morning bell rings.</p>
      <br>
      <p>Across 12 government Zilla Parishad schools in rural Vidarbha, more than 1,500 children from marginalized families will receive a warm, protein-rich breakfast every school morning. Studies prove that morning nutrition boosts school attendance by up to 28% and drastically improves cognitive attention span.</p>
      <br>
      <p><strong>Join Us:</strong> Sponsor a child's morning meals for an entire academic term for just ₹1,250.</p>
    `
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateUrgencyBar();
  updateStickyMealsPreview();

  // Handle escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Light dismiss: Close native dialogs when backdrop is clicked
  const dialogs = document.querySelectorAll('dialog.app-modal');
  dialogs.forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        dialog.close();
      }
    });
  });
});

/* ==========================================================================
   VIEWPORT PREVIEW SWITCHER
   ========================================================================== */
function setPreviewMode(mode) {
  STATE.activePreviewMode = mode;
  const wrapper = document.getElementById('appViewportWrapper');
  const btnDesktop = document.getElementById('btnModeDesktop');
  const btnMobile = document.getElementById('btnModeMobile');

  if (mode === 'mobile') {
    wrapper.classList.add('mode-mobile');
    btnMobile.classList.add('active');
    btnDesktop.classList.remove('active');
    showToast('📱 Switched to Mobile Wireframe View (375px)', 'info');
  } else {
    wrapper.classList.remove('mode-mobile');
    btnDesktop.classList.add('active');
    btnMobile.classList.remove('active');
    showToast('💻 Switched to Full Desktop Web View', 'info');
  }
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION
   ========================================================================== */
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const isOpen = drawer.classList.contains('active');
  if (isOpen) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   STICKY DONATION BAR LOGIC
   ========================================================================== */
function selectQuickAmount(amount) {
  STATE.selectedAmount = Number(amount);

  // Update pills UI
  const pills = document.querySelectorAll('.amount-pill');
  pills.forEach(pill => {
    if (Number(pill.getAttribute('data-amount')) === amount) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Clear other amount input
  const otherInput = document.getElementById('otherAmountInput');
  if (otherInput) otherInput.value = '';

  updateStickyMealsPreview();
}

function handleOtherAmountInput(val) {
  const numericVal = Number(val);
  if (numericVal && numericVal > 0) {
    STATE.selectedAmount = numericVal;
    // Remove active state from pills
    document.querySelectorAll('.amount-pill').forEach(p => p.classList.remove('active'));
    updateStickyMealsPreview();
  }
}

function updateStickyMealsPreview() {
  const preview = document.getElementById('stickyMealsPreview');
  if (!preview) return;
  const meals = Math.floor(STATE.selectedAmount / STATE.costPerMeal);
  preview.innerHTML = `<span>Feeding <strong>${meals} ${meals === 1 ? 'child' : 'children'}</strong></span>`;
}

function submitStickyDonation() {
  openDonationModal(STATE.selectedAmount);
}

/* ==========================================================================
   DONATION MODAL LOGIC
   ========================================================================== */
function openDonationModal(amount) {
  if (amount) {
    STATE.selectedAmount = Number(amount);
  }

  const modal = document.getElementById('donationModal');
  const mealCount = Math.floor(STATE.selectedAmount / STATE.costPerMeal);

  // Populate modal fields
  document.getElementById('modalMealCount').textContent = mealCount;
  document.getElementById('modalAmountDisplay').textContent = `₹${STATE.selectedAmount.toLocaleString('en-IN')}`;
  document.getElementById('btnPayAmount').textContent = `₹${STATE.selectedAmount.toLocaleString('en-IN')}`;

  // Reset Form & Success State
  document.getElementById('donationForm').classList.remove('hidden');
  document.getElementById('donationSuccessView').classList.add('hidden');

  if (modal.showModal) {
    modal.showModal();
  } else {
    modal.setAttribute('open', 'true');
  }
}

function closeDonationModal() {
  const modal = document.getElementById('donationModal');
  if (modal.close) {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function togglePanField(checked) {
  const panBox = document.getElementById('panInputContainer');
  const panInput = document.getElementById('donorPan');
  if (checked) {
    panBox.classList.remove('hidden');
    panInput.setAttribute('required', 'true');
  } else {
    panBox.classList.add('hidden');
    panInput.removeAttribute('required');
  }
}

function processDonation(e) {
  e.preventDefault();

  const nameInput = document.getElementById('donorFullName');
  const donorName = nameInput.value.trim() || 'Generous Friend';
  const amount = STATE.selectedAmount;
  const meals = Math.floor(amount / STATE.costPerMeal);

  // Trigger celebration confetti
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Populate success receipt
  document.getElementById('donationForm').classList.add('hidden');
  document.getElementById('donationSuccessView').classList.remove('hidden');

  document.getElementById('successAmount').textContent = `₹${amount.toLocaleString('en-IN')}`;
  document.getElementById('successMeals').textContent = `${meals} meals`;
  document.getElementById('successName').textContent = donorName;
  document.getElementById('successTxnId').textContent = `DRF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  // Update Campaign Progress
  STATE.mealsFunded += meals;
  updateUrgencyBar();

  // Add donor to the live Hall of Kindness wall
  addDonorToWall(donorName, amount, meals);

  showToast(`🙏 Thank you, ${donorName}! You just funded ${meals} meals!`, 'success');
}

function addDonorToWall(name, amount, meals) {
  const grid = document.getElementById('donorWallGrid');
  if (!grid) return;

  // Extract initials
  const parts = name.split(' ');
  const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

  const item = document.createElement('div');
  item.className = 'donor-wireframe-item';
  item.style.borderColor = 'var(--color-primary)';
  item.style.background = '#FFF8F4';

  item.innerHTML = `
    <div class="donor-avatar" style="background: var(--color-primary); color: #FFF;">${initials}</div>
    <div class="donor-info">
      <span class="donor-name">${escapeHtml(name)} <small style="color:#059669; font-weight:700;">★ Just now</small></span>
      <span class="donor-amount">₹${amount.toLocaleString('en-IN')} <small>(${meals} meals)</small></span>
    </div>
    <span class="donor-time">Just now</span>
  `;

  // Prepend to donor wall
  grid.insertBefore(item, grid.firstChild);

  // Keep grid to 8 items
  if (grid.children.length > 12) {
    grid.removeChild(grid.lastChild);
  }
}

function updateUrgencyBar() {
  const mealsCountEl = document.getElementById('liveMealsCount');
  const percentageEl = document.getElementById('livePercentage');
  const progressFill = document.getElementById('urgencyProgressFill');

  if (mealsCountEl) {
    mealsCountEl.textContent = STATE.mealsFunded.toLocaleString('en-IN');
  }

  const pct = Math.min(100, ((STATE.mealsFunded / STATE.mealsGoal) * 100)).toFixed(1);

  if (percentageEl) {
    percentageEl.textContent = `${pct}% Funded`;
  }
  if (progressFill) {
    progressFill.style.width = `${pct}%`;
  }
}

function downloadReceiptMock() {
  const name = document.getElementById('successName').textContent;
  const amount = document.getElementById('successAmount').textContent;
  const txn = document.getElementById('successTxnId').textContent;

  const receiptContent = `
======================================================
         DEEPROOTS FOUNDATION - 80G TAX RECEIPT
======================================================
CIN: U88900ME2026NPL476439
Darpan ID: MH/2026/0491823
80G Exemption Reg No: AAATD1234EF20261
Registered Office: 24/1/23, Gauri Shankar Nagar, Rukhmini Nagar,
                  Amravati - 444606, Maharashtra
------------------------------------------------------
Receipt / Txn Ref: ${txn}
Date: ${new Date().toLocaleDateString('en-IN')}
Donor Name: ${name}
Amount Contributed: ${amount}
Purpose: Vidarbha First Meal Child Nutrition Drive (Daan Utsav)
Tax Status: 50% Exempt under Section 80G of Income Tax Act 1961
------------------------------------------------------
Thank you for standing with the children and elders of Vidarbha!
DeepRoots Foundation | www.deeprootsfoundation.org
======================================================
`;

  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `DeepRoots_80G_Receipt_${txn}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('📄 80G Donation Receipt downloaded!', 'success');
}

/* ==========================================================================
   VOLUNTEER & PARTNER MODALS
   ========================================================================== */
function openVolunteerModal() {
  const modal = document.getElementById('volunteerModal');
  if (modal.showModal) modal.showModal();
}

function closeVolunteerModal() {
  const modal = document.getElementById('volunteerModal');
  if (modal.close) modal.close();
}

function handleVolunteerSubmit(e) {
  e.preventDefault();
  closeVolunteerModal();
  showToast('🌟 Volunteer application received! Our team will call you within 24 hours.', 'success');
}

function openPartnerModal() {
  const modal = document.getElementById('partnerModal');
  if (modal.showModal) modal.showModal();
}

function closePartnerModal() {
  const modal = document.getElementById('partnerModal');
  if (modal.close) modal.close();
}

function handlePartnerSubmit(e) {
  e.preventDefault();
  closePartnerModal();
  showToast('🤝 Partnership inquiry submitted! Our CSR team will connect shortly.', 'success');
}

/* ==========================================================================
   BLOG / STORIES FILTER & DETAIL MODAL
   ========================================================================== */
function filterBlogPosts(category) {
  const tabs = document.querySelectorAll('.blog-tab');
  tabs.forEach(t => {
    if (t.getAttribute('data-category') === category) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.blog-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function openStoryModal(storyKey) {
  const story = STORIES[storyKey];
  if (!story) return;

  const container = document.getElementById('storyModalContent');
  container.innerHTML = `
    <div class="modal-badge">${escapeHtml(story.category)} • ${escapeHtml(story.date)}</div>
    <h3 style="font-family: var(--font-display); font-size: 1.45rem; margin: 10px 0 16px;">${escapeHtml(story.title)}</h3>
    <img src="${story.image}" alt="${escapeHtml(story.title)}" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 16px; max-height: 260px; object-fit: cover;">
    <div style="font-size: 0.94rem; line-height: 1.65; color: var(--color-text-muted);">
      ${story.content}
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <button class="btn btn-orange" onclick="closeStoryModal(); openDonationModal(750);">Support This Work with a Meal &rarr;</button>
    </div>
  `;

  const modal = document.getElementById('storyModal');
  if (modal.showModal) modal.showModal();
}

function closeStoryModal() {
  const modal = document.getElementById('storyModal');
  if (modal.close) modal.close();
}

function closeAllModals() {
  closeDonationModal();
  closeVolunteerModal();
  closePartnerModal();
  closeStoryModal();
}

/* ==========================================================================
   CAMPAIGN SOCIAL SHARING
   ========================================================================== */
function shareCampaign(platform) {
  const url = window.location.href;
  const text = "Join me in supporting DeepRoots Foundation this Daan Utsav! Every ₹25 provides a warm, nutritious meal to children and elders in Vidarbha. 🌾 100% Tax Exempt (80G).";

  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  } else if (platform === 'linkedin') {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  } else if (platform === 'copy') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('🔗 Campaign link copied to clipboard!', 'info');
      }).catch(() => {
        showToast('🔗 Link: ' + url, 'info');
      });
    } else {
      showToast('🔗 Link: ' + url, 'info');
    }
  }
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
