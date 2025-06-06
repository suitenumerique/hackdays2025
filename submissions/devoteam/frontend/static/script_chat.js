/**
 * script2.js – Version multi-page
 */

/* ------------------------------
 * Définition des prompts disponibles
 * ------------------------------ */
const prompts = {
 1: {
    title: "Renouvellement d'un document administratif",
    text: "Un usager souhaite renouveler son passeport qui expire prochainement. Indique-lui les démarches à suivre, les pièces justificatives nécessaires, les délais moyens, le coût éventuel, et les canaux disponibles (en ligne, en préfecture, etc.). Donne une réponse claire, à jour, et adaptée à son profil ",
    icon: "alert-triangle"
  },
  2: {
    title: "Recherche d'exemples de documents ou de précédents similaires",
    text: "Trouver un courrier type, une fiche projet, une fiche d'instruction, un rapport équivalent.",
    icon: "list-ordered"
  },
  3: {
    title: "Appui à la rédaction de contenus de formation ou de kits de déploiement",
    text: "Générer un support de formation à partir de documents internes.",
    icon: "gantt-chart"
  },
  4: {
    title: "Génération automatique de notes, synthèses ou courriers",
    text: "Préparer un compte rendu, une note de synthèse à partir de documents transmis par un agent.",
    icon: "gauge"
  }
};

/* ------------------------------
 * Variables globales
 * ------------------------------ */
let oldConfidence = null;
let cotPrompt = '';  // Prompt reformulé

let cotPromptText = "";
let cotCurrentIndex = 0;
let cotAccumulatedText = "";

/* ------------------------------
 * Fonctions utilitaires
 * ------------------------------ */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function computeSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  return 1 - (distance / maxLen);
}


function applyFormatting(text) {
  if (!text) return '';
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formatted = formatted.replace(/^###(.*)$/gm, '<h3>$1</h3>');
  return formatted;
}

/* ------------------------------
 * Fonction pour créer la légende de la jauge donut
 * ------------------------------ */
function createDonutLegend(donutContainer, scoreColor, baseColor) {
  const legend = document.createElement('div');
  legend.className = 'donut-legend';
  legend.innerHTML = `
    <div class="legend-item">
      <span class="legend-color" style="background-color: ${scoreColor};"></span>
      <span class="legend-label">Score obtenu</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style="background-color: ${baseColor};"></span>
      <span class="legend-label">Score restant</span>
    </div>
  `;
  donutContainer.appendChild(legend);
}

/* ------------------------------
 * Affichage des métriques avec graphiques
 * ------------------------------ */
function displayEvaluation(evaluation, qualityPrediction) {
  const metricsContainer = document.querySelector('.evaluation-metrics');
  if (!metricsContainer) return;

  let sumOfScores = 0;
  let criteriaLabels = [];
  let criteriaScores = [];

  if (evaluation && evaluation.évaluation && Array.isArray(evaluation.évaluation)) {
    evaluation.évaluation.forEach((criterion) => {
      const critName = criterion.critère ? criterion.critère.toLowerCase() : "";
      if (critName === "total" || critName === "note globale") return;
      sumOfScores += criterion.note;
      criteriaLabels.push(criterion.critère);
      criteriaScores.push(criterion.note);
    });
  }
  // On suppose que le score global est sur 100
  const globalScore = sumOfScores;

  // Vider le conteneur des métriques
  metricsContainer.innerHTML = '';

  // 1) Création et affichage de la jauge donut pour la note globale
  const donutContainer = document.createElement('div');
  donutContainer.className = 'donut-container';
  const canvasDonut = document.createElement('canvas');
  canvasDonut.width = 150;
  canvasDonut.height = 150;
  donutContainer.appendChild(canvasDonut);

  // drawDonutGauge renvoie un objet contenant les couleurs utilisées
  const { gaugeColor, baseColor } = drawDonutGauge(canvasDonut, globalScore);
  metricsContainer.appendChild(donutContainer);

  // 2) Création de la légende pour la jauge donut
  createDonutLegend(donutContainer, gaugeColor, baseColor);

  // 3) Création du conteneur pour les graphiques
  const chartsContainer = document.createElement('div');
  chartsContainer.className = 'charts-container';

  // Création et ajout du canvas du graphique en tendance
  const trendCanvas = document.createElement('canvas');
  trendCanvas.id = 'trendChart';
  trendCanvas.width = 400;
  trendCanvas.height = 300;
  chartsContainer.appendChild(trendCanvas);

  // Création et ajout du canvas du graphique radar
  const radarCanvas = document.createElement('canvas');
  radarCanvas.id = 'radarChart';
  radarCanvas.width = 400;
  radarCanvas.height = 300;
  chartsContainer.appendChild(radarCanvas);

  // Création et ajout du canvas du graphique histogramme
  const histogramCanvas = document.createElement('canvas');
  histogramCanvas.id = 'histogramChart';
  histogramCanvas.width = 400;
  histogramCanvas.height = 300;
  chartsContainer.appendChild(histogramCanvas);

  // Ajout du conteneur des graphiques dans le conteneur principal
  metricsContainer.appendChild(chartsContainer);

  // 4) Dessin des graphiques avec Chart.js
  drawTrendChart(trendCanvas, criteriaLabels, criteriaScores);
  drawRadarChart(radarCanvas, criteriaLabels, criteriaScores);
  drawHistogramChart(histogramCanvas, criteriaLabels, criteriaScores);
}

/* Fonction de dessin de la jauge en donut */
function drawDonutGauge(canvas, score, maxScore = 100) {
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10; // marge de 10px
  const lineWidth = 15;
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (score / maxScore) * 2 * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner le cercle de fond (partie "score restant")
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  const baseColor = "#ddd";
  ctx.strokeStyle = baseColor;
  ctx.stroke();

  // Déterminer la couleur de la partie "score obtenu"
  let gaugeColor;
  if (score < 50) {
    gaugeColor = "#e74c3c"; // Rouge
  } else if (score < 75) {
    gaugeColor = "#f1c40f"; // Orange / Jaune
  } else {
    gaugeColor = "#2ecc71"; // Vert
  }

  // Dessiner l'arc représentant le score obtenu
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = gaugeColor;
  ctx.stroke();

  // Afficher le score au centre
  ctx.font = "20px Arial";
  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(score + "/100", centerX, centerY);

  // Retourner les couleurs utilisées pour la légende
  return { gaugeColor, baseColor };
}

/* Fonctions de dessin avec Chart.js */
function drawTrendChart(canvas, labels, scores) {
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tendance des scores',
        data: scores,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 25
        }
      }
    }
  });
}

