import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import headphoneImage from '@/assets/nothing-headphone.png';

const HeadphoneCard = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, headphoneImage);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  // Calculate aspect ratio from texture
  const aspect = texture.image ? texture.image.width / texture.image.height : 16 / 9;
  const height = 3;
  const width = height * aspect;

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
};

const HeadphoneViewer = () => {
  return (
    <div className="w-full h-[60vh] md:h-[70vh]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-0.4, 0.4]}
            azimuth={[-0.8, 0.8]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <HeadphoneCard />
          </PresentationControls>
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeadphoneViewer;