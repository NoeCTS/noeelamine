import { useRef, useMemo, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Lerp helpers
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (c1: THREE.Color, c2: THREE.Color, t: number) => {
  return new THREE.Color().lerpColors(c1, c2, t);
};

// 1. Concrete Texture with Noise
function createConcreteTexture() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#8c8c8c';
  ctx.fillRect(0, 0, size, size);
  
  for (let i = 0; i < 200000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#707070' : '#a0a0a0';
    ctx.globalAlpha = 0.15;
    const x = Math.random() * size;
    const y = Math.random() * size;
    const w = Math.random() * 3;
    const h = Math.random() * 3;
    ctx.fillRect(x, y, w, h);
  }
  
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#404040';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const w = Math.random() * 20 + 5;
    ctx.fillRect(x, 0, w, size);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Sphere Panel Texture (Metal plates + Windows)
function createSphereTexture() {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#A0A0A0');
  gradient.addColorStop(0.5, '#D0D0D0');
  gradient.addColorStop(1, '#A0A0A0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  
  const cols = 60;
  const rows = 30;
  const colStep = width / cols;
  const rowStep = height / rows;
  
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * colStep, 0);
    ctx.lineTo(i * colStep, height);
    ctx.stroke();
  }
  
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * rowStep);
    ctx.lineTo(width, i * rowStep);
    ctx.stroke();
  }
  
  ctx.globalAlpha = 1.0;
  
  function drawWindowRow(yRatioStart: number, heightRatio: number, numWindows: number) {
    const y = yRatioStart * height;
    const h = heightRatio * height;
    const wStep = width / numWindows;
    
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, y, width, h);
    
    for (let i = 0; i < numWindows; i++) {
      ctx.fillStyle = '#555555';
      ctx.fillRect(i * wStep, y, 2, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(i * wStep + 5, y + 5, wStep - 10, h / 2);
    }
  }
  
  drawWindowRow(0.58, 0.05, 60);
  drawWindowRow(0.48, 0.04, 60);
  drawWindowRow(0.42, 0.04, 60);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Ground texture
function createGroundTexture() {
  const s = 1024;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const ctx = c.getContext('2d')!;
  
  ctx.fillStyle = '#1a331a';
  ctx.fillRect(0, 0, s, s);
  
  for (let i = 0; i < 40000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#244224' : '#142614';
    const x = Math.random() * s;
    const y = Math.random() * s;
    ctx.fillRect(x, y, 2, 2);
  }
  
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(50, 50);
  return t;
}

// Antenna Segment component
const AntennaSegment = ({ 
  y, height, radiusBottom, radiusTop, color 
}: { 
  y: number; height: number; radiusBottom: number; radiusTop: number; color: string 
}) => (
  <mesh position={[0, y + height / 2, 0]} castShadow>
    <cylinderGeometry args={[radiusTop, radiusBottom, height, 32]} />
    <meshStandardMaterial color={color} roughness={0.4} />
  </mesh>
);