function drawRadarChart(canvas, labels, scores) {
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Scores par critère',
        data: scores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)'
      }]
    },
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 25
        }
      }
    }
  });
}

function drawHistogramChart(canvas, labels, scores) {
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Score par critère',
        data: scores,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'x',
      scales: {
        y: {
          beginAtZero: true,
          max: 25
        }
      }
    }
  });
}

function toggleEvaluationMode(isHumanMode) {
  const sliders = document.querySelectorAll('.user-slider');
  const controls = document.querySelectorAll('.criterion-controls');
  if (isHumanMode) {
    controls.forEach((c) => c.classList.remove('hidden'));
    sliders.forEach((slider) => (slider.disabled = false));
  } else {
    controls.forEach((c) => c.classList.add('hidden'));
    sliders.forEach((slider) => (slider.disabled = true));
  }
}

async function handleDownload(format) {
  alert(`Téléchargement du format ${format} (fonctionnalité à implémenter).`);
}

/* ------------------------------
 * Gestion de la navigation multi-page
 * ------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  //console.log(currentPath);
  /* === PAGE D'ACCUEIL (index.html) === */
  if (currentPath.includes('/chat')) {
  const promptGrid = document.getElementById('prompt-grid');
  //console.log(promptGrid);


  Object.entries(prompts).forEach(([id, prompt]) => {
    const card = document.createElement('div');
    card.className = 'feature-card prompt-card';
    card.innerHTML = `
      <i data-lucide="${prompt.icon}" class="icon blue"></i>
      <h2>Prompt ${id}: ${prompt.title}</h2>
      <p>${prompt.text}</p>
      <button class="select-prompt-btn fr-btn" data-prompt-id="${id}">
      <i data-lucide="play" class="icon-sm"></i>
        Sélectionner
      </button>
    `;
    promptGrid.appendChild(card);
  });

  // Active les icônes Lucide sur le contenu injecté
  lucide.createIcons();
  }
  
    // Add click handlers for prompt selection
    document.querySelectorAll('.select-prompt-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const promptId = e.target.dataset.promptId;
        const prompt = prompts[promptId];
        console.log('Prompt ID:', promptId);
        console.log('Prompt Text:', prompt.text);
        sessionStorage.setItem('selectedPromptId', promptId);
        sessionStorage.setItem('selectedPromptText', prompt.text);
        window.location.href = '/reformulation';
      });
    });
