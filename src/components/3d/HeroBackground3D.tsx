import {
  Suspense,
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────
// Detect mobile for performance scaling
// ─────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};

// ─────────────────────────────────────────────
// Mouse tracking hook
// ─────────────────────────────────────────────
const useMousePosition = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
};

// ─────────────────────────────────────────────
// Instanced particle field (performance optimized)
// ─────────────────────────────────────────────
interface ParticleFieldProps {
  count: number;
}

const ParticleField = ({ count }: ParticleFieldProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouse = useMousePosition();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const data: {
      position: THREE.Vector3;
      basePosition: THREE.Vector3;
      speed: number;
      phase: number;
      scale: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      );
      data.push({
        position: pos.clone(),
        basePosition: pos.clone(),
        speed: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.06,
      });
    }
    return data;
  }, [count]);

  // Set instance colors once
  useEffect(() => {
    if (!meshRef.current) return;
    const purpleShades = [
      new THREE.Color("#8B5CF6"),
      new THREE.Color("#7C3AED"),
      new THREE.Color("#6366F1"),
      new THREE.Color("#A78BFA"),
      new THREE.Color("#3B82F6"),
      new THREE.Color("#C4B5FD"),
    ];
    for (let i = 0; i < count; i++) {
      const color = purpleShades[Math.floor(Math.random() * purpleShades.length)];
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count]);

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const mx = mouse.current.x * 0.5;
    const my = mouse.current.y * 0.5;

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      const t = time * p.speed + p.phase;

      // Floating motion
      dummy.position.set(
        p.basePosition.x + Math.sin(t * 0.4) * 0.8 + mx * 0.3,
        p.basePosition.y + Math.cos(t * 0.3) * 0.6 + my * 0.3,
        p.basePosition.z + Math.sin(t * 0.5) * 0.4
      );

      // Pulse scale
      const pulse = 1 + Math.sin(t * 2) * 0.3;
      dummy.scale.setScalar(p.scale * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
    >
      <meshBasicMaterial
        transparent
        opacity={0.7}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// ─────────────────────────────────────────────
// Floating geometric shape (icosahedron / torus knot)
// ─────────────────────────────────────────────
interface FloatingGeoProps {
  position: [number, number, number];
  type: "icosahedron" | "torusKnot";
  color: string;
  size: number;
  rotationSpeed?: number;
  floatSpeed?: number;
  floatIntensity?: number;
}

const FloatingGeo = ({
  position,
  type,
  color,
  size,
  rotationSpeed = 1,
  floatSpeed = 1,
  floatIntensity = 1,
}: FloatingGeoProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  const geo = useMemo(() => {
    if (type === "icosahedron") {
      return new THREE.IcosahedronGeometry(size, 1);
    }
    return new THREE.TorusKnotGeometry(size, size * 0.3, 64, 8, 2, 3);
  }, [type, size]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15 * rotationSpeed;
    meshRef.current.rotation.y += delta * 0.2 * rotationSpeed;
    meshRef.current.rotation.z += delta * 0.1 * rotationSpeed;

    // Subtle mouse follow
    const mx = mouse.current.x;
    const my = mouse.current.y;
    meshRef.current.position.x +=
      (position[0] + mx * 0.15 - meshRef.current.position.x) * delta * 0.5;
    meshRef.current.position.y +=
      (position[1] + my * 0.15 - meshRef.current.position.y) * delta * 0.5;

    // Breathing glow via emissive intensity
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <mesh ref={meshRef} position={position} geometry={geo}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.25}
          wireframe
          roughness={0.3}
          metalness={0.9}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
};

// ─────────────────────────────────────────────
// Camera rig - subtle mouse follow for whole scene
// ─────────────────────────────────────────────
const CameraRig = () => {
  const mouse = useMousePosition();
  const { camera } = useThree();

  useFrame(() => {
    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.2;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ─────────────────────────────────────────────
// Main scene composition
// ─────────────────────────────────────────────
interface SceneProps {
  isMobile: boolean;
}

const Scene = ({ isMobile }: SceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const particleCount = isMobile ? 80 : 300;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  const shapes: FloatingGeoProps[] = useMemo(
    () =>
      isMobile
        ? [
            // Fewer shapes on mobile
            { position: [-2.5, 1.5, -3], type: "icosahedron" as const, color: "#8B5CF6", size: 0.7, rotationSpeed: 0.5, floatSpeed: 1, floatIntensity: 1 },
            { position: [2.5, -1.5, -2], type: "torusKnot" as const, color: "#3B82F6", size: 0.4, rotationSpeed: 0.7, floatSpeed: 1.2, floatIntensity: 0.8 },
            { position: [0, 2, -4], type: "icosahedron" as const, color: "#7C3AED", size: 0.5, rotationSpeed: 0.6, floatSpeed: 0.8, floatIntensity: 1.2 },
          ]
        : [
            // Desktop: rich geometry field
            { position: [-4, 2, -3], type: "icosahedron" as const, color: "#8B5CF6", size: 0.8, rotationSpeed: 0.4, floatSpeed: 1, floatIntensity: 1.2 },
            { position: [4, -1.5, -2], type: "torusKnot" as const, color: "#3B82F6", size: 0.5, rotationSpeed: 0.7, floatSpeed: 1.5, floatIntensity: 0.8 },
            { position: [0, 3, -4], type: "icosahedron" as const, color: "#7C3AED", size: 0.6, rotationSpeed: 0.5, floatSpeed: 0.8, floatIntensity: 1 },
            { position: [-3, -2, -2], type: "torusKnot" as const, color: "#6366F1", size: 0.35, rotationSpeed: 0.9, floatSpeed: 1.3, floatIntensity: 1.5 },
            { position: [3, 2.5, -3.5], type: "icosahedron" as const, color: "#A78BFA", size: 0.5, rotationSpeed: 0.6, floatSpeed: 1.1, floatIntensity: 1.3 },
            { position: [-1.5, -3, -3], type: "torusKnot" as const, color: "#8B5CF6", size: 0.3, rotationSpeed: 1, floatSpeed: 0.9, floatIntensity: 0.9 },
            { position: [2, 0.5, -5], type: "icosahedron" as const, color: "#3B82F6", size: 0.45, rotationSpeed: 0.8, floatSpeed: 1.4, floatIntensity: 1.1 },
            { position: [-5, 0, -4], type: "icosahedron" as const, color: "#C4B5FD", size: 0.4, rotationSpeed: 0.3, floatSpeed: 0.7, floatIntensity: 1.6 },
          ],
    [isMobile]
  );

  return (
    <group ref={groupRef}>
      <ParticleField count={particleCount} />
      {shapes.map((props, i) => (
        <FloatingGeo key={i} {...props} />
      ))}
      <CameraRig />
    </group>
  );
};

// ─────────────────────────────────────────────
// Error boundary - gracefully hide on WebGL failure
// ─────────────────────────────────────────────
interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
interface HeroBackground3DProps {
  className?: string;
}

const HeroBackground3D = ({ className = "" }: HeroBackground3DProps) => {
  const isMobile = useIsMobile();
  const [webGLSupported, setWebGLSupported] = useState(true);

  const checkWebGL = useCallback(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    checkWebGL();
  }, [checkWebGL]);

  if (!webGLSupported) return null;

  return (
    <WebGLErrorBoundary>
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${className}`}
        style={{ position: "absolute" }}
      >
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 55 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: true,
            }}
            style={{ background: "transparent" }}
            resize={{ scroll: false }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight
              position={[10, 10, 10]}
              intensity={1}
              color="#8B5CF6"
              distance={30}
            />
            <pointLight
              position={[-10, -5, 5]}
              intensity={0.6}
              color="#3B82F6"
              distance={25}
            />
            <pointLight
              position={[0, -10, 5]}
              intensity={0.4}
              color="#7C3AED"
              distance={20}
            />

            {/* Fog for depth */}
            <fog attach="fog" args={["#000000", 8, 25]} />

            <Scene isMobile={isMobile} />
          </Canvas>
        </Suspense>
      </div>
    </WebGLErrorBoundary>
  );
};

export default HeroBackground3D;
