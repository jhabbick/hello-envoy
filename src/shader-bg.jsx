import { createRoot } from "react-dom/client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

const container = document.getElementById("shader-bg");

if (!container) {
  throw new Error("Missing #shader-bg container");
}

const root = createRoot(container);

root.render(
  <ShaderGradientCanvas
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
    }}
    pixelDensity={1}
    fov={45}
    lazyLoad={false}
    pointerEvents="none"
    envBasePath="https://ruucm.github.io/shadergradient/ui@0.0.0/assets/hdr"
  >
    <ShaderGradient
      animate="on"
      axesHelper="off"
      brightness={0.9}
      cAzimuthAngle={176}
      cDistance={3.59}
      cPolarAngle={113}
      cameraZoom={1}
      color1="#0B0F13"
      color2="#7DD3FC"
      color3="#60A5FA"
      envPreset="city"
      grain="on"
      gizmoHelper="hide"
      lightType="3d"
      positionX={-1.4}
      positionY={0}
      positionZ={0}
      range="disabled"
      rangeEnd={40}
      rangeStart={0}
      reflection={0.1}
      rotationX={0}
      rotationY={10}
      rotationZ={50}
      shader="defaults"
      type="plane"
      uAmplitude={1}
      uDensity={1.3}
      uFrequency={5.5}
      uSpeed={0.3}
      uStrength={3}
      uTime={0}
      wireframe={false}
    />
  </ShaderGradientCanvas>
);