// Ajouter le gestionnaire pour next-page-btn
document.querySelector('.next-page-btn')?.addEventListener('click', () => {
  const customPromptText = document.querySelector('#customUsecase')?.value || '';
  sessionStorage.setItem('selectedPromptId', 'personnalisé');
  sessionStorage.setItem('selectedPromptText', customPromptText);
  window.location.href = '/reformulation';
});
// Ajouter le gestionnaire pour la touche Entrée
document.querySelector('#customUsecase')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const customPromptText = e.target.value || '';
    sessionStorage.setItem('selectedPromptId', 'personnalisé');
    sessionStorage.setItem('selectedPromptText', customPromptText);
    window.location.href = '/reformulation';
  }
});
  /* === Bouton "Back" sur chaque page === */
  const backButton = document.querySelector('.back-button');
  if (backButton) {
    if (currentPath.includes('/reformulation')) {
      backButton.addEventListener('click', () => {
        window.location.href = '/chatbot';
      });
    } else if (currentPath.includes('/generation')) {
      backButton.addEventListener('click', () => {
        window.location.href = '/reformulation';
      });
    } else if (currentPath.includes('/results')) {
      backButton.addEventListener('click', () => {
        window.location.href = '/generation';
      });
    }
  }

  /* === PAGE DE REFORMULATION (/reformulation) === */
  //console.log(currentPath);
  if (currentPath.includes('/reformulation')) {
 
    // Affichage du prompt sélectionné
    const promptId = sessionStorage.getItem('selectedPromptId');
    const promptText = sessionStorage.getItem('selectedPromptText');
    if (promptText) {
      document.querySelector('.selected-prompt-title').textContent = `Prompt ${promptId}`;
      document.querySelector('.selected-prompt-text').textContent = promptText;
    }
  
    // Gestion des sliders et de leurs valeurs
    const sliders = {
      'reform-temp': { value: 0.7, step: 0.01 },
      'reform-top-p': { value: 0.7, step: 0.01 },
      'reform-top-k': { value: 40, step: 1 }
    };
    const reformTempValue = document.querySelector('.reform-temp-value');
    const reformTopPValue = document.querySelector('.reform-top-p-value');
    const reformTopKValue = document.querySelector('.reform-top-k-value');
    console.log('Température :', reformTempValue);
    console.log('TopP :', reformTopPValue);
    console.log('TopK :', reformTopKValue);
    Object.entries(sliders).forEach(([id, config]) => {
      const slider = document.getElementById(id);
      const valueDisplay = slider?.parentElement.querySelector(`.${id}-value`); // Utilisation d'un sélecteur dynamique pour chaque slider
      if (slider && valueDisplay) {
        slider.addEventListener('input', () => {
          const value = (slider.value * config.step).toFixed(2);
          valueDisplay.textContent = value; // Mise à jour du texte dans le bon span
          config.value = parseFloat(value); // Met à jour la valeur dans l'objet sliders
        });
        // Affichage de la valeur initiale
        valueDisplay.textContent = (slider.value * config.step).toFixed(2);
      }
    });
    
    // Toggle des paramètres avancés
    const advancedSettingsToggle = document.querySelector('.advanced-settings-toggle');
    const advancedSettings = document.querySelector('.advanced-settings');
  
    console.log('[JS] Élément du bouton trouvé :', advancedSettingsToggle);
  console.log('[JS] Élément des paramètres avancés trouvé :', advancedSettings);
  if (!advancedSettingsToggle || !advancedSettings) {
    console.warn('[JS] Un ou plusieurs éléments ne sont pas trouvés. Vérifie le HTML.');
    return;
  }
    advancedSettingsToggle?.addEventListener('click', () => {
      console.log('[JS] Clic détecté sur le bouton de paramètres avancés');
      advancedSettings.classList.toggle('hidden');
      const isHidden = advancedSettings.classList.contains('hidden');
      console.log('[JS] Paramètres maintenant cachés ?', isHidden);
      advancedSettingsToggle.innerHTML = `
        <i data-lucide="${isHidden ? 'settings' : 'settings-2'}" class="icon-sm"></i>
        ${isHidden ? 'Paramètres avancés' : 'Masquer les paramètres'}
      `;
      console.log('[JS] Icône et texte mis à jour');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('[JS] Icônes Lucide rechargées');
      } else {
        console.warn('[JS] Lucide n\'est pas défini');
      }
    });
  
    // Bouton de reformulation CoT
    const reformulateCotButton = document.querySelector('.reformulate-cot-button');
    console.log('bouton',reformulateCotButton);
    if (reformulateCotButton) {

      reformulateCotButton.addEventListener('click', async () => {
        const promptTextLocal = sessionStorage.getItem('selectedPromptText');
        
        //console.log('prompt selectionne',promptTextLocal);
        reformulateCotButton.classList.add('loading');
        reformulateCotButton.textContent = 'Reformulating...';

        try {
          // Afficher le prompt initial avec l'approche CoT
          const reformulationResult = document.querySelector('.reformulation-content');
          if (reformulationResult) {
            const cotPrompt = `${promptTextLocal}Réfléchis en plusieurs étapes et explique ton raisonnement avant de donner la réponse.`;
            reformulationResult.textContent = cotPrompt;
            
            // Sauvegarder le prompt reformulé dans la session
            sessionStorage.setItem('cotPrompt', cotPrompt);
            const cotprompt = cotPrompt || promptTextLocal;
          sessionStorage.setItem(`cotPrompt-${promptId}`, cotprompt);
          }
        } catch (err) {
          console.error("Détails de l'erreur:", err);
          alert('Erreur pendant la reformulation.');
        } finally {
          reformulateCotButton.classList.remove('loading');
          reformulateCotButton.textContent = 'Reformulation CoT';
        }
      });
    }
    //const reformulationResult = document.querySelector('.reformulation-result');
    // Bouton de reformulation CoD
    const reformulateCodButton = document.querySelector('.reformulate-cod-button');
    console.log('bouton',reformulateCodButton);
    if (reformulateCodButton) {

      reformulateCodButton.addEventListener('click', async () => {
        const promptTextLocal = sessionStorage.getItem('selectedPromptText');
        
        //console.log('prompt selectionne',promptTextLocal);
        reformulateCodButton.classList.add('loading');
        reformulateCodButton.textContent = 'Reformulating...';

        try {
          // Afficher le prompt initial avec l'approche CoT
          const reformulationResult = document.querySelector('.reformulation-content');
          if (reformulationResult) {
            const cotPrompt = `${promptTextLocal}\n\nRéfléchis en plusieurs étapes, mais ne garde qu'un mini-brouillon de chaque étape (5 mots maximum). Donne uniquement la réponse finale à la fin`;
            reformulationResult.textContent = cotPrompt;
            
            // Sauvegarder le prompt reformulé dans la session
            sessionStorage.setItem('cotPrompt', cotPrompt);
            const cotprompt = cotPrompt || promptTextLocal;
          sessionStorage.setItem(`cotPrompt-${promptId}`, cotprompt);
          }
        } catch (err) {
          console.error("Détails de l'erreur:", err);
          alert('Erreur pendant la reformulation.');
        } finally {
          reformulateCodButton.classList.remove('loading');
          reformulateCodButton.textContent = 'Reformulation CoD';
        }
      });
    }  

        // Bouton de reformulation DCACoT
    const reformulateDCACoTButton = document.querySelector('.reformulate-dcacot-button');
    console.log('bouton',reformulateDCACoTButton);
    if (reformulateDCACoTButton) {

      reformulateDCACoTButton.addEventListener('click', async () => {
        const promptTextLocal = sessionStorage.getItem('selectedPromptText');
        
        //console.log('prompt selectionne',promptTextLocal);
        reformulateDCACoTButton.classList.add('loading');
        reformulateDCACoTButton.textContent = 'Reformulating...';

        try {
          // Afficher le prompt initial avec l'approche CoT
          const reformulationResult = document.querySelector('.reformulation-content');
          if (reformulationResult) {
            const cotPrompt = `Contexte :
                              En tant qu'expert en gestion de projet, tu vas reformuler le prompt suivant pour qu'il soit plus adapté
                              ${promptTextLocal}\n\nRéfléchis en plusieurs étapes et explique ton raisonnement avant de donner la réponse.`;
            reformulationResult.textContent = cotPrompt;
            
            // Sauvegarder le prompt reformulé dans la session
            sessionStorage.setItem('cotPrompt', cotPrompt);
            const cotprompt = cotPrompt || promptTextLocal;
          sessionStorage.setItem(`cotPrompt-${promptId}`, cotprompt);
          }
        } catch (err) {
          console.error("Détails de l'erreur:", err);
          alert('Erreur pendant la reformulation.');
        } finally {
          reformulateDCACoTButton.classList.remove('loading');
          reformulateDCACoTButton.textContent = 'Reformulation DCA CoT';
        }
      });
    }  


  

  
    // Ajustement : plus court / plus long
    document.querySelector('.shorter')?.addEventListener('click', () => {
      reformulationContent.textContent = 'Version plus courte du prompt...';
    });
  
    document.querySelector('.longer')?.addEventListener('click', () => {
      reformulationContent.textContent = 'Version plus longue du prompt...';
    });
  
    // Navigation
    document.querySelector('.next-button')?.addEventListener('click', () => {
      window.location.href = '/generation';
    });
  
    document.querySelector('.back-button')?.addEventListener('click', () => {
      console.log('Retour aux prompts');
    });
  
    // Info-bulles
    document.querySelectorAll('.info-icon').forEach(icon => {
      icon.addEventListener('mouseover', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.getAttribute('title');
        document.body.appendChild(tooltip);
  
        const rect = e.target.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left}px`;
      });
  
      icon.addEventListener('mouseout', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
      });
    });
  }
  
  /* === PAGE DE GÉNÉRATION (/generation) === */
  if (currentPath.includes('/generation')) {
    let container = document.querySelector('.container');
    if (!container) {
      container = document.body;
    }


    const promptId = sessionStorage.getItem('selectedPromptId');
    const promptText = sessionStorage.getItem('selectedPromptText'); // Utiliser le texte stocké directement
  
    const storedCotPrompt = sessionStorage.getItem(`cotPrompt-${promptId}`);
    const effectivePrompt = storedCotPrompt || promptText;
  
    // Mettre à jour le titre et le texte
    const promptTitle = document.querySelector('.selected-prompt-title');
    const promptTextElement = document.querySelector('.selected-prompt-text');
  
    if (promptId === 'personnalisé') {
      promptTitle.textContent = 'Prompt personnalisé';
      promptTextElement.textContent = promptText; // Utiliser le texte personnalisé
    } else {
      promptTitle.textContent = `Prompt ${promptId}`;
      promptTextElement.textContent = effectivePrompt;
    }

// DOM Elements
const advancedSettingsToggle = document.getElementById('advanced-settings-toggle');
const advancedSettings = document.getElementById('advanced-settings');
const chevronIcon = document.getElementById('chevron-icon');
const genTempSlider = document.getElementById('gen-temp');
const genTopPSlider = document.getElementById('gen-top-p');
const genTopKSlider = document.getElementById('gen-top-k');
const genTempValue = document.getElementById('temp-value');
const genTopPValue = document.getElementById('top-p-value');
const genTopKValue = document.getElementById('top-k-value');

// State
let showAdvanced = false;

// Functions
function toggleAdvancedSettings() {
  showAdvanced = !showAdvanced;
  advancedSettings.classList.toggle('hidden');
  chevronIcon.style.transform = showAdvanced ? 'rotate(180deg)' : 'rotate(0)';
}

function updateSliderValue(value, element, divider = 100) {
  element.textContent = (value / divider).toFixed(2);
}

// Event Listeners
advancedSettingsToggle.addEventListener('click', toggleAdvancedSettings);

genTempSlider.addEventListener('input', (e) => {
  document.getElementById('temp-value').textContent = (e.target.value / 100).toFixed(2);
});

genTopPSlider.addEventListener('input', (e) => {
  document.getElementById('top-p-value').textContent = (e.target.value / 100).toFixed(2);
});

genTopKSlider.addEventListener('input', (e) => {
  document.getElementById('top-k-value').textContent = e.target.value;
});

// Initialize tooltips
document.querySelectorAll('.info-icon').forEach(icon => {
  icon.addEventListener('mouseover', (e) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('title');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '0.5rem';
    tooltip.style.borderRadius = '0.25rem';
    tooltip.style.fontSize = '0.875rem';
    tooltip.style.zIndex = '50';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
  });

  icon.addEventListener('mouseout', () => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  });
});



    const selectedPromptTitle = document.querySelector('.selected-prompt-title').textContent;
    const generateButton = document.querySelector('.generate-button');
    console.log("Effective prompt",effectivePrompt )
    if (generateButton) {
      generateButton.addEventListener('click', async () => {
        if (!effectivePrompt) return;
    
        generateButton.classList.add('loading');
        generateButton.textContent = 'Generating...';
    
        const genModelRadios = document.querySelectorAll('input[name="gen-model"]');
        let modelLetter = 'A';
        for (const radio of genModelRadios) {
          if (radio.checked) {
            modelLetter = radio.value;
            break;
          }
        }
    
        const temperature = parseFloat(genTempValue.textContent);
        const top_p = parseFloat(genTopPValue.textContent);
        const top_k = parseInt(genTopKValue.textContent);
    
        // ⏺️ Stocker le prompt et les paramètres
        sessionStorage.setItem('prompt_res', effectivePrompt);
        sessionStorage.setItem('model_cot_res', modelLetter);
        sessionStorage.setItem('model_response_res', modelLetter);
        sessionStorage.setItem('temperature_res', temperature);
        sessionStorage.setItem('top_p_res', top_p);
        sessionStorage.setItem('top_k_res', top_k);
    
        // ✅ Rediriger directement
        window.location.href = '/results';
      });
    }
    
  }

  /* === PAGE DES RÉSULTATS (/results) === */
  if (currentPath.includes('/results')) {
    const prompt = sessionStorage.getItem('prompt_res');
    const model_response = sessionStorage.getItem('model_response_res');
    const temperature = parseFloat(sessionStorage.getItem('temperature_res'));
    const top_p = parseFloat(sessionStorage.getItem('top_p_res'));
    const top_k = parseInt(sessionStorage.getItem('top_k_res'));
    const model_cot = sessionStorage.getItem('model_cot_res');
    const resultsSection = document.querySelector('.results-section');
    const promptId = sessionStorage.getItem('selectedPromptId');
    const promptText = sessionStorage.getItem('selectedPromptText'); // Utiliser le texte stocké directement
  
    // Mettre à jour le titre et le texte
    const promptTitle = document.querySelector('.selected-prompt-title');
    const promptTextElement = document.querySelector('.selected-prompt-text');
  
    if (promptId === 'personnalisé') {
      promptTitle.textContent = 'Prompt personnalisé';
      promptTextElement.textContent = promptText; // Utiliser le texte personnalisé
    } else {
      promptTitle.textContent = `Prompt ${promptId}`;
      promptTextElement.textContent = promptText;
    }
    resultsSection.classList.remove('hidden');

    const responseContent = document.querySelector('.response-content');
    const evaluationContainer = document.querySelector('.evaluation-metrics');
    responseContent.textContent = "";
    evaluationContainer.innerHTML = `<p>En attente d'évaluation...</p>`;
    
    //console.log('prompt', prompt);
    //console.log('model_response', model_response);
    //console.log('temperature', temperature);
    //console.log('top_p', top_p);
    //console.log('top_k', top_k);

    // Utiliser notre nouvelle fonction de streaming
    fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model_response, temperature, top_p, top_k }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return handleResponseStreaming(response);
    })
    .then(result => {
      // Stocker les données de génération si nécessaire
      if (result.response) {
        sessionStorage.setItem("generationData", JSON.stringify({
          response: result.response,
          evaluation: result.evaluation,
          quality: result.quality
        }));
      }
    })
    .catch(err => {
      console.error('Erreur:', err);
      responseContent.innerHTML = `<div class="error-message">Erreur: ${err.message}</div>`;
    });




    const downloadButton = document.querySelector('.download-button');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            const downloadOptions = document.querySelector('.download-options');
            if (downloadOptions) {
                downloadOptions.classList.toggle('hidden');
            }
        });
    }
    const downloadOptionsContainer = document.querySelector('.download-options');
    if (downloadOptionsContainer) {
        downloadOptionsContainer.innerHTML = `
            <div class="download-option" data-format="jpeg">JPEG</div>
            <div class="download-option" data-format="png">PNG</div>
            <div class="download-option" data-format="pdf">PDF</div>
            <div class="download-option" data-format="csv">CSV</div>
        `;
        downloadOptionsContainer.querySelectorAll('.download-option').forEach((option) => {
            option.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-format');
                handleDownload(format);
                downloadOptionsContainer.classList.add('hidden');
            });
        });
    }

    // Fonction de téléchargement PDF
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener('click', async () => {
        try {
          if (promptText.includes('backlog')) {
          // Extraire les données du tableau HTML
          const table = document.querySelector('.response-content table');
          if (!table) {
            throw new Error('Tableau non trouvé dans la réponse');
        }
          const rows = table.querySelectorAll('tbody tr');
          
          const items = Array.from(rows).map(row => {
              const cells = row.querySelectorAll('td');
              return {
                  name: cells[0].textContent.trim(),
                  user_story: cells[1].textContent.trim(),
                  priority: cells[2].textContent.trim(),
                  size: cells[3].textContent.trim(),
                  status: cells[4].textContent.trim()
              };
          });
  
          // Envoyer les données à l'API
          const response = await fetch('/generate-pdf', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  title: 'Product Backlog',
                  items: items
              })
          });
  
          if (!response.ok) {
              throw new Error('Erreur lors de la génération du PDF');
          }
  
          // Télécharger le PDF
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'product_backlog.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
       
          // Récupérer les données nécessaires
          const responseContent = document.querySelector('.response-content').innerHTML;
              // Créer les données à envoyer
          const formData = new FormData();
          formData.append('content', responseContent);
          
          // Afficher l'état de chargement
          downloadPdfBtn.textContent = 'Génération du PDF...';
          downloadPdfBtn.disabled = true;

          // Appeler l'endpoint de génération PDF
          fetch('/generate-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              html: document.querySelector('.response-content').outerHTML
            })
          })
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'analyse_risques.pdf';
            a.click();
          })
          .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors du téléchargement du document.');
        });
      }



      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la génération du PDF.');
        } finally {
          // Restaurer le bouton
          downloadPdfBtn.textContent = 'Télécharger en PDF';
          downloadPdfBtn.disabled = false;
        }

      });
    }
  }

