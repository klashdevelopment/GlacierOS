import FrameWindow from '@/app/components/FrameWindow';
import Window from '@/app/components/Window';
import { getApps } from '@/app/utils/AppListHelper';
import React, { useState, useEffect } from 'react';

export function toggleStoreApp(id: string, app: any) {
  if (app.url.startsWith('glacier://')) {
    let window = document.getElementsByClassName(app.url.substring('glacier://'.length))[0];
    if (window) {
      if (window.classList.contains('closing')) {
        window.classList.remove('closing');
        window.classList.add('opening');
        let allWindows = document.querySelectorAll('.w11-window');
        allWindows.forEach((x) => {
          (x as HTMLDivElement).style.zIndex = '4';
        });

        (window as HTMLDivElement).style.zIndex = '5';
      } else {
        window.classList.remove('opening'); 
        window.classList.add('closing');
      }
    }
  } else {
    let window = document.getElementsByClassName(id)[0];
    if (window) {
      if (window.classList.contains('closing')) {
        window.classList.remove('closing');
        window.classList.add('opening');

        var frame = (document.querySelector(`.${id} > .w11-content > div > iframe`) as HTMLIFrameElement);
        frame.src = frame.dataset.src as string;

        if (frame.dataset.cssinject?.trim().length||0 > 0) {
          const cssURL = (frame.dataset.cssinject as string).split('|')[0];
          const cssTIME = parseInt((frame.dataset.cssinject as string).split('|')[1]);

          const addCSS = () => {
            var cssLink = document.createElement("link");
            cssLink.href = cssURL;
            cssLink.rel = "stylesheet";
            cssLink.type = "text/css";
            (frame.contentDocument as Document).body.appendChild(cssLink);
          };
          setTimeout(addCSS, cssTIME);
        }

        frame.focus();

        let allWindows = document.querySelectorAll('.w11-window');
        allWindows.forEach((x) => {
          (x as HTMLDivElement).style.zIndex = '4';
        });
        (window as HTMLDivElement).style.zIndex = '5';
      } else {
        window.classList.remove('opening');
        window.classList.add('closing');
      }
    }
  }
}

export function nameToID(name: string, url?: string) {
  if (url && url.startsWith('glacier://')) {
    return url.substring('glacier://'.length);
  }
  return 'sa-' + name.toLowerCase().replace(/[\W_]+/g, "-");
}

export const conversions = {
  "Microsoft Edge": {
    "windows": "Microsoft Edge",
    "macos": "Safari",
    "tahoe": "Safari",
    "tahoe-dark": "Safari",
    "chromeos": "Chrome",
    "ubuntu": "Firefox",
    "kali": "Firefox",
  },
  "File Explorer": {
    "windows": "File Explorer",
    "macos": "Finder",
    "tahoe": "Files",
    "tahoe-dark": "Files",
    "chromeos": "Files",
    "ubuntu": "Files",
    "kali": "Files",
  },
  "Start": {
    "windows": "Start",
    "macos": "Launchpad",
    "tahoe": "Launchpad",
    "tahoe-dark": "Launchpad",
    "chromeos": "Launcher",
    "ubuntu": "Activities",
    "kali": "Activities",
  }
} as any;

export function formatName(selectedOS: string, name: string) {
  // if conversion exists, return the converted name based on the selected OS, otherwise return the original name
  return (conversions[name] && conversions[name][selectedOS]) ? conversions[name][selectedOS] : name;
}

const StoreApps = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [quickApps, setQuickApps] = useState<any[]>([]);
  const [selectedOS, setSelectedOS] = useState('windows');

  useEffect(() => {
    if (window.localStorage.getItem('os')) {
      setSelectedOS(window.localStorage.getItem('os') || "windows");
    }
    // Simulating fetching data from AppListHelper
    const fetchData = async () => {
      // Assuming AppListHelper.fetchApps() is an asynchronous function that fetches the apps
      const appsData = await getApps();
      setApps(appsData);
    };

    fetchData();
    setInterval(() => {
      if (window.localStorage.getItem('gquicks')) {
        setQuickApps((JSON.parse(window.localStorage.getItem('gquicks') as string)));
      }
    }, 500);
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <>
      {apps.map((app, index) => (
        <>{!app.url.startsWith('glacier://') ? <FrameWindow cssInject={app.cssInject ? app.cssInject : ''} key={index} defaultUseUV={process.env.NODE_ENV == 'development' ? false : app.unblock} id={(nameToID(app.name))} url={app.url} title={formatName(selectedOS, app.name)} /> : null}</>
      ))}
      {quickApps.map((app: any, index: any) => (
        <>{!app.url.startsWith('glacier://') ? <FrameWindow key={index} defaultUseUV={process.env.NODE_ENV == 'development' ? false : app.unblock} id={(nameToID(app.name))} url={app.url} title={formatName(selectedOS, app.name)} /> : null}</>
      ))}
    </>
  );
};

export default StoreApps;