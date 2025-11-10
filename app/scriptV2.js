// Éditeur 3D No-Code - Approche éprouvée
// systeme d'alert 
// Système de notifications élégant + son 
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = new Set();
        this.sounds = this.loadSounds();
    }

    loadSounds() {
        return {
            success: new Audio('../sounds/notification-success.mp3'),
            error: new Audio('../sounds/notification-error.mp3'),
            warning: new Audio('../sounds/ui-click-menu-modern-interface-select-small.mp3'),
            info: new Audio('../sounds/notification-info.mp3')
        };
    }

    playSound(type) {
        const sound = this.sounds[type];
        if (sound) {
            sound.currentTime = 0;
            sound.volume = 0.4; // Volume modéré
            sound.play().catch(e => console.log('Son notification ignoré:', e));
        }
    }

    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            dismissible = true,
            sound = true // Nouvelle option : activer/désactiver le son
        } = options;

        // 🔊 JOUER LE SON
        if (sound) {
            this.playSound(type);
        }

        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="notification-icon">${icons[type]}</div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            ${dismissible ? '<button class="notification-close">✕</button>' : ''}
            <div class="notification-progress"></div>
        `;

        // Ajouter au container
        this.container.appendChild(notification);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Gestion de la fermeture
        const closeNotification = () => {
            notification.classList.remove('show');
            notification.classList.add('hide');

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications.delete(notification);
            }, 300);
        };

        // Bouton de fermeture
        if (dismissible) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', closeNotification);
        }

        // Fermeture automatique
        if (duration > 0) {
            setTimeout(closeNotification, duration);
        }

        this.notifications.add(notification);
        return notification;
    }

    // Méthodes pratiques AVEC SONS
    success(message, title = 'Succès', options = {}) {
        return this.show({ type: 'success', title, message, ...options });
    }

    error(message, title = 'Erreur', options = {}) {
        return this.show({ type: 'error', title, message, ...options });
    }

    warning(message, title = 'Attention', options = {}) {
        return this.show({ type: 'warning', title, message, ...options });
    }

    info(message, title = 'Information', options = {}) {
        return this.show({ type: 'info', title, message, ...options });
    }

    // Méthode SANS SON (pour les notifications silencieuses)
    silent(message, title = 'Information', type = 'info') {
        return this.show({ type, title, message, sound: false });
    }

    // Fermer toutes les notifications
    clearAll() {
        this.notifications.forEach(notification => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        this.notifications.clear();
    }
}

// Instance globale
const notify = new NotificationSystem();

// Remplacer toutes les alert() existantes
function showAlert(message, type = 'info') {
    const titles = {
        info: 'Information',
        success: 'Succès',
        error: 'Erreur',
        warning: 'Attention'
    };

    notify[type](message, titles[type]);
}

// animations  Système d'animations de gains
class GainAnimator {
    constructor() {
        this.container = null;
        this.sounds = {}; // Stockage des sons
        this.init();
        this.loadSounds();
    }

    init() {
        // Créer le container des animations
        this.container = document.createElement('div');
        this.container.className = 'gain-animation';
        document.body.appendChild(this.container);
    }

    // Charger les sons
    loadSounds() {
        this.sounds = {
            points: new Audio('../sounds/points.mp3'),
            gems: new Audio('../sounds/gems.mp3'),
            premium: new Audio('../sounds/premium.mp3'),
            coin: new Audio('../sounds/coin.mp3'),
            star: new Audio('../sounds/star.mp3')
        };

        // Précharger les sons
        Object.values(this.sounds).forEach(sound => {
            sound.preload = 'auto';
            sound.volume = 0.3; // Volume à 30% pour pas être agressif
        });
    }

    // Jouer un son selon le type
    playSound(type) {
        const sound = this.sounds[type];
        if (sound) {
            // Réinitialiser et jouer
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Son non joué (autoplay block):', e));
        }
    }

    // Animation principale
    showGain(amount, type = 'points', message = null) {
        // Nettoyer les anciennes animations
        this.clearAnimations();

        // 🔊 JOUER LE SON
        this.playSound(type);

        // Créer les particules
        this.createParticles(amount, type);

        // Afficher la notification
        if (message) {
            setTimeout(() => {
                notify.success(message);
            }, 800);
        }

        // Animer le compteur si présent
        this.animateCounter();
    }

    createParticles(amount, type) {
        const symbols = {
            points: '💎',
            gems: '💎', 
            premium: '👑',
            coin: '🪙',
            star: '⭐'
        };

        const symbol = symbols[type] || '💎';
        const text = `+${amount}${symbol}`;

        // Créer 3 particules pour l'effet d'explosion
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = `gain-particle ${type}`;
            particle.textContent = text;
            particle.style.setProperty('--index', i);
            
            this.container.appendChild(particle);
        }

        // Nettoyer après l'animation
        setTimeout(() => this.clearAnimations(), 2000);
    }

    animateCounter() {
        // Animer le compteur de points dans le header
        const counter = document.querySelector('.user-points, .points-counter, [class*="points"]');
        if (counter) {
            counter.classList.add('pulse');
            setTimeout(() => counter.classList.remove('pulse'), 600);
        }
    }

    clearAnimations() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // Méthodes pratiques
    showPoints(amount, message = null) {
        this.showGain(amount, 'points', message);
    }

    showGems(amount, message = null) {
        this.showGain(amount, 'gems', message);
    }

    showPremium(amount, message = null) {
        this.showGain(amount, 'premium', message);
    }
}

// Instance globale
const gainAnimator = new GainAnimator();

// Snippets rapides à utiliser partout
window.showPointsAnimation = (amount, message) => gainAnimator.showPoints(amount, message);
window.showGemsAnimation = (amount, message) => gainAnimator.showGems(amount, message);
window.showPremiumAnimation = (amount, message) => gainAnimator.showPremium(amount, message);
/* animations  Système d'animations de gains
class GainAnimator {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Créer le container des animations
        this.container = document.createElement('div');
        this.container.className = 'gain-animation';
        document.body.appendChild(this.container);
    }

    // Animation principale
    showGain(amount, type = 'points', message = null) {
        // Nettoyer les anciennes animations
        this.clearAnimations();

        // Créer les particules
        this.createParticles(amount, type);

        // Afficher la notification
        if (message) {
            setTimeout(() => {
                notify.success(message);
            }, 800);
        }

        // Animer le compteur si présent
        this.animateCounter();
    }

    createParticles(amount, type) {
        const symbols = {
            points: '💎',
            gems: '💎',
            premium: '👑',
            coin: '🪙',
            star: '⭐'
        };

        const symbol = symbols[type] || '💎';
        const text = `+${amount}${symbol}`;

        // Créer 3 particules pour l'effet d'explosion
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = `gain-particle ${type}`;
            particle.textContent = text;
            particle.style.setProperty('--index', i);

            this.container.appendChild(particle);
        }

        // Nettoyer après l'animation
        setTimeout(() => this.clearAnimations(), 2000);
    }

    animateCounter() {
        // Animer le compteur de points dans le header
        const counter = document.querySelector('.user-points, .points-counter, [class*="points"]');
        if (counter) {
            counter.classList.add('pulse');
            setTimeout(() => counter.classList.remove('pulse'), 600);
        }
    }

    clearAnimations() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // Méthodes pratiques
    showPoints(amount, message = null) {
        this.showGain(amount, 'points', message);
    }

    showGems(amount, message = null) {
        this.showGain(amount, 'gems', message);
    }

    showPremium(amount, message = null) {
        this.showGain(amount, 'premium', message);
    }
}

// Instance globale
const gainAnimator = new GainAnimator();

// Snippets rapides à utiliser partout
window.showPointsAnimation = (amount, message) => gainAnimator.showPoints(amount, message);
window.showGemsAnimation = (amount, message) => gainAnimator.showGems(amount, message);
window.showPremiumAnimation = (amount, message) => gainAnimator.showPremium(amount, message);

*/

/* GUIDE onboarding */
class OnboardingGuide {
    constructor() {
        this.steps = [
            {
                element: document.querySelector('#import-btn'),
                intro: '<strong>Étape 1 - Importer</strong><br> Commencez par importer votre modèle 3D au format glb ou gltf ou chargez le modèle de test.',
                position: 'right' 
            },
            {
                element: document.querySelector('#position-controls'),
                intro: '<strong>Étape 2 - Scroll</strong><br> Créez votre mouvement',
                position: 'top'
            },
            {
                element: document.querySelector('#add-keyframe'),
                intro: '<strong>Étape 3 - Keyframes</strong><br> Ajoutez la keyframes',
                position: 'top'
            },
            {
                element: document.querySelector('#scrollperc'),
                intro: '<strong>Étape 4 - Animation Scroll</strong><br> Changez votre % de scroll et répetez les étapes 2 et 3 pour créer votre animation !',
                position: 'top'
            },
            {
                element: document.querySelector('.code-exporter'),
                intro: '<strong>Étape 4 - Export</strong><br>Générez votre code Three.js prêt à l\'emploi !',
                position: 'left'
            }
        ].filter(step => step.element !== null); // Supprime les steps si élément pas trouvé
    }

    start() {
        if (localStorage.getItem('onboarding_completed')) {
            return;
        }

        // Vérifier qu'Intro.js est chargé
        if (typeof introJs === 'undefined') {
            console.error('Intro.js non chargé');
            this.showFallbackGuide();
            return;
        }

        const intro = introJs();
        intro.setOptions({
            steps: this.steps,
            showProgress: true,
            showBullets: true,
            exitOnOverlayClick: false,
            hidePrev: true,
            hideNext: false,
            nextLabel: 'Suivant →',
            prevLabel: '← Précédent',
            doneLabel: 'Terminer',
            tooltipPosition: 'auto',
            positionPrecedence: ['right', 'left', 'top', 'bottom']
        });

        intro.oncomplete(() => {
            this.onComplete();
        });

        intro.onexit(() => {
            this.onComplete();
        });

        // Démarrer avec un délai
        setTimeout(() => {
            intro.start();
        }, 1500);
    }

    showFallbackGuide() {
        // Fallback simple si Intro.js échoue
        const steps = [
            'Étape 1: Cliquez sur "Importer un modèle"',
            'Étape 2: Ajoutez des keyframes avec le bouton +',
            'Étape 3: Utilisez la règle pour tester l\'animation', 
            'Étape 4: Exportez votre code dans la section basse'
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                notify.info(step, `Étape ${index + 1}`, { duration: 4000 });
            }, index * 3000);
        });
    }

    onComplete() {
        localStorage.setItem('onboarding_completed', 'true');
        notify.success('Guide terminé ! À vous de créer ', 'Bienvenue');
        
        if (currentUser && !localStorage.getItem('onboarding_bonus_given')) {
            addPoints(25);
            localStorage.setItem('onboarding_bonus_given', 'true');
            setTimeout(() => {
                showPointsAnimation(25, 'Bonus guide +25💎');
            }, 1000);
        }
    }

    restart() {
        localStorage.removeItem('onboarding_completed');
        localStorage.removeItem('onboarding_bonus_given');
        this.start();
    }
}

// Initialisation du guide au chargement
let onboarding;

document.addEventListener('DOMContentLoaded', function() {
    // Attendre que l'UI soit complètement chargée
    setTimeout(() => {
        onboarding = new OnboardingGuide();
        onboarding.start();
        addHelpButton();
    }, 1000);
});

function addHelpButton() {
    // Vérifier si le bouton existe déjà
    if (document.querySelector('.help-guide-btn')) return;

    const helpBtn = document.createElement('button');
    helpBtn.className = 'btn-ghost help-guide-btn';
    helpBtn.innerHTML = 'Guide ?';
    helpBtn.style.marginLeft = '10px';
    
    helpBtn.onclick = () => {
        if (onboarding) {
            onboarding.restart();
        } else {
            notify.info('Importez un modèle → Ajoutez des keyframes → Testez → Exportez !', 'Guide rapide');
        }
    };
    
    // Ajouter dans le header près de la navigation user
    const header = document.querySelector('header');
    const userMenu = document.querySelector('.user-menu, .guest-menu');
    
    if (header && userMenu) {
        header.insertBefore(helpBtn, userMenu);
    } else if (header) {
        header.appendChild(helpBtn);
    }
}


// Variables globales 3D THREEJS
let scene, camera, renderer, controls;
let model = null;
let keyframes = [];
let currentTab = 'position';
let isDragging = false;
let currentPercentage = 0;

let currentProjectId = null;

// État de l'application
let appInitialized = false;

// Initialisation principale
function initApplication() {
    if (appInitialized) return;

    console.log('🚀 Initialisation de l\'application...');

    try {
        initThreeJS();
        setupEventListeners();
        generateCode();

        appInitialized = true;
        console.log('✅ Application initialisée avec succès');

    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        // Réessayer après 1s
        setTimeout(initApplication, 1000);
    }
}

// Initialisation Three.js (similaire à ton exemple)
function initThreeJS() {
    console.log('🎮 Initialisation Three.js...');

    // Créer la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x11111b);

    // Créer la caméra
    const viewer = document.getElementById('viewer');
    camera = new THREE.PerspectiveCamera(75, viewer.offsetWidth / viewer.offsetHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Créer le renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
    viewer.appendChild(renderer.domElement);

    // Ajouter les contrôles Orbit
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Ajouter des lumières (comme ton exemple)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    // Ajouter un sol de référence
    const gridHelper = new THREE.GridHelper(20, 20, 0x313244, 0x313244);
    scene.add(gridHelper);

    // Créer un modèle par défaut (cube)
    createDefaultModel();

    // Démarrer l'animation
    animate();

    console.log('✅ Three.js initialisé');
}

// Créer un modèle par défaut
function createDefaultModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xcba6f7,
        metalness: 0.3,
        roughness: 0.4
    });

    model = new THREE.Mesh(geometry, material);
    scene.add(model);

    updateModelControls();
    console.log('✅ Modèle par défaut créé');
}

// Fonction d'animation (identique à ton exemple)
function animate() {
    requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// CHARGEMENT DE MODÈLE - Approche éprouvée
function loadModel(file) {
    if (!file) {
        console.log('❌ Aucun fichier sélectionné');
        return;
    }

    console.log('📁 Chargement du fichier:', file.name, `(${Math.round(file.size / 1024)} KB)`);

    // Vérifier l'extension
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
        notify.info('Veuillez sélectionner un fichier GLB ou GLTF');
        return;
    }

    const loader = new THREE.GLTFLoader();
    const reader = new FileReader();

    reader.onload = function (event) {
        console.log('✅ Fichier lu en mémoire');

        try {
            loader.parse(event.target.result, '',
                // Succès
                function (gltf) {
                    console.log('✅ Modèle 3D parsé avec succès');
                    handleLoadedModel(gltf.scene);
                },
                // Erreur
                function (error) {
                    console.error('❌ Erreur de parsing:', error);
                    notify.error('Erreur de chargement du modèle: ' + error.message);
                }
            );
        } catch (parseError) {
            console.error('❌ Erreur lors du parsing:', parseError);
            notify.error('Format de fichier non supporté');
        }
    };

    reader.onerror = function (error) {
        console.error('❌ Erreur de lecture:', error);
        notify.error('Erreur de lecture du fichier');
    };

    reader.onprogress = function (event) {
        if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            console.log(`📥 Progression: ${percent}%`);
        }
    };

    // Lancer la lecture
    reader.readAsArrayBuffer(file);
}

// Gestion du modèle chargé (approche robuste)
function handleLoadedModel(loadedModel) {
    // Supprimer l'ancien modèle
    if (model) {
        scene.remove(model);
        console.log('🗑️ Ancien modèle supprimé');
    }

    model = loadedModel;
    scene.add(model);
    console.log('✅ Nouveau modèle ajouté à la scène');

    // Configuration du modèle
    setupModel();
    updateModelControls();

    console.log('🎉 Modèle chargé et configuré avec succès!');
}

// Configuration du modèle chargé
function setupModel() {
    if (!model) return;

    // Calculer la bounding box pour le centrage
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('📦 Bounding Box:', {
        center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
        size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }
    });

    // Centrer le modèle
    model.position.x -= center.x;
    model.position.y -= center.y;
    model.position.z -= center.z;

    // Ajuster la caméra selon la taille du modèle
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = Math.max(maxDim * 2, 5); // Au moins 5 unités

    camera.position.set(cameraDistance, cameraDistance, cameraDistance);
    controls.target.set(0, 0, 0);
    controls.update();

    console.log('📷 Caméra positionnée à:', camera.position);
}

// Mettre à jour les contrôles UI
function updateModelControls() {
    if (!model) return;

    document.getElementById('pos-x').value = model.position.x;
    document.getElementById('pos-y').value = model.position.y;
    document.getElementById('pos-z').value = model.position.z;

    document.getElementById('rot-x').value = THREE.MathUtils.radToDeg(model.rotation.x);
    document.getElementById('rot-y').value = THREE.MathUtils.radToDeg(model.rotation.y);
    document.getElementById('rot-z').value = THREE.MathUtils.radToDeg(model.rotation.z);

    document.getElementById('scale-x').value = model.scale.x;
    document.getElementById('scale-y').value = model.scale.y;
    document.getElementById('scale-z').value = model.scale.z;
}

// GESTION DES KEYFRAMES
function addKeyframe() {
    const percentage = parseInt(document.getElementById('keyframe-percentage').value);

    const keyframe = {
        percentage: percentage,
        position: { x: model.position.x, y: model.position.y, z: model.position.z },
        rotation: {
            x: model.rotation.x,
            y: model.rotation.y,
            z: model.rotation.z
        },
        scale: { x: model.scale.x, y: model.scale.y, z: model.scale.z }
    };

    // Remplacer ou ajouter
    const existingIndex = keyframes.findIndex(k => k.percentage === percentage);
    if (existingIndex !== -1) {
        keyframes[existingIndex] = keyframe;
    } else {
        keyframes.push(keyframe);
        keyframes.sort((a, b) => a.percentage - b.percentage);
    }

    updateKeyframesList();
    updateRulerMarkers();
    generateCode();
}

function updateKeyframesList() {
    const list = document.getElementById('keyframes-list');
    list.innerHTML = '';

    if (keyframes.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: #a6adc8; padding: 20px;">Aucune keyframe</div>';
        return;
    }

    keyframes.forEach((keyframe, index) => {
        const item = document.createElement('div');
        item.className = 'keyframe-item';
        item.innerHTML = `
            <div>
                <div class="keyframe-percentage">${keyframe.percentage}%</div>
                <div style="font-size: 12px; color: #a6adc8;">
                    Position: (${keyframe.position.x.toFixed(1)}, ${keyframe.position.y.toFixed(1)}, ${keyframe.position.z.toFixed(1)})
                </div>
            </div>
            <div class="keyframe-actions">
                <button class="edit-keyframe" data-index="${index}"><i class="fa-solid fa-pencil"></i></button>
                <button class="delete-keyframe" data-index="${index}"><i class="fa-solid fa-eraser"></i></button>
            </div>
        `;
        list.appendChild(item);
    });

    // Événements
    document.querySelectorAll('.edit-keyframe').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            editKeyframe(index);
        });
    });

    document.querySelectorAll('.delete-keyframe').forEach(btn => {
        btn.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            deleteKeyframe(index);
        });
    });
}

function editKeyframe(index) {
    const keyframe = keyframes[index];

    // Mettre à jour l'UI
    document.getElementById('keyframe-percentage').value = keyframe.percentage;
    document.getElementById('percentage-value').textContent = `${keyframe.percentage}%`;

    // Mettre à jour le modèle
    if (model) {
        model.position.set(keyframe.position.x, keyframe.position.y, keyframe.position.z);
        model.rotation.set(keyframe.rotation.x, keyframe.rotation.y, keyframe.rotation.z);
        model.scale.set(keyframe.scale.x, keyframe.scale.y, keyframe.scale.z);
    }

    updateRulerPosition(keyframe.percentage);
    updateModelControls();
}

function deleteKeyframe(index) {
    keyframes.splice(index, 1);
    updateKeyframesList();
    updateRulerMarkers();
    generateCode();
}

// RÈGLE DE SCROLL
function updateRulerMarkers() {
    const track = document.getElementById('ruler-track');
    track.querySelectorAll('.ruler-marker').forEach(marker => marker.remove());

    keyframes.forEach(keyframe => {
        const marker = document.createElement('div');
        marker.className = 'ruler-marker';
        marker.style.left = `${keyframe.percentage}%`;

        const label = document.createElement('div');
        label.className = 'ruler-percentage';
        label.textContent = `${keyframe.percentage}%`;
        marker.appendChild(label);

        marker.addEventListener('click', () => {
            const index = keyframes.findIndex(k => k.percentage === keyframe.percentage);
            if (index !== -1) editKeyframe(index);
        });

        track.appendChild(marker);
    });
}

function updateRulerPosition(percentage) {
    document.getElementById('ruler-handle').style.left = `${percentage}%`;
    document.getElementById('preview-handle').style.left = `${percentage}%`;
    document.getElementById('preview-percentage').textContent = `${percentage}%`;
    updateModelByScroll(percentage);
}

function updateModelByScroll(percentage) {
    if (!model || keyframes.length === 0) return;

    // Trouver les keyframes adjacentes
    let prev = null, next = null;

    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i].percentage <= percentage) prev = keyframes[i];
        if (keyframes[i].percentage >= percentage) {
            next = keyframes[i];
            break;
        }
    }

    if (!prev && next) prev = next;
    if (!next && prev) next = prev;

    // Interpolation
    if (prev && next && prev !== next) {
        const t = (percentage - prev.percentage) / (next.percentage - prev.percentage);

        model.position.x = THREE.MathUtils.lerp(prev.position.x, next.position.x, t);
        model.position.y = THREE.MathUtils.lerp(prev.position.y, next.position.y, t);
        model.position.z = THREE.MathUtils.lerp(prev.position.z, next.position.z, t);

        model.rotation.x = THREE.MathUtils.lerp(prev.rotation.x, next.rotation.x, t);
        model.rotation.y = THREE.MathUtils.lerp(prev.rotation.y, next.rotation.y, t);
        model.rotation.z = THREE.MathUtils.lerp(prev.rotation.z, next.rotation.z, t);

        model.scale.x = THREE.MathUtils.lerp(prev.scale.x, next.scale.x, t);
        model.scale.y = THREE.MathUtils.lerp(prev.scale.y, next.scale.y, t);
        model.scale.z = THREE.MathUtils.lerp(prev.scale.z, next.scale.z, t);

    } else if (prev) {
        model.position.set(prev.position.x, prev.position.y, prev.position.z);
        model.rotation.set(prev.rotation.x, prev.rotation.y, prev.rotation.z);
        model.scale.set(prev.scale.x, prev.scale.y, prev.scale.z);
    }
}

// Remplacer la fonction saveProject() existante
function openSaveModal() {
    console.log("🔧 openSaveModal() appelée");

    if (!currentUser) {
        showAuthModal();
        return;
    }

    // Réinitialiser la modal
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('title-chars').textContent = '0';
    document.getElementById('desc-chars').textContent = '0';

    // Synchroniser la checkbox avec celle de la sidebar
    const sidebarCheckbox = document.getElementById('make-public');
    const modalCheckbox = document.getElementById('modal-make-public');
    if (sidebarCheckbox && modalCheckbox) {
        modalCheckbox.checked = sidebarCheckbox.checked;
    }

    // Afficher la modal
    document.getElementById('save-project-modal').style.display = 'flex';

    // Focus sur le champ titre
    setTimeout(() => {
        document.getElementById('project-title').focus();
    }, 100);
}

function closeSaveModal() {
    document.getElementById('save-project-modal').style.display = 'none';
}

// Compteurs de caractères
document.getElementById('project-title').addEventListener('input', function () {
    document.getElementById('title-chars').textContent = this.value.length;
});

document.getElementById('project-description').addEventListener('input', function () {
    document.getElementById('desc-chars').textContent = this.value.length;
});

// Soumission du formulaire
async function confirmSaveProject() {
    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const isPublic = document.getElementById('modal-make-public').checked;

    if (!title) {
        notify.error('Veuillez donner un titre à votre projet', 'Titre requis');
        document.getElementById('project-title').focus();
        return;
    }

    // Synchroniser avec la checkbox de la sidebar
    const sidebarCheckbox = document.getElementById('make-public');
    if (sidebarCheckbox) {
        sidebarCheckbox.checked = isPublic;
    }

    await saveProjectData(title, description, isPublic);
    closeSaveModal();
}

// Fonction de sauvegarde principale
async function saveProjectData(title, description, isPublic) {
    console.log("🔧 saveProjectData() appelée");

    const projectData = {
        keyframes: keyframes,
        modelSettings: {
            position: model ? { x: model.position.x, y: model.position.y, z: model.position.z } : { x: 0, y: 0, z: 0 },
            rotation: model ? { x: model.rotation.x, y: model.rotation.y, z: model.rotation.z } : { x: 0, y: 0, z: 0 },
            scale: model ? { x: model.scale.x, y: model.scale.y, z: model.scale.z } : { x: 1, y: 1, z: 1 }
        },
        camera: {
            position: camera ? { x: camera.position.x, y: camera.position.y, z: camera.position.z } : { x: 5, y: 5, z: 5 }
        },
        timestamp: new Date().toISOString()
    };

    try {
        const formData = new FormData();
        formData.append('action', 'save_project');
        formData.append('title', title);
        formData.append('description', description);
        formData.append('model_data', JSON.stringify(projectData));
        formData.append('is_public', isPublic ? 'true' : 'false');

        const response = await fetch('api.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // ✅ SIMPLE AJOUT: Stocker l'ID du projet pour le système de déblocage
            // ❌ PROBLEME: Ça débloque automatiquement tous les projets sauvegardés
            if (result.project_id) {
                currentProjectId = result.project_id; // Juste stocker l'ID, PAS débloquer
                console.log('✅ Projet sauvegardé avec ID:', currentProjectId);
            }

            const pointsResult = await addPoints(10);

            if (pointsResult.success) {
                showPointsAnimation(10, 'Projet sauvegardé !');

                const message = isPublic
                    ? 'Projet publié avec succès ! +10 💎'
                    : 'Projet sauvegardé en privé ! +10 💎';

                notify.success(message, 'Sauvegarde');
                refreshUserPoints();
            } else {
                notify.success('Projet sauvegardé ! (erreur attribution points)', 'Sauvegarde');
            }
        } else {
            notify.error('Erreur lors de la sauvegarde', result.message);
        }
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
        notify.error('Erreur réseau', 'Impossible de sauvegarder');
    }
}

// Fermer la modal en cliquant à l'extérieur
document.getElementById('save-project-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeSaveModal();
    }
});

// Soumission avec Enter
document.getElementById('project-title').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        confirmSaveProject();
    }
});

// SKETCHFAB BROWSER
class SketchFabBrowser {
    constructor() {
        this.apiUrl = '/api/sketchfab-proxy.php'; // ENDPOINT PHP
        this.models = [];
    }

    showBrowser() {
        const modalHTML = `
            <div class="sketchfab-modal-overlay">
                <div class="sketchfab-modal">
                    <div class="modal-header">
                        <h3>Bibliothèque SketchFab</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    
                    <div class="search-bar">
                        <input type="text" id="sketchfab-search" placeholder="Rechercher un modèle 3D...">
                        <button class="search-btn"><i class="fas fa-search"></i></button>
                    </div>
                    
                    <div class="filters">
                        <select id="category-filter">
                            <option value="">Toutes catégories</option>
                            <option value="characters">Personnages</option>
                            <option value="vehicles">Véhicules</option>
                            <option value="architecture">Architecture</option>
                        </select>
                    </div>
                    
                    <div class="models-grid" id="models-grid">
                        <div class="loading">Chargement des modèles populaires...</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.attachEventListeners();
        this.loadPopularModels();
    }

    attachEventListeners() {
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.querySelector('.search-btn').addEventListener('click', () => {
            this.search();
        });
        
        document.getElementById('sketchfab-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        
        document.getElementById('category-filter').addEventListener('change', () => {
            this.search();
        });
    }

    async search() {
        const query = document.getElementById('sketchfab-search').value;
        const category = document.getElementById('category-filter').value;
        
        const grid = document.getElementById('models-grid');
        grid.innerHTML = '<div class="loading">Recherche en cours...</div>';

        try {
            const params = new URLSearchParams({
                action: 'search',
                q: query,
                category: category
            });

            const response = await fetch(`${this.apiUrl}?${params}`);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.displayModels(data.results);
        } catch (error) {
            console.error('Erreur recherche:', error);
            grid.innerHTML = '<div class="error">Erreur de recherche</div>';
        }
    }

    async loadPopularModels() {
        try {
            const params = new URLSearchParams({
                action: 'search',
                sort_by: '-likeCount',
                category: 'characters,vehicles'
            });

            const response = await fetch(`${this.apiUrl}?${params}`);
            const data = await response.json();
            this.displayModels(data.results);
        } catch (error) {
            console.error('Erreur chargement modèles:', error);
        }
    }

    displayModels(models) {
        const grid = document.getElementById('models-grid');
        grid.innerHTML = '';

        if (!models || models.length === 0) {
            grid.innerHTML = '<div class="no-results">Aucun modèle trouvé</div>';
            return;
        }

        models.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'model-card';
            modelCard.innerHTML = `
                <img src="${model.thumbnails.images[0]?.url || ''}" alt="${model.name}">
                <div class="model-info">
                    <h4>${model.name}</h4>
                    <p>Par ${model.user.username}</p>
                    <div class="model-stats">
                        <span><i class="fas fa-heart"></i> ${model.likeCount}</span>
                        <span><i class="fas fa-eye"></i> ${model.viewCount}</span>
                    </div>
                </div>
            `;
            
            modelCard.addEventListener('click', () => {
                this.selectModel(model.uid);
            });
            
            grid.appendChild(modelCard);
        });
    }

    async selectModel(modelId) {
        try {
            notify.info('Vérification du modèle...', 'SketchFab');
            
            // Vérifier via le proxy
            const params = new URLSearchParams({
                action: 'model',
                modelId: modelId
            });

            const response = await fetch(`${this.apiUrl}?${params}`);
            const model = await response.json();
            
            if (model.download && model.download.gltf && model.download.gltf.url) {
                // Téléchargement direct (le token est protégé par le proxy)
                await this.downloadModelDirect(model.download.gltf.url, model.name);
            } else {
                notify.error('Ce modèle n\'est pas téléchargeable', 'SketchFab');
            }
        } catch (error) {
            console.error('Erreur sélection:', error);
            notify.error('Erreur lors de la vérification', 'SketchFab');
        }
    }

    async downloadModelDirect(downloadUrl, modelName) {
        try {
            notify.info('Téléchargement en cours...', 'SketchFab');
            
            // Téléchargement direct depuis Sketchfab (URL signée)
            const response = await fetch(downloadUrl);
            
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const file = new File([blob], `${modelName}.glb`, { 
                type: 'model/gltf-binary' 
            });
            
            if (typeof loadModel === 'function') {
                loadModel(file);
                this.closeModal();
                notify.success(`${modelName} chargé !`, 'SketchFab');
            } else {
                console.error('Fonction loadModel non trouvée');
                notify.error('Erreur de chargement dans le viewer', 'SketchFab');
            }
            
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            notify.error('Échec du téléchargement', 'SketchFab');
        }
    }

    closeModal() {
        const modal = document.querySelector('.sketchfab-modal-overlay');
        if (modal) modal.remove();
    }
}

