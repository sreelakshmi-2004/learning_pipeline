/**
 * DevOps Learning Journey - Interactive JavaScript
 * Vanilla JS (ES6+) - Clean, Modular, Dependency-Free
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    projects: [],
    filteredProjects: [],
    activeCategory: 'all',
    searchQuery: '',
    selectedProject: null,
  };

  // DOM Elements
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const projectsContainer = document.getElementById('projectsContainer');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('projectSearch');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const backToTopBtn = document.getElementById('backToTop');
  const currentYearSpan = document.getElementById('currentYear');
  const projectModal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModal');

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     Navigation & Header Scroll
     -------------------------------------------------------------------------- */
  // Add shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Back to top button action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile menu when clicking nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  const highlightCurrentSection = () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', highlightCurrentSection, { passive: true });

  /* --------------------------------------------------------------------------
     Fetch & Render Projects from data/projects.json
     -------------------------------------------------------------------------- */
  async function loadProjects() {
    if (!projectsContainer) return;

    try {
      // Display loading state
      projectsContainer.innerHTML = `
        <div class="projects-loader">
          <div class="spinner"></div>
          <p>Loading DevOps projects from <code>data/projects.json</code>...</p>
        </div>
      `;

      const response = await fetch('data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      state.projects = data;
      state.filteredProjects = data;
      renderProjects();
    } catch (error) {
      console.error('Error fetching projects:', error);
      projectsContainer.innerHTML = `
        <div class="projects-empty">
          <svg style="margin: 0 auto 1rem; width: 48px; height: 48px; color: #DC2626;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 style="font-size: 1.2rem; font-weight: 700; color: #1F2937; margin-bottom: 0.5rem;">Failed to Load Projects</h3>
          <p style="color: #6B7280; font-size: 0.9rem; max-width: 420px; margin: 0 auto 1.25rem;">
            Could not fetch <code>data/projects.json</code>. If viewing directly from the filesystem (file://), run the site using the included Nginx Docker container or a local HTTP server.
          </p>
          <button class="btn btn-primary" id="retryFetchBtn" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">Retry Loading</button>
        </div>
      `;

      const retryBtn = document.getElementById('retryFetchBtn');
      if (retryBtn) {
        retryBtn.addEventListener('click', loadProjects);
      }
    }
  }

  function renderProjects() {
    if (!projectsContainer) return;

    const list = state.filteredProjects;

    if (list.length === 0) {
      projectsContainer.innerHTML = `
        <div class="projects-empty">
          <svg style="margin: 0 auto 1rem; width: 44px; height: 44px; color: #8B5CF6;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #1F2937; margin-bottom: 0.35rem;">No Projects Found</h3>
          <p style="color: #6B7280; font-size: 0.9rem;">No DevOps projects match your filter or search criteria.</p>
        </div>
      `;
      return;
    }

    projectsContainer.innerHTML = list
      .map((proj) => {
        const toolsHtml = proj.tools
          .map((tool) => `<span class="tool-tag">${escapeHtml(tool)}</span>`)
          .join('');

        return `
        <article class="project-card" data-id="${escapeHtml(proj.id)}">
          <div class="card-top">
            <span class="card-badge">${escapeHtml(proj.badge || 'DevOps')}</span>
            <span class="card-status">
              <span class="card-status-dot"></span>
              ${escapeHtml(proj.status || 'Active')}
            </span>
          </div>

          <h3 class="project-title">${escapeHtml(proj.title)}</h3>
          <p class="project-desc">${escapeHtml(proj.description)}</p>

          ${
            proj.metrics
              ? `<div class="project-metric">
                   <strong>Impact:</strong> ${escapeHtml(proj.metrics)}
                 </div>`
              : ''
          }

          <div class="tools-list">
            ${toolsHtml}
          </div>

          <div class="card-actions">
            <button class="btn-card btn-card-primary view-details-btn" data-id="${escapeHtml(proj.id)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            <a href="${escapeHtml(proj.githubUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn-card btn-card-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code
            </a>
          </div>
        </article>
      `;
      })
      .join('');

    // Attach click listener for detail buttons
    const detailButtons = projectsContainer.querySelectorAll('.view-details-btn');
    detailButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProjectModal(id);
      });
    });
  }

  // Filter & Search Logic
  function applyFilters() {
    const query = state.searchQuery.trim().toLowerCase();
    const cat = state.activeCategory;

    state.filteredProjects = state.projects.filter((item) => {
      const matchesCategory = cat === 'all' || item.category === cat;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tools.some((t) => t.toLowerCase().includes(query)) ||
        (item.metrics && item.metrics.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    renderProjects();
  }

  // Filter buttons click handler
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      applyFilters();
    });
  }

  /* --------------------------------------------------------------------------
     Modal Logic for Project Details
     -------------------------------------------------------------------------- */
  function openProjectModal(id) {
    const project = state.projects.find((p) => p.id === id);
    if (!project || !projectModal || !modalBody) return;

    const highlightsList = (project.highlights || [])
      .map((h) => `<li style="margin-bottom: 0.5rem; display: flex; align-items: flex-start; gap: 0.5rem;">
        <span style="color: #7C3AED; font-weight: bold;">✓</span> <span>${escapeHtml(h)}</span>
      </li>`)
      .join('');

    const toolsTags = (project.tools || [])
      .map((t) => `<span class="tool-tag" style="font-size: 0.8rem; padding: 0.3rem 0.65rem;">${escapeHtml(t)}</span>`)
      .join('');

    modalBody.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
        <span class="card-badge">${escapeHtml(project.badge || 'DevOps')}</span>
        <span class="card-status"><span class="card-status-dot"></span>${escapeHtml(project.status || 'Active')}</span>
      </div>
      <h2 style="font-size: 1.65rem; font-weight: 800; color: #1E1B4B; margin-bottom: 0.75rem; line-height: 1.3;">
        ${escapeHtml(project.title)}
      </h2>
      <p style="font-size: 0.98rem; color: #374151; line-height: 1.6; margin-bottom: 1.5rem;">
        ${escapeHtml(project.description)}
      </p>

      ${
        project.metrics
          ? `<div style="background-color: #FAF5FF; border-left: 4px solid #7C3AED; padding: 0.85rem 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
               <strong style="color: #6D28D9; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.2rem;">Key Impact & Metric</strong>
               <span style="font-size: 0.95rem; color: #1E1B4B; font-weight: 600;">${escapeHtml(project.metrics)}</span>
             </div>`
          : ''
      }

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E1B4B; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">
          Key Architecture Highlights
        </h4>
        <ul style="font-size: 0.9rem; color: #4B5563;">
          ${highlightsList}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E1B4B; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em;">
          Tech Stack & Integrations
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${toolsTags}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; border-top: 1px solid #EDE7F9; padding-top: 1.5rem;">
        <a href="${escapeHtml(project.githubUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">
          Explore Repository
        </a>
        <a href="${escapeHtml(project.demoUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">
          Live Architecture Demo
        </a>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Contact Form Handling
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple client-side validation
      if (!name || !email || !message) {
        showStatus('Please fill in all required fields (Name, Email, Message).', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate sending submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="spinner" style="width: 14px; height: 14px; border-width: 2px; margin: 0; display: inline-block;"></span>
          Sending Message...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        contactForm.reset();
        showStatus('Thank you! Your message has been sent successfully.', 'success');
        showToast('Message sent! I will respond to your DevOps inquiry shortly.');
      }, 700);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --------------------------------------------------------------------------
     Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     Sanitization Helper
     -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Load
  loadProjects();
});
