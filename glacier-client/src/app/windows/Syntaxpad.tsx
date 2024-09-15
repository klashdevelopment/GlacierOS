"use client";
import { Editor, Monaco, useMonaco } from "@monaco-editor/react";
import Window from "../components/Window";
import { useEffect, useRef, useState } from "react";
import OneDarkPro from "../themes/oneDarkPro.json";
import { Button, Dropdown, Option, Persona, Select, Tooltip } from "@fluentui/react-components";
import { useSyntaxpad } from "./SyntaxpadContext";
import { PlayFilled, ArrowClockwiseFilled, CodeFilled, InfoFilled, QuestionFilled } from "@fluentui/react-icons";
import { toggleStoreApp } from "./store/StoreApps";
import { getWithName } from "../utils/AppListHelper";
import vm from 'vm';
import { marked } from "marked";
import DOMPurify from "dompurify";
import { formatJson } from "../utils/XOR";
import convertJSYaml from "js-yaml";

import Interpreter from 'js-interpreter';

const languages = [
    { name: "ABAP", value: "abap", runnable: false },
    { name: "Apex", value: "apex", runnable: false },
    { name: "Azure CLI", value: "azcli", runnable: false },
    { name: "Batch", value: "bat", runnable: false },
    { name: "Bicep", value: "bicep", runnable: false },
    { name: "Cameligo", value: "cameligo", runnable: false },
    { name: "Clojure", value: "clojure", runnable: false },
    { name: "CoffeeScript", value: "coffee", runnable: false },
    { name: "C++", value: "cpp", runnable: false },
    { name: "C#", value: "csharp", runnable: false },
    { name: "CSP", value: "csp", runnable: false },
    { name: "CSS", value: "css", runnable: true },
    { name: "Cypher", value: "cypher", runnable: false },
    { name: "Dart", value: "dart", runnable: false },
    { name: "Dockerfile", value: "dockerfile", runnable: false },
    { name: "ECL", value: "ecl", runnable: false },
    { name: "Elixir", value: "elixir", runnable: false },
    { name: "Flow9", value: "flow9", runnable: false },
    { name: "FreeMarker 2", value: "freemarker2", runnable: false },
    { name: "F#", value: "fsharp", runnable: false },
    { name: "Go", value: "go", runnable: false },
    { name: "GraphQL", value: "graphql", runnable: false },
    { name: "Handlebars", value: "handlebars", runnable: false },
    { name: "HCL", value: "hcl", runnable: false },
    { name: "HTML", value: "html", runnable: true },
    { name: "INI", value: "ini", runnable: false },
    { name: "Java", value: "java", runnable: false },
    { name: "JavaScript", value: "javascript", runnable: true },
    { name: "JSON", value: "json", runnable: true },
    { name: "Julia", value: "julia", runnable: false },
    { name: "Kotlin", value: "kotlin", runnable: false },
    { name: "LESS", value: "less", runnable: false },
    { name: "Lexon", value: "lexon", runnable: false },
    { name: "Liquid", value: "liquid", runnable: false },
    { name: "Lua", value: "lua", runnable: false },
    { name: "M3", value: "m3", runnable: false },
    { name: "Markdown", value: "markdown", runnable: true },
    { name: "MDX", value: "mdx", runnable: false },
    { name: "MIPS", value: "mips", runnable: false },
    { name: "MSDAX", value: "msdax", runnable: false },
    { name: "MySQL", value: "mysql", runnable: false },
    { name: "Objective-C", value: "objective-c", runnable: false },
    { name: "Pascal", value: "pascal", runnable: false },
    { name: "Pascaligo", value: "pascaligo", runnable: false },
    { name: "Perl", value: "perl", runnable: false },
    { name: "PgSQL", value: "pgsql", runnable: false },
    { name: "PHP", value: "php", runnable: false },
    { name: "PLA", value: "pla", runnable: false },
    { name: "PostiATS", value: "postiats", runnable: false },
    { name: "PowerQuery", value: "powerquery", runnable: false },
    { name: "PowerShell", value: "powershell", runnable: false },
    { name: "Protobuf", value: "protobuf", runnable: false },
    { name: "Pug", value: "pug", runnable: false },
    { name: "Python", value: "python", runnable: false },
    { name: "Q#", value: "qsharp", runnable: false },
    { name: "R", value: "r", runnable: false },
    { name: "Razor", value: "razor", runnable: false },
    { name: "Redis", value: "redis", runnable: false },
    { name: "Redshift", value: "redshift", runnable: false },
    { name: "reStructuredText", value: "restructuredtext", runnable: false },
    { name: "Ruby", value: "ruby", runnable: false },
    { name: "Rust", value: "rust", runnable: false },
    { name: "Small Basic", value: "sb", runnable: false },
    { name: "Scala", value: "scala", runnable: false },
    { name: "Scheme", value: "scheme", runnable: false },
    { name: "SCSS", value: "scss", runnable: false },
    { name: "Shell", value: "shell", runnable: false },
    { name: "Solidity", value: "solidity", runnable: false },
    { name: "Sophia", value: "sophia", runnable: false },
    { name: "SPARQL", value: "sparql", runnable: false },
    { name: "SQL", value: "sql", runnable: false },
    { name: "Structured Text", value: "st", runnable: false },
    { name: "Swift", value: "swift", runnable: false },
    { name: "SystemVerilog", value: "systemverilog", runnable: false },
    { name: "Tcl", value: "tcl", runnable: false },
    { name: "Test", value: "test", runnable: false },
    { name: "Twig", value: "twig", runnable: false },
    { name: "TypeScript", value: "typescript", runnable: false },
    { name: "TypeSpec", value: "typespec", runnable: false },
    { name: "VB", value: "vb", runnable: false },
    { name: "WGSL", value: "wgsl", runnable: false },
    { name: "XML", value: "xml", runnable: true },
    { name: "YAML", value: "yaml", runnable: true }
];

