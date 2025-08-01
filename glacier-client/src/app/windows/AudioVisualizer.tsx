import { useState, useRef } from "react";
import Window from "../components/Window";
import "./av.css";
import { useEffect } from "react";

type PeakPosition = "left" | "middle" | "right";

export default function AudioVizApp() {
    const [barCount, setBarCount] = useState<number>(7);
    const [peakPosition, setPeakPosition] = useState<PeakPosition>("middle");
    const [heights, setHeights] = useState<number[]>(Array(7).fill(40));
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [barStyle, setBarStyle] = useState<{
        color: string, corners: number, width: number, minHeight: number, maxHeight: number,
        anchor: 'flex-start' | 'center' | 'flex-end', multiplier: number
    }>({
        color: "#ffffff",
        corners: 0,
        width: 40,
        maxHeight: 220,
        minHeight: 40,
        anchor: "center",
        multiplier: 1
    });
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const arrayBuffer = await file.arrayBuffer();
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            audioContextRef.current.decodeAudioData(arrayBuffer, (buffer) => {
                setAudioBuffer(buffer);
                setIsPlaying(false);
            });
        }
    };

    const handlePlay = () => {
        if (!audioBuffer || !audioContextRef.current) return;
        if (isPlaying) return;
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        if (!analyserRef.current) {
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 128;
        }
        if (!dataArrayRef.current) {
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
        }
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        sourceRef.current = source;
        source.start();
        setIsPlaying(true);

        source.onended = () => {
            setIsPlaying(false);
        };
    };

    const handleStop = () => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch {}
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        setIsPlaying(false);
    };

    const handleClear = () => {
        handleStop();
        setAudioBuffer(null);
        setFileName(null);
        setIsPlaying(false);

        if (animationIdRef.current !== null) cancelAnimationFrame(animationIdRef.current);
        if (analyserRef.current) analyserRef.current.disconnect();
        if (audioContextRef.current) audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
        dataArrayRef.current = null;
        animationIdRef.current = null;
    };

    useEffect(() => {
        setHeights(Array(barCount).fill(barStyle.minHeight));
    }, [barCount]);

    useEffect(() => {
        function animate() {
            if (analyserRef.current && dataArrayRef.current) {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                const step = Math.floor(dataArrayRef.current.length / barCount);
                let newHeights = Array.from({ length: barCount }, (_, i) => {
                    const start = i * step;
                    const end = start + step;
                    const avg =
                        Array.from(dataArrayRef.current!.slice(start, end)).reduce((a, b) => a + b, 0) / step;
                    return Math.max(barStyle.minHeight, Math.min(barStyle.maxHeight, avg*1 + barStyle.minHeight));
                });

                // Anchor bars according to peakPosition
                if (barCount > 1) {
                    let arranged: number[] = [];
                    if (peakPosition === "left") {
                        arranged = newHeights;
                    } else if (peakPosition === "right") {
                        arranged = [...newHeights].reverse();
                    } else if (peakPosition === "middle") {
                        const mid = Math.floor(barCount / 2);
                        arranged = Array(barCount);
                        const sorted = [...newHeights].sort((a, b) => b - a);
                        arranged[mid] = sorted[0];
                        let idx = 1;
                        let offset = 1;
                        while (idx < barCount) {
                            if (mid + offset < barCount) {
                                arranged[mid + offset] = sorted[idx++];
                            }
                            if (idx < barCount && mid - offset >= 0) {
                                arranged[mid - offset] = sorted[idx++];
                            }
                            offset++;
                        }
                    }
                    newHeights = arranged;
                }

                setHeights(newHeights);
            }
            animationIdRef.current = requestAnimationFrame(animate);
        }

        if (isPlaying && analyserRef.current && dataArrayRef.current) {
            animate();
        } else {
            setHeights(Array(barCount).fill(barStyle.minHeight));
        }

        return () => {
            if (animationIdRef.current !== null) cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
        };
    }, [isPlaying, audioBuffer, barCount, peakPosition, barStyle]);

    return (
      <Window title="AudioVizualizer" id="audioviz" defaultSize={{width: 900, height: 500}} minSize={{width: 900, height: 500}} taskbarIconID="audioviz" color={'gray'} seperateBorder="1px solid #ffffff0a">
        <div className="window-full audioviz-window">
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#2a2a2b30',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <div style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#2a2a2b80',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '18px',
                }}>
                    <h2 style={{fontWeight:'500'}}><b>AudioViz</b>ualizer</h2>
                </div>
                <div style={{
                    width: '100%',
                    height: 'calc(100% - 140px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: barStyle.anchor,
                    gap: '8px'
                }}>
                    {heights.map((h,i)=>(
                        <div key={i} className="av-bar" style={{
                            height: h*barStyle.multiplier,
                            width: barStyle.width,
                            backgroundColor: barStyle.color,
                            borderRadius: barStyle.corners,
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* {Math.round(h)} */}
                        </div>
                    ))}
                </div>
                <div style={{
                    width: '100%',
                    height: '100px',
                    backgroundColor: '#2a2a2b80',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: '0 24px',
                    boxSizing: 'border-box'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                        {!audioBuffer ? (
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                style={{marginTop: 0}}
                            />
                        ) : (
                            <>
                                <button onClick={handlePlay} disabled={isPlaying}>Play</button>
                                <button onClick={handleStop}>Stop</button>
                                <button onClick={handleClear}>Clear</button>
                                <span style={{marginLeft: 16, color: "#aaa"}}>{fileName}</span>
                            </>
                        )}
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', flexDirection:'column', gap: 0}}>
                        <div style={{display:'flex',alignItems:'center',gap:8, justifyContent:'center'}}>
                            <label>
                                Width:&nbsp;
                                <input
                                    type="number"
                                    min={2}
                                    max={100}
                                    value={barStyle.width}
                                    onChange={e => {
                                        let v = Math.max(10, Math.min(100, Number(e.target.value)));
                                        setBarStyle({...barStyle, width: v});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Corners:&nbsp;
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={barStyle.corners}
                                    onChange={e => {
                                        let v = Math.max(0, Math.min(100, Number(e.target.value)));
                                        setBarStyle({...barStyle, corners: v});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Color:&nbsp;
                                <input
                                    type="color"
                                    value={barStyle.color}
                                    onChange={e => {
                                        setBarStyle({...barStyle, color: e.target.value});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Min H:&nbsp;
                                <input
                                    type="number"
                                    min={0}
                                    max={200}
                                    value={barStyle.minHeight}
                                    onChange={e => {
                                        let v = Math.max(0, Math.min(200, Number(e.target.value)));
                                        setBarStyle({...barStyle, minHeight: v});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Max H:&nbsp;
                                <input
                                    type="number"
                                    min={0}
                                    max={1000}
                                    value={barStyle.maxHeight}
                                    onChange={e => {
                                        let v = Math.max(0, Math.min(1000, Number(e.target.value)));
                                        setBarStyle({...barStyle, maxHeight: v});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <label>
                                Bars:&nbsp;
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={barCount}
                                    onChange={e => {
                                        let v = Math.max(1, Math.min(30, Number(e.target.value)));
                                        setBarCount(v);
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Peak:&nbsp;
                                <select
                                    value={peakPosition}
                                    onChange={e => setPeakPosition(e.target.value as PeakPosition)}
                                    style={{fontSize: 14}}
                                >
                                    <option value="left">Left</option>
                                    <option value="middle">Middle</option>
                                    <option value="right">Right</option>
                                </select>
                            </label>
                            <label>
                                Anchor:&nbsp;
                                <select
                                    value={barStyle.anchor}
                                    onChange={e => setBarStyle({...barStyle, anchor: e.target.value as any})}
                                    style={{fontSize: 14}}
                                >
                                    <option value="flex-start">Left</option>
                                    <option value="center">Middle</option>
                                    <option value="flex-end">Right</option>
                                </select>
                            </label>
                            <label>
                                Multiplier:&nbsp;
                                <input
                                    type="number"
                                    min={0.1}
                                    max={10}
                                    step={0.1}
                                    value={barStyle.multiplier}
                                    onChange={e => {
                                        let v = Math.max(0.1, Math.min(10, Number(e.target.value)));
                                        setBarStyle({...barStyle, multiplier: v});
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                            <label>
                                Background:&nbsp;
                                <input
                                    type="color"
                                    value={'#2a2a2b30'}
                                    onChange={e => {
                                        const el = document.querySelector('.audioviz-window') as HTMLElement;
                                        if (el) el.style.backgroundColor = e.target.value;
                                    }}
                                    style={{width: 48}}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Window>
    );
}