const sketchFabBrowser = new SketchFabBrowser();
/* function et modal pour Sketchfab api
class SketchFabBrowser {
    constructor() {
        this.apiUrl = 'https://api.sketchfab.com/v3/search';
        this.models = [];
    }

    showBrowser() {
        const modalHTML = `
            <div class="sketchfab-modal-overlay">
                <div class="sketchfab-modal">
                    <div class="modal-header">
                        <h3>Bibliothèque SketchFab</h3>
                        <button onclick="close">&times;</button>
                    </div>
                    
                    <div class="search-bar">
                        <input type="text" id="sketchfab-search" placeholder="Rechercher un modèle 3D...">
                        <button onclick="sketchFabBrowser.search()" class="btn-ghost"><i class="fas fa-search"></i></button>
                    </div>
                    
                    <div class="filters">
                        <select id="category-filter">
                            <option value="">Toutes catégories</option>
                            <option value="characters">Personnages</option>
                            <option value="vehicles">Véhicules</option>
                            <option value="architecture">Architecture</option>
                        </select>
                    </div>
                    
                    <div class="models-grid" id="models-grid">
                        <div class="loading">Chargement des modèles populaires...</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.loadPopularModels();
    }

    async search() {
        const query = document.getElementById('sketchfab-search').value;
        const category = document.getElementById('category-filter').value;
        
        const params = new URLSearchParams({
            q: query,
            type: 'models',
            downloadable: true,
            sort_by: '-publishedAt'
        });
        
        if (category) params.append('categories', category);

        try {
            const response = await fetch(`${this.apiUrl}?${params}`);
            const data = await response.json();
            this.displayModels(data.results);
        } catch (error) {
            console.error('Erreur recherche SketchFab:', error);
        }
    }

    async loadPopularModels() {
        // Modèles éducatifs populaires pour débuter
        const params = new URLSearchParams({
            type: 'models',
            downloadable: true,
            sort_by: '-likeCount',
            categories: 'characters,vehicles',
            count: 12
        });

        try {
            const response = await fetch(`${this.apiUrl}?${params}`);
            const data = await response.json();
            this.displayModels(data.results);
        } catch (error) {
            console.error('Erreur SketchFab:', error);
        }
    }

    displayModels(models) {
        const grid = document.getElementById('models-grid');
        grid.innerHTML = '';

        models.forEach(model => {
            const modelCard = `
                <div class="model-card" onclick="sketchFabBrowser.selectModel('${model.uid}')">
                    <img src="${model.thumbnails.images[0].url}" alt="${model.name}">
                    <div class="model-info">
                        <h4>${model.name}</h4>
                        <p>Par ${model.user.username}</p>
                        <div class="model-stats">
                            <span><i class="fas fa-heart"></i> ${model.likeCount}</span>
                            <span><i class="fas fa-eye"></i> ${model.viewCount}</span>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', modelCard);
        });
    }

    async selectModel(modelId) {
        try {
            notify.info('Téléchargement du modèle...', 'SketchFab');
            
            // Récupérer les infos détaillées
            const response = await fetch(`https://api.sketchfab.com/v3/models/${modelId}`);
            const model = await response.json();
            
            // Télécharger le modèle GLTF
            if (model.download && model.download.gltf) {
                await this.downloadModel(model.download.gltf.url, model.name);
            } else {
                notify.error('Modèle non téléchargeable', 'SketchFab');
                this.closeModal();
            }
        } catch (error) {
            console.error('Erreur sélection modèle:', error);
            this.closeModal();
        }
    }

    async downloadModel(downloadUrl, modelName) {
        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const file = new File([blob], `${modelName}.glb`, { type: 'model/gltf-binary' });
            
            // Charger dans Three.js
            loadModel(file);
            this.closeModal();
            
            notify.success(`${modelName} chargé !`, 'SketchFab');
        } catch (error) {
            console.error('Erreur téléchargement:', error);
        }
    }

    closeModal() {
        const modal = document.querySelector('.sketchfab-modal-overlay');
        if (modal) modal.remove();
    }
}
const sketchFabBrowser = new SketchFabBrowser();
*/
// === NOUVELLES FONCTIONS POUR LA GESTION DES POINTS ===

