"use client";
import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";
import React from "react";

function Text({ color, children }: { color: string; children: React.ReactNode }) {
    return <span style={{ color }}>{children}</span>;
}

function format(input: string) {
    const regex = /<([^>]+)>([^<]*)/g;
    const elements = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        const color = match[1];
        const text = match[2];
        elements.push(
            <Text key={elements.length} color={color}>
                {text}
            </Text>
        );
    }

    return elements;
}

function formatArray(input: string[]) {
    return input.map((line, index) => format(line));
}

function complete(input: string, setLines: React.Dispatch<React.SetStateAction<React.ReactNode[]>>) {
    // switch (input) {
    //     case "help":
    //         return ["<#00ff00>glacier-client<#ffffff> $ " + input, 
    //             "help - Display this help message",
    //             "echo - Echo the input"];
    //     case "echo":
    //         return ["<#00ff00>glacier-client<#ffffff> $ " + input, input.concat(input.slice(5))];
    //     default:
    //         return ["<#00ff00>glacier-client<#ffffff> $ " + input, "Command not found: " + input];
    // }
    setLines((lines) => [...lines, format("<#00ff00>glacier-client<#ffffff> $ " + input)]);
    switch (input) {
        case "help":
            setLines((lines) => [...lines, formatArray([
                "help - Display this help message",
                "echo - Echo the input"
            ])]);
            break;
        case "echo":
            setLines((lines) => [...lines, formatArray([
                input.concat(input.slice(5))
            ])]);
            break;
        default:
            setLines((lines) => [...lines, formatArray([
                "Command not found: " + input
            ])]);
    }
}

export default function TerminalApp() {
    const [lines, setLines] = React.useState<React.ReactNode[]>([]);

    return (
        <Window title="Terminal" id="terminal" taskbarIconID="terminal" color={'black'} seperateBorder="1px solid #ffffff0a">
            <div style={{display:'flex',flexDirection:'column',fontFamily:'"JetBrains Mono"',padding:'5px 10px'}}>
                {lines.map((line, index) => (
                    <div style={{display:'flex',flexDirection:'row',gap:'2px'}} key={index}>{line}</div>
                ))}
                <div style={{display:'flex',flexDirection:'row',gap:'2px'}} onKeyDown={(e)=>{if(e.key == "Enter"){complete((e.target as HTMLInputElement).value, setLines);(e.target as HTMLInputElement).value=""}}}>{format("<#00ff00>glacier-client<#ffffff> $ <#00ff00>")} <input style={{background:'transparent',border:'none',outline:'none',fontFamily:'"JetBrains Mono"'}} /> <button onClick={()=>{setLines([])}}>clear</button></div>
            </div>
        </Window>
    );
}