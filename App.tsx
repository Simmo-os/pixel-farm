import React, { useState, useRef } from 'react';
import IsometricCanvas from './components/IsometricCanvas';
import { AnimalType } from './types';
import { PIXEL_SCALE } from './components/VoxelAssets';

// Declare JSZip assuming it's loaded via CDN
declare global {
  interface Window {
    JSZip: any;
  }
}
declare var JSZip: any;

// Constants matching IsometricCanvas for calculations
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 600;
const BASE_CAGE_W = 600;
const BASE_CAGE_H = 450;

// Define UI-focused palettes for Game Interfaces
const PALETTES = [
  {
    name: "WOODEN RPG", // Classic Board/Paper UI
    colors: ['#e6c698', '#885634', '#2b1d15', '#d73d29'] 
    // [Bg (Parchment), Border (Wood), Text (Ink), Accent (Seal)]
  },
  {
    name: "CYBER HUD", // Sci-fi Overlay
    colors: ['#0d1b1e', '#2a4d53', '#4da6ff', '#ffcc00']
    // [Bg (Dark), Panel, Text (Holo Blue), Alert (Yellow)]
  },
  {
    name: "FOREST MENU", // Cozy Nature UI
    colors: ['#f4f1e8', '#4a6b48', '#2f3a2f', '#e09f3e']
    // [Bg (Cream), Border (Leaf), Text (Dark Green), Accent (Honey)]
  },
  {
    name: "PIXEL ARCADE", // High Contrast Fun
    colors: ['#2c2137', '#76428a', '#ffffff', '#fac800']
    // [Bg (Deep Purple), Border (Bright Purple), Text (White), Accent (Gold)]
  }
];

const ALL_ANIMALS = [
    { label: 'Chicken', value: AnimalType.Chicken },
    { label: 'Crane', value: AnimalType.Crane },
    { label: 'Ant', value: AnimalType.Ant },
    { label: 'Rabbit', value: AnimalType.Rabbit },
    { label: 'Turtle', value: AnimalType.Turtle },
    { label: 'Spider', value: AnimalType.Spider },
    { label: 'Dog', value: AnimalType.Dog },
];

const getLegs = (type: AnimalType): number => {
    switch (type) {
        case AnimalType.Chicken: return 2;
        case AnimalType.Crane: return 2;
        case AnimalType.Ant: return 6;
        case AnimalType.Rabbit: return 4;
        case AnimalType.Turtle: return 4;
        case AnimalType.Spider: return 8;
        case AnimalType.Dog: return 4;
        default: return 0;
    }
}

const ColorSwatch = ({ color }: { color: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion if placed inside
    const hexNoHash = color.replace('#', '');
    navigator.clipboard.writeText(hexNoHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div 
      className="flex flex-col gap-1 cursor-pointer group relative"
      onClick={handleCopy}
      title="Click to copy HEX (no #)"
    >
      <div className="w-full h-6 rounded-sm border border-slate-600 shadow-sm relative overflow-hidden">
        <div 
          className="absolute inset-0 transition-transform group-hover:scale-110" 
          style={{ backgroundColor: color }} 
        />
        {copied && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] text-white font-bold">
            COPIED
          </div>
        )}
      </div>
      <span className="text-[10px] text-slate-500 font-mono uppercase text-center group-hover:text-slate-300 transition-colors">
        {color}
      </span>
    </div>
  );
};

