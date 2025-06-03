// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const chatTab = document.getElementById('chat-tab');
const summaryTab = document.getElementById('summary-tab');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const summaryForm = document.getElementById('summary-form');
const summaryInput = document.getElementById('summary-input');
const summaryResult = document.getElementById('summary-result');
const summaryText = document.getElementById('summary-text');

//redirection synthétiseur
document.addEventListener("DOMContentLoaded", () => {
    const tryButtons = document.querySelectorAll(".try-button");
  
    // On cible seulement le premier bouton
    if (tryButtons.length > 0) {
      tryButtons[0].addEventListener("click", () => {
        window.location.href = "http://localhost:3000/";
      });

      tryButtons[1].addEventListener("click", () => {
        window.location.href = "#";
      });

      tryButtons[2].addEventListener("click", () => {
        window.location.href = "#";
      });

      // Optionnel : tu peux rediriger le second vers une autre page
    tryButtons[3]?.addEventListener("click", () => {
        window.location.href = "#";
      });

      tryButtons[4]?.addEventListener("click", () => {
        window.location.href = "#";
      });

      tryButtons[5]?.addEventListener("click", () => {
        window.location.href = "/summary";
      });

      tryButtons[6]?.addEventListener("click", () => {
        window.location.href = "https://ghost-analysis-kcdk.vercel.app/";
      });

      tryButtons[7]?.addEventListener("click", () => {
        window.location.href = "/docgen";
      });


    }
  });
  


// Charge automatiquement le contenu du chatbot dès le chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    // Assurez-vous que l'onglet "Chatbot Autocorrectif" est actif dès le départ
    document.getElementById('chat-tab').classList.add('active');
    document.querySelector('.tab[data-tab="chat"]').classList.add('active');
  
    // Charger le contenu de index.html dans l'onglet chatbot
    const targetDiv = document.getElementById('chat-tab');
    fetch("/chat")
  .then(response => response.text())
  .then(html => {
    targetDiv.innerHTML = html;



    if (!document.querySelector('script[src="/static/script2.js"]')) {
        const script = document.createElement("script");
        script.src = "/static/script2.js";
        script.type = "text/javascript";
        document.body.appendChild(script);
      }
      
  })
  .catch(error => {
    console.error("Erreur de chargement :", error);
    targetDiv.innerHTML = "<p>Erreur lors du chargement de la page.</p>";
  });

});

  
// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Remove active from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        tab.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});


function addMessage(text, isBot) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${text}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Summary functionality
summaryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = summaryInput.value.trim();
    if (!text) return;

    // Simple summarization (taking first half of words)
    const words = text.split(' ');
    const summarized = words.slice(0, Math.max(words.length / 2, 10)).join(' ') + '...';

    // Display result
    summaryResult.classList.remove('hidden');
    summaryText.textContent = summarized;
    summaryInput.value = '';
});
