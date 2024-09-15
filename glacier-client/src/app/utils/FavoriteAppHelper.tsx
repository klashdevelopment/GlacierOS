import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getApps, getWithName } from "./AppListHelper";
import { nameToID, toggleStoreApp } from "../windows/store/StoreApps";

export function useFavorites(): [string[], Dispatch<SetStateAction<string[]>>] {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        if (favorites.length > 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    useEffect(() => {
        const favorites = localStorage.getItem('favorites');
        if (favorites) {
            setFavorites(JSON.parse(favorites));
        }
    }, []);

    return [favorites, setFavorites];
}

export default function FavoriteAppHelper() {
    const [favorites, setFavorites] = useFavorites();

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            getApps().then(() => {
                setLoaded(true);
            }).catch(err => {
                throw err;
            });
        }
    }, [loaded]);

    return (
        <div className="favorite-grid">
            {loaded && favorites.map((app: string, index: number) => {
                return (
                    <div className="favorite-grid-item" key={index} onClick={function(){toggleStoreApp(nameToID(getWithName(app).name), getWithName(app))}}>
                            <>
                                <img src={getWithName(app).image} alt={getWithName(app).name} />
                                <b>{getWithName(app).name}</b>
                            </>
                    </div>
                );
            })}
        </div>
    );
}