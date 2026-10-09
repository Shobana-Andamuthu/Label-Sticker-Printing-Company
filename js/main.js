/**
 * PrintLabel Pro — Interactive Client Logic
 * Handles Theme (Dark/Light), Direction (LTR/RTL), Instant Calculator,
 * Mobile Menu, Modals, Tabs, and Attractive Page Preloader.
 */

// Handle preloader dismissal as early as possible
initPageLoader();

function initAllComponents() {
  initTheme();
  initDirection();
  initNavigation();
  initBackToTop();
  initProductFilter();
  initShapeSelector();
  initQuoteCalculator();
  initProductsCatalog();
  initCustomDesignUpload();
  initContactQuoteForm();
  initAuthPage();
  initModals();
  initFAQAccordion();
  initCustomSelects();
  initCustomDatePicker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllComponents);
} else {
  initAllComponents();
}

/* ==========================================================================
   0. Attractive Page Loader / Preloader
   ========================================================================== */
function initPageLoader() {
  const hideLoader = () => {
    const loader = document.getElementById('page-loader');
    if (loader && !loader.classList.contains('loaded')) {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 550);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(hideLoader, 300);
    });
    // Fallback safety timeout (max 1.2s so user never waits unnecessarily)
    setTimeout(hideLoader, 1200);
  }
}

/* ==========================================================================
   1. Theme Management (Light / Dark Mode with Persistence - Silent Toggle)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('#theme-toggle-btn, .theme-toggle-btn, .theme-toggle-btn-mobile');
  const themeIcons = document.querySelectorAll('#theme-icon, .theme-icon, .theme-icon-mobile');
  const themeTexts = document.querySelectorAll('#theme-text, .theme-text, .theme-text-mobile');
  
  // Read saved or system theme
  const savedTheme = localStorage.getItem('printcraft_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('printcraft_theme', theme);
    
    themeIcons.forEach(icon => {
      if (theme === 'dark') {
        icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    });

    themeTexts.forEach(text => {
      text.textContent = theme === 'dark' ? 'Light' : 'Dark';
    });
  }
}

/* ==========================================================================
   2. Direction Management (LTR / RTL with Persistence - Silent Toggle)
   ========================================================================== */
function initDirection() {
  const rtlToggleBtns = document.querySelectorAll('#rtl-toggle-btn, .rtl-toggle-btn, .rtl-toggle-btn-mobile');
  const rtlTexts = document.querySelectorAll('#rtl-text, .rtl-text, .rtl-text-mobile');

  const savedDir = localStorage.getItem('printcraft_dir') || 'ltr';
  applyDirection(savedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
    });
  });

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('printcraft_dir', dir);
    rtlTexts.forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
}

/* ==========================================================================
   3. Header Navigation & Mobile Menu Drawer
   ========================================================================== */
function initNavigation() {
  const mobileToggles = document.querySelectorAll('#mobile-toggle, #menu-toggle-btn, .mobile-toggle, .menu-toggle-btn');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-menu-wrapper .nav-link:not([aria-haspopup="true"]), .mobile-drawer-actions a, .dropdown-item');
  const dropdownParents = document.querySelectorAll('.nav-item-dropdown');

  const updateToggleIcons = (isOpen) => {
    mobileToggles.forEach(toggle => {
      toggle.setAttribute('aria-expanded', isOpen);
      const hamburger = toggle.querySelector('.hamburger-icon');
      const closeIcon = toggle.querySelector('.close-icon');
      if (hamburger && closeIcon) {
        hamburger.style.display = isOpen ? 'none' : 'block';
        closeIcon.style.display = isOpen ? 'block' : 'none';
      }
    });
  };

  const closeAllDropdowns = () => {
    dropdownParents.forEach(p => p.classList.remove('active'));
  };

  mobileToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenuWrapper) {
        const isOpen = navMenuWrapper.classList.toggle('open');
        updateToggleIcons(isOpen);
        if (!isOpen) {
          closeAllDropdowns();
        }
      }
    });
  });

  // Close mobile drawer and dropdowns when any link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1199 && navMenuWrapper && navMenuWrapper.classList.contains('open')) {
        navMenuWrapper.classList.remove('open');
        updateToggleIcons(false);
        closeAllDropdowns();
      }
    });
  });

  // Mobile / tablet dropdown toggle
  dropdownParents.forEach(parent => {
    const link = parent.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1199) {
          e.preventDefault();
          parent.classList.toggle('active');
        }
      });
    }
  });

  // Close nav and dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (navMenuWrapper && navMenuWrapper.classList.contains('open') && !e.target.closest('.main-header')) {
      navMenuWrapper.classList.remove('open');
      updateToggleIcons(false);
      closeAllDropdowns();
    }
  });

  // Sticky Header Scroll Elevation Effect
  const header = document.querySelector('.main-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

/* ==========================================================================
   4. Back To Top
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. Product Filter Tabs
   ========================================================================== */
function initProductFilter() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || cardCategory === filterCategory || cardCategory.includes(filterCategory)) {
          card.classList.remove('is-hidden');
          card.style.setProperty('display', 'flex', 'important');
        } else {
          card.classList.add('is-hidden');
          card.style.setProperty('display', 'none', 'important');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Custom Shapes Selector Interactive Preview
   ========================================================================== */
function initShapeSelector() {
  const shapeItems = document.querySelectorAll('.shape-item');
  shapeItems.forEach(item => {
    item.addEventListener('click', () => {
      shapeItems.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const shapeName = item.querySelector('.shape-name').textContent;
      
      // Auto-populate quote calculator if shape matches silently
      const quoteShapeSelect = document.getElementById('calc-shape');
      if (quoteShapeSelect) {
        for (let i = 0; i < quoteShapeSelect.options.length; i++) {
          if (quoteShapeSelect.options[i].text.toLowerCase().includes(shapeName.toLowerCase())) {
            quoteShapeSelect.selectedIndex = i;
            updateQuoteCalculation();
            break;
          }
        }
      }
    });
  });
}

/* ==========================================================================
   7. Instant Quotation Calculator (Live Cost Estimator)
   ========================================================================== */
function initQuoteCalculator() {
  const productSelect = document.getElementById('calc-product');
  const shapeSelect = document.getElementById('calc-shape');
  const materialSelect = document.getElementById('calc-material');
  const finishSelect = document.getElementById('calc-finish');
  const sizeSelect = document.getElementById('calc-size');
  const qtyInput = document.getElementById('calc-qty');
  const quoteForm = document.getElementById('quote-calc-form');

  const inputs = [productSelect, shapeSelect, materialSelect, finishSelect, sizeSelect, qtyInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('change', updateQuoteCalculation);
      input.addEventListener('input', updateQuoteCalculation);
    }
  });

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      openModal('modal-upload');
    });
  }

  // Initial calculate
  updateQuoteCalculation();
}

