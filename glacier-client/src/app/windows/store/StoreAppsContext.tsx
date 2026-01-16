import React, { createContext, useContext, useState } from 'react';

interface OpenApp {
    name: string;
    url: string;
    cssInject?: string;
    image?: string;
    [key: string]: any;
}

interface StoreAppsContextType {
    openApps: OpenApp[];
    addApp: (app: OpenApp) => void;
    removeApp: (app: OpenApp) => void;
    removeViaProperty: (property: string, value: any) => void;
    exists: (property: string, value: any) => boolean;
}

const StoreAppsContext = createContext<StoreAppsContextType | undefined>(undefined);

export const StoreAppsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openApps, setOpenApps] = useState<OpenApp[]>([]);

    const addApp = (app: OpenApp) => {
        setOpenApps((prev) => [...prev, app]);
    };

    const removeApp = (app: OpenApp) => {
        setOpenApps((prev) => prev.filter((a) => a !== app));
    };
    const removeViaProperty = (property: string, value: any) => {
        setOpenApps((prev) => prev.filter((a) => a[property] !== value));
    }
    const exists = (property: string, value: any) => {
        return openApps.some((a) => a[property] === value);
    }

    return (
        <StoreAppsContext.Provider value={{ openApps, addApp, removeApp, removeViaProperty, exists }}>
            {children}
        </StoreAppsContext.Provider>
    );
};

export const useStoreApps = () => {
    const context = useContext(StoreAppsContext);
    if (!context) {
        throw new Error('useStoreApps must be used within a StoreAppsProvider');
    }
    return context;
};