function App() {
  const [count1, setCount1] = useState<number>(10);
  const [count2, setCount2] = useState<number>(5);
  const [type1, setType1] = useState<AnimalType>(AnimalType.Chicken);
  const [type2, setType2] = useState<AnimalType>(AnimalType.Rabbit);
  const [seed, setSeed] = useState<number>(1);
  const [cageSize, setCageSize] = useState<number>(0.8);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pixel-farm-${count1}-${type1}-${count2}-${type2}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLayeredExport = async () => {
    if (!svgRef.current || !window.JSZip) {
        if(!window.JSZip) alert("ZIP Library not loaded yet, please wait.");
        return;
    }
    
    setIsExporting(true);
    const zip = new JSZip();
    const serializer = new XMLSerializer();
    const originalSvg = svgRef.current;
    
    // Helper to create a partial SVG string by removing unwanted groups
    // Supports cropOffset: {x, y} to translate content to (0,0)
    const createPartialSvg = (keepGroups: string[], customViewBox?: string, cropOffset?: {x: number, y: number}) => {
        const clone = originalSvg.cloneNode(true) as SVGSVGElement;
        const allGroups = [
            'grp-bg', 
            'grp-cage-floor', 
            'grp-cage-structure-back', 
            'grp-mesh-back', 
            'grp-decor', 
            'grp-animals', 
            'grp-mesh-front', 
            'grp-cage-structure-front'
        ];
        
        allGroups.forEach(id => {
            if (!keepGroups.includes(id)) {
                const el = clone.getElementById(id);
                if (el) el.remove();
            }
        });

        if (customViewBox) {
            clone.setAttribute("viewBox", customViewBox);
            clone.removeAttribute("width");
            clone.removeAttribute("height");
        }

        // If we are cropping, wrap content in a translate group to move to origin
        if (cropOffset) {
            // Wrap all remaining children in a group
            const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
            wrapper.setAttribute("transform", `translate(${-cropOffset.x}, ${-cropOffset.y})`);
            
            while (clone.firstChild) {
                // Don't move defs if possible, but for simple structure it's ok. 
                // Actually, better to append children to wrapper.
                // Be careful with <defs>.
                const child = clone.firstChild;
                if (child.nodeName === 'defs') {
                    // keep defs at top level
                    clone.removeChild(child); // Remove temporarily to re-append later if needed, 
                    // or just skip moving it. But cloning complicates iterating.
                    // Easier approach: Create wrapper, iterate children array copy.
                } else {
                     wrapper.appendChild(child);
                }
            }
            
            // Re-add defs if they existed (for clip-paths)
            const defs = originalSvg.querySelector('defs');
            if (defs) {
                clone.insertBefore(defs.cloneNode(true), null);
            }
            
            clone.appendChild(wrapper);
        }

        return serializer.serializeToString(clone);
    };

    // 0. Full Scene (Complete SVG)
    zip.file("full_scene.svg", serializer.serializeToString(originalSvg));

    // 1. Background + Decor Layer (Keep full view)
    zip.file("background_decor.svg", createPartialSvg(['grp-bg', 'grp-decor']));

    // 2. Cage Layer (Floor, Structure, Mesh) - CROP TO CAGE SIZE
    const w = BASE_CAGE_W * cageSize;
    const h = BASE_CAGE_H * cageSize;
    const cx = VIEW_WIDTH / 2;
    const cy = VIEW_HEIGHT / 2;
    const x = cx - (w / 2);
    const y = cy - (h / 2);
    
    // Visual bounds including posts
    const cageX = x - 10;
    const cageY = y - 20;
    const cageW = w + 20;
    const cageH = h + 40;
    
    // Set viewBox to 0 0 W H, and translate content by -X -Y
    zip.file("cage.svg", createPartialSvg([
        'grp-cage-floor', 
        'grp-cage-structure-back', 
        'grp-mesh-back', 
        'grp-mesh-front', 
        'grp-cage-structure-front'
    ], `0 0 ${cageW} ${cageH}`, { x: cageX, y: cageY }));

    // 3. Representative Animals (Content-sized export)
    const animalsGroup = originalSvg.getElementById('grp-animals');
    if (animalsGroup) {
        const activeTypes = Array.from(new Set([type1, type2])); 
        
        // Get all rendered animal elements
        const animalElements = Array.from(animalsGroup.querySelectorAll('g[data-type]'));

        activeTypes.forEach(animalType => {
            // Find the FIRST element that matches the current type
            const targetEl = animalElements.find(el => el.getAttribute('data-type') === animalType) as SVGGElement;

            if (targetEl) {
                let bbox: DOMRect | null = null;
                try {
                    bbox = targetEl.getBBox();
                } catch(e) {
                    console.warn("Could not get BBox", e);
                }

                if (bbox) {
                    const padding = 20;
                    const bx = bbox.x - padding;
                    const by = bbox.y - padding;
                    const bw = bbox.width + (padding * 2);
                    const bh = bbox.height + (padding * 2);

                    // We create a clean SVG just for this animal
                    const clone = originalSvg.cloneNode(true) as SVGSVGElement;
                    
                    // Clear everything
                    while (clone.firstChild) {
                        clone.removeChild(clone.firstChild);
                    }
                    
                    // Add Wrapper with translation
                    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    wrapper.setAttribute("transform", `translate(${-bx}, ${-by})`);
                    
                    // Clone and append JUST the target animal
                    wrapper.appendChild(targetEl.cloneNode(true));
                    
                    clone.appendChild(wrapper);
                    
                    // Set ViewBox to 0 0 W H
                    clone.setAttribute("viewBox", `0 0 ${bw} ${bh}`);
                    clone.removeAttribute("width");
                    clone.removeAttribute("height");

                    zip.file(`${animalType}.svg`, serializer.serializeToString(clone));
                }
            }
        });
    }

    // Generate ZIP and trigger download
    try {
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pixel-farm-layers-${Date.now()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error("Failed to generate zip", e);
        alert("Failed to generate ZIP file.");
    }
    
    setIsExporting(false);
  };

  const handleRandomize = () => {
    setSeed(Math.random());
  };

  const legs1 = getLegs(type1);
  const legs2 = getLegs(type2);
  const totalHeads = count1 + count2;
  const totalLegs = (count1 * legs1) + (count2 * legs2);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-mono">
      
      {/* Sidebar / Controls */}
      <aside className="w-full md:w-80 bg-slate-800 border-r-4 border-slate-700 p-6 flex flex-col gap-6 z-20 shadow-2xl overflow-y-auto custom-scrollbar">
        
        {/* Inputs */}
        <div className="space-y-5 mt-4">
          
          {/* Group 1 */}
          <div className="bg-slate-900 p-4 rounded border-2 border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-yellow-500 text-sm pixel-font">ANIMAL 1</label>
                <select 
                    value={type1}
                    onChange={(e) => setType1(e.target.value as AnimalType)}
                    className="bg-slate-800 text-xs text-slate-200 border border-slate-600 rounded px-1 py-1 focus:outline-none"
                >
                    {ALL_ANIMALS.filter(opt => opt.value !== type2).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            
            <label className="block text-xs text-slate-400 mb-2">COUNT: {count1}</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" max="50" 
                value={count1} 
                onChange={(e) => setCount1(parseInt(e.target.value))}
                className="w-full accent-yellow-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Group 2 */}
          <div className="bg-slate-900 p-4 rounded border-2 border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-pink-400 text-sm pixel-font">ANIMAL 2</label>
                <select 
                    value={type2}
                    onChange={(e) => setType2(e.target.value as AnimalType)}
                    className="bg-slate-800 text-xs text-slate-200 border border-slate-600 rounded px-1 py-1 focus:outline-none"
                >
                    {ALL_ANIMALS.filter(opt => opt.value !== type1).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <label className="block text-xs text-slate-400 mb-2">COUNT: {count2}</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" max="50" 
                value={count2} 
                onChange={(e) => setCount2(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Cage Size */}
          <div className="bg-slate-900 p-4 rounded border-2 border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
            <label className="block text-blue-400 text-sm mb-2 pixel-font">CAGE SIZE</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0.3" max="1.0" step="0.05"
                value={cageSize} 
                onChange={(e) => setCageSize(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Color Palette Section (Collapsible) */}
        <div className="bg-slate-900 rounded border border-slate-700 overflow-hidden">
            <button 
                onClick={() => setShowPalette(!showPalette)}
                className="w-full flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-750 transition-colors text-xs font-bold text-slate-400 tracking-wider"
            >
                <span>MATCHING PALETTES</span>
                <span>{showPalette ? '[-]' : '[+]'}</span>
            </button>
            
            {showPalette && (
                <div className="p-4 space-y-4 border-t border-slate-700">
                    {PALETTES.map((palette) => (
                        <div key={palette.name}>
                        <div className="text-[10px] text-slate-500 mb-1 font-bold">{palette.name}</div>
                        <div className="grid grid-cols-4 gap-2">
                            {palette.colors.map((c) => (
                            <ColorSwatch key={c} color={c} />
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-700 p-2 rounded">
                <div className="text-xs text-slate-400">HEADS</div>
                <div className="text-xl text-white">{totalHeads}</div>
            </div>
            <div className="bg-slate-700 p-2 rounded">
                <div className="text-xs text-slate-400">LEGS</div>
                <div className="text-xl text-white">{totalLegs}</div>
            </div>
        </div>

        {/* Action */}
        <div className="space-y-3 mt-auto pt-4">
            <button 
                onClick={handleRandomize}
                className="w-full py-3 px-4 bg-slate-600 text-white rounded border-b-4 border-slate-900 hover:bg-slate-500 hover:border-slate-800 active:border-b-0 active:translate-y-1 font-bold transition-all text-sm pixel-font mb-2"
            >
                RANDOMIZE SCENE
            </button>

            <button 
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-green-600 text-white rounded border-b-4 border-green-800 hover:bg-green-500 hover:border-green-700 active:border-b-0 active:translate-y-1 font-bold transition-all text-sm pixel-font"
            >
                EXPORT SVG
            </button>

            <button 
                onClick={handleLayeredExport}
                disabled={isExporting}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded border-b-4 border-indigo-800 hover:bg-indigo-500 hover:border-indigo-700 active:border-b-0 active:translate-y-1 font-bold transition-all text-sm pixel-font disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isExporting ? 'EXPORTING...' : 'EXPORT LAYERS'}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col gap-6 relative overflow-y-auto items-center justify-center bg-[#0d131f]">
        
        {/* Canvas Container - Enforce 4:3 Aspect Ratio Logic visually */}
        <div className="w-full max-w-4xl aspect-[4/3] relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-slate-800 rounded-lg overflow-hidden">
          <IsometricCanvas 
              count1={count1} 
              count2={count2}
              type1={type1}
              type2={type2}
              seed={seed}
              cageScale={cageSize}
              onDownloadRef={(ref) => svgRef.current = ref.current} 
          />
        </div>

        <div className="text-center text-slate-500 text-xs mt-4">
            Pixel Art Farm Generator
        </div>
      </main>

    </div>
  );
}

export default App;