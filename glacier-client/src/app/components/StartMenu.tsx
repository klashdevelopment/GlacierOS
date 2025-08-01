import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef, ReactNode, useState } from "react";
import { StartMenuAnimationContext } from "./useStartMenuAnimations";
import { Button } from "@fluentui/react-components";

interface StartMenuProps {
    children: ReactNode;
    updTaskbarWindows: () => void;
}

export default function StartMenu({ children, updTaskbarWindows }: StartMenuProps) {
    const [scope, animate] = useAnimate();

    function animateIn() {
        animate(scope.current, {
            x: 0,
            y: 0,
        });
        scope.current.style.display = "block";
    }

    function animateOut() {
        animate(scope.current, {
            x: 0,
            y: 800,
        });
        setTimeout(() => {
            scope.current.style.display = "none";
        }, 400);
    }

    return (
        <StartMenuAnimationContext.Provider value={{ animateIn, animateOut }}>
            {children}
            <motion.div
                className="start-menu"
                ref={scope}
                initial={{
                    x: 0,
                    y: 800,
                }}
                transition={{
                    type: "spring",
                    bounce: 0,
                    ease: "easeInOut",
                    y: {
                        duration: 1,
                        bounce: 0,
                    }
                }}
                style={{
                    display: "none",
                }}
            >
                <button style={{
                    width:'100%',
                    border: 'none',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    padding: '5px 3px',
                    background: '#00001040',
                    color: '#ccc',
                    fontSize: '12px',
                    cursor: 'pointer',
                }} onClick={updTaskbarWindows}>Refresh Taskbar</button>
                <div className="sme-content">
                    <img src="/image/glos.png" style={{
                        margin: 'auto',
                        display: 'block',
                        width: '60%',
                        filter: 'drop-shadow(0 0 5px #000)',
                    }} />
                </div>
                <div className="sme-footer">
                    <img src="/windows/user.webp" style={{width:'30px'}} alt="" className="circled" />
                    <Button
                        onClick={() => {
                            const tab = window.open('about:blank', '_blank') as Window;
                            const iframe = tab.document.createElement('iframe') as any;
                            const stl = iframe.style;
                            stl.border = stl.outline = 'none';
                            stl.width = '100vw';
                            stl.height = '100vh';
                            stl.position = 'fixed';
                            stl.left = stl.right = stl.top = stl.bottom = '0';
                            iframe.src = self.location;
                            tab.document.body.appendChild(iframe);
                        }}>Open Cloaked</Button>
                    <Button
                        onClick={() => {
                            window.localStorage.removeItem("auth");
                            window.location.reload();
                        }}>Sign Out</Button>
                </div>
            </motion.div>
        </StartMenuAnimationContext.Provider>
    );
}