function updateQuoteCalculation() {
  const productSelect = document.getElementById('calc-product');
  const materialSelect = document.getElementById('calc-material');
  const finishSelect = document.getElementById('calc-finish');
  const qtyInput = document.getElementById('calc-qty');

  const unitPriceEl = document.getElementById('calc-unit-price');
  const totalPriceEl = document.getElementById('calc-total-price');
  const turnaroundEl = document.getElementById('calc-turnaround');

  if (!qtyInput || !totalPriceEl || !unitPriceEl) return;

  const qty = parseInt(qtyInput.value, 10) || 500;
  
  // Base cost per label scaling down with volume
  let baseUnit = 0.45;
  if (qty >= 10000) baseUnit = 0.05;
  else if (qty >= 5000) baseUnit = 0.09;
  else if (qty >= 2500) baseUnit = 0.14;
  else if (qty >= 1000) baseUnit = 0.22;
  else if (qty >= 500) baseUnit = 0.32;
  else if (qty >= 250) baseUnit = 0.42;
  else if (qty >= 100) baseUnit = 0.65;
  else baseUnit = 0.95;

  // Multipliers based on material & finish
  let materialMultiplier = 1.0;
  if (materialSelect) {
    const mat = materialSelect.value;
    if (mat === 'foil') materialMultiplier = 1.35;
    else if (mat === 'clear') materialMultiplier = 1.2;
    else if (mat === 'textured') materialMultiplier = 1.25;
    else if (mat === 'kraft') materialMultiplier = 1.1;
  }

  let finishMultiplier = 1.0;
  if (finishSelect) {
    const fin = finishSelect.value;
    if (fin === 'emboss') finishMultiplier = 1.3;
    else if (fin === 'foil') finishMultiplier = 1.35;
    else if (fin === 'matte') finishMultiplier = 1.05;
    else if (fin === 'uv') finishMultiplier = 1.1;
  }

  const finalUnitPrice = (baseUnit * materialMultiplier * finishMultiplier);
  const finalTotal = Math.max(25, (finalUnitPrice * qty)); // Min order threshold

  unitPriceEl.textContent = `$${finalUnitPrice.toFixed(3)}`;
  totalPriceEl.textContent = `$${finalTotal.toFixed(2)}`;

  if (turnaroundEl) {
    turnaroundEl.textContent = qty > 5000 ? '2 - 3 Business Days' : 'Next-Day Dispatch (24h)';
  }
}

/* ==========================================================================
   8. Modals Management (Clean Dialogs)
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Modal forms handler
  const sampleForm = document.getElementById('sample-pack-form');
  if (sampleForm) {
    sampleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
    });
  }

  const uploadForm = document.getElementById('artwork-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof initCustomSelects === 'function') initCustomSelects();
    if (typeof initCustomDatePicker === 'function') initCustomDatePicker();
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/* ==========================================================================
   9. Products Catalog Search & Category Filtering (Phase 3)
   ========================================================================== */
