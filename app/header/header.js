// ===== VARIABLES GLOBALES =====
let searchTimeout;
const searchInput = document.getElementById('searchInput');
const navContainer = document.getElementById('navContainer');
const allNavItems = Array.from(navContainer.querySelectorAll('.nav-item'));
const allNavParents = Array.from(navContainer.querySelectorAll('.nav-parent'));

// ===== DETECTION MODE SOMBRE/CLAIR =====
function updateThemeIndicator() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //document.getElementById('modeIndicator').textContent =
    isDarkMode ? '🌙 Mode sombre' : '☀️ Mode clair';
}

// Surveiller les changements de thème
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeIndicator);

// ===== RECHERCHE FONCTIONNELLE =====
function performSearch(searchTerm) {
  // Réinitialiser
  allNavItems.forEach(item => {
    item.classList.remove('match', 'related', 'hidden');
  });

  // Réinitialiser les parents
  allNavParents.forEach(parent => {
    parent.classList.remove('expanded');
  });

  if (!searchTerm || searchTerm.length < 2) {
    // Tout afficher
    allNavParents.forEach(parent => {
      parent.classList.add('expanded');
    });
    return;
  }

  const term = searchTerm.toLowerCase();
  const matches = new Set();
  const relatedParents = new Set();

  // Rechercher dans les items
  allNavItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    const searchData = item.getAttribute('data-search') || '';

    if (text.includes(term) || searchData.includes(term)) {
      matches.add(item);
      item.classList.add('match');

      // Trouver le parent et l'étendre
      let parent = item.closest('.nav-parent');
      while (parent) {
        relatedParents.add(parent);
        parent.classList.add('expanded');
        parent = parent.parentElement.closest('.nav-parent');
      }
    }
  });

  // Marquer les items liés (dans les parents étendus)
  allNavItems.forEach(item => {
    const parent = item.closest('.nav-parent');
    if (parent && relatedParents.has(parent) && !matches.has(item)) {
      item.classList.add('related');
    }
  });

  // Cacher les items non pertinents
  allNavItems.forEach(item => {
    const parent = item.closest('.nav-parent');
    if (!matches.has(item) && !(parent && relatedParents.has(parent))) {
      item.classList.add('hidden');
    }
  });

  // Réduire les parents sans résultats
  allNavParents.forEach(parent => {
    const hasVisibleChildren = Array.from(parent.querySelectorAll('.nav-item'))
      .some(item => !item.classList.contains('hidden'));

    if (!hasVisibleChildren && !relatedParents.has(parent)) {
      parent.classList.remove('expanded');
    }
  });
}

// ===== TOGGLE MENU =====
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== TOGGLE SOUS-MENUS =====
function setupToggleButtons() {
  document.querySelectorAll('.nav-parent > .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const parent = e.currentTarget.closest('.nav-parent');
      if (parent) {
        e.stopPropagation();
        parent.classList.toggle('expanded');

        // Si on ferme un parent, fermer aussi les enfants
        if (!parent.classList.contains('expanded')) {
          parent.querySelectorAll('.nav-parent').forEach(child => {
            child.classList.remove('expanded');
          });
        }
      }
    });
  });
}

// ===== RACCOURCI CLAVIER =====
function setupKeyboardShortcuts() {
  // Raccourci "/" pour focus la recherche
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName.toLowerCase();
    const isInput = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

    if (e.key === '/' && !isInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }

    // Échap pour vider la recherche
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      performSearch('');
    }
  });
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Détection thème
  updateThemeIndicator();

  // Recherche
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(e.target.value.trim());
    }, 150);
  });

  // Toggle sidebar
  document.getElementById('toggleBtn').addEventListener('click', toggleSidebar);

  // Toggle sous-menus
  setupToggleButtons();

  // Raccourcis clavier
  setupKeyboardShortcuts();

  // Boutons footer
  document.getElementById('settingsBtn').addEventListener('click', () => {
    alert('Paramètres - Fonctionnalité à implémenter');
  });

  document.getElementById('feedbackBtn').addEventListener('click', () => {
    alert('Feedback - Envoyez vos retours à gael-berru.com');
  });

  // Fermer le sidebar en cliquant à l'extérieur (mobile)
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');

    if (window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  console.log('✅ Menu Berru-g initialisé avec succès');
  console.log('🔍 Recherche fonctionnelle avec indexation');
  console.log('🌓 Mode sombre/clair auto-détecté');
});

// ===== EXPORT POUR DEBUG =====
window.menuManager = {
  toggleSidebar,
  performSearch,
  updateThemeIndicator
};