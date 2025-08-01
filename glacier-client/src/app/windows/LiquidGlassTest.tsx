import { useEffect, useState } from "react";
import Window from "../components/Window";
import { wallpapers } from "./Settings";

export default function LiquidGlassApp() {
    const [bg, setBg] = useState('');
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [style, setStyle] = useState('liquid-glass-new');
    useEffect(() => {
        setBg(document.body.style.background || (window.localStorage.getItem('background') && `url(${window.localStorage.getItem('background')})`) || '#000');
    }, []);
    return (
        <Window title="Liquid Glass Test" id="liquidglass" defaultSize={{ width: 380, height: 500 }} taskbarIconID="liquidglass" color={'gray'} seperateBorder="1px solid #ffffff0a">
            <div onMouseMove={(ev) => {
                var x = ev.clientX;
                var y = ev.clientY;
                var div = ev.currentTarget;
                var rect = div.getBoundingClientRect();
                // keep between bounds of this div
                if (x < 0) x = 0;
                if (y < 175) y = 175;
                if (x > rect.width) x = rect.width;
                if (y > rect.height) y = rect.height;
                
                setMouse({ x: x, y: y });
            }} className="window-full" style={{ backgroundImage: bg, backgroundPosition: '50%', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', overflow:'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: mouse.y - 125,
                    left: mouse.x - 125,
                    width: '250px', height: '250px', backdropFilter: `url(#${style})`, zIndex: 0, borderRadius: '50%', border: '1px solid #ffffff4a', background: 'rgba(255,255,255,0.1)'
                }}></div>
                <div style={{
                    position: 'absolute',
                    top: 50,
                    right: 10,
                    width: '200px',
                    padding: '8px 6px',
                    backdropFilter: `url(#liquid-glass-new)`,
                    borderRadius: '8px',
                    border: '2px solid #0000004a',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'safe center',
                    justifyContent: 'safe center',
                    overflowY: 'scroll',
                    maxHeight: 'calc(100% - 90px)',
                    userSelect: 'none',
                }}>
                    <b>Background</b>
                    {wallpapers.map((wallpaper, index) => (
                        <button key={index} onClick={() => {
                            setBg(`url(/windows/wallpaper${index + 1}.webp)`);
                        }} style={{
                            width: '100%',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontFamily: 'Inter, SF Pro Display, sans-serif',
                            fontWeight: '400',
                        }}>{wallpaper}</button>
                    ))}
                    <button onClick={() => {
                        var url = prompt('Enter image URL');
                        if (url) {
                            setBg(`url(${url})`);
                        }
                    }} style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'Inter, SF Pro Display, sans-serif',
                        fontWeight: '400',
                    }}>Custom URL</button>
                </div>
                <div style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    width: '200px',
                    padding: '8px 6px',
                    backdropFilter: `url(#liquid-glass-new)`,
                    borderRadius: '8px',
                    border: '2px solid #0000004a',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'safe center',
                    justifyContent: 'safe center',
                    overflowY: 'scroll',
                    maxHeight: 'calc(100% - 90px)',
                    userSelect: 'none',
                }}>
                    <button onClick={() => {
                        setStyle('liquid-glass');
                    }} style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'Inter, SF Pro Display, sans-serif',
                        fontWeight: '400',
                    }}>Liquid Glass</button>
                    <button onClick={() => {
                        setStyle('liquid-glass-blur');
                    }} style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'Inter, SF Pro Display, sans-serif',
                        fontWeight: '400',
                    }}>Liquid Glass + Blur</button>
                    <button onClick={() => {
                        setStyle('liquid-glass-new');
                    }} style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'Inter, SF Pro Display, sans-serif',
                        fontWeight: '400',
                    }}>Liquid Glass (New)</button>
                    <button onClick={() => {
                        setStyle('liquid-glass-new-blur');
                    }} style={{
                        width: '100%',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: 'Inter, SF Pro Display, sans-serif',
                        fontWeight: '400',
                    }}>Liquid Glass (New) + Blur</button>
                </div>
            </div>
        </Window>
    );
}