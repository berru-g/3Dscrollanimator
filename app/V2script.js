/* ====== Intégration éditeur WYSIWYG (non-invasif) ======
   - Se greffe sur la scène existante (variables globales: scene, camera, renderer)
   - Nécessite THREE.TransformControls et THREE.OrbitControls disponibles (ton bootstrap semble déjà gérer ça)
   - N'écrase aucune fonction existante ; expose un objet global minimal: window._3DEditor
   - Usage : appeler _3DEditor.open() ou cliquer le bouton '#open-3d-editor' si ajouté dans DOM
*/
(async function ensureControls() {
  if (!THREE.OrbitControls) {
    const { OrbitControls } = await import('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js');
    THREE.OrbitControls = OrbitControls;
  }
  if (!THREE.TransformControls) {
    const { TransformControls } = await import('https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/TransformControls.js');
    THREE.TransformControls = TransformControls;
  }
})();

(function(){
  if(window._3DEditor) return; // déjà initialisé

  const state = {
    transform: null,
    orbitBackup: null,
    selected: null,
    keyframes: {}, // { objectName: [ {scroll:0..1, pos:[x,y,z], rot:[x,y,z], scale:[x,y,z], ease, duration} ] }
    overlay: null
  };

  // Utilitaire safe : attend que THREE et les variables du moteur existent
  function waitForEngine(cb, tries = 0){
    if(typeof THREE === 'undefined' || typeof scene === 'undefined' || typeof camera === 'undefined' || typeof renderer === 'undefined'){
      if(tries > 200) return console.error('[3DEditor] engine unavailable');
      return setTimeout(()=> waitForEngine(cb, tries+1), 50);
    }
    // TransformControls et OrbitControls doivent être visibles comme THREE.TransformControls / THREE.OrbitControls
    if(typeof THREE.TransformControls === 'undefined' || typeof THREE.OrbitControls === 'undefined'){
      if(tries > 200) return console.error('[3DEditor] three examples modules missing (TransformControls/OrbitControls).');
      return setTimeout(()=> waitForEngine(cb, tries+1), 50);
    }
    cb();
  }

  function buildUI(){
    // overlay container
    const root = document.createElement('div');
    root.id = 'editor-overlay';
    Object.assign(root.style, {
      position:'fixed', inset:'0', zIndex:999999, display:'flex', pointerEvents:'auto', background:'rgba(0,0,0,0.35)'
    });

    // left: canvas area (we reuse renderer.domElement)
    const left = document.createElement('div');
    left.style.flex = '1';
    left.style.position = 'relative';
    left.style.display = 'flex';
    left.style.alignItems = 'stretch';

    // right: sidebar
    const right = document.createElement('div');
    right.style.width = '360px';
    right.style.background = '#0f1116';
    right.style.color = '#dfe6ff';
    right.style.padding = '12px';
    right.style.boxSizing = 'border-box';
    right.style.overflow = 'auto';

    right.innerHTML = '<h3 style="margin-top:0">Éditeur 3D</h3>' +
      '<div id="editor-selected">Aucun objet sélectionné</div>' +
      '<div style="margin-top:8px">' +
        '<button id="editor-add-kf">Ajouter keyframe (position actuelle)</button> ' +
        '<button id="editor-apply">Appliquer au generator</button> ' +
        '<button id="editor-close">Fermer</button>' +
      '</div>' +
      '<hr style="border-color:#232533;margin:12px 0" />' +
      '<div id="editor-kflist"><em>Aucun keyframe</em></div>';

    root.appendChild(left);
    root.appendChild(right);

    // attach overlay to body
    document.body.appendChild(root);
    state.overlay = root;

    // move renderer.domElement into left area
    const canvasParent = renderer.domElement.parentElement;
    // keep a reference to reattach later
    state._origCanvasParent = canvasParent;
    // place renderer.domElement into left
    left.appendChild(renderer.domElement);

    // wire buttons
    right.querySelector('#editor-close').addEventListener('click', closeEditor);
    right.querySelector('#editor-add-kf').addEventListener('click', ()=> addKeyframeForSelected());
    right.querySelector('#editor-apply').addEventListener('click', ()=> {
      applyToGenerator();
      // small visual ack
      try{ right.querySelector('#editor-apply').textContent = 'Appliqué ✓'; setTimeout(()=> right.querySelector('#editor-apply').textContent='Appliquer au generator', 900); }catch(e){}
    });

    return {root, left, right};
  }

  function openEditor(){
    if(state.overlay) return; // déjà ouvert
    const ui = buildUI();

    // create TransformControls and attach to scene
    state.transform = new THREE.TransformControls(camera, renderer.domElement);
    scene.add(state.transform);

    // allow orbit control but keep a backup if exists on page
    if(window._existingOrbitControlsInstance){
      state.orbitBackup = window._existingOrbitControlsInstance;
      state.orbitBackup.enabled = false;
    } else {
      // fallback: create a local orbit so user can navigate with middle mouse while editing
      state.orbitBackup = new THREE.OrbitControls(camera, renderer.domElement);
      // keep it in state so we can dispose later
      state._localOrbit = state.orbitBackup;
    }

    // selection via raycast on pointerdown
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function onPointerDown(e){
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      // ignore transform gizmo meshes
      const intersects = raycaster.intersectObjects(scene.children, true).filter(i=> i.object !== state.transform);
      if(intersects.length){
        selectObject(intersects[0].object);
      }
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    state._onPointerDown = onPointerDown;

    // when transform is dragging, disable orbit
    state.transform.addEventListener('dragging-changed', function(event){
      if(state._localOrbit) state._localOrbit.enabled = !event.value;
      if(state.orbitBackup && state.orbitBackup !== state._localOrbit) state.orbitBackup.enabled = !event.value;
    });

    // render loop continues using existing animate; no new loop created

    // helper: if no objects in scene, create a fallback cube (non-destructive)
    if(scene.children.filter(c=> c.type === 'Mesh').length === 0){
      const geo = new THREE.BoxGeometry(1,1,1);
      const mat = new THREE.MeshStandardMaterial({color:0x5588ff});
      const cube = new THREE.Mesh(geo, mat); cube.name = 'fallback-box';
      scene.add(cube);
    }

    // small info
    updateSidebarSelected();
  }

  function closeEditor(){
    if(!state.overlay) return;
    // reattach canvas to original parent
    if(state._origCanvasParent) state._origCanvasParent.appendChild(renderer.domElement);
    // remove overlay DOM
    state.overlay.remove();
    state.overlay = null;
    // remove transform
    if(state.transform){
      try{ scene.remove(state.transform); state.transform.dispose && state.transform.dispose(); }catch(e){}
      state.transform = null;
    }
    // restore orbit
    if(state._localOrbit){ state._localOrbit.dispose && state._localOrbit.dispose(); state._localOrbit = null; }
    if(state.orbitBackup) state.orbitBackup.enabled = true;
    // unbind pointer
    if(state._onPointerDown) renderer.domElement.removeEventListener('pointerdown', state._onPointerDown);
  }

  function selectObject(obj){
    state.selected = obj;
    if(state.transform) state.transform.attach(obj);
    updateSidebarSelected();
    renderKeyframesList();
  }

  function updateSidebarSelected(){
    if(!state.overlay) return;
    const selLabel = state.overlay.querySelector('#editor-selected');
    if(!selLabel) return;
    selLabel.textContent = state.selected ? ('Sélection: ' + (state.selected.name || state.selected.uuid)) : 'Aucun objet sélectionné';
  }

  function addKeyframeForSelected(scrollPercent){
    const o = state.selected;
    if(!o) return alert('Aucun objet sélectionné');
    const name = o.name || o.uuid;
    state.keyframes[name] = state.keyframes[name] || [];
    const p = typeof scrollPercent === 'number' ? (scrollPercent/100) : (parseFloat(prompt('Position de scroll en % (0-100)', '50')) || 50)/100;
    const kf = {
      scroll: isNaN(p)?0:p,
      pos: [o.position.x, o.position.y, o.position.z],
      rot: [o.rotation.x, o.rotation.y, o.rotation.z],
      scale: [o.scale.x, o.scale.y, o.scale.z],
      ease: 'power1.inOut',
      duration: 1
    };
    state.keyframes[name].push(kf);
    renderKeyframesList();
  }

  function renderKeyframesList(){
    if(!state.overlay) return;
    const container = state.overlay.querySelector('#editor-kflist');
    if(!container) return;
    container.innerHTML = '';
    if(!state.selected) return container.innerHTML = '<em>Aucun objet sélectionné</em>';
    const kfs = state.keyframes[state.selected.name || state.selected.uuid] || [];
    if(!kfs.length) return container.innerHTML = '<em>Aucun keyframe</em>';
    kfs.forEach((kf, i)=>{
      const el = document.createElement('div');
      el.style.marginBottom = '8px';
      el.style.padding = '6px';
      el.style.background = '#0b0d12';
      el.style.border = '1px solid #222432';
      el.innerHTML = `<div style="font-size:13px">#${i+1} — ${(kf.scroll*100).toFixed(1)}%</div>
        <div style="font-size:11px;color:#9aa0c8">pos: ${kf.pos?kf.pos.join(','):kf.pos}</div>
        <div style="margin-top:6px"><button data-i="${i}" class="del-kf">Suppr</button></div>`;
      el.querySelector('.del-kf').addEventListener('click', ()=>{
        kfs.splice(i,1); renderKeyframesList();
      });
      container.appendChild(el);
    });
  }

  function applyToGenerator(){
    // Tentative non-invasive injection : essaye plusieurs points d'accroche connus
    const movements = state.keyframes;
    // 1) fonction publique existante
    if(window._scriptV2 && typeof window._scriptV2.setMovements === 'function'){
      try{ window._scriptV2.setMovements(movements); return true; }catch(e){ console.warn(e); }
    }
    // 2) objet global generatorConfig.movements
    if(window.generatorConfig){
      window.generatorConfig.movements = movements;
      if(typeof window.updateGeneratedSnippet === 'function') window.updateGeneratedSnippet();
      return true;
    }
    // 3) élément #generated-snippet : heuristique de remplacement
    const pre = document.querySelector('#generated-snippet');
    if(pre){
      const json = JSON.stringify(movements, null, 2);
      // on tente de remplacer une clé "movements" si présente, sinon on affiche le JSON dans un modal/prompt
      if(/movements\s*[:=]/.test(pre.textContent)){
        pre.textContent = pre.textContent.replace(/(movements\s*[:=]\s*)(\{[\s\S]*?\})/, `$1${json}`);
        return true;
      } else {
        // pas d'injection sûre -> afficher pour copier
        prompt('Copie ce JSON et colle-le dans ta config mouvements :', json);
        return false;
      }
    }
    // fallback : afficher JSON à copier
    prompt('Aucun point d\'injection trouvé automatiquement. Copie ce JSON:', JSON.stringify(movements, null, 2));
    return false;
  }

  // expose API minimale
  window._3DEditor = {
    open: function(){ waitForEngine(openEditor); },
    close: closeEditor,
    addKeyframeForSelected: function(pct){ addKeyframeForSelected(pct); },
    getMovementsJSON: function(){ return JSON.stringify(state.keyframes, null, 2); },
    applyToGenerator: applyToGenerator
  };

  // Optionnel : ajoute un bouton flottant minimal si page contient #viewer (ton viewer)
  const viewerEl = document.getElementById('viewer');
  if(viewerEl){
    const btn = document.createElement('button');
    btn.id = 'open-3d-editor';
    btn.textContent = 'Éditer 3D';
    Object.assign(btn.style, {
      position:'absolute', right:'12px', bottom:'12px', zIndex:99999, padding:'8px 10px',
      background:'#1f2937', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer'
    });
    // append inside viewer if possible
    try{ viewerEl.style.position = 'relative'; viewerEl.appendChild(btn); }catch(e){ document.body.appendChild(btn); }
    btn.addEventListener('click', ()=> waitForEngine(openEditor));
  }

})();
