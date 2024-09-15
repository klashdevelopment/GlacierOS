"use client";
import { useEffect, useState } from "react";
import Window from "../components/Window";
import { Button, Dropdown, Input, Option, ToastBody, Toaster, ToastTitle, useToastController, useId, Toast } from "@fluentui/react-components";
import { SearchRegular, PinFilled, WarningFilled } from "@fluentui/react-icons";
import { registerSWandset } from "../utils/doSWStuff";
declare const search: any;
declare const __uv$config: any;
declare const registerSW: any;
declare const setTransport: any;
interface EdgeTab {
    title: string;
    url: string;
    favicon: string;
    id: number;
}

export default function EdgeApp() {
    const [searchEngineLink, setSearchEngineLink] = useState<string>("https://duckduckgo.com/?q=%s");
    const [tabs, setTabs] = useState<EdgeTab[]>([{
        title: "New Tab",
        url: "/newtab",
        favicon: "/windows/glacierwhite.png",
        id: Math.random()
    }]);
    const [activeTab, setActiveTab] = useState<number>(0);

    function updateTab() {
        console.log("UPDATE TAB");
        const address = document.getElementById("uv-address");
        registerSWandset((defined: boolean) => {
            console.log("[MS EDGE] called back " + defined);
            const inputAddr = (address as HTMLInputElement).value;
            var url = "";
            if (defined) {
                url = __uv$config.prefix + __uv$config.encodeUrl(search(inputAddr, searchEngineLink));
            } else {
                url = (inputAddr.startsWith('http') || inputAddr.startsWith("//")) ? inputAddr : searchEngineLink.replace('%s', inputAddr);
            }

            const domain = url.startsWith('//') ? url.split('/')[2] :
                (url.startsWith('http') ? url.split('/')[2] : url.split('/')[0]);

            tabs[activeTab] = {
                title: inputAddr,
                url: url,
                favicon: "https://www.google.com/s2/favicons?domain=" + domain + "&sz=64",
                id: Math.random()
            };
            setTabs([...tabs]);
        });
    }

    function closeTab(number: number) {
        console.log("CLOSE TAB " + number);
        console.log(tabs);
        if(tabs.length == 1) 
            return;
        if (number == 0) {
            tabs.shift();
        } else {
            tabs.splice(number, 1);
        }
        setTabs([...tabs]);
        if (number == activeTab) {
            setActiveTab(0);
        } else if (number < activeTab) {
            setActiveTab(activeTab - 1);
        } else {
            setActiveTab(activeTab);
        }
        console.log(tabs);
    }

    function addEmptyTab() {
        // if theres already 7 tabs, alert
        if (tabs.length >= 7) {
            dispatchToast(
                <Toast>
                    <ToastTitle>Error opening New Tab</ToastTitle>
                    <ToastBody subtitle="This will be changed in the near future.">Max. tabs limited to 7.</ToastBody>
                </Toast>,
                { intent: "error" }
            );
            return;
        }
        setTabs([...tabs, {
            title: "New Tab",
            url: "/newtab",
            favicon: "/windows/glacierwhite.png",
            id: Math.random()
        }]);
        setActiveTab(tabs.length);
    }

    useEffect(() => {
        if (tabs[activeTab] == null) {
            setActiveTab(activeTab - 1);
        }
    }, [tabs]);

    function isActiveTab() {
        return tabs[activeTab] != null && tabs[activeTab].url != null && tabs[activeTab].favicon != null && tabs[activeTab].title != null;
    }

    const toasterId = useId("edgetoaster");
    const { dispatchToast } = useToastController(toasterId);

    return (
        <>
            <Window title="Microsoft Edge" id="edge" taskbarIconID="edge" color={'gray'} seperateBorder="1px solid #ffffff0a">
                <Toaster toasterId={toasterId} />
                {/* <div style={{textAlign:'left'}}> */}
                <div className="flex-center" style={{ padding: '4px 4px 0px 4px', display: 'flex', gap: '10px', alignItems: 'center', overflowX: 'scroll' }}>
                    {tabs.map((tab, index) => (
                        <div key={index} style={{ userSelect: 'none', height: '30px', background: `${activeTab == index ? '#333' : '#2c2c2c'}`, width: '180px', borderRadius: "10px 10px 0px 0px", display: 'flex', alignItems: 'center', padding: '0px 10px', justifyContent: 'space-between' }}>
                            <div onClick={() => { setActiveTab(index) }} style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}><img width={15} height={15} style={{ marginRight: '5px' }} src={tab && tab.favicon} />
                                {tab && tab.title}</div>
                            <span onClick={() => { closeTab(index) }}
                                style={{ fontFamily: 'Kanit', background: '#444', padding: '0px 5px', borderRadius: '50%', cursor: 'pointer' }}>X</span>
                        </div>
                    ))}
                    <span onClick={addEmptyTab} style={{ background: '#444', padding: '5px', borderRadius: '50%', cursor: 'pointer', height: '10px', width: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
                </div>
                <div className="flex-center" style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', background: '#333' }}>
                    <Dropdown id="uv-search-engine" style={{ width: '10%', marginRight: '5px' }} defaultSelectedOptions={["https://duckduckgo.com/?q=%s"]} defaultValue={"DuckDuckGo"} onOptionSelect={(e, d) => {
                        setSearchEngineLink(d.optionValue as string);
                    }} placeholder="Search Engine" expandIcon={searchEngineLink == "https://google.com/search?igu=1&q=%s" ? <><span style={{color:'yellow',fontFamily:"'JetBrains Mono'",fontSize:'12px',display:'flex',alignItems:'center'}}><WarningFilled color={"yellow"} style={{marginRight:'5px'}} /> Unsupported</span></> : undefined}>
                        <Option value="https://google.com/search?igu=1&q=%s">Google</Option>
                        <Option value="https://bing.com/search?q=%s">Bing</Option>
                        <Option value="https://duckduckgo.com/?q=%s">DuckDuckGo</Option>
                        <Option value="https://search.yahoo.com/search?p=%s">Yahoo</Option>
                        <Option value="https://searxng.site/search?q=%s">SearX</Option>
                    </Dropdown>
                    <Input id="uv-address" type="text" style={{ width: 'calc(80% - 5px)' }} placeholder="Search the top of the iceberg" autoComplete={"false"} />
                    <Button onClick={updateTab} color={'primary'} style={{ width: '20%', marginLeft: '5px', marginBottom: '3px' }} icon={<SearchRegular />} iconPosition="after">Search</Button>
                </div>
                {
                    tabs.map((tab, index) => (
                        <iframe key={index} id={""+index} src={tab && tab.url} style={{ width: '100%', height: 'calc(100% - 82px)', border: 'none', display: `${activeTab == index ? 'block' : 'none'}` }}></iframe>
                    ))
                }
                {/* </div> */}
            </Window>
        </>
    );
}