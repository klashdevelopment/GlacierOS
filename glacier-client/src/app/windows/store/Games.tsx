import FrameWindow from "@/app/components/FrameWindow"
import { getApps, getWithCategory } from "@/app/utils/AppListHelper"
import { Text } from "@fluentui/react"
import { useEffect } from "react";
import { toggleStoreApp, nameToID } from "./StoreApps";
import { RatingDisplay } from "@fluentui/react-components";
import { PinFilled, PinOffFilled } from '@fluentui/react-icons';
import { useFavorites } from "@/app/utils/FavoriteAppHelper";

export default function Games() {
    return (
        <>
            <h1>Games</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Games').map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function(){toggleStoreApp(nameToID(app.name), app)}} />
                        <div className="title" onClick={function(){toggleStoreApp(nameToID(app.name), app)}}>{app.name}</div>
                    </div>
                ))}
            </div>
        </>
    )
}