// Fonctions de gestion des points
async function checkAndDeductPoints(actionType) {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=deduct_points&action_type=${actionType}`
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur déduction points:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

async function addPoints(points) {
    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=add_points&points=${points}`
        });

        return await response.json();
    } catch (error) {
        console.error('Erreur ajout points:', error);
        return { success: false, message: 'Erreur réseau' };
    }
}

function updateUserPointsDisplay(newPoints) {
    // Mettre à jour l'affichage dans le header
    const pointsElement = document.getElementById('user-points');
    if (pointsElement) {
        pointsElement.textContent = `💎 ${newPoints}`;
    }

    // Mettre à jour l'affichage dans la section points-info
    const currentPointsElement = document.getElementById('current-points');
    if (currentPointsElement) {
        currentPointsElement.textContent = newPoints;
    }

    // Mettre à jour la variable currentUser
    if (currentUser) {
        currentUser.points = newPoints;
    }
}

// Bonus de connexion quotidienne - À appeler au chargement de la page
async function claimDailyBonus() {
    if (!currentUser) return;

    try {
        const response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=daily_login_bonus'
        });

        const result = await response.json();
        if (result.success) {
            notify.success('Bonus quotidien: +10 💎', 'Récompense');
            showPointsAnimation(10, 'Bonus quotidien reçu!');
            refreshUserPoints();
        }
    } catch (error) {
        console.error('Erreur bonus quotidien:', error);
    }
}

