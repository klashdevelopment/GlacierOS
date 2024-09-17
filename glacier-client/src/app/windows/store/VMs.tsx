import { getWithCategory } from "@/app/utils/AppListHelper";
import { toggleStoreApp, nameToID } from "./StoreApps";

export default function VMs() {
    return (
        <>
            <h1>Movies</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('Movies').map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function () { toggleStoreApp(nameToID(app.name), app) }} />
                        <div className="title" onClick={function () { toggleStoreApp(nameToID(app.name), app) }}>{app.name}</div>
                    </div>
                ))}
            </div>
            <h1>Virtual Machines</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('VMS').map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function () { toggleStoreApp(nameToID(app.name), app) }} />
                        <div className="title" onClick={function () { toggleStoreApp(nameToID(app.name), app) }}>{app.name}</div>
                    </div>
                ))}
            </div>
            <h1>Virtual Machine Alt-Providers</h1>
            <div className="store-games-panel store-panel store-grid">
                {getWithCategory('VMP').map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function () { toggleStoreApp(nameToID(app.name), app) }} />
                        <div className="title" onClick={function () { toggleStoreApp(nameToID(app.name), app) }}>{app.name}</div>
                    </div>
                ))}
            </div>
        </>
    )
}