"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import Window from "../components/Window";
import OneDarkPro from "../themes/oneDarkPro.json";
import { useEffect, useState } from "react";
import { QuadpadProvider, useQuadpad, QuadpadSettings } from "./QuadpadContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";
import { DocumentJavascriptFilled, DocumentCssFilled, DocumentFilled, SaveFilled, DocumentSaveFilled, DocumentSyncFilled } from "@fluentui/react-icons";
import { Button, Input, Tooltip } from "@fluentui/react-components";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
} from "@fluentui/react-components";

function HTML() {
    const { css, setCss, js, setJs, html, setHtml, settings } = useQuadpad();

    const handleEditorDidMount = (monaco: Monaco) => {
        emmetHTML(monaco, ['html', 'php']);
        monaco.editor.defineTheme('OneDarkPro', {
            base: 'vs-dark',
            inherit: true,
            ...OneDarkPro
        });
    };
    return (
        <div style={{ borderRight: `1px solid ${settings.color}`, borderBottom: `1px solid ${settings.color}`, width: '100%', height: '100%' }}>
            <Editor options={{
                fontSize: 14,
                fontLigatures: true,
                minimap: {
                    enabled: false
                },
                bracketPairColorization: {
                    enabled: true
                },
                formatOnPaste: true
            }} onChange={(value, ev) => { setHtml(value as string) }} value={html} language="html" theme="OneDarkPro" beforeMount={handleEditorDidMount} />
        </div>
    )
}
function CSS() {
    const { css, setCss, js, setJs, html, setHtml, settings } = useQuadpad();
    const handleEditorDidMount = (monaco: Monaco) => {
        emmetCSS(monaco, ['css', 'sass', 'scss', 'less']);
        monaco.editor.defineTheme('OneDarkPro', {
            base: 'vs-dark',
            inherit: true,
            ...OneDarkPro
        });
    };
    return (
        <div style={{ borderBottom: `1px solid ${settings.color}`, width: '100%', height: '100%' }}>
            <Editor options={{
                fontSize: 14,
                fontLigatures: true,
                minimap: {
                    enabled: false
                },
                bracketPairColorization: {
                    enabled: true
                },
                formatOnPaste: true
            }} onChange={(value, ev) => { setCss(value as string) }} value={css} language="css" theme="OneDarkPro" beforeMount={handleEditorDidMount} />
        </div>
    )
}
function JS() {
    const { css, setCss, js, setJs, html, setHtml, settings } = useQuadpad();
    const handleEditorDidMount = (monaco: Monaco) => {
        emmetJSX(monaco, ['javascript', 'typescript']);
        monaco.editor.defineTheme('OneDarkPro', {
            base: 'vs-dark',
            inherit: true,
            ...OneDarkPro
        });
    };
    return (
        <div style={{ borderRight: `1px solid ${settings.color}`, width: '100%', height: '100%' }}>
            <Editor options={{
                fontSize: 14,
                fontLigatures: true,
                minimap: {
                    enabled: false
                },
                bracketPairColorization: {
                    enabled: true
                },
                formatOnPaste: true
            }} onChange={(value, ev) => { setJs(value as string) }} value={js} language="javascript" theme="OneDarkPro" beforeMount={handleEditorDidMount} />
        </div>
    )
}
function Output() {
    const { css, setCss, js, setJs, html, setHtml, settings } = useQuadpad();
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <iframe srcDoc={`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Quadpad Export</title>
${settings.cssImports.map(imp => {
                return `<link rel="stylesheet" href="${imp}">`
            }).join('\n')}
<style>
    ${css}
</style>
</head>
<body>
${html}
<script type="text/javascript">
    ${js}
</script>
    ${settings.jsImports.map(imp => {
                return `<script src="${imp}" type="text/javascript"></script>`
            }).join('\n')}
</body>
</html>
                `} id="quadpad-content-window" style={{ width: '100%', height: '100%', border: 'none' }} />
        </div>
    )
}

const friendlyNames = {
    "html": "HTML",
    "js": "JavaScript",
    "css": "CSS",
    "none": "None"
}
type Settings = "none" | "html" | "js" | "css";

