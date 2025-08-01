import { getWithCategory } from "@/app/utils/AppListHelper";
import { toggleStoreApp, nameToID } from "./StoreApps";
import { StoreGridItem } from "./Games";
import { useFavorites } from "../useFavorites";

export default function VMs() {
    const favs = useFavorites();
    return (
        <>
            <h1>Movies</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Movies').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
            <h1>Virtual Machines</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('VMS').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
            <h1>Virtual Machine Alt-Providers</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('VMP').map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>
        </>
    )
}