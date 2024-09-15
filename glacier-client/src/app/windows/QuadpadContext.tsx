import React, { createContext, useContext, useEffect, useState } from 'react';

interface QuadpadSettings {
    cssImports: string[];
    jsImports: string[];

    setCssImports: (value: string[]) => void;
    setJsImports: (value: string[]) => void;
}

interface QuadpadContextType {
    css: string;
    setCss: (value: string) => void;
    js: string;
    setJs: (lang: string) => void;
    html: string;
    setHtml: (lang: string) => void;
    settings: QuadpadSettings;
    setQuadpadSettings: (value: QuadpadSettings) => void;
}

const QuadpadContext = createContext<QuadpadContextType | undefined>(undefined);

export function QuadpadProvider({ children }: { children: React.ReactNode }) {
    const [css, setCss] = useState("/* CSS */\nhtml, body {\n    background: black;\n    color: white;\n}");
    const [html, setHtml] = useState("<!--- HTML --->\n<h1>Hello, World!</h1>");
    const [js, setJs] = useState("// JavaScript");

    // Step 1: Declare state without functions
    const [settings, setQuadpadSettings] = useState<QuadpadSettings>({
        cssImports: [],
        jsImports: [],
        setCssImports: () => {},
        setJsImports: () => {},
    });

    // Step 2: Add functions after initial state setup
    const setCssImports = (value: string[]) => setQuadpadSettings(prev => ({ ...prev, cssImports: value }));
    const setJsImports = (value: string[]) => setQuadpadSettings(prev => ({ ...prev, jsImports: value }));

    useEffect(() => {
        setQuadpadSettings(prev => ({
            ...prev,
            setCssImports,
            setJsImports,
        }));
    }, []);

    return (
        <QuadpadContext.Provider value={{ css, setCss, js, setJs, html, setHtml, settings, setQuadpadSettings }}>
            {children}
        </QuadpadContext.Provider>
    );
}

export const useQuadpad = (): QuadpadContextType => {
    const context = useContext(QuadpadContext);
    if (!context) {
        throw new Error('useQuadpad must be used within a SyntaxpadProvider');
    }
    return context;
};