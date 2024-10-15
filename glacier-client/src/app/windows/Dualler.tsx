import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents, Button } from "@fluentui/react-components";
import Window from "../components/Window";
import { useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { SearchRegular, RecordStopRegular, ArrowRotateClockwiseRegular, ArrowRotateCounterclockwiseRegular, ArrowRedoRegular } from "@fluentui/react-icons";
import { registerSWandset } from "../utils/doSWStuff";

declare const __uv$config: any;
declare const search: any;

export default function DuallerApp() {
    const [engine, setEngine] = useState<string>("https://duckduckgo.com/?q=%s");
    const [inputOne, setInputOne] = useState<string>("");
    const [inputTwo, setInputTwo] = useState<string>("");
    const [flipped, setFlipped] = useState<boolean>(false);

    const refOne = useRef<HTMLIFrameElement | null>(null);
    const refTwo = useRef<HTMLIFrameElement | null>(null);

    function updateTab(inputAddr: string, searchEngineLink: string, ref: HTMLIFrameElement | null) {
        if(!ref) return;
        registerSWandset((defined: boolean) => {
            var url = "";
            if (defined) {
                url = __uv$config.prefix + __uv$config.encodeUrl(search(inputAddr, searchEngineLink));
            } else {
                url = (inputAddr.startsWith('http') || inputAddr.startsWith("//")) ? inputAddr : searchEngineLink.replace('%s', inputAddr);
            }

            const domain = url.startsWith('//') ? url.split('/')[2] :
                (url.startsWith('http') ? url.split('/')[2] : url.split('/')[0]);

            ref.src = url;
        });
    }
    function cancelTab(ref: HTMLIFrameElement | null) {
        if(!ref) return;
        ref.src = '';
    }
    function refreshTab(ref: HTMLIFrameElement | null) {
        if(!ref) return;
        ref.src = ref.src + '';
    }

    return (
        <Window title="Dualler" id="dualler" taskbarIconID="dualler" color={'gray'} seperateBorder="1px solid #ffffff0a">
            <PanelGroup direction={flipped ? "vertical" : "horizontal"} style={{ width: '100%' }}>
                <Panel minSize={20}>
                    <div style={{width:'42px',height:'42px',left:'0',top:'40px',background:'rgba(0,0,0,0.1)',display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',borderRight:'2px solid #ffffff0a'}}>
                        <Button
                            onClick={() => setFlipped(!flipped)}
                            icon={<ArrowRotateClockwiseRegular />}></Button>
                    </div>
                    <div style={{width:'100%', height:'42px', background: 'rgba(0,0,0,0.1)',borderBottom:'2px solid #ffffff0a', display: 'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                        <Button
                            onClick={() => refreshTab(refOne.current)}
                            icon={<ArrowRedoRegular />}></Button>
                        <Input placeholder="Search"
                            value={inputTwo}
                            onChange={(e) => setInputTwo(e.target.value)}
                        />
                        <Button
                            onClick={() => updateTab(inputTwo, engine, refOne.current)}
                            icon={<SearchRegular />}></Button>
                        <Button
                            onClick={() => cancelTab(refOne.current)}
                            icon={<RecordStopRegular />}></Button>
                    </div>
                    <div style={{width:'100%', height:'calc(100% - 42px)'}}>
                        <iframe ref={refOne} style={{width:'100%',height:'100%',border:'0'}}></iframe>
                    </div>
                </Panel>
                <PanelResizeHandle style={{background: '#ffffff0a', width: flipped ? '100%' : '2px', height: flipped ? '2px' : '100%'}} />
                <Panel minSize={20}>
                    <div style={{width:'42px',height:'42px',right:'0',top:'40px',background:'rgba(0,0,0,0.1)',display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',borderRight:'2px solid #ffffff0a'}}>
                        <Button
                            onClick={() => setFlipped(!flipped)}
                            icon={<ArrowRotateCounterclockwiseRegular />}></Button>
                    </div>
                    <div style={{width:'100%', height:'42px', background: 'rgba(0,0,0,0.1)',borderBottom:'2px solid #ffffff0a', display: 'flex', alignItems:'center', justifyContent:'center', gap:'5px'}}>
                        <Button
                            onClick={() => refreshTab(refTwo.current)}
                            icon={<ArrowRedoRegular />}></Button>
                        <Input placeholder="Search"
                            value={inputOne}
                            onChange={(e) => setInputOne(e.target.value)}
                        />
                        <Button
                            onClick={() => updateTab(inputOne, engine, refTwo.current)}
                            icon={<SearchRegular />}></Button>
                        <Button
                            onClick={() => cancelTab(refTwo.current)}
                            icon={<RecordStopRegular />}></Button>
                    </div>
                    <div style={{width:'100%', height:'calc(100% - 42px)'}}>
                        <iframe ref={refTwo} style={{width:'100%',height:'100%',border:'0'}}></iframe>
                    </div>
                </Panel>
            </PanelGroup>
        </Window>
    );
}