// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const languageButtons = document.querySelectorAll('.lang-btn');
const typeButtons = document.querySelectorAll('.type-btn');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const generateBtn = document.getElementById('generateBtn');
const results = document.getElementById('results');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.querySelector('.progress-text');
const summaryContent = document.querySelector('.summary-content');

// State
let selectedFiles = [];
let currentLanguage = 'francais';
let uploadType = 'single';

// Language Selection
languageButtons.forEach(button => {
  button.addEventListener('click', () => {
    languageButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentLanguage = button.getAttribute('data-lang');
    console.log("Langue sélectionnée :", currentLanguage);
    
    // Mettre à jour le texte des sections en fonction de la langue
    const sectionTags = document.querySelectorAll('.section-tag');
    sectionTags.forEach(tag => {
      // Créer un nouveau bouton de suppression
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-tag';
      removeButton.setAttribute('aria-label', 'Supprimer section');
      removeButton.textContent = '×';

      // Déterminer le texte à afficher
      let displayText;
      if (currentLanguage === 'francais') {
        displayText = tag.getAttribute('data-fr') || tag.getAttribute('data-section');
        tag.setAttribute('data-section', tag.getAttribute('data-fr'));
      } else {
        displayText = tag.getAttribute('data-en') || tag.getAttribute('data-section');
        tag.setAttribute('data-section', tag.getAttribute('data-en'));
      }

      console.log(`Mise à jour de la section: ${tag.textContent} -> ${displayText}`);

      // Mettre à jour le contenu
      tag.textContent = displayText;
      tag.appendChild(removeButton);
    });
  });
});
  // ===== Section Selection =====
  const sectionTags = document.getElementById('sectionTags');
  const customSections = document.getElementById('customSections');
  const addSectionBtn = document.getElementById('addSectionBtn');

  // Handle removing sections
  sectionTags.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-tag')) {
      const tag = e.target.parentElement;
      tag.remove();
    }
  });

  // Add custom sections
  addSectionBtn.addEventListener('click', addCustomSections);
  customSections.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addCustomSections();
      e.preventDefault();
    }
  });

  function addCustomSections() {
    const sections = customSections.value.split(',');
    
    sections.forEach(section => {
      section = section.trim();
      if (section) {
        console.log('📦 Section à ajouter :', section);
        // Create new section tag
        const tag = document.createElement('div');
        tag.className = 'section-tag';
        tag.setAttribute('data-section', section.toLowerCase());
        tag.innerHTML = `
          ${section}
          <button class="remove-tag" aria-label="Supprimer section">×</button>
        `;
        sectionTags.appendChild(tag);
        console.log('✅ Ajouté ! Contenu actuel :', sectionTags.innerHTML);
      }
    });
    
    // Clear input field
    customSections.value = '';
  }
// Upload Type Selection
typeButtons.forEach(button => {
  button.addEventListener('click', () => {
    typeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    uploadType = button.getAttribute('data-type');
    fileInput.multiple = uploadType === 'multiple';
    updateFileInput();
  });
});

// File Input Change
fileInput.addEventListener('change', handleFileSelect);

// Drag and Drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// File Handling Functions
function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ];

  Array.from(files).forEach(file => {
    if (allowedTypes.includes(file.type)) {
      addFileToList(file);
    }
  });

  updateGenerateButton();
}

function addFileToList(file) {
    // Check if the file is already added
    const isAlreadyAdded = selectedFiles.some(f => f.name === file.name && f.lastModified === file.lastModified);
    if (isAlreadyAdded) return;
  
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
  
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'file-text');
    icon.className = 'icon-sm';
  
    const fileName = document.createElement('span');
    fileName.className = 'file-name';
    fileName.textContent = file.name;
  
    const removeBtn = document.createElement('i');
    removeBtn.setAttribute('data-lucide', 'x');
    removeBtn.className = 'icon-sm remove-file';
  
    // Log to ensure the remove button exists and is clickable
    console.log("Ajout du bouton de suppression pour le fichier:", file.name);
  
    // Attach the event listener to the remove button
    fileList.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('remove-file')) {
          // C'est un clic sur un bouton de suppression
          const fileItem = e.target.closest('.file-item');
          const fileName = fileItem.querySelector('.file-name').textContent;
      
          console.log("Suppression du fichier:", fileName); // Vérifie si le clic est bien détecté
      
          // Supprimer le fichier de la liste et mettre à jour la liste de fichiers sélectionnés
          fileItem.remove();
          selectedFiles = selectedFiles.filter(f => f.name !== fileName);
      
          updateGenerateButton();
          updateFileInput();
        }
      });
      
  
    // Append the icon, name, and remove button
    fileItem.appendChild(icon);
    fileItem.appendChild(fileName);
    fileItem.appendChild(removeBtn);
    fileList.appendChild(fileItem);
  
    // Add the file to the selectedFiles array
    selectedFiles.push(file);
    lucide.createIcons(); // Recreate the Lucide icons
    console.log("Fichier ajouté:", file.name);
    updateGenerateButton(); // Update the generate button state
  }
  
  
  

