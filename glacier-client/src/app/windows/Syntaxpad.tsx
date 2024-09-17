"use client";
import { Editor, Monaco, useMonaco } from "@monaco-editor/react";
import Window from "../components/Window";
import { useEffect, useRef, useState } from "react";
import OneDarkPro from "../themes/oneDarkPro.json";
import { Button, Dropdown, Option, Persona, Select, Tooltip } from "@fluentui/react-components";
import { useSyntaxpad } from "./SyntaxpadContext";
import { PlayFilled, ArrowClockwiseFilled, ArrowDownloadFilled, CodeFilled, InfoFilled, QuestionFilled } from "@fluentui/react-icons";
import { toggleStoreApp } from "./store/StoreApps";
import { getWithName } from "../utils/AppListHelper";
import vm from 'vm';
import { marked } from "marked";
import DOMPurify from "dompurify";
import { formatJson } from "../utils/XOR";
import convertJSYaml from "js-yaml";

import Interpreter from 'js-interpreter';

const languages = [
    { name: "Text", value: "text", runnable: false, extension: "txt" },
    { name: "Glaciersh", value: "gsh", runnable: false, extension: "gsh" },
    { name: "ABAP", value: "abap", runnable: false, extension: "abap" },
    { name: "Apex", value: "apex", runnable: false, extension: "cls" },
    { name: "Azure CLI", value: "azcli", runnable: false, extension: "azcli" },
    { name: "Batch", value: "bat", runnable: false, extension: "bat" },
    { name: "Bicep", value: "bicep", runnable: false, extension: "bicep" },
    { name: "Cameligo", value: "cameligo", runnable: false, extension: "mligo" },
    { name: "Clojure", value: "clojure", runnable: false, extension: "clj" },
    { name: "CoffeeScript", value: "coffee", runnable: false, extension: "coffee" },
    { name: "C++", value: "cpp", runnable: false, extension: "cpp" },
    { name: "C#", value: "csharp", runnable: false, extension: "cs" },
    { name: "CSP", value: "csp", runnable: false, extension: "csp" },
    { name: "CSS", value: "css", runnable: true, extension: "css" },
    { name: "Cypher", value: "cypher", runnable: false, extension: "cyp" },
    { name: "Dart", value: "dart", runnable: false, extension: "dart" },
    { name: "Dockerfile", value: "dockerfile", runnable: false, extension: "dockerfile" },
    { name: "ECL", value: "ecl", runnable: false, extension: "ecl" },
    { name: "Elixir", value: "elixir", runnable: false, extension: "ex" },
    { name: "Flow9", value: "flow9", runnable: false, extension: "flow" },
    { name: "FreeMarker 2", value: "freemarker2", runnable: false, extension: "ftl" },
    { name: "F#", value: "fsharp", runnable: false, extension: "fs" },
    { name: "Go", value: "go", runnable: false, extension: "go" },
    { name: "GraphQL", value: "graphql", runnable: false, extension: "graphql" },
    { name: "Handlebars", value: "handlebars", runnable: false, extension: "hbs" },
    { name: "HCL", value: "hcl", runnable: false, extension: "hcl" },
    { name: "HTML", value: "html", runnable: true, extension: "html" },
    { name: "INI", value: "ini", runnable: false, extension: "ini" },
    { name: "Java", value: "java", runnable: false, extension: "java" },
    { name: "JavaScript", value: "javascript", runnable: true, extension: "js" },
    { name: "JSON", value: "json", runnable: true, extension: "json" },
    { name: "Julia", value: "julia", runnable: false, extension: "jl" },
    { name: "Kotlin", value: "kotlin", runnable: false, extension: "kt" },
    { name: "LESS", value: "less", runnable: false, extension: "less" },
    { name: "Lexon", value: "lexon", runnable: false, extension: "lex" },
    { name: "Liquid", value: "liquid", runnable: false, extension: "liquid" },
    { name: "Lua", value: "lua", runnable: false, extension: "lua" },
    { name: "M3", value: "m3", runnable: false, extension: "m3" },
    { name: "Markdown", value: "markdown", runnable: true, extension: "md" },
    { name: "MDX", value: "mdx", runnable: false, extension: "mdx" },
    { name: "MIPS", value: "mips", runnable: false, extension: "mips" },
    { name: "MSDAX", value: "msdax", runnable: false, extension: "dax" },
    { name: "MySQL", value: "mysql", runnable: false, extension: "sql" },
    { name: "Objective-C", value: "objective-c", runnable: false, extension: "m" },
    { name: "Pascal", value: "pascal", runnable: false, extension: "pas" },
    { name: "Pascaligo", value: "pascaligo", runnable: false, extension: "ligo" },
    { name: "Perl", value: "perl", runnable: false, extension: "pl" },
    { name: "PgSQL", value: "pgsql", runnable: false, extension: "pgsql" },
    { name: "PHP", value: "php", runnable: false, extension: "php" },
    { name: "PLA", value: "pla", runnable: false, extension: "pla" },
    { name: "PostiATS", value: "postiats", runnable: false, extension: "dats" },
    { name: "PowerQuery", value: "powerquery", runnable: false, extension: "pq" },
    { name: "PowerShell", value: "powershell", runnable: false, extension: "ps1" },
    { name: "Protobuf", value: "protobuf", runnable: false, extension: "proto" },
    { name: "Pug", value: "pug", runnable: false, extension: "pug" },
    { name: "Python", value: "python", runnable: false, extension: "py" },
    { name: "Q#", value: "qsharp", runnable: false, extension: "qs" },
    { name: "R", value: "r", runnable: false, extension: "r" },
    { name: "Razor", value: "razor", runnable: false, extension: "cshtml" },
    { name: "Redis", value: "redis", runnable: false, extension: "rdb" },
    { name: "Redshift", value: "redshift", runnable: false, extension: "rsql" },
    { name: "reStructuredText", value: "restructuredtext", runnable: false, extension: "rst" },
    { name: "Ruby", value: "ruby", runnable: false, extension: "rb" },
    { name: "Rust", value: "rust", runnable: false, extension: "rs" },
    { name: "Small Basic", value: "sb", runnable: false, extension: "sb" },
    { name: "Scala", value: "scala", runnable: false, extension: "scala" },
    { name: "Scheme", value: "scheme", runnable: false, extension: "scm" },
    { name: "SCSS", value: "scss", runnable: false, extension: "scss" },
    { name: "Shell", value: "shell", runnable: false, extension: "sh" },
    { name: "Solidity", value: "solidity", runnable: false, extension: "sol" },
    { name: "Sophia", value: "sophia", runnable: false, extension: "aes" },
    { name: "SPARQL", value: "sparql", runnable: false, extension: "rq" },
    { name: "SQL", value: "sql", runnable: false, extension: "sql" },
    { name: "Structured Text", value: "st", runnable: false, extension: "st" },
    { name: "Swift", value: "swift", runnable: false, extension: "swift" },
    { name: "SystemVerilog", value: "systemverilog", runnable: false, extension: "sv" },
    { name: "Tcl", value: "tcl", runnable: false, extension: "tcl" },
    { name: "Test", value: "test", runnable: false, extension: "test" },
    { name: "Twig", value: "twig", runnable: false, extension: "twig" },
    { name: "TypeScript", value: "typescript", runnable: false, extension: "ts" },
    { name: "TypeSpec", value: "typespec", runnable: false, extension: "tsp" },
    { name: "VB", value: "vb", runnable: false, extension: "vb" },
    { name: "WGSL", value: "wgsl", runnable: false, extension: "wgsl" },
    { name: "XML", value: "xml", runnable: true, extension: "xml" },
    { name: "YAML", value: "yaml", runnable: true, extension: "yaml" }
];

function getLangFromValue(value: string): {name: string, value: string, runnable: boolean, extension: string} {
    return languages.find((lang) => lang.value == value)||languages[0];
}

export default function Syntaxpad() {
    const { setValue, value, lang, setLang } = useSyntaxpad();

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
                <Tooltip content={"Download Text"} relationship="label">
                    <Button appearance="outline" icon={<ArrowDownloadFilled />} onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([value || ""], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = "syntaxpad."+getLangFromValue(lang||"text").extension;
                        document.body.appendChild(element);
                        element.click();
                        element.remove();
                        URL.revokeObjectURL(element.href);
                    }}>Save</Button>
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