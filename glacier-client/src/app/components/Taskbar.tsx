'use client';
import { MouseEventHandler, useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import { Wifi1Regular, WifiOffRegular, Speaker2Regular } from "@fluentui/react-icons";
// import Battery0Regular-10Regular from "@fluentui/react-icons";
import { Battery0Regular, Battery1Regular, Battery2Regular, Battery3Regular, Battery4Regular, Battery5Regular, Battery6Regular, Battery7Regular, Battery8Regular, Battery9Regular, Battery10Regular } from "@fluentui/react-icons";
import { useBattery } from "@uidotdev/usehooks";
import useOnlineStatus from '../utils/useOnlineStatus';
import { Tooltip } from "@fluentui/react-components";
import { formatName } from "../windows/store/StoreApps";
import StartMenu from "./StartMenu";
import { useStartMenuAnimations } from "./useStartMenuAnimations";
import {motion, useMotionValue, useTransform, useSpring, MotionValue} from "framer-motion";

function BatteryIcon({ percent }: {percent: number}) {
    const batteryComponents = [Battery0Regular, Battery1Regular, Battery2Regular, Battery3Regular, Battery4Regular, Battery5Regular, Battery6Regular, Battery7Regular, Battery8Regular, Battery9Regular, Battery10Regular];
    const index = Math.min(Math.max(Math.floor(percent * 10), 0), 10);
    const BatteryComponent = batteryComponents[index];
    
    return <BatteryComponent />;
}

// class taskbarapp
export class TaskbarApp {
    name: string;
    icon: string;
    window: string;
    constructor(name: string, icon: string, window: string) {
        this.name = name;
        this.icon = icon;
        this.window = window;
    }
}

export default function Taskbar({
    apps,
}: Readonly<{
    apps: TaskbarApp[];
}>) {
    const [selectedOS, setSelectedOS] = useState("windows");
    const [macOSDockEffects, setMacOSDockEffects] = useState(true);

    useEffect(() => {
        const os = window.localStorage.getItem("os");
        if (os) {
            setSelectedOS(os);
        } else {
            window.localStorage.setItem("os", "windows");
        }

        const dockEffects = window.localStorage.getItem("macOS-dock-effects");
        if (dockEffects) {
            setMacOSDockEffects(dockEffects === "true");
        }
    }, []);
    const battery = useBattery();
    const wifi = useOnlineStatus();

    function toggle(app: TaskbarApp, addCurrent: boolean = false) {
        let taskbarApp = document.getElementById(app.window + '-tb-app');
        if (taskbarApp) {
            taskbarApp.classList.toggle('active');
            if (addCurrent)
                taskbarApp.classList.toggle('current');
        }
        let window = document.getElementsByClassName(app.window)[0];
        if (window) {
            if (window.classList.contains('closing')) {
                window.classList.remove('closing');
                window.classList.add('opening');
            } else {
                window.classList.remove('opening');
                window.classList.add('closing');
            }
        }
    }
    const [curTime, setCurTime] = useState(``);
    const [curDate, setCurDate] = useState(``);
    const [maccurDate, setMacCurDate] = useState(``);

    const [cmpX, setCmpX] = useState(0);
    const [cmpY, setCmpY] = useState(0);
    const [cmpOpen, setCmpOpen] = useState(false);
    const [cmpHovered, setCmpHovered] = useState(false);
    const { animateIn, animateOut } = useStartMenuAnimations();
    const [startMenuOpen, setStartMenuOpen] = useState(false);

    function taskbarMouseMove(e: any) {
        const mouseX = e.clientX;
        const apps = document.querySelectorAll('.w11-taskbar-app') as NodeListOf<HTMLDivElement>;

        const intensity = 2; // Adjust this value to control the intensity of the effect

        apps.forEach((tbApp) => {
            if (tbApp == undefined || tbApp == null) return;
            const img = tbApp.querySelector('img') as HTMLImageElement;
            const imgRect = img.getBoundingClientRect();
            const imgCenterX = imgRect.left + imgRect.width / 2;
            const distance = Math.abs(mouseX - imgCenterX);

            // Adjust the scaling using the intensity variable
            let scale = Math.max(1, intensity - distance / 100);

            if (distance < 400) {
                // Stretch outside the taskbar for hovered icon
                img.style.transform = `scale(${scale})`;
                img.style.zIndex = "" + Math.floor(scale * 10); // Ensure the icon hovers above others
            } else {
                // Reset for distant icons
                img.style.transform = 'scale(1)';
                img.style.zIndex = '1';
            }
        });
    }
    function taskbarMouseLeave(e: any) {
        const apps = document.querySelectorAll('.w11-taskbar-app') as NodeListOf<HTMLDivElement>;
        apps.forEach((tbApp) => {
            const img = tbApp.querySelector('img') as HTMLImageElement;
            img.style.transform = 'scale(1)';
            img.style.zIndex = '1';
        });
    }

    useEffect(() => {
        document.addEventListener('storage', () => {
            const dockEffects = window.localStorage.getItem("macOS-dock-effects");
            if (dockEffects) {
                setMacOSDockEffects(dockEffects === "true");
            }
        })
        document.addEventListener('click', () => {
            // if hovering over the cmp, don't close it
            if (cmpHovered) return;
            setCmpOpen(false);
        });
        setInterval(() => {
            setCurTime(`${new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`);
            setCurDate(`${(new Date().getMonth() + 1) + '/' + new Date().getDate() + '/' + new Date().getFullYear()}`);
            const d = new Date();
            let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            setMacCurDate(`${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`);
        }, 1000);
    })

    function toggleStartMenu() {
        toggle({ name: 'Start', icon: '', window: 'startmenu' }, false);
        if (startMenuOpen) {
            setStartMenuOpen(false);
            animateOut();
        } else {
            setStartMenuOpen(true);
            animateIn();
        }
    }

    function w11TaskbarApp(start: boolean, app: TaskbarApp) {
        // let ref = useRef<HTMLDivElement>(null);
      
        // let distance = useTransform(mouseX, (val) => {
        //   let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      
        //   return val - bounds.x - bounds.width / 2;
        // });
      
        // let widthSync = useTransform(distance, [-150, 0, 150], [40, 100, 40]);
        // let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

        return start ? <div className="w11-taskbar-app" id="startmenu-tb-app" onClick={function () { toggleStartMenu() }}>
            <img src={`/${selectedOS}/start.webp`} alt={formatName(selectedOS, 'Start')} />
            <span>{formatName(selectedOS, 'Start')}</span>
        </div> : <div key={app.window + '-tb-key'} id={app.window + '-tb-app'} className="w11-taskbar-app" onClick={function () { toggle(app) }}>
            <img src={app.icon} alt={app.name} />
            <span>{formatName(selectedOS, app.name)}</span>
        </div>;
    }
    return (
        <>
            {/* <div id="taskbarParent"> */}
            <div id="taskbar"
                className="w11-taskbar" onContextMenu={(e) => {
                    e.preventDefault();
                    setCmpX(e.clientX);
                    setCmpY(e.clientY);
                    setCmpOpen(true);
                    return false;
                }}>
                {selectedOS !== 'macos' ?
                    <Tooltip content={formatName(selectedOS, 'Start')} relationship="label">
                        {w11TaskbarApp(true, { name: 'Start', icon: '', window: 'startmenu' })}
                    </Tooltip> : w11TaskbarApp(true, { name: 'Start', icon: '', window: 'startmenu' })}

                {apps.map((app) => (
                    <>
                        {selectedOS !== 'macos'
                            ?
                            <Tooltip content={formatName(selectedOS, app.name)} relationship="label">
                                {w11TaskbarApp(false, app)}
                            </Tooltip>
                            :
                            w11TaskbarApp(false, app)
                        }
                    </>
                ))}

                <div className="w11-rightside">
                    <div className="rightside-item align-center windows-only-flex">
                        {wifi ? <Wifi1Regular fontSize={'20px'} /> : <WifiOffRegular fontSize={'20px'} />}
                        <Speaker2Regular fontSize={'20px'} />
                        {battery.level as number > 0.5 ? <Battery10Regular fontSize={'20px'} /> : (battery.level as number > 0.2 ? <Battery5Regular fontSize={'20px'} /> : <Battery1Regular fontSize={'20px'} />)}
                    </div>
                    <div className="rightside-item flex-column windows-only-flex">
                        <div id='tbtime'>{curTime}</div>
                        <div id='tbdate'>{curDate}</div>
                    </div>
                </div>
            </div>

            <div className="mac-only topbar">
                <span style={{ margin: '1px 12px', display: 'inline-flex', alignItems: 'center' }} id="macicon" onClick={() => {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                }}><img src="/macos/apple.svg" width={'12px'} height={'15px'} /></span>
                <b style={{ margin: '0px 6px' }}>Finder</b>
                <div style={{ float: 'right', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}>{wifi ? <Wifi1Regular fontSize={'16px'} /> : <WifiOffRegular fontSize={'16px'} />}</span>
                    <span style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}><Speaker2Regular fontSize={'16px'} /></span>
                    <span style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}><BatteryIcon percent={battery.level as number} /></span>
                    <span style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}>{maccurDate}</span>
                    <span style={{ marginLeft: '6px', display: 'flex', alignItems: 'center' }}>{curTime}</span>
                </div>
            </div>
            <div style={{ width: '175px', background: '#ffffff50', backdropFilter: 'url("#blur-20")', position: 'absolute', zIndex: 999, borderRadius: '6px', color: 'black', top: `${cmpY}px`, left: `${cmpX}px`, display: cmpOpen ? 'block' : 'none' }}
                onMouseEnter={() => { setCmpHovered(true) }}
                onMouseLeave={() => { setCmpHovered(false) }}
            >
                <button style={{ width: '100%', height: '23px', background: 'transparent', borderRadius: '6px', border: 'none', padding: '5px' }}>No menu items</button>
                <button style={{ width: '100%', height: '23px', background: 'transparent', borderRadius: '6px', border: 'none', padding: '5px' }}>currently avalible</button>
                <button style={{ width: '100%', height: '23px', background: 'transparent', borderRadius: '6px', border: 'none', padding: '5px' }}>in this Glacier version.</button>
            </div>
            {/* </div> */}
        </>
    )
}