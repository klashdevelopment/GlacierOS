import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { nameToID, toggleStoreApp } from "./store/StoreApps";

export interface FavoriteApp {
    name: string;
    image: string;
    url: string;
    unblock: boolean;
    description: string;
}

const STORAGE_KEY = "favorite-apps";

function getStoredFavorites(): FavoriteApp[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function setStoredFavorites(favorites: FavoriteApp[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function appToFavoriteApp(app: any): FavoriteApp {
    return {
        name: app.name,
        image: app.image,
        url: app.url,
        unblock: app.unblock,
        description: app.description
    };
}

export interface FavoritesContextType {
    favorites: FavoriteApp[];
    getAll: () => FavoriteApp[];
    getFromName: (name: string) => FavoriteApp | undefined;
    remove: (name: string) => void;
    add: (app: FavoriteApp) => void;
    has: (name: string) => boolean;
    open: (name: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteApp[]>([]);

    useEffect(() => {
        setFavorites(getStoredFavorites());
    }, []);

    const getAll = useCallback(() => favorites, [favorites]);

    const getFromName = useCallback(
        (name: string) => favorites.find(app => app.name === name),
        [favorites]
    );

    const remove = useCallback((name: string) => {
        setFavorites(prev => {
            const updated = prev.filter(app => app.name !== name);
            setStoredFavorites(updated);
            return updated;
        });
    }, []);

    const add = useCallback((app: FavoriteApp) => {
        setFavorites(prev => {
            if (!prev.find(fav => fav.name === app.name)) {
                const updated = [...prev, app];
                setStoredFavorites(updated);
                return updated;
            }
            return prev;
        });
    }, []);

    const has = useCallback(
        (name: string) => !!favorites.find(app => app.name === name),
        [favorites]
    );

    const open = useCallback(
        (name: string) => {
            const app = favorites.find(app => app.name === name);
            if (app) {
                toggleStoreApp(nameToID(app.name), app);
            }
        },
        [favorites]
    );

    return (
        <FavoritesContext.Provider value={{ favorites, getAll, getFromName, remove, add, has, open }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
    return ctx;
}