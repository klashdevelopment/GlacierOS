import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef, ReactNode } from "react";
import { StartMenuAnimationContext } from "./useStartMenuAnimations";
import { Button } from "@fluentui/react-components";

interface StartMenuProps {
    children: ReactNode;
}

export default function StartMenu({ children }: StartMenuProps) {
    const [scope, animate] = useAnimate();

    function animateIn() {
        animate(scope.current, {
            x: 0,
            y: 0,
        });
    }

    function animateOut() {
        animate(scope.current, {
            x: 0,
            y: 800,
        });
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
                    },
                }}
            >
                <div className="sme-footer">
                    <img src="/windows/user.png" style={{width:'30px'}} alt="" className="circled" />
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