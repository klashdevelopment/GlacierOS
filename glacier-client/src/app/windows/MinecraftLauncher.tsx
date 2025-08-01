import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent, } from "@fluentui/react-components";
import Window from "../components/Window";
import './launcher.css';
import { toggleStoreApp, nameToID } from "./store/StoreApps";
import {
  useId,
  Link,
  Button,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  ToastFooter,
} from "@fluentui/react-components";
import { MouseEventHandler, useState } from "react";

const get = (name: string) => {
  return {
    "name": "Minecraft ("+name+")",
    "unblock":true,
    "image": "",
    "description": "",
    "url": "https://pages.gavingogaming.com/mediaology-game-repo/eagle/"+name,
    "category": "Minecraft"
  };
}

const cloudGaming = {
  "name": "Cloud Gaming",
  "unblock":true,
  "image": "/windows/cloudgaming.png",
  "description": "i spit FLAMES",
  "url": "glacier://cloudgame",
  "category": "Game Streaming,Apps"
};

type LauncherTab = "play" | "installs" | "realms" | "skins" | "patchnotes";
type SelectedGame = "java" | "bedrock" | "account" | "dungeons" | "legends";

function JavaPage() {
  const [selectedGame, setSelectedGame] = useState("1.12");

  function launchGame() {
    let launcher = document.querySelector('.mclauncher') as HTMLElement;

    launcher.classList.add('closing');
    launcher.classList.remove('opening');
    
    if(document.getElementById('mclauncher-tb-app')) {
      (document.getElementById('mclauncher-tb-app') as HTMLDivElement).classList.remove('active');
    }

    toggleStoreApp(nameToID(get(selectedGame).name), get(selectedGame));
  }

  return (
    <>
      <div className="rtop">
        <div className="rbox">
          MINECRAFT: JAVA EDITION
          <br />
          <span className="bold">Play</span>
        </div>
      </div>
      <div className="rbottom background">
        <div className="rfarbtm">
          <div className="rfleft">
            <Dropdown style={{minWidth:'150px'}} defaultValue={"Vanilla - 1.12.2"} defaultSelectedOptions={["1.12"]} onOptionSelect={(e,d)=>{setSelectedGame(d.optionValue as string)}}>
              <Option value="1.12">Vanilla - 1.12.2</Option>
              <Option value="1.12-wasm">WASM-GC - 1.12.2</Option>
              <Option value="1.9">Lambda - 1.9</Option>
              <Option value="1.8">Vanilla - 1.8.8</Option>
              <Option value="1.8-wasm">WASM-GC - 1.8.8</Option>
              <Option value="1.5">Vanilla - 1.5.2</Option>
              <Option value="1.2.6">Vanilla - 1.2.6</Option>
              <Option value="1.3">Vanilla - b1.3</Option>
              <Option value="astra">Astra - 1.8.8</Option>
              <Option value="astra-wasm">Astra WASM - 1.8.8</Option>
              <Option value="forge">Forge - 1.8.8</Option>
              <Option value="resent1.8">Resent Old - 1.8.8</Option>
              <Option value="resent1.8/beta.html">Resent New - 1.8.8</Option>
              <Option value="shadow4">Shadow - 1.8.8</Option>
              <Option value="starlike">Starlike - 1.8.8</Option>
              <Option value="starlike-wasm">Starlike WASM - 1.8.8</Option>
            </Dropdown>
          </div>
          <div className="craftbutton" onClick={launchGame}>
            PLAY
          </div>
          <div className="rfright">
            glOS
          </div>
        </div>
      </div>
    </>
  )
}
function LegendsPage({open}: {open: MouseEventHandler<HTMLDivElement>}) {
  return (
    <>
      <div className="rtop">
        <div className="rbox">
          MINECRAFT LEGENDS
          <br />
          <span className="bold">Play</span>
        </div>
      </div>
      <div className="rbottom background-legends">
        <div className="rfarbtm">
          <div className="rfleft">
            Legends
          </div>
          <div className="craftbutton" onClick={open}>
            PLAY
          </div>
          <div className="rfright">
            on Glacier
          </div>
        </div>
      </div>
    </>
  )
}
function DungeonsPage({open}: {open: MouseEventHandler<HTMLDivElement>}) {
  return (
    <>
      <div className="rtop">
        <div className="rbox">
          MINECRAFT DUNGEONS
          <br />
          <span className="bold">Play</span>
        </div>
      </div>
      <div className="rbottom background-dungeons">
        <div className="rfarbtm">
          <div className="rfleft">
            Dungeons
          </div>
          <div className="craftbutton" onClick={open}>
            PLAY
          </div>
          <div className="rfright">
            on Glacier
          </div>
        </div>
      </div>
    </>
  )
}
function AccountsPage() {
  return (
    <>
      <div className="rtop">
        <div className="rbox">
          SETTINGS
          <br />
          <span className="bold">Accounts</span>
        </div>
      </div>
      <div className="rbottom" style={{background:'#222',display:'flex',justifyContent:'center',alignItems:'center'}}>
        No settings yet...
      </div>
    </>
  )
}