// Au chargement de la page pour les utilisateurs connectés
document.addEventListener('DOMContentLoaded', function () {
    if (currentUser) {
        setTimeout(claimDailyBonus, 2000); // Attendre 2s après le chargement
    }
});

// Fonction pour récupérer le solde actuel
async function refreshUserPoints() {
    if (!currentUser) return;

    try {
        const response = await fetch('api.php?action=get_user_points');
        const result = await response.json();

        if (result.success) {
            updateUserPointsDisplay(result.points);
        }
    } catch (error) {
        console.error('Erreur rafraîchissement points:', error);
    }
}


// Open with codepen :
document.getElementById("open-codepen").addEventListener("click", async () => {
    if (!currentUser) {
        showAuthModal();
        return;
    }

    // Vérifier et déduire les points
    const pointsCheck = await checkAndDeductPoints('codepen');
    if (!pointsCheck.success) {
        notify.error(pointsCheck.message, 'Points insuffisants');

        // Proposer d'acheter des points
        if (confirm("Points insuffisants ! Voulez-vous acheter plus de points ?")) {
            window.location.href = 'tarif.php';
        }
        return;
    }

    // Mettre à jour l'affichage
    updateUserPointsDisplay(pointsCheck.new_balance);

    // Le reste de ta fonction d'export CodePen existante
    const html = document.getElementById("full-html-code").value;
    const css = document.getElementById("full-css-code").value;
    const js = document.getElementById("full-js-code").value;

    const data = {
        title: "Template by 3dscrollanimator.com",
        html: html,
        css: css,
        js: js,
        editors: "101",
    };

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://codepen.io/pen/define";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "data";
    input.value = JSON.stringify(data);
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    notify.success('Export CodePen réussi! -50 💎', 'Export');
    showGemsAnimation(50, 'CodePen débloqué !');
});