function highlightHallucinations(text, factChecking) {
  let modifiedText = text;

  factChecking.forEach(fact => {
    const phrase = fact.phrase?.trim();
    if (!phrase) return;

    const sim = computeSimilarity(text, phrase); // facultatif si tu veux le garder
    if (sim >= 0) {
      const prob = fact.hallucination_prob;
      const hType = fact.explication;

      let typeClass = {
        'MIN-01': 'hallucination-min-01',
        'MOD-02': 'hallucination-mod-02',
        'HIGH-03': 'hallucination-high-03'
      }[hType] || '';

      let probClass = prob >= 30 ? 'hallucination-high'
        : prob >= 20 ? 'hallucination-medium'
        : prob >= 10 ? 'hallucination-low'
        : '';

      const combinedClasses = `${typeClass} ${probClass}`.trim();
      const typeInfo = hType ? `Type: ${hType}` : '';

      const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      modifiedText = modifiedText.replace(regex, `<span class="${combinedClasses}" title="Prob: ${prob}% - ${typeInfo}">${phrase}</span>`);
    }
  });

  return modifiedText;
}

// Fonction pour mettre à jour l'indicateur de phase
function updatePhaseIndicator(phase) {
  const generationPhase = document.querySelector('.generation-phase');
  const evaluationPhase = document.querySelector('.evaluation-phase');
  const highlightPhase = document.querySelector('.highlight-phase');
  const phaseLine1 = document.querySelector('.phase-line:nth-child(2)');
  const phaseLine2 = document.querySelector('.phase-line:nth-child(4)');
  
  // Réinitialiser toutes les phases
  [generationPhase, evaluationPhase, highlightPhase].forEach(el => {
    if (el) {
      el.classList.remove('active', 'completed');
    }
  });
  
  [phaseLine1, phaseLine2].forEach(el => {
    if (el) {
      el.classList.remove('completed');
    }
  });
  
  // Mettre à jour selon la phase actuelle
  if (phase === 'generation') {
    if (generationPhase) generationPhase.classList.add('active');
  } else if (phase === 'evaluation') {
    if (generationPhase) {
      generationPhase.classList.add('completed');
      if (phaseLine1) phaseLine1.classList.add('completed');
    }
    if (evaluationPhase) evaluationPhase.classList.add('active');
  } else if (phase === 'highlight') {
    if (generationPhase) {
      generationPhase.classList.add('completed');
      if (phaseLine1) phaseLine1.classList.add('completed');
    }
    if (evaluationPhase) {
      evaluationPhase.classList.add('completed');
      if (phaseLine2) phaseLine2.classList.add('completed');
    }
    if (highlightPhase) highlightPhase.classList.add('active');
  } else if (phase === 'completed') {
    if (generationPhase) {
      generationPhase.classList.add('completed');
      if (phaseLine1) phaseLine1.classList.add('completed');
    }
    if (evaluationPhase) {
      evaluationPhase.classList.add('completed');
      if (phaseLine2) phaseLine2.classList.add('completed');
    }
    if (highlightPhase) highlightPhase.classList.add('completed');
  }
}

