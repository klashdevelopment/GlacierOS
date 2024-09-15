import { useEffect, useId, useState } from "react";
import { toggleStoreApp, nameToID } from "./StoreApps";
import { Button, Dropdown, Input, Option, Persona, Toast, ToastBody, ToastTitle, Toaster, useToastController } from "@fluentui/react-components";
import { IconList } from "../MoreIcons";

declare var window: any;

export function formatIconFilename(icon: string) {
    const fIcon = icon.startsWith('..') ? icon.replace('../','') : icon;
    var icons = fIcon.replace('icons/','').replace('_',' ').replace('/',' ').split(' ');
    var formatted = '';
    icons.forEach((word)=>{
        formatted += word.charAt(0).toUpperCase() + word.substring(1) + ' ';
    });
    return formatted;
}

export default function Movies() {
    const [quickApps, setQuickApps] = useState([{name: '', image: '', url: '', unblock: false}]);
    const [init, setInit] = useState(false);

    // state for appName, appURL, appIcon
    const [appName, setAppName] = useState('');
    const [appURL, setAppURL] = useState('');
    const [appIcon, setAppIcon] = useState('');
    const [appType, setAppType] = useState('');

    useEffect(()=>{
        if(window.localStorage.getItem('gquicks')) {
            setQuickApps(JSON.parse(window.localStorage.getItem('gquicks') as string));
        }else {
            window.localStorage.setItem('gquicks', `[{
                "name": "Microsoft Edge",
                "unblock":false,
                "image": "/windows/icons/edge.png",
                "url": "glacier://edge"
            }]`);
            setQuickApps(JSON.parse(window.localStorage.getItem('gquicks') as string));
        }
        setInit(true);
    },[]);
    useEffect(()=>{
        if(init) {
            window.localStorage.setItem('gquicks', JSON.stringify(quickApps));
        }
    }, [quickApps]);

    function removeApp(appName: string) {
        setQuickApps(quickApps.filter(app => app.name !== appName));
    }
    function addApp(appName: string, appIcon: string, appURL: string, unblock: boolean) {
        setQuickApps([...quickApps, {name: appName, image: appIcon, url: appURL, unblock: unblock}]);
    }

    const toasterId = useId();
    const { dispatchToast } = useToastController(toasterId);
    const notify = () =>
        dispatchToast(
        <Toast>
            <ToastTitle>App added</ToastTitle>
            <ToastBody>Refresh the page for app to be useable</ToastBody>
        </Toast>,
        { intent: "success" }
    );

    return (
        <>
            <Toaster toasterId={toasterId} />
            <h1>My Apps</h1>
            <div className="store-games-panel store-panel store-grid">
                {quickApps.map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function () { toggleStoreApp(nameToID(app.name), app) }} />
                        <div className="title">{app.name}</div>
                        <div style={{color: 'red'}} onClick={()=>{removeApp(app.name)}}>Delete</div>
                    </div>
                ))}
            </div>
            <div style={{marginTop:'10px',paddingTop:'10px',borderTop:'1px solid #cccccc50'}}>
                <h2>App Creation Pane</h2>
                {appURL.startsWith("glacier://") && <><b>Using <code>glacier://</code> slug. Proceed with caution.</b><br/></>}
                <Input style={{margin:'5px'}} placeholder="App Name" onChange={(ev: any, data: any)=>{setAppName(data.value)}} /><br/>
                <Input style={{margin:'5px'}} className={`${appURL.startsWith('glacier://') ? 'invalidInput' : ''}`} placeholder="App URL" onChange={(ev: any, data: any)=>{setAppURL(data.value)}} /><br/>
                
                <Dropdown style={{margin:'5px'}} placeholder="App Icon" onOptionSelect={(ev: any, data: any)=>{setAppIcon(data.optionValue)}} >
                    {IconList.map((icon,idx)=>(
                        <Option key={idx} value={`/windows/${icon}.png`} text={formatIconFilename(icon)}>
                            <Persona
                            name={formatIconFilename(icon)}
                            secondaryText={`${icon}`}
                            avatar={{
                                image: {
                                    src: `/windows/${icon}.png`
                                },
                                style: {
                                    borderRadius: '10px',
                                    padding: '5px'
                                }
                            }}
                            />
                        </Option>
                    ))}
                </Dropdown><br/>
                <Dropdown style={{margin:'5px'}} defaultSelectedOptions={["normal"]} defaultValue={"Open within Glacier (normal)"} placeholder="App Type" onOptionSelect={(ev: any, data: any)=>{setAppType(data.optionValue)}}>
                    <Option value="outside" disabled>Open out of Glacier</Option>
                    <Option value="normal" key="normal">Open within Glacier (normal)</Option>
                    <Option value="nounblock" disabled>Open within Glacier (no unblocking)</Option>
                </Dropdown><br/>
                <Button style={{margin:'5px'}} onClick={
                    ()=>{
                        addApp(appName, appIcon, appURL, true);
                        notify();
                    }
                }>Create App</Button>
            </div>
        </>
    )
}