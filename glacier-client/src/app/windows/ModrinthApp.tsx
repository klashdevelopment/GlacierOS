import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents, Button } from "@fluentui/react-components";
import Window from "../components/Window";
import { CSSProperties, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SearchRegular, RecordStopRegular, ArrowRotateClockwiseRegular, ArrowRotateCounterclockwiseRegular, ArrowRedoRegular, ArrowLeft20Regular, CaretLeft16Filled, CaretRight16Filled, Home16Regular, Home24Regular, Library24Regular, CompassNorthwest24Regular } from "@fluentui/react-icons";
import { registerSWandset } from "../utils/doSWStuff";
import contsants from "../Constants";
import { nameToID, useToggleStoreApp } from "./store/StoreApps";
import { allClients, clients, SelectedClientData } from "./LunarClient";

export default function ModrinthApp() {
    const toggleStoreApp = useToggleStoreApp();
    function launchGame(selectedClient: SelectedClientData) {
        let launcher = document.querySelector('.modrinth') as HTMLElement;
    
        launcher.classList.add('closing');
        launcher.classList.remove('opening');
        
        if(document.getElementById('modrinth-tb-app')) {
          (document.getElementById('modrinth-tb-app') as HTMLDivElement).classList.remove('active');
        }
    
        toggleStoreApp(nameToID(selectedClient.windowName), {
            name: selectedClient.windowName,
            unblock: true,
            url: selectedClient.windowURL,
            category: "Minecraft"
        });
    }

    function GameCard({ game }: { game: SelectedClientData }) {
        return (
            <div
                style={{
                    background: '#26292f',
                    width: '100%',
                    minWidth: 0,
                    height: '80px',
                    margin: 0,
                    boxSizing: 'border-box',
                    borderRadius: '1rem',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    userSelect: 'none',
                    cursor: 'pointer',
                }}
                onClick={() => launchGame(game)}
            >
                <img src={game.icon} style={{height:'50px',borderRadius:'0.5rem',
                    border: '1px solid #3f4143',
                    boxShadow: '0 4px 3px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        boxShadow: '0 6px 5px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-2px)',
                    },
                } as CSSProperties} alt="" />
                <div>
                    <h3 style={{color:'#abb5c0',margin:'0px'}}>{game.name}</h3>
                    <p style={{color:'#abb5c0',margin:'0px'}}>{game.version}</p>
                </div>
            </div>
        );
    }

    return (
        <Window noDragging={true} defaultSize={{
            width: 1000,
            height: 600
        }} title="Modrinth" id="modrinth" taskbarIconID="modrinth" color={'#26292f'} seperateBorder="0px">
            <div className="window-full" style={{borderTop: '1px solid #393a3d',boxSizing:'border-box'}}>
                <div style={{height:'40px',boxSizing:'border-box',background:"#26292f",width:'100%',display:'flex',gap:'1rem',alignItems:'center', justifyContent:'space-between'}}>
                    <div style={{
                        padding:'0 10px',
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                    }}>
                        <img src="/minecraft/forge/modrinthapp.svg" alt="Modrinth app" style={{height:'25px'}} />
                        <div style={{height:'20px',width:'20px',display:'flex',alignItems:'center',justifyContent:'center',background:'#33363d',borderRadius:'50%'}}>
                            <CaretLeft16Filled />
                        </div>
                        <div style={{height:'20px',width:'20px',display:'flex',alignItems:'center',justifyContent:'center',background:'#33363d',borderRadius:'50%'}}>
                            <CaretRight16Filled />
                        </div>
                        <b>Home</b>
                    </div>
                    <div style={{border:'1px solid #ffffff0a',padding:'6px 8px',borderRadius:'8px',marginRight:'4px'}}>
                        No instances running
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row',height:'calc(100% - 41px)',width:'100%'}}>
                    <div style={{display:'flex',flexDirection:'column',height:'100%',width:'70px',background:'#26292f',boxSizing:'border-box',gap:'0.5rem',alignItems:'center',paddingTop:'1rem'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',borderRadius:'50%',width:'50px',height:'50px'}}>
                            <Home24Regular color="#abb5c0"  />
                        </div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',borderRadius:'50%',width:'50px',height:'50px'}}>
                            <CompassNorthwest24Regular color="#abb5c0" />
                        </div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#22533d',borderRadius:'50%',width:'50px',height:'50px'}}>
                            <Library24Regular color="#1bd86a" />
                        </div>
                    </div>
                    <div style={{
                        width: 'calc(100% - 70px)',
                        height: '100%',
                        borderTopLeftRadius: '1.25rem',
                        padding: '1.5rem',
                        boxSizing: 'border-box',
                        border: '1px solid #3f4143',
                        background: '#16181c',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '0.75rem',
                        overflowY: 'auto',
                        alignContent: 'start',
                    }}>
                        {allClients.map((client, index) => (
                            <GameCard key={index} game={client} />
                        ))}
                    </div>
                </div>
            </div>
        </Window>
    );
}