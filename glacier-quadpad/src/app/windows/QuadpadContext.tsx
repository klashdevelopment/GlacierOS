import React, { createContext, useContext, useEffect, useState } from 'react';

export interface QuadpadSettings {
    cssImports: string[];
    jsImports: string[];
    title: string;
    color: string;
    borderWidth: number;
    shareCodeWithBrainbase: boolean;

    setCssImports: (value: string[]) => void;
    setJsImports: (value: string[]) => void;
    setTitle: (value: string) => void;
    setColor: (value: string) => void;
    setShareCodeWithBrainbase: (value: boolean) => void;
    setBorderWidth: (value: number) => void;
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
        color: '#6955c6',
        setColor: () => {},
        borderWidth: 1,
        setBorderWidth: () => {},
        title: 'Quadpad Export',
        setTitle: () => {},
        shareCodeWithBrainbase: true,
        setShareCodeWithBrainbase: () => {},
    });

    // Step 2: Add functions after initial state setup
    const setCssImports = (value: string[]) => setQuadpadSettings((prev: any) => ({ ...prev, cssImports: value }));
    const setJsImports = (value: string[]) => setQuadpadSettings((prev: any) => ({ ...prev, jsImports: value }));
    const setColor = (value: string) => setQuadpadSettings((prev: any) => ({ ...prev, color: value }));
    const setBorderWidth = (value: number) => setQuadpadSettings((prev: any) => ({ ...prev, borderWidth: value }));
    const setTitle = (value: string) => setQuadpadSettings((prev: any) => ({ ...prev, title: value }));
    const setShareCodeWithBrainbase = (value: boolean) => setQuadpadSettings((prev: any) => ({ ...prev, shareCodeWithBrainbase: value }));

    useEffect(() => {
        setQuadpadSettings((prev: any) => ({
            ...prev,
            setCssImports,
            setJsImports,
            setColor,
            setBorderWidth,
            setTitle,
            setShareCodeWithBrainbase
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