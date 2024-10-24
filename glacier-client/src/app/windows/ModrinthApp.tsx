import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents, Button } from "@fluentui/react-components";
import Window from "../components/Window";
import { useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SearchRegular, RecordStopRegular, ArrowRotateClockwiseRegular, ArrowRotateCounterclockwiseRegular, ArrowRedoRegular } from "@fluentui/react-icons";
import { registerSWandset } from "../utils/doSWStuff";
import "./lunar.css";
import contsants from "../Constants";
import { nameToID, toggleStoreApp } from "./store/StoreApps";

interface SelectedClientData {
    name: string;
    version: string;
    icon: string;
    windowID: string;
    windowURL: string;
    windowName: string;
}

const clients = {
    "boost": {
        name: "Boost",
        version: "1.8.9+",
        icon: "/image/b.png",
        windowID: "boost",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/boost",
        windowName: "Minecraft (boost)"
    },
    "glacier": {
        name: "Glacier",
        version: "1.8.9",
        icon: "/windows/glacierwhite.png",
        windowID: "glacier",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/glacier",
        windowName: "Minecraft (glacier)"
    },
}

export default function ModrinthApp() {
    const [selectedClient, setSelectedClient] = useState<SelectedClientData>(clients.glacier);

    function launchGame() {
        let launcher = document.querySelector('.modrinth') as HTMLElement;
    
        launcher.classList.add('closing');
        launcher.classList.remove('opening');
        
        if(document.getElementById('lunar-tb-app')) {
          (document.getElementById('lunar-tb-app') as HTMLDivElement).classList.remove('active');
        }
    
        toggleStoreApp(nameToID(selectedClient.windowName), {
            name: selectedClient.windowName,
            unblock: true,
            url: selectedClient.windowURL,
            category: "Minecraft"
        });
      }

    return (
        <Window noDragging={true} title="Modrinth" id="modrinth" taskbarIconID="modrinth" color={'#25292F'} seperateBorder="1px solid #ffffff0a">
            <div className="window-full lunar-window">
                <div style={{height:'36px',padding:'1rem',background:"#25292E",width:'100%',display:'flex',gap:'1rem',alignItems:'center'}}>
                    <div style={{width:'75%'}}></div>
                    <div style={{border:'1px solid #ffffff0a',padding:'6px 8px',borderRadius:'8px'}}>
                        Instances running
                    </div>
                </div>
            </div>
        </Window>
    );
}