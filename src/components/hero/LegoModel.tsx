import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type Props = { rotationFactor?: number };

export default function LegoModel({ rotationFactor = Math.PI * 2 }: Props) {
  const group = useRef<THREE.Group>(null!);
  const { scene, materials } = useGLTF("/models/lego-man.glb"); // ensure file exists

  // gentle idle + external control
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y += 0.002; // idle
  });

  return <primitive ref={group} object={scene} position={[0, -1.2, 0]} />;
}

useGLTF.preload("/models/lego-man.glb");