// GÉNÉRATION DE CODE
// GÉNÉRATION DE CODE COMPLET
function generateCode() {
    if (keyframes.length === 0) {
        document.getElementById('generated-code').value = '// Ajoutez des keyframes pour générer le code';
        document.getElementById('full-html-code').value = '<!-- Ajoutez des keyframes pour générer le code complet -->';
        document.getElementById('full-css-code').value = '/* Ajoutez des keyframes pour générer le code complet */';
        document.getElementById('full-js-code').value = '// Ajoutez des keyframes pour générer le code complet';
        return;
    }

    // Générer le JS
    const jsCode = generateJSCode();
    document.getElementById('generated-code').value = jsCode;

    // Générer le code complet POUR TOUS
    const htmlCode = generateHTMLCode();
    const cssCode = generateCSSCode();

    document.getElementById('full-html-code').value = htmlCode;
    document.getElementById('full-css-code').value = cssCode;
    document.getElementById('full-js-code').value = jsCode;

    notify.success('Code complet généré', 'Prêt à exporter');
}

function generateJSCode() {
    return `// Generate by 3Dscrollanimator.com
let scene, camera, renderer, model;
const keyframes = ${JSON.stringify(keyframes, null, 2)};

function init() {
    // Initialisation de base
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true // ⬅️ ACTIVER LA TRANSPARENCE
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // ⬅️ COULEUR DE FOND TRANSPARENTE
    document.body.appendChild(renderer.domElement);
    
    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    
    // Charger votre modèle (remplacez l'URL) 
    // "Fantasy Town" (https://skfb.ly/6ZUUF) by Eh is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).
    const loader = new THREE.GLTFLoader();
    loader.load('https://raw.githubusercontent.com/berru-g/berru-g/refs/heads/main/img/fantasy_town.glb', function(gltf) {
        model = gltf.scene;
        scene.add(model);
        
        // Centrage automatique
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Configuration caméra
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        
        updateModelByScroll(0);
    });
    
    // Événements
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', onScroll);
    
    // Animation
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    updateModelByScroll(scrollPercentage);
}

function updateModelByScroll(percentage) {
    if (!model || keyframes.length === 0) return;
    
    let prev = null, next = null;
    
    // Trouver les keyframes adjacentes
    for (let i = 0; i < keyframes.length; i++) {
        if (keyframes[i].percentage <= percentage) prev = keyframes[i];
        if (keyframes[i].percentage >= percentage) {
            next = keyframes[i];
            break;
        }
    }
    
    if (!prev && next) prev = next;
    if (!next && prev) next = prev;
    
    if (prev && next && prev !== next) {
        const t = (percentage - prev.percentage) / (next.percentage - prev.percentage);
        
        // Interpolation linéaire
        model.position.x = THREE.MathUtils.lerp(prev.position.x, next.position.x, t);
        model.position.y = THREE.MathUtils.lerp(prev.position.y, next.position.y, t);
        model.position.z = THREE.MathUtils.lerp(prev.position.z, next.position.z, t);
        
        model.rotation.x = THREE.MathUtils.lerp(prev.rotation.x, next.rotation.x, t);
        model.rotation.y = THREE.MathUtils.lerp(prev.rotation.y, next.rotation.y, t);
        model.rotation.z = THREE.MathUtils.lerp(prev.rotation.z, next.rotation.z, t);
        
        model.scale.x = THREE.MathUtils.lerp(prev.scale.x, next.scale.x, t);
        model.scale.y = THREE.MathUtils.lerp(prev.scale.y, next.scale.y, t);
        model.scale.z = THREE.MathUtils.lerp(prev.scale.z, next.scale.z, t);
        
    } else if (prev) {
        model.position.set(prev.position.x, prev.position.y, prev.position.z);
        model.rotation.set(prev.rotation.x, prev.rotation.y, prev.rotation.z);
        model.scale.set(prev.scale.x, prev.scale.y, prev.scale.z);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Démarrer
init();`;
}

function generateHTMLCode() {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animation 3D avec Scroll</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        
        <div class="scroll-space"></div>
      
      <a class="sba-ghost" href="https://3dscrollanimator.com" target="_blank" rel="noopener noreferrer">
  Powered by 3DScrollAnimator.com
</a>
    
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.min.js"></script>
    <script src="script.js"></script>
</body>
</html>`;
}

function generateCSSCode() {
    return `/* Code généré par https://3dscrollanimator.com/ Éditeur 3D No-Code */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #cdd6f4; /*inherit pour l'export wordpress*/
    overflow-x: hidden;
}

.container {
    position: relative;
    z-index: 1;
  background: transparent;
}

.scroll-space {
    height: 100%;
    min-height: 200vh;
    position: relative;
}

/* Canvas Three.js */
canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  /*background: transparent; A implementer dans le code, import pour wordpress */
    background-image: url('https://raw.githubusercontent.com/berru-g/berru-g/refs/heads/main/img/cgpt.png'); /* changez l'image ici */ 
}

