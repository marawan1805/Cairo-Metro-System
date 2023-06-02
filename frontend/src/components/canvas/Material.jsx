import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import React from 'react';
import { useForceUpdate } from 'framer-motion';

const Material = () => {
  const ref = useForceUpdate((self) => {
    self.side = THREE.DoubleSide;
  });
  
  useFrame((state, delta) => {
    ref.current.rotation.y += 0.01;
  });
  
  return (
    <meshStandardMaterial ref={ref} color="orange" />
  );
};

export default Material;