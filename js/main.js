/**
 * ============================================================
 * MAIN.JS - Lógica principal del portafolio
 * ============================================================
 * Este archivo maneja:
 * - Renderizado dinámico de proyectos por categorías
 * - Sub-filtros (Interiores, Exteriores, Planos)
 * - Lightbox de imágenes
 * - Modal de videos
 * - Modo oscuro
 * - Animaciones de scroll
 * - Navegación móvil
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavbar();
  initMobileMenu();
  initCategoryTabs();
  initLightbox();
  initVideoModal();
  initScrollReveal();
  initContactForm();
  
  // Renderizar proyectos de la categoría inicial
  renderProjects("moderna");
});

/* ============================================================
   TEMA OSCURO / CLARO
   ============================================================ */

function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* ============================================================
   NAVBAR - scroll effect
   ============================================================ */

function initNavbar() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      closeMobileMenu();
    });
  });
}

/* ============================================================
   MENU MÓVIL
   ============================================================ */

let mobileMenuOpen = false;

function initMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", () => {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  });
}

function openMobileMenu() {
  mobileMenuOpen = true;
  document.querySelector(".hamburger").classList.add("active");
  document.querySelector(".mobile-menu").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  document.querySelector(".hamburger").classList.remove("active");
  document.querySelector(".mobile-menu").classList.remove("open");
  document.body.style.overflow = "";
}

/* ============================================================
   CATEGORÍAS PRINCIPALES (Tabs)
   ============================================================ */

function initCategoryTabs() {
  const tabs = document.querySelectorAll(".category-tab");
  
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const category = tab.getAttribute("data-category");
      renderProjects(category);
    });
  });
}

/* ============================================================
   RENDERIZADO DE PROYECTOS
   ============================================================ */

function renderProjects(category) {
  const container = document.getElementById("projects-container");
  const categoryProjects = proyectos[category] || [];
  
  container.innerHTML = "";
  
  if (categoryProjects.length === 0) {
    container.innerHTML = '<p class="no-projects">No hay proyectos en esta categoría.</p>';
    return;
  }
  
  categoryProjects.forEach((proyecto, index) => {
    const projectCard = createProjectCard(proyecto, index, category);
    container.appendChild(projectCard);
  });
  
  // Re-inicializar scroll reveal para los nuevos elementos
  setTimeout(() => {
    document.querySelectorAll(".project-card.reveal").forEach(el => {
      el.classList.add("visible");
    });
  }, 50);
}