// Fernsehturm (TV Tower) component
const Fernsehturm = ({ progress }: { progress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  
  // Textures (memoized)
  const concreteMap = useMemo(() => createConcreteTexture(), []);
  const sphereMap = useMemo(() => createSphereTexture(), []);
  
  // Shaft texture with repeat
  const shaftMap = useMemo(() => {
    const map = createConcreteTexture();
    map.repeat.set(2, 8);
    return map;
  }, []);
  
  // BPM increases with scroll: 60 -> 140 BPM
  const bpm = lerp(60, 140, Math.min(progress * 1.5, 1));
  const pulseFrequency = bpm / 60;
  
  useFrame(({ clock }) => {
    if (beaconRef.current && beaconMeshRef.current) {
      const time = clock.getElapsedTime();
      const pulse = (Math.sin(time * pulseFrequency * Math.PI * 2) + 1) / 2;
      const intensity = 1 + pulse * (4 + progress * 8);
      beaconRef.current.intensity = intensity;
      
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHSL(0, 1, 0.5 + pulse * 0.5);
    }
  });
  
  // Build antenna segments
  const antennaSegments = useMemo(() => {
    const segments: { y: number; height: number; radiusBottom: number; radiusTop: number; color: string }[] = [];
    let antY = 215 + 16 - 2; // Start above sphere
    
    // Base transition
    segments.push({ y: antY, height: 8, radiusBottom: 6, radiusTop: 4, color: '#EEEEEE' });
    antY += 8;
    
    // Striped section
    const stripeH = 8;
    const sectionCount = 12;
    let radius = 3.5;
    
    for (let i = 0; i < sectionCount; i++) {
      const nextRadius = radius - 0.15;
      segments.push({
        y: antY,
        height: stripeH,
        radiusBottom: radius,
        radiusTop: nextRadius,
        color: i % 2 === 0 ? '#D02020' : '#EEEEEE'
      });
      antY += stripeH;
      radius = nextRadius;
    }
    
    // Top needle
    segments.push({ y: antY, height: 30, radiusBottom: 1.2, radiusTop: 0.4, color: '#D02020' });
    antY += 30;
    segments.push({ y: antY, height: 15, radiusBottom: 0.4, radiusTop: 0.1, color: '#EEEEEE' });
    antY += 15;
    
    return { segments, finalY: antY };
  }, []);
  
  return (
    <group ref={groupRef}>
      {/* Base Structure */}
      <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[28, 32, 15, 6]} />
        <meshStandardMaterial map={concreteMap} color="#bbbbbb" roughness={0.9} />
      </mesh>
      
      {/* Base Roof */}
      <mesh position={[0, 19, 0]} castShadow>
        <coneGeometry args={[38, 8, 6]} />
        <meshStandardMaterial map={concreteMap} color="#bbbbbb" roughness={0.9} />
      </mesh>
      
      {/* Main Shaft */}
      <mesh position={[0, 15 + 102.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5.5, 12, 205, 64]} />
        <meshStandardMaterial map={shaftMap} color="#bbbbbb" roughness={0.9} />
      </mesh>
      
      {/* Connector below sphere */}
      <mesh position={[0, 215 - 16 + 2, 0]}>
        <cylinderGeometry args={[6, 7, 10, 32]} />
        <meshStandardMaterial color="#222222" roughness={0.7} metalness={0.4} />
      </mesh>
      
      {/* The Sphere */}
      <mesh position={[0, 215, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <sphereGeometry args={[16, 128, 128]} />
        <meshStandardMaterial 
          map={sphereMap} 
          color="#ffffff" 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Antenna segments */}
      {antennaSegments.segments.map((seg, i) => (
        <AntennaSegment key={i} {...seg} />
      ))}
      
      {/* Beacon light */}
      <pointLight
        ref={beaconRef}
        position={[0, antennaSegments.finalY, 0]}
        color="#ff0000"
        intensity={2}
        distance={200}
        decay={2}
      />
      <mesh ref={beaconMeshRef} position={[0, antennaSegments.finalY, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

// City Buildings
const Buildings = ({ progress }: { progress: number }) => {
  const buildings = useMemo(() => {
    const result: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 800;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const w = 10 + Math.random() * 30;
      const d = 10 + Math.random() * 30;
      const h = 20 + Math.random() * 60;
      
      result.push({
        pos: [x, h / 2, z],
        scale: [w, h, d],
      });
    }
    return result;
  }, []);
  
  // Window lights intensity based on progress
  const windowIntensity = Math.max(0, (progress - 0.3) / 0.4);
  
  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i}>
          <mesh position={b.pos} scale={b.scale} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#707070" roughness={0.8} />
          </mesh>
          {/* Window lights at night */}
          {windowIntensity > 0 && i % 3 === 0 && (
            <pointLight
              position={[b.pos[0], b.pos[1] + b.scale[1] * 0.3, b.pos[2]]}
              color="#ffaa00"
              intensity={windowIntensity * 0.15}
              distance={40}
              decay={2}
            />
          )}
        </group>
      ))}
    </group>
  );
};

