import { useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Lerp helper
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (c1: THREE.Color, c2: THREE.Color, t: number) => {
  return new THREE.Color().lerpColors(c1, c2, t);
};

// Fernsehturm (TV Tower) component
const Fernsehturm = ({ progress }: { progress: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  
  // BPM increases with scroll: 60 -> 140 BPM
  const bpm = lerp(60, 140, Math.min(progress * 1.5, 1));
  const pulseFrequency = bpm / 60;
  
  useFrame(({ clock }) => {
    if (beaconRef.current && beaconMeshRef.current) {
      const time = clock.getElapsedTime();
      const pulse = (Math.sin(time * pulseFrequency * Math.PI * 2) + 1) / 2;
      const intensity = 2 + pulse * (4 + progress * 8);
      beaconRef.current.intensity = intensity;
      
      // Beacon mesh glow
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 + pulse * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -20, 0]}>
      {/* Main shaft */}
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[3, 5, 120, 16]} />
        <meshStandardMaterial color="#8c8c8c" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Observation sphere */}
      <mesh position={[0, 130, 0]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial color="#b0b0b0" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Upper restaurant section */}
      <mesh position={[0, 145, 0]}>
        <cylinderGeometry args={[12, 12, 8, 32]} />
        <meshStandardMaterial color="#909090" metalness={0.4} roughness={0.5} />
      </mesh>
      
      {/* Antenna spire */}
      <mesh position={[0, 185, 0]}>
        <cylinderGeometry args={[0.5, 2, 80, 8]} />
        <meshStandardMaterial color="#707070" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Beacon light */}
      <pointLight
        ref={beaconRef}
        position={[0, 220, 0]}
        color="#ff0040"
        intensity={2}
        distance={500}
        decay={2}
      />
      <mesh ref={beaconMeshRef} position={[0, 220, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshBasicMaterial color="#ff0040" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

// City buildings
const Buildings = ({ progress }: { progress: number }) => {
  const buildings = useMemo(() => {
    const result: { pos: [number, number, number]; scale: [number, number, number]; lightPos: [number, number, number] }[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 10 + Math.random() * 40;
      const width = 8 + Math.random() * 12;
      
      result.push({
        pos: [x, height / 2, z],
        scale: [width, height, width],
        lightPos: [x, height * 0.7, z],
      });
    }
    return result;
  }, []);
  
  // City lights fade in after 40% scroll
  const lightIntensity = Math.max(0, (progress - 0.4) / 0.3) * 0.3;
  
  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i}>
          <mesh position={b.pos}>
            <boxGeometry args={b.scale} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.1} roughness={0.9} />
          </mesh>
          {lightIntensity > 0 && (
            <pointLight
              position={b.lightPos}
              color="#ffaa00"
              intensity={lightIntensity}
              distance={30}
              decay={2}
            />
          )}
        </group>
      ))}
    </group>
  );
};

// Ground plane
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
    <planeGeometry args={[1000, 1000]} />
    <meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
  </mesh>
);

// Scene controller
const SceneController = forwardRef<{ setProgress: (p: number) => void }, object>((_, ref) => {
  const { scene, camera } = useThree();
  const progressRef = useRef(0);
  
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
    if (p < 0.25) {
      skyColor = lerpColor(dayColor, duskColor, p / 0.25);
    } else if (p < 0.5) {
      skyColor = lerpColor(duskColor, nightColor, (p - 0.25) / 0.25);
    } else if (p < 0.85) {
      skyColor = nightColor;
    } else {
      skyColor = lerpColor(nightColor, dawnColor, (p - 0.85) / 0.15);
    }
    scene.background = skyColor;
    
    // Camera movement: high/far -> low/close -> pull back
    const startPos = { x: 300, y: 200, z: 300 };
    const midPos = { x: 120, y: 60, z: 120 };
    const endPos = { x: 200, y: 100, z: 200 };
    
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
    camera.lookAt(0, 100, 0);
  });
  
  return null;
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
    
    // Lighting transitions
    const sunIntensity = lerp(1.2, 0.1, Math.min(progress * 2, 1));
    const ambientIntensity = lerp(0.6, 0.15, Math.min(progress * 2, 1));
    
    return (
      <>
        <SceneController ref={controllerRef} />
        
        {/* Ambient light */}
        <ambientLight intensity={ambientIntensity} />
        
        {/* Sun/Moon */}
        <directionalLight
          position={[
            lerp(150, -100, progress),
            lerp(500, 50, progress),
            lerp(150, -100, progress)
          ]}
          intensity={sunIntensity}
          color={progress < 0.3 ? '#fff5e0' : '#8080ff'}
        />
        
        {/* Fog */}
        <fog attach="fog" args={['#050510', 100, lerp(800, 400, progress)]} />
        
        <Fernsehturm progress={progress} />
        <Buildings progress={progress} />
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
        camera={{ position: [300, 200, 300], fov: 45 }}
        style={{ background: '#87CEEB' }}
      >
        <Scene ref={sceneRef} progress={progressRef.current} />
      </Canvas>
    </div>
  );
});

BerlinScene.displayName = 'BerlinScene';

export default BerlinScene;
