"use client";
import { marked } from "marked";
import Image from "next/image";
import { useEffect, useState } from "react";
import Window from "../components/Window";
import "./terminal.css";
import { getAllNames, getApps, getWithName } from "../utils/AppListHelper";
import { nameToID, toggleStoreApp } from "./store/StoreApps";
import { ArrowUploadRegular } from "@fluentui/react-icons";
import {Button} from "@fluentui/react-components";

declare const window: any;

export default function TerminalApp() {
    const [lines, updLines] = useState<string[]>(["Glacier Terminal v1.0.0"]);
    function setLines(newLines: string[]) {
        const markedLines = newLines.map(line => {
            return line.startsWith('!M!') ? line.replace('!M!', '') : marked(line);
        });
        updLines(markedLines as string[]);
    }
    function loadGSH() {
        const fileInput = document.getElementById('upload_terminal_script') as any;
        fileInput.click();
        fileInput.onchange = ()=>{
            if (!fileInput.files.length) {
                alert('Please select a .gsh file to upload.');
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(event: any) {
                try {
                    const filelines = event.target.result.split('\n');
                    const commands = filelines.map((line: string) => line.trim()).filter((line: string) => line.length > 0&&line[0]!=='#');
                    let _ = [...lines];
                    commands.forEach((command: string, index: number) => {
                        setTimeout(() => {
                          _ = runCommand(command, _, true);
                          if (index === commands.length - 1) {
                            setLines(_);
                          }
                        }, index * 30);
                    });
                } catch (error) {
                    console.error('Error reading the script:', error);
                    alert('Failed to load file. Please ensure it is a valid gsh script.');
                }
            };
            reader.readAsText(file);
        };
    }    
    function runCommand(value: string, defLines: string[], fromScript: boolean = false) {
        // Create a new array from the current lines
        let newLines = !fromScript ? [...defLines, `<span style="color:#26a269;">user@glacier-server</span><span style="color:#fff;">:</span><span style="color:#00f;">~</span><span style="color:#fff;">$</span><span style="width:4px;"></span> ${value}`] : [...defLines];

        const args = value.split(" ");
        switch (args[0]) {
            case "help":
                newLines = [
                    ...newLines,
                    "[ list of commands ]",
                    "{ help, clear, get-app-data, list-apps, debug-app, open-settings, echo }",
                    "{ fetch-get, @readback, gsh, tsapp-attempt }",
                    "--------------------------------",
                    "[ echo variables ]",
                    "{ %rnd-app-name%, %rnd-int% }"
                ];
                break;
            case "gsh":
                loadGSH();
                break;
            case "echo":
                if(args.slice(1).length === 0) {
                    newLines = [...newLines, "⠀"];
                    break;
                }
                newLines = [...newLines, args.slice(1).join(" ")
                    .replaceAll("%rnd-app-name%", getAllNames()[Math.floor(Math.random() * getAllNames().length)])
                    .replaceAll("%rnd-int%", Math.floor(Math.random() * 100).toString())
                ];
                break;
            case "tsapp-attempt":
                // format: tsa-attempt <id>:<url>
                // if args dont contain this format, aka no before/after colon, then error
                if (args.length < 2 || !args[1].includes("+")) {
                    newLines = [...newLines, "Invalid argument to tsapp-attempt - Use id+url"];
                    break;
                }
                const tsaa_id = args[1].split("+")[0];
                const tsaa_url = args[1].split("+")[1];
                newLines = [...newLines, `Attempting to togglestoreapp with id ${tsaa_id} and url ${tsaa_url}...`];
                toggleStoreApp(tsaa_id, {
                    url: tsaa_url,
                    name: "TSApp Attempt"
                });
                break;
            case "fetch-get":
                const url = args.slice(1).join(" ");
                newLines = [...newLines, `Fetching (GET, plaintext) from ${url}...`];
                fetch(url)
                    .then(res => res.text())
                    .then(text => {
                        newLines = [...newLines, text];
                    })
                    .catch(err => {
                        newLines = [...newLines, `Error fetching data: ${err}`];
                    });
                break;
            case "clear":
                newLines = ["Glacier Terminal v1.0.0"];
                break;
            case "list-apps":
                const apps = getAllNames();
                newLines = [
                    ...newLines,
                    "[ list of apps ]",
                    apps.join(", ")
                ];
                break;
            case "get-app-data":
                const valueWithoutCommand = value.replace("get-app-data", "").trim().replace("%rnd-app-name%", getAllNames()[Math.floor(Math.random() * getAllNames().length)]);
                const appData = getWithName(valueWithoutCommand);
                if (!appData) {
                    newLines = [...newLines, `App not found: ${valueWithoutCommand}`];
                    break;
                }
                newLines = [
                    ...newLines,
                    "!M! " + JSON.stringify(appData, null, 2),
                ];
                break;
            case "debug-app":
                const val = value.replace("debug-app", "").trim().replace("%rnd-app-name%", getAllNames()[Math.floor(Math.random() * getAllNames().length)]);
                const dat = getWithName(val);
                if (!dat) {
                    newLines = [...newLines, `App not found: ${val}`];
                    break;
                }
                newLines = [
                    ...newLines,
                    "!M! Opening app debug window for " + val,
                ];
                toggleStoreApp(nameToID(val), dat);
                break;
            case "open-settings":
                newLines = [...newLines, "Opening settings app..."];
                toggleStoreApp("settings", {
                    url: "glacier://settings",
                    name: "Settings"
                });
                break;
            default:
                newLines = [...newLines, `Command not found: ${args[0]}`];
                break;
        }

        // Update the state once with the new lines
        setLines(newLines);
        return newLines;
    }
    useEffect(() => {
        window.evalCommand = runCommand;
    }, []);
    return (
        <Window title="Terminal" id="terminal" taskbarIconID="terminal" color={'black'} seperateBorder="1px solid #ffffff0a">
            <div className="terminal">
                <div className="terminal-lines">
                    {lines.map((line, index) => (
                        <div key={index} className="terminal-line">
                            <span dangerouslySetInnerHTML={{ __html: line }} />
                        </div>
                    ))}
                </div>
                <div className="terminal-input">
                    <span dangerouslySetInnerHTML={{ __html: `<span style="color:#26a269;">user@glacier-server</span><span style="color:#fff;">:</span><span style="color:#00f;">~</span><span style="color:#fff;">$</span><span style="width:4px;"></span>` }}></span>
                    <input
                        type="text"
                        id="input"
                        autoCorrect={"off"}
                        autoCapitalize={"off"}
                        autoComplete={"off"}
                        onKeyDown={async (event) => {
                            const input = document.getElementById("input") as HTMLInputElement;
                            if (event.key === "Enter") {
                                runCommand(input.value, lines);
                                input.value = "";
                            }
                        }}
                    />
                    <input type="file" id="upload_terminal_script" accept=".gsh" style={{display:'none'}} />
                    <Button icon={<ArrowUploadRegular />} onClick={loadGSH}></Button>
                </div>
            </div>
        </Window>
    );
}