.sba-ghost{
  position:fixed;
  left:10px;
  bottom:10px;
  padding:8px 10px;
  border-radius:8px;
  font-size:8px;
  text-decoration:none;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9); /*inherit*/
  backdrop-filter: blur(6px);
  border:1px solid rgba(255,255,255,0.06);
  box-shadow: 0 4px 14px rgba(2,6,23,0.25);
}
@media (prefers-color-scheme:light){
  .sba-ghost{ background: rgba(11,92,255,0.06); color:#042a6b; }
}

/* Responsive */
@media (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }
    
    header p {
        font-size: 1rem;
    }
}`;
}

// CONFIGURATION DES ÉVÉNEMENTS
function setupEventListeners() {
    // Import model
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('model-input').click();
    });

    document.getElementById('model-input').addEventListener('change', (e) => {
        if (e.target.files[0]) loadModel(e.target.files[0]);
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });

            currentTab = this.getAttribute('data-tab');
            document.getElementById(`${currentTab}-controls`).style.display = 'block';
        });
    });

    // Percentage slider
    document.getElementById('keyframe-percentage').addEventListener('input', function () {
        const percentage = this.value;
        document.getElementById('percentage-value').textContent = `${percentage}%`;
        updateRulerPosition(parseInt(percentage));
    });

    // Model controls
    const controls = ['pos-x', 'pos-y', 'pos-z', 'rot-x', 'rot-y', 'rot-z', 'scale-x', 'scale-y', 'scale-z'];
    controls.forEach(control => {
        document.getElementById(control).addEventListener('input', function () {
            if (!model) return;

            const value = parseFloat(this.value);

            if (control.startsWith('pos-')) {
                const axis = control.split('-')[1];
                model.position[axis] = value;
            } else if (control.startsWith('rot-')) {
                const axis = control.split('-')[1];
                model.rotation[axis] = THREE.MathUtils.degToRad(value);
            } else if (control.startsWith('scale-')) {
                const axis = control.split('-')[1];
                model.scale[axis] = value;
            }
        });
    });

    // Model scale
    document.getElementById('model-scale').addEventListener('input', function () {
        if (model) {
            const scale = parseFloat(this.value);
            model.scale.set(scale, scale, scale);
        }
    });

    // Add keyframe
    document.getElementById('add-keyframe').addEventListener('click', addKeyframe);

    // Copy code
    document.getElementById('copy-code').addEventListener('click', function () {
        const textarea = document.getElementById('generated-code');
        textarea.select();
        document.execCommand('copy');
        notify.success('✅ Code copié !');
    });

    // Ruler interaction
    const rulerTrack = document.getElementById('ruler-track');
    rulerTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateRulerFromEvent(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateRulerFromEvent(e);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateRulerFromEvent(e) {
        const rect = rulerTrack.getBoundingClientRect();
        let percentage = ((e.clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, Math.round(percentage)));

        document.getElementById('keyframe-percentage').value = percentage;
        document.getElementById('percentage-value').textContent = `${percentage}%`;
        updateRulerPosition(percentage);
    }

    // Preview scroll
    const previewScroll = document.getElementById('preview-scroll');
    previewScroll.addEventListener('mousedown', (e) => {
        isDragging = true;
        updatePreviewFromEvent(e);
    });

    function updatePreviewFromEvent(e) {
        const rect = previewScroll.getBoundingClientRect();
        let percentage = ((e.clientX - rect.left) / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, Math.round(percentage)));

        document.getElementById('keyframe-percentage').value = percentage;
        document.getElementById('percentage-value').textContent = `${percentage}%`;
        updateRulerPosition(percentage);
    }

    // Window resize
    window.addEventListener('resize', () => {
        if (renderer && camera) {
            const viewer = document.getElementById('viewer');
            camera.aspect = viewer.offsetWidth / viewer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(viewer.offsetWidth, viewer.offsetHeight);
        }
    });
}

// Fonction pour charger un modèle de test
function loadTestModel() {
    console.log(' Chargement du modèle test...');

    const loader = new THREE.GLTFLoader();

    // URL du modèle test , credit en readme:
    //https://raw.githubusercontent.com/berru-g/3Dscrollanimator/refs/heads/main/model3D/tv01_stage.glb
    const modelUrl = 'https://raw.githubusercontent.com/berru-g/berru-g/refs/heads/main/img/fantasy_town.glb';

    // Afficher le loading
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = 'Chargement du modèle test...';
    }

    notify.info('Chargement du modèle drone de test...', 'Modèle Test');

    loader.load(
        modelUrl,
        // Succès
        function (gltf) {
            console.log('✅ Modèle test chargé avec succès');

            // Cacher le loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            handleLoadedModel(gltf.scene);
            notify.success('Modèle test chargé !', 'Succès');

            // Ajouter quelques keyframes d'exemple automatiquement
            setTimeout(() => {
                addExampleKeyframes();
            }, 1000);
        },
        // Progression
        function (xhr) {
            if (loadingElement) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                loadingElement.textContent = `Chargement du modèle test... ${percent}%`;
            }
        },
        // Erreur
        function (error) {
            console.error('❌ Erreur chargement modèle test:', error);

            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            notify.error('Erreur de chargement du modèle test', 'Erreur');

            // Fallback: créer un modèle simple
            createFallbackModel();
        }
    );
}

// Fonction pour ajouter des keyframes d'exemple
function addExampleKeyframes() {
    if (!model || keyframes.length > 0) return;

    console.log('➕ Ajout des keyframes d\'exemple...');

    // Keyframe à 0%
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);

    let keyframe = {
        percentage: 0,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
    };
    keyframes.push(keyframe);

    /*// Keyframe à 25%
    keyframe = {
        percentage: 25,
        position: { x: 2, y: 1, z: -1 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        scale: { x: 1.2, y: 1.2, z: 1.2 }
    };
    keyframes.push(keyframe);

    // Keyframe à 50%
    keyframe = {
        percentage: 50,
        position: { x: 0, y: 2, z: -2 },
        rotation: { x: Math.PI / 6, y: Math.PI / 2, z: 0 },
        scale: { x: 0.8, y: 0.8, z: 0.8 }
    };
    keyframes.push(keyframe);

    // Keyframe à 75%
    keyframe = {
        percentage: 75,
        position: { x: -2, y: 1, z: -1 },
        rotation: { x: 0, y: Math.PI * 1.5, z: Math.PI / 8 },
        scale: { x: 1.1, y: 1.1, z: 1.1 }
    };
    keyframes.push(keyframe);*/

    // Keyframe à 100%
    keyframe = {
        percentage: 100,
        position: { x: 0, y: 1.4, z: 0 },
        rotation: { x: 0, y: 6.283185307179586, z: 0 },
        scale: { x: 3, y: 3, z: 3 }
    };
    keyframes.push(keyframe);

    // Mettre à jour l'interface
    updateKeyframesList();
    updateRulerMarkers();
    generateCode();

    // Positionner à 0%
    updateRulerPosition(0);

    notify.success('Keyframes d\'exemple ajoutées !', 'Animation Prête');
    console.log('✅ Keyframes d\'exemple ajoutées');
}

// Fonction de fallback si le modèle distant échoue
function createFallbackModel() {
    console.log('🔄 Création d\'un modèle de fallback...');

    // Créer un groupe pour un modèle plus complexe
    const modelGroup = new THREE.Group();

    // Corps principal
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.3, 1, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        metalness: 0.3,
        roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    modelGroup.add(body);

    // Hélices
    const propellerGeometry = new THREE.BoxGeometry(2, 0.1, 0.3);
    const propellerMaterial = new THREE.MeshStandardMaterial({
        color: 0x2196F3
    });

    for (let i = 0; i < 4; i++) {
        const propeller = new THREE.Mesh(propellerGeometry, propellerMaterial);
        const angle = (i / 4) * Math.PI * 2;
        propeller.position.set(
            Math.cos(angle) * 0.8,
            Math.sin(angle) * 0.8,
            0
        );
        propeller.rotation.z = angle;
        modelGroup.add(propeller);

        // Support d'hélice
        const supportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 6);
        const supportMaterial = new THREE.MeshStandardMaterial({
            color: 0x607D8B
        });
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        support.position.set(
            Math.cos(angle) * 0.4,
            Math.sin(angle) * 0.4,
            0
        );
        support.rotation.z = angle + Math.PI / 2;
        modelGroup.add(support);
    }

    // Caméra/objectif
    const cameraGeometry = new THREE.SphereGeometry(0.2, 8, 6);
    const cameraMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000
    });
    const camera = new THREE.Mesh(cameraGeometry, cameraMaterial);
    camera.position.set(0, 0, 0.6);
    modelGroup.add(camera);

    // Pattes d'atterrissage
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x795548
    });

    const legPositions = [
        { x: 0.3, y: 0.3, z: -0.5 },
        { x: -0.3, y: 0.3, z: -0.5 },
        { x: 0.3, y: -0.3, z: -0.5 },
        { x: -0.3, y: -0.3, z: -0.5 }
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, pos.y, pos.z);
        leg.rotation.x = Math.PI / 4;
        modelGroup.add(leg);
    });

    handleLoadedModel(modelGroup);
    notify.info('Modèle drone généré localement', 'Fallback');

    // Ajouter les keyframes d'exemple
    setTimeout(() => {
        addExampleKeyframes();
    }, 500);
}

// S'assurer que le bouton est connecté
document.addEventListener('DOMContentLoaded', function () {
    // Le bouton est déjà connecté via onclick="loadTestModel()" dans ton HTML
    console.log('✅ Fonction loadTestModel() prête');
});

// Charger un projet
async function loadProject(projectId) {
    try {
        const response = await fetch(`api.php?action=get_project&id=${projectId}`);
        const result = await response.json();

        if (result.success) {
            const project = result.project;
            currentProjectId = projectId;
            console.log('🔄 Projet chargé, currentProjectId:', currentProjectId);
            const modelData = JSON.parse(project.model_data);

            // Appliquer les keyframes
            keyframes = modelData.keyframes || [];
            updateKeyframesList();
            updateRulerMarkers();

            // Appliquer les paramètres du modèle
            if (model && modelData.modelSettings) {
                const settings = modelData.modelSettings;
                model.position.set(
                    settings.position.x,
                    settings.position.y,
                    settings.position.z
                );
                model.rotation.set(
                    settings.rotation.x,
                    settings.rotation.y,
                    settings.rotation.z
                );
                model.scale.set(
                    settings.scale.x,
                    settings.scale.y,
                    settings.scale.z
                );
                updateModelControls();
            }

            notify.success('Projet chargé avec succès!', 'Chargement');
        } else {
            notify.error('Erreur chargement', result.message);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
        notify.error('Erreur réseau', 'Impossible de charger le projet');
    }
}

// Mettre à jour l'UI avec les boutons de sauvegarde
function updateProjectUI() {
    // Ajouter le bouton Record dans le HTML
    if (!document.getElementById('record-btn')) {
        const recordBtn = document.createElement('button');
        recordBtn.id = 'record-btn';
        recordBtn.className = 'btn';
        recordBtn.innerHTML = '💾 Enregistrer le projet';
        recordBtn.onclick = saveProject;

        const section = document.querySelector('.section:nth-child(3)');
        section.insertBefore(recordBtn, section.querySelector('.keyframes-list'));
    }
}


// DÉMARRAGE DE L'APPLICATION
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM chargé, démarrage de l\'application...');

    // Gestion des onglets de code
    document.querySelectorAll('.code-exporter .tab').forEach(tab => {
        tab.addEventListener('click', function () {
            // Désactiver tous les tabs
            document.querySelectorAll('.code-exporter .tab').forEach(t => t.classList.remove('active'));
            // Activer ce tab
            this.classList.add('active');

            // Cacher tous les contenus
            document.querySelectorAll('.code-tab').forEach(content => {
                content.style.display = 'none';
            });

            // Afficher le contenu correspondant
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });

    /* Boutons de copie
    document.getElementById('copy-html').addEventListener('click', function() {
        copyToClipboard('full-html-code');
        alert('✅ HTML copié !');
    });
    
    document.getElementById('copy-css').addEventListener('click', function() {
        copyToClipboard('full-css-code');
        alert('✅ CSS copié !');
    });
    
    document.getElementById('copy-js').addEventListener('click', function() {
        copyToClipboard('full-js-code');
        alert('✅ JS copié !');
    });
    
    document.getElementById('copy-all').addEventListener('click', function() {
        const allCode = `=== HTML ===\n${document.getElementById('full-html-code').value}\n\n=== CSS ===\n${document.getElementById('full-css-code').value}\n\n=== JS ===\n${document.getElementById('full-js-code').value}`;
        copyTextToClipboard(allCode);
        alert('✅ Tout le code copié !');
    });
    */

    // Fonction utilitaire de copie
    function copyToClipboard(elementId) {
        const textarea = document.getElementById(elementId);
        textarea.select();
        document.execCommand('copy');
    }

    function copyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Attendre que Three.js soit disponible
    function waitForThreeJS() {
        if (typeof THREE === 'undefined') {
            console.log('⏳ En attente de Three.js...');
            setTimeout(waitForThreeJS, 100);
            return;
        }

        if (typeof THREE.OrbitControls === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
            console.log('⏳ En attente des modules Three.js...');
            setTimeout(waitForThreeJS, 100);
            return;
        }

        console.log('✅ Three.js et modules détectés');
        initApplication();
    }

    waitForThreeJS();
});


// ======================================
// AUTHENTIFICATION ET AUTORISATION USER = FREE / PRO
// ======================================

let currentUser = window.currentUser || null;
// pro par defaut en attendant de mettre en place le systeme de paiment 
let userSubscription = window.userSubscription || 'pro'; // function a revoir car bug le deverrouillage en ligne mais fonctionne en local
// Mettre à jour l'interface
function updateUI() {
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const codeGuest = document.getElementById('code-guest');
    const codeFreeUser = document.getElementById('code-free-user');
    const codeProUser = document.getElementById('code-pro-user');

    console.log('updateUI() - currentUser:', currentUser);

    if (currentUser) {//connected
        if (guestMenu) guestMenu.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (codeGuest) codeGuest.style.display = 'none'; // none de base

        if (userSubscription === 'pro') {
            if (codeFreeUser) codeFreeUser.style.display = 'none';
            if (codeProUser) codeProUser.style.display = 'block';
        } else {
            if (codeFreeUser) codeFreeUser.style.display = 'block';
            if (codeProUser) codeProUser.style.display = 'none';
        }
    } else {//deconnnected
        if (guestMenu) guestMenu.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        if (codeGuest) codeGuest.style.display = 'block';
        if (codeFreeUser) codeFreeUser.style.display = 'none';
        if (codeProUser) codeProUser.style.display = 'none';
    }
}


// Nouvelle fonction pour l'achat via Lemon Squeezie
/*
document.querySelectorAll('.buy-points').forEach(button => {
    button.addEventListener('click', async function () {
        const packElement = this.closest('.point-pack');
        const packId = packElement.getAttribute('data-pack-id');

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=create_lemon_checkout&pack_id=${packId}`
            });

            const result = await response.json();

            if (result.success) {
                // Redirection vers Lemon Squeezie
                window.location.href = result.checkout_url;
            } else {
                notify.error('Erreur', result.message);
            }
        } catch (error) {
            console.error('Erreur achat:', error);
            notify.error('Erreur réseau', 'Impossible de procéder au paiement');
        }
    });
});
*/


