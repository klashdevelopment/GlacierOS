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
<script src="https://raw.githubusercontent.com/klashdevelopment/Hydra/main/src/hydra.js"></script>
<script>
    %GAME
</script>
<script>
/* Basic error handler */
window.onerror = function(message, source, lineno, colno, error) {
    const popup = \`<div onclick="this.remove()" style="cursor:pointer;background:#ffffff02;color:white;position:absolute;bottom:5px;right:5px;width:200px;height:100px;overflow:auto;">
        <strong>Error:</strong> \${message}<br>
        <strong>L</strong>\${lineno} C\${colno}<br>
        <strong>Click to dismiss</strong><br><br>
        <strong>Stack Trace:</strong><br>
        <pre>\${error?.stack}</pre>
    </div>\`;
    document.body.appendChild(popup);
}
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