function updateGenerateButton() {
  generateBtn.disabled = selectedFiles.length === 0;
}

function updateFileInput() {
  fileInput.value = '';
  selectedFiles = [];
  fileList.innerHTML = '';
  updateGenerateButton();
}

// Remplacer la section du code de streaming dans la fonction generateBtn click handler
generateBtn.addEventListener('click', async () => {
  // Désactiver le bouton et changer son texte
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i data-lucide="loader" class="icon-sm spin"></i> Génération...';
  lucide.createIcons();

  results.classList.remove('hidden');
  summaryContent.innerHTML = '';
  progressFill.style.width = '0%';
  progressText.textContent = 'Traitement en cours...';

  const formData = new FormData();
  selectedFiles.forEach(file => {
    formData.append('files', file);
  });
  formData.append('language', currentLanguage);
  formData.append('type', uploadType);
  const selectedSections = Array.from(document.querySelectorAll('.section-tag')).map(tag => tag.dataset.section);
  formData.append('sections', JSON.stringify(selectedSections));
  
  try {
    console.log("Envoi de la requête...");
    
    // Utiliser fetch avec l'option no-cache pour éviter tout problème de mise en cache
    const response = await fetch('/resumer', {
      method: 'POST',
      body: formData,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status} ${response.statusText}`);
    }
    
    console.log("Connexion établie, démarrage du streaming...");
    
    // Configuration du streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let resumeText = '';
    let buffer = '';
    
    // Démarrer la barre de progression
    let progressCounter = 0;
    const progressInterval = setInterval(() => {
      progressCounter = Math.min(progressCounter + 1, 90);
      progressFill.style.width = `${progressCounter}%`;
    }, 300);

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log("Streaming terminé");
          clearInterval(progressInterval);
          progressFill.style.width = '100%';
          progressText.textContent = 'Résumé terminé';
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            console.log("Ligne reçue:", line); // Log pour déboguer

            try {
              const data = JSON.parse(line.replace(/^data: /, ''));
              console.log("Données parsées:", data);

              switch(data.type) {
                case 'generating':
                  // Ajouter le contenu au résumé
                  summaryContent.innerHTML += data.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/^###\s*(.*)$/gm, '<h3>$1</h3>')
                    .replace(/^###\s*(.*?)$/gm, '<strong>### $1</strong>')
                    .replace(/^####\s*(.*?)$/gm, '<strong>#### $1</strong>')
                    .replace(/\n/g, '<br>');
                  summaryContent.scrollTop = summaryContent.scrollHeight;
                  break;

                case 'emissions':
                  console.log('📦 Émissions carbone reçues:', data.emissions_gCO2);
                  window.addCarbonEmission(data.emissions_gCO2);
                  break;

                case 'error':
                  console.error("Erreur reçue:", data.message);
                  throw new Error(data.message);
              }
            } catch (parseError) {
              console.error("Erreur de parsing:", parseError);
              console.log("Ligne non parsée:", line);
            }
          }
        }
      }
    } catch (streamError) {
      console.error("Erreur pendant le streaming:", streamError);
      clearInterval(progressInterval);
      throw streamError;
    }
    
    // Nettoyage et réinitialisation
    clearInterval(progressInterval);
    progressFill.style.width = '100%';
    progressText.textContent = 'Résumé terminé';
    
    // Réactiver le bouton
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i data-lucide="sparkles" class="icon-sm"></i> Générer le résumé';
    lucide.createIcons();
  
  } catch (error) {
    console.error('Erreur globale:', error);
    progressText.textContent = 'Erreur: ' + error.message;
    
    // Réactiver le bouton en cas d'erreur
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i data-lucide="sparkles" class="icon-sm"></i> Générer le résumé';
    lucide.createIcons();
  }
});
  
  // Download PDF
  document.querySelector('.download-btn').addEventListener('click', function() {
    // Récupérer le contenu de la div summary-content
    const summaryContent = document.querySelector('.summary-content').innerHTML;

    
    // Créer les données à envoyer
    const formData = new FormData();
    formData.append('content', summaryContent);
    
    // Créer et envoyer la requête POST
    fetch('/telecharger-docx', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la génération du document');
        }
        return response.blob();
    })
    .then(blob => {
        // Créer un URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Créer un élément <a> invisible pour déclencher le téléchargement
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'resume.docx';
        
        // Ajouter au DOM, cliquer, puis nettoyer
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer les ressources
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors du téléchargement du document.');
    });
});

  
 
  