// ======================================
// SYSTÈME DE PAIEMENT UNIFIÉ (Lemon + Solana) //'D6khWoqvc2zX46HVtSZcNrPumnPLPM72SnSuDhBrZeTC'
// ======================================
//import { Connection, PublicKey, Transaction, SystemProgram } from 'https://cdn.jsdelivr.net/npm/@solana/web3.js@1.87.6/+esm';
// car 
// npm install @solana/web3.js @solana/wallet-adapter-wallets @solana/wallet-adapter-base
// dependance trop lourde
class UnifiedPaymentSystem {
    constructor() {
        this.merchantAddress = 'D6khWoqvc2zX46HVtSZcNrPumnPLPM72SnSuDhBrZeTC';
        this.packConfig = {
            1: { points: 100, eur: 4.90, name: 'Starter' },
            2: { points: 500, eur: 19.90, name: 'Pro' },
            3: { points: 1500, eur: 49.90, name: 'Expert' }
        };
        this.solPrice = 150;
        this.loadSolPrice();
        this.injectCSS();
    }

    injectCSS() {
        const css = `
            .payment-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: flex-start; 
    z-index: 10000;
    backdrop-filter: blur(5px);
    padding: 20px 0; 
    overflow-y: auto; 
}

.payment-modal {
    background: var(--grey-light);
    border-radius: 16px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    border: 1px solid var(--grey);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    color: var(--text);
    margin: auto; 
    max-height: 90vh; 
    overflow-y: auto; 
}


.solana-instructions {
    max-width: 600px;
    max-height: 85vh; 
}

.modal-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    bottom: 0;
    background: var(--grey-light);
    padding-top: 1rem;
    margin-top: auto; 
}

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .modal-header h3 {
                margin: 0;
                color: var(--text);
                font-size: 1.5rem;
            }

            .modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--text-light);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .pack-info {
                text-align: center;
                margin-bottom: 2rem;
                padding: 1rem;
                background: var(--grey);
                border-radius: 12px;
            }

            .pack-name {
                font-size: 1.3rem;
                font-weight: bold;
                color: var(--text);
            }

            .pack-points {
                font-size: 1.1rem;
                color: var(--accent);
                margin-top: 0.5rem;
            }

            .payment-options {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .payment-option {
                display: flex;
                align-items: center;
                padding: 1.5rem;
                background: var(--grey);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .payment-option:hover {
                border-color: var(--primary);
                transform: translateY(-2px);
                background: var(--grey-light);
            }

            .option-icon {
                font-size: 2rem;
                margin-right: 1rem;
                fill: var(--text);
            }

            .option-content {
                flex: 1;
            }

            .option-title {
                font-weight: bold;
                color: var(--text);
                margin-bottom: 0.25rem;
            }

            .option-subtitle {
                color: var(--text-light);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .option-amount {
                font-weight: bold;
                color: var(--primary);
                font-size: 1.1rem;
            }

            .option-arrow {
                font-size: 1.5rem;
                color: var(--text-light);
            }

            .security-badge {
                text-align: center;
                color: var(--text-light);
                font-size: 0.9rem;
                padding-top: 1rem;
                border-top: 1px solid var(--grey);
            }

            .solana-instructions {
                max-width: 600px;
            }

            .success-badge {
                background: var(--success);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 1rem;
                font-weight: bold;
            }

            .amount-card {
                text-align: center;
                background: linear-gradient(135deg, #9945FF, #14F195);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                margin-bottom: 2rem;
            }

            .crypto-amount {
                font-size: 2.5rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }

            .fiat-equivalent {
                font-size: 1.2rem;
                opacity: 0.9;
            }

            .wallet-address {
                margin-bottom: 2rem;
            }

            .wallet-address label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--text-light);
                font-weight: bold;
            }

            .address-box {
                display: flex;
                align-items: center;
                background: var(--grey);
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid var(--grey);
                font-family: 'Fira Code', monospace;
            }

            .address-box code {
                flex: 1;
                font-size: 0.9rem;
                word-break: break-all;
                color: var(--text);
            }

            .copy-btn {
                background: var(--primary);
                border: none;
                padding: 0.5rem;
                border-radius: 6px;
                cursor: pointer;
                margin-left: 1rem;
                color: white;
            }

            .trust-message {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: var(--grey);
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            }

            .trust-icon {
                font-size: 2rem;
            }

            .trust-text {
                flex: 1;
                font-size: 0.9rem;
            }

            .steps {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .step {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .step-number {
                background: var(--primary);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.9rem;
            }

            .step-text {
                color: var(--text);
            }

            .modal-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .modal-btn {
                padding: 1rem 1.5rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }

            .option-rate {
                font-size: 0.8rem;
                color: var(--text-light);
                margin-top: 0.25rem;
            }
        `;

        if (!document.getElementById('payment-system-css')) {
            const style = document.createElement('style');
            style.id = 'payment-system-css';
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    async loadSolPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur');
            const data = await response.json();
            this.solPrice = data.solana.eur;
            console.log('Prix SOL mis à jour:', this.solPrice + '€');
        } catch (error) {
            console.error('Erreur API CoinGecko, utilisation fallback:', error);
        }
    }

    eurToSol(eurAmount) {
        const sol = eurAmount / this.solPrice;
        return Math.round(sol * 10000) / 10000;
    }

