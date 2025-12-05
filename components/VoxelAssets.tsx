import React from 'react';

// Common Pixel Art Config
export const PIXEL_SCALE = 4; // Size of one "pixel" in screen units

interface PixelProps {
  x: number;
  y: number;
  scale?: number;
  facingLeft?: boolean;
}

// Helper for outlined rects to create the "cartoon/game" look
const OutlinedRect = (props: React.SVGProps<SVGRectElement>) => (
  <rect {...props} stroke="#1e293b" strokeWidth={PIXEL_SCALE * 0.5} shapeRendering="crispEdges" />
);

// Simple oval shadow for 2D sprites
export const PixelShadow: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
  return (
    <ellipse 
      cx={x + (8 * PIXEL_SCALE * scale)} 
      cy={y + (15 * PIXEL_SCALE * scale)} 
      rx={6 * PIXEL_SCALE * scale} 
      ry={2 * PIXEL_SCALE * scale} 
      fill="rgba(0,0,0,0.3)" 
    />
  );
};

// --- Generic Stats Icons ---

export const PixelHeadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="7" y="9" width="2" height="2" fill="#1e293b" />
    <rect x="15" y="9" width="2" height="2" fill="#1e293b" />
    <rect x="7" y="15" width="10" height="2" fill="#1e293b" />
  </svg>
);

export const PixelLegIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Paw Pad */}
    <path d="M8 12H16V18C16 19.1 15.1 20 14 20H10C8.9 20 8 19.1 8 18V12Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    {/* Toes */}
    <rect x="5" y="6" width="4" height="4" rx="1" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="10" y="4" width="4" height="4" rx="1" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="15" y="6" width="4" height="4" rx="1" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
  </svg>
);

// --- Chicken (2 Legs) ---
export const PixelChicken: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;
  
  return (
    <g transform={transform}>
      {/* Legs */}
      <OutlinedRect x={6*s} y={13*s} width={2*s} height={3*s} fill="#d97706" />
      <OutlinedRect x={6*s} y={15*s} width={3*s} height={1*s} fill="#d97706" /> 
      <OutlinedRect x={9*s} y={13*s} width={2*s} height={3*s} fill="#f59e0b" />
      <OutlinedRect x={9*s} y={15*s} width={3*s} height={1*s} fill="#f59e0b" />
      {/* Body */}
      <OutlinedRect x={3*s} y={5*s} width={10*s} height={9*s} fill="#f8fafc" rx={s} />
      {/* Wing */}
      <OutlinedRect x={5*s} y={8*s} width={5*s} height={4*s} fill="#e2e8f0" />
      {/* Tail */}
      <OutlinedRect x={1*s} y={6*s} width={2*s} height={3*s} fill="#f1f5f9" />
      <OutlinedRect x={2*s} y={5*s} width={1*s} height={2*s} fill="#f1f5f9" />
      {/* Comb */}
      <OutlinedRect x={7*s} y={2*s} width={2*s} height={3*s} fill="#ef4444" />
      <OutlinedRect x={9*s} y={3*s} width={2*s} height={2*s} fill="#ef4444" />
      {/* Beak */}
      <OutlinedRect x={13*s} y={7*s} width={2*s} height={2*s} fill="#f59e0b" />
      {/* Eye */}
      <rect x={11*s} y={6*s} width={1*s} height={1*s} fill="#0f172a" />
      {/* Wattle */}
      <OutlinedRect x={11*s} y={9*s} width={2*s} height={1.5*s} fill="#ef4444" />
    </g>
  );
};

// --- Crane (2 Legs - Tall) ---
export const PixelCrane: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;
  
  return (
    <g transform={transform}>
      {/* Long Legs */}
      <OutlinedRect x={7*s} y={12*s} width={1*s} height={4*s} fill="#1f2937" />
      <OutlinedRect x={9*s} y={12*s} width={1*s} height={4*s} fill="#1f2937" />
      
      {/* Body */}
      <OutlinedRect x={4*s} y={7*s} width={9*s} height={6*s} fill="#f8fafc" />
      <OutlinedRect x={4*s} y={9*s} width={6*s} height={3*s} fill="#1f2937" /> {/* Black Wing Tip */}
      
      {/* Neck */}
      <OutlinedRect x={11*s} y={4*s} width={2*s} height={4*s} fill="#f8fafc" />
      
      {/* Head */}
      <OutlinedRect x={11*s} y={2*s} width={4*s} height={3*s} fill="#f8fafc" />
      <OutlinedRect x={11*s} y={2*s} width={2*s} height={1*s} fill="#ef4444" /> {/* Red Crown */}
      
      {/* Beak */}
      <OutlinedRect x={15*s} y={3*s} width={3*s} height={1*s} fill="#f59e0b" />
      
      {/* Eye */}
      <rect x={13*s} y={3*s} width={1*s} height={1*s} fill="#0f172a" />
    </g>
  );
};

