import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ModelManager, OrbitControls } from '@wowserhq/scene';

export const RACE_MODEL_PATHS: Record<string, string> = {
  human_male:      'character/human/male/human_male.m2',
  human_female:    'character/human/female/human_female.m2',
  orc_male:        'character/orc/male/orc_male.m2',
  orc_female:      'character/orc/female/orc_female.m2',
  dwarf_male:      'character/dwarf/male/dwarf_male.m2',
  dwarf_female:    'character/dwarf/female/dwarf_female.m2',
  nightelf_male:   'character/nightelf/male/nightelf_male.m2',
  nightelf_female: 'character/nightelf/female/nightelf_female.m2',
  undead_male:     'character/scourge/male/scourge_male.m2',
  undead_female:   'character/scourge/female/scourge_female.m2',
  tauren_male:     'character/tauren/male/tauren_male.m2',
  tauren_female:   'character/tauren/female/tauren_female.m2',
  gnome_male:      'character/gnome/male/gnome_male.m2',
  gnome_female:    'character/gnome/female/gnome_female.m2',
  troll_male:      'character/troll/male/troll_male.m2',
  troll_female:    'character/troll/female/troll_female.m2',
  bloodelf_male:   'character/bloodelf/male/bloodelf_male.m2',
  bloodelf_female: 'character/bloodelf/female/bloodelf_female.m2',
  draenei_male:    'character/draenei/male/draenei_male.m2',
  draenei_female:  'character/draenei/female/draenei_female.m2',
};

const HOST = {
  baseUrl: 'https://wow.zamimg.com/modelviewer/live/files/',
  normalizePath: true,
};

interface WowModelViewerProps {
  avatarId: string;
  width?: number;
  height?: number;
}

export function WowModelViewer({ avatarId, width = 340, height = 460 }: WowModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const modelPath = RACE_MODEL_PATHS[avatarId];

  useEffect(() => {
    if (!canvasRef.current || !modelPath) return;
    setStatus('loading');

    const canvas = canvasRef.current;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    console.log('[WowModel] Renderer created, canvas size:', canvas.width, canvas.height);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // Debug: add a red cube to confirm renderer works
    const debugCube = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    scene.add(debugCube);

    // ── Camera ────────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.01, 1000);
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0, 0);

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(2, 4, 3);
    scene.add(dir);

    // ── Controls ──────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // ── ModelManager ─────────────────────────────────────────────────────────
    const modelManager = new ModelManager({ host: HOST });
    console.log('[WowModel] Loading:', HOST.baseUrl + modelPath);

    let animId: number;
    let loadedModel: any = null;

    modelManager.get(modelPath).then((model: any) => {
      console.log('[WowModel] Model loaded OK:', model);
      console.log('[WowModel] BoundingBox:', model.boundingBox);
      console.log('[WowModel] Model position:', model.position);
      console.log('[WowModel] Model scale:', model.scale);

      // Remove debug cube
      scene.remove(debugCube);

      scene.add(model);
      loadedModel = model;

      // Fit camera to bounding box
      const box: THREE.Box3 = model.boundingBox ?? new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      console.log('[WowModel] center:', center, 'size:', size);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = (camera.fov * Math.PI) / 180;
      const dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.5;

      camera.position.set(center.x, center.y, center.z + dist);
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();

      setStatus('ok');
    }).catch((err: any) => {
      console.error('[WowModel] Load error:', err);
      setErrorMsg(String(err?.message ?? err));
      setStatus('error');
    });

    // ── Render loop ───────────────────────────────────────────────────────────
    let prev = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = (now - prev) / 1000;
      prev = now;

      debugCube.rotation.y += 0.01; // spins while loading

      try { modelManager.update(delta, camera); } catch (_) {}
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      loadedModel?.dispose?.();
    };
  }, [modelPath, width, height]);

  if (!modelPath) return null;

  return (
    <div className="relative" style={{ width, height }}>
      <canvas ref={canvasRef} style={{ display: 'block', width, height }} />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#86b518] border-t-transparent rounded-full animate-spin" />
            <span className="text-[0.7rem] text-[#555]">Cargando modelo...</span>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[0.75rem] text-[#ff6b6b] px-4 text-center">{errorMsg || 'Error al cargar el modelo'}</p>
        </div>
      )}
    </div>
  );
}
