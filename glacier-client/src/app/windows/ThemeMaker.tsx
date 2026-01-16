"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Window from "../components/Window";
import "./thememaker.css";
import { Button, Checkbox, Dropdown, Label, Option, Popover, PopoverSurface, PopoverTrigger, Slider } from "@fluentui/react-components";
import { CaretDown20Filled, CaretUp20Filled, DismissCircle20Filled } from "@fluentui/react-icons";
import { ColorPicker } from "@fluentui/react";
import OneDarkPro from "../themes/oneDarkPro.json";
import { Editor, Monaco } from "@monaco-editor/react";

export var iconSets = [
    {
        name: 'Windows 11',
        value: 'windows'
    },
    {
        name: 'Windows 10',
        value: 'windows10'
    },
    {
        name: 'macOS',
        value: 'macos'
    },
    {
        name: 'macOS High Sierra',
        value: 'macos-high-sierra'
    },
    {
        name: 'macOS Tahoe (Glass)',
        value: 'tahoe'
    },
    {
        name: 'macOS Tahoe (Dark)',
        value: 'tahoe-dark'
    },
    {
        name: 'Ubuntu',
        value: 'ubuntu'
    },
    {
        name: 'Kali',
        value: 'kali'
    },
    {
        name: 'ChromeOS',
        value: 'chromeos'
    }
];

export interface BorderStyle {
    width: number,
    color: string,
    rounding?: number
}
export type Border = BorderStyle | 'none';
export interface TaskbarIcons {
    base: string,
    [key: string]: string
}
export interface CustomTheme {
    icons: TaskbarIcons,
    taskbar: {
        background: string,
        macOSstyle: boolean,
        border: Border,
        topbar: boolean,
        icons: {
            macOSstyle: boolean
            gap: number
            size: number
        },
        rightside: boolean,
    },
    customCSS: string,
    windows: {
        border: Border,
        controls: {
            macOSstyle: boolean
        }
    }
}

function exportTheme(theme: CustomTheme) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(theme));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "theme.glost");
    dlAnchorElem.click();
}
export function importTheme(): Promise<CustomTheme | null> {
    return new Promise<CustomTheme | null>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.glost,application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                resolve(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const theme = JSON.parse(e.target?.result as string);
                    resolve(theme);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });
}
function computeBorder(border: Border): string {
    if (border === 'none') return 'none';
    return `${border.width}px solid ${border.color}`;
}
function computeRounding(border: Border): string {
    if (border === 'none') return '0px';
    return border.rounding + 'px' || '0px';
}
export function computeTheme(theme: CustomTheme): string {
    return `
        .w11-window {
            border: ${computeBorder(theme.windows.border)} !important;
            border-radius: ${computeRounding(theme.windows.border)} !important;
        }
        .w11-window .w11-controls {
            border-radius: ${computeRounding(theme.windows.border)} !important;
        }
        #taskbar {
            background: ${theme.taskbar.background} !important;
            border: ${computeBorder(theme.taskbar.border)} !important;
            border-radius: ${computeRounding(theme.taskbar.border)} !important;
            ${theme.taskbar.macOSstyle ? `
            bottom: 10px !important;
            width: auto !important;
            padding: 0px 4px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            box-sizing: border-box !important;
            ` : ''}
        }
        .w11-rightside {
            display: ${theme.taskbar.rightside ? 'flex' : 'none'} !important;
        }
        .w11-taskbar-app {
            margin: 0 ${theme.taskbar.icons.gap / 2}px !important;
            padding: 0px 0px !important;
        }
        .w11-taskbar-app img {
            width: ${theme.taskbar.icons.size}% !important;
            height: auto !important;
        }
        ${theme.taskbar.icons.macOSstyle ? `
            .w11-taskbar-app:hover {
                background: transparent !important;
            }
            .w11-taskbar-app > img {
                transition: all 0.2s ease !important;
                transform-origin: bottom center;
            }
            .w11-taskbar-app:hover > img {
                scale: 1.15 !important;
                filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5)) !important;
            }
            .w11-taskbar-app.active, .w11-taskbar-app.current {
                background: transparent !important;
            }
            .w11-taskbar-app.active::after {
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                content: '';
                width: 4px;
                height: 4px;
            }
        ` : ''}
        ${theme.taskbar.topbar ? `
            .topbar {
                display: flex !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 100;
                backdrop-filter: blur(10000px);
                padding: 5px;
                background: #00000050;
            }
        ` : ''}
        ${theme.windows.controls.macOSstyle ? `
            .w11-title {
                left: 60px;
                position: absolute;
            }
            .w11-controls {
                width: 77%;
                height: 100%;
                user-select: none;
            }
            .w11-controls > div {
                user-select: none;
                float: inherit !important;
                cursor: default !important;
                background: transparent !important;
                margin: 8px 8px;
                position:absolute;
                top: 3px;
                transition: all 0.25s ease;
                width: 10px;
                height: 10px;
                padding: 0px !important;
                border-radius: 50%;
            }
            .w11-controls > div.end {
                left:5px;
                border-top-right-radius: 50% !important;
                background: red !important;
            }
            .w11-controls > div.mid {
                left:35px;
                background: lime !important;
            }
            .w11-controls > div.left {
                left:20px;
                background: yellow !important;
            }
            .w11-controls > div > img {
                display: none;
            }
        `: ''}
        ${theme.customCSS || ''}
    `;
}

