import React, { useMemo, useRef } from 'react';
import { AnimalType, GridItem } from '../types';
import { 
  PixelChicken, PixelRabbit, PixelCrane, PixelAnt, PixelTurtle, PixelSpider, PixelDog,
  PixelShadow, 
  PixelTree, PixelBush, PixelRock, PixelFlower, PixelGrass,
  PIXEL_SCALE 
} from './VoxelAssets';

interface IsometricCanvasProps {
  count1: number;
  count2: number;
  type1: AnimalType;
  type2: AnimalType;
  seed: number;
  cageScale: number; // 0.0 to 1.0 (relative factor)
  onDownloadRef?: (ref: React.RefObject<SVGSVGElement>) => void;
}

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 600;
const SPRITE_SIZE = 16 * PIXEL_SCALE; // ~64px

// Base Cage Config
const BASE_CAGE_W = 600;
const BASE_CAGE_H = 450;
const CANVAS_CENTER_X = VIEW_WIDTH / 2;
const CANVAS_CENTER_Y = VIEW_HEIGHT / 2;

// Defines a decorative item
interface DecorItem {
    id: string;
    type: 'TREE' | 'BUSH' | 'ROCK' | 'FLOWER' | 'GRASS';
    x: number;
    y: number;
}

// Generate animals INSIDE the cage
const generateAnimals = (
    count1: number, 
    count2: number, 
    type1: AnimalType, 
    type2: AnimalType, 
    seed: number,
    cageDims: { x: number, y: number, w: number, h: number }
): GridItem[] => {
  const items: GridItem[] = [];
  const typesToAssign: AnimalType[] = [
    ...Array(count1).fill(type1),
    ...Array(count2).fill(type2)
  ];

  // Pseudo-random shuffle based on seed triggers re-render
  for (let i = typesToAssign.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [typesToAssign[i], typesToAssign[j]] = [typesToAssign[j], typesToAssign[i]];
  }

  const existingPoints: {x: number, y: number}[] = [];

  typesToAssign.forEach((type, index) => {
    let bestX = 0, bestY = 0, placed = false, maxAttempts = 50;

    while (!placed && maxAttempts > 0) {
        // Spawn strictly inside cage bounds with some padding
        const pad = 20;
        const x = cageDims.x + pad + Math.random() * (cageDims.w - SPRITE_SIZE - pad * 2);
        const y = cageDims.y + pad + Math.random() * (cageDims.h - SPRITE_SIZE - pad * 2);

        let tooClose = false;
        for (const p of existingPoints) {
            const dist = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
            if (dist < (SPRITE_SIZE * 0.7)) {
                tooClose = true;
                break;
            }
        }

        if (!tooClose) {
            bestX = x;
            bestY = y;
            placed = true;
        }
        maxAttempts--;
    }

    if (!placed) {
        // Fallback random within cage
        bestX = cageDims.x + 20 + Math.random() * (cageDims.w - SPRITE_SIZE - 40);
        bestY = cageDims.y + 20 + Math.random() * (cageDims.h - SPRITE_SIZE - 40);
    }

    existingPoints.push({x: bestX, y: bestY});
    items.push({
      id: `animal-${index}`,
      type,
      x: bestX,
      y: bestY,
      variant: Math.random() > 0.5 ? 1 : 0
    });
  });

  return items.sort((a, b) => a.y - b.y);
};

// Generate decorations OUTSIDE the cage
const generateDecor = (seed: number, cageDims: { x: number, y: number, w: number, h: number }): DecorItem[] => {
    const items: DecorItem[] = [];
    
    // Major Items (Trees, Bushes, Rocks)
    const majorCount = 12; 
    for (let i = 0; i < majorCount; i++) {
        let x = 0, y = 0, valid = false;
        
        while(!valid) {
            x = Math.random() * (VIEW_WIDTH - SPRITE_SIZE);
            y = Math.random() * (VIEW_HEIGHT - SPRITE_SIZE);

            // Simple AABB collision check with Cage (plus a little buffer)
            const buffer = 10;
            const inCageX = x > cageDims.x - SPRITE_SIZE - buffer && x < cageDims.x + cageDims.w + buffer;
            const inCageY = y > cageDims.y - SPRITE_SIZE - buffer && y < cageDims.y + cageDims.h + buffer;
            
            if (!(inCageX && inCageY)) {
                valid = true;
            }
        }

        const rand = Math.random();
        let type: DecorItem['type'] = 'ROCK';
        if (rand > 0.6) type = 'TREE';
        else if (rand > 0.3) type = 'BUSH';

        items.push({ id: `major-${i}`, type, x, y });
    }

    // Minor Items (Flowers, Grass Tufts)
    const minorCount = 30;
    for (let i = 0; i < minorCount; i++) {
        let x = Math.random() * VIEW_WIDTH;
        let y = Math.random() * VIEW_HEIGHT;
        
        const rand = Math.random();
        let type: DecorItem['type'] = rand > 0.5 ? 'FLOWER' : 'GRASS';
        
        items.push({ id: `minor-${i}`, type, x, y });
    }

    return items.sort((a, b) => a.y - b.y);
};

