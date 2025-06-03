const carbonValueEl = document.getElementById("carbon-value");
let carbonTotal = parseFloat(localStorage.getItem("carbon_total")) || 0.0;
if (carbonValueEl) carbonValueEl.textContent = carbonTotal.toFixed(2);

function addCarbonEmission(value) {
  if (!value || isNaN(value)) return;
  carbonTotal += parseFloat(value);
  localStorage.setItem("carbon_total", carbonTotal.toFixed(5));
  if (carbonValueEl) carbonValueEl.textContent = carbonTotal.toFixed(2);
}

window.addCarbonEmission = addCarbonEmission;