// Trees
const Trees = () => {
  const trees = useMemo(() => {
    const result: { x: number; z: number }[] = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 300;
      result.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
      });
    }
    return result;
  }, []);
  
  return (
    <group>
      {trees.map((t, i) => (
        <group key={i}>
          {/* Trunk */}
          <mesh position={[t.x, 2.5, t.z]} castShadow>
            <cylinderGeometry args={[1, 1.5, 5, 6]} />
            <meshStandardMaterial color="#4a3c31" />
          </mesh>
          {/* Leaves */}
          <mesh position={[t.x, 7, t.z]} scale={[1, 1.5, 1]} castShadow>
            <dodecahedronGeometry args={[4]} />
            <meshStandardMaterial color="#1e4d2b" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Clouds
const Clouds = () => {
  const clouds = useMemo(() => {
    const result: { pos: [number, number, number]; spheres: { offset: [number, number, number]; scale: [number, number, number] }[] }[] = [];
    
    for (let i = 0; i < 10; i++) {
      const spheres: { offset: [number, number, number]; scale: [number, number, number] }[] = [];
      for (let j = 0; j < 4; j++) {
        spheres.push({
          offset: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 50],
          scale: [1 + Math.random(), 0.6, 1 + Math.random()],
        });
      }
      result.push({
        pos: [(Math.random() - 0.5) * 2000, 300 + Math.random() * 200, (Math.random() - 0.5) * 2000],
        spheres,
      });
    }
    return result;
  }, []);
  
  return (
    <group>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.pos}>
          {cloud.spheres.map((s, j) => (
            <mesh key={j} position={s.offset} scale={s.scale}>
              <sphereGeometry args={[40, 16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Ground
const Ground = () => {
  const groundMap = useMemo(() => createGroundTexture(), []);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5000, 5000]} />
      <meshStandardMaterial map={groundMap} roughness={1} color="#888888" />
    </mesh>
  );
};

// Scene controller for dynamic lighting and camera
const SceneController = forwardRef<{ setProgress: (p: number) => void }, object>((_, ref) => {
  const { scene, camera } = useThree();
  const progressRef = useRef(0);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  
  // Day/Night colors
  const dayColor = useMemo(() => new THREE.Color(0x87CEEB), []);
  const duskColor = useMemo(() => new THREE.Color(0x1a1a2e), []);
  const nightColor = useMemo(() => new THREE.Color(0x050510), []);
  const dawnColor = useMemo(() => new THREE.Color(0x2a1a3e), []);
  
  useImperativeHandle(ref, () => ({
    setProgress: (p: number) => {
      progressRef.current = p;
    }
  }));
  
  useFrame(() => {
    const p = progressRef.current;
    
    // Sky color transition: day -> dusk -> night -> dawn
    let skyColor: THREE.Color;
    if (p < 0.2) {
      skyColor = lerpColor(dayColor, duskColor, p / 0.2);
    } else if (p < 0.5) {
      skyColor = lerpColor(duskColor, nightColor, (p - 0.2) / 0.3);
    } else if (p < 0.85) {
      skyColor = nightColor;
    } else {
      skyColor = lerpColor(nightColor, dawnColor, (p - 0.85) / 0.15);
    }
    scene.background = skyColor;
    
    // Fog density
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).density = lerp(0.0015, 0.003, Math.min(p * 2, 1));
    }
    
    // Lighting intensity
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = lerp(0.6, 0.15, Math.min(p * 2, 1));
    }
    if (dirLightRef.current) {
      dirLightRef.current.intensity = lerp(1.2, 0.1, Math.min(p * 2, 1));
      // Sun position moves
      dirLightRef.current.position.set(
        lerp(150, -100, p),
        lerp(500, 50, p),
        lerp(150, -100, p)
      );
      // Color shifts to cooler at night
      dirLightRef.current.color.setHex(p < 0.3 ? 0xfff0dd : 0x8080ff);
    }
    
    // Camera movement: high/far -> low/close -> pull back
    const startPos = { x: 400, y: 250, z: 400 };
    const midPos = { x: 150, y: 80, z: 150 };
    const endPos = { x: 250, y: 120, z: 250 };
    
    let camX, camY, camZ;
    if (p < 0.7) {
      const t = p / 0.7;
      camX = lerp(startPos.x, midPos.x, t);
      camY = lerp(startPos.y, midPos.y, t);
      camZ = lerp(startPos.z, midPos.z, t);
    } else {
      const t = (p - 0.7) / 0.3;
      camX = lerp(midPos.x, endPos.x, t);
      camY = lerp(midPos.y, endPos.y, t);
      camZ = lerp(midPos.z, endPos.z, t);
    }
    
    camera.position.set(camX, camY, camZ);
    camera.lookAt(0, 180, 0);
  });
  
  return (
    <>
      <hemisphereLight ref={hemiLightRef} args={[0xffffff, 0x444444, 0.6]} />
      <directionalLight
        ref={dirLightRef}
        position={[150, 500, 150]}
        intensity={1.2}
        color={0xfff0dd}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-300}
        shadow-camera-right={300}
        shadow-camera-top={500}
        shadow-camera-bottom={-300}
        shadow-camera-far={1000}
        shadow-bias={-0.0001}
      />
      <fogExp2 attach="fog" args={[0x8FAABB, 0.0015]} />
    </>
  );
});

SceneController.displayName = 'SceneController';

// Main scene component
const Scene = forwardRef<{ setProgress: (p: number) => void }, { progress: number }>(
  ({ progress }, ref) => {
    const controllerRef = useRef<{ setProgress: (p: number) => void }>(null);
    
    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        controllerRef.current?.setProgress(p);
      }
    }));
    
    return (
      <>
        <SceneController ref={controllerRef} />
        <Fernsehturm progress={progress} />
        <Buildings progress={progress} />
        <Trees />
        <Clouds />
        <Ground />
      </>
    );
  }
);

Scene.displayName = 'Scene';

// Exported component
export interface BerlinSceneHandle {
  setProgress: (progress: number) => void;
}

interface BerlinSceneProps {
  className?: string;
}

const BerlinScene = forwardRef<BerlinSceneHandle, BerlinSceneProps>(({ className }, ref) => {
  const sceneRef = useRef<{ setProgress: (p: number) => void }>(null);
  const progressRef = useRef(0);
  
  useImperativeHandle(ref, () => ({
    setProgress: (p: number) => {
      progressRef.current = p;
      sceneRef.current?.setProgress(p);
    }
  }));
  
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [400, 250, 400], fov: 40, near: 1, far: 4000 }}
        shadows
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: '#87CEEB' }}
      >
        <Scene ref={sceneRef} progress={progressRef.current} />
      </Canvas>
    </div>
  );
});

BerlinScene.displayName = 'BerlinScene';

export default BerlinScene;
