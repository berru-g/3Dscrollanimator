<?php
/* 
   Point d'entrée principal de l'application 3D Scroll Animator.
   Gère le chargement de l'interface utilisateur, l'importation de modèles 3D,
   la définition des keyframes et la génération du code d'animation.
   V_1.2 05/11/2025 gael-berru.com
*/
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

require_once 'config.php';
require_once 'auth.php';
require_once 'PointsManager.php';

// Vérifier si un projet doit être chargé
$loadProjectId = $_GET['load_project'] ?? null;
// DEBUG
error_log("=== INDEX.PHP ===");
error_log("Session ID: " . session_id());
error_log("Logged in: " . (Auth::isLoggedIn() ? 'YES' : 'NO'));

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Éditeur d'Animation 3D avec Scroll</title>
    <link rel="shortcut icon" href="/img/3Dscrollanimator-logo.png" />
    <link rel="apple-touch-icon" href="/img/3Dscrollanimator-logo.png" />
    <meta name="description"
        content="Créez des animations 3D sans une ligne de code. Importez vos modèles 3D, définissez des keyframes et générez du code prêt à l'emploi pour vos projets web.">
    <meta name="keywords"
        content="3D generator scroll, Animation, Scroll, WebGL, Three.js, GLTF, GLB, Keyframes, Code Generator, Web Development, Interactive, Visual Effects">
    <meta name="author" content="berru-g">
    <meta name="robots" content="noai">
    <meta property="og:title" content="Éditeur d'Animation 3D avec Scroll">
    <meta property="og:description"
        content="Créez des animations 3D sans une ligne de code. Importez vos modèles 3D, définissez des keyframes et générez du code prêt à l'emploi pour vos projets web.">
    <meta property="og:image"
        content="https://raw.githubusercontent.com/berru-g/berru-g/refs/heads/main/img/3Dscrollanimator-logo.png">
    <meta property="og:url" content="https://3dscrollanimator.com">
    <link rel="canonical" href="https://3dscrollanimator.com" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intro.js@7.2.0/minified/introjs.min.css">
    <script src="https://cdn.jsdelivr.net/npm/intro.js@7.2.0/minified/intro.min.js"></script>

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "3D Scroll Animator",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web Browser",
  "description": "Éditeur no-code pour créer des animations 3D interactives basées sur le scroll. Créez des expériences web immersives sans programmation.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "description": "Plan gratuit avec projet illimité à vie + fonctionnalités premium"
  },
  "author": {
    "@type": "Organization",
    "name": "Berru-G",
    "url": "https://3dscrollanimator.com"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  },
  "featureList": [
    "Éditeur visuel 3D no-code",
    "Animation basée sur le scroll",
    "Import modèles GLB/GLTF",
    "Export code Three.js prêt à l'emploi",
    "Galerie communautaire",
    "Sauvegarde cloud"
  ],
  "screenshot": [
    {
      "@type": "ImageObject",
      "caption": "Interface de l'éditeur 3D no-code",
      "url": "https://3dscrollanimator.com/img/3Dscrollanimator-logo.png"
    },
    {
      "@type": "ImageObject", 
      "caption": "Galerie des créations utilisateurs",
      "url": "https://3dscrollanimator.com/img/3Dscrollanimator-logo.png"
    }
  ],
  "softwareVersion": "1.0",
  "releaseNotes": "Version initiale avec éditeur 3D, système de keyframes et export de code",
  "downloadUrl": "https://3dscrollanimator.com/app/",
  "url": "https://3dscrollanimator.com/app/",
  "keywords": "animation 3D, scroll, no-code, three.js, web design, creative coding",
  "memoryRequirements": "2GB RAM",
  "processorRequirements": "Processeur moderne avec WebGL",
  "permissions": "Accès au stockage local pour sauvegarde"
}
</script>

    <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization", 
  "name": "3D Scroll Animator",
  "url": "https://3dscrollanimator.com/3Dscrollanimator/",
  "logo": "https://3dscrollanimator.com/img/3Dscrollanimator-logo.png",
  "description": "Plateforme no-code de création d'animations 3D interactives pour le web",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "support technique",
    "email": "support@gael-berru.com",
    "availableLanguage": ["French", "English"]
  },
  "sameAs": [
    "https://twitter.com/#",
    "https://github.com/berru-g"
  ]
}
</script>


    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1JTTQTPF3Q"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-1JTTQTPF3Q');
    </script>

