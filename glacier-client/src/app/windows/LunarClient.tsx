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

type ClientKey = keyof typeof clients;

const clients: Record<string, SelectedClientData> = {
    "starlike": {
        name: "Starlike",
        version: "1.8.8",
        icon: "http://tortillagames.org/assets/img/lessons/06dd7a4d-c8f6-409d-bd03-4acc97847302.webp",
        windowID: "starlike",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/starlike",
        windowName: "Minecraft (starlike)"
    },
    "starlike-wasm": {
        name: "Starlike (WASM)",
        version: "1.8.8",
        icon: "http://tortillagames.org/assets/img/lessons/06dd7a4d-c8f6-409d-bd03-4acc97847302.webp",
        windowID: "starlike-wasm",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/starlike-wasm",
        windowName: "Minecraft (starlike-wasm)"
    },
    "astra": {
        name: "Astra",
        version: "1.8.8",
        icon: "https://tortillagames.org/assets/img/lessons/cc38ed54-0f32-4dfc-bb4f-84b6c449e9a8.webp",
        windowID: "astra",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/astra",
        windowName: "Minecraft (astra)"
    },
    "astra-wasm": {
        name: "Astra (WASM)",
        version: "1.8.8",
        icon: "https://tortillagames.org/assets/img/lessons/cc38ed54-0f32-4dfc-bb4f-84b6c449e9a8.webp",
        windowID: "astra-wasm",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/astra-wasm",
        windowName: "Minecraft (astra-wasm)"
    },
    "shadow4": {
        name: "Shadow & OF",
        version: "1.8.8",
        icon: "https://tortillagames.org/assets/img/lessons/b0abe046-68cb-4605-b0b8-39a23b2bc2ba.webp",
        windowID: "shadow4",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/shadow4",
        windowName: "Minecraft (shadow4)"
    },
    "resent1.8": {
        name: "Resent",
        version: "1.8.8",
        icon: "https://tortillagames.org/assets/img/lessons/8ecae8c2-6c12-465a-a2ec-08048986b9f0.webp",
        windowID: "resent1.8",
        windowURL: "https://pages.gavingogaming.com/mediaology-game-repo/eagle/resent1.8",
        windowName: "Minecraft (resent1.8)"
    }
}

export default function LunarClientApp() {
    const [selectedClient, setSelectedClient] = useState<SelectedClientData>(clients.astra);

    function getNextClient() {
        const clientKeys = Object.keys(clients) as Array<keyof typeof clients>;
        const currentIndex = clientKeys.indexOf(selectedClient.windowID);
        const nextIndex = (currentIndex + 1) % clientKeys.length;
        return clients[clientKeys[nextIndex]];
    }

    function launchGame() {
        let launcher = document.querySelector('.lunar') as HTMLElement;
    
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
        <Window noDragging={true} title="Lunar Client" id="lunar" taskbarIconID="lunar" color={'gray'} seperateBorder="1px solid #ffffff0a">
            <div className="window-full lunar-window">
                <div className="lunar-nav">
                    <div className=" lunar-part">
                        <img height={45} width={50} src={contsants.LUNAR.ICON} />
                    </div>
                    <div className="active lunar-part">
                        <img width={30} src={contsants.LUNAR.GAMEPAD} />
                    </div>
                    <div className=" lunar-part">
                        <img width={30} src={contsants.LUNAR.PUZZLE} />
                    </div>
                    <div className=" lunar-part">
                        <img width={30} src={contsants.LUNAR.EARTH} />
                    </div>
                    <div className=" lunar-part">
                        <img width={30} src={contsants.LUNAR.NEWS} />
                    </div>
                    <div className=" lunar-part">
                        <img width={30} src={contsants.LUNAR.CART} />
                    </div>
                    <div className="lunar-part">
                        <img width={30} src={contsants.LUNAR.SETTINGS} />
                    </div>
                </div>
                <div className="lunar-content">
                    <div className="lunar-top">
                        <img src="/image/lunargrid.svg" style={{width:'20px'}} alt="" />
                        <span>QUICK PLAY</span>
                        <div style={{width:'1px',margin:'0px 10px',background:'#ffffff0a',height:"100%"}}></div>
                        <img src={contsants.ICONS.WEBMC} height={20} />
                        <img src={"https://cdn.craftingstore.net/rPPmDHlLQ1/ff6f28fae9c78620670451be7fc86f98/nfjpzriwpydxbalceixv.png"} height={20} />
                        <img src="https://arch.lol/favicon.ico" height={20} />
                        <img src="https://www.asspixel.net/custom/templates/Lithium/uploads/ApLogoNoBackground%20(1).png" height={20} />
                    </div>
                    <div className="lunar-quick" style={{width:'90%',margin:'0 5%',background:'url("https://minecraft.wiki/images/NewStars.png")',backgroundPosition:"50%",height:'30%',borderRadius:'12px',border:'5px solid #ffffff20',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div className="lunar-quick-button" style={{width:'300px',cursor:'pointer',height:'70px',background:'url("/image/aaaa.webp")',display:'flex',backgroundPosition:'50%',borderRadius:'10px',border:'5px solid #ffffff20'}}>
                            <div onClick={launchGame} className="lunar-darken" style={{height:'100%',width:'85%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'LunarOne',flexDirection:'column'}}>
                                <span style={{fontSize:'25px',textShadow:'#00000050 0px 3px 2px'}}>LAUNCH GAME</span>
                                <span style={{fontSize:'12px',textShadow:'#00000050 0px 2px 2px',fontFamily:"Segoe UI, Helvetica, Arial",display:'flex',alignItems:'center',gap:'3px'}}>
                                    <img height={15} width={17} src={contsants.LUNAR.ICON} />
                                    Lunar Client {selectedClient.version} with
                                    <img width={12} src={selectedClient.icon} />
                                    {selectedClient.name}
                                </span>
                            </div>
                            <div className="lunar-darken" style={{height:'100%',width:'15%',display:'flex',alignItems:'center',justifyContent:'center',background:'#00000020',
                                borderBottomRightRadius:'8px',
                                borderTopRightRadius:'8px',
                            }} onClick={()=>{
                                setSelectedClient(getNextClient());
                            }}>
                                <img width={18} src={contsants.LUNAR.DOWN} />
                            </div>
                        </div>
                    </div>
                    <div className="lunar-quick" style={{width:'90%',margin:'3% 5%',height:'38%',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{width:'45%',background:'url("https://i.ytimg.com/vi/1v3Dpm-wkjI/hqdefault.jpg")',backgroundSize:'cover',backgroundPosition:"50% 50%",height:'100%',borderRadius:'12px',border:'5px solid #ffffff20',display:'flex',alignItems:'center',justifyContent:'center'}}></div>
                        <div style={{width:'45%',background:'url("https://i.ytimg.com/vi/DF9e7BHYMFo/hqdefault.jpg")',backgroundSize:'cover',backgroundPosition:"50% 50%",height:'100%',borderRadius:'12px',border:'5px solid #ffffff20',display:'flex',alignItems:'center',justifyContent:'center'}}></div>
                    </div>
                </div>
            </div>
        </Window>
    );
}