"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const GalaxyScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const galaxyGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const galaxyMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const galaxyPointsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Objects
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i3 + 2] = Math.sin(angle) * radius;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      size: 0.01,
      color: new THREE.Color("#110b12"),
    });
    galaxyMaterialRef.current = material;

    const points = new THREE.Points(geometry, material);
    galaxyPointsRef.current = points;
    scene.add(points);

    // Handle resizing
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !container) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      points.rotation.y += 0.001;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (galaxyGeometryRef.current) galaxyGeometryRef.current.dispose();
      if (galaxyMaterialRef.current) galaxyMaterialRef.current.dispose();
      if (sceneRef.current) {
        
        sceneRef.current.clear();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
};

export default GalaxyScene;