function initProductsCatalog() {
  const searchInput = document.getElementById('product-search-input');
  const catalogGrid = document.getElementById('catalog-grid');
  const productCards = catalogGrid ? Array.from(catalogGrid.querySelectorAll('.catalog-card')) : Array.from(document.querySelectorAll('.catalog-card'));
  const countDisplay = document.getElementById('product-count-display');
  const noResultsMsg = document.getElementById('no-products-msg');
  const resetBtn = document.getElementById('reset-filters-btn');
  const paginationContainer = document.getElementById('catalog-pagination');
  const paginationInfo = document.getElementById('pagination-info');
  const paginationWrap = document.getElementById('catalog-pagination-wrap');

  if (!productCards.length) return;

  const itemsPerPage = 6;
  let currentPage = 1;
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let matchingCards = [];

  // Direct click listeners on all category filter buttons
  const catButtons = document.querySelectorAll('.cat-nav-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = (btn.getAttribute('data-category') || 'all').trim().toLowerCase();
      currentPage = 1;
      applyFilters();
    });
  });

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      applyFilters();
    });
  }

  // Reset button handler
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      currentCategory = 'all';
      currentPage = 1;
      catButtons.forEach(b => b.classList.remove('active'));
      const allBtn = document.querySelector('.cat-nav-btn[data-category="all"]');
      if (allBtn) allBtn.classList.add('active');
      applyFilters();
    });
  }

  function applyFilters() {
    const activeCat = currentCategory.toLowerCase().trim();

    // 1. Filter matching cards from the complete dataset
    matchingCards = productCards.filter(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase().trim();
      const cardTitle = (card.querySelector('.catalog-title')?.textContent || '').toLowerCase().trim();
      const cardDesc = (card.querySelector('.catalog-desc')?.textContent || '').toLowerCase().trim();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase().trim();
      const catArray = cardCategory.split(/[ ,]+/);

      const matchesCat = (activeCat === 'all' || catArray.includes(activeCat));
      const matchesSearch = (currentSearchQuery === '' || cardTitle.includes(currentSearchQuery) || cardDesc.includes(currentSearchQuery) || cardTags.includes(currentSearchQuery));

      return matchesCat && matchesSearch;
    });

    const totalMatches = matchingCards.length;
    const totalPages = Math.max(1, Math.ceil(totalMatches / itemsPerPage));

    if (currentPage > totalPages) {
      currentPage = 1;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    // 2. Hide all cards in the grid first
    productCards.forEach(card => {
      card.classList.add('is-hidden');
      card.style.setProperty('display', 'none', 'important');
    });

    // 3. Paginate and display only the cards for the current page
    if (totalMatches > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalMatches);

      for (let i = startIndex; i < endIndex; i++) {
        matchingCards[i].classList.remove('is-hidden');
        matchingCards[i].style.setProperty('display', 'flex', 'important');
      }

      // 4. Update status counter display
      if (countDisplay) {
        if (activeCat === 'all' && currentSearchQuery === '') {
          countDisplay.textContent = `Showing ${startIndex + 1}–${endIndex} of ${productCards.length} Products`;
        } else if (totalMatches <= itemsPerPage) {
          countDisplay.textContent = `Showing ${totalMatches} of ${productCards.length} Products`;
        } else {
          countDisplay.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalMatches} Products`;
        }
      }

      if (noResultsMsg) noResultsMsg.style.display = 'none';
      if (paginationWrap) paginationWrap.style.display = 'flex';

      // 5. Render Pagination Controls
      renderPagination(totalPages, totalMatches);
    } else {
      if (countDisplay) {
        countDisplay.textContent = `Showing 0 of ${productCards.length} Products`;
      }
      if (noResultsMsg) noResultsMsg.style.display = 'block';
      if (paginationWrap) paginationWrap.style.display = 'none';
    }
  }

  function renderPagination(totalPages, totalMatches) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    if (totalMatches === 0) {
      if (paginationInfo) paginationInfo.textContent = '';
      return;
    }

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'catalog-page-btn';
    prevBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      <span>Prev</span>
    `;
    prevBtn.disabled = (currentPage === 1 || totalPages <= 1);
    prevBtn.setAttribute('aria-label', 'Previous Page');
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        applyFilters();
        scrollToCatalogTop();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Numbered page buttons
    for (let p = 1; p <= totalPages; p++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `catalog-page-btn ${p === currentPage ? 'active' : ''}`;
      pageBtn.textContent = p;
      pageBtn.setAttribute('aria-label', `Page ${p}`);
      pageBtn.addEventListener('click', () => {
        if (currentPage !== p) {
          currentPage = p;
          applyFilters();
          scrollToCatalogTop();
        }
      });
      paginationContainer.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'catalog-page-btn';
    nextBtn.innerHTML = `
      <span>Next</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px;">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
    nextBtn.disabled = (currentPage === totalPages || totalPages <= 1);
    nextBtn.setAttribute('aria-label', 'Next Page');
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        applyFilters();
        scrollToCatalogTop();
      }
    });
    paginationContainer.appendChild(nextBtn);

    // Pagination info line
    if (paginationInfo) {
      if (totalPages > 1) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages} • ${totalMatches} Products Found`;
      } else {
        paginationInfo.textContent = `${totalMatches} Products in this Category`;
      }
    }
  }

  function scrollToCatalogTop() {
    const catalogEl = document.getElementById('catalog-products');
    if (catalogEl) {
      const topOffset = catalogEl.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }

  // Initial render
  applyFilters();
}

/* ==========================================================================
   10. Phase 4: Custom Design & Artwork Upload Form Handler
   ========================================================================== */
