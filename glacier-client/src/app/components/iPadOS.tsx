import { openApp } from "./tvOS";

type AppProps = {
    icon?: string;
    label?: string;
    window?: string;
};

function App({ icon, label, window }: AppProps) {
    return (
        <div className={`ipadOS-app ${window ? '' : 'disabled'}`} onClick={()=>{
            if(window) openApp(window);
        }}>
            {icon && <img src={icon} />}
            {label && <span>{label}</span>}
        </div>
    );
}

export default function IPadOS() {
    return (
        <>
            <div className="ipadOS">
                <img style={{
                    position: 'absolute',
                    top: 10, right: 10,
                    width: '150px'
                }} src="/ipados/trail.svg" alt="" />
                <div className="ipadOS-inner">
                    <div className="ipadOS-row">
                        <App icon="/ipados/calender.webp" label="Calendar" />
                        <App icon="/ipados/files.webp" window={'file-explorer'} label="Files" />
                        <App icon="/ipados/messages.webp" label="Messages" />
                        <App icon="/ipados/photos.webp" label="Photos" />
                        <App icon="/ipados/safari.webp" window={'edge'} label="Safari" />
                        <App icon="/ipados/settings.webp" window={'settings'} label="Settings" />
                    </div>
                    <div className="ipadOS-row">
                        <App icon="/ipados/camera.webp" window={'camera'} label="Camera" />
                        <App icon="/ipados/games.webp" window={'store'} label="Games" />
                        <App icon="/ipados/tv.webp" window={'sa-movieslay'} label="TV" />
                        <App icon="/ipados/store.webp" window={'store'} label="App Store" />
                        <App icon="/ipados/mail.webp" label="Mail" />
                        <App icon="/ipados/syntaxpad.webp" window={'syntaxpad'} label="Syntaxpad" />
                    </div>
                    <div className="ipadOS-row">
                        <App icon="/ipados/music.webp" label="Music" />
                        <App />
                        <App />
                        <App />
                        <App />
                        <App />
                    </div>
                </div>
            </div>
        </>
    );
}
