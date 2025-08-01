"use client";
import React, { createContext, useContext, useState } from 'react';

export type ActiveWindow = 'fr_hydraw' | 'fr_docs' | 'html' | 'examples' | 'hidden';

export interface HydraContextType {
    value: string | undefined;
    setValue: (value: string | undefined) => void;
    activeWindow: ActiveWindow;
    setActiveWindow: (window: ActiveWindow) => void;
    html: string;
    setHtml: (html: string) => void;
}

const HydraContext = createContext<HydraContextType | undefined>(undefined);

export function HydraProvider({ children }: { children: React.ReactNode }) {
    const [value, setValue] = useState<string | undefined>(`// Welcome to Hydra!
const lib = new HydraCanvasLib('game');

lib.loop(60);`);
    const [activeWindow, setActiveWindow] = useState<ActiveWindow>('fr_docs');
    const [html, setHtml] = useState<string>(`<style>
    body {
        background-color: #282c34;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    canvas {
        border: 3px solid #ffffff20;
        scale: 0.5; /* Adjust scale if needed */
    }
</style>
<canvas id="game"></canvas>
<script src="https://raw.githack.com/klashdevelopment/Hydra/main/hydra.js"></script>
<script>
    %GAME
</script>`);
    return (
        <HydraContext.Provider value={{ value, setValue, activeWindow, setActiveWindow, html, setHtml }}>
            {children}
        </HydraContext.Provider>
    );
}

export const useHydra = (): HydraContextType => {
    const context = useContext(HydraContext);
    if (!context) {
        throw new Error('useHydra must be used within a HydraProvider');
    }
    return context;
};