// Modifier handleResponseStreaming pour afficher les chunks en streaming puis le résultat final formaté
function handleResponseStreaming(response) {
  return new Promise((resolve, reject) => {
    const responseContent = document.querySelector('.response-content');
    const evaluationContainer = document.querySelector('.evaluation-metrics');

    if (!responseContent) {
      console.error("Élément .response-content introuvable dans le DOM");
      reject(new Error("Élément .response-content introuvable"));
      return;
    }

    let fullText = ''; // Variable pour accumuler le texte brut (Markdown)
    let evaluation = null;
    let quality = null;

    // Ajouter une classe pour indiquer que la génération est en cours
    responseContent.classList.add('generation-in-progress');
    updatePhaseIndicator('generation');

    // Optionnel: Afficher un message initial, ou commencer directement à ajouter les chunks
    // responseContent.innerHTML = '<div class="generation-status">Génération en cours...</div>';

    if (evaluationContainer) {
      evaluationContainer.innerHTML = '<p>En attente de génération...</p>';
    }

    // Créer un nouveau lecteur pour le stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Fonction pour traiter le stream
    function processStream() {
      return reader.read().then(({done, value}) => {
        if (done) {
          if (buffer) {
             // Traiter le dernier morceau s'il y en a un
             processChunk(buffer);
          }
          // Le stream du fetch est terminé, mais le message 'completed' du backend est crucial.
          // Ne rien faire de plus ici, attendre le message 'completed'.
          return;
        }

        buffer += decoder.decode(value, {stream: true});
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        lines.forEach(line => {
          if (line.trim()) {
            processChunk(line);
          }
        });

        // Continuer la lecture du stream
        return processStream();
      });
    }

    // Fonction pour traiter chaque chunk de données
    function processChunk(chunk) {
      const dataMatch = chunk.match(/^data: (.+)$/m);
      if (!dataMatch) return;

      try {
        const data = JSON.parse(dataMatch[1]);
        //console.log("Données reçues:", data); // Log pour déboguer

        switch(data.type) {
          case 'generating':
            // Accumuler le texte brut (Markdown) pour le rendu final
            if (data.content) {
              fullText += data.content;
               // Ajouter le contenu brut au fur et à mesure pour l'effet de streaming
              responseContent.textContent += data.content; // Utiliser textContent pour éviter les problèmes HTML/JS
              // Faire défiler vers le bas pour voir le nouveau contenu
              responseContent.scrollTop = responseContent.scrollHeight;

               // Si un message de statut était affiché, l'effacer au premier chunk de contenu
                if (responseContent.querySelector('.generation-status')) {
                    responseContent.innerHTML = ''; // Efface le message
                    responseContent.textContent = data.content; // Ajoute le premier contenu reçu
                }
            }
            break;

          case 'completed':
            // La génération est terminée, le fullText contient le Markdown complet
            responseContent.classList.remove('generation-in-progress');

            // --- CONVERTIR ET AFFICHER LE TABLEAU MARKDOWN EN HTML ---
            let renderedHTML = '';
             try {
                 // Utiliser Marked.js pour convertir le Markdown en HTML
                 renderedHTML = marked.parse(fullText);
                 // Utiliser DOMPurify pour nettoyer le HTML
                 renderedHTML = DOMPurify.sanitize(renderedHTML);
             } catch (markdownError) {
                 console.error("Erreur lors de la conversion Markdown:", markdownError);
                 // Afficher le texte brut en cas d'erreur de conversion
                 renderedHTML = `<div class="error-message">Erreur de rendu Markdown. Texte brut :<pre>${fullText}</pre></div>`;
             }

             // Remplacer le contenu brut streamé par le HTML rendu
             responseContent.innerHTML = renderedHTML;
             // Faire défiler vers le bas si nécessaire (même si souvent déjà en bas)
             responseContent.scrollTop = responseContent.scrollHeight;
            // ----------------------------------------------------


            // Passer à la phase d'évaluation
            responseContent.classList.add('evaluation-in-progress');
            if (evaluationContainer) {
               evaluationContainer.innerHTML = '<p>Évaluation en cours...</p>';
            }
            updatePhaseIndicator('evaluation');
            break;

          case 'evaluation':
            evaluation = data.evaluation;
            quality = data.quality;

            if (evaluationContainer && typeof displayEvaluation === 'function') {
              displayEvaluation(evaluation, quality); // Affiche les métriques
            }

            // Passer à la phase de mise en évidence des hallucinations
            updatePhaseIndicator('highlight');

            // Appliquer la mise en évidence des hallucinations
            if (typeof highlightHallucinations === 'function' && evaluation?.['fact-checking']) {
              const factChecking = evaluation['fact-checking'];
              // Appliquer la mise en évidence sur le texte brut
              const highlightedText = highlightHallucinations(fullText, factChecking);
              // Convertir le texte mis en évidence en HTML
              let renderedHTML = marked.parse(highlightedText);
              renderedHTML = DOMPurify.sanitize(renderedHTML);
              // Mettre à jour le contenu
              responseContent.innerHTML = renderedHTML;
            }

            responseContent.classList.remove('evaluation-in-progress');
            updatePhaseIndicator('completed');
            // Résoudre la promesse une fois que tout est traité
            resolve({response: fullText, evaluation, quality});
            break;

          case 'emissions':
            const emissions = data.emissions_gCO2;
            console.log('📦 Émissions carbone reçues:', emissions);
            window.addCarbonEmission(emissions);
            break;
          case 'error':
            console.error("Erreur reçue:", data.message); // Utiliser data.message pour l'erreur
            responseContent.classList.remove('generation-in-progress', 'evaluation-in-progress');
            // Remplacer le contenu streamé par le message d'erreur
            responseContent.innerHTML = `<div class="error-message">Erreur: ${data.message}</div>`; // Afficher le message d'erreur
            updatePhaseIndicator('error'); // Ajoutez une phase d'erreur si vous le souhaitez
            reject(new Error(data.message)); // Rejeter la promesse avec l'erreur
            break;
        }
      } catch (e) {
        console.error("Erreur lors du traitement des données:", e);
         responseContent.classList.remove('generation-in-progress', 'evaluation-in-progress');
         // Remplacer le contenu streamé par un message d'erreur interne
         responseContent.innerHTML = `<div class="error-message">Erreur interne lors du traitement: ${e.message}</div>`;
         updatePhaseIndicator('error'); // Ajoutez une phase d'erreur si vous le souhaitez
        reject(e); // Rejeter la promesse en cas d'erreur de traitement
      }
    }

    // Démarrer le traitement du stream
    processStream().catch(error => {
      console.error("Erreur lors du streaming:", error);
       responseContent.classList.remove('generation-in-progress', 'evaluation-in-progress');
       // Remplacer le contenu streamé par un message d'erreur de connexion
       responseContent.innerHTML = `<div class="error-message">Erreur de connexion au stream: ${error.message}</div>`;
       updatePhaseIndicator('error'); // Ajoutez une phase d'erreur si vous le souhaitez
      reject(error); // Rejeter la promesse en cas d'erreur de stream
    });
  });
}

});
