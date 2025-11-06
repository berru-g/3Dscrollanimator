<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Générateur Curseur Animé 3D</title>
    <style>
        :root {
            --white: #f1f1f1;
            --text: #cdd6f4;
            --dark: #151517;
            --grey: #1b1b1c;
            --grey-light: #2c2c2e;
            --primary: #ab9ff2;
            --rose: #cba6f7;
            --rose2: #f5c2e7;
            --violet2: #cba6f7;
            --border: #dcdcdc;
            --shadow: rgba(0, 0, 0, 0.1);
            --input: #f9f9f9;
            --secondary: #2575fc;
            --success: #60d394;
            --error: #ee6055;
            --jaune: #ffd97d;
        }

        @import url('https://fonts.googleapis.com/css?family=Muli&display=swap');
        @import url('https://fonts.googleapis.com/css?family=Quicksand&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Muli', sans-serif;
        }

        body {
            background: var(--dark);
            color: var(--text);
            line-height: 1.6;
            cursor: none;
        }

        .container {
            display: grid;
            grid-template-columns: 400px 1fr;
            height: 100vh;
            gap: 20px;
            padding: 20px;
        }

        /* Panel de configuration */
        .config-panel {
            background: var(--grey);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 30px var(--shadow);
            overflow-y: auto;
        }

        .config-group {
            margin-bottom: 30px;
            padding: 20px;
            background: var(--grey-light);
            border-radius: 12px;
        }

        .config-group h3 {
            color: var(--primary);
            margin-bottom: 15px;
            font-size: 1.1em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: var(--text);
            font-weight: 500;
        }

        input[type="color"],
        input[type="range"],
        input[type="number"],
        select {
            width: 100%;
            padding: 10px;
            border: 2px solid var(--border);
            border-radius: 8px;
            background: var(--input);
            color: var(--dark);
            font-size: 14px;
        }

        input[type="range"] {
            padding: 0;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .checkbox-group input {
            width: auto;
        }

        /* Zone de code */
        .code-area {
            background: var(--grey-light);
            border-radius: 20px;
            padding: 30px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .code-header h2 {
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .copy-btn {
            background: var(--primary);
            color: var(--dark);
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .copy-btn:hover {
            background: var(--rose);
            transform: translateY(-2px);
        }

        .code-output {
            background: var(--dark);
            border-radius: 12px;
            padding: 25px;
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            flex: 1;
            border: 1px solid var(--border);
            line-height: 1.4;
            position: relative;
        }

        .code-container {
            position: relative;
            flex: 1;
        }

        .copy-icon {
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--grey-light);
            border: none;
            color: var(--text);
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .copy-icon:hover {
            background: var(--primary);
            color: var(--dark);
        }

        /* Curseurs personnalisés avec effets 3D */
        .cursor-dot {
            width: 8px;
            height: 8px;
            background-color: var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        }

        .cursor-circle {
            width: 30px;
            height: 30px;
            border: 2px solid var(--rose);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transition: all 0.2s ease-out;
        }

        .cursor-3d {
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, var(--primary), var(--rose));
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 20px var(--primary);
            transition: all 0.15s ease;
        }

        .cursor-hologram {
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            box-shadow:
                0 0 10px var(--primary),
                inset 0 0 10px var(--primary);
            animation: hologram 2s infinite linear;
        }

        .cursor-particles {
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--jaune);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
        }

        @keyframes hologram {
            0% {
                opacity: 0.7;
                transform: scale(1) rotate(0deg);
            }

            50% {
                opacity: 1;
                transform: scale(1.1) rotate(180deg);
            }

            100% {
                opacity: 0.7;
                transform: scale(1) rotate(360deg);
            }
        }

        .cursor-neon {
            width: 25px;
            height: 25px;
            border: 2px solid var(--success);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            box-shadow:
                0 0 10px var(--success),
                0 0 20px var(--success),
                0 0 30px var(--success);
            animation: neon-pulse 1.5s infinite alternate;
        }

        @keyframes neon-pulse {
            from {
                box-shadow: 0 0 10px var(--success), 0 0 20px var(--success);
            }

            to {
                box-shadow: 0 0 15px var(--success), 0 0 30px var(--success), 0 0 40px var(--success);
            }
        }

        /* Preview minimale */
        .mini-preview {
            background: var(--grey);
            padding: 20px;
            border-radius: 12px;
            margin-top: 10px;
            text-align: center;
        }

        .mini-preview p {
            color: var(--text);
            opacity: 0.8;
            font-size: 0.9em;
        }
    </style>
</head>

<body>
    <?php require_once __DIR__ . '/header.php'; ?>
    <div class="container">
        <!-- Panel de configuration -->
        <div class="config-panel">
            <h2
                style="color: var(--primary); margin-bottom: 30px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-magic"></i>Générateur de Curseur 3D
            </h2>

            <!-- Type de curseur -->
            <div class="config-group">
                <h3><i class="fas fa-mouse-pointer"></i>Type de Curseur</h3>
                <div class="form-group">
                    <label for="cursorType">Style principal</label>
                    <select id="cursorType">
                        <option value="dot-circle">Point + Cercle Classique</option>
                        <option value="dot-only">Point Simple</option>
                        <option value="circle-only">Cercle Simple</option>
                        <option value="3d-sphere">Sphère 3D</option>
                        <option value="hologram">Hologramme Rotatif</option>
                        <option value="neon-glow">Effet Néon</option>
                        <option value="magnetic">Curseur Magnétique</option>
                        <option value="trail">Effet de Traînée</option>
                    </select>
                </div>
                <div class="mini-preview">
                    <p><i class="fas fa-info-circle"></i> Déplace ta souris pour prévisualiser</p>
                </div>
            </div>

            <!-- Couleurs -->
            <div class="config-group">
                <h3><i class="fas fa-palette"></i>Couleurs & Apparence</h3>
                <div class="form-group">
                    <label for="dotColor">Couleur principale</label>
                    <input type="color" id="dotColor" value="#ab9ff2">
                </div>
                <div class="form-group">
                    <label for="circleColor">Couleur secondaire</label>
                    <input type="color" id="circleColor" value="#cba6f7">
                </div>
                <div class="form-group">
                    <label for="accentColor">Couleur d'accent</label>
                    <input type="color" id="accentColor" value="#ffd97d">
                </div>
                <div class="form-group">
                    <label for="glowColor">Couleur de lueur</label>
                    <input type="color" id="glowColor" value="#60d394">
                </div>
            </div>

            <!-- Tailles et dimensions -->
            <div class="config-group">
                <h3><i class="fas fa-arrows-alt"></i>Dimensions</h3>
                <div class="form-group">
                    <label for="dotSize">Taille du point (px)</label>
                    <input type="range" id="dotSize" min="4" max="20" value="8">
                </div>
                <div class="form-group">
                    <label for="circleSize">Taille du cercle (px)</label>
                    <input type="range" id="circleSize" min="20" max="60" value="30">
                </div>
                <div class="form-group">
                    <label for="glowIntensity">Intensité de la lueur</label>
                    <input type="range" id="glowIntensity" min="0" max="20" value="10">
                </div>
            </div>

            <!-- Animations et effets -->
            <div class="config-group">
                <h3><i class="fas fa-sparkles"></i>Animations & Effets</h3>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="clickAnimation" checked>
                    <label for="clickAnimation">Animation au clic</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="hoverEffect">
                    <label for="hoverEffect">Effet au survol des éléments</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="magneticEffect">
                    <label for="magneticEffect">Effet magnétique</label>
                </div>
                <div class="form-group">
                    <label for="animationSpeed">Vitesse d'animation</label>
                    <input type="range" id="animationSpeed" min="0.1" max="1" step="0.1" value="0.2">
                </div>
                <div class="form-group">
                    <label for="trailLength">Longueur de traînée</label>
                    <input type="range" id="trailLength" min="1" max="20" value="5">
                </div>
            </div>

            <!-- Options avancées -->
            <div class="config-group">
                <h3><i class="fas fa-cogs"></i>Options Avancées</h3>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="hideDefault" checked>
                    <label for="hideDefault">Cacher le curseur par défaut</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="particles">
                    <label for="particles">Effet de particules</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="pulseEffect">
                    <label for="pulseEffect">Effet de pulsation</label>
                </div>
                <div class="form-group checkbox-group">
                    <input type="checkbox" id="smoothMovement">
                    <label for="smoothMovement">Mouvement fluide</label>
                </div>
            </div>
        </div>

        <!-- Zone de code -->
        <div class="code-area">
            <div class="code-header">
                <h2><i class="fas fa-code"></i>Code Généré</h2>
                <button class="copy-btn" onclick="copyCode()">
                    <i class="far fa-copy"></i>Copier le Code
                </button>
            </div>

            <div class="code-container">
                <button class="copy-icon" onclick="copyCode()" title="Copier le code">
                    <i class="far fa-copy"></i>
                </button>
                <div class="code-output" id="generatedCode">
                    <!-- Le code sera généré ici -->
                </div>
            </div>

            <div class="mini-preview">
                <p><i class="fas fa-lightbulb"></i> <strong>Instructions :</strong> Copiez le code et collez-le dans
                    votre site web. Le CSS va dans le &lt;head&gt; et le JavaScript à la fin du &lt;body&gt;</p>
            </div>
        </div>
    </div>

    <script>
        // Éléments DOM
        const config = {
            cursorType: document.getElementById('cursorType'),
            dotColor: document.getElementById('dotColor'),
            circleColor: document.getElementById('circleColor'),
            accentColor: document.getElementById('accentColor'),
            glowColor: document.getElementById('glowColor'),
            dotSize: document.getElementById('dotSize'),
            circleSize: document.getElementById('circleSize'),
            glowIntensity: document.getElementById('glowIntensity'),
            clickAnimation: document.getElementById('clickAnimation'),
            hoverEffect: document.getElementById('hoverEffect'),
            magneticEffect: document.getElementById('magneticEffect'),
            animationSpeed: document.getElementById('animationSpeed'),
            trailLength: document.getElementById('trailLength'),
            hideDefault: document.getElementById('hideDefault'),
            particles: document.getElementById('particles'),
            pulseEffect: document.getElementById('pulseEffect'),
            smoothMovement: document.getElementById('smoothMovement')
        };

        // Éléments curseur
        let cursorDot, cursorCircle, cursor3d, cursorHologram, cursorNeon, trails = [], particles = [];

        // Initialisation
        function initCursors() {
            // Création des éléments
            cursorDot = document.createElement('div');
            cursorCircle = document.createElement('div');
            cursor3d = document.createElement('div');
            cursorHologram = document.createElement('div');
            cursorNeon = document.createElement('div');

            cursorDot.className = 'cursor-dot';
            cursorCircle.className = 'cursor-circle';
            cursor3d.className = 'cursor-3d';
            cursorHologram.className = 'cursor-hologram';
            cursorNeon.className = 'cursor-neon';

            document.body.appendChild(cursorDot);
            document.body.appendChild(cursorCircle);
            document.body.appendChild(cursor3d);
            document.body.appendChild(cursorHologram);
            document.body.appendChild(cursorNeon);

            // Événements
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);

            updateCursor();
            updateCode();
        }

        function onMouseMove(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Mise à jour position des curseurs
            updateCursorPosition(mouseX, mouseY);

            // Effets spéciaux
            if (config.cursorType.value === 'trail') {
                createTrail(mouseX, mouseY);
            }

            if (config.particles.checked) {
                createParticles(mouseX, mouseY);
            }

            if (config.magneticEffect.checked) {
                applyMagneticEffect(e);
            }
        }

        function updateCursorPosition(x, y) {
            const dotSize = parseInt(config.dotSize.value);
            const circleSize = parseInt(config.circleSize.value);

            cursorDot.style.left = x - dotSize / 2 + 'px';
            cursorDot.style.top = y - dotSize / 2 + 'px';

            cursor3d.style.left = x - 10 + 'px';
            cursor3d.style.top = y - 10 + 'px';

            cursorHologram.style.left = x - 20 + 'px';
            cursorHologram.style.top = y - 20 + 'px';

            cursorNeon.style.left = x - 12.5 + 'px';
            cursorNeon.style.top = y - 12.5 + 'px';

            // Animation fluide pour le cercle
            if (config.smoothMovement.checked) {
                setTimeout(() => {
                    cursorCircle.style.left = x - circleSize / 2 + 'px';
                    cursorCircle.style.top = y - circleSize / 2 + 'px';
                }, 50 * parseFloat(config.animationSpeed.value));
            } else {
                cursorCircle.style.left = x - circleSize / 2 + 'px';
                cursorCircle.style.top = y - circleSize / 2 + 'px';
            }
        }

        function onMouseDown() {
            if (config.clickAnimation.checked) {
                cursorDot.style.transform = 'scale(1.5)';
                cursorCircle.style.transform = 'scale(0.8)';
                cursor3d.style.transform = 'scale(1.3)';
                cursorNeon.style.transform = 'scale(1.2)';
            }
        }

        function onMouseUp() {
            cursorDot.style.transform = 'scale(1)';
            cursorCircle.style.transform = 'scale(1)';
            cursor3d.style.transform = 'scale(1)';
            cursorNeon.style.transform = 'scale(1)';
        }

        function createTrail(x, y) {
            const trail = document.createElement('div');
            trail.className = 'cursor-particles';
            trail.style.left = x - 2 + 'px';
            trail.style.top = y - 2 + 'px';
            trail.style.background = config.accentColor.value;

            document.body.appendChild(trail);
            trails.push(trail);

            setTimeout(() => {
                if (trail.parentNode) trail.parentNode.removeChild(trail);
                trails = trails.filter(t => t !== trail);
            }, 500);
        }

        function createParticles(x, y) {
            if (Math.random() > 0.7) {
                const particle = document.createElement('div');
                particle.className = 'cursor-particles';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = config.glowColor.value;
                particle.style.transform = `scale(${Math.random() * 1.5})`;

                document.body.appendChild(particle);
                particles.push(particle);

                // Animation particule
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 3;
                let life = 1;

                const animateParticle = () => {
                    life -= 0.02;
                    if (life <= 0) {
                        if (particle.parentNode) particle.parentNode.removeChild(particle);
                        particles = particles.filter(p => p !== particle);
                        return;
                    }

                    particle.style.opacity = life;
                    particle.style.left = parseFloat(particle.style.left) + Math.cos(angle) * speed + 'px';
                    particle.style.top = parseFloat(particle.style.top) + Math.sin(angle) * speed + 'px';

                    requestAnimationFrame(animateParticle);
                };
                animateParticle();
            }
        }

        function applyMagneticEffect(e) {
            const magneticElements = document.querySelectorAll('button, input, select, .config-group');
            magneticElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    const moveX = (centerX - e.clientX) * force * 0.1;
                    const moveY = (centerY - e.clientY) * force * 0.1;

                    cursorDot.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.3})`;
                    cursorCircle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.2})`;
                }
            });
        }

        function updateCursor() {
            const type = config.cursorType.value;

            // Masquer tous les curseurs
            [cursorDot, cursorCircle, cursor3d, cursorHologram, cursorNeon].forEach(cursor => {
                cursor.style.display = 'none';
            });

            // Afficher les curseurs sélectionnés
            switch (type) {
                case 'dot-circle':
                    cursorDot.style.display = 'block';
                    cursorCircle.style.display = 'block';
                    break;
                case 'dot-only':
                    cursorDot.style.display = 'block';
                    break;
                case 'circle-only':
                    cursorCircle.style.display = 'block';
                    break;
                case '3d-sphere':
                    cursor3d.style.display = 'block';
                    break;
                case 'hologram':
                    cursorHologram.style.display = 'block';
                    break;
                case 'neon-glow':
                    cursorNeon.style.display = 'block';
                    break;
                case 'trail':
                    cursorDot.style.display = 'block';
                    break;
            }

            // Appliquer les couleurs
            cursorDot.style.background = config.dotColor.value;
            cursorCircle.style.borderColor = config.circleColor.value;
            cursor3d.style.background = `linear-gradient(45deg, ${config.dotColor.value}, ${config.circleColor.value})`;
            cursor3d.style.boxShadow = `0 0 ${config.glowIntensity.value}px ${config.glowColor.value}`;
            cursorHologram.style.borderColor = config.accentColor.value;
            cursorHologram.style.boxShadow = `0 0 10px ${config.accentColor.value}, inset 0 0 10px ${config.accentColor.value}`;
            cursorNeon.style.borderColor = config.glowColor.value;
            cursorNeon.style.boxShadow = `0 0 10px ${config.glowColor.value}, 0 0 20px ${config.glowColor.value}`;

            // Tailles
            cursorDot.style.width = config.dotSize.value + 'px';
            cursorDot.style.height = config.dotSize.value + 'px';
            cursorCircle.style.width = config.circleSize.value + 'px';
            cursorCircle.style.height = config.circleSize.value + 'px';

            // Curseur par défaut
            document.body.style.cursor = config.hideDefault.checked ? 'none' : 'auto';
        }

        function updateCode() {
            const code = generateCode();
            document.getElementById('generatedCode').textContent = code;
        }

        function generateCode() {
            return `/* CSS Personnalisé pour le Curseur */
<style>
.cursor-dot {
    width: ${config.dotSize.value}px;
    height: ${config.dotSize.value}px;
    background-color: ${config.dotColor.value};
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
}

.cursor-circle {
    width: ${config.circleSize.value}px;
    height: ${config.circleSize.value}px;
    border: 2px solid ${config.circleColor.value};
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: all 0.2s ease-out;
}

${config.hideDefault.checked ? 'body { cursor: none; }' : ''}

/* Effets 3D et Animations */
.cursor-3d {
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, ${config.dotColor.value}, ${config.circleColor.value});
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 0 ${config.glowIntensity.value}px ${config.glowColor.value};
    transition: all 0.15s ease;
}

.cursor-hologram {
    width: 40px;
    height: 40px;
    border: 2px solid ${config.accentColor.value};
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    box-shadow: 
        0 0 10px ${config.accentColor.value},
        inset 0 0 10px ${config.accentColor.value};
    animation: hologram 2s infinite linear;
}

.cursor-neon {
    width: 25px;
    height: 25px;
    border: 2px solid ${config.glowColor.value};
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 
        0 0 10px ${config.glowColor.value},
        0 0 20px ${config.glowColor.value};
    animation: neon-pulse 1.5s infinite alternate;
}

@keyframes hologram {
    0% { opacity: 0.7; transform: scale(1) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.1) rotate(180deg); }
    100% { opacity: 0.7; transform: scale(1) rotate(360deg); }
}

@keyframes neon-pulse {
    from { box-shadow: 0 0 10px ${config.glowColor.value}, 0 0 20px ${config.glowColor.value}; }
    to { box-shadow: 0 0 15px ${config.glowColor.value}, 0 0 30px ${config.glowColor.value}, 0 0 40px ${config.glowColor.value}; }
}
</style>

<!-- JavaScript pour l'animation du curseur -->
<script>
// Initialisation des curseurs
const cursorDot = document.createElement('div');
const cursorCircle = document.createElement('div');
const cursor3d = document.createElement('div');
const cursorHologram = document.createElement('div');
const cursorNeon = document.createElement('div');

cursorDot.className = 'cursor-dot';
cursorCircle.className = 'cursor-circle';
cursor3d.className = 'cursor-3d';
cursorHologram.className = 'cursor-hologram';
cursorNeon.className = 'cursor-neon';

document.body.appendChild(cursorDot);
document.body.appendChild(cursorCircle);
document.body.appendChild(cursor3d);
document.body.appendChild(cursorHologram);
document.body.appendChild(cursorNeon);

// Variables pour le mouvement
let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;

// Événement de mouvement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Mise à jour directe
    cursorDot.style.left = (mouseX - ${parseInt(config.dotSize.value) / 2}) + 'px';
    cursorDot.style.top = (mouseY - ${parseInt(config.dotSize.value) / 2}) + 'px';
    
    cursor3d.style.left = (mouseX - 10) + 'px';
    cursor3d.style.top = (mouseY - 10) + 'px';
    
    cursorHologram.style.left = (mouseX - 20) + 'px';
    cursorHologram.style.top = (mouseY - 20) + 'px';
    
    cursorNeon.style.left = (mouseX - 12.5) + 'px';
    cursorNeon.style.top = (mouseY - 12.5) + 'px';
});

// Animation fluide pour le cercle
${config.smoothMovement.checked ? `
function animateCursor() {
    circleX += (mouseX - circleX) * ${config.animationSpeed.value};
    circleY += (mouseY - circleY) * ${config.animationSpeed.value};
    cursorCircle.style.left = (circleX - ${parseInt(config.circleSize.value) / 2}) + 'px';
    cursorCircle.style.top = (circleY - ${parseInt(config.circleSize.value) / 2}) + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();` : ''}

// Animations au clic
${config.clickAnimation.checked ? `
document.addEventListener('mousedown', () => {
    cursorDot.style.transform = 'scale(1.5)';
    cursorCircle.style.transform = 'scale(0.8)';
    cursor3d.style.transform = 'scale(1.3)';
    cursorNeon.style.transform = 'scale(1.2)';
});

document.addEventListener('mouseup', () => {
    cursorDot.style.transform = 'scale(1)';
    cursorCircle.style.transform = 'scale(1)';
    cursor3d.style.transform = 'scale(1)';
    cursorNeon.style.transform = 'scale(1)';
});` : ''}

// Masquer les curseurs non utilisés selon le type sélectionné
const cursorType = '${config.cursorType.value}';
[cursorDot, cursorCircle, cursor3d, cursorHologram, cursorNeon].forEach(c => c.style.display = 'none');

switch(cursorType) {
    case 'dot-circle':
        cursorDot.style.display = 'block';
        cursorCircle.style.display = 'block';
        break;
    case 'dot-only':
        cursorDot.style.display = 'block';
        break;
    case 'circle-only':
        cursorCircle.style.display = 'block';
        break;
    case '3d-sphere':
        cursor3d.style.display = 'block';
        break;
    case 'hologram':
        cursorHologram.style.display = 'block';
        break;
    case 'neon-glow':
        cursorNeon.style.display = 'block';
        break;
}
<\/script>`;
        }

        function copyCode() {
            const code = document.getElementById('generatedCode').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const btn = document.querySelector('.copy-btn');
                const icon = document.querySelector('.copy-icon');
                btn.innerHTML = '<i class="fas fa-check"></i>Copié !';
                icon.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    btn.innerHTML = '<i class="far fa-copy"></i>Copier le Code';
                    icon.innerHTML = '<i class="far fa-copy"></i>';
                }, 2000);
            });
        }

        // Écouteurs d'événements
        Object.values(config).forEach(input => {
            input.addEventListener('input', () => {
                updateCursor();
                updateCode();
            });
        });

        // Initialisation
        initCursors();
    </script>

</body>

</html>