</head>

<body>
    <!-- Notifications Toast -->
    <div id="notification-container" class="notification-container"></div>

    <?php require_once 'header.php'; ?>

    <!-- INITIALISATION DES VARIABLES AUTH POUR JAVASCRIPT -->
    <script>
        // Ces variables sont utilisées par scriptV2.js pour savoir si l'utilisateur est connecté
        window.currentUser = <?= Auth::isLoggedIn() ? json_encode([
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
            'subscription' => $_SESSION['subscription'],
            'points' => $_SESSION['user_points'] ?? 200
        ]) : 'null' ?>;
        window.userSubscription = '<?= Auth::isLoggedIn() ? $_SESSION['subscription'] : 'free' ?>';

        console.log('Auth initialized:', window.currentUser);
    </script>


    <!-- Modal d'Authentification simplifié -->
    <div id="auth-modal" class="auth-modal" style="display: none;">
        <div class="auth-modal-content">
            <div class="auth-modal-header">
                <h2>Connectez-vous pour exporter votre code</h2>
                <button class="close-btn" onclick="closeAuthModal()">×</button>
            </div>

            <div class="auth-options">
                <a href="login.php" class="auth-btn" style="text-decoration: none; text-align: center;">
                    <i class="fas fa-sign-in-alt"></i>
                    Se connecter
                </a>

                <a href="register.php" class="auth-btn" style="text-decoration: none; text-align: center;">
                    <i class="fas fa-user-plus"></i>
                    Créer un compte
                </a>
            </div>

            <div class="auth-benefits">
                <h4>En vous connectant, vous pourrez :</h4>
                <ul>
                    <li>✅ Voir le code complet de votre animation</li>
                    <li>✅ Exporter vers CodePen en 1 clic</li>
                    <li>✅ Sauvegarder vos projets</li>
                    <li><strong>Offert</strong> 200 💎 Crédits </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Modal de sauvegarde de projet -->
    <div id="save-project-modal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Sauvegarder le projet</h3>
                <button class="close-btn" onclick="closeSaveModal()">×</button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="project-title">Titre du projet *</label>
                    <input type="text" id="project-title" placeholder="Mon animation 3D" maxlength="100">
                    <div class="char-count"><span id="title-chars">0</span>/100</div>
                </div>

                <div class="form-group">
                    <label for="project-description">Description (optionnelle)</label>
                    <textarea id="project-description" placeholder="Décrivez votre projet..." rows="3"
                        maxlength="500"></textarea>
                    <div class="char-count"><span id="desc-chars">0</span>/500</div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="modal-make-public">
                        <span class="checkmark"></span>
                        Rendre ce projet public
                    </label>
                    <small style="color: var(--text-light); margin-top: 0.5rem; display: block;">
                        Contribué dans la communauté
                    </small>
                </div>

                <div class="reward-notice">
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent);">
                        <span>💎</span>
                        <strong>Bonus : +10 crédits pour chaque sauvegarde !</strong>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeSaveModal()">Annuler</button>
                <button class="btn btn-primary" onclick="confirmSaveProject()">
                    Sauvegarder le projet
                </button>
            </div>
        </div>
    </div>

    <!-- ÉDITEUR PARAMETRE -->
    <div class="top-section">
        <div class="sidebar">
            <h1>3D Scroll Animator</h1>
            <div class="section">
                <div class="instructions">
                    <p><strong>Instructions :</strong></p>
                    <p>1. Importez un modèle 3D (GLB/GLTF)</p>
                    <p>2. Utilisez les contrôles pour positionner votre modèle</p>
                    <p>3. Définissez le pourcentage de scroll et ajustez les propriétés</p>
                    <p>4. Ajoutez des keyframes pour créer l'animation</p>
                    <p>5. Copiez le code généré pour l'utiliser sur votre site</p>
                    <!--<button class="btn help-guide-btn" onclick="onboarding.restart()">
                    <i class="fa-solid fa-search"></i> Suivez le guide
                </button>-->
                    <?php if (!Auth::isLoggedIn()): ?>
                        <p style="color: var(--primary); margin-top: 10px;">
                            <strong>100 💎 offert :</strong> <a href="register.php" style="color: var(--primary);">Essayer
                                gratuitement</a>
                        </p>
                    <?php endif; ?>
                </div>
            </div>
            <br>
            <h2 class="section-title">Importation 3D</h2>
            <div class="section">
                <input type="file" id="model-input" accept=".glb,.gltf" style="display: none;">
                <button class="btn" id="import-btn">
                    <i class="fa-regular fa-square-plus"></i> Importer un modèle
                    3D</button>


               <!-- <button class="btn btn-secondary" onclick="sketchFabBrowser.showBrowser()">
                    <i class="fa-solid fa-cube"></i> Import SketchFab
                </button>-->

                <button class="btn btn-secondary" onclick="loadTestModel()">Charger modèle test</button>

                <!-- Bouton Record pour utilisateurs connectés -->
                <?php if (Auth::isLoggedIn()): ?>
                    <button class="btn" id="record-btn" onclick="openSaveModal()" style="margin-top: 10px;">
                        <i class="fa-regular fa-floppy-disk"></i> Save Project
                        <span> +10 💎</span>
                    </button>

                    <div class="toggle-container" style="margin-top: 10px; margin-left: 0px;">
                        <label class="toggle-switch">
                            <i class="fa-solid fa-ghost"></i>
                            <input type="checkbox" id="make-public" class="toggle-input">
                            <span class="toggle-slider"></span>
                            <span class="toggle-text">Rendre public</span>
                        </label>
                    </div>

                <?php else: ?>
                    <div style="background: var(--grey-light); padding: 10px; border-radius: 6px; margin-top: 10px;">
                        <p style="margin: 0; color: var(--rose); font-size: 0.9rem;">
                            <a href="login.php" style="color: var(--primary);">Connectez-vous</a> pour commencer à créer
                        </p>
                    </div>
                <?php endif; ?>
            </div>

            <div class="section">
                <div class="input-group">
                    <label for="model-scale">Échelle du modèle</label>
                    <input type="range" id="model-scale" min="0.1" max="3" step="0.1" value="1">
                </div>

                <div class="input-group" id="scrollperc">
                    <label for="keyframe-percentage">Pourcentage de scroll</label>
                    <input type="range" id="keyframe-percentage" min="0" max="100" value="0">
                    <div style="text-align: center; margin-top: 5px;" id="percentage-value">0%</div>
                </div>

            </div>

            <h2 class="section-title">Animation par Scroll</h2>

            <div class="section">

                <div class="tab-container">
                    <div class="tab active" data-tab="position">Position</div>
                    <div class="tab" data-tab="rotation">Rotation</div>
                    <div class="tab" data-tab="scale">Échelle</div>
                </div>



                <div id="position-controls" class="tab-content">
                    <div class="input-group">
                        <label for="pos-x">Position X</label>
                        <input type="range" id="pos-x" min="-10" max="10" step="0.1" value="0">
                    </div>
                    <div class="input-group">
                        <label for="pos-y">Position Y</label>
                        <input type="range" id="pos-y" min="-10" max="10" step="0.1" value="0">
                    </div>
                    <div class="input-group">
                        <label for="pos-z">Position Z</label>
                        <input type="range" id="pos-z" min="-10" max="10" step="0.1" value="0">
                    </div>
                </div>

                <div id="rotation-controls" class="tab-content" style="display: none;">
                    <div class="input-group">
                        <label for="rot-x">Rotation X (degrés)</label>
                        <input type="range" id="rot-x" min="0" max="360" step="1" value="0">
                    </div>
                    <div class="input-group">
                        <label for="rot-y">Rotation Y (degrés)</label>
                        <input type="range" id="rot-y" min="0" max="360" step="1" value="0">
                    </div>
                    <div class="input-group">
                        <label for="rot-z">Rotation Z (degrés)</label>
                        <input type="range" id="rot-z" min="0" max="360" step="1" value="0">
                    </div>
                </div>

                <div id="scale-controls" class="tab-content" style="display: none;">
                    <div class="input-group">
                        <label for="scale-x">Échelle X</label>
                        <input type="range" id="scale-x" min="0.1" max="3" step="0.1" value="1">
                    </div>
                    <div class="input-group">
                        <label for="scale-y">Échelle Y</label>
                        <input type="range" id="scale-y" min="0.1" max="3" step="0.1" value="1">
                    </div>
                    <div class="input-group">
                        <label for="scale-z">Échelle Z</label>
                        <input type="range" id="scale-z" min="0.1" max="3" step="0.1" value="1">
                    </div>
                </div>

                <button class="btn" id="add-keyframe"><i class="fa-solid fa-layer-group"></i> Ajouter une
                    keyframe</button>
            </div>

            <div class="section">
                <h2 class="section-title">Keyframes</h2>
                <div class="keyframes-list" id="keyframes-list">
                    <div style="text-align: center; color: #a6adc8; padding: 20px;">Aucune keyframe ajoutée</div>
                </div>
            </div>

            <div class="section" style="display:none;">
                <h2 class="section-title">Code Généré</h2>
                <textarea class="code-editor" id="generated-code"
                    readonly>// Importez un modèle et ajoutez des keyframes pour générer le code</textarea>
                <button class="btn btn-secondary" id="copy-code">Copier le code</button>
            </div>


        </div>

        <div class="main-content">
            <div class="viewer-container">
                <div id="viewer"></div>
                <div id="loading" class="loading" style="display: none;">Chargement...</div>
                <div class="preview-container">
                    <div class="preview-title">Aperçu du Scroll</div>
                    <div class="preview-scroll" id="preview-scroll">
                        <div class="preview-handle" id="preview-handle"></div>
                    </div>
                    <div class="preview-percentage" id="preview-percentage">0%</div>
                </div>
            </div>
            <div class="scroll-ruler">
                <div class="ruler-track" id="ruler-track">
                    <div class="ruler-handle" id="ruler-handle"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Éditeur de code complet -->
    <!-- Éditeur de code complet REVU -->
    <div class="code-exporter">
        <h2 class="section-title">Export de Code</h2>

        <!-- État non connecté -->
        <?php if (!Auth::isLoggedIn()): ?>
            <div class="guest-message">
                <div class="guest-icon"><img src="../img/mascotte-code.png"></div>
                <h3>Connectez-vous pour exporter votre code</h3>
                <p>Accédez au code complet et à l'export CodePen en vous connectant gratuitement</p>
                <a href="login.php" class="btn btn-primary">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </a>
            </div>

            <!-- État connecté -->
        <?php else: ?>
            <div class="code-actions">
                <!-- Bouton pour débloquer le code || bug, le decompte n'est pas stable !-->
                <div class="unlock-code-section">
                    <button class="btn-cta" id="unlock-code-btn" onclick="unlockCodePreview()">
                        <i class="fas fa-code"></i> Voir le code complet
                        <span> -50 💎</span>
                    </button>
                    <p class="cost-info">Débloquez une fois, accès illimité à ce projet</p>
                </div>

                <!-- Section code (cachée par défaut) -->
                <div id="code-editors-section" class="code-editors" style="display: none;">
                    <div class="code-box">
                        <div class="code-box-title">HTML</div>
                        <div class="copy-icon" onclick="copyCode('full-html-code')" title="Copier le HTML">
                            <i class="fa-regular fa-copy"></i>
                        </div>
                        <textarea id="full-html-code" readonly></textarea>
                    </div>

                    <div class="code-box">
                        <div class="code-box-title">CSS</div>
                        <div class="copy-icon" onclick="copyCode('full-css-code')" title="Copier le CSS">
                            <i class="fa-regular fa-copy"></i>
                        </div>
                        <textarea id="full-css-code" readonly></textarea>
                    </div>

                    <div class="code-box">
                        <div class="code-box-title">JavaScript</div>
                        <div class="copy-icon" onclick="copyCode('full-js-code')" title="Copier le JS">
                            <i class="fa-regular fa-copy"></i>
                        </div>
                        <textarea id="full-js-code" readonly></textarea>
                    </div>

                    <button class="btn-cta" id="open-codepen">
                        <i class="fa-brands fa-codepen"></i> Ouvrir dans CodePen
                        <span>-50 💎</span>
                    </button>
                </div>
            </div>
        <?php endif; ?>
    </div>



    <!-- Achat de points à config avec stripe ou lemonsqueezie -->
    <div class="points-shop">
        <h3>💎 Gagnez du temps avec les Packs ! Bientôt disponible</h3>
        <?php if (Auth::isLoggedIn()): ?>
            <div id="user-menu" class="user-menu">

                <span class="user-name" id="user-name">
                    <?= htmlspecialchars($_SESSION['user_name']) ?>
                    <span class="user-points" id="user-points">
                        💎 <?= $_SESSION['user_points'] ?? 200 ?>
                    </span>
                </span>
            </div>
        <?php endif; ?>
        </p>


        <div class="point-packs">

            <div class="point-pack" data-pack-id="1">
                <h4>Pack Starter</h4>
                <div class="points-amount">100 💎</div>
                <div class="price">4,90 €</div>
                <button class="btn btn-primary buy-points">Obtenir</button>
            </div>

            <div class="point-pack popular" data-pack-id="2">
                <div class="badge">Populaire</div>
                <h4>Pack Pro</h4>
                <div class="points-amount">500 💎</div>
                <div class="price">19,90 €</div>
                <button class="btn btn-primary buy-points">Obtenir</button>
            </div>

            <div class="point-pack" data-pack-id="3">
                <h4>Pack Expert</h4>
                <div class="points-amount">1500 💎</div>
                <div class="price">49,90 €</div>
                <button class="btn btn-primary buy-points">Obtenir</button>
            </div>
        </div>
    </div>

    <br>
    <?php require_once 'footer.php'; ?>


    <script>
        function copyCode(id) {
            const textarea = document.getElementById(id);
            textarea.select();
            document.execCommand("copy");

            const icon = event.currentTarget;
            const old = icon.textContent;
            icon.textContent = "✅";
            setTimeout(() => (icon.textContent = old), 1000);
        }
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.min.js"></script>
    <script src="scriptV2.js"></script>

    <script>
        // Variable globale pour le chargement de projet
        const loadProjectId = <?= $loadProjectId ? $loadProjectId : 'null' ?>;

        // Après l'initialisation de l'application
        setTimeout(() => {
            if (loadProjectId) {
                loadProject(loadProjectId);
            }
        }, 1000);


        // DEBUG
        async function debugAll() {
            console.log('=== DEBUG COMPLET ===');

            // Test 1: Points actuels
            const response1 = await fetch('api.php?action=get_user_points');
            const points = await response1.json();
            console.log('1. Points actuels:', points);
            // Test 3: Vérifie la session
            console.log('3. Session PHP:', <?= json_encode($_SESSION ?? []) ?>);
        }
        debugAll();
    </script>
</body>

</html>