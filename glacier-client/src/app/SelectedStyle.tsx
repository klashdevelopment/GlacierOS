"use client";

import { useEffect, useState } from "react";

export default function SelectedStyle() {
    const [selOS, setSelOS] = useState("windows");
    useEffect(()=>{
        const os = window.localStorage.getItem("os");
        const customtheme = window.localStorage.getItem("custom-theme");
        if(customtheme) {
            setSelOS("windows");
            return;
        }
        if (os) {
            setSelOS(os);
        }else {
            window.localStorage.setItem("os", "windows");
            setSelOS("windows");
        }
    },[]);

    return (
        <>
        {selOS !== "windows" && <link id="oscss" rel="stylesheet" href={`/${selOS}.css`} />}
        </>
    )
}