function initCustomDesignUpload() {
  const uploadForm = document.getElementById('custom-artwork-form');
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('artwork-file-input');
  const fileBox = document.getElementById('file-selected-box');
  const filenameEl = document.getElementById('selected-filename');
  const filesizeEl = document.getElementById('selected-filesize');
  const fileExtBadge = document.getElementById('file-ext-badge');
  const btnRemove = document.getElementById('btn-remove-file');
  const btnReplace = document.getElementById('btn-replace-file');
  const progressWrap = document.getElementById('upload-progress-wrap');
  const progressBar = document.getElementById('upload-progress-bar');
  const progressPct = document.getElementById('upload-progress-pct');
  const successState = document.getElementById('upload-success-state');
  const btnSubmitAnother = document.getElementById('btn-submit-another');
  const dateInput = document.getElementById('spec-delivery-date');
  const notesInput = document.getElementById('spec-notes');
  const charCounter = document.getElementById('char-counter');

  if (!uploadForm) return;

  // Set min date to tomorrow
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Character counter
  if (notesInput && charCounter) {
    notesInput.addEventListener('input', () => {
      charCounter.textContent = `${notesInput.value.length} / 500`;
    });
  }

  // Allowed file formats
  const allowedExtensions = ['pdf', 'ai', 'psd', 'eps', 'svg', 'png', 'jpg', 'jpeg', 'tiff'];
  let currentSelectedFile = null;

  // Click dropzone to open file dialog
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    // Drag & Drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFileSelection(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    const fileErrorEl = document.getElementById('err-artwork-file');
    const ext = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      if (fileErrorEl) {
        fileErrorEl.textContent = `Unsupported file type (.${ext}). Please upload a PDF, AI, PSD, EPS, SVG, PNG, or JPG.`;
        fileErrorEl.style.display = 'block';
      }
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      if (fileErrorEl) {
        fileErrorEl.textContent = `File size exceeds 50MB (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please compress or upload vector formats.`;
        fileErrorEl.style.display = 'block';
      }
      return;
    }

    currentSelectedFile = file;
    if (fileErrorEl) fileErrorEl.style.display = 'none';

    // Format file size
    const sizeStr = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    if (filenameEl) filenameEl.textContent = file.name;
    if (filesizeEl) filesizeEl.textContent = `${sizeStr} · Ready for prepress analysis`;
    if (fileExtBadge) fileExtBadge.textContent = ext.toUpperCase();

    if (dropzone) dropzone.style.display = 'none';
    if (fileBox) fileBox.style.display = 'block';
  }

  // Remove File
  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      currentSelectedFile = null;
      if (fileInput) fileInput.value = '';
      if (fileBox) fileBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
    });
  }

  // Replace File
  if (btnReplace && fileInput) {
    btnReplace.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Form Submission
  uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    const nameInput = document.getElementById('cust-name');
    const errName = document.getElementById('err-cust-name');
    if (!nameInput.value.trim()) {
      errName.style.display = 'block';
      nameInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      errName.style.display = 'none';
      nameInput.style.borderColor = '';
    }

    // Validate Email
    const emailInput = document.getElementById('cust-email');
    const errEmail = document.getElementById('err-cust-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      errEmail.style.display = 'block';
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      errEmail.style.display = 'none';
      emailInput.style.borderColor = '';
    }

    // Validate Phone
    const phoneInput = document.getElementById('cust-phone');
    const errPhone = document.getElementById('err-cust-phone');
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
      errPhone.style.display = 'block';
      phoneInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      errPhone.style.display = 'none';
      phoneInput.style.borderColor = '';
    }

    // Validate Quantity
    const qtyInput = document.getElementById('spec-qty');
    const errQty = document.getElementById('err-spec-qty');
    if (parseInt(qtyInput.value, 10) < 50 || isNaN(parseInt(qtyInput.value, 10))) {
      errQty.style.display = 'block';
      qtyInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      errQty.style.display = 'none';
      qtyInput.style.borderColor = '';
    }

    // Validate File Upload
    const errFile = document.getElementById('err-artwork-file');
    if (!currentSelectedFile) {
      errFile.textContent = 'Please attach an artwork file before submitting.';
      errFile.style.display = 'block';
      isValid = false;
    } else {
      errFile.style.display = 'none';
    }

    if (!isValid) return;

    // Simulate Client-Side Prepress Upload Process
    const submitBtn = document.getElementById('btn-submit-upload');
    if (submitBtn) submitBtn.disabled = true;
    if (progressWrap) progressWrap.style.display = 'block';

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);

        // Populate receipt summary
        const refId = `PLP-${Math.floor(10000 + Math.random() * 90000)}`;
        const refEl = document.getElementById('receipt-ref-id');
        const clientNameEl = document.getElementById('receipt-client-name');
        const clientEmailEl = document.getElementById('receipt-client-email');
        const prodTypeEl = document.getElementById('receipt-product-type');
        const materialEl = document.getElementById('receipt-material');
        const qtyEl = document.getElementById('receipt-quantity');
        const filenameReceiptEl = document.getElementById('receipt-filename');

        if (refEl) refEl.textContent = refId;
        if (clientNameEl) clientNameEl.textContent = nameInput.value;
        if (clientEmailEl) clientEmailEl.textContent = emailInput.value;
        if (prodTypeEl) prodTypeEl.textContent = document.getElementById('spec-product-type')?.value || 'Custom Label';
        if (materialEl) materialEl.textContent = document.getElementById('spec-material')?.value || 'White BOPP';
        if (qtyEl) qtyEl.textContent = `${qtyInput.value} Units`;
        if (filenameReceiptEl) filenameReceiptEl.textContent = currentSelectedFile?.name || 'vector-artwork.pdf';

        // Show success state
        setTimeout(() => {
          uploadForm.style.display = 'none';
          if (progressWrap) progressWrap.style.display = 'none';
          if (successState) successState.style.display = 'block';
          if (submitBtn) submitBtn.disabled = false;
        }, 400);
      }

      if (progressBar) progressBar.style.width = `${progress}%`;
      if (progressPct) progressPct.textContent = `${progress}%`;
    }, 120);
  });

  // Submit Another Design Button
  if (btnSubmitAnother) {
    btnSubmitAnother.addEventListener('click', () => {
      uploadForm.reset();
      currentSelectedFile = null;
      if (fileInput) fileInput.value = '';
      if (fileBox) fileBox.style.display = 'none';
      if (dropzone) dropzone.style.display = 'block';
      if (successState) successState.style.display = 'none';
      uploadForm.style.display = 'block';
      if (charCounter) charCounter.textContent = '0 / 500';
    });
  }
}

/* ==========================================================================
   11. Phase 5: Contact & Quotation Request Form Handler
   ========================================================================== */
