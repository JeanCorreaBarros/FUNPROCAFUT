import React from "react";

const LOGO_PATH = process.env.NEXT_PUBLIC_LOGO_PATH ?? '/logo-FUNPROCAFUT.png';

export default function AnimatedLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <img src={LOGO_PATH} alt="FUNPROCAFUT Logo" style={{ height: 40 }} />
    </div>
  );
}
