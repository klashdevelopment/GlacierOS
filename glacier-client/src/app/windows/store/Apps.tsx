import FrameWindow from "@/app/components/FrameWindow"
import { getApps, getWithCategory } from "@/app/utils/AppListHelper"
import { Text } from "@fluentui/react";
import { RatingDisplay } from "@fluentui/react-components";
import { useEffect } from "react";
import { toggleStoreApp, nameToID } from "./StoreApps";
import { PinFilled, PinOffFilled } from '@fluentui/react-icons';
import { useFavorites } from "../useFavorites";
import { StoreGridItem } from "./Games";

export default function Apps() {
    const favs = useFavorites();
    return (
        <>
            <h1>Apps</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Apps').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
        </>
    )
}