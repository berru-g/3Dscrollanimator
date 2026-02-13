<?php
require_once 'config.php';
require_once 'auth.php';
require_once 'PointsManager.php';
/* Affichage des notif - en cours de debug
require_once 'NotificationManager.php';
$unreadCount = NotificationManager::getUnreadCount($_SESSION['user_id']);
$notifications = NotificationManager::getUserNotifications($_SESSION['user_id'], 5);

function timeAgo($datetime)
{
    $time = strtotime($datetime);
    $time = time() - $time;

    $units = array(
        31536000 => 'an',
        2592000 => 'mois',
        604800 => 'semaine',
        86400 => 'jour',
        3600 => 'heure',
        60 => 'minute',
        1 => 'seconde'
    );

    foreach ($units as $unit => $val) {
        if ($time < $unit)
            continue;
        $numberOfUnits = floor($time / $unit);
        return $numberOfUnits . ' ' . $val . (($numberOfUnits > 1) ? 's' : '');
    }

    return 'maintenant';
}
    */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menu Propre - Berru-g</title>
  <link rel="stylesheet" href="./header/header.css"> 
</head>
<body>
  <div class="app-container">
    
    <!-- SIDEBAR PROPRE -->
    <aside class="sidebar-clean" id="sidebar">

    <?php if (Auth::isLoggedIn()): ?>
      <!-- Header -->
      <div class="sidebar-header">
        <div class="sidebar-title"><?= strtoupper(substr($_SESSION['user_name'], 0, 1)) ?></div>
        
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" class="search-input" id="searchInput" placeholder="Rechercher (/)..." autocomplete="off">
          <kbd class="search-shortcut">/</kbd>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="nav-clean" id="navContainer">
        
        <!-- Section 1 -->
        <div class="nav-section">
          <div class="nav-section-title">Navigation Principale</div>
          <a href="#" class="nav-item active" data-search="accueil home berru">
            <span><strong><span id="current-points"><?= $_SESSION['user_points'] ?? 200 ?></span></strong> 💎</span>
          </a>
          <?php if (Auth::isLoggedIn() && $_SESSION['user_id'] == 1): ?>
                            <a href="admin.php" class="user-dropdown-item">
                                <i class="fa-solid fa-code-branch"></i>
                                <span>Stat</span>
                            </a>
                            <?php endif; ?>
          <a href="#projects" class="nav-item" data-search="projets projects portfolio réalisations">
            <span>Projets</span>
          </a>
          <a href="#skills" class="nav-item" data-search="compétences skills technologies expertise">
            <span>Compétences</span>
          </a>
          <a href="#experience" class="nav-item" data-search="expérience experience travail career">
            <span>Expérience</span>
          </a>
        </div>
        
        <!-- Section 2 -->
        <div class="nav-section">
          <div class="nav-section-title">Sections</div>
          
          <!-- Développement Web -->
          <div class="nav-parent expanded">
            <button class="nav-item" data-search="développement web dev frontend backend javascript react vue node">
              <span>Développement Web</span>
              <svg class="nav-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <div class="submenu">
              <a href="https://codepen.io/h-lautre" class="nav-item" data-search="front-end frontend javascript codepen animations">
                <span>Front-end</span>
              </a>
              <a href="#animations" class="nav-item" data-search="animations css gsap motion">
                <span>Animations</span>
              </a>
              <a href="#performance" class="nav-item" data-search="performance optimisation vitesse lighthouse">
                <span>Performance</span>
              </a>
            </div>
          </div>
          
          <!-- UI/UX Design -->
          <div class="nav-parent expanded">
            <button class="nav-item" data-search="ui ux design interface utilisateur expérience prototype figma">
              <span>UI/UX Design</span>
              <svg class="nav-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <div class="submenu">
              <a href="#ui-components" class="nav-item" data-search="composants ui components library design system">
                <span>Composants UI</span>
              </a>
              <a href="#prototyping" class="nav-item" data-search="prototypage prototype figma adobe xd">
                <span>Prototypage</span>
              </a>
              <a href="#design-systems" class="nav-item" data-search="design systems système cohérence">
                <span>Design Systems</span>
              </a>
            </div>
          </div>
          
          <!-- Ressources -->
          <div class="nav-parent expanded">
            <button class="nav-item" data-search="ressources resources articles tutoriels contact outils blog">
              <span>Ressources</span>
              <svg class="nav-toggle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            <div class="submenu">
              <a href="#articles" class="nav-item" data-search="articles blog écrits publications">
                <span>Articles</span>
              </a>
              <a href="#tutorials" class="nav-item" data-search="tutoriels tutorials apprendre formation">
                <span>Tutoriels</span>
              </a>
              <a href="#tools" class="nav-item" data-search="outils tools ressources développement">
                <span>Outils</span>
              </a>
              <a href="#contact" class="nav-item" data-search="contact email message formulaire">
                <span>Contact</span>
              </a>
            </div>
          </div>

          <a href="?logout" class="user-dropdown-item">
                            <i class="fa-regular fa-share-from-square"></i>
                            <span>Log Out</span>
                        </a>
                        <?php else: ?>
                <div class="auth-buttons">
                    <a href="login.php" class="btn-cta">
                        <i class="fa-regular fa-square-plus"></i>
                        <span> Create</span>
                    </a>
                    <a href="register.php" class="btn-join">
                        <i class="fa-solid fa-rocket"></i>
                        <span> Join we</span>
                    </a>
                </div>
            <?php endif; ?>
          
        </div>
        
      </nav>
      
      <!-- Footer -->
      <div class="sidebar-footer">
        <button class="footer-btn" id="settingsBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Paramètres</span>
        </button>
        
        <button class="footer-btn" id="feedbackBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Feedback</span>
        </button>
      </div>
      
    </aside>
    
    <!-- Bouton toggle -->
    <button class="toggle-clean" id="toggleBtn" aria-label="Ouvrir le menu">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Main content -->
    <main class="main-content">
      
      
    
    </main>
    
  </div>

  <script src="./header/header.js"></script>
</body>
</html>