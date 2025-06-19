// Gestion du pipeline : route → classify → generate + téléchargement PDF

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const textInput = document.getElementById('textInput');
const resultSection = document.getElementById('resultSection');
const generatedDoc = document.getElementById('generatedDoc');

generateBtn.addEventListener('click', async () => {
  const text = textInput.value;
  // Étape 1 : routage
  let res = await fetch('/api/route', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text})
  });
  const {ministry} = await res.json();

  // Étape 2 : classification
  res = await fetch('/api/classify', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text, ministry})
  });
  const {document_type} = await res.json();

  // Étape 3 : génération
  res = await fetch('/api/generate', {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text, ministry, document_type})
  });
  const {document} = await res.json();
  generatedDoc.value = document;
  resultSection.classList.remove('hidden');
});

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([generatedDoc.value], {type:'application/pdf'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'document.pdf'; a.click();
});