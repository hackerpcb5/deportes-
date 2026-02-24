// Admin Dashboard JavaScript
(function() {
  'use strict';

  // Configuration
  const SECTIONS = {
    biblioteca: {
      title: 'Gestión de Biblioteca',
      folder: 'galeriabiblioteca',
      page: 'biblioteca.html'
    },
    comedor: {
      title: 'Gestión de Comedor',
      folder: 'galeriacomedor',
      page: 'comedor.html'
    },
    promociones: {
      title: 'Gestión de Promociones',
      folder: 'galeriadepromociones',
      page: 'promociones.html'
    },
    avisos: {
      title: 'Gestión de Avisos',
      folder: 'Avisos',
      page: 'promociones.html'
    },
    bot: {
      title: 'Configuración del Bot de Avisos',
      folder: null,
      page: null
    },
    deportes: {
      title: 'Gestión de Deportes',
      folder: null,
      page: 'deportes.html'
    }
  };

  // State
  let currentSection = 'biblioteca';
  let contentData = {};
  let imageToDelete = null;

  // DOM Elements
  const navButtons = document.querySelectorAll('.nav-btn');
  const sectionTitle = document.getElementById('sectionTitle');
  const btnAddImage = document.getElementById('btnAddImage');
  const btnEditMenu = document.getElementById('btnEditMenu');
  const btnExportData = document.getElementById('btnExportData');
  const uploadSection = document.getElementById('uploadSection');
  const menuEditorSection = document.getElementById('menuEditorSection');
  const deportesEditorSection = document.getElementById('deportesEditorSection');
  const uploadForm = document.getElementById('uploadForm');
  const menuForm = document.getElementById('menuForm');
  const btnCancelUpload = document.getElementById('btnCancelUpload');
  const btnCancelMenu = document.getElementById('btnCancelMenu');
  const imageFile = document.getElementById('imageFile');
  const imageUrl = document.getElementById('imageUrl');
  const filePreview = document.getElementById('filePreview');
  const urlPreview = document.getElementById('urlPreview');
  const desayunoItems = document.getElementById('desayunoItems');
  const almuerzoItems = document.getElementById('almuerzoItems');
  const galleryGrid = document.getElementById('galleryGrid');
  const emptyState = document.getElementById('emptyState');
  const deleteModal = document.getElementById('deleteModal');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const botConfigSection = document.getElementById('botConfigSection');
  const botItemsList = document.getElementById('botItemsList');
  const btnSaveBotConfig = document.getElementById('btnSaveBotConfig');

  // Upload method state
  let uploadMethod = 'file'; // 'file' or 'url'

  // Initialize
  function init() {
    loadContentData();
    setupEventListeners();
    renderGallery();
    DeportesModal.init();
  }

  // Load content data from localStorage and JSON file
  function loadContentData() {
    // First try to load from localStorage
    const saved = localStorage.getItem('pcb_content_data');
    if (saved) {
      try {
        contentData = JSON.parse(saved);
        return;
      } catch (e) {
        console.error('Error loading content data from localStorage:', e);
      }
    }

    // If not in localStorage, try to load from JSON file
    fetch('data/content-data.json')
      .then(response => response.json())
      .then(data => {
        contentData = data;
        saveContentData(); // Save to localStorage
        renderGallery();
      })
      .catch(error => {
        console.error('Error loading content data from file:', error);
        contentData = initializeDefaultData();
        renderGallery();
      });
  }

  // Initialize default data structure
  function initializeDefaultData() {
    const data = {
      biblioteca: [],
      comedor: [],
      promociones: [],
      avisos: [],
      menu_comedor: {
        desayuno: ['Revoltillo', 'Peras Frescas', 'Melocotones', 'Leche'],
        almuerzo: ['Arroz', 'Habichuelas guisadas con calabaza', 'Carne de Cerdo', 'Zanahoria', 'Manzana', 'Coctel de fruta']
      }
    };

    // Add existing biblioteca images
    for (let i = 1; i <= 5; i++) {
      data.biblioteca.push({
        id: `biblioteca_${i}`,
        filename: `image${i}.png`,
        path: `galeriabiblioteca/image${i}.png`,
        title: `Foto de la biblioteca ${i}`,
        description: '',
        dateAdded: new Date().toISOString()
      });
    }

    // Add existing promociones image
    data.promociones.push({
      id: 'promociones_1',
      filename: 'image1.jpeg',
      path: 'galeriadepromociones/image1.jpeg',
      title: 'Inscripción Abierta 2026',
      description: '¡Únete a nuestra familia educativa!',
      dateAdded: new Date().toISOString()
    });

    // Add existing aviso
    data.avisos.push({
      id: 'avisos_1',
      filename: 'Aviso30-enero-2026.jpeg',
      path: 'Avisos/Aviso30-enero-2026.jpeg',
      title: 'Aviso Importante',
      description: 'Información actualizada - 30 de enero 2026',
      dateAdded: new Date().toISOString()
    });

    saveContentData(data);
    return data;
  }

  // Save content data to localStorage
  function saveContentData(data = contentData) {
    localStorage.setItem('pcb_content_data', JSON.stringify(data));
  }

  // Setup event listeners
  function setupEventListeners() {
    // Navigation
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        switchSection(section);
      });
    });

    // Add image button
    btnAddImage.addEventListener('click', showUploadForm);
    btnCancelUpload.addEventListener('click', hideUploadForm);

    // Edit menu button
    btnEditMenu.addEventListener('click', showMenuEditor);
    btnCancelMenu.addEventListener('click', hideMenuEditor);

    // Export data button
    btnExportData.addEventListener('click', exportDataToJSON);

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchUploadTab(tab);
      });
    });

    // File input preview
    if (imageFile) {
      imageFile.addEventListener('change', handleFileSelect);
    }

    // URL input preview
    if (imageUrl) {
      imageUrl.addEventListener('input', handleUrlInput);
      imageUrl.addEventListener('blur', handleUrlBlur);
    }

    // Upload form
    uploadForm.addEventListener('submit', handleUploadSubmit);

    // Menu form
    menuForm.addEventListener('submit', handleMenuSubmit);

    // Delete modal
    btnConfirmDelete.addEventListener('click', confirmDelete);
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });

    // Add buttons for deportes
    const btnAddCompetencia = document.getElementById('btnAddCompetencia');
    const btnAddResultado = document.getElementById('btnAddResultado');
    const btnAddDeporte = document.getElementById('btnAddDeporte');
    const btnAddStaff = document.getElementById('btnAddStaff');

    if (btnAddCompetencia) btnAddCompetencia.addEventListener('click', () => addCompetencia());
    if (btnAddResultado) btnAddResultado.addEventListener('click', () => addResultado());
    if (btnAddDeporte) btnAddDeporte.addEventListener('click', () => addDeporte());
    if (btnAddStaff) btnAddStaff.addEventListener('click', () => addStaff());
  }

  // Switch upload tab
  function switchUploadTab(tab) {
    uploadMethod = tab;

    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    const tabFile = document.getElementById('tabFile');
    const tabUrl = document.getElementById('tabUrl');

    if (tab === 'file') {
      tabFile.style.display = 'block';
      tabUrl.style.display = 'none';
      if (imageFile) imageFile.required = true;
      if (imageUrl) imageUrl.required = false;
    } else {
      tabFile.style.display = 'none';
      tabUrl.style.display = 'block';
      if (imageFile) imageFile.required = false;
      if (imageUrl) imageUrl.required = true;
    }
  }

  // Handle URL input
  function handleUrlInput() {
    const url = imageUrl.value.trim();
    if (url && isValidImageUrl(url)) {
      showUrlPreview(url);
    } else {
      urlPreview.innerHTML = '';
    }
  }

  // Handle URL blur (when user leaves the input)
  function handleUrlBlur() {
    const url = imageUrl.value.trim();
    if (url && !isValidImageUrl(url)) {
      alert('⚠️ La URL no parece ser válida. Asegúrate de que termine en .jpg, .jpeg, .png, .gif o .webp');
    }
  }

  // Check if URL is a valid image URL
  function isValidImageUrl(url) {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
    } catch {
      return false;
    }
  }

  // Show URL preview
  function showUrlPreview(url) {
    urlPreview.innerHTML = `
      <p style="margin-bottom: 0.5rem; color: #666;">Vista previa:</p>
      <img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<p style=color:red>❌ No se pudo cargar la imagen. Verifica la URL.</p>'">
    `;
  }

  // Switch section
  function switchSection(section) {
    currentSection = section;

    // Update nav buttons
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === section);
    });

    // Update title
    sectionTitle.textContent = SECTIONS[section].title;

    // Show/hide buttons based on section
    if (section === 'comedor') {
      btnEditMenu.style.display = 'inline-block';
      btnAddImage.style.display = 'inline-block';
    } else if (section === 'bot') {
      btnEditMenu.style.display = 'none';
      btnAddImage.style.display = 'none';
    } else if (section === 'deportes') {
      btnEditMenu.style.display = 'none';
      btnAddImage.style.display = 'none';
    } else {
      btnEditMenu.style.display = 'none';
      btnAddImage.style.display = 'inline-block';
    }

    // Show/hide sections
    if (section === 'bot') {
      galleryGrid.style.display = 'none';
      emptyState.style.display = 'none';
      botConfigSection.style.display = 'block';
      renderBotConfig();
    } else if (section === 'deportes') {
      galleryGrid.style.display = 'none';
      emptyState.style.display = 'none';
      botConfigSection.style.display = 'none';
      deportesEditorSection.style.display = 'block';
      renderDeportesEditor();
    } else {
      galleryGrid.style.display = 'grid';
      botConfigSection.style.display = 'none';
      deportesEditorSection.style.display = 'none';
    }

    // Hide forms and render gallery
    hideUploadForm();
    hideMenuEditor();
    if (section !== 'bot' && section !== 'deportes') {
      renderGallery();
    }
  }

  // Show upload form
  function showUploadForm() {
    hideMenuEditor();
    uploadSection.style.display = 'block';
    uploadForm.reset();
    filePreview.innerHTML = '';
    uploadSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Hide upload form
  function hideUploadForm() {
    uploadSection.style.display = 'none';
    uploadForm.reset();
    filePreview.innerHTML = '';
  }

  // Show menu editor
  function showMenuEditor() {
    hideUploadForm();
    menuEditorSection.style.display = 'block';

    // Load current menu data
    const menuData = contentData.menu_comedor || {
      desayuno: [],
      almuerzo: []
    };

    desayunoItems.value = menuData.desayuno.join('\n');
    almuerzoItems.value = menuData.almuerzo.join('\n');

    menuEditorSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Hide menu editor
  function hideMenuEditor() {
    menuEditorSection.style.display = 'none';
    menuForm.reset();
  }

  // Handle file select
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) {
      filePreview.innerHTML = '';
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      imageFile.value = '';
      filePreview.innerHTML = '';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      filePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }

  // Handle upload submit
  function handleUploadSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('imageTitle').value || 'Sin título';
    const description = document.getElementById('imageDescription').value || '';

    if (uploadMethod === 'url') {
      // Handle URL upload
      const url = imageUrl.value.trim();

      if (!url) {
        alert('⚠️ Por favor ingresa una URL de imagen');
        return;
      }

      if (!isValidImageUrl(url)) {
        alert('⚠️ La URL no parece ser válida. Asegúrate de que termine en .jpg, .jpeg, .png, .gif o .webp');
        return;
      }

      // Create image object with URL
      const imageData = {
        id: `${currentSection}_${Date.now()}`,
        filename: url.split('/').pop().split('?')[0], // Extract filename from URL
        url: url, // Store the external URL
        title: title,
        description: description,
        dateAdded: new Date().toISOString(),
        isExternal: true // Flag to indicate this is an external image
      };

      // Add to content data
      if (!contentData[currentSection]) {
        contentData[currentSection] = [];
      }
      contentData[currentSection].push(imageData);
      saveContentData();

      // Show success message
      alert('✅ Imagen añadida correctamente!\n\n🌐 La imagen se cargará desde la URL externa y funcionará perfectamente en GitHub Pages.');

      // Hide form and refresh gallery
      hideUploadForm();
      renderGallery();

    } else {
      // Handle file upload
      const file = imageFile.files[0];
      if (!file) {
        alert('⚠️ Por favor selecciona una imagen');
        return;
      }

      // Create image object
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageData = {
          id: `${currentSection}_${Date.now()}`,
          filename: file.name,
          path: `${SECTIONS[currentSection].folder}/${file.name}`,
          title: title,
          description: description,
          dateAdded: new Date().toISOString(),
          base64: e.target.result, // Store base64 for preview
          isExternal: false
        };

        // Add to content data
        if (!contentData[currentSection]) {
          contentData[currentSection] = [];
        }
        contentData[currentSection].push(imageData);
        saveContentData();

        // Show success message
        alert('✅ Imagen añadida correctamente!\n\n⚠️ Nota: Para que la imagen aparezca en GitHub Pages, debes copiar el archivo manualmente a la carpeta: ' + SECTIONS[currentSection].folder + '\n\n💡 Tip: Usa la opción "🔗 URL Externa" para evitar copiar archivos manualmente.');

        // Hide form and refresh gallery
        hideUploadForm();
        renderGallery();
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle menu submit
  function handleMenuSubmit(e) {
    e.preventDefault();

    // Get items from textareas and split by lines
    const desayuno = desayunoItems.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const almuerzo = almuerzoItems.value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    // Validate
    if (desayuno.length === 0 && almuerzo.length === 0) {
      alert('⚠️ Por favor añade al menos un item al menú');
      return;
    }

    // Save menu data
    contentData.menu_comedor = {
      desayuno: desayuno,
      almuerzo: almuerzo
    };
    saveContentData();

    // Show success message
    alert('✅ Menú actualizado correctamente!\n\nLos cambios se verán reflejados en la página del comedor.');

    // Hide form
    hideMenuEditor();
  }

  // Render gallery
  function renderGallery() {
    const items = contentData[currentSection] || [];

    if (items.length === 0) {
      galleryGrid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    galleryGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    galleryGrid.innerHTML = items.map(item => {
      // Determine image source: URL > base64 > path
      const imgSrc = item.url || item.base64 || item.path;
      const sourceLabel = item.isExternal ? '🌐 URL Externa' : '📁 Archivo Local';

      return `
        <div class="gallery-item" data-id="${item.id}">
          <img src="${imgSrc}" alt="${item.title}" class="gallery-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22250%22%3E%3Crect fill=%22%23f5f7fa%22 width=%22300%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2218%22 fill=%22%23999%22%3E📷 Imagen%3C/text%3E%3C/svg%3E'">
          <div class="gallery-item-content">
            <div class="gallery-item-title">${item.title}</div>
            ${item.description ? `<div class="gallery-item-description">${item.description}</div>` : ''}
            <div class="gallery-item-meta">
              <div class="gallery-item-filename" title="${item.url || item.filename}">
                ${sourceLabel}: ${item.filename}
              </div>
              <div class="gallery-item-actions">
                <button class="btn-icon delete" onclick="adminApp.deleteImage('${item.id}')" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Delete image
  function deleteImage(id) {
    imageToDelete = id;
    deleteModal.classList.add('active');
  }

  // Confirm delete
  function confirmDelete() {
    if (!imageToDelete) return;

    const items = contentData[currentSection] || [];
    const index = items.findIndex(item => item.id === imageToDelete);

    if (index !== -1) {
      items.splice(index, 1);
      saveContentData();
      renderGallery();
    }

    closeDeleteModal();
  }

  // Close delete modal
  function closeDeleteModal() {
    deleteModal.classList.remove('active');
    imageToDelete = null;
  }

  // Export data to JSON file
  function exportDataToJSON() {
    // Create a clean copy without base64 data (too large for JSON file)
    const exportData = JSON.parse(JSON.stringify(contentData));

    // Remove base64 data from images
    ['biblioteca', 'comedor', 'promociones', 'avisos'].forEach(section => {
      if (exportData[section]) {
        exportData[section] = exportData[section].map(item => {
          const { base64, ...rest } = item;
          return rest;
        });
      }
    });

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Datos exportados correctamente!\n\n📝 Instrucciones:\n1. Guarda el archivo descargado en la carpeta "data/"\n2. Sube los cambios a GitHub\n3. Las páginas se actualizarán automáticamente');
  }

  // Render bot configuration
  function renderBotConfig() {
    const avisos = contentData.avisos || [];
    const promociones = contentData.promociones || [];
    const allItems = [...avisos, ...promociones];

    if (allItems.length === 0) {
      botItemsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #95a5a6;">
          <p>No hay avisos ni promociones disponibles.</p>
          <p>Añade contenido en las secciones de Avisos o Promociones primero.</p>
        </div>
      `;
      return;
    }

    // Load current bot config
    const botConfig = JSON.parse(localStorage.getItem('pcb_bot_config') || '{}');
    const selectedIds = botConfig.selectedIds || [];

    botItemsList.innerHTML = allItems.map(item => `
      <div class="bot-item">
        <input
          type="checkbox"
          class="bot-item-checkbox"
          data-item-id="${item.id}"
          ${selectedIds.includes(item.id) ? 'checked' : ''}
        >
        <img src="${item.base64 || item.path}" alt="${item.title}" class="bot-item-preview" onerror="this.style.display='none'">
        <div class="bot-item-info">
          <h4>${item.title || 'Sin título'}</h4>
          <p>${item.description || 'Sin descripción'}</p>
        </div>
      </div>
    `).join('');
  }

  // Save bot configuration
  function saveBotConfig() {
    const checkboxes = document.querySelectorAll('.bot-item-checkbox');
    const selectedIds = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.itemId);

    const botConfig = {
      selectedIds: selectedIds,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('pcb_bot_config', JSON.stringify(botConfig));
    alert(`✅ Configuración guardada!\n\n${selectedIds.length} avisos/promociones seleccionados para mostrar en el bot.`);
  }

  // Save deportes changes to localStorage so deportes.html can read them
  function saveDeportesChanges() {
    // Ensure deportes data exists
    if (!contentData.deportes) {
      contentData.deportes = { competencias: [], resultados: [], directorio: [], staff: [] };
    }

    // Save to the main content data in localStorage
    saveContentData();

    // Also save a dedicated key for deportes so deportes.html can detect updates
    localStorage.setItem('pcb_deportes_data', JSON.stringify(contentData.deportes));
    localStorage.setItem('pcb_deportes_updated', new Date().toISOString());

    // Show success status message
    const statusEl = document.getElementById('deportesSaveStatus');
    if (statusEl) {
      statusEl.style.display = 'inline';
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 4000);
    }

    alert('✅ ¡Cambios guardados correctamente!\n\nLos cambios se verán reflejados en la página de Deportes al recargarla.');
  }

  // Setup event listeners
  const originalSetupEventListeners = setupEventListeners;
  setupEventListeners = function() {
    originalSetupEventListeners();

    // Bot config save button
    if (btnSaveBotConfig) {
      btnSaveBotConfig.addEventListener('click', saveBotConfig);
    }

    // Deportes save button
    const btnSaveDeportes = document.getElementById('btnSaveDeportes');
    if (btnSaveDeportes) {
      btnSaveDeportes.addEventListener('click', saveDeportesChanges);
    }
  };

  // Render deportes editor
  function renderDeportesEditor() {
    // Load current deportes data
    const deportesData = contentData.deportes || {
      competencias: [],
      resultados: [],
      directorio: [],
      staff: []
    };

    // Render each tab
    renderCompetencias(deportesData.competencias);
    renderResultados(deportesData.resultados);
    renderDirectorio(deportesData.directorio);
    renderStaff(deportesData.staff);

    // Setup deportes tab switching
    setupDeportesTabs();
  }

  // Setup deportes tabs
  function setupDeportesTabs() {
    const tabButtons = document.querySelectorAll('.deportes-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchDeportesTab(tab);
      });
    });
  }

  // Switch deportes tab
  function switchDeportesTab(tab) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.deportes-tab-btn');
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    const tabContents = document.querySelectorAll('.deportes-tab-content');
    tabContents.forEach(content => {
      content.style.display = content.id === `tab${tab.charAt(0).toUpperCase() + tab.slice(1)}` ? 'block' : 'none';
    });
  }

  // Render competencias
  function renderCompetencias(competencias) {
    const container = document.getElementById('competenciasList');
    if (!container) return;

    container.innerHTML = competencias.map(comp => `
      <div class="competencia-item">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="flex: 1;">
            <strong style="color: #2c3e50;">${comp.fecha}</strong>
            <span style="color: #7f8c8d; margin: 0 0.4rem;">—</span>
            <span style="color: #34495e;">${comp.evento}</span><br>
            <small style="color: #95a5a6; margin-top: 0.25rem; display: inline-block;">📍 ${comp.lugar}</small>
          </div>
          <div style="display: flex; gap: 0.4rem; flex-shrink: 0;">
            <button class="btn-icon edit" onclick="adminApp.editCompetencia('${comp.id}')" title="Editar">✏️ Editar</button>
            <button class="btn-icon delete" onclick="adminApp.deleteCompetencia('${comp.id}')" title="Eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render resultados
  function renderResultados(resultados) {
    const container = document.getElementById('resultadosList');
    if (!container) return;

    container.innerHTML = resultados.map(res => `
      <div class="resultado-item">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="flex: 1;">
            <strong style="color: #27ae60;">${res.deporte}:</strong>
            <span style="color: #34495e; margin-left: 0.3rem;">${res.resultado}</span>
          </div>
          <div style="display: flex; gap: 0.4rem; flex-shrink: 0;">
            <button class="btn-icon edit" onclick="adminApp.editResultado('${res.id}')" title="Editar">✏️ Editar</button>
            <button class="btn-icon delete" onclick="adminApp.deleteResultado('${res.id}')" title="Eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render directorio
  function renderDirectorio(directorio) {
    const container = document.getElementById('directorioList');
    if (!container) return;

    container.innerHTML = directorio.map(dep => `
      <div class="deporte-item">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="flex: 1;">
            <strong style="color: #2c3e50; font-size: 1rem;">${dep.icono} ${dep.nombre}</strong><br>
            <small style="color: #7f8c8d; margin-top: 0.2rem; display: inline-block;">${dep.descripcion}</small><br>
            <span style="display: inline-block; margin-top: 0.4rem; background: linear-gradient(135deg, #e67e22, #d35400); color: white; padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600;">${dep.estado}</span>
          </div>
          <div style="display: flex; gap: 0.4rem; flex-shrink: 0;">
            <button class="btn-icon edit" onclick="adminApp.editDeporte('${dep.id}')" title="Editar">✏️ Editar</button>
            <button class="btn-icon delete" onclick="adminApp.deleteDeporte('${dep.id}')" title="Eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render staff
  function renderStaff(staff) {
    const container = document.getElementById('staffList');
    if (!container) return;

    container.innerHTML = staff.map(member => `
      <div class="staff-item">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="flex: 1;">
            <strong style="color: #2c3e50; font-size: 1rem;">${member.icono} ${member.nombre}</strong><br>
            <small style="color: #8e44ad; font-weight: 600; margin-top: 0.2rem; display: inline-block;">${member.rol}</small><br>
            <small style="color: #7f8c8d;">${member.descripcion}</small>
          </div>
          <div style="display: flex; gap: 0.4rem; flex-shrink: 0;">
            <button class="btn-icon edit" onclick="adminApp.editStaff('${member.id}')" title="Editar">✏️ Editar</button>
            <button class="btn-icon delete" onclick="adminApp.deleteStaff('${member.id}')" title="Eliminar">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ===== Custom Modal Helper for Deportes =====
  const DeportesModal = {
    _overlay: null,
    _modal: null,
    _confirmOverlay: null,
    _confirmModal: null,

    init() {
      this._overlay = document.getElementById('deportesModalOverlay');
      this._modal = document.getElementById('deportesModal');
      this._confirmOverlay = document.getElementById('deportesConfirmOverlay');
      this._confirmModal = document.getElementById('deportesConfirmModal');

      document.getElementById('deportesModalClose').addEventListener('click', () => this.closeForm());
      document.getElementById('deportesModalCancel').addEventListener('click', () => this.closeForm());
      this._overlay.addEventListener('click', (e) => { if (e.target === this._overlay) this.closeForm(); });
      this._confirmOverlay.addEventListener('click', (e) => { if (e.target === this._confirmOverlay) this.closeConfirm(); });
    },

    openForm({ title, fields, confirmLabel = 'Guardar', onConfirm }) {
      document.getElementById('deportesModalTitle').textContent = title;
      const body = document.getElementById('deportesModalBody');
      body.innerHTML = fields.map(f => `
        <div class="dm-field">
          <label for="dm_${f.key}">${f.label}</label>
          ${f.type === 'textarea'
            ? `<textarea id="dm_${f.key}" placeholder="${f.placeholder || ''}" rows="3">${f.value || ''}</textarea>`
            : `<input type="text" id="dm_${f.key}" placeholder="${f.placeholder || ''}" value="${(f.value || '').replace(/"/g, '&quot;')}">`
          }
        </div>
      `).join('');

      const confirmBtn = document.getElementById('deportesModalConfirm');
      confirmBtn.textContent = confirmLabel;
      confirmBtn.className = 'deportes-modal-btn deportes-modal-btn-confirm';

      // Remove old listener by cloning
      const newConfirmBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
      newConfirmBtn.addEventListener('click', () => {
        const values = {};
        let valid = true;
        fields.forEach(f => {
          const el = document.getElementById(`dm_${f.key}`);
          values[f.key] = el ? el.value.trim() : '';
          if (!values[f.key]) { el.style.borderColor = '#ef4444'; valid = false; }
          else el.style.borderColor = '';
        });
        if (!valid) return;
        this.closeForm();
        onConfirm(values);
      });

      this._overlay.classList.add('active');
      // Focus first input
      setTimeout(() => {
        const first = body.querySelector('input, textarea');
        if (first) first.focus();
      }, 100);
    },

    closeForm() {
      this._overlay.classList.remove('active');
    },

    openConfirm({ title, message, type = 'danger', confirmLabel = 'Confirmar', onConfirm, onCancel }) {
      document.getElementById('deportesConfirmTitle').textContent = title;
      document.getElementById('deportesConfirmMessage').textContent = message;

      const footer = document.getElementById('deportesConfirmFooter');
      const btnClass = type === 'success' ? 'deportes-modal-btn-success'
                     : type === 'danger'  ? 'deportes-modal-btn-danger'
                     : 'deportes-modal-btn-confirm';

      footer.innerHTML = `
        <button class="deportes-modal-btn deportes-modal-btn-cancel" id="dmConfirmCancel">Cancelar</button>
        <button class="deportes-modal-btn ${btnClass}" id="dmConfirmOk">${confirmLabel}</button>
      `;

      document.getElementById('dmConfirmCancel').addEventListener('click', () => {
        this.closeConfirm();
        if (onCancel) onCancel();
      });
      document.getElementById('dmConfirmOk').addEventListener('click', () => {
        this.closeConfirm();
        if (onConfirm) onConfirm();
      });

      this._confirmOverlay.classList.add('active');
    },

    closeConfirm() {
      this._confirmOverlay.classList.remove('active');
    },

    showSuccess(message) {
      this.openConfirm({
        title: '✅ Listo',
        message,
        type: 'success',
        confirmLabel: 'Aceptar',
        onConfirm: () => {}
      });
      // Hide cancel button for success
      setTimeout(() => {
        const cancel = document.getElementById('dmConfirmCancel');
        if (cancel) cancel.style.display = 'none';
      }, 50);
    }
  };

  // Add functions for deportes management
  function addCompetencia() {
    DeportesModal.openForm({
      title: '📅 Añadir Competencia',
      fields: [
        { key: 'fecha',  label: 'Fecha',  placeholder: 'ej: 15 Feb 2026' },
        { key: 'evento', label: 'Evento', placeholder: 'Nombre del evento' },
        { key: 'lugar',  label: 'Lugar',  placeholder: 'Lugar de la competencia' }
      ],
      confirmLabel: '➕ Añadir',
      onConfirm({ fecha, evento, lugar }) {
        if (!contentData.deportes) contentData.deportes = { competencias: [], resultados: [], directorio: [], staff: [] };
        if (!contentData.deportes.competencias) contentData.deportes.competencias = [];
        contentData.deportes.competencias.push({ id: `comp_${Date.now()}`, fecha, evento, lugar });
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Competencia añadida correctamente.');
      }
    });
  }

  function addResultado() {
    DeportesModal.openForm({
      title: '🏆 Añadir Resultado',
      fields: [
        { key: 'deporte',   label: 'Deporte',   placeholder: 'ej: Baloncesto' },
        { key: 'resultado', label: 'Resultado',  placeholder: 'ej: Victoria 65-48' }
      ],
      confirmLabel: '➕ Añadir',
      onConfirm({ deporte, resultado }) {
        if (!contentData.deportes) contentData.deportes = { competencias: [], resultados: [], directorio: [], staff: [] };
        if (!contentData.deportes.resultados) contentData.deportes.resultados = [];
        contentData.deportes.resultados.push({ id: `res_${Date.now()}`, deporte, resultado });
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Resultado añadido correctamente.');
      }
    });
  }

  function addDeporte() {
    DeportesModal.openForm({
      title: '📋 Añadir Deporte',
      fields: [
        { key: 'icono',       label: 'Icono',       placeholder: 'ej: 🏀', value: '🏀' },
        { key: 'nombre',      label: 'Nombre',      placeholder: 'Nombre del deporte' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Breve descripción', type: 'textarea' },
        { key: 'estado',      label: 'Estado',      placeholder: 'ej: Equipo Activo', value: 'Equipo Activo' }
      ],
      confirmLabel: '➕ Añadir',
      onConfirm({ icono, nombre, descripcion, estado }) {
        if (!contentData.deportes) contentData.deportes = { competencias: [], resultados: [], directorio: [], staff: [] };
        if (!contentData.deportes.directorio) contentData.deportes.directorio = [];
        contentData.deportes.directorio.push({ id: `dep_${Date.now()}`, icono, nombre, descripcion, estado });
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Deporte añadido correctamente.');
      }
    });
  }

  function addStaff() {
    DeportesModal.openForm({
      title: '👥 Añadir Miembro del Staff',
      fields: [
        { key: 'icono',       label: 'Icono',       placeholder: 'ej: 👨‍🏫', value: '👨‍🏫' },
        { key: 'nombre',      label: 'Nombre',      placeholder: 'Nombre completo' },
        { key: 'rol',         label: 'Rol',         placeholder: 'ej: Entrenador de Baloncesto' },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Breve descripción', type: 'textarea' }
      ],
      confirmLabel: '➕ Añadir',
      onConfirm({ icono, nombre, rol, descripcion }) {
        if (!contentData.deportes) contentData.deportes = { competencias: [], resultados: [], directorio: [], staff: [] };
        if (!contentData.deportes.staff) contentData.deportes.staff = [];
        contentData.deportes.staff.push({ id: `staff_${Date.now()}`, icono, nombre, rol, descripcion });
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Miembro del staff añadido correctamente.');
      }
    });
  }

  // Edit functions for deportes
  function editCompetencia(id) {
    const competencia = contentData.deportes.competencias.find(c => c.id === id);
    if (!competencia) return;

    DeportesModal.openForm({
      title: '✏️ Editar Competencia',
      fields: [
        { key: 'fecha',  label: 'Fecha',  placeholder: 'ej: 15 Feb 2026', value: competencia.fecha },
        { key: 'evento', label: 'Evento', placeholder: 'Nombre del evento', value: competencia.evento },
        { key: 'lugar',  label: 'Lugar',  placeholder: 'Lugar de la competencia', value: competencia.lugar }
      ],
      confirmLabel: '💾 Guardar',
      onConfirm({ fecha, evento, lugar }) {
        competencia.fecha = fecha;
        competencia.evento = evento;
        competencia.lugar = lugar;
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Competencia actualizada correctamente.');
      }
    });
  }

  function editResultado(id) {
    const resultado = contentData.deportes.resultados.find(r => r.id === id);
    if (!resultado) return;

    DeportesModal.openForm({
      title: '✏️ Editar Resultado',
      fields: [
        { key: 'deporte',   label: 'Deporte',  placeholder: 'ej: Baloncesto', value: resultado.deporte },
        { key: 'resultado', label: 'Resultado', placeholder: 'ej: Victoria 65-48', value: resultado.resultado }
      ],
      confirmLabel: '💾 Guardar',
      onConfirm({ deporte, resultado: nuevoResultado }) {
        resultado.deporte = deporte;
        resultado.resultado = nuevoResultado;
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Resultado actualizado correctamente.');
      }
    });
  }

  function editDeporte(id) {
    const deporte = contentData.deportes.directorio.find(d => d.id === id);
    if (!deporte) return;

    DeportesModal.openForm({
      title: '✏️ Editar Deporte',
      fields: [
        { key: 'icono',       label: 'Icono',       placeholder: 'ej: 🏀', value: deporte.icono },
        { key: 'nombre',      label: 'Nombre',      placeholder: 'Nombre del deporte', value: deporte.nombre },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Breve descripción', type: 'textarea', value: deporte.descripcion },
        { key: 'estado',      label: 'Estado',      placeholder: 'ej: Equipo Activo', value: deporte.estado }
      ],
      confirmLabel: '💾 Guardar',
      onConfirm({ icono, nombre, descripcion, estado }) {
        deporte.icono = icono;
        deporte.nombre = nombre;
        deporte.descripcion = descripcion;
        deporte.estado = estado;
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Deporte actualizado correctamente.');
      }
    });
  }

  function editStaff(id) {
    const member = contentData.deportes.staff.find(s => s.id === id);
    if (!member) return;

    DeportesModal.openForm({
      title: '✏️ Editar Miembro del Staff',
      fields: [
        { key: 'icono',       label: 'Icono',       placeholder: 'ej: 👨‍🏫', value: member.icono },
        { key: 'nombre',      label: 'Nombre',      placeholder: 'Nombre completo', value: member.nombre },
        { key: 'rol',         label: 'Rol',         placeholder: 'ej: Entrenador', value: member.rol },
        { key: 'descripcion', label: 'Descripción', placeholder: 'Breve descripción', type: 'textarea', value: member.descripcion }
      ],
      confirmLabel: '💾 Guardar',
      onConfirm({ icono, nombre, rol, descripcion }) {
        member.icono = icono;
        member.nombre = nombre;
        member.rol = rol;
        member.descripcion = descripcion;
        saveContentData();
        renderDeportesEditor();
        DeportesModal.showSuccess('Miembro del staff actualizado correctamente.');
      }
    });
  }

  // Export functions for global access
  window.adminApp = {
    deleteImage,
    editCompetencia,
    deleteCompetencia: (id) => {
      DeportesModal.openConfirm({
        title: '🗑️ Eliminar Competencia',
        message: '¿Estás seguro de que deseas eliminar esta competencia? Esta acción no se puede deshacer.',
        type: 'danger',
        confirmLabel: 'Eliminar',
        onConfirm() {
          const index = contentData.deportes.competencias.findIndex(c => c.id === id);
          if (index !== -1) {
            contentData.deportes.competencias.splice(index, 1);
            saveContentData();
            renderDeportesEditor();
            DeportesModal.showSuccess('Competencia eliminada correctamente.');
          }
        }
      });
    },
    editResultado,
    deleteResultado: (id) => {
      DeportesModal.openConfirm({
        title: '🗑️ Eliminar Resultado',
        message: '¿Estás seguro de que deseas eliminar este resultado? Esta acción no se puede deshacer.',
        type: 'danger',
        confirmLabel: 'Eliminar',
        onConfirm() {
          const index = contentData.deportes.resultados.findIndex(r => r.id === id);
          if (index !== -1) {
            contentData.deportes.resultados.splice(index, 1);
            saveContentData();
            renderDeportesEditor();
            DeportesModal.showSuccess('Resultado eliminado correctamente.');
          }
        }
      });
    },
    editDeporte,
    deleteDeporte: (id) => {
      DeportesModal.openConfirm({
        title: '🗑️ Eliminar Deporte',
        message: '¿Estás seguro de que deseas eliminar este deporte? Esta acción no se puede deshacer.',
        type: 'danger',
        confirmLabel: 'Eliminar',
        onConfirm() {
          const index = contentData.deportes.directorio.findIndex(d => d.id === id);
          if (index !== -1) {
            contentData.deportes.directorio.splice(index, 1);
            saveContentData();
            renderDeportesEditor();
            DeportesModal.showSuccess('Deporte eliminado correctamente.');
          }
        }
      });
    },
    editStaff,
    deleteStaff: (id) => {
      DeportesModal.openConfirm({
        title: '🗑️ Eliminar Miembro del Staff',
        message: '¿Estás seguro de que deseas eliminar este miembro del staff? Esta acción no se puede deshacer.',
        type: 'danger',
        confirmLabel: 'Eliminar',
        onConfirm() {
          const index = contentData.deportes.staff.findIndex(s => s.id === id);
          if (index !== -1) {
            contentData.deportes.staff.splice(index, 1);
            saveContentData();
            renderDeportesEditor();
            DeportesModal.showSuccess('Miembro del staff eliminado correctamente.');
          }
        }
      });
    }
  };

  // Start the app
  init();
})();