// --- Ant (6 Legs) - Now Red/Fire Ant for distinction ---
export const PixelAnt: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;

  return (
    <g transform={transform}>
      {/* Legs (6) */}
      <line x1={4*s} y1={12*s} x2={3*s} y2={15*s} stroke="#7f1d1d" strokeWidth={1*s} />
      <line x1={6*s} y1={12*s} x2={6*s} y2={15*s} stroke="#7f1d1d" strokeWidth={1*s} />
      <line x1={8*s} y1={12*s} x2={9*s} y2={15*s} stroke="#7f1d1d" strokeWidth={1*s} />
      {/* Back legs offset */}
      <line x1={5*s} y1={11*s} x2={4*s} y2={14*s} stroke="#7f1d1d" strokeWidth={1*s} opacity="0.6"/>
      <line x1={7*s} y1={11*s} x2={7*s} y2={14*s} stroke="#7f1d1d" strokeWidth={1*s} opacity="0.6"/>
      <line x1={9*s} y1={11*s} x2={10*s} y2={14*s} stroke="#7f1d1d" strokeWidth={1*s} opacity="0.6"/>

      {/* Abdomen */}
      <OutlinedRect x={2*s} y={9*s} width={5*s} height={4*s} fill="#9a3412" rx={s} />
      {/* Thorax */}
      <OutlinedRect x={6.5*s} y={10*s} width={3*s} height={3*s} fill="#7c2d12" rx={s} />
      {/* Head */}
      <OutlinedRect x={9*s} y={8*s} width={4*s} height={4*s} fill="#9a3412" rx={s} />
      
      {/* Antennae - Fixed: Two distinct feelers */}
      <path d={`M${11*s},${8.5*s} L${12*s},${6*s} L${13*s},${5*s}`} fill="none" stroke="#7f1d1d" strokeWidth={0.8*s} strokeLinecap="round" />
      <path d={`M${12*s},${9*s} L${13.5*s},${7*s} L${15*s},${6*s}`} fill="none" stroke="#7f1d1d" strokeWidth={0.8*s} strokeLinecap="round" />
      
      {/* Eye */}
      <rect x={11*s} y={9*s} width={1*s} height={1*s} fill="#111827" />
    </g>
  );
};

// --- Rabbit (4 Legs) ---
export const PixelRabbit: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;

  return (
    <g transform={transform}>
      {/* Legs (Back) */}
      <OutlinedRect x={2*s} y={13*s} width={2*s} height={2*s} fill="#e5e7eb" />
      <OutlinedRect x={11*s} y={13*s} width={2*s} height={2*s} fill="#e5e7eb" />
      {/* Body */}
      <OutlinedRect x={2*s} y={7*s} width={11*s} height={7*s} fill="#ffffff" />
      {/* Legs (Front) */}
      <OutlinedRect x={1*s} y={14*s} width={3*s} height={2*s} fill="#f1f5f9" />
      <OutlinedRect x={12*s} y={14*s} width={2*s} height={2*s} fill="#f1f5f9" />
      {/* Head */}
      <OutlinedRect x={10*s} y={5*s} width={5*s} height={6*s} fill="#ffffff" />
      {/* Ears */}
      <OutlinedRect x={10*s} y={1*s} width={2*s} height={5*s} fill="#ffffff" />
      <rect x={11*s} y={2*s} width={1*s} height={3*s} fill="#fbcfe8" /> 
      <OutlinedRect x={13*s} y={1*s} width={2*s} height={5*s} fill="#ffffff" />
      <rect x={14*s} y={2*s} width={1*s} height={3*s} fill="#fbcfe8" /> 
      {/* Eye & Nose */}
      <rect x={13*s} y={7*s} width={1*s} height={1*s} fill="#0f172a" />
      <rect x={15*s} y={8*s} width={1*s} height={1*s} fill="#fbcfe8" />
      {/* Tail */}
      <OutlinedRect x={0*s} y={8*s} width={2*s} height={3*s} fill="#f1f5f9" />
    </g>
  );
};