    // FONCTION PRINCIPALE
    setupPaymentButtons() {
        document.querySelectorAll('.buy-points').forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const packElement = button.closest('.point-pack');
                const packId = packElement.getAttribute('data-pack-id');

                this.showPaymentModal(packId);
            });
        });
    }

    showPaymentModal(packId) {
        const pack = this.packConfig[packId];
        if (!pack) return;

        const solAmount = this.eurToSol(pack.eur);

        const modalHTML = `
            <div class="payment-modal-overlay">
                <div class="payment-modal">
                    <div class="modal-header">
                        <h3>Choisir le paiement</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    
                    <div class="pack-info">
                        <div class="pack-name">Pack ${pack.name}</div>
                        <div class="pack-points">+${pack.points} 💎</div>
                    </div>

                    <div class="payment-options">
                        <div class="payment-option crypto-option">
                            <div class="option-icon"><i class="fa-solid fa-wallet"></i></div>
                            <div class="option-content">
                                <div class="option-title">Paiement Crypto</div>
                                <div class="option-subtitle">Solana - Instantané</div>
                                <div class="option-amount">${solAmount} SOL</div>
                                <div class="option-rate">≈ ${pack.eur} €</div>
                            </div>
                            <div class="option-arrow">→</div>
                        </div>

                        <div class="payment-option card-option">
                            <div class="option-icon"><i class="fa-solid fa-credit-card"></i></div>
                            <div class="option-content">
                                <div class="option-title">Carte Bancaire</div>
                                <div class="option-subtitle">Visa, Mastercard</div>
                                <div class="option-amount">${pack.eur} €</div>
                            </div>
                            <div class="option-arrow">→</div>
                        </div>
                    </div>

                    <div class="security-badge">
                        🔒 Paiements 100% sécurisés
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Events pour les options
        document.querySelector('.crypto-option').onclick = () => {
            this.closeModal();
            this.processSolanaPayment(packId);
        };

        document.querySelector('.card-option').onclick = () => {
            this.closeModal();
            this.processLemonPayment(packId);
        };

        document.querySelector('.modal-close').onclick = () => this.closeModal();
        document.querySelector('.payment-modal-overlay').onclick = (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        };
    }

    closeModal() {
        const modal = document.querySelector('.payment-modal-overlay');
        if (modal) modal.remove();
        showPointsAnimation('thanks');
    }

    async processSolanaPayment(packId) {
        const pack = this.packConfig[packId];
        const solAmount = this.eurToSol(pack.eur);

        try {
            // 1. Vérifier si Phantom est installé
            if (!window.solana || !window.solana.isPhantom) {
                notify.error('Installe Phantom Wallet!', 'Solana');
                window.open('https://phantom.app/', '_blank');
                return;
            }

            // 2. Connecter le wallet
            notify.info('Connexion à Phantom...', 'Solana');
            await window.solana.connect();

            // 3. Créditer les points
            await this.creditPointsImmediately(packId);

            // 4. Préparer la transaction
            const connection = new Connection('https://api.mainnet-beta.solana.com');
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: window.solana.publicKey,
                    toPubkey: new PublicKey(this.merchantAddress),
                    lamports: solAmount * 1000000000 // SOL → lamports
                })
            );

            // 5. Envoyer la transaction
            const { signature } = await window.solana.signAndSendTransaction(transaction);

            notify.success('Transaction envoyée!', 'Solana');
            console.log('Transaction hash:', signature);

        } catch (error) {
            console.error('Erreur Phantom:', error);

            // Fallback vers instructions manuelles
            if (error.message.includes('User rejected')) {
                notify.info('Transaction annulée', 'Solana');
            } else {
                notify.error('Erreur wallet', 'Utilisation manuelle recommandée');
                this.showSolanaInstructions(packId, solAmount);
            }
        }
    }

    async processLemonPayment(packId) {
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=create_lemon_checkout&pack_id=${packId}`
            });

            const result = await response.json();

            if (result.success) {
                notify.info('Redirection vers le paiement...', 'Carte Bancaire');
                window.location.href = result.checkout_url;
            } else {
                notify.error('Erreur', result.message);
            }
        } catch (error) {
            console.error('Erreur achat:', error);
            notify.error('Erreur réseau', 'Impossible de procéder au paiement');
        }
    }

    async creditPointsImmediately(packId) {
        const pack = this.packConfig[packId];

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=credit_points_immediate&points=${pack.points}`
            });

            const result = await response.json();

            if (result.success) {
                showPointsAnimation(pack.points, `+${pack.points} 💎 crédités !`);
                updateUserPointsDisplay(result.new_balance);
                notify.success(`Pack ${pack.name} acheté !`, 'Succès');
            }
        } catch (error) {
            console.error('Erreur crédit points:', error);
            // Fallback : au moins on montre l'animation
            showPointsAnimation(pack.points, `+${pack.points} 💎 (en attente de validation)`);
        }
    }

    showSolanaInstructions(packId, solAmount) {
        const pack = this.packConfig[packId];

        const modalHTML = `
            <div class="payment-modal-overlay">
                <div class="payment-modal solana-instructions">
                    <div class="modal-header">
                        <h3><i class="fa-solid fa-wallet"></i> Paiement Solana</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    
                    <div class="instructions-content">
                        <div class="success-badge">
                            ✅ Crédités d'avance !
                        </div>

                        <div class="amount-card">
                            <div class="crypto-amount">${solAmount} SOL</div>
                            <div class="fiat-equivalent">≈ ${pack.eur} €</div>
                        </div>

                        <div class="wallet-address">
                            <label>Adresse de réception :</label>
                            <div class="address-box">
                                <code>${this.merchantAddress}</code>
                                <button class="copy-btn"><i class="fa-regular fa-copy"></i></button>
                            </div>
                        </div>

                        <div class="trust-message">
                            <div class="trust-icon">🤝</div>
                            <div class="trust-text">
                                <strong>Merci de votre confiance !</strong><br>
                                Les points ont été crédités en avance.
                            </div>
                        </div>

                        <div class="steps">
                            <div class="step">
                                <span class="step-number">1</span>
                                <span class="step-text">Copie l'adresse Solana</span>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <span class="step-text">Envoie <strong>${solAmount} SOL</strong></span>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span>
                                <span class="step-text">C'est tout ! Points déjà reçus </span>
                            </div>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button class="modal-btn btn-primary">
                            Compris, merci !
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.querySelector('.copy-btn').onclick = () => {
            navigator.clipboard.writeText(this.merchantAddress);
            notify.success('Adresse copiée !', 'Solana');
        };

        document.querySelector('.btn-primary').onclick = () => this.closeModal();
        document.querySelector('.modal-close').onclick = () => this.closeModal();
        document.querySelector('.payment-modal-overlay').onclick = (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        };
    }
}

// ======================================
// INITIALISATION
// ======================================

let paymentSystem;

document.addEventListener('DOMContentLoaded', function () {
    paymentSystem = new UnifiedPaymentSystem();
    paymentSystem.setupPaymentButtons();
    console.log('✅ Système de paiement unifié initialisé');
});

// FIN DU TEST PAYEMENT VIA WALLET SOLANA



// BTN Fonction pour débloquer l'accès au code
async function unlockCodePreview() {
    if (!currentUser) {
        showAuthModal();
        return;
    }

    // Vérifier si déjà débloqué pour ce projet (stockage local)
    const projectHash = generateProjectHash();
    const unlockedProjects = JSON.parse(localStorage.getItem('unlockedProjects') || '[]');

    if (unlockedProjects.includes(projectHash)) {
        // Déjà débloqué, afficher directement
        showCodeEditors();
        return;
    }

    // Vérifier les points
    const pointsCheck = await checkAndDeductPoints('unlock_code');
    if (!pointsCheck.success) {
        notify.error(pointsCheck.message, 'Points insuffisants');

        // Proposition d'acheter des points
        if (confirm("Points insuffisants ! Voulez-vous acheter plus de points ?")) {
            showPointsShop();
        }
        return;
    }

    // Mettre à jour l'affichage des points
    updateUserPointsDisplay(pointsCheck.new_balance);

    // Marquer comme débloqué (SEULEMENT si on a un projectId)
    if (currentProjectId) {
        const projectHash = 'project_' + currentProjectId;
        if (!unlockedProjects.includes(projectHash)) {
            unlockedProjects.push(projectHash);
            localStorage.setItem('unlockedProjects', JSON.stringify(unlockedProjects));
            console.log('🔓 Projet débloqué:', projectHash);
        }
    }
    // Afficher les éditeurs de code
    showCodeEditors();

    notify.success('Code débloqué ! -50 💎', 'Succès');
    showGemsAnimation(50, 'Code débloqué !');
}
// Générer un hash unique basé sur les keyframes actuelles
/* PROBLEME: Si l'utilisateur modifie UNE keyframe, le hash change!Le code ne s'affiche plus !
function generateProjectHash() {
    return btoa(JSON.stringify(keyframes)).substring(0, 16);
}*/
function generateProjectHash() {
    // Si on a un ID de projet sauvegardé, l'utiliser
    if (currentProjectId) {
        return 'project_' + currentProjectId;
    }

    // Sinon, créer un hash basé sur les keyframes + timestamp
    const projectData = {
        keyframes: keyframes,
        timestamp: Math.floor(Date.now() / (1000 * 60 * 60)) // Changera toutes les heures
    };
    return btoa(JSON.stringify(projectData)).substring(0, 16);
}

function showCodeEditors() {
    document.getElementById('code-editors-section').style.display = 'flex';
    document.querySelector('.unlock-code-section').style.display = 'none';
    generateCode(); // Générer le code si pas déjà fait
}

// Vérifier au chargement si le projet est déjà débloqué
function checkUnlockedProjects() {
    if (!currentUser) return;

    const projectHash = generateProjectHash();
    const unlockedProjects = JSON.parse(localStorage.getItem('unlockedProjects') || '[]');

    console.log('🔍 Vérification déblocage:', {
        projectHash,
        currentProjectId,
        unlockedProjects,
        match: unlockedProjects.includes(projectHash)
    });

    if (unlockedProjects.includes(projectHash)) {
        showCodeEditors();
    }
}

// Appeler au chargement
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(checkUnlockedProjects, 1000);
});


// Fonction pour afficher le shop de points
function showPointsShop() {
    // Scroll vers la section points
    document.querySelector('.points-shop').scrollIntoView({
        behavior: 'smooth'
    });
}

// Vérifier le statut après retour de paiement
async function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
        try {
            const response = await fetch(`api.php?action=check_payment&session_id=${sessionId}`);
            const result = await response.json();

            if (result.success) {
                notify.success(`Achat réussi ! +${result.points_added} 💎`, 'Points ajoutés');
                updateUserPointsDisplay(result.new_balance);
                showPointsAnimation('Points ajoutés pour la sauvegarde !');

                // Nettoyer l'URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error('Erreur vérification paiement:', error);
        }
    }
}






// 🪟 Modal
function showAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

// Au chargement
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - currentUser:', currentUser);
    updateUI();
    checkPaymentStatus();

    // Vérifier si on doit charger un projet
    const urlParams = new URLSearchParams(window.location.search);
    const loadProjectId = urlParams.get('load_project');
    if (loadProjectId) {
        setTimeout(() => {
            loadProject(loadProjectId);
        }, 2000);
    }
});

// Notification de mise à jour
notify.success('Vous pourrez bientôt obtenir des packs 💎', 'Mise à jour');

/*
const userName = document.querySelector('meta[name="user-name"]')?.content || 'invité';
notify.success('Vous pourrez bientôt obtenir des packs 💎', `Hey ${userName} !`);*/


// 🖱️ Fermer la modal en cliquant à l'extérieur
document.getElementById('auth-modal').addEventListener('click', function (e) {
    if (e.target === this) closeAuthModal();
});