import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────
// Floating geometric shape component
// ─────────────────────────────────────────────
interface FloatingShapeProps {
  position: [number, number, number];
  geometry: "box" | "sphere" | "torus" | "octahedron" | "dodecahedron";
  color: string;
  size: number;
  speed?: number;
  distort?: number;
  floatIntensity?: number;
}

const FloatingShape = ({
  position,
  geometry,
  color,
  size,
  speed = 1,
  distort = 0.3,
  floatIntensity = 1,
}: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15 * speed;
      meshRef.current.rotation.y += delta * 0.2 * speed;
    }
  });

  const geometryElement = useMemo(() => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[size, size, size]} />;
      case "sphere":
        return <sphereGeometry args={[size, 16, 16]} />;
      case "torus":
        return <torusGeometry args={[size, size * 0.35, 12, 24]} />;
      case "octahedron":
        return <octahedronGeometry args={[size]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[size]} />;
    }
  }, [geometry, size]);

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.3} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position}>
        {geometryElement}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.35}
          distort={distort}
          speed={2}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

// ─────────────────────────────────────────────
// Particle field
// ─────────────────────────────────────────────
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color("#8B5CF6");
    const blue = new THREE.Color("#3B82F6");
    const white = new THREE.Color("#E9D5FF");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const palette = [purple, blue, white];
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

// ─────────────────────────────────────────────
// Scene with auto-rotation
// ─────────────────────────────────────────────
const Scene = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const shapes: FloatingShapeProps[] = [
    // Large shapes - mid-ground
    { position: [-3, 1.5, -2], geometry: "dodecahedron", color: "#8B5CF6", size: 0.6, speed: 0.5, distort: 0.4, floatIntensity: 1.2 },
    { position: [3.5, -1, -1], geometry: "torus", color: "#3B82F6", size: 0.5, speed: 0.7, distort: 0.2, floatIntensity: 0.8 },
    { position: [0, 2.5, -3], geometry: "octahedron", color: "#7C3AED", size: 0.5, speed: 0.6, distort: 0.3, floatIntensity: 1 },

    // Medium shapes - spread out
    { position: [-2, -2, -1.5], geometry: "box", color: "#6366F1", size: 0.4, speed: 0.8, distort: 0.15, floatIntensity: 1.5 },
    { position: [2, 2, -2.5], geometry: "sphere", color: "#8B5CF6", size: 0.35, speed: 0.4, distort: 0.5, floatIntensity: 1.2 },
    { position: [-4, 0, -3], geometry: "torus", color: "#3B82F6", size: 0.3, speed: 0.9, distort: 0.2, floatIntensity: 0.7 },
    { position: [4, 0.5, -2], geometry: "dodecahedron", color: "#A78BFA", size: 0.35, speed: 0.6, distort: 0.35, floatIntensity: 1.3 },

    // Small shapes - background
    { position: [-1.5, 3, -4], geometry: "box", color: "#7C3AED", size: 0.25, speed: 1.2, distort: 0.1, floatIntensity: 0.5 },
    { position: [1, -3, -3.5], geometry: "octahedron", color: "#6366F1", size: 0.2, speed: 1, distort: 0.2, floatIntensity: 0.9 },
    { position: [-3, -1, -4], geometry: "sphere", color: "#3B82F6", size: 0.2, speed: 0.7, distort: 0.4, floatIntensity: 1.1 },
    { position: [3, -2.5, -3], geometry: "box", color: "#8B5CF6", size: 0.2, speed: 0.9, distort: 0.15, floatIntensity: 0.6 },
    { position: [0, -1, -2], geometry: "dodecahedron", color: "#A78BFA", size: 0.3, speed: 0.5, distort: 0.3, floatIntensity: 1.4 },

    // Extra foreground accents
    { position: [-1, 1, -1], geometry: "octahedron", color: "#3B82F6", size: 0.15, speed: 1.5, distort: 0.1, floatIntensity: 2 },
    { position: [1.5, -0.5, -1.5], geometry: "sphere", color: "#7C3AED", size: 0.18, speed: 1.3, distort: 0.25, floatIntensity: 1.8 },
    { position: [0.5, 1.5, -1], geometry: "torus", color: "#6366F1", size: 0.15, speed: 1.1, distort: 0.15, floatIntensity: 1.6 },
    { position: [-2.5, 2, -2], geometry: "box", color: "#8B5CF6", size: 0.22, speed: 0.8, distort: 0.2, floatIntensity: 1 },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((props, i) => (
        <FloatingShape key={i} {...props} />
      ))}
      <ParticleField />
    </group>
  );
};

// ─────────────────────────────────────────────
// Main background component
// ─────────────────────────────────────────────
const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#8B5CF6" />
          <pointLight position={[-10, -5, 5]} intensity={0.4} color="#3B82F6" />
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Hero3DBackground;
