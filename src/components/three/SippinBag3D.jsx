import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Alpha-blended glass rather than `transmission`: the canvas is transparent over a CSS
// background, and transmission can only refract what is inside the 3D scene.
const GLASS = {
  transparent: true,
  opacity: 0.18,
  roughness: 0.05,
  metalness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  envMapIntensity: 1.6,
  side: THREE.DoubleSide,
  color: '#ffffff',
};

const ICE_CUBES = [
  { position: [-0.32, 0.36, 0.12], rotation: [0.3, 0.6, 0.2] },
  { position: [0.18, 0.38, -0.18], rotation: [0.8, 0.2, 0.5] },
  { position: [0.42, 0.33, 0.2], rotation: [0.1, 1.1, 0.7] },
];

const setSRGB = (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
};

// Procedural Sippin' Bag: glass bag with loop handle, layered drink, ice and straw
function Bag({ flavor, controls, autoRotate }) {
  const group = useRef(null);
  const syrup = useRef(null);
  const milk = useRef(null);
  const spin = useRef(0);
  const [initialFlavor] = useState(flavor);
  const logo = useTexture('/assets/noir/brand/logo-primary.png', setSRGB);
  const targets = useMemo(
    () => ({ syrup: new THREE.Color(flavor.syrup), milk: new THREE.Color(flavor.milk) }),
    [flavor]
  );

  useFrame((state, delta) => {
    // Ease liquid colours toward the selected flavour
    const blend = 1 - Math.exp(-delta * 5);
    syrup.current.color.lerp(targets.syrup, blend);
    milk.current.color.lerp(targets.milk, blend);

    // Idle auto-spin is added on top of the user's drag rotation
    const c = controls.current;
    if (autoRotate && !c.dragging && performance.now() - c.lastInteraction > 2000) {
      spin.current += delta * 0.45;
    }
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, c.target + spin.current, 6, delta);
    if (autoRotate) group.current.position.y = -0.15 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
  });

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* Glass body */}
      <RoundedBox args={[1.5, 1.4, 0.95]} radius={0.14} smoothness={5}>
        <meshPhysicalMaterial {...GLASS} />
      </RoundedBox>

      {/* Layered drink: syrup below, milk above */}
      <RoundedBox args={[1.36, 0.5, 0.81]} radius={0.08} position={[0, -0.39, 0]}>
        <meshStandardMaterial ref={syrup} color={initialFlavor.syrup} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[1.36, 0.56, 0.81]} radius={0.08} position={[0, 0.14, 0]}>
        <meshStandardMaterial ref={milk} color={initialFlavor.milk} roughness={0.5} />
      </RoundedBox>

      {ICE_CUBES.map((cube, i) => (
        <RoundedBox key={i} args={[0.24, 0.24, 0.24]} radius={0.04} position={cube.position} rotation={cube.rotation}>
          <meshPhysicalMaterial {...GLASS} opacity={0.45} roughness={0.2} />
        </RoundedBox>
      ))}

      {/* Loop handle */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.5, 0.055, 20, 64, Math.PI]} />
        <meshPhysicalMaterial {...GLASS} opacity={0.4} />
      </mesh>

      {/* Straw */}
      <mesh position={[0.32, 0.62, 0.12]} rotation={[0.15, 0, -0.28]}>
        <cylinderGeometry args={[0.035, 0.035, 1.5, 20]} />
        <meshPhysicalMaterial {...GLASS} opacity={0.45} color="#e3f0e8" />
      </mesh>

      {/* Printed logo */}
      <mesh position={[0, -0.05, 0.478]}>
        <planeGeometry args={[0.85, 0.8]} />
        <meshBasicMaterial map={logo} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const SippinBag3D = ({ flavor, active }) => {
  const controls = useRef({ target: 0, dragging: false, lastInteraction: 0, lastX: 0 });
  const [autoRotate] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const onPointerDown = (e) => {
    const c = controls.current;
    c.dragging = true;
    c.lastX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const c = controls.current;
    if (!c.dragging) return;
    c.target += (e.clientX - c.lastX) * 0.012;
    c.lastX = e.clientX;
  };

  const onPointerUp = () => {
    controls.current.dragging = false;
    controls.current.lastInteraction = performance.now();
  };

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    controls.current.target += e.key === 'ArrowLeft' ? -0.4 : 0.4;
    controls.current.lastInteraction = performance.now();
  };

  return (
    // touch-pan-y keeps vertical page scrolling on phones; horizontal drags rotate the bag
    <div
      className="absolute inset-0 touch-pan-y"
      data-cursor="DRAG"
      tabIndex={0}
      role="img"
      aria-label={`3D preview of the Sippin' Bag, ${flavor.name}. Drag or use the arrow keys to rotate.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 0.45, 5.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Suspense fallback={null}>
          <Bag flavor={flavor} controls={controls} autoRotate={autoRotate} />
          {/* Studio lighting built from light panels, so no HDR file is downloaded */}
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 3]} scale={[8, 2, 1]} />
            <Lightformer intensity={1.2} position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
            <Lightformer intensity={1.2} position={[4, 1, -1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
            <Lightformer form="ring" intensity={2} position={[0, 1, -4]} scale={2} />
          </Environment>
        </Suspense>
        <ContactShadows position={[0, -0.86, 0]} opacity={0.35} blur={2.6} scale={4} far={1.4} />
      </Canvas>
    </div>
  );
};

export default SippinBag3D;
