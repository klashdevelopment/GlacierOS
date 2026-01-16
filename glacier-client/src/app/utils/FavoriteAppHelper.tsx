import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getApps, getWithName } from "./AppListHelper";
import { nameToID, useToggleStoreApp } from "../windows/store/StoreApps";
import { useFavorites } from "../windows/useFavorites";

export default function FavoriteGrid() {
    const favs = useFavorites();
    const toggleStoreApp = useToggleStoreApp();

    function favApp(fav: any) {
        return <div className="favorite-item"
            onClick={() => toggleStoreApp(nameToID(fav.name, fav.url), fav)}>
            <img
                src={fav.image || ""}
                alt={fav.name}
            />
            <div className="title">{fav.name}</div>
        </div>
    }

    return (
        <div className="favorite-grid">
            {[
                favApp({ name: "Theme Creator", image: "/image/thememaker.webp", url: "glacier://thememaker" }),
                favApp({ name: "Hydra Creator", image: "/image/hydra.webp", url: "glacier://hydracreator" })
            ]}
            {favs.getAll().map((fav) => (
                favApp(fav)
            ))}
        </div>
    );
}