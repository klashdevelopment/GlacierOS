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

export default function LunarClientApp() {
    const [selectedClient, setSelectedClient] = useState<SelectedClientData>(clients.glacier);

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
                        <img src="https://arch.lol/apps/main/public/assets/img/extras/favicon.png?cache=1727046920" height={20} />
                        <img src="https://www.asspixel.net/custom/templates/Lithium/uploads/ApLogoNoBackground%20(1).png" height={20} />
                    </div>
                    <div className="lunar-quick" style={{width:'90%',margin:'0 5%',background:'url("https://minecraft.wiki/images/NewStars.png")',backgroundPosition:"50%",height:'30%',borderRadius:'12px',border:'5px solid #ffffff20',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <div className="lunar-quick-button" style={{width:'300px',cursor:'pointer',height:'70px',background:'url("/image/aaaa.png")',display:'flex',backgroundPosition:'50%',borderRadius:'10px',border:'5px solid #ffffff20'}}>
                            <div onClick={launchGame} className="lunar-darken" style={{height:'100%',width:'85%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'LunarOne',flexDirection:'column'}}>
                                <span style={{fontSize:'25px',textShadow:'#00000050 0px 3px 2px'}}>LAUNCH GAME</span>
                                <span style={{fontSize:'12px',textShadow:'#00000050 0px 2px 2px',fontFamily:"Segoe UI, Helvetica, Arial",display:'flex',alignItems:'center',gap:'3px'}}>
                                    <img height={15} width={17} src={contsants.LUNAR.ICON} />
                                    {/* Lunar Client 1.21.1 with
                                    <img width={12} src={"/image/b.png"} />
                                    Boost */}
                                    Boost not installed
                                </span>
                            </div>
                            <div className="lunar-darken" style={{height:'100%',width:'15%',display:'flex',alignItems:'center',justifyContent:'center',background:'#00000020',
                                borderBottomRightRadius:'8px',
                                borderTopRightRadius:'8px',
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