function initContactQuoteForm() {
  const contactForm = document.getElementById('contact-quote-req-form');
  const successState = document.getElementById('contact-success-state');
  const btnSubmitAnother = document.getElementById('btn-submit-another-contact');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    const nameInput = document.getElementById('contact-name');
    const errName = document.getElementById('err-contact-name');
    if (!nameInput.value.trim()) {
      if (errName) errName.style.display = 'block';
      nameInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errName) errName.style.display = 'none';
      nameInput.style.borderColor = '';
    }

    // Validate Email
    const emailInput = document.getElementById('contact-email');
    const errEmail = document.getElementById('err-contact-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      if (errEmail) errEmail.style.display = 'block';
      emailInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errEmail) errEmail.style.display = 'none';
      emailInput.style.borderColor = '';
    }

    // Validate Phone
    const phoneInput = document.getElementById('contact-phone');
    const errPhone = document.getElementById('err-contact-phone');
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
      if (errPhone) errPhone.style.display = 'block';
      phoneInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errPhone) errPhone.style.display = 'none';
      phoneInput.style.borderColor = '';
    }

    // Validate Quantity
    const qtyInput = document.getElementById('contact-qty');
    const errQty = document.getElementById('err-contact-qty');
    if (parseInt(qtyInput.value, 10) < 50 || isNaN(parseInt(qtyInput.value, 10))) {
      if (errQty) errQty.style.display = 'block';
      qtyInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errQty) errQty.style.display = 'none';
      qtyInput.style.borderColor = '';
    }

    // Validate Size
    const sizeInput = document.getElementById('contact-size');
    const errSize = document.getElementById('err-contact-size');
    if (!sizeInput.value.trim()) {
      if (errSize) errSize.style.display = 'block';
      sizeInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errSize) errSize.style.display = 'none';
      sizeInput.style.borderColor = '';
    }

    // Validate Message
    const msgInput = document.getElementById('contact-msg');
    const errMsg = document.getElementById('err-contact-msg');
    if (!msgInput.value.trim()) {
      if (errMsg) errMsg.style.display = 'block';
      msgInput.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      if (errMsg) errMsg.style.display = 'none';
      msgInput.style.borderColor = '';
    }

    if (!isValid) return;

    // Simulate submission
    const submitBtn = document.getElementById('btn-submit-contact');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Quotation Request...</span>';
    }

    setTimeout(() => {
      // Populate receipt
      const refId = `QT-${Math.floor(10000 + Math.random() * 90000)}`;
      const refEl = document.getElementById('contact-ref-id');
      const nameEl = document.getElementById('contact-receipt-name');
      const emailEl = document.getElementById('contact-receipt-email');
      const prodEl = document.getElementById('contact-receipt-prod');
      const qtyEl = document.getElementById('contact-receipt-qty');

      if (refEl) refEl.textContent = refId;
      if (nameEl) nameEl.textContent = nameInput.value;
      if (emailEl) emailEl.textContent = emailInput.value;
      if (prodEl) prodEl.textContent = document.getElementById('contact-product')?.value || 'Product Labels';
      if (qtyEl) qtyEl.textContent = `${qtyInput.value} Units (${sizeInput.value})`;

      contactForm.style.display = 'none';
      if (successState) successState.style.display = 'block';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Submit Quotation Request →</span>';
      }
    }, 600);
  });

  // Reset / Submit Another
  if (btnSubmitAnother) {
    btnSubmitAnother.addEventListener('click', () => {
      contactForm.reset();
      if (successState) successState.style.display = 'none';
      contactForm.style.display = 'block';
    });
  }
}

/* ==========================================================================
   12. Phase 6: Authentication (Login & Sign Up) Logic
   ========================================================================== */
