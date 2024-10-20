"use client";
import { Editor, Monaco } from "@monaco-editor/react";
import Window from "../components/Window";
import OneDarkPro from "../themes/oneDarkPro.json";
import { useEffect, useRef, useState } from "react";
import { QuadpadProvider, useQuadpad, QuadpadSettings } from "./QuadpadContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import { DocumentJavascriptFilled, DocumentCssFilled, DocumentFilled, SaveFilled, DocumentSaveFilled, DocumentSyncFilled, BrainCircuitFilled, PresenceBlockedRegular, SendFilled, PersonFilled, DeleteFilled, SendCopyRegular, KeyRegular, EyeTrackingOffRegular, EyeTrackingRegular } from "@fluentui/react-icons";
import { Button, Checkbox, Input, Tooltip } from "@fluentui/react-components";
import {
    Accordion,
    AccordionHeader,
    AccordionItem,
    AccordionPanel,
} from "@fluentui/react-components";
import { TextField } from "@fluentui/react";
import { callChatGPT, Message } from "../components/ChatGPT";
import { marked } from "marked";

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
<title>${settings.title}</title>
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
interface ResolvedMessage { from: 'user' | 'assistant' | 'system', content: string, nonFormatted: string };
function AIBox() {
    const { css, setCss, js, setJs, html, setHtml, settings } = useQuadpad();
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [resolvedMessages, setResolvedMessages] = useState<ResolvedMessage[]>([]);
    const [whichAreRaw, setWhichAreRaw] = useState<boolean[]>([]);

    useEffect(() => {
        const resolveMessages = async () => {
            const resolved = await Promise.all(messages.map(async (message) => {
                // Use a regex to find code blocks in the message value
                const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

                const highlightedContent = message.value.replace(codeBlockRegex, (match, lang, code) => {
                    // Check if a language is provided, if not, use highlightAuto
                    const highlightedCode = lang
                        ? hljs.highlight(code, { language: lang }).value
                        : hljs.highlightAuto(code).value;

                    // Return the highlighted code wrapped in <pre> and <code> tags
                    return `<pre><code class="hljs ${lang || 'auto'}">${highlightedCode}</code></pre>`;
                });

                // Now process the rest of the message as Markdown
                const content = await marked(highlightedContent);

                return { from: message.from, content, nonFormatted: message.value };
            }));
            setResolvedMessages(resolved);
            // Set which are raw array, keep previous values if they exist
            setWhichAreRaw(resolved.map((_, i) => whichAreRaw[i] || false));
        };

        resolveMessages();
    }, [messages]);

    const [disableInput, setDisableInput] = useState(false);
    function removeMessage(index: number) {
        const newMessages = [...messages];
        newMessages.splice(index, 1);
        setMessages(newMessages);
    }

    function useAItoAddMessage(prompt: string) {
        if (disableInput || prompt == "") return;
        setDisableInput(true);
        callChatGPT(apiKey, messages, prompt, settings.shareCodeWithBrainbase ? `html:
\`\`\`html
${html}
\`\`\`
css:
\`\`\`css
${css}
\`\`\`
js:
\`\`\`js
${js}
\`\`\`
` : undefined).then((response) => {
            setMessages([...messages, { from: "user", value: prompt }, { from: 'assistant', value: response }]);
            setDisableInput(false);
        });
    }

    function updateBrainbaseMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (disableInput) {
            e.preventDefault();
            return;
        }
        setMessageInput(e.target.value);
    }
    function send(input: string) {
        if (disableInput || input.trim() === "") return;
        const newMessages = [...messages];
        newMessages.push({ from: 'user', value: input });
        setMessages(newMessages);
        if (ref.current)
            ref.current.value = '';
        setMessageInput("");
        useAItoAddMessage(input);
    }
    function updateBrainbaseKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (disableInput) return;
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!e.shiftKey) {
                send(e.currentTarget.value);
            } else {
                if (e.currentTarget.value.trim() === '') return;
                e.currentTarget.value += '\n';
                e.currentTarget.scrollTop = e.currentTarget.scrollHeight;
                setMessageInput(e.currentTarget.value);
            }
        }
    }

    const ref = useRef<HTMLTextAreaElement>(null);

    function MessageDiv({ message, index }: { message: ResolvedMessage, index: number }) {
        if (message.from === "system") return null;

        return (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center', padding: `${whichAreRaw[index] ? '5px 0px' : '5px'}`, borderTop: '1px solid #0004', borderBottom: '1px solid #0004', background: message.from === 'user' ? '#ffffff0a' : '#ffffff15' }}>
                <div style={{ width: '90%', padding: `${whichAreRaw[index] ? '0px' : '5px'}`, display: 'flex', flexDirection: 'column' }} dangerouslySetInnerHTML={!whichAreRaw[index] ? { __html: message.content } : undefined}>
                    {whichAreRaw[index] ? <>
                        <pre><code className="hljs plaintext">
                            {message.nonFormatted}
                        </code></pre>
                    </> : undefined}
                </div>
                <div style={{ width: '10%', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center', justifyContent: 'center' }}>
                    <Button appearance={"subtle"} onClick={() => {
                        // swap between user and assistant
                        const newMessages = [...messages];
                        newMessages[index].from = newMessages[index].from === 'user' ? 'assistant' : 'user';
                        setMessages(newMessages);
                    }} icon={message.from === 'user' ? <PersonFilled fontSize={"20px"} color={"#ffffff"} /> : <BrainCircuitFilled fontSize={"20px"} color={"#ffffff"} />} />
                    <Button appearance={"subtle"} onClick={() => {
                            const newWhichAreRaw = [...whichAreRaw];
                            newWhichAreRaw[index] = !newWhichAreRaw[index];
                            setWhichAreRaw(newWhichAreRaw);
                        }} icon={whichAreRaw[index] ? <EyeTrackingOffRegular/> : <EyeTrackingRegular />} />
                    <Button appearance={"primary"}
                        style={{
                            backgroundColor: '#f006',
                            color: 'white',
                        }} onClick={() => removeMessage(index)} icon={<DeleteFilled />} />
                </div>
            </div>
        )
    }

    const [apiKey, setApiKey] = useState("");

    // use effect to check if localstorage has GPT_KEY
    // useEffect(() => {
    //     const key = localStorage.getItem("GPT_KEY");
    //     if (key) {
    //         setApiKey(key);
    //     }
    // }, []);

    const [inputKey, setInputKey] = useState("");

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '20px' }}><BrainCircuitFilled /> <b>Brainbase</b> AI</div>
            {false ? <>
                <div style={{ display: 'flex', flexDirection: 'column', margin: '10px 0', gap: '4px' }}>
                    Input your Hugging Face key here to use Brainbase.
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <Input placeholder="API Key" onChange={(e, d) => {
                        setInputKey(d.value);
                    }} />
                    <Button onClick={() => {
                        localStorage.setItem("GPT_KEY", inputKey);
                        setApiKey(inputKey);
                    }} icon={<SendCopyRegular />}></Button>
                </div>
            </> : <>
                <div style={{ height: '75%', width: '95%', border: '2px solid #ffffff25', borderRadius: '6px', marginTop: '16px', display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
                    {/* test message div */}
                    {resolvedMessages.map((message, i) => {
                        return <MessageDiv key={i} message={message} index={i} />
                    })}
                </div>
                <div style={{ height: '10%', width: '95%', border: '2px solid #ffffff25', borderRadius: '6px', marginTop: '10px', display: 'flex' }}>
                    <div style={{ height: 'calc(100% - 12px)', width: 'calc(80% - 12px)', padding: '6px' }}>
                        <textarea
                            disabled={disableInput}
                            ref={ref} autoCorrect={"off"} onKeyDown={updateBrainbaseKeydown} onChange={updateBrainbaseMessage} placeholder="Message" style={{ width: '100%', height: '100%', padding: '0', background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Segoe UI, Arial', resize: 'none' }} />
                    </div>
                    <div style={{ height: '100%', width: '20%', display: 'flex', borderLeft: '2px solid #ffffff25', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => {
                        send(ref.current?.value || '');
                    }}>
                        <SendFilled fontSize={"24px"} />
                    </div>
                    {/* <div style={{ height: '100%', width: '10%', display: 'flex', borderLeft: '2px solid #ffffff25', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={()=>{
                        setApiKey("");
                        localStorage.removeItem("GPT_KEY");
                    }}>
                        <KeyRegular fontSize={"24px"} />
                    </div> */}
                </div>
            </>}
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

    const [showAI, setShowAI] = useState(false);

    return (
        <Window title="Quadpad" id="quadpad" defaultSize={{ width: 750, height: 650 }} taskbarIconID="quadpad" color={'onedarkbg'} seperateBorder={`1px solid ${settings.color}`}>
            <div style={{ width: '100%', height: 'calc(100% - 80px)', position: 'absolute', top: '39px', left: '0px', backdropFilter: 'blur(10px)', zIndex: 99, display: `${settingsOpen != "none" ? 'flex' : "none"}`, justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ aspectRatio: 1, height: '80%', background: '#222222cc', borderRadius: '20px', filter: "drop-shadow(0px 0px 10px #000000)", textAlign: 'center' }}>
                    <Button onClick={() => { setSettingsOpen('none') }} style={{ position: 'absolute', top: '10px', right: '10px', minWidth: '30px' }}>X</Button>
                    <h1>{friendlyNames[settingsOpen]} Settings</h1>
                    {settingsOpen == "html" && <>
                        <Input type="text" placeholder="Quadpad Export" value={settings.title} onChange={(e, data) => {
                            setQuadpadSettings({ ...settings, title: data.value });
                        }} /> Title
                        <br />
                        <Checkbox checked={settings.shareCodeWithBrainbase} onChange={(e, data) => {
                            setQuadpadSettings({ ...settings, shareCodeWithBrainbase: data.checked === 'mixed' ? true : data.checked });
                        }} /> Share code with Brainbase
                        <br /><br />
                        <input type="color" defaultValue={settings.color} onChange={(e) => {
                            setQuadpadSettings({ ...settings, color: e.target.value });
                        }} /> Seperator Color
                        <br />
                        <input type="number" style={{ width: '30px' }} maxLength={30} minLength={0} defaultValue={settings.borderWidth} onChange={(e) => {
                            setQuadpadSettings({ ...settings, borderWidth: (Math.max(Math.min(parseInt(e.target.value), 30), 0)) });
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
                                        setQuadpadSettings({ ...settings, jsImports: [...settings.jsImports, "https://raw.githack.com/klashdevelopment/glacier-data-repo/refs/heads/main/oneko.js"] });
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
            <PanelGroup direction="horizontal" style={{ width: '100%', height: 'calc(100% - 40px)' }}>
                <Panel minSize={20} defaultSize={50}>
                    <PanelGroup direction="vertical" style={{ width: '100%' }}>
                        <Panel minSize={20} defaultSize={50}>
                            <HTML />
                        </Panel>
                        <PanelResizeHandle style={{ background: settings.color, height: `${settings.borderWidth}px` }} />
                        <Panel minSize={20} defaultSize={50}>
                            <JS />
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle style={{ background: settings.color, width: `${settings.borderWidth}px` }} />
                <Panel minSize={20} defaultSize={50}>
                    <PanelGroup direction="vertical" style={{ width: '100%' }}>
                        <Panel minSize={20} defaultSize={50}>
                            <CSS />
                        </Panel>
                        <PanelResizeHandle style={{ background: settings.color, height: `${settings.borderWidth}px` }} />
                        <Panel minSize={20} defaultSize={50}>
                            <Output />
                        </Panel>
                    </PanelGroup>
                </Panel>
                {showAI && <>
                    <PanelResizeHandle style={{ background: settings.color, width: `${settings.borderWidth}px` }} />
                    <Panel minSize={35} defaultSize={35} maxSize={35}>
                        <AIBox />
                    </Panel>
                </>}
            </PanelGroup>
            <div style={{ width: '100%', height: '40px', borderTop: `1px solid ${settings.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                <Button icon={<DocumentFilled color={"#B0E0E6"} />} onClick={() => { setSettingsOpen('html') }} />
                <Button icon={<DocumentJavascriptFilled color={"#B0E0E6"} />} onClick={() => { setSettingsOpen('js') }} />
                <Button icon={<DocumentCssFilled color={"#B0E0E6"} />} onClick={() => { setSettingsOpen('css') }} />
                <div style={{ width: '28px' }}></div>
                <input type="file" id="uploadQPE" accept=".qpe,.json" style={{ display: 'none' }} />

                <Tooltip content="Save as .qpe" relationship="label">
                    <Button onClick={() => { downloadQPE() }} icon={<SaveFilled color={"#FFDAB9"} />}></Button>
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
                    }} icon={<DocumentSyncFilled color={"#FFDAB9"} />}></Button>
                </Tooltip>
                <div style={{ width: '24px' }}></div>
                <Tooltip content="Export as .html" relationship="label">
                    <Button onClick={() => { downloadQuadpadHTML() }} icon={<DocumentSaveFilled color={"#98FB98"} />}></Button>
                </Tooltip>
                <div style={{ width: '24px' }}></div>
                <Tooltip content={`${showAI ? "Hide" : "Show"} AI`} relationship="label">
                    <Button onClick={() => { setShowAI(!showAI) }} icon={<><BrainCircuitFilled color={"#FFE4e1"} />{showAI && <PresenceBlockedRegular color={"red"} style={{ position: 'absolute' }} />}</>}>
                    </Button>
                </Tooltip>
            </div>
        </Window>
    )
}