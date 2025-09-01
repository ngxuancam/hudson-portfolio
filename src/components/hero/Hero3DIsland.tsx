import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import {
  Environment,
  ScrollControls,
  useScroll,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import LegoModel from "./LegoModel";
import * as THREE from "three";

function Rotator() {
  const group = useRef<THREE.Group>(null!);
  const scroll = useScroll();

  useFrame(() => {
    if (!group.current) return;
    const t = scroll.offset; // 0..1 scroll
    group.current.rotation.y = t * Math.PI * 2; // rotate with scroll
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
          <ScrollControls pages={2} damping={0.2}>
            <Rotator />
          </ScrollControls>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
