'use client';
import Quadpad from "./windows/Quadpad";
import { QuadpadProvider } from "./windows/QuadpadContext";
import './quadpad-only.css';
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";

export default function Home() {
    return (
        <>
            <FluentProvider theme={webDarkTheme}>
                <QuadpadProvider>
                    <Quadpad />
                </QuadpadProvider>
            </FluentProvider>
        </>
    );
}
