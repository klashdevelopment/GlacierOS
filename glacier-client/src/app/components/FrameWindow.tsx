'use client';
import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "./Window";
import xor from "../utils/XOR";
import useWindowDimensions from "../utils/WindowSizes";
import { useEffect } from "react";
import { useStoreApps } from "../windows/store/StoreAppsContext";
import { nameToID } from "../windows/store/StoreApps";
import { useUV } from "../utils/IsUV";

export default function FrameWindow({
  title,
  url,
  id,
  taskbarIconID = "none",
  color = "glass",
  seperateBorder = "none",
  className = "",
  cssInject = "",
  defaultClosed = true,
  defaultPosition = { x: 40, y: 40 },
  defaultUseUV = true
}: Readonly<{
  title: string;
  url: string;
  id: string;
  cssInject?: string;
  taskbarIconID?: string;
  color?: string;
  seperateBorder?: string;
  className?: string;
  defaultClosed?: boolean;
  defaultPosition?: { x: number, y: number };
  defaultUseUV?: boolean;
}>) {
  const SAC = useStoreApps();
  const isUV = useUV();
  function toggleOff() {
    let window = document.getElementsByClassName(id)[0];
    if (window) {
      var frame = (document.querySelector(`.${id} > .w11-content > div > iframe`) as HTMLIFrameElement);
      frame.src = '';
    }

    setTimeout(() => {
      SAC.openApps.filter((app) => nameToID(app.name) === id).forEach((app) => {
        SAC.removeApp(app);
      });
    }, 500);
  }
  return (
    <Window title={title} id={id} defaultPosition={defaultPosition} taskbarIconID={id} color={color} seperateBorder={seperateBorder} onClose={toggleOff} defaultClosed={defaultClosed} className={className}>
      <div className="window-full">
        <iframe id={id} data-cssinject={cssInject} data-src={(defaultUseUV && isUV) ? xor.quickURL(url) : url} style={{ border: '0px', position: 'absolute', width: '100%', height: 'calc(100% - 40px)' }}></iframe>
      </div>
    </Window>
  );
}