"use client";

import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Model() {
  const gltf = useLoader(GLTFLoader, "/book.glb");
  
  return (
    <primitive object={gltf.scene} scale={25} />
  );
}

export default function ModelViewer() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 90, position: [0, 0, 18], rotation: [0, Math.PI / 2,0 ] }}>
      <Suspense fallback={null}>
        <Stage environment="city" intensity={1}>
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={0.3} 
        makeDefault 
        enableDamping={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 13} 
        maxPolarAngle={Math.PI / 13} 
      />
    </Canvas>
  );
}
