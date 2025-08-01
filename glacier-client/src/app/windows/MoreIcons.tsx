import { Button, Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";
import { wallpapers } from "./Settings";
import { useEffect, useState } from "react";
import { apps, getAllIcons } from "../utils/AppListHelper";

// const wallpaperlist = wallpapers.map((_, index) => `wallpaper${index + 1}`);
export const IconList = ['glacierMac', 'glacierMacBig', 'glacierMacLarge', 'old_start', 'start', 'store', 'icons/user', 'icons/edge', 'icons/camera', 'icons/folder', 'icons/explorer', 'icons/calculator', 'icons/terminal', 'icons/close', 'icons/minimize', 'icons/maximize', 'icons/globe.svg#', 'icons/gray_globe.svg#', 'icons/square.ico#', 'blank',
  'favicon_blue', 'favicon_darkblue', 'favicon_orange', 'favicon_green', 'favicon_pink', 'favicon_purple', 'favicon_cyan', 'favicon_black', 'classroom', 'glacier.svg#', 'glacierwhite', 'google', 'drive', 'microsoft', 'minecraft', 'sugar', 'green_circle', 'yellow_circle', 'red_circle',
  'syntaxpad', 'folders/documents', 'folders/downloads', 'folders/movies', 'folders/music', 'folders/pictures', '../chromeos/settings', '../chromeos/start', '../chromeos/store', '../chromeos/syntaxpad', '../chromeos/icons/calculator', '../chromeos/icons/camera', '../chromeos/icons/edge', '../chromeos/icons/explorer', '../chromeos/icons/terminal',
  '../macos/settings', '../macos/start', '../macos/store', '../macos/syntaxpad', '../macos/icons/calculator', '../macos/icons/camera', '../macos/icons/edge', '../macos/icons/explorer', '../macos/icons/terminal', '../image/vscode', '../image/vscode-insiders', '../image/vscode-alt', '../image/vue', '../image/quadpad', '../image/bootpad', '../image/angular', '../minecraft/legends', '../minecraft/bedrock', '../minecraft/java', 'cai',
  '../ubuntu/settings', '../ubuntu/start', '../ubuntu/store', '../ubuntu/syntaxpad', '../ubuntu/icons/calculator', '../ubuntu/icons/camera', '../ubuntu/icons/edge', '../ubuntu/icons/explorer', '../ubuntu/icons/terminal',
  'glacierlink.ico#', '../papas/burger', '../papas/donut', '../papas/freeze', '../papas/pancake', '../papas/sushi', '../papas/taco', '../papas/cupcake', '../papas/pastaria', '../papas/hotdog', '../papas/wings', '../papas/pizza', '../papas/cheese',
  '../tahoe/settings', '../tahoe/start', '../tahoe/store', '../tahoe/syntaxpad', '../tahoe/icons/calculator', '../tahoe/icons/camera', '../tahoe/icons/edge', '../tahoe/icons/explorer', '../tahoe/icons/terminal',
  '../tahoe-dark/settings', '../tahoe-dark/start', '../tahoe-dark/store', '../tahoe-dark/syntaxpad', '../tahoe-dark/icons/calculator', '../tahoe-dark/icons/camera', '../tahoe-dark/icons/edge', '../tahoe-dark/icons/explorer', '../tahoe-dark/dueller',
];

function url(icon: string) {
  return `${icon.startsWith('http') ? icon : `/windows/${icon}.webp`}`;
}

export default function Icons({ back }: { back: any }) {
  const [icons, setIcons] = useState<string[]>([]);
  useEffect(() => {
    var appIcons = IconList.map(i=>url(i));
    appIcons.push(...getAllIcons());
    appIcons = appIcons.filter((icon) => icon !== undefined && icon !== null);
    appIcons = appIcons.filter((icon) => !(icon.trim().length < 1));
    appIcons = appIcons.filter((icon) => !icon.includes('googleusercontent'));
    appIcons = Array.from(new Set(appIcons));
    setIcons(appIcons);
    console.log(appIcons);
  }, []);
  return (
    <div>
      <Button onClick={back}>Back</Button><br />
      Select a new <b>window favicon</b> here<br />
      {icons.map((icon, idx) => (
        <Button key={idx} onClick={(e) => {
          document.querySelector('link[rel="shortcut icon"]')?.setAttribute('href', icon);
          window.localStorage.setItem('icon', icon as string);
        }} style={{ minWidth: '25px', padding: '10px', margin: '5px' }}><img src={icon} alt="" style={{ width: '25px' }} /></Button>
      ))}
    </div>
  );
}