export default function Syntaxpad() {
    const { setValue, lang, setLang } = useSyntaxpad();

    const handleEditorDidMount = async (monaco: Monaco) => {
        monaco.editor.defineTheme('OneDarkPro', {
            base: 'vs-dark',
            inherit: true,
            ...OneDarkPro
        });
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            tsx: 'react'
        });
    };
    function handleEditorChange(value: string | undefined, event: any) {
        setValue(value);
    }

    return (
        <Window title="Syntaxpad" id="syntaxpad" defaultSize={{ width: 500, height: 380 }} taskbarIconID="syntaxpad" color={'onedarkbg'} seperateBorder="1px solid #ffffff0a">
            <div style={{ padding: '5px', gap: '5px', display: 'flex', justifyContent: 'center' }}>
                <Dropdown appearance="outline" className="fui-plain" defaultValue={"javascript"} placeholder="Select a language..." onOptionSelect={(ev, data) => {
                    setLang(data.optionValue as string);
                }}>
                    {languages.map((lang) => (
                        <Option value={lang.value} onClick={() => setLang(lang.value)} text={lang.value}>
                            <Persona avatar={{
                                image: {
                                    src: lang.runnable ? "/image/bootpad.png" : "/windows/syntaxpad.png",
                                    style: {
                                        borderRadius: '0px',
                                        background: 'transparent'
                                    }
                                },
                                shape: 'square'
                            }} name={lang.name} secondaryText={lang.value} />
                        </Option>
                    ))}
                </Dropdown>
                <Tooltip content={"Use Bootpad to run your code"} relationship="label">
                    <Button appearance="outline" icon={<CodeFilled />} onClick={() => {
                        toggleStoreApp("bootpad", getWithName("Bootpad"));
                    }}>Bootpad</Button>
                </Tooltip>
            </div>
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
            }} theme={"OneDarkPro"} onChange={handleEditorChange} beforeMount={handleEditorDidMount} language={lang}></Editor>
        </Window>
    )
}

