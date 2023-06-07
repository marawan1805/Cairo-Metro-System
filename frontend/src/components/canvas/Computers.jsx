import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const computer = useGLTF("/train/untitled.gltf");

  const setMaterialProperties = (material) => {
    material.transparent = false;
    material.depthWrite = true;
  };

  const processMaterials = (object) => {
    if (object.isMesh) {
      if (Array.isArray(object.material)) {
        object.material.forEach(setMaterialProperties);
      } else {
        setMaterialProperties(object.material);
      }
    }
  };

  useEffect(() => {
    computer.scene.traverse(processMaterials);
  }, [computer.scene]);

  return (
    <mesh>
      <ambientLight intensity={0.2} />
      <hemisphereLight intensity={0.3} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1.2} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <Canvas
  frameloop="demand"
  shadows
  dpr={[1, 2]}
  camera={{ position: [180, -20, 200], fov: 80, near: 0.1, far: 5000 }} // increase far
  gl={{ preserveDrawingBuffer: true }}
>
  
  <Suspense fallback={<CanvasLoader />}>
    <OrbitControls
      enableZoom={true} 
      enablePan={true} 
      minDistance={10}
      maxDistance={2000} // increase maxDistance
    />
    <Computers isMobile={isMobile} />
  </Suspense>
  <Preload all />
</Canvas>

    </div>
  );
};

export default ComputersCanvas;
