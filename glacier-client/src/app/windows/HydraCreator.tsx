import { Editor, Monaco } from "@monaco-editor/react";
import Window from "../components/Window";
import { HydraContextType, useHydra } from "./HydraContext";
import OneDarkPro from "../themes/oneDarkPro.json";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "./hydra.css";
import { useEffect, useState } from "react";
import { Button } from "@fluentui/react-components";

function EditorPane() {
    const hydra = useHydra();
    const handleEditorDidMount = async (monaco: Monaco) => {
        monaco.editor.defineTheme('OneDarkPro', {
            base: 'vs-dark',
            inherit: true,
            ...OneDarkPro
        });
        fetch('https://raw.githack.com/klashdevelopment/Hydra/main/hydra.d.ts')
            .then(res => res.text())
            .then(text => {
                monaco.languages.typescript.javascriptDefaults.addExtraLib(text, 'file:///node_modules/@types/hydra/index.d.ts');
            });
    };
    function handleEditorChange(value: string | undefined, event: any) {
        hydra.setValue(value);
    }
    return (<>
        <Editor
            options={{
                fontSize: 14,
                fontLigatures: true,
                minimap: {
                    enabled: false
                },
                bracketPairColorization: {
                    enabled: true
                },
                formatOnPaste: true
            }}
            theme={"OneDarkPro"}
            onChange={handleEditorChange}
            beforeMount={handleEditorDidMount}
            language={'javascript'}
            value={hydra.value}
        />
    </>);
}

function PreviewPane({ hydra }: { hydra: HydraContextType }) {
    return (<iframe
        style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#282c34',
        }} srcDoc={`
    <!DOCTYPE html>
    ${hydra.html.replace('%GAME', hydra.value || '')}
    `}></iframe>);
}
function ExtraPanel({ hydra }: { hydra: HydraContextType }) {
    const [examples, setExamples] = useState<string[]>([]);

    function frameURL() {
        if (hydra.activeWindow === 'fr_docs') {
            return 'https://pages.klash.dev/Hydra';
        } else if (hydra.activeWindow === 'fr_hydraw') {
            return 'https://pages.klash.dev/Hydra/hydraw';
        } else {
            return '';
        }
    }

    useEffect(() => {
        fetch('https://raw.githack.com/klashdevelopment/Hydra/main/examples/examples-main.js')
            .then(res => res.text())
            .then(text => {
                const line = text.split('\n').find(l => l.startsWith('var _exm_games'));
                if (line) {
                    const arrStr = line.split(' = ')[1].replace(/;$/, '');
                    try {
                        const arr = JSON.parse(arrStr);
                        setExamples(arr.filter((e: string) => !(e[2] === e[2].toUpperCase())));
                    } catch (e) {
                        try {
                            const arr = eval(arrStr);
                            setExamples(Array.isArray(arr) ? arr.filter((e: string) => !(e[2] === e[2].toUpperCase())) : []);
                        } catch {
                            setExamples([]);
                        }
                    }
                }
            });
    }, []);

    return (<>
        {hydra.activeWindow.startsWith('fr') && <iframe style={{
            width: '133.333%',
            height: '133.333%',
            border: 'none',
            background: '#282c34',
            scale: '0.75',
            transformOrigin: 'top left',
        }} src={frameURL()}></iframe>}
        {hydra.activeWindow === 'html' && (
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
            }} theme={"OneDarkPro"} language={'html'} value={hydra.html} onChange={(value, ev) => {
                hydra.setHtml(value || '');
            }} />
        )}
        {hydra.activeWindow === 'examples' && <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            boxSizing: 'border-box',
            flexDirection: 'column',
            padding: '10px',
            overflowY: 'auto',
            color: '#fff',
            fontSize: '12px'
        }}>
            <span>Select an example to override your current code with the example code.</span>
            {examples.map((example, index) => (
                <div key={index} style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    margin: '2px 0'
                }}>
                    <Button onClick={() => {
                        fetch(`https://raw.githack.com/klashdevelopment/Hydra/main/examples/${example}.js`)
                            .then(res => res.text())
                            .then(text => {
                                hydra.setValue(text);
                            });
                    }}>Load</Button>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '5px'
                    }}>{example}</span>
                </div>
            ))}
        </div>}
    </>);
}

export function HydraCreator() {
    const hydra = useHydra();

    return (
        <Window title="Hydra Creator" id="hydracreator" defaultSize={{
            width: 1000,
            height: 600
        }} taskbarIconID="hydracreator" color={'onedarkbg'} seperateBorder="1px solid #ffffff50">
            <div className="window-full">
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={20}>
                        <PanelGroup direction="vertical" style={{ height: 'calc(100% - 20px)' }}>
                            <Panel defaultSize={70} minSize={30}>
                                <EditorPane />
                            </Panel>
                            {hydra.activeWindow !== 'hidden' && <>
                                <PanelResizeHandle style={{ height: '1px', background: '#ffffff50' }} />
                                <Panel defaultSize={30} minSize={10}>
                                    <ExtraPanel hydra={hydra} />
                                </Panel>
                            </>}
                        </PanelGroup>
                        <Panel style={{
                            height: '20px', minHeight: '20px', maxHeight: '20px', background: '#ffffff10',
                            display: 'flex', alignItems: 'center'
                        }}>
                            <span className={`hydra-tab ${hydra.activeWindow === 'hidden' && 'active'}`} onClick={() => { hydra.setActiveWindow('hidden') }}>None</span>
                            <span className={`hydra-tab ${hydra.activeWindow === 'examples' && 'active'}`} onClick={() => { hydra.setActiveWindow('examples') }}>examples</span>
                            <span className={`hydra-tab ${hydra.activeWindow === 'fr_docs' && 'active'}`} onClick={() => { hydra.setActiveWindow('fr_docs') }}>Docs</span>
                            <span className={`hydra-tab ${hydra.activeWindow === 'fr_hydraw' && 'active'}`} onClick={() => { hydra.setActiveWindow('fr_hydraw') }}>Hydraw</span>
                            <span className={`hydra-tab ${hydra.activeWindow === 'html' && 'active'}`} onClick={() => { hydra.setActiveWindow('html') }}>HTML</span>
                        </Panel>
                    </Panel>
                    <PanelResizeHandle style={{ width: '1px', background: '#ffffff40' }} />
                    <Panel defaultSize={50} minSize={20}>
                        <PreviewPane hydra={hydra} />
                    </Panel>
                </PanelGroup>
            </div>
        </Window>
    );
}