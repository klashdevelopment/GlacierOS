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
import Taskbar, { TaskbarApp } from "./components/Taskbar";
import "./windows.css";
import "./customwindowstyles.css";
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
import DuallerApp from "./windows/Dualler";
import LunarClientApp from "./windows/LunarClient";
import contsants from "./Constants";
import ModrinthApp from "./windows/ModrinthApp";
import xor from "./utils/XOR";

declare const self: any;
declare const Ultraviolet: any;
declare const importScripts: any;
declare const UVServiceWorker: any;
declare const registerSW: any;
declare const setTransport: any;
declare const BareMuxConnection: any;

export default function Home() {
    const [theme, setTheme] = useState(webDarkTheme);
    const [selectedOS, setSelectedOS] = useState("windows");
    const [auth, setAuth] = useState(false);
    const [firstTime, setFirstTime] = useState(true);
    const [password, setPassword] = useState("");
    const [pwInput, setPwInput] = useState("");

    const [blockUser, setBlockUser] = useState(false);
    const [showFake, setShowFake] = useState(false);

    const [taskbarApps, setTaskbarApps] = useState<TaskbarApp[]>([]);

    function setTaskbarDefaults(os: string) {
        setTaskbarApps([
            { name: "Settings", icon: `/${os}/settings.webp`, window: "settings" },
            { name: "File Explorer", icon: `/${os}/icons/explorer.webp`, window: "file-explorer" },
            { name: "Terminal", icon: `/${os}/icons/terminal.webp`, window: "terminal" },
            { name: "Microsoft Edge", icon: `/${os}/icons/edge.webp`, window: "edge" },
            { name: "Dualler", icon: `/windows/dueller.webp`, window: "dualler" },
            { name: "Syntaxpad", icon: `/${os}/syntaxpad.webp`, window: "syntaxpad" },
            { name: "Calculator", icon: `/${os}/icons/calculator.webp`, window: "calculator" },
            { name: "Camera", icon: `/${os}/icons/camera.webp`, window: "camera" },
            { name: "Microsoft Store", icon: `/${os}/store.webp`, window: "store" },
            { name: "Minecraft Launcher", icon: `/${os}/minecraft.webp`, window: "mclauncher" },
            { name: "Lunar Client", icon: `https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/bc2dfa26e88ad794d530368331835d1f_7h0TxjqYaF.png`, window: "lunar" },
            // { name: "Modrinth App", icon: contsants.MODRINTH.ICON, window: "modrinth" },
        ]);
    }

    useEffect(() => {
        // var V86Inject = `*:not(#screen_container, #screen_container *, html, body) {
        //     display: none !important;
        // }
        // html, body {
        //     font-size: 0;
        // }
        // #screen_container {
        //     width: 100vw;
        //     display: flex !important;
        //     align-items: center;
        //     justify-content: center;
        //     height: 100vh;
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     z-index: 999;
        // }`;

        // self.__uv$config = {
        //     prefix: "https://tortillagames.org/zz/service/",
        //     encodeUrl: xor.encode,
        //     decodeUrl: xor.decode,
        //     handler: "https://tortillagames.org/zz/zz.handler.js",
        //     client: "https://tortillagames.org/zz/zz.client.js",
        //     bundle: "https://tortillagames.org/zz/zz.bundle.js",
        //     config: "https://tortillagames.org/zz/zz.config.js",
        //     sw: "https://tortillagames.org/zz/zz.sw.js",
        //     inject: [
        //         {
        //             "host": "/^https:\/\/copy\.sh\/v86\/\?/",
        //             "injectTo": "head",
        //             "html": "<style>" + V86Inject + "</style>"
        //         },
        //     ]
        // };
        // async function doClientUV() {
        //     var importScripts = (url: string) => {
        //         return new Promise<void>((resolve, reject) => {
        //             const script = document.createElement('script');
        //             script.src = url;
        //             script.onload = () => { resolve(); console.log("Loaded script: " + url) };
        //             script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        //             document.head.appendChild(script);
        //         });
        //     };
        //     await importScripts('https://tortillagames.org/epoxy/index.js');
        //     await importScripts('https://tortillagames.org/baremux/index.js');
        //     await importScripts(self.__uv$config.bundle || 'uv.bundle.js');
        //     await importScripts(self.__uv$config.sw || 'uv.sw.js');
        //     const allowedHostnames = ["localhost", "127.0.0.1"];
        //     self.setTransport = async function(transportsel: string) {
        //         const connection = new BareMuxConnection("https://tortillagames.org/baremux/worker.js")
        //         const wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + /*location.host*/'tortillagames.org' + "/wisp/";
        //         const bareUrl = location.protocol + "//" + /*location.host*/'tortillagames.org' + "/bare/";

        //         if (transportsel == "epoxy") {
        //             await connection.setTransport("https://tortillagames.org/epoxy/index.mjs", [{ wisp: wispUrl }]);
        //         } else if (transportsel == "libcurl") {
        //             await connection.setTransport("https://tortillagames.org/libcurl/index.mjs", [{ wisp: wispUrl }]);
        //         } else {
        //             await connection.setTransport("https://tortillagames.org/bareasmodule/index.mjs", [bareUrl]);
        //         }
        //     }
        //     self.registerSW = async function() {
        //         if (!navigator.serviceWorker) {
        //             if (
        //                 location.protocol !== "https:" &&
        //                 !allowedHostnames.includes(location.hostname)
        //             )
        //                 throw new Error("Service workers cannot be registered without https.");

        //             throw new Error("Your browser doesn't support service workers.");
        //         }

        //         await navigator.serviceWorker.register("https://tortillagames.org/zz/sw.js");
        //     }
        //     try {
        //         await registerSW();
        //     } catch (err) {
        //         console.error(err);
        //     }
        //     try {
        //         await setTransport("libcurl");
        //     } catch (err2) {
        //         console.error(err2);
        //     }
        //     const uv = new UVServiceWorker();
        //     self.addEventListener('fetch', (event: any) => {
        //         event.respondWith(
        //             (async () => {
        //                 if (uv.route(event)) {
        //                     return await uv.fetch(event);
        //                 }
        //                 return await fetch(event.request);
        //             })()
        //         );
        //     });
        // };
        // doClientUV();
        // self.search = (input: string, template: string) => {
        //     try {
        //         return new URL(input).toString();
        //     } catch (err) { }

        //     try {
        //         const url = new URL(`http://${input}`);
        //         if (url.hostname.includes(".")) return url.toString();
        //     } catch (err) { }

        //     return template.replace("%s", encodeURIComponent(input));
        // };
        const useFake = window.localStorage.getItem("fake-mode");
        if (useFake) {
            setShowFake(useFake === 'true');
        }
        const auth = window.localStorage.getItem("auth");
        const os = window.localStorage.getItem("os");
        if (auth/* || process.env.NODE_ENV === "development"*/) {
            setAuth(true);
        }
        fetch('http://ip-api.com/json/')
            .then((res) => res.json())
            .then((data) => {
                if (data.org === "South Pasadena Unified School") {
                    setBlockUser(true);
                }
            });
        if (window.localStorage.getItem("firstTime")) {
            setFirstTime(false);
        }
        if (window.localStorage.getItem("password")) {
            setFirstTime(false);
            setPassword(window.localStorage.getItem("password") || "");
        }
        if (os) {
            setSelectedOS(os);
            setTaskbarDefaults(os);
            if (os === "macos") {
                theme.fontFamilyBase = "'SF Pro', 'SF Compact', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif";
            }
        } else {
            setTaskbarDefaults("windows");
            window.localStorage.setItem("os", "windows");
        }
        if (window.localStorage.getItem('background')) {
            document.body.style.backgroundImage = `url("${window.localStorage.getItem('background')}")`;
        } else {
            window.localStorage.setItem('background', '/windows/wallpaper1.webp');
        }

        const params = new URLSearchParams(window.location.search);
        if (params.has('forcefull-access')) {
            setBlockUser(false);
            setAuth(true);
            setTaskbarApps([
                { name: "Settings", icon: `/${selectedOS}/settings.webp`, window: "settings" },
                { name: "File Explorer", icon: `/${selectedOS}/icons/explorer.webp`, window: "file-explorer" },
                { name: "Terminal", icon: `/${selectedOS}/icons/terminal.webp`, window: "terminal" },
                { name: "Microsoft Edge", icon: `/${selectedOS}/icons/edge.webp`, window: "edge" },
                { name: "Dualler", icon: `/windows/dueller.webp`, window: "dualler" },
                { name: "Syntaxpad", icon: `/${selectedOS}/syntaxpad.webp`, window: "syntaxpad" },
                { name: "Calculator", icon: `/${selectedOS}/icons/calculator.webp`, window: "calculator" },
                { name: "Camera", icon: `/${selectedOS}/icons/camera.webp`, window: "camera" }
            ]);
        }
        if (params.has('dev-mode')) {
            setBlockUser(false);
            setAuth(true);
            setTaskbarApps([
                { name: "Terminal", icon: `/${selectedOS}/icons/terminal.webp`, window: "terminal" },
                { name: "Quadpad", icon: `/image/quadpad.webp`, window: "quadpad" },
                { name: "Syntaxpad", icon: `/${selectedOS}/syntaxpad.webp`, window: "syntaxpad" },
                { name: "Bootpad", icon: `/image/bootpad.webp`, window: "bootpad" }
            ]);
            document.body.style.backgroundImage = `url("/image/backgrounddev.webp")`;
        };
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
                {blockUser && (<div style={{ width: '100vw', zIndex: '99999', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '0', left: '0', backdropFilter: 'blur(60px)' }}>
                    <div style={{ width: '400px', height: '180px', borderRadius: "6px", background: '#111', display: 'flex', alignItems: 'center' }}>
                        <img src="https://3.files.edl.io/8869/22/08/05/214400-beef033c-09db-4dc0-8d2a-6007d901a08a.jpg" alt="" style={{ height: "100px", filter: 'invert(1)' }} />

                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <b style={{ textAlign: 'center' }}>Glacier isn't allowed in this school!</b>
                            <span style={{ textAlign: 'center' }}>You're using a chromebook managed to a school district that has blocked Glacier from usage. If this is a mistake, contact gavin@klash.dev</span>
                        </div>
                    </div>
                </div>)}
                {(!blockUser && !auth && !showFake) && (
                    <div className="not-logged-in">
                        <img src={`/windows/user.webp`} style={{ width: '175px', borderRadius: '50%', boxShadow: 'rgba(0,0,0,0.5) 0 0 7px 0px' }} alt="" />
                        <b style={{ fontSize: '22px', margin: '20px 0px' }}>Glacier User</b>
                        {firstTime && <p>Your password can later be changed in settings.</p>}
                        <Input onChange={(e: any, d: any) => {
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
                    <AppListHelper />
                    <StoreApps />

                    {showFake && (
                        <div style={{ width: '100vw', height: '100vh', background: 'white', zIndex: '999' }}>
                            <div style={{ width: '100%', height: '60px', borderBottom: '1px solid #00000015', display: 'flex', alignItems: 'center' }}>
                                <svg style={{ marginLeft: '25px' }} width="24" height="24" viewBox="0 0 24 24" fill="#00000099" focusable="false" className=" NMm5M"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
                                <img style={{ marginLeft: '25px' }} width="26" src="https://www.gstatic.com/classroom/logo_square_rounded.svg"></img>
                                <span style={{ marginLeft: '10px', color: '#000000cc', fontSize: '20px' }}>Classroom</span>
                            </div>
                            <div style={{ width: '300px', height: '100%', borderRight: '1px solid #00000015', display: 'flex', paddingTop: '10px' }}>
                                <div style={{ width: '90%', display: 'flex', paddingLeft: '8px', height: '50px', color: '#0009', alignItems: 'center', background: '#E8F0FE', borderTopRightRadius: '1000vh', borderBottomRightRadius: '1000vh', gap: '10px' }}>
                                    <img height="20" src="data:image/svg+xml,%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2021%2025%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%230009%22%3E%3Cpath%20d%3D%22M1%2021h22L12%202zm12-3h-2v-2h2zm0-4h-2v-4h2z%22%2F%3E%3C%2Fsvg%3E" width="20" alt="" />
                                    Loading
                                </div>
                            </div>
                            <div style={{ width: 'calc(100% - 300px)', height: 'calc(100% - 60px)', position: 'absolute', right: '0', top: '60px', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
                                <img src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22xMidYMid%22%20width%3D%22200%22%20height%3D%22200%22%20style%3D%22shape-rendering%3A%20auto%3B%20display%3A%20block%3B%20background%3A%20rgb(255%2C%20255%2C%20255)%3B%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%3Cg%3E%3Ccircle%20stroke-dasharray%3D%22164.93361431346415%2056.97787143782138%22%20r%3D%2235%22%20stroke-width%3D%225%22%20stroke%3D%22%23d1d1d1%22%20fill%3D%22none%22%20cy%3D%2250%22%20cx%3D%2250%22%3E%3CanimateTransform%20keyTimes%3D%220%3B1%22%20values%3D%220%2050%2050%3B360%2050%2050%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%20type%3D%22rotate%22%20attributeName%3D%22transform%22%3E%3C%2FanimateTransform%3E%3C%2Fcircle%3E%3Cg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" width="60" alt="" />
                                <b style={{ color: '#0009' }}>Loading...</b>
                                <p style={{ position: 'absolute', bottom: '3px' }}>Having issues? Try: <span style={{ color: '#369', cursor: 'pointer' }} onClick={() => { setShowFake(false) }}>opening glacier</span></p>
                            </div>
                        </div>
                    )}
                    {!showFake && <SyntaxpadProvider> 
                        <StartMenu updTaskbarWindows={() => {
                            setTaskbarDefaults(selectedOS);
                        }}>
                            <Taskbar apps={taskbarApps} />
                        </StartMenu>
                        <SettingsApp />
                        <CalculatorApp />
                        <TerminalApp />
                        <FileExplorer />
                        <EdgeApp />
                        <CameraApp />
                        <StoreApp />
                        <LunarClientApp />
                        {/* <ModrinthApp /> */}
                        <CloudGaming />
                        <MinecraftLauncherApp />
                        <Syntaxpad />
                        <Bootpad />
                        <DuallerApp />
                        <QuadpadProvider>
                            <Quadpad />
                        </QuadpadProvider>
                    </SyntaxpadProvider>}
                </main>
            </FluentProvider>
        </>
    );
}