function ColPick({
    onChange,
    color,
    open,
    close,
    id,
}: {
    onChange: (color: string) => void;
    color: string;
    close: () => void;
    open: boolean;
    id: string;
}) {
    return (
        <Popover
            open={open}
            trapFocus
        >
            <PopoverTrigger>
                <div />
            </PopoverTrigger>
            <PopoverSurface>
                <ColorPicker
                    color={color}
                    onChange={(_, data) => onChange(data.str)}
                ></ColorPicker>
                <Button onClick={close}>Close</Button>
            </PopoverSurface>
        </Popover>
    );
}

function Section({ children, title, open, setOpen }: {
    children?: React.ReactNode,
    title: string,
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    return (
        <div className={`thememaker-section ${open ? "open" : ""}`}>
            <div className={`tms-bar`} onClick={() => setOpen(!open)}>
                {open ? <CaretUp20Filled /> : <CaretDown20Filled />}
                {title}
            </div>
            {open && <div className="tms-content">
                {children}
            </div>}
        </div>
    )
}
function MiniSection({ children, title }: {
    children?: React.ReactNode,
    title: string
}) {
    return (
        <div className="tms-minisection">
            <b className="tms-ms-title">{title}</b>
            <div className="tms-ms-content">
                {children}
            </div>
        </div>
    )
}
function BorderEditor({ border, onChange }: {
    border: Border,
    onChange: (border: Border) => void
}) {
    const [colorOpen, setColorOpen] = useState(false);

    // Use local state only if border is not 'none'
    const width = border === 'none' ? 0 : border.width;
    const rounding = border === 'none' ? 0 : border.rounding ?? 0;
    const color = border === 'none' ? '#000000' : border.color;

    return (
        <div className="border-editor">
            <Checkbox label="Enable border" checked={border !== 'none'} onChange={(_, data) => {
                if (data.checked == false) {
                    onChange('none');
                } else {
                    onChange({
                        width: 1,
                        color: '#000000',
                        rounding: 0
                    });
                }
            }} />
            {border !== 'none' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '8px'
                }}>
                    <ColPick id="border-color" onChange={(color) => onChange({
                        ...border,
                        color
                    })} color={color} open={colorOpen} close={() => setColorOpen(false)} />
                    <input
                        type="number"
                        value={width}
                        min="0"
                        max="20"
                        onChange={e => {
                            const newWidth = parseInt(e.target.value, 10) || 0;
                            onChange({
                                ...border,
                                width: newWidth
                            });
                        }}
                    />
                    px thick
                    <div style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: color,
                        border: '1px solid #ffffff4a',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'inline-block',
                        marginLeft: 8,
                        marginRight: 8
                    }} onClick={
                        () => setColorOpen(true)
                    }></div> border with
                    <input
                        type="number"
                        value={rounding}
                        min="0"
                        max="100"
                        onChange={e => {
                            const newRounding = parseInt(e.target.value, 10) || 0;
                            onChange({
                                ...border,
                                rounding: newRounding
                            });
                        }}
                    />
                    px rounding
                </div>
            )}
        </div>
    )
}

