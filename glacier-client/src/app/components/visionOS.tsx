import { openApp } from "./tvOS";

export default function VisionOS() {
    function App({ children, window, name, disabled=false }: { children: string, window?: string|(()=>void), name: string, disabled?: boolean }) {
        const hoverSound = new Audio("/tvos/mp3_focus_change_small.mp3");
        const clickSound = new Audio("/tvos/mp3_focus_change_large.mp3");
        return (
            <div className={`visionOS-icon ${disabled && 'disabled'}`} onMouseEnter={()=>{
                if(!disabled) hoverSound.play();
            }} onClick={()=>{
                if(disabled) return;
                clickSound.play();
                if(window && (typeof window === 'string')) {
                    openApp(window);
                } else if (window && typeof window === 'function') {
                    window();
                }
            }} >
                <img src="/visionos/Highlight.png" className="visionOS-highlight" />
                <img src={`${children}`} alt={children} />
                <span>{name}</span>
            </div>
        );
    }
    return (
        <div className="visionOS">
            <div className="visionOS-row">
                <App name="TV" window="sa-movieslay">/visionos/App=TV.webp</App>
                <App name="Files" window="file-explorer">/visionos/App=Files.webp</App>
                <App name="Apps" disabled>/visionos/App=Compatible Apps.webp</App>
                <App name="Settings" window="settings">/visionos/App=Settings.webp</App>
            </div>
            <div className="visionOS-row">
                <div className="visionOS-filters">
                    <div className="visionOS-filter active"><img src="/visionos/appstoreicon.png" /></div>
                    <div className="visionOS-filter"><img src="/visionos/peopleicon.png" /></div>
                    <div className="visionOS-filter"><img src="/visionos/environmenticon.png" /></div>
                </div>
                <App name="Terminal" window="terminal">/visionos/App=Terminal.webp</App>
                <App name="Messages" disabled>/visionos/App=Messages.webp</App>
                <App name="Safari" window="edge">/visionos/App=Safari.webp</App>
                <App name="Syntaxpad" window="syntaxpad">/visionos/App=Notes.webp</App>
                <App name="App Store" window="store">/visionos/App=App Store.webp</App>
            </div>
            <div className="visionOS-row">
                <App name="Minecraft" window="mclauncher">/windows/minecraft.webp</App>
                <App name="Calculator" window="calculator">/visionos/App=Calculator.webp</App>
                <App name="Music" disabled>/visionos/App=Music.webp</App>
                <App name="Camera" window="camera">/visionos/App=Camera.webp</App>
            </div>
        </div>
    );
}