export function Bootpad() {
    const { value, lang } = useSyntaxpad();
    const [frameDoc, setFrameDoc] = useState<string>("");
    const [monospace, setMonospace] = useState<boolean>(false);

    var initFunc = function (interpreter: any, globalObject: any) {
        function setFunc(name: string, func: any) {
            var wrapper = interpreter.createNativeFunction(func);
            interpreter.setProperty(globalObject, name, wrapper);
        }
        setFunc('println', function (text: any) {
            setFrameDoc((frameDoc as string) + text + "\n");
        });
        setFunc('print', function (text: any) {
            setFrameDoc((frameDoc as string) + text);
        });
        setFunc('log', function (text: any) {
            console.log(text);
        });
        setFunc('clear', function () {
            setFrameDoc("");
        });
        setFunc('alert', function (text: any) {
            alert("(Bootpad) " + text);
        });
        setFunc('prompt', function (text: string, def: string = "") {
            return prompt("(Bootpad) " + text, def);
        });
        setFunc('confirm', function (text: string) {
            return confirm("(Bootpad) " + text);
        })
        // 

    };



    async function updateFrameDoc() {
        if (lang == "html") {
            setFrameDoc(value as string);
            setMonospace(false);
        } else if (lang == "javascript") {
            setMonospace(true);
            setFrameDoc("");
            try {
                const interpreter = new Interpreter(value || "\"No input\";", initFunc);
                interpreter.run();

            } catch (e: any) {
                setFrameDoc(e.toString());
            }
        } else if (lang == "css") {
            setMonospace(false);
            setFrameDoc(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Basic HTML Example</title><style>${value}</style></head><body><header><h1>Welcome to My Webpage</h1><p>This is a basic example of HTML elements.</p></header><section><h2>About Me</h2><p>My name is John Doe. I am a web developer and designer.</p><img src="https://via.placeholder.com/150" alt="Placeholder Image"></section><section><h2>My Hobbies</h2><ul><li>Reading</li><li>Travelling</li><li>Coding</li></ul></section><section><h2>My Skills</h2><ol><li>HTML</li><li>CSS</li><li>JavaScript</li></ol></section><footer><h3>Contact Me</h3><p>Email: johndoe@example.com</p></footer></body></html>`);
        } else if (lang == "python") {
            setMonospace(true);
            setFrameDoc("[python] could not initialize python interpreter: Python not complete!");
        } else if (lang == "markdown") {
            setMonospace(false);
            const markdown = await marked(value as string);
            const md = DOMPurify.sanitize(markdown);
            setFrameDoc(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Basic HTML Example</title><style>
                body {
                    font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif;
                    background: #282c34;
                    color: white;
                    padding: 0px 20px;
                }
                </style></head><body>${md}</body></html>`);
        } else if (lang == "json") {
            setMonospace(true);
            try {
                const data = JSON.parse(value as string);
                setFrameDoc(formatJson(data));
            } catch (e: any) { setFrameDoc(e.toString()) }
        } else if (lang == "yaml") {
            setMonospace(true);
            const data = convertJSYaml.load(value as string) as string;
            setFrameDoc(formatJson(data));
        } else {
            setMonospace(true);
            setFrameDoc("Unsupported language (" + lang + ")\n\n" + value);
        }
    }
    function showInfo() {
        setMonospace(false);
        setFrameDoc(`
            <html><head><link href="/example.css" rel="stylesheet" /></head><body>
                <p>Glacier Bootpad is a tool to run your code in a safe environment.</p><br/>
                <b>Supported:</b> <p>HTML, JavaScript, CSS, <s>Python</s>, Markdown, JSON, YAML</p><br/>
                <b>Issues:</b> <p>Javascript is very WIP, and Python isn't 100% done. Use Quadpad for website development.</p>
            </body></html>
        `);
    }

    useEffect(showInfo, []);

    const [showTutorial, setShowTutorial] = useState<boolean>(false);

    return (
        <Window title="Bootpad" id="bootpad" defaultSize={{ width: 500, height: 380 }} taskbarIconID="bootpad" color={'onedarkbg'} seperateBorder="1px solid #ffffff0a">
            <div style={{ position: 'absolute', top: '82px', height: 'calc(100% - 82px)', backdropFilter: 'blur(20px)', width: '100%', display: showTutorial ? 'block' : 'none' }}>
                <div style={{ position: 'absolute', left: '30px', width: 'calc(100% - 60px)', top: '15px', height: 'calc(100% - 30px)', borderRadius: '6px', background: '#3f4452', color: 'white', display: 'flex', alignItems: 'center', flexDirection: 'column', overflowY: 'scroll' }}>
                    <h1>How to use Bootpad JS</h1>
                    <b>Issues:</b>
                    <ul>
                        <li>console doesn't exist, use println</li>
                    </ul>

                    <b>Useful functions:</b>
                    <ul>
                        <li>println - Output to the result box in Bootpad</li>
                        <li>print - Output to the result box in Bootpad without a newline</li>
                        <li>log - Output to the console</li>
                        <li>clear - Clear the result box</li>
                        <li>alert - Show an alert</li>
                        <li>prompt - Show a prompt</li>
                        <li>confirm - Show a confirm</li>
                    </ul>
                </div>
            </div>
            <div style={{ padding: '5px', gap: '5px', display: 'flex', justifyContent: 'center' }}>
                {/* <Button onClick={() => {
                    showInfo();
                }} appearance="outline" icon={<InfoFilled />}>Info</Button> */}
                <Button onClick={() => {
                    updateFrameDoc();
                }} appearance="outline" icon={<PlayFilled />}>Run</Button>
                <Button onClick={() => {
                    setFrameDoc("");
                }} appearance="outline" icon={<ArrowClockwiseFilled />}>Clear</Button>
                <Button onClick={() => {
                    setShowTutorial(!showTutorial);
                }} appearance="outline" icon={<QuestionFilled />}>Help</Button>
            </div>
            {!monospace && <iframe srcDoc={frameDoc} style={{ width: '100%', height: 'calc(100% - 42px)', border: 'none' }}></iframe>}
            {monospace && <div style={{ width: 'calc(100% - 10px)', height: 'calc(100% - 52px)', overflowY: 'auto', padding: '5px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', fontSize: '14px', color: '#ffffff' }}>
                {
                    frameDoc as string
                } </div>}
        </Window>
    )
}