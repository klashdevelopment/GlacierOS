// Page with simple login form asking for just an access code. If access code is correct, set localstorage "auth" to "true" and redirect to home page.
'use client';
import { useState } from "react";
import { FluentProvider, webDarkTheme, Button, Input } from "@fluentui/react-components";
import Head from "next/head";
import "./login.css";

export default function Login() {
    const [code, setCode] = useState("");
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (code === "glacier") {
            window.localStorage.setItem("auth", "true");
            window.location.href = "/";
        }
    }
    return (
        <FluentProvider theme={webDarkTheme}>
            <Head>
                <title>Glacier OS</title>
            </Head>
            <div className="login" style={{
                width: "100%",
                height: "calc(100vh - 16px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                background: "#222",
                color: "white",
                borderRadius: "8px"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "5px",
                    position: "relative",
                    flexDirection: "column"
                }}>
                    <img src="/windows/glacierwhite.png" style={{width: '185px'}} alt="" />
                    <b style={{position:'absolute',bottom: '30px',fontSize:'20px',color:'black',fontWeight:'800'}}>Glacier OS</b>
                    <b style={{position:'absolute',bottom: '12px',color:'black',fontWeight:'300',fontSize:'14px'}}>Stage: Private Beta</b>
                </div>
                <form onSubmit={handleSubmit} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <Input
                        placeholder="Access Code..."
                        value={code}
                        type="password"
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button type="submit">Login</Button>
                    <Button appearance="subtle"
                    onClick={()=>{
                        window.open("https://discord.com/invite/Smb9wMWadU");
                    }}
                    icon={<img src="data:image/png;base64,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"
                        style={{width:'20px',height:'20px',borderRadius:'50%'}} alt="" />}>
                        Join Discord</Button>
                    <Button appearance="subtle"
                    onClick={()=>{
                        alert("This will be available as soon as bug reporting gets built in (super soon)!");
                    }}>Login without Code</Button>
                </form>
            </div>
        </FluentProvider>
    );
}