function initAuthPage() {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const paneLogin = document.getElementById('form-login-pane');
  const paneSignup = document.getElementById('form-signup-pane');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const linkToSignup = document.getElementById('link-to-signup');
  const linkToSignin = document.getElementById('link-to-signin');
  const alertBox = document.getElementById('auth-alert-box');

  const loginForm = document.getElementById('auth-login-form');
  const signupForm = document.getElementById('auth-signup-form');

  // If not on auth page, return
  if (!tabLogin && !loginForm) return;

  function switchToLogin() {
    if (tabLogin) {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
    }
    if (tabSignup) {
      tabSignup.classList.remove('active');
      tabSignup.setAttribute('aria-selected', 'false');
    }
    if (paneLogin) paneLogin.style.display = 'block';
    if (paneSignup) paneSignup.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Welcome Back';
    if (authSubtitle) authSubtitle.textContent = 'Sign in to access your print runs, proofs, and orders.';
    hideAlert();
  }

  function switchToSignup() {
    if (tabSignup) {
      tabSignup.classList.add('active');
      tabSignup.setAttribute('aria-selected', 'true');
    }
    if (tabLogin) {
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');
    }
    if (paneSignup) paneSignup.style.display = 'block';
    if (paneLogin) paneLogin.style.display = 'none';
    if (authTitle) authTitle.textContent = 'Create an Account';
    if (authSubtitle) authSubtitle.textContent = 'Join PrintLabel Pro to start customized press runs.';
    hideAlert();
  }

  function showAlert(msg, isSuccess = true) {
    if (!alertBox) return;
    alertBox.style.display = 'block';
    if (isSuccess) {
      alertBox.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
      alertBox.style.color = '#10b981';
      alertBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    } else {
      alertBox.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
      alertBox.style.color = '#ef4444';
      alertBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    }
    alertBox.innerHTML = msg;
  }

  function hideAlert() {
    if (alertBox) alertBox.style.display = 'none';
  }

  // Tab button events
  if (tabLogin) tabLogin.addEventListener('click', switchToLogin);
  if (tabSignup) tabSignup.addEventListener('click', switchToSignup);
  if (linkToSignup) {
    linkToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      switchToSignup();
    });
  }
  if (linkToSignin) {
    linkToSignin.addEventListener('click', (e) => {
      e.preventDefault();
      switchToLogin();
    });
  }

  // Check URL hash for direct tab opening (#signup or #login)
  if (window.location.hash === '#signup') {
    switchToSignup();
  } else if (window.location.hash === '#login') {
    switchToLogin();
  }

  // Password Show / Hide Toggles
  setupPasswordToggle('btn-toggle-login-pwd', 'login-password');
  setupPasswordToggle('btn-toggle-signup-pwd', 'signup-pwd');

  function setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const eyeOpen = btn.querySelector('.eye-open');
      const eyeClosed = btn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email');
      const pwd = document.getElementById('login-password');
      const errEmail = document.getElementById('err-login-email');
      const errPwd = document.getElementById('err-login-pwd');
      const submitBtn = document.getElementById('btn-submit-login');

      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        if (errEmail) errEmail.style.display = 'block';
        email.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errEmail) errEmail.style.display = 'none';
        email.style.borderColor = '';
      }

      if (!pwd.value) {
        if (errPwd) errPwd.style.display = 'block';
        pwd.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errPwd) errPwd.style.display = 'none';
        pwd.style.borderColor = '';
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying Credentials...</span>';
      }

      setTimeout(() => {
        showAlert(`<strong>Welcome back!</strong> Signed in as <code>${email.value}</code>. (Demonstration Mode - Ready for Backend Integration)`, true);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>✓ Sign In Successful</span>';
        }
      }, 500);
    });
  }

  // Sign Up Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name');
      const email = document.getElementById('signup-email');
      const pwd = document.getElementById('signup-pwd');
      const pwdConfirm = document.getElementById('signup-pwd-confirm');
      const terms = document.getElementById('signup-terms');

      const errName = document.getElementById('err-signup-name');
      const errEmail = document.getElementById('err-signup-email');
      const errPwd = document.getElementById('err-signup-pwd');
      const errPwdConfirm = document.getElementById('err-signup-pwd-confirm');
      const errTerms = document.getElementById('err-signup-terms');
      const submitBtn = document.getElementById('btn-submit-signup');

      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim()) {
        if (errName) errName.style.display = 'block';
        name.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errName) errName.style.display = 'none';
        name.style.borderColor = '';
      }

      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        if (errEmail) errEmail.style.display = 'block';
        email.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errEmail) errEmail.style.display = 'none';
        email.style.borderColor = '';
      }

      if (!pwd.value || pwd.value.length < 6) {
        if (errPwd) errPwd.style.display = 'block';
        pwd.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errPwd) errPwd.style.display = 'none';
        pwd.style.borderColor = '';
      }

      if (pwd.value !== pwdConfirm.value) {
        if (errPwdConfirm) errPwdConfirm.style.display = 'block';
        pwdConfirm.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        if (errPwdConfirm) errPwdConfirm.style.display = 'none';
        pwdConfirm.style.borderColor = '';
      }

      if (terms && !terms.checked) {
        if (errTerms) errTerms.style.display = 'block';
        isValid = false;
      } else {
        if (errTerms) errTerms.style.display = 'none';
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Creating Account...</span>';
      }

      setTimeout(() => {
        showAlert(`<strong>Success!</strong> Account created for <strong>${name.value}</strong> (${email.value}). Welcome to PrintLabel Pro!`, true);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>✓ Account Created</span>';
        }
      }, 500);
    });
  }

  // Forgot password link
  const forgotLink = document.getElementById('link-forgot-pwd');
  if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      showAlert('Password reset instructions have been dispatched to your registered email address.', true);
    });
  }

  // Social Auth Buttons handler
  document.querySelectorAll('.auth-social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Social';
      showAlert(`Demonstration: Initializing secure OAuth 2.0 handshake with <strong>${provider}</strong>...`, true);
    });
  });
}

/* ==========================================================================
   12. Exclusive FAQ Accordion Handler (Auto-close on opening another)
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item, details[name="faq-group"]');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      const toggleIcon = item.querySelector('.faq-toggle-icon');
      if (item.open) {
        if (toggleIcon) toggleIcon.textContent = '−';
        // Close all other open details for smooth exclusive accordion behavior
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
            const otherIcon = otherItem.querySelector('.faq-toggle-icon');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });
      } else {
        if (toggleIcon) toggleIcon.textContent = '+';
      }
    });
  });
}

/* ==========================================================================
   13. Accessible Custom Responsive Select Dropdowns
   ========================================================================== */
