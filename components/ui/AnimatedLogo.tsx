import React from "react";

export default function AnimatedLogo() {
  // Simple fallback logo for now
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <img src="/logo-bivoo.png" alt="Bivoo Logo" style={{ height: 40 }} />
    </div>
  );
}
