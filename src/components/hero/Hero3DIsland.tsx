import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import {
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import LegoModel from "./LegoModel";
import * as THREE from "three";
import { SCROLL_EVENT, scrollEmitter } from "../../lib/events";

function Rotator() {
  const group = useRef<THREE.Group>(null!);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    const handleScroll = (data: { scrollY: number; direction: 'up' | 'down' }) => {
      // Calculate rotation based on scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(data.scrollY / maxScroll, 1);
      targetRotation.current = scrollProgress * Math.PI * 2;
    };

    scrollEmitter.on(SCROLL_EVENT, handleScroll);
    return () => scrollEmitter.off(SCROLL_EVENT, handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Smooth rotation
    currentRotation.current += (targetRotation.current - currentRotation.current) * 0.1;
    group.current.rotation.y = currentRotation.current;
  });

  return (
    <group ref={group}>
      <LegoModel />
    </group>
  );
}

export default function Hero3DIsland() {
  return (
    <div className="w-full h-[70vh] rounded-2xl overflow-hidden border border-coal">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.1, 3], fov: 45 }}
      >
        <PerformanceMonitor />
        <color attach="background" args={["#0B0F19"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <Rotator />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