function initCustomSelects() {
  const selects = document.querySelectorAll('select:not([data-custom-select-initialized])');
  
  selects.forEach(select => {
    if (select.hasAttribute('data-custom-select-initialized')) return;
    select.setAttribute('data-custom-select-initialized', 'true');

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    if (select.id) wrapper.setAttribute('data-select-id', select.id);

    // Insert wrapper before select and move select inside
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('visually-hidden-select');

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('tabindex', '0');

    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const triggerText = document.createElement('span');
    triggerText.className = 'custom-select-value';
    triggerText.textContent = selectedOption ? selectedOption.textContent.trim() : 'Select an option';

    const triggerArrow = document.createElement('span');
    triggerArrow.className = 'custom-select-arrow';
    triggerArrow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    trigger.appendChild(triggerText);
    trigger.appendChild(triggerArrow);
    wrapper.appendChild(trigger);

    // Create dropdown menu
    const menu = document.createElement('div');
    menu.className = 'custom-select-dropdown';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('tabindex', '-1');

    function buildOptions() {
      menu.innerHTML = '';
      Array.from(select.options).forEach((opt, idx) => {
        const optionEl = document.createElement('div');
        optionEl.className = `custom-select-option ${idx === select.selectedIndex ? 'is-selected' : ''}`;
        optionEl.setAttribute('role', 'option');
        optionEl.setAttribute('data-value', opt.value);
        optionEl.setAttribute('aria-selected', idx === select.selectedIndex ? 'true' : 'false');
        optionEl.setAttribute('tabindex', '-1');

        const optText = document.createElement('span');
        optText.className = 'option-text';
        optText.textContent = opt.textContent.trim();
        optionEl.appendChild(optText);

        if (idx === select.selectedIndex) {
          const checkIcon = document.createElement('span');
          checkIcon.className = 'option-check';
          checkIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          optionEl.appendChild(checkIcon);
        }

        optionEl.addEventListener('click', (e) => {
          e.stopPropagation();
          select.selectedIndex = idx;
          triggerText.textContent = opt.textContent.trim();
          updateSelectionHighlight();
          closeCustomDropdown(wrapper);
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
          trigger.focus();
        });

        menu.appendChild(optionEl);
      });
    }

    function updateSelectionHighlight() {
      const optionEls = menu.querySelectorAll('.custom-select-option');
      optionEls.forEach((optEl, idx) => {
        const isSel = (idx === select.selectedIndex);
        optEl.classList.toggle('is-selected', isSel);
        optEl.setAttribute('aria-selected', isSel ? 'true' : 'false');
        
        let check = optEl.querySelector('.option-check');
        if (isSel && !check) {
          check = document.createElement('span');
          check.className = 'option-check';
          check.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          optEl.appendChild(check);
        } else if (!isSel && check) {
          check.remove();
        }
      });
      const curOpt = select.options[select.selectedIndex];
      if (curOpt) {
        triggerText.textContent = curOpt.textContent.trim();
      }
    }

    buildOptions();
    wrapper.appendChild(menu);

    // Sync when select value changes programmatically
    select.addEventListener('change', () => {
      updateSelectionHighlight();
    });

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('is-open');
      closeAllCustomSelects();
      if (!isOpen) {
        openCustomDropdown(wrapper, trigger, menu);
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!wrapper.classList.contains('is-open')) {
          openCustomDropdown(wrapper, trigger, menu);
        } else {
          navigateOptions(e.key);
        }
      } else if (e.key === 'Escape') {
        closeCustomDropdown(wrapper);
      }
    });

    function navigateOptions(key) {
      const optionEls = Array.from(menu.querySelectorAll('.custom-select-option'));
      if (!optionEls.length) return;
      let currentIndex = select.selectedIndex;
      if (key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % optionEls.length;
      } else if (key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + optionEls.length) % optionEls.length;
      } else if (key === 'Enter' || key === ' ') {
        closeCustomDropdown(wrapper);
        return;
      }
      select.selectedIndex = currentIndex;
      updateSelectionHighlight();
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
      optionEls[currentIndex]?.scrollIntoView({ block: 'nearest' });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      closeAllCustomSelects();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCustomSelects();
    }
  });
}

function openCustomDropdown(wrapper, trigger, menu) {
  wrapper.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');

  const rect = trigger.getBoundingClientRect();
  const menuHeight = 240;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
    wrapper.classList.add('open-above');
  } else {
    wrapper.classList.remove('open-above');
  }

  const selected = menu.querySelector('.custom-select-option.is-selected');
  if (selected) {
    selected.scrollIntoView({ block: 'nearest' });
  }
}

function closeCustomDropdown(wrapper) {
  wrapper.classList.remove('is-open');
  wrapper.classList.remove('open-above');
  const trigger = wrapper.querySelector('.custom-select-trigger');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select-wrapper.is-open').forEach(w => closeCustomDropdown(w));
}

/* ==========================================================================
   14. Accessible Custom Responsive Date Picker Component
   ========================================================================== */