export default function MinecraftLauncherApp() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle>Minecraft: Bedrock Edition</ToastTitle>
        <ToastBody subtitle="This edition is currently unavalible due to restrictions on running android applications on Glacier.">Unable to switch edition</ToastBody>
      </Toast>,
      { intent: "error" }
    );

  const [cloudDialog, setCloudDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SelectedGame>("java");
  const friendlyNames = {
    "java": "Minecraft: Java Edition",
    "bedrock": "Minecraft: Bedrock Edition",
    "account": "Account Settings",
    "dungeons": "Minecraft Dungeons",
    "legends": "Minecraft Legends"
  };
  const descriptions = {
    "java": "",
    "bedrock": "",
    "account": "",
    "dungeons": "XBOX Cloud Gaming and GeForce NOW.",
    "legends": "XBOX Cloud Gaming."
  };

  function openCloudGaming() {
    let launcher = document.querySelector('.mclauncher > .w11-top > .w11-controls > .w11-close') as HTMLElement;
    launcher.click();

    toggleStoreApp(nameToID(cloudGaming.name), cloudGaming);
  }

  return (
    <>
      <Dialog open={cloudDialog} onOpenChange={(e, data) => {
        setCloudDialog(data.open);
      }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Play {friendlyNames[selectedGame]}</DialogTitle>
            <DialogContent>
            {friendlyNames[selectedGame]} is avalible to play via Cloud Gaming. Here's how to get started: First, open the Cloud Gaming app. From there, you can select your selected Cloud Provider.
            <br/><br/>
            {friendlyNames[selectedGame]} is avalible on: {descriptions[selectedGame]}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button onClick={openCloudGaming} appearance="primary">Open App</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Window title="Minecraft Launcher" id="mclauncher" taskbarIconID="mclauncher" color={'white'} seperateBorder="1px solid #ffffff0a">
       <Toaster toasterId={toasterId} />
        <div className="lsplit">
          <div className="lsplit-left">
            <div className="option-blank">

            </div>

            <div className={`option ${selectedGame == "account" && "active"}`} onClick={() => setSelectedGame("account")}>
              <img src="/windows/icons/user.webp" alt="" />
              <b>Glacier User</b>
            </div>

            <div className="option-blank">

            </div>

            <div className={`option ${selectedGame == "java" && "active"}`} onClick={() => setSelectedGame("java")}>
              <img src="/minecraft/java.webp" alt="" />

              <div className="option-names">
                <b className="small">MINECRAFT:</b>
                <b>Java Edition</b>
              </div>
            </div>
            <div className="option" onClick={notify}>
              <img src="/minecraft/bedrock.webp" alt="" />
              <div className="option-names">
                <b className="small">MINECRAFT</b>
                <b>for Windows</b>
              </div>
            </div>
            <div className={`option ${selectedGame == "dungeons" && "active"}`} onClick={() => setSelectedGame("dungeons")}>
              <img src="/minecraft/dungeons.ico" alt="" />
              <div className="option-names">
                <b className="small">MINECRAFT</b>
                <b>Dungeons</b>
              </div>
            </div>
            <div className={`option ${selectedGame == "legends" && "active"}`} onClick={() => setSelectedGame("legends")}>
              <img src="/minecraft/legends.webp" alt="" />
              <div className="option-names">
                <b className="small">MINECRAFT</b>
                <b>Legends</b>
              </div>
            </div>
          </div>
          <div className="lsplit-right">
            {selectedGame == "java" && <JavaPage />}
            {selectedGame == "account" && <AccountsPage />}
            {selectedGame == "dungeons" && <DungeonsPage open={()=>{setCloudDialog(true)}} />}
            {selectedGame == "legends" && <LegendsPage open={()=>{setCloudDialog(true)}} />}
          </div>
        </div>
      </Window>

    </>
  );
}