export default function ThemeMakerApp({
    setTaskbar
}: {
    setTaskbar: (os?: string, customIcons?: Record<string, string>) => void
}) {
    const [started, setStarted] = useState(false);
    const [theme, setTheme] = useState<CustomTheme>({
        icons: { base: 'windows' },
        taskbar: {
            background: 'rgb(32, 32, 32, 0.6)',
            macOSstyle: false,
            border: 'none',
            topbar: false,
            icons: {
                macOSstyle: false,
                gap: 4,
                size: 100
            },
            rightside: false
        },
        customCSS: '',
        windows: {
            border: 'none',
            controls: {
                macOSstyle: false
            }
        }
    });

    useEffect(() => {
        if (!started) return;
        document.querySelector('#oscss')?.remove();
        document.querySelectorAll('.creator-css,.customtheme').forEach(e => e.remove());
        var style = document.createElement('style');
        style.className = 'creator-css';
        style.innerHTML = computeTheme(theme);
        document.head.appendChild(style);
    }, [started, theme]);
    useEffect(() => {
        if (!started) return;
        setTaskbarWrapper(theme.icons.base, theme.icons);
    }, [started]);

    const [tbbgOpen, setTbbgOpen] = useState(false);
    const [sect, setOpenSections] = useState({
        info: false,
        taskbar: false,
        windows: false,
        icons: false,
        preview: false,
        export: false,
        css: false
    });
    useEffect(() => {
        if (!started) return;
        setOpenSections({
            info: true,
            taskbar: false,
            windows: false,
            icons: false,
            preview: false,
            export: false,
            css: false
        });
    }, [started]);
    function sectionSetter(section: string) {
        return (open: boolean) => {
            setOpenSections({
                ...sect,
                [section]: open
            });
        }
    }
    const appIcons = ['start', 'icons/explorer', 'settings', 'icons/terminal', 'icons/edge', 'dueller', 'syntaxpad', 'icons/calculator', 'icons/camera', 'store', 'minecraft'];
    function OSAndIcons({ iconSet }: { iconSet: string }) {
        return (
            <div className="tms-appicon">
                {appIcons.map(ai => (
                    <img src={`/${iconSet}/${ai}.webp`} style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '0px',
                    }} />
                ))}
            </div>
        )
    }

    function getImageDataURL(): Promise<string | null> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/webp';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) {
                    resolve(null);
                    return;
                }
                if (file.size > 10 * 1024) {
                    alert('File is too large. Must be under 10kb.');
                    resolve(null);
                    return;
                }
                const img = new Image();
                img.onload = () => {
                    if (img.width !== img.height) {
                        alert('Image must be square.');
                        resolve(null);
                        return;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        alert('Could not get canvas context.');
                        resolve(null);
                        return;
                    }
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/webp');
                    resolve(dataURL);
                };
                img.onerror = () => {
                    alert('Could not load image. Make sure it is a valid webp file.');
                    resolve(null);
                };
                img.src = URL.createObjectURL(file);
            };
            input.click();
        });
    }

    function setTaskbarWrapper(os: string, customIcons?: Record<string, string>) {
        if (customIcons?.start) {
            document.querySelector('#startmenu-tb-app img')?.setAttribute('src', customIcons.start);
        } else {
            document.querySelector('#startmenu-tb-app img')?.setAttribute('src', `/${os}/start.webp`);
        }
        setTaskbar(os, customIcons);
    }

    function gi(icon: string) {
        var iff = fi(icon);
        return theme.icons[iff] ? theme.icons[iff] : `/${theme.icons.base}/${icon}.webp`;
    }
    function fi(icon: string) {
        return {
            'start': 'start',
            'icons/explorer': 'explorer',
            'settings': 'settings',
            'icons/terminal': 'terminal',
            'icons/edge': 'edge',
            'dueller': 'dueller',
            'syntaxpad': 'syntaxpad',
            'icons/calculator': 'calculator',
            'icons/camera': 'camera',
            'store': 'store',
            'minecraft': 'minecraft'
        }[icon] || icon;
    }

    const cssSection = useMemo(() => {
        return (
            <Section open={sect.css} setOpen={
                sectionSetter('css')
            } title="Custom CSS">
                <span>Add custom CSS to further customize your theme. Be careful, as incorrect CSS may break the UI.</span>
                <Editor options={{
                    fontSize: 14,
                    fontLigatures: true,
                    minimap: {
                        enabled: false
                    },
                    bracketPairColorization: {
                        enabled: true
                    },
                    formatOnPaste: true,
                    placeholder: '\/* Enter your custom CSS here */\n',
                }} theme={"OneDarkPro"} height={300} onChange={(value: string | undefined, event: any) => {
                    const newCSS = value || '';
                    setTheme({
                        ...theme,
                        customCSS: newCSS
                    });
                }} beforeMount={(monaco: Monaco) => {
                    monaco.editor.defineTheme('OneDarkPro', {
                        base: 'vs-dark',
                        inherit: true,
                        ...OneDarkPro
                    });
                }} language={'css'}></Editor>
            </Section>
        )
    }, [sect.css, theme.customCSS]);

    return (
        <Window title="Theme Maker" id="thememaker" taskbarIconID="thememaker" color={'gray'} seperateBorder="1px solid #ffffff0a">
            <div className="window-full thememaker-window">
                {started ? (<>
                    <Section open={sect.info} setOpen={
                        sectionSetter('info')
                    } title="Info">
                        <span>With thememaker, you're able to create your own Glacier theme and export it to use or share on our Discord.</span>
                        <span>Click to expand each category to customize your theme however you'd like - and choose a fitting wallpaper in the Settings app.</span>
                    </Section>
                    <Section open={sect.taskbar} setOpen={
                        sectionSetter('taskbar')
                    } title="Taskbar">
                        <MiniSection title="Background">
                            <ColPick id="tb-bg" onChange={(color) => setTheme({
                                ...theme,
                                taskbar: {
                                    ...theme.taskbar,
                                    background: color
                                }
                            })} color={theme.taskbar.background} open={tbbgOpen} close={() => setTbbgOpen(false)} />
                            <Button onClick={() => setTbbgOpen(!tbbgOpen)} style={{ backgroundColor: theme.taskbar.background, color: 'white', borderRadius: '4px', padding: '4px 8px' }}>Change background</Button>
                            <Checkbox label="Topbar" checked={theme.taskbar.topbar} onChange={(e, data) => setTheme({
                                ...theme,
                                taskbar: {
                                    ...theme.taskbar,
                                    topbar: data.checked == true ? true : false
                                }
                            })} />
                        </MiniSection>
                        <Checkbox label="Floating (macOS style)" checked={theme.taskbar.macOSstyle} onChange={(e, data) => setTheme({
                            ...theme,
                            taskbar: {
                                ...theme.taskbar,
                                macOSstyle: data.checked == true ? true : false
                            }
                        })} />
                        <MiniSection title="Border">
                            <BorderEditor border={theme.taskbar.border} onChange={(border) => setTheme({
                                ...theme,
                                taskbar: {
                                    ...theme.taskbar,
                                    border
                                }
                            })} />
                        </MiniSection>
                        <MiniSection title="Right-side stats">
                            <Checkbox label="Enable stat icons" checked={theme.taskbar.rightside} onChange={(e, data) => setTheme({
                                ...theme,
                                taskbar: {
                                    ...theme.taskbar,
                                    rightside: data.checked == true ? true : false
                                }
                            })} />
                        </MiniSection>
                        <MiniSection title="Icons">
                            <Checkbox label="Scale-hover (macOS style)" checked={theme.taskbar.icons.macOSstyle} onChange={(e, data) => setTheme({
                                ...theme,
                                taskbar: {
                                    ...theme.taskbar,
                                    icons: {
                                        ...theme.taskbar.icons,
                                        macOSstyle: data.checked == true ? true : false
                                    }
                                }
                            })} />
                            <div>
                                <Label htmlFor="tbi-size">Icon size</Label>
                                <Slider
                                    id="tbi-size"
                                    min={10}
                                    max={100}
                                    value={theme.taskbar.icons.size}
                                    onChange={(e, data) => setTheme({
                                        ...theme,
                                        taskbar: {
                                            ...theme.taskbar,
                                            icons: {
                                                ...theme.taskbar.icons,
                                                size: data.value
                                            }
                                        }
                                    })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="tbi-gap">Icon gap</Label>
                                <Slider
                                    id="tbi-gap"
                                    min={0}
                                    max={20}
                                    value={theme.taskbar.icons.gap}
                                    onChange={(e, data) => setTheme({
                                        ...theme,
                                        taskbar: {
                                            ...theme.taskbar,
                                            icons: {
                                                ...theme.taskbar.icons,
                                                gap: data.value
                                            }
                                        }
                                    })}
                                />
                            </div>
                        </MiniSection>
                    </Section>
                    {cssSection}
                    <Section open={sect.windows} setOpen={
                        sectionSetter('windows')
                    } title="Windows">
                        <MiniSection title="Border">
                            <BorderEditor border={theme.windows.border} onChange={(border) => setTheme({
                                ...theme,
                                windows: {
                                    ...theme.windows,
                                    border
                                }
                            })} />
                        </MiniSection>
                        <MiniSection title="Controls">
                            <Checkbox label="macOS style" checked={theme.windows.controls.macOSstyle} onChange={(e, data) => setTheme({
                                ...theme,
                                windows: {
                                    ...theme.windows,
                                    controls: {
                                        ...theme.windows.controls,
                                        macOSstyle: data.checked == true ? true : false
                                    }
                                }
                            })} />
                        </MiniSection>
                    </Section>
                    <Section open={sect.icons} setOpen={
                        sectionSetter('icons')
                    } title="Icons">
                        <span>Select a fallback ("base") icon set, and upload icons (.webp, &lt;10kb)</span>

                        <MiniSection title="Fallback icon set">
                            <Dropdown
                                onOptionSelect={(e, data) => {
                                    setTheme({
                                        ...theme,
                                        icons: {
                                            ...theme.icons,
                                            base: (data.optionValue || 'windows') as TaskbarIcons['base']
                                        }
                                    });
                                    setTaskbarWrapper(data.optionValue || 'windows');
                                }}
                                placeholder="Select an icon set..."
                                value={theme.icons.base}
                                defaultValue={theme.icons.base}
                                defaultSelectedOptions={[theme.icons.base]}
                                style={{ width: '100%' }}
                            >
                                {iconSets.map(iconSet => (
                                    <Option text={iconSet.name} key={iconSet.value} value={iconSet.value}><>
                                        <span style={{ width: '100px' }}>{iconSet.name}</span> <OSAndIcons iconSet={iconSet.value} />
                                    </></Option>
                                ))}
                            </Dropdown>
                        </MiniSection>
                        <MiniSection title="Custom icons">
                            <span>Click an icon to upload a custom one.</span>
                            <div className="tms-custom-icons">
                                {appIcons.map(icon => (
                                    <div key={icon} className="tms-custom-icon">
                                        <img src={gi(icon)} alt={`${icon} icon`} style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '0px'
                                        }} onClick={async () => {
                                            const dataURL = await getImageDataURL();
                                            if (!dataURL) return;
                                            setTheme({
                                                ...theme,
                                                icons: {
                                                    ...theme.icons,
                                                    [fi(icon)]: dataURL
                                                }
                                            });
                                            setTaskbarWrapper(theme.icons.base, {
                                                ...theme.icons,
                                                [fi(icon)]: dataURL
                                            });
                                        }} />
                                        {theme.icons[fi(icon)] && <div onClick={() => {
                                            const newIcons = { ...theme.icons };
                                            delete newIcons[fi(icon)];
                                            setTheme({
                                                ...theme,
                                                icons: newIcons
                                            });
                                            setTaskbarWrapper(theme.icons.base, newIcons);
                                        }} style={{ position: 'absolute', zIndex: 10, fontSize: '20px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.8 }}>
                                            <DismissCircle20Filled color={'red'} style={{
                                                filter: 'drop-shadow(0 0 2px black)',
                                                background: 'white',
                                                borderRadius: '50%',
                                            }} />
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </MiniSection>
                    </Section>
                    {/* <Section open={sect.preview} setOpen={
                        sectionSetter('preview')
                    } title="Preview">
                    </Section> */}
                    <Section open={sect.export} setOpen={
                        sectionSetter('export')
                    } title="Export / Import">
                        <span>Once you're done, you can export your theme to a .glost (GlacierOSTheme) file to share with others or use later.</span>
                        <Button onClick={() => {
                            exportTheme(theme);
                        }}>Export theme</Button>
                        <span>To import a theme, simply select a .glost file and it will be applied.</span>
                        <Button onClick={async () => {
                            const theme = await importTheme();
                            if (!theme) return;
                            setTheme(theme);
                            setTaskbarWrapper(theme.icons.base, theme.icons);
                        }}>Import theme</Button>
                        <span>Note: Importing a theme will override your current theme.</span>
                    </Section>
                </>) : (<>
                    <h1>ThemeMaker <span className="beta-badge">BETA</span></h1>
                    <span>Once started, your current theme will unload and you will need to reload to get your current theme back.</span>
                    <span>There is no autosaving - be sure to back up by exporting your theme.</span>
                    <Button onClick={() => setStarted(true)}>Start</Button>
                </>)}
            </div>
        </Window>
    )
}