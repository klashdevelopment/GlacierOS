import { useEffect, useRef } from "react";

export function openApp(className: string) {
    let window = document.getElementsByClassName(className)[0];
    if (window) {
        window.classList.add('tvos-open');
        if (window.classList.contains('closing')) {
            window.classList.remove('closing');
            window.classList.add('opening');
        } else {
            window.classList.remove('opening');
            window.classList.add('closing');
        }
    }
}

export default function TVOS() {
    function AppIcon({ children, window, disabled=false }: { children: string, window?: string|(()=>void), disabled?: boolean }) {
        const hoverSound = new Audio("/tvos/mp3_focus_change_small.mp3");
        const clickSound = new Audio("/tvos/mp3_focus_change_large.mp3");
        return (
            <img onMouseEnter={()=>{
                if(!disabled) hoverSound.play();
            }} onClick={()=>{
                if(disabled) return;
                clickSound.play();
                if(window && (typeof window === 'string')) {
                    openApp(window);
                } else if (window && typeof window === 'function') {
                    window();
                }
            }} className={`tvos-icon ${disabled && 'disabled'}`} src={`${children}`} alt={children} />
        );
    }
    const headerInner = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(window.localStorage.background && headerInner.current) {
            headerInner.current.style.backgroundImage = `url(${window.localStorage.background})`;
        } else if (headerInner.current) {
            headerInner.current.style.backgroundImage = "url(https://baylorlariat.com/wp-content/uploads/2022/04/Severance-scaled.jpg)";
        }
    }, []);
    return (
        <div className="tvOS">
            <div className="tvOS-header">
                <div className="tvOS-header-inner" ref={headerInner} style={{ backgroundImage: "url(https://baylorlariat.com/wp-content/uploads/2022/04/Severance-scaled.jpg)" }}></div>
            </div>
            <div className="tvOS-content">
                <div className="tvos-app-row tvos-app-row-main">
                    <AppIcon window={'settings'}>/tvos/settings.png</AppIcon>
                    <AppIcon window={'sa-movieslay'}>/tvos/appletv.png</AppIcon>
                    <AppIcon window={'store'}>/tvos/games.png</AppIcon>
                    <AppIcon disabled>/tvos/facetime.png</AppIcon>
                    <AppIcon window={'edge'}>/tvos/search.png</AppIcon>
                    <AppIcon window={'store'}>/tvos/appstore.png</AppIcon>
                </div>
                <div className="tvos-app-row">
                    <AppIcon window={'terminal'}>/tvos/terminal.png</AppIcon>
                    <AppIcon window={'file-explorer'}>/tvos/files.png</AppIcon>
                    <AppIcon window={'calculator'}>/tvos/calculator.png</AppIcon>
                    <AppIcon window={'camera'}>/tvos/camera.png</AppIcon>
                    <AppIcon window={'mclauncher'}>/tvos/minecraft.png</AppIcon>
                    <AppIcon disabled>/tvos/blank.png</AppIcon>
                </div>
            </div>
        </div>
    );
}