function createProjectCard(proyecto, index, category) {
  const card = document.createElement("article");
  card.className = "project-card reveal";
  card.setAttribute("data-project-id", proyecto.id);
  card.setAttribute("data-category", category);
  card.setAttribute("data-index", index);
  
  // Obtener las imágenes de interiores por defecto para el preview
  const defaultSubcat = getFirstAvailableSubcat(proyecto);
  const previewImages = getSubcategoryImages(proyecto, defaultSubcat);
  
  card.innerHTML = `
    <div class="project-preview">
      <div class="project-images-preview" id="preview-${category}-${index}">
        ${renderPreviewImages(previewImages, category, index, defaultSubcat, proyecto.titulo)}
      </div>
      
      <div class="project-info">
        <div class="project-meta">
          <span>${proyecto.anio}</span>
          <span>${proyecto.ubicacion}</span>
        </div>
        <h3>${proyecto.titulo}</h3>
        <p>${proyecto.descripcion}</p>
        
        <!-- Sub-filtros -->
        <div class="subfilter-bar">
          <button class="subfilter-btn ${defaultSubcat === 'interiores' ? 'active' : ''}" data-subfilter="interiores" data-category="${category}" data-index="${index}" ${!hasSubcategoryContent(proyecto, 'interiores') ? 'style="display:none"' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Interiores
          </button>
          <button class="subfilter-btn ${defaultSubcat === 'exteriores' ? 'active' : ''}" data-subfilter="exteriores" data-category="${category}" data-index="${index}" ${!hasSubcategoryContent(proyecto, 'exteriores') ? 'style="display:none"' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            Exteriores
          </button>
          <button class="subfilter-btn ${defaultSubcat === 'planos' ? 'active' : ''}" data-subfilter="planos" data-category="${category}" data-index="${index}" ${!hasSubcategoryContent(proyecto, 'planos') ? 'style="display:none"' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
            Planos
          </button>
        </div>
        
        <!-- Galería dinámica por subcategoría -->
        <div class="subcat-gallery" id="gallery-${category}-${index}">
          ${renderSubcategoryGallery(proyecto, defaultSubcat, category, index)}
        </div>
        
        <!-- Botones de acción -->
        <div class="project-actions">
          <button class="btn-gallery" data-category="${category}" data-index="${index}" data-subcat="${defaultSubcat}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Galería
          </button>
          <button class="btn-video" data-category="${category}" data-index="${index}" data-subcat="${defaultSubcat}" style="display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Video
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Inicializar sub-filtros para este proyecto
  initSubfilters(card, proyecto, category, index);
  
  // Inicializar el botón de video con el primer tab disponible
  updateVideoButton(card, proyecto, defaultSubcat);
  
  return card;
}

function getSubcategoryImages(proyecto, subcat) {
  // Obtener las imágenes de una subcategoría específica
  const subcatData = proyecto.subcategorias[subcat];
  if (subcatData && subcatData.imagenes && subcatData.imagenes.length > 0) {
    return subcatData.imagenes.slice(0, 3);
  }
  return [];
}

function hasSubcategoryContent(proyecto, subcat) {
  const subcatData = proyecto.subcategorias[subcat];
  return subcatData?.imagenes && subcatData.imagenes.length > 0;
}

function getFirstAvailableSubcat(proyecto) {
  const order = ['interiores', 'exteriores', 'planos'];
  for (const subcat of order) {
    if (hasSubcategoryContent(proyecto, subcat)) return subcat;
  }
  return 'interiores';
}

function renderPreviewImages(images, category, index, subcat, titulo) {
  if (images.length === 0) {
    return '<p class="no-preview">No hay imágenes disponibles</p>';
  }
  
  return images.map((img, i) => `
    <div class="img-wrap" data-category="${category}" data-index="${index}" data-img="${i}" data-subcat="${subcat}">
      <img src="${img}" alt="${titulo} - Imagen ${i + 1}" loading="lazy">
      <div class="img-expand-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </div>
    </div>
  `).join('');
}

function renderSubcategoryGallery(proyecto, subcat, category, projectIndex) {
  const subcatData = proyecto.subcategorias[subcat];
  if (!subcatData || !subcatData.imagenes || subcatData.imagenes.length === 0) {
    return '<p class="no-images">No hay imágenes disponibles para esta categoría.</p>';
  }
  
  return `
    <div class="subcat-images">
      ${subcatData.imagenes.slice(0, 4).map((img, i) => `
        <div class="subcat-img-wrap" data-category="${category}" data-index="${projectIndex}" data-img="${i}" data-subcat="${subcat}">
          <img src="${img}" alt="Imagen ${i + 1}" loading="lazy">
          <div class="img-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      `).join('')}
      ${subcatData.imagenes.length > 4 ? `
        <div class="more-images" data-category="${category}" data-index="${projectIndex}" data-subcat="${subcat}">
          <span>+${subcatData.imagenes.length - 4}</span>
          <span>más</span>
        </div>
      ` : ''}
    </div>
  `;
}

function initSubfilters(card, proyecto, category, projectIndex) {
  const subfilterBtns = card.querySelectorAll('.subfilter-btn');
  
  subfilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botón activo
      subfilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const subcat = btn.getAttribute('data-subfilter');
      
      // NUEVO: Actualizar el preview principal con las imágenes de la subcategoría seleccionada
      const previewContainer = card.querySelector('.project-images-preview');
      const previewImages = getSubcategoryImages(proyecto, subcat);
      previewContainer.innerHTML = renderPreviewImages(previewImages, category, projectIndex, subcat, proyecto.titulo);
      
      // Re-inicializar click handlers para el preview actualizado
      initPreviewImageClicks(card);
      
      // Actualizar galería secundaria
      const gallery = card.querySelector('.subcat-gallery');
      gallery.innerHTML = renderSubcategoryGallery(proyecto, subcat, category, projectIndex);
      
      // Actualizar data-subcat en botones de galería y video
      const galleryBtn = card.querySelector('.btn-gallery');
      const videoBtn = card.querySelector('.btn-video');
      
      galleryBtn.setAttribute('data-subcat', subcat);
      videoBtn.setAttribute('data-subcat', subcat);
      
      // Mostrar/ocultar botón de video
      updateVideoButton(card, proyecto, subcat);
      
      // Re-inicializar click handlers para las nuevas imágenes de galería
      initGalleryImageClicks(card);
    });
  });
  
  // Inicializar click handlers para imágenes del preview y galería
  initPreviewImageClicks(card);
  initGalleryImageClicks(card);
}

function initPreviewImageClicks(card) {
  const imgWraps = card.querySelectorAll('.project-images-preview .img-wrap');
  imgWraps.forEach(wrap => {
    wrap.addEventListener('click', () => {
      const category = wrap.getAttribute('data-category');
      const index = parseInt(wrap.getAttribute('data-index'));
      const subcat = wrap.getAttribute('data-subcat');
      const imgIndex = parseInt(wrap.getAttribute('data-img')) || 0;
      
      openLightboxForSubcat(category, index, subcat, imgIndex);
    });
  });
}

function initGalleryImageClicks(card) {
  const imgWraps = card.querySelectorAll('.subcat-img-wrap, .more-images');
  imgWraps.forEach(wrap => {
    wrap.addEventListener('click', () => {
      const category = wrap.getAttribute('data-category');
      const index = parseInt(wrap.getAttribute('data-index'));
      const subcat = wrap.getAttribute('data-subcat');
      const imgIndex = parseInt(wrap.getAttribute('data-img')) || 0;
      
      openLightboxForSubcat(category, index, subcat, imgIndex);
    });
  });
}

function updateVideoButton(card, proyecto, subcat) {
  const videoBtn = card.querySelector('.btn-video');
  const subcatData = proyecto.subcategorias[subcat];
  
  if (subcatData?.videos && subcatData.videos.length > 0 && subcatData.videos[0] !== '') {
    videoBtn.style.display = 'inline-flex';
    videoBtn.setAttribute('data-video', subcatData.videos[0]);
  } else {
    videoBtn.style.display = 'none';
  }
}

/* ============================================================
   LIGHTBOX
   ============================================================ */

let currentLightboxImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCounter = document.getElementById("lightbox-counter");

  // Click en botón "Ver Galería"
  document.addEventListener("click", (e) => {
    const galleryBtn = e.target.closest(".btn-gallery");
    if (galleryBtn) {
      const category = galleryBtn.getAttribute("data-category");
      const index = parseInt(galleryBtn.getAttribute("data-index"));
      const subcat = galleryBtn.getAttribute("data-subcat");
      openLightboxForSubcat(category, index, subcat, 0);
    }
  });

  // Cerrar lightbox
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navegación
  document.getElementById("lightbox-prev").addEventListener("click", () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    updateLightbox();
  });

  document.getElementById("lightbox-next").addEventListener("click", () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    updateLightbox();
  });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
      updateLightbox();
    }
    if (e.key === "ArrowRight") {
      currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
      updateLightbox();
    }
  });

  function updateLightbox() {
    lightboxImg.src = currentLightboxImages[currentLightboxIndex];
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openLightboxForSubcat(category, projectIndex, subcat, imgIndex) {
  const proyecto = proyectos[category][projectIndex];
  const subcatData = proyecto.subcategorias[subcat];
  
  if (!subcatData || !subcatData.imagenes || subcatData.imagenes.length === 0) {
    return;
  }
  
  currentLightboxImages = subcatData.imagenes;
  currentLightboxIndex = imgIndex;
  
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCounter = document.getElementById("lightbox-counter");
  
  lightboxImg.src = currentLightboxImages[currentLightboxIndex];
  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
  
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

/* ============================================================
   VIDEO MODAL
   ============================================================ */

function initVideoModal() {
  const modal = document.getElementById("video-modal");
  const iframe = document.getElementById("video-iframe");

  document.addEventListener("click", (e) => {
    const videoBtn = e.target.closest(".btn-video");
    if (videoBtn && videoBtn.style.display !== 'none') {
      const videoId = videoBtn.getAttribute("data-video");
      if (videoId) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    }
  });

  function closeVideoModal() {
    modal.classList.remove("open");
    iframe.src = "";
    document.body.style.overflow = "";
  }

  document.getElementById("video-modal-close").addEventListener("click", closeVideoModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVideoModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeVideoModal();
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ============================================================
   FORMULARIO DE CONTACTO
   ============================================================ */

function initContactForm() {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    const originalText = btn.textContent;

    btn.textContent = "Enviado ✓";
    btn.style.background = "var(--color-accent)";
    btn.style.color = "#ffffff";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
      btn.style.color = "";
      form.reset();
    }, 2500);
  });
}