const generateBackgroundTexture = (seed: number) => {
    const dots = [];
    for(let i = 0; i < 400; i++) {
        dots.push({
            x: Math.random() * VIEW_WIDTH,
            y: Math.random() * VIEW_HEIGHT,
            size: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '#22c55e' : '#86efac',
            opacity: Math.random() * 0.4 + 0.1
        });
    }
    return dots;
};

// Generates diagonal chain-link lines (Diamond Grid)
const generateMeshLines = (cageDims: { x: number, y: number, w: number, h: number }) => {
    const lines = [];
    const step = 16; // Density of the mesh (Lower = Denser)
    const { x, y, w, h } = cageDims;
    
    // Diagonal Set 1: Top-Left to Bottom-Right (\)
    // We sweep x-offset from -h to w to cover the whole box with diagonal cuts
    for (let i = -h; i <= w; i += step) {
        lines.push({
            x1: x + i,       y1: y,
            x2: x + i + h,   y2: y + h
        });
    }

    // Diagonal Set 2: Bottom-Left to Top-Right (/)
    for (let i = -h; i <= w; i += step) {
        lines.push({
            x1: x + i,       y1: y + h,
            x2: x + i + h,   y2: y
        });
    }

    return lines;
};

const IsometricCanvas: React.FC<IsometricCanvasProps> = ({ 
    count1, count2, type1, type2, seed, cageScale, onDownloadRef 
}) => {
    
  // Calculate dynamic cage dimensions
  const cageDims = useMemo(() => {
      const w = BASE_CAGE_W * cageScale;
      const h = BASE_CAGE_H * cageScale;
      const x = CANVAS_CENTER_X - (w / 2);
      const y = CANVAS_CENTER_Y - (h / 2);
      return { x, y, w, h };
  }, [cageScale]);

  const animals = useMemo(() => 
    generateAnimals(count1, count2, type1, type2, seed, cageDims), 
    [count1, count2, type1, type2, seed, cageDims]
  );
  
  const decor = useMemo(() => generateDecor(seed, cageDims), [seed, cageDims]); 
  const bgTexture = useMemo(() => generateBackgroundTexture(seed), [seed]);
  const meshLines = useMemo(() => generateMeshLines(cageDims), [cageDims]);

  const svgRef = useRef<SVGSVGElement>(null);
  
  React.useEffect(() => {
    if(onDownloadRef) onDownloadRef(svgRef);
  }, [onDownloadRef]);

  const viewBox = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#2d3748]">
        
        <svg 
            ref={svgRef}
            viewBox={viewBox} 
            className="w-full h-full z-10 relative"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ shapeRendering: 'crispEdges' }}
        >
             <defs>
                <clipPath id="cage-clip">
                    <rect x={cageDims.x} y={cageDims.y} width={cageDims.w} height={cageDims.h} />
                </clipPath>
            </defs>

            {/* --- 1. Background Layer --- */}
            <g id="grp-bg">
                <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="#4ade80" />
                <g id="bg-texture">
                    {bgTexture.map((dot, idx) => (
                        <rect 
                            key={idx} 
                            x={dot.x} y={dot.y} 
                            width={dot.size} height={dot.size} 
                            fill={dot.color} 
                            fillOpacity={dot.opacity} 
                        />
                    ))}
                </g>
            </g>

            {/* --- 2. Cage Floor (The "Inside" Area) --- */}
            <g id="grp-cage-floor">
                <rect 
                    x={cageDims.x} y={cageDims.y} 
                    width={cageDims.w} height={cageDims.h} 
                    fill="#78350f" 
                    fillOpacity="0.2"
                    stroke="#5c2b0b" strokeWidth="4"
                />
                <rect 
                    x={cageDims.x} y={cageDims.y} 
                    width={cageDims.w} height={cageDims.h} 
                    fill="none" stroke="black" strokeWidth="4" strokeOpacity="0.2"
                />
            </g>

            {/* --- 3. Back Fencing of Cage --- */}
            <g id="grp-cage-structure-back">
                <rect x={cageDims.x} y={cageDims.y - 10} width={cageDims.w} height={20} fill="#92400e" stroke="black" strokeWidth="2" />
                {/* Back Top Bar */}
                <line x1={cageDims.x} y1={cageDims.y-5} x2={cageDims.x+cageDims.w} y2={cageDims.y-5} stroke="#78350f" strokeWidth="1" />
                <line x1={cageDims.x} y1={cageDims.y+5} x2={cageDims.x+cageDims.w} y2={cageDims.y+5} stroke="#78350f" strokeWidth="1" />
            </g>

            {/* Mesh with clip-path and lower opacity */}
            <g id="grp-mesh-back" opacity="0.1" clipPath="url(#cage-clip)">
                {meshLines.map((line, idx) => (
                    <line 
                        key={`bm-${idx}`}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke="#1e293b" strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                ))}
            </g>

            {/* --- 4. Decorative Items --- */}
            <g id="grp-decor">
                {decor.map(item => (
                    <g key={item.id}>
                        {item.type === 'TREE' && <PixelTree x={item.x} y={item.y} />}
                        {item.type === 'BUSH' && <PixelBush x={item.x} y={item.y} />}
                        {item.type === 'ROCK' && <PixelRock x={item.x} y={item.y} />}
                        {item.type === 'FLOWER' && <PixelFlower x={item.x} y={item.y} />}
                        {item.type === 'GRASS' && <PixelGrass x={item.x} y={item.y} />}
                    </g>
                ))}
            </g>

            {/* --- 5. Animals (Inside Cage) --- */}
            <g id="grp-animals">
                {animals.map(item => (
                    <g key={item.id} id={`animal-node-${item.id}`} data-type={item.type}>
                        <PixelShadow x={item.x} y={item.y} />
                        {item.type === AnimalType.Chicken && <PixelChicken x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        {item.type === AnimalType.Crane && <PixelCrane x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        {item.type === AnimalType.Ant && <PixelAnt x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        
                        {item.type === AnimalType.Rabbit && <PixelRabbit x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        {item.type === AnimalType.Turtle && <PixelTurtle x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        {item.type === AnimalType.Spider && <PixelSpider x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                        {item.type === AnimalType.Dog && <PixelDog x={item.x} y={item.y} facingLeft={item.variant === 1} />}
                    </g>
                ))}
            </g>

            {/* --- 6. Cage Foreground --- */}
            <g id="grp-mesh-front" opacity="0.08" pointerEvents="none" clipPath="url(#cage-clip)">
                 {meshLines.map((line, idx) => (
                    <line 
                        key={`fm-${idx}`}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke="#1e293b" strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                ))}
            </g>
            
            <g id="grp-cage-structure-front">
                {/* Wooden Posts */}
                {/* Left */}
                <g>
                    <rect x={cageDims.x - 10} y={cageDims.y - 20} width={20} height={cageDims.h + 40} fill="#92400e" stroke="black" strokeWidth="2" />
                    <line x1={cageDims.x} y1={cageDims.y-20} x2={cageDims.x} y2={cageDims.y+cageDims.h+20} stroke="#78350f" strokeWidth="1" />
                </g>
                
                {/* Right */}
                <g>
                    <rect x={cageDims.x + cageDims.w - 10} y={cageDims.y - 20} width={20} height={cageDims.h + 40} fill="#92400e" stroke="black" strokeWidth="2" />
                    <line x1={cageDims.x+cageDims.w} y1={cageDims.y-20} x2={cageDims.x+cageDims.w} y2={cageDims.y+cageDims.h+20} stroke="#78350f" strokeWidth="1" />
                </g>
                
                {/* Bottom */}
                <g>
                    <rect x={cageDims.x} y={cageDims.y + cageDims.h - 10} width={cageDims.w} height={20} fill="#92400e" stroke="black" strokeWidth="2" />
                    <line x1={cageDims.x} y1={cageDims.y+cageDims.h} x2={cageDims.x+cageDims.w} y2={cageDims.y+cageDims.h} stroke="#78350f" strokeWidth="1" />
                </g>
            </g>

        </svg>

    </div>
  );
};

export default IsometricCanvas;