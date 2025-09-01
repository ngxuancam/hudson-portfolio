import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import LegoModel from "./LegoModel";
import { SCROLL_EVENT, scrollEmitter } from "../../lib/events";

function Scene() {
  const cameraRef = useRef(null);
  const targetPosition = useRef({ y: 1.2, z: 3 });
  const currentPosition = useRef({ y: 1.2, z: 3 });

  useEffect(() => {
    const handleScroll = (data: { scrollY: number; direction: 'up' | 'down' }) => {
      const scrollFactor = data.scrollY / window.innerHeight;
      
      // Adjust target position based on scroll
      targetPosition.current = {
        y: 1.2 + scrollFactor * 0.5, // Move up/down
        z: 3 + scrollFactor * 2, // Zoom in/out
      };
    };

    scrollEmitter.on(SCROLL_EVENT, handleScroll);
    return () => scrollEmitter.off(SCROLL_EVENT, handleScroll);
  }, []);

  useFrame((state, delta) => {
    if (!cameraRef.current) return;

    // Smooth camera movement
    currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.1;
    currentPosition.current.z += (targetPosition.current.z - currentPosition.current.z) * 0.1;

    state.camera.position.y = currentPosition.current.y;
    state.camera.position.z = currentPosition.current.z;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={1.5} />
      <LegoModel />
      <Environment preset="city" />
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 1.2, 3], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0B0F19"]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