function initCustomDatePicker() {
  const dateInputs = document.querySelectorAll('input[type="date"]:not([data-datepicker-initialized])');
  if (!dateInputs.length) return;

  let popup = document.getElementById('custom-datepicker-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'custom-datepicker-popup';
    popup.className = 'custom-datepicker-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-label', 'Calendar Date Picker');
    popup.innerHTML = `
      <div class="datepicker-header">
        <button type="button" class="dp-nav-btn dp-prev" aria-label="Previous Month">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="dp-month-year-label">
          <span class="dp-month-text">October</span>
          <span class="dp-year-text">2026</span>
        </div>
        <button type="button" class="dp-nav-btn dp-next" aria-label="Next Month">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div class="datepicker-weekdays">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div class="datepicker-days-grid" id="dp-days-grid"></div>
      <div class="datepicker-footer">
        <button type="button" class="dp-footer-btn dp-clear-btn">Clear</button>
        <button type="button" class="dp-footer-btn dp-today-btn">Today</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  let activeDateInput = null;
  let viewingYear = new Date().getFullYear();
  let viewingMonth = new Date().getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  dateInputs.forEach(input => {
    input.setAttribute('data-datepicker-initialized', 'true');

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-datepicker-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    input.classList.add('custom-datepicker-native');

    const iconBtn = document.createElement('button');
    iconBtn.type = 'button';
    iconBtn.className = 'datepicker-icon-btn';
    iconBtn.setAttribute('aria-label', 'Open Calendar Picker');
    iconBtn.innerHTML = `
      <svg class="datepicker-calendar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    `;
    wrapper.appendChild(iconBtn);

    const openHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openDatePicker(input);
    };

    input.addEventListener('click', openHandler);
    iconBtn.addEventListener('click', openHandler);
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDatePicker(input);
      } else if (e.key === 'Escape') {
        closeDatePicker();
      }
    });
  });

  function openDatePicker(input) {
    activeDateInput = input;

    const val = input.value;
    if (val && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const parts = val.split('-');
      viewingYear = parseInt(parts[0], 10);
      viewingMonth = parseInt(parts[1], 10) - 1;
    } else {
      const now = new Date();
      viewingYear = now.getFullYear();
      viewingMonth = now.getMonth();
    }

    renderCalendar();
    positionPopup(input);
    popup.style.display = 'block';
  }

  function positionPopup(input) {
    const rect = input.getBoundingClientRect();
    const popupWidth = Math.min(320, window.innerWidth - 20);
    const popupHeight = 310;
    
    let top = rect.bottom + 6;
    if (top + popupHeight > window.innerHeight && rect.top > popupHeight + 10) {
      top = rect.top - popupHeight - 6;
    }

    let left = rect.left;
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    if (isRtl) {
      left = rect.right - popupWidth;
    }
    
    if (left < 10) left = 10;
    if (left + popupWidth > window.innerWidth - 10) {
      left = window.innerWidth - popupWidth - 10;
    }

    popup.style.position = 'fixed';
    popup.style.top = `${Math.max(10, top)}px`;
    popup.style.left = `${left}px`;
    popup.style.width = `${popupWidth}px`;
  }

  function renderCalendar() {
    if (!activeDateInput) return;

    const monthText = popup.querySelector('.dp-month-text');
    const yearText = popup.querySelector('.dp-year-text');
    if (monthText) monthText.textContent = monthNames[viewingMonth];
    if (yearText) yearText.textContent = viewingYear;

    const grid = popup.querySelector('#dp-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const firstDayIndex = new Date(viewingYear, viewingMonth, 1).getDay();
    const daysInMonth = new Date(viewingYear, viewingMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewingYear, viewingMonth, 0).getDate();

    let minDateObj = null;
    if (activeDateInput.min) {
      minDateObj = new Date(activeDateInput.min + 'T00:00:00');
    }

    const selectedVal = activeDateInput.value;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let x = firstDayIndex; x > 0; x--) {
      const prevDayNum = daysInPrevMonth - x + 1;
      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'dp-day-cell dp-day-other-month';
      dayBtn.textContent = prevDayNum;
      dayBtn.disabled = true;
      grid.appendChild(dayBtn);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'dp-day-cell';
      dayBtn.textContent = d;

      const dateStr = `${viewingYear}-${String(viewingMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const thisDateObj = new Date(dateStr + 'T00:00:00');

      if (dateStr === todayStr) {
        dayBtn.classList.add('dp-today');
      }

      if (dateStr === selectedVal) {
        dayBtn.classList.add('dp-selected');
        dayBtn.setAttribute('aria-selected', 'true');
      }

      if (minDateObj && thisDateObj < minDateObj) {
        dayBtn.classList.add('dp-disabled');
        dayBtn.disabled = true;
      } else {
        dayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectDate(dateStr);
        });
      }

      grid.appendChild(dayBtn);
    }

    const totalCells = firstDayIndex + daysInMonth;
    const remainingCells = (totalCells % 7 === 0) ? 0 : (7 - (totalCells % 7));
    for (let y = 1; y <= remainingCells; y++) {
      const nextDayBtn = document.createElement('button');
      nextDayBtn.type = 'button';
      nextDayBtn.className = 'dp-day-cell dp-day-other-month';
      nextDayBtn.textContent = y;
      nextDayBtn.disabled = true;
      grid.appendChild(nextDayBtn);
    }
  }

  function selectDate(dateStr) {
    if (!activeDateInput) return;
    activeDateInput.value = dateStr;
    activeDateInput.dispatchEvent(new Event('change', { bubbles: true }));
    activeDateInput.dispatchEvent(new Event('input', { bubbles: true }));
    closeDatePicker();
    activeDateInput.focus();
  }

  function closeDatePicker() {
    if (popup) {
      popup.style.display = 'none';
    }
    activeDateInput = null;
  }

  const prevBtn = popup.querySelector('.dp-prev');
  const nextBtn = popup.querySelector('.dp-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      viewingMonth--;
      if (viewingMonth < 0) {
        viewingMonth = 11;
        viewingYear--;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      viewingMonth++;
      if (viewingMonth > 11) {
        viewingMonth = 0;
        viewingYear++;
      }
      renderCalendar();
    });
  }

  const clearBtn = popup.querySelector('.dp-clear-btn');
  const todayBtn = popup.querySelector('.dp-today-btn');

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeDateInput) {
        activeDateInput.value = '';
        activeDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        activeDateInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      closeDatePicker();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      selectDate(todayStr);
    });
  }

  window.addEventListener('resize', () => {
    if (activeDateInput && popup.style.display === 'block') {
      positionPopup(activeDateInput);
    }
  });

  window.addEventListener('scroll', () => {
    if (activeDateInput && popup.style.display === 'block') {
      positionPopup(activeDateInput);
    }
  }, { passive: true });

  document.addEventListener('click', (e) => {
    if (popup.style.display === 'block' && !popup.contains(e.target) && !e.target.closest('.custom-datepicker-wrapper')) {
      closeDatePicker();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.style.display === 'block') {
      closeDatePicker();
    }
  });
}