// --- Turtle (4 Legs) - Redesigned to look more like a turtle ---
export const PixelTurtle: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;

  return (
    <g transform={transform}>
      {/* Back/Background Legs (Darker) */}
      <OutlinedRect x={4*s} y={12*s} width={2*s} height={2*s} fill="#4ade80" />
      <OutlinedRect x={10*s} y={12*s} width={2*s} height={2*s} fill="#4ade80" />

      {/* Tail */}
      <OutlinedRect x={1*s} y={10*s} width={2*s} height={1*s} fill="#86efac" />

      {/* Shell Dome (Top) */}
      <OutlinedRect x={4*s} y={6*s} width={8*s} height={4*s} fill="#15803d" rx={2*s} />
      {/* Shell Pattern (Scutes) */}
      <rect x={6*s} y={6.5*s} width={4*s} height={3*s} fill="#166534" rx={s} />

      {/* Shell Rim (Bottom) */}
      <OutlinedRect x={3*s} y={9*s} width={10*s} height={3*s} fill="#15803d" rx={s} />
      <rect x={3*s} y={10.5*s} width={10*s} height={1*s} fill="#14532d" opacity="0.3" />

      {/* Head */}
      <OutlinedRect x={12*s} y={8*s} width={4*s} height={3*s} fill="#86efac" rx={s} />
      {/* Neck connector */}
      <rect x={11*s} y={9*s} width={2*s} height={2*s} fill="#86efac" /> 

      {/* Front Legs (Lighter) */}
      <OutlinedRect x={3*s} y={13*s} width={2.5*s} height={2*s} fill="#86efac" />
      <OutlinedRect x={9.5*s} y={13*s} width={2.5*s} height={2*s} fill="#86efac" />
      
      {/* Eye */}
      <rect x={14*s} y={8.5*s} width={1*s} height={1*s} fill="#0f172a" />
      <rect x={14.5*s} y={8.5*s} width={0.5*s} height={0.5*s} fill="white" />
    </g>
  );
};



// --- Spider (8 Legs) ---
export const PixelSpider: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;

  return (
    <g transform={transform}>
      {/* Legs (8 - simplified representation) */}
      <path d={`M${3*s},${12*s} L${1*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${4*s},${12*s} L${3*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${5*s},${12*s} L${5*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${6*s},${12*s} L${7*s},${15*s}`} stroke="#111" strokeWidth={s} />

      <path d={`M${10*s},${12*s} L${12*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${11*s},${12*s} L${13*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${12*s},${12*s} L${14*s},${15*s}`} stroke="#111" strokeWidth={s} />
      <path d={`M${13*s},${12*s} L${15*s},${15*s}`} stroke="#111" strokeWidth={s} />

      {/* Abdomen */}
      <OutlinedRect x={2*s} y={8*s} width={8*s} height={6*s} fill="#374151" rx={2*s} />
      {/* Cephalothorax */}
      <OutlinedRect x={9*s} y={10*s} width={4*s} height={4*s} fill="#111827" rx={s} />
      
      {/* Eyes (Many) */}
      <rect x={11*s} y={11*s} width={1*s} height={1*s} fill="#0A61EE" />
      <rect x={12*s} y={11*s} width={1*s} height={1*s} fill="#0A61EE" />
    </g>
  );
};

// --- Dog (4 Legs) - Redesigned to look like a Beagle/Puppy ---
export const PixelDog: React.FC<PixelProps> = ({ x, y, scale = 1, facingLeft = false }) => {
  const s = PIXEL_SCALE * scale;
  const transform = `translate(${x}, ${y}) scale(${facingLeft ? -1 : 1}, 1) translate(${facingLeft ? -16 * s : 0}, 0)`;

  // Palette: Brown/White Beagle style
  const furBrown = "#b45309"; // amber-700
  const furWhite = "#fef3c7"; // amber-100
  const furDark = "#78350f"; // amber-900 (ears)
  const collar = "#ef4444"; // red

  return (
    <g transform={transform}>
      {/* Tail (Upright/Wagging tip white) */}
      <OutlinedRect x={0.5*s} y={7*s} width={2*s} height={4*s} fill={furBrown} transform={`rotate(-15, ${2*s}, ${10*s})`} />
      <rect x={0*s} y={6*s} width={1.5*s} height={2*s} fill={furWhite} transform={`rotate(-15, ${2*s}, ${10*s})`} />

      {/* Back Legs */}
      <OutlinedRect x={3*s} y={13*s} width={2*s} height={2*s} fill={furWhite} />
      <OutlinedRect x={10*s} y={13*s} width={2*s} height={2*s} fill={furWhite} />

      {/* Body */}
      <OutlinedRect x={3*s} y={9*s} width={10*s} height={5*s} fill={furWhite} rx={s} />
      <rect x={4*s} y={9*s} width={6*s} height={4*s} fill={furBrown} /> {/* Brown saddle */}

      {/* Front Legs */}
      <OutlinedRect x={3*s} y={14*s} width={2*s} height={2*s} fill={furWhite} />
      <OutlinedRect x={11*s} y={14*s} width={2*s} height={2*s} fill={furWhite} />

      {/* Head (Brown Top, White Muzzle) */}
      <OutlinedRect x={9*s} y={5*s} width={6*s} height={6*s} fill={furBrown} />
      <rect x={10*s} y={8*s} width={4*s} height={3*s} fill={furWhite} /> {/* Muzzle */}

      {/* Floppy Ears */}
      <OutlinedRect x={8*s} y={6*s} width={2*s} height={4*s} fill={furDark} />
      <OutlinedRect x={14*s} y={6*s} width={2*s} height={4*s} fill={furDark} />

      {/* Collar */}
      <rect x={9*s} y={10*s} width={6*s} height={1*s} fill={collar} />

      {/* Eyes & Nose */}
      <rect x={10.5*s} y={7*s} width={1*s} height={1*s} fill="#1e293b" />
      <rect x={13.5*s} y={7*s} width={1*s} height={1*s} fill="#1e293b" />
      <rect x={11.5*s} y={9*s} width={1.5*s} height={1*s} fill="#1e293b" />
    </g>
  );
};

