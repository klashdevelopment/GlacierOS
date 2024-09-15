'use client';
// import { ReadonlyURLSearchParams, useParams, useRouter, useSearchParams } from "next/router";
import './flash.css';
import React, { useEffect, useState } from "react"
import createWaflashModule, { initDragAndDrop } from "../../public/wasm/waflash.mjs"
import { useRouter } from "next/router";

declare const window: any;
declare const AWAYFL: any;

const Waflash = (props: any) => {
    if (props.disable) return (<div></div>)

    useEffect(() => {
        let src = (props.src && props.src.publicURL) || props.src;
        src = src ? src.startsWith("http") ? src : window.location.origin + src : '';
        console.log("WAFLASH> Waflash component mounted with src: " + src);

        let waflash = {
            arguments: [src],
            preRun: [],
            postRun: [],
            locateFile(path: any, prefix: any) {
                return "/wasm/" + path;
            },
            print(text: any) {
                //if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
                console.log(text);
            },
            printErr(text: any) {
                //if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
                console.error(text);
            },
            canvas: (function () {
                const canvas = document.getElementById("canvas");
                // As a default initial behavior, pop up an alert when webgl context is lost. To make your
                // application robust, you may want to override this behavior before shipping!
                // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
                canvas?.addEventListener("webglcontextlost", function (e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);
                return canvas;
            })(),
            // monitorRunDependencies: (() => {
            //     let totalDependencies = 0;
            //     return left => {
            //         totalDependencies = Math.max(totalDependencies, left);
            //         waflash.setStatus(left ? 'Preparing... (' + (totalDependencies-left) + '/' + totalDependencies + ')' : 'All downloads complete.');
            //     }
            // })(),
            statusElement: (() => document.getElementById('waflashStatus'))(),
            setStatus: (text: any) => {
                if (!text) return;

                text = text.replace(/Downloading data\.\.\. \((\d+)\/(\d+)\)/, (match: any, receivedBytes: any, totalBytes: any) => {
                    return 'Downloading player... ' + Math.floor(parseInt(receivedBytes) / parseInt(totalBytes) * 100) + '%';
                });

                console.log('WAFLASH> ' + text);

                if (text.indexOf('Loading SWF...') == 0) {
                    text = `Loading SWF <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="48px" height="20px" viewBox="0 0 64 16" xml:space="preserve"><path fill="#beb5f9" fill-opacity="0.42" d="M6.4,4.8A3.2,3.2,0,1,1,3.2,8,3.2,3.2,0,0,1,6.4,4.8Zm12.8,0A3.2,3.2,0,1,1,16,8,3.2,3.2,0,0,1,19.2,4.8ZM32,4.8A3.2,3.2,0,1,1,28.8,8,3.2,3.2,0,0,1,32,4.8Zm12.8,0A3.2,3.2,0,1,1,41.6,8,3.2,3.2,0,0,1,44.8,4.8Zm12.8,0A3.2,3.2,0,1,1,54.4,8,3.2,3.2,0,0,1,57.6,4.8Zm12.8,0A3.2,3.2,0,1,1,67.2,8,3.2,3.2,0,0,1,70.4,4.8Zm12.8,0A3.2,3.2,0,1,1,80,8,3.2,3.2,0,0,1,83.2,4.8ZM96,4.8A3.2,3.2,0,1,1,92.8,8,3.2,3.2,0,0,1,96,4.8Zm12.8,0A3.2,3.2,0,1,1,105.6,8,3.2,3.2,0,0,1,108.8,4.8Zm12.8,0A3.2,3.2,0,1,1,118.4,8,3.2,3.2,0,0,1,121.6,4.8Z"/><g><path fill="#654ff0" fill-opacity="1" d="M-42.7,3.84A4.16,4.16,0,0,1-38.54,8a4.16,4.16,0,0,1-4.16,4.16A4.16,4.16,0,0,1-46.86,8,4.16,4.16,0,0,1-42.7,3.84Zm12.8-.64A4.8,4.8,0,0,1-25.1,8a4.8,4.8,0,0,1-4.8,4.8A4.8,4.8,0,0,1-34.7,8,4.8,4.8,0,0,1-29.9,3.2Zm12.8-.64A5.44,5.44,0,0,1-11.66,8a5.44,5.44,0,0,1-5.44,5.44A5.44,5.44,0,0,1-22.54,8,5.44,5.44,0,0,1-17.1,2.56Z"/><animateTransform attributeName="transform" type="translate" values="23 0;36 0;49 0;62 0;74.5 0;87.5 0;100 0;113 0;125.5 0;138.5 0;151.5 0;164.5 0;178 0" calcMode="discrete" dur="1170ms" repeatCount="indefinite"/></g></svg>`;
                }

                (waflash ? waflash.statusElement as HTMLElement : document.createElement('div')).innerHTML = text;
                if (waflash)
                    waflash.showStatus();
            },
            showStatus() { // helper function
                (waflash ? waflash.statusElement as HTMLElement : document.createElement('div')).style.display = 'block';
            },
            hideStatus() { // helper function
                (waflash ? waflash.statusElement as HTMLElement : document.createElement('div')).style.display = 'none';
            },
            unload() { },

            WAFLASH: {
                hal: {
                    url_transformRequestUrl(url: any) {
                        var pos = url.lastIndexOf('/');
                        if (pos >= 0) {
                            let basepath = url.substr(0, pos + 1);
                            let filename = url.substr(pos + 1);
                            if (basepath == 'http://images.hangame.co.kr/static/flash/flashgame/game/lang/') {
                                return '/assets/hangame/' + filename;
                            }
                        }
                        return url;
                    },
                },
            },
        };
        window.waflash = waflash;

        window.onerror = (message: any, url: any, line: any) => {
            waflash.setStatus('Ooops! An error occurred. Reload the page and try again.');
        };

        waflash.canvas?.addEventListener("keydown", function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        });
        document.onmousedown = (function () {
            let focused = false;
            return function (ev) {
                if (ev.target == waflash.canvas) {
                    if (!focused) {
                        waflash.canvas?.focus();
                        focused = true;
                    }
                }
                else {
                    if (focused) {
                        focused = false;
                    }
                }
            }
        })();

        const sleep = (ms: any) => {
            return new Promise(resolve => {
                setTimeout(resolve, ms)
            })
        }

        waflash.setStatus("Prepairing...");

        createWaflashModule(waflash).then((o: any) => {
            console.log("WAFLASH> Waflash module created!");
            //waflash.hideStatus();
            if (!src) initDragAndDrop(waflash);
        });

        return () => {
            console.log("WAFLASH> Waflash component will unmount!");
            waflash.unload();
            (waflash as any) = null;
            window.waflash = null;
        };
    })

    const waflashCanvasStyle = `
        padding-right: 0;
        margin-left: auto;
        margin-right: auto;
        display: block;
        border: 0px none;
        background-color: black;
        width: ${props.width || '100%'};
        height: ${props.height || '480px'};
        @media (max-width: 640px) {
            width: 100%;
            height: 75vw;
        }
        @media (max-width: 319px) {
            width: 240px;
            height: 180px;
        }
        @media (orientation:landscape) and (max-height:480px) {
            width: 100%;
            height: 75vh;
        }
    `

    const waflashStatusStyle = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        color: white;
        margin: 0px auto;
        padding: 20px;
        font-size: 1.2rem;
        text-align: center;
        background-color: rgba(0,0,0,0.5);
        display: none;
    `

    return (
        <div id="waflashContainer" style={{ position: 'relative', border: `1px solid black` }}>
            <canvas id="canvas" tabIndex={1}></canvas>
            <div id="waflashStatus"></div>
        </div>
    )
}
const AwayFL = (props: any) => {
    useEffect(() => {
        const awayfl = document.createElement('script');
        awayfl.src = '/awayfl/loader.js';
        awayfl.type = 'module';
        document.body.appendChild(awayfl);
        setTimeout(() => {
            const gameConfig = {
                width: 550,
                height: 400,
                splash: './splash.png',
                progress: { // optional
                    back: 'cover url(./progressBack.png)',
                    line: '#cc0022', // or image, it will passed to progressLine background,
                    rect: [0, 0.9, 1, 0.1] // x, y, width, height of preogress line relative container 
                },
                baseUrl: '/awayfl/',
                runtime: ['/awayfl/runtime.js'],
                binary: [{
                    path: props.src,
                    resourceType: 'GAME',
                    name: 'Game', // not used atm
                    meta: {} // not used atm
                }],
            }

            const config = gameConfig;
            AWAYFL.LegacyLoader.init(config);
            AWAYFL.LegacyLoader.runGame((fill: any) => {
                window.dispatchEvent(new CustomEvent('awayfl-player-progress', { detail: fill }));
            }, (config: any, hideLoader: any) => {
                const player = new AWAYFL.Player(document, config);
                window.dispatchEvent(new CustomEvent('awayfl-player-init', { detail: player }));
                player
                    .loadAndPlay()
                    .then((_: any, hide: any) => {
                        window.dispatchEvent(new CustomEvent('awayfl-player-load'));
                        hide && hide() || window.swfParseComplete && window.swfParseComplete();;
                    });
            })
        }, 1000)
    }, []);

    return (
        <div id="splash__image">
            <div id="progress__root">
                <div id="progress__line"></div>
            </div>
        </div>
    )
}

export default function FlashApp() {
    // const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    // const sourceSwf = searchParams.get('src');

    const query = useRouter().query;

    return (
        <>
            <AwayFL src={query['src']} />
            <h1>{query['src']}</h1>
        </>
    );
}