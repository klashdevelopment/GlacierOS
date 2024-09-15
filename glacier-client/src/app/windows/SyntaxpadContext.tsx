"use client";
import React, { createContext, useContext, useState } from 'react';

interface SyntaxpadContextType {
    value: string | undefined;
    setValue: (value: string | undefined) => void;
    lang: string | undefined;
    setLang: (lang: string | undefined) => void;
}

const SyntaxpadContext = createContext<SyntaxpadContextType | undefined>(undefined);

export function SyntaxpadProvider({ children }: {children: React.ReactNode}) {
    const [value, setValue] = useState<string | undefined>(undefined);
    const [lang, setLang] = useState<string | undefined>("javascript");
    return (
        <SyntaxpadContext.Provider value={{ value, setValue, lang, setLang }}>
            {children}
        </SyntaxpadContext.Provider>
    );
};

export const useSyntaxpad = (): SyntaxpadContextType => {
    const context = useContext(SyntaxpadContext);
    if (!context) {
        throw new Error('useSyntaxpad must be used within a SyntaxpadProvider');
    }
    return context;
};