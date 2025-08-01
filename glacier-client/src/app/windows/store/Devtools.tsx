import { getWithCategory } from "@/app/utils/AppListHelper";
import { toggleStoreApp, nameToID } from "./StoreApps";
import { StoreGridItem } from "./Games";
import { useFavorites } from "../useFavorites";

export default function Devtools() {
    const favs = useFavorites();
    return (
        <>
            <h1>Developer Tools</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Devtools').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
        </>
    )
}