export default function Quadpad() {
    const [settingsOpen, setSettingsOpen] = useState<Settings>("none");
    const { settings, setQuadpadSettings, setCss, setJs, setHtml, css, js, html } = useQuadpad();

    function downloadQuadpadHTML() {
        const iframe = document.getElementById('quadpad-content-window') as HTMLIFrameElement;
        if (iframe && iframe.srcdoc) {
            const htmlContent = iframe.srcdoc;
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'quadpad-export.html';
            link.click();
            URL.revokeObjectURL(link.href);
        } else {
            alert('The iframe either does not exist or has no srcdoc content.');
        }
    }

    function downloadQPE() {
        // Create an object to hold all the data
        const data = {
            js: js,
            css: css,
            html: html,
            settings: settings
        };

        // Convert the object to a JSON string
        const jsonString = JSON.stringify(data, null, 2);

        // Create a Blob object representing the data
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'project.qpe';

        // Programmatically click the link to trigger the download
        link.click();

        // Cleanup the object URL after download
        URL.revokeObjectURL(link.href);
    }

    return (
        <Window title="Quadpad" id="quadpad" defaultSize={{ width: 750, height: 650 }} taskbarIconID="quadpad" color={'onedarkbg'} seperateBorder={`1px solid ${settings.color}`}>
            <div style={{ width: '100%', height: 'calc(100% - 80px)', position: 'absolute', top: '39px', left: '0px', backdropFilter: 'blur(10px)', zIndex: 99, display: `${settingsOpen != "none" ? 'flex' : "none"}`, justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ aspectRatio: 1, height: '80%', background: '#222222cc', borderRadius: '20px', filter: "drop-shadow(0px 0px 10px #000000)", textAlign: 'center' }}>
                    <Button onClick={() => { setSettingsOpen('none') }} style={{ position: 'absolute', top: '10px', right: '10px', minWidth: '30px' }}>X</Button>
                    <h1>{friendlyNames[settingsOpen]} Settings</h1>
                    {settingsOpen == "html" && <>
                        No HTML settings yet! Maybe snippets or something. Emmet is already enabled.
                        <br /><br />
                        <input type="color" defaultValue={settings.color} onChange={(e)=>{
                            setQuadpadSettings({...settings, color:e.target.value});
                        }} /> Seperator Color
                        <br />
                        <input type="number" style={{width:'30px'}} maxLength={30} minLength={0} defaultValue={settings.borderWidth} onChange={(e)=>{
                            setQuadpadSettings({...settings, borderWidth:(Math.max(Math.min(parseInt(e.target.value), 30), 0))});
                        }} /> Seperator Width
                    </>}
                    {settingsOpen == "js" && <>
                        {settings.jsImports.map((imp, i) => {
                            return <div key={i} style={{ gap: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Input type="text" placeholder={"http://website.com/example.js"} defaultValue={imp} onChange={(e, data) => {
                                    const newImports = [...settings.jsImports];
                                    newImports[i] = data.value;
                                    setQuadpadSettings({ ...settings, jsImports: newImports });
                                }} />
                                <Button onClick={() => {
                                    const newImports = [...settings.jsImports];
                                    newImports.splice(i, 1);
                                    setQuadpadSettings({ ...settings, jsImports: newImports });
                                }}>Remove</Button>
                            </div>
                        })}
                        <br />
                        <Button onClick={() => {
                            setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, ""] });
                        }}>New JS Import</Button>
                        <Accordion collapsible>
                            <AccordionItem value="1">
                                <AccordionHeader><span style={{ textAlign: 'center', width: '85%' }}>Common Examples</span></AccordionHeader>
                                <AccordionPanel>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/react.webp" />}>React</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/react.webp" />}>React DOM</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/vue.png" />}>Vue</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://cdn.jsdelivr.net/npm/angular/angular.min.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/angular.png" />}>Angular</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/jquery.png" />}>jQuery</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://raw.githack.com/adryd325/oneko.js/main/oneko.js"] });
                                    }} appearance="subtle" icon={<img style={{ width: '20px', height: '20px', borderRadius: '50%' }} src="/image/oneko.webp" />}>Oneko.js</Button>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </>}
                    {settingsOpen == "css" && <>
                        {settings.cssImports.map((imp, i) => {
                            return <div key={i} style={{ gap: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Input type="text" placeholder={"http://website.com/example.js"} defaultValue={imp} onChange={(e, data) => {
                                    const newImports = [...settings.cssImports];
                                    newImports[i] = data.value;
                                    setQuadpadSettings({ ...settings, cssImports: newImports });
                                }} />
                                <Button onClick={() => {
                                    const newImports = [...settings.cssImports];
                                    newImports.splice(i, 1);
                                    setQuadpadSettings({ ...settings, cssImports: newImports });
                                }}>Remove</Button>
                            </div>
                        })}
                        <br />
                        <Button onClick={() => {
                            setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, ""] });
                        }}>New CSS Import</Button>
                        <Accordion collapsible>
                            <AccordionItem value="1">
                                <AccordionHeader><span style={{ textAlign: 'center', width: '85%' }}>Common Examples</span></AccordionHeader>
                                <AccordionPanel>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"] });
                                    }} appearance="subtle">Pico</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, "https://rsms.me/inter/inter.css"] });
                                    }} appearance="subtle">Inter (Font)</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, "https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap"] });
                                    }} appearance="subtle">Roboto (Font)</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css"] });
                                    }} appearance="subtle">Bootstrap</Button>
                                    <Button onClick={() => {
                                        setQuadpadSettings({ ...settings, cssImports: [...settings.cssImports, "https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"] });
                                    }} appearance="subtle">Tailwind</Button>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </>}
                </div>
            </div>
            <PanelGroup direction="vertical" style={{ width: '100%', height: 'calc(100% - 40px)' }}>
                <Panel minSize={20} defaultSize={50}>
                    <PanelGroup direction="horizontal" style={{ width: '100%' }}>
                        <Panel minSize={20} defaultSize={50}>
                            <HTML />
                        </Panel>
                        <PanelResizeHandle style={{ background: settings.color, width: `${settings.borderWidth}px` }} />
                        <Panel minSize={20} defaultSize={50}>
                            <CSS />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle style={{ background: settings.color, height: `${settings.borderWidth}px` }} />
                <Panel minSize={20} defaultSize={50}>
                    <PanelGroup direction="horizontal" style={{ width: '100%' }}>
                        <Panel minSize={20} defaultSize={50}>
                            <JS />
                        </Panel>
                        <PanelResizeHandle style={{ background: settings.color, width: `${settings.borderWidth}px` }} />
                        <Panel minSize={20} defaultSize={50}>
                            <Output />
                        </Panel>
                    </PanelGroup>
                </Panel>
            </PanelGroup>
            <div style={{ width: '100%', height: '30px', borderTop: `1px solid ${settings.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <Button icon={<DocumentFilled />} onClick={() => { setSettingsOpen('html') }} />
                <Button icon={<DocumentJavascriptFilled />} onClick={() => { setSettingsOpen('js') }} />
                <Button icon={<DocumentCssFilled />} onClick={() => { setSettingsOpen('css') }} />
                <div style={{ width: '28px' }}></div>
                <input type="file" id="uploadQPE" accept=".qpe,.json" style={{ display: 'none' }} />

                <Tooltip content="Save as .qpe" relationship="label">
                    <Button onClick={() => { downloadQPE() }} icon={<SaveFilled/>}></Button>
                </Tooltip>
                <Tooltip content="Load .qpe" relationship="label">
                    <Button onClick={() => {
                        const upload = document.getElementById("uploadQPE") as HTMLInputElement;
                        upload.click();
                        upload.onchange = () => {
                            if (!upload.files) return;
                            const file = upload.files[0];
                            const reader = new FileReader();
                            reader.onload = () => {
                                const data = JSON.parse(reader.result as string);
                                if (!data || !data.css || !data.js || !data.html || !data.settings) return alert("Invalid QPE file.");
                                setCss(data.css);
                                setJs(data.js);
                                setHtml(data.html);
                                setQuadpadSettings(data.settings);
                            }
                            reader.readAsText(file);
                        }
                    }} icon={<DocumentSyncFilled />}></Button>
                </Tooltip>
                <div style={{ width: '24px' }}></div>
                <Tooltip content="Export as .html" relationship="label">
                    <Button onClick={() => { downloadQuadpadHTML() }} icon={<DocumentSaveFilled/>}></Button>
                </Tooltip>
            </div>
        </Window>
    )
}