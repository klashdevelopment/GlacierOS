import { getWithCategory } from "@/app/utils/AppListHelper";
import { toggleStoreApp, nameToID } from "./StoreApps";

export default function Devtools() {
    return (
        <>
            <h1>Developer Tools</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Devtools').map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function () { toggleStoreApp(nameToID(app.name), app) }} />
                        <div className="title" onClick={function () { toggleStoreApp(nameToID(app.name), app) }}>{app.name}</div>
                    </div>
                ))}
            </div>
        </>
    )
}