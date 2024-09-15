import { Button, Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";
import "./cloud.css";
import { CSSProperties, useEffect, useState } from "react";
import { registerSWandset } from "../utils/doSWStuff";

declare const search: any;
declare const __uv$config: any;
declare const registerSW: any;

const urls = {
  "geforce": "https://play.geforcenow.com/",
  "luna": "https://luna.amazon.com",
  "xbox": "https://www.xbox.com/play",
  "home": "/builtin/cloudloading.html"
};
const friendlyNames = {
  "geforce": "GeForce Now",
  "luna": "Amazon Luna",
  "xbox": "Xbox Cloud",
  "home": "Homepage"
};

type CGModes = "home" | "geforce" | "luna" | "xbox";

export default function CloudGaming() {
  const [selectedMode, setSelectedMode] = useState<CGModes>("home");

  useEffect(() => {
    const frame = document.getElementById("cloudgame-iframe");
    const URL = urls[selectedMode];
    async function x() {
      registerSWandset((defined: boolean) => {
        if (!defined) {
          (frame as HTMLIFrameElement).src = URL;
        } else {
          (frame as HTMLIFrameElement).src = __uv$config.prefix + __uv$config.encodeUrl(URL);
        }
      });
    }
    x();
  }, [selectedMode]);
  function CloudGameSelectControl({ image, type }: { image: string, type: CGModes }) {
    return (
      <img src={image} alt="" style={{ border: `${selectedMode == type ? "2px solid #00ff00" : "none"}` }} onClick={() => { setSelectedMode(type) }} className="cloud-game-select" />
    )
  }
  return (
    <Window title="Glacier Cloud Gaming" id="cloudgame" taskbarIconID="cloudgame" color={'gray'} seperateBorder="1px solid #ffffff0a">
      <div className="cloud-game" style={{ display: `${selectedMode == "home" ? "flex" : "none"}` }}>
        <div className="cloud-game-header">
          <span className="cloud-game-title">Cloud Gaming</span>
          <span className="cloud-game-subtitle">Play tons of PC and console titles from within glacier.</span>
        </div>
        <div className="cloud-game-container">
          <div className="cg-game" onClick={() => setSelectedMode("geforce")}>
            <img src="/windows/nvidia.jpg" className="cg-image" />
            <span className="cg-title">GeForce Now</span>
          </div>
          <div className="cg-game" onClick={() => setSelectedMode("luna")}>
            <img src="/windows/luna.jpg" className="cg-image" />
            <span className="cg-title">Amazon Luna</span>
          </div>
          <div className="cg-game" onClick={() => setSelectedMode("xbox")}>
            <img src="/windows/xbox.jpg" className="cg-image" />
            <span className="cg-title">Xbox Cloud</span>
          </div>
        </div>
      </div>
      <div className="cloud-game-play" style={{ display: `${selectedMode == "home" ? "none" : "flex"}` }}>
        <div className="cloud-game-play-controls">
          <CloudGameSelectControl image="/windows/cloudgaming.png" type="home" />
          <div style={{ width: '1px', background: '#ffffff30', height: '60%', margin: '0px 8px' }}></div>
          <CloudGameSelectControl image="/windows/nvidia.jpg" type="geforce" />
          <CloudGameSelectControl image="/windows/luna.jpg" type="luna" />
          <CloudGameSelectControl image="/windows/xbox.jpg" type="xbox" />
          <div style={{ width: '1px', background: '#ffffff30', height: '60%', margin: '0px 8px' }}></div>
          <Input placeholder={`Currently ${friendlyNames[selectedMode]}`} appearance="underline" className="cloud-game-search" />
        </div>
        <iframe id="cloudgame-iframe" src="https://www.google.com/webhp?igu=1" className="cloudgame-iframe"></iframe>
      </div>
    </Window>
  );
}