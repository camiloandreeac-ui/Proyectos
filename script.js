let extensions = [];
let currentFilter = "all";
let currentSearch = "";
let darkMode = false;

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("data.json");
  extensions = await res.json();
  renderExtensions();

  // Filtros
  document.getElementById("filter-all").addEventListener("click", () => setFilter("all"));
  document.getElementById("filter-active").addEventListener("click", () => setFilter("active"));
  document.getElementById("filter-inactive").addEventListener("click", () => setFilter("inactive"));

  // Buscador
  document.getElementById("searchInput").addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderExtensions();
  });

  // Cambiar tema
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
});

function renderExtensions() {
  const container = document.getElementById("extensions-container");

  const filtered = extensions.filter(ext => {
    const matchesFilter =
      currentFilter === "active"
        ? ext.isActive
        : currentFilter === "inactive"
        ? !ext.isActive
        : true;

    const matchesSearch = ext.name.toLowerCase().includes(currentSearch);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-results">No extensions found.</p>`;
    return;
  }


  container.innerHTML = filtered.map(ext => `
    <div class="extension-card ${ext.isActive ? 'active' : 'inactive'}">
      <img src="${ext.logo}" alt="${ext.name} logo" class="logo">
      <div class="info">
        <h3>${ext.name}</h3>
        <p>${ext.description}</p>
      </div>
      <div class="actions">
        <button class="toggle" onclick="toggleActive('${ext.name}')">
          ${ext.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button class="remove" onclick="removeExtension('${ext.name}')">Remove</button>
      </div>
    </div>
  `).join('');
}

function setFilter(type) {
  currentFilter = type;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`filter-${type}`).classList.add("active");
  renderExtensions();
}

function toggleActive(name) {
  const ext = extensions.find(e => e.name === name);
  ext.isActive = !ext.isActive;
  renderExtensions();
}

function removeExtension(name) {
  extensions = extensions.filter(e => e.name !== name);
  renderExtensions();
}
function toggleTheme() {
  darkMode = !darkMode;
  document.body.dataset.theme = darkMode ? "dark" : "light";
  const btn = document.getElementById("themeToggle");
  btn.textContent = darkMode ? "🌙 Dark" : "🌞 Light";
}