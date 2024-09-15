"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import "./newtab.css";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, Button, FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { PinFilled, AddCircleFilled, PinOffRegular } from "@fluentui/react-icons";

export default function Newtab() {
    const [pins, setPins] = useState<string[]>([]);

    useEffect(() => {
        // localstorage "pins", if not exists, create it
        const localPins = window.localStorage.getItem("pins");
        if (localPins) {
            setPins(JSON.parse(localPins));
        } else {
            setPins([]);
        }

        var bg1 = Math.floor(Math.random() * 21) + 47;
        var bg2 = Math.floor(Math.random() * 13) + 7;
        var bgx = Math.floor(Math.random() * 2) + 1 == 1 ? bg1 : bg2;
        var bg = bgx < 10 ? `0${bgx}` : bgx;
        document.body.style.backgroundImage = `url("https://manganum.fra1.cdn.digitaloceanspaces.com/collections/nature/100${bg}-fhd.jpg")`;
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.flexDirection = 'column';
        document.body.style.width = '100vw';
        document.body.style.height = '100vh';
        document.body.style.padding = '0px';
        document.body.style.margin = '0px';
        document.body.style.verticalAlign = 'baseline';
        document.body.style.fontFamily = "Inter, \"Segoe UI\", Arial, Helvetica, sans-serif";
    }, []);

    function addPin(url: string) {
        setPins([...pins, url]);
        window.localStorage.setItem("pins", JSON.stringify([...pins, url]));
    }

    return (
        <>
            <Head>
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <FluentProvider theme={webDarkTheme} style={{ lineHeight: 'unset', width: '100%', height: '100%', backdropFilter: 'url(#noiseFilter)', background: 'rgba(33,33,33,0.5)', color: "white", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: 'column' }}>
                <svg viewBox="0 0 200 200" style={{ display: 'none' }} xmlns='http://www.w3.org/2000/svg'>
                    <filter id='noiseFilter'>
                        <feGaussianBlur stdDeviation='15' />
                    </filter>
                </svg>
                <img src="/windows/glacierwhite.png" style={{ width: '80px' }} alt="" />
                <b style={{ fontSize: '65px' }}>GlacierOS</b>
                <Accordion openItems={[1]} style={{ maxWidth: '40%', minWidth:'30%', background: 'rgba(33,33,33,0.4)', borderRadius: '5px' }}>
                    <AccordionItem value={1}>
                        <AccordionHeader expandIcon={<PinFilled />}>Pins
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
                                <Button appearance="secondary" onClick={() => {
                                    var pin = prompt("Enter a URL to pin");
                                    if (pin) {
                                        addPin(pin);
                                    }
                                }} icon={<AddCircleFilled />} />
                            </div>
                        </AccordionHeader>
                        <AccordionPanel>
                            {pins.map((pin, index) => (
                                <div key={index} style={{justifyContent: 'space-between',display:'flex', whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis',maxWidth:'100%'}}>
                                    <Button appearance="transparent" onClick={() => {
                                        window.location.href = pin;
                                    }} style={{ width: '85%', whiteSpace: 'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{pin}
                                    </Button>
                                    <Button appearance="secondary" onClick={() => {
                                            setPins(pins.filter((_, i) => i !== index));
                                            window.localStorage.setItem("pins", JSON.stringify(pins.filter((_, i) => i !== index)));
                                        }} icon={<PinOffRegular />} />
                                </div>
                            ))}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </FluentProvider>
        </>
    )
}