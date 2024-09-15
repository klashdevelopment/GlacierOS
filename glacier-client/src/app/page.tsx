'use client';
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import Draggable from "react-draggable";
import Window from "./components/Window";
import {
    FluentProvider,
    webDarkTheme,
    Button,
    Dropdown,
    Option,
    OptionOnSelectData,
    SelectionEvents,
    Label,
    Input
} from "@fluentui/react-components";
import { IDropdownOption, Icon } from "@fluentui/react";
import Taskbar from "./components/Taskbar";
import "./windows.css";
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent
} from "@fluentui/react-components";
import TerminalApp from "./windows/Terminal";
import SettingsApp from "./windows/Settings";
import CalculatorApp from "./windows/Calculator";
import EdgeApp from "./windows/MicrosoftEdge";
import CameraApp from "./windows/Camera";
import StoreApp from "./windows/Store";
import AppListHelper, { getApps, getWithName } from "./utils/AppListHelper";
import FrameWindow from "./components/FrameWindow";
import StoreApps from "./windows/store/StoreApps";
import MoreIconsApp from "./windows/MoreIcons";
import MinecraftLauncherApp from "./windows/MinecraftLauncher";
import FavoriteAppHelper from "./utils/FavoriteAppHelper";
import Head from "next/head";
import FileExplorer from "./windows/FileExplorer";
import CloudGaming from "./windows/CloudGaming";
import Syntaxpad, { Bootpad } from "./windows/Syntaxpad";
import { SyntaxpadProvider } from "./windows/SyntaxpadContext";
import Quadpad from "./windows/Quadpad";
import { QuadpadProvider } from "./windows/QuadpadContext";
import StartMenu from "./components/StartMenu";

export default function Home() {
    const [theme, setTheme] = useState(webDarkTheme);
    const [selectedOS, setSelectedOS] = useState("windows");
    const [auth, setAuth] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [password, setPassword] = useState("");
    const [pwInput, setPwInput] = useState("");

    const [blockUser, setBlockUser] = useState(false);

    useEffect(() => {
        fetch('http://ip-api.com/json/').then(
            res => res.json()
        ).then(data => {
            if(data.org == "South Pasadena Unified School") {
                setBlockUser(true);
            }
        });

        const params = new URLSearchParams(window.location.search);
        if(params.has('school-admin-code')) {
            if(params.get('school-admin-code') == 'spusd') {
                setBlockUser(false);
                setAuth(true);
            }
        }

        const auth = window.localStorage.getItem("auth");
        const os = window.localStorage.getItem("os");
        if (auth/* || process.env.NODE_ENV === "development"*/) {
            setAuth(true);
        }
        if (window.localStorage.getItem("firstTime")) {
            setFirstTime(false);
        }
        if (window.localStorage.getItem("password")) {
            setFirstTime(false);
            setPassword(window.localStorage.getItem("password") || "");
        }
        if (os) {
            setSelectedOS(os);
            if (os === "macos") {
                theme.fontFamilyBase = "'SF Pro', 'SF Compact', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";
            }
        } else {
            window.localStorage.setItem("os", "windows");
        }
        if (window.localStorage.getItem('background')) {
            document.body.style.backgroundImage = `url("${window.localStorage.getItem('background')}")`;
        } else {
            window.localStorage.setItem('background', '/windows/wallpaper1.jpg');
        }
    }, []);

    return (
        <>
            <FluentProvider theme={webDarkTheme}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                    <filter id="blur-20">
                        <feGaussianBlur stdDeviation="20" />
                    </filter>
                    <filter id="blur-40">
                        <feGaussianBlur stdDeviation="40" />
                    </filter>
                    <filter id="blur-60">
                        <feGaussianBlur stdDeviation="60" />
                    </filter>
                    <filter id="blur-150">
                        <feGaussianBlur stdDeviation="150" />
                    </filter>
                </svg>
                {blockUser && (<div style={{width:'100vw',zIndex:'99999',height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'absolute',top:'0',left:'0',backdropFilter:'blur(60px)'}}>
                    <div style={{width:'400px',height:'180px',borderRadius:"6px",background:'#111',display:'flex',alignItems:'center'}}>
                        <img src="https://3.files.edl.io/8869/22/08/05/214400-beef033c-09db-4dc0-8d2a-6007d901a08a.jpg" alt="" style={{height:"100px",filter:'invert(1)'}} />

                        <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                            <b style={{textAlign:'center'}}>Glacier isn't allowed in this school!</b>
                            <span style={{textAlign:'center'}}>You're using a chromebook managed to SPUSD. If you are are a administrator and would like to have access for looking around, please contact me.</span>
                        </div>
                    </div>
                </div>)}
                {(!blockUser && !auth) && (
                    <div className="not-logged-in">
                        <img src={`/windows/user.png`} style={{ width: '175px', borderRadius: '50%', boxShadow: 'rgba(0,0,0,0.5) 0 0 7px 0px' }} alt="" />
                        <b style={{ fontSize: '22px', margin: '20px 0px' }}>Glacier User</b>
                        {firstTime && <p>This is your first time on Glacier. Your password can later be changed in settings.</p>}
                        <Input onChange={(e, d) => {
                            setPwInput(d.value);
                            if (!firstTime && d.value === password) {
                                window.localStorage.setItem("auth", "true");
                                setAuth(true);
                            }
                        }} placeholder="Password" type="password" appearance="underline" />
                        {firstTime && <Button appearance="transparent" onClick={() => {
                            window.localStorage.setItem("firstTime", "false");
                            setFirstTime(false);
                            window.localStorage.setItem("password", pwInput);
                            window.localStorage.setItem("auth", "true");
                            setPassword(pwInput);
                            setAuth(true);
                        }}>Set Password</Button>}
                    </div>
                )}
                <main>
                    <SyntaxpadProvider>
                        <AppListHelper />

                        <StartMenu>
                            <Taskbar apps={[
                                { name: "Settings", icon: `/${selectedOS}/settings.png`, window: "settings" },
                                { name: "File Explorer", icon: `/${selectedOS}/icons/explorer.png`, window: "file-explorer" },
                                { name: "Terminal", icon: `/${selectedOS}/icons/terminal.png`, window: "terminal" },
                                { name: "Microsoft Edge", icon: `/${selectedOS}/icons/edge.png`, window: "edge" },
                                { name: "Syntaxpad", icon: `/${selectedOS}/syntaxpad.png`, window: "syntaxpad" },
                                { name: "Calculator", icon: `/${selectedOS}/icons/calculator.png`, window: "calculator" },
                                { name: "Camera", icon: `/${selectedOS}/icons/camera.png`, window: "camera" },
                                { name: "Microsoft Store", icon: `/${selectedOS}/store.png`, window: "store" },
                                { name: "Minecraft Launcher", icon: `/${selectedOS}/minecraft.png`, window: "mclauncher" },
                            ]} />
                        </StartMenu>
                        <SettingsApp />
                        <CalculatorApp />
                        <TerminalApp />
                        <FileExplorer />
                        <EdgeApp />
                        <CameraApp />
                        <StoreApp />
                        <StoreApps />
                        <CloudGaming />
                        <MinecraftLauncherApp />
                        <Syntaxpad />
                        <Bootpad />
                        <QuadpadProvider>
                            <Quadpad />
                        </QuadpadProvider>
                    </SyntaxpadProvider>
                </main>
            </FluentProvider>
        </>
    );
}