// --- Decorative Tree (Enhanced) ---
export const PixelTree: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
    const s = PIXEL_SCALE * scale;
    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Trunk */}
            <OutlinedRect x={7*s} y={12*s} width={4*s} height={6*s} fill="#78350f" />
            <rect x={7*s} y={13*s} width={1*s} height={4*s} fill="#451a03" />

            {/* Leaves Layer 1 (Bottom) */}
            <OutlinedRect x={3*s} y={9*s} width={12*s} height={4*s} fill="#14532d" />
            {/* Leaves Layer 2 (Middle) */}
            <OutlinedRect x={2*s} y={6*s} width={14*s} height={4*s} fill="#166534" />
            {/* Leaves Layer 3 (Top) */}
            <OutlinedRect x={4*s} y={2*s} width={10*s} height={5*s} fill="#22c55e" />
            
            {/* Highlights */}
            <rect x={5*s} y={3*s} width={2*s} height={2*s} fill="#86efac" opacity="0.5" />
            <rect x={10*s} y={7*s} width={2*s} height={1*s} fill="#86efac" opacity="0.3" />
        </g>
    );
};

// --- Decorative Bush (Enhanced) ---
export const PixelBush: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
    const s = PIXEL_SCALE * scale;
    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Darker base */}
            <OutlinedRect x={2*s} y={5*s} width={12*s} height={5*s} fill="#14532d" rx={s} />
            {/* Lighter top */}
            <OutlinedRect x={3*s} y={3*s} width={10*s} height={5*s} fill="#22c55e" rx={s} />
            
            {/* Highlights */}
            <rect x={4*s} y={4*s} width={2*s} height={1*s} fill="#86efac" />
            <rect x={10*s} y={5*s} width={1*s} height={1*s} fill="#86efac" />

            {/* Berries */}
            <rect x={5*s} y={6*s} width={1*s} height={1*s} fill="#ef4444" />
            <rect x={9*s} y={7*s} width={1*s} height={1*s} fill="#ef4444" />
            <rect x={11*s} y={5*s} width={1*s} height={1*s} fill="#ef4444" />
        </g>
    );
};

// --- Decorative Rock (Enhanced) ---
export const PixelRock: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
    const s = PIXEL_SCALE * scale;
    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Base */}
            <OutlinedRect x={2*s} y={5*s} width={8*s} height={3*s} fill="#64748b" />
            {/* Top */}
            <OutlinedRect x={3*s} y={3*s} width={6*s} height={3*s} fill="#94a3b8" />
            
            {/* Highlight */}
            <rect x={4*s} y={4*s} width={2*s} height={1*s} fill="#cbd5e1" />
            
            {/* Moss */}
            <rect x={6*s} y={3*s} width={2*s} height={2*s} fill="#4ade80" opacity="0.6" />
        </g>
    );
};

// --- Decorative Flower ---
export const PixelFlower: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
    const s = PIXEL_SCALE * scale;
    return (
        <g transform={`translate(${x}, ${y})`}>
             {/* Stem */}
             <rect x={2*s} y={3*s} width={1*s} height={2*s} fill="#22c55e" />
             {/* Petals */}
             <rect x={1*s} y={1*s} width={1*s} height={1*s} fill="#f472b6" />
             <rect x={3*s} y={1*s} width={1*s} height={1*s} fill="#f472b6" />
             <rect x={2*s} y={0*s} width={1*s} height={1*s} fill="#f472b6" />
             <rect x={2*s} y={2*s} width={1*s} height={1*s} fill="#f472b6" />
             {/* Center */}
             <rect x={2*s} y={1*s} width={1*s} height={1*s} fill="#facc15" />
        </g>
    );
};

// --- Decorative Grass Tuft ---
export const PixelGrass: React.FC<PixelProps> = ({ x, y, scale = 1 }) => {
    const s = PIXEL_SCALE * scale;
    return (
        <g transform={`translate(${x}, ${y})`}>
            <rect x={0*s} y={2*s} width={1*s} height={2*s} fill="#166534" />
            <rect x={1*s} y={1*s} width={1*s} height={3*s} fill="#22c55e" />
            <rect x={2*s} y={2*s} width={1*s} height={2*s} fill="#166534" />
        </g>
    );
};