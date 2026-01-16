import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

'use client';


interface UVContextType {
    isUV: boolean | null;
}

const UVContext = createContext<UVContextType | undefined>(undefined);

export function UVProvider({ children }: { children: ReactNode }) {
    const [isUV, setIsUV] = useState<boolean | null>(null);

    useEffect(() => {
        if (isUV === null) {
            initializeIsUV();
        }
    }, [isUV]);

    const initializeIsUV = async () => {
        useEffect(() => {
            if (window.location.pathname.includes('uv/')) {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 400);

                fetch('/isUV', { signal: controller.signal })
                    .then(response => {
                        clearTimeout(timeout);
                        if (!response.ok) throw new Error('Network response was not ok');
                        setIsUV(true);
                    })
                    .catch(error => {
                        setIsUV(false);
                        if (error.name === 'AbortError') {
                            console.error('Request timed out, no UV detected');
                        } else {
                            console.error('Fetch error:', error);
                        }
                    });
            }
        }, []);
    };

    return (
        <UVContext.Provider value={{ isUV }}>
            {children}
        </UVContext.Provider>
    );
}

export function useUV(): boolean | null {
    const context = useContext(UVContext);
    if (context === undefined) {
        throw new Error('useUV must be used within UVProvider');
    }
    return context.isUV;
}