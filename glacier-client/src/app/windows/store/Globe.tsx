import { getCustomFilter, getWithCategory } from "@/app/utils/AppListHelper";
import { StoreGridItem } from "./Games";
import { useFavorites } from "../useFavorites";
import { useEffect, useState } from "react";
import { iconSets } from "../ThemeMaker";
import { formatName } from "./StoreApps";

function qapp(name: string, image: string, url: string) {
    return {
        name: name,
        image: image,
        url: url,
        category: '',
        description: '',
        unblock: false
    }
}

export default function Globe() {
    const favs = useFavorites();
    const [extraApps, setExtraApps] = useState<any[]>([]);
    const [appTypes, setAppTypes] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const appNames = [
            { name: "Settings", icon: "settings.webp", url: "glacier://settings", path: "" },
            { name: "File Explorer", icon: "explorer.webp", url: "glacier://file-explorer", path: "icons" },
            { name: "Terminal", icon: "terminal.webp", url: "glacier://terminal", path: "icons" },
            { name: "Microsoft Edge", icon: "edge.webp", url: "glacier://edge", path: "icons" },
            { name: "Dualler", icon: "dueller.webp", url: "glacier://dualler", path: "" },
            { name: "Calculator", icon: "calculator.webp", url: "glacier://calculator", path: "icons" },
            { name: "Camera", icon: "camera.webp", url: "glacier://camera", path: "icons" }
        ];

        const groupedByType: { [key: string]: any[] } = {};

        appNames.forEach(app => {
            iconSets.forEach(iconSet => {
                const os = iconSet.value;
                const iconPath = app.path ? `/${os}/${app.path}/${app.icon}` : `/${os}/${app.icon}`;
                const formattedApp = qapp(`${formatName(os, app.name)} (${os})`, iconPath, app.url);
                if (!groupedByType[app.name]) groupedByType[app.name] = [];
                groupedByType[app.name].push(formattedApp);
            });
        });

        setAppTypes(groupedByType);
    }, []);

    return (
        <>
            <h1>Non-store Apps</h1>
            <span>You can choose what app icon you want to show when the app is pinned to the desktop. Functionally, the apps remain the same.</span>
            {Object.entries(appTypes).map(([type, apps]) => (
                <div key={type}>
                    <h2>{type}</h2>
                    <div className="store-games-panel store-panel store-grid">
                        {apps.map((app, i) => StoreGridItem(i, app, favs))}
                    </div>
                </div>
            ))}
        </>
    );
}