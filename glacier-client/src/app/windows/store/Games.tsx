import FrameWindow from "@/app/components/FrameWindow"
import { getApps, getWithCategory } from "@/app/utils/AppListHelper"
import { Text } from "@fluentui/react"
import { useEffect } from "react";
import { useToggleStoreApp, nameToID } from "./StoreApps";
import { RatingDisplay } from "@fluentui/react-components";
import { PinFilled, PinOffFilled } from '@fluentui/react-icons';
import { appToFavoriteApp, FavoritesContextType, useFavorites } from "../useFavorites";

export function StoreGridItem(i: any, app: any, favs: FavoritesContextType) {
    const toggleStoreApp = useToggleStoreApp();
    return <div key={i} className="store-grid-item">
        <div className="store-grid-main" onClick={function () { toggleStoreApp(nameToID(app.name), app) }}>
            <img src={app.image} alt={app.name} />
            <div className="title">{app.name}</div>
        </div>
        {favs.has(app.name) ? (
            <div className="favorite-button" style={{ backgroundColor: 'rgb(128, 43, 43)' }}>
                <PinOffFilled onClick={() => {
                    favs.remove(app.name)
                }} />
            </div>
        ) : (
            <div className="favorite-button">
                <PinFilled onClick={() => {
                    favs.add(appToFavoriteApp(app))
                }} />
            </div>
        )}
    </div>
}

export default function Games() {
    const favs = useFavorites();
    return (
        <>
            <h1>Games</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Games').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
        </>
    )
}