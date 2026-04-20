import FrameWindow from '@/app/components/FrameWindow';
import Window from '@/app/components/Window';
import { getApps } from '@/app/utils/AppListHelper';
import React, { useState, useEffect } from 'react';
import { useStoreApps } from './StoreAppsContext';

export function useToggleStoreApp() {
  const store = useStoreApps();
  const { exists, addApp, removeApp } = store;

  return (id: string, app: any) => {
    // ===== glacier builtins =====
    console.log(store.openApps);
    if (app.url.startsWith('glacier://')) {
      const window = document.getElementsByClassName(
        app.url.substring('glacier://'.length)
      )[0];

      if (window) {
        if (window.classList.contains('closing')) {
          window.classList.remove('closing');
          window.classList.add('opening');

          document.querySelectorAll('.w11-window').forEach((x) => {
            (x as HTMLDivElement).style.zIndex = '4';
          });
          (window as HTMLDivElement).style.zIndex = '5';
        } else {
          window.classList.remove('opening');
          window.classList.add('closing');
        }
      }
      return;
    }

    // ===== store-managed apps =====
    if (!exists('name', app.name)) { // app is not open
      addApp(app);
      console.log("App is opening:", id);
        setTimeout(() => {
          const window = document.getElementsByClassName(id)[0];
          if (window) {
            window.classList.remove('closing');
            window.classList.add('opening');
          }

          const frame = document.querySelector(`.${id} > .w11-content > div > iframe`) as HTMLIFrameElement;
          
          if (frame) {
            frame.src = frame.dataset.src as string;

            if ((frame.dataset.cssinject?.trim().length || 0) > 0) {
              const cssURL = (frame.dataset.cssinject as string).split('|')[0];
              const cssTIME = parseInt((frame.dataset.cssinject as string).split('|')[1]);

              const addCSS = () => {
                const cssLink = document.createElement("link");
                cssLink.href = cssURL;
                cssLink.rel = "stylesheet";
                cssLink.type = "text/css";
                frame.contentDocument?.body.appendChild(cssLink);
              };
              setTimeout(addCSS, cssTIME);
            }

            frame.focus();
          }

          const allWindows = document.querySelectorAll('.w11-window');
          allWindows.forEach((x) => {
            (x as HTMLDivElement).style.zIndex = '4';
          });
          
          const currentWindow = document.getElementsByClassName(id)[0] as HTMLDivElement;
          if (currentWindow) {
            currentWindow.style.zIndex = '5';
          }
        }, 10);
    } else { // app is open
      const window = document.getElementsByClassName(id)[0];
      console.log(window, id);
      if (window?.classList.contains('opening') || !(window.classList.contains('closing') || window.classList.contains('opening'))) {
        window.classList.remove('opening');
        window.classList.add('closing');

        setTimeout(() => {
          console.log("Removing app:", id);
          store.openApps.filter(a => nameToID(a.name, a.url) === id).forEach(a => { removeApp(a); });
        }, 500);
      }
    }
  };
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

  const SAC = useStoreApps();

  useEffect(() => {
    if (window.localStorage.getItem('os')) {
      setSelectedOS(window.localStorage.getItem('os') || "windows");
    }
    const fetchData = async () => {
      const appsData = await getApps();
      setApps(appsData);
    };

    fetchData();
    setInterval(() => {
      if (window.localStorage.getItem('gquicks')) {
        setQuickApps((JSON.parse(window.localStorage.getItem('gquicks') as string)));
      }
    }, 500);
  }, []);

  return (
    <>
      {/* {apps.map((app, index) => (
        <>{!app.url.startsWith('glacier://') ? <FrameWindow cssInject={app.cssInject ? app.cssInject : ''} key={index} defaultUseUV={process.env.NODE_ENV == 'development' ? false : app.unblock} id={(nameToID(app.name))} url={app.url} title={formatName(selectedOS, app.name)} /> : null}</>
      ))}
      {quickApps.map((app: any, index: any) => (
        <>{!app.url.startsWith('glacier://') ? <FrameWindow key={index} defaultUseUV={process.env.NODE_ENV == 'development' ? false : app.unblock} id={(nameToID(app.name))} url={app.url} title={formatName(selectedOS, app.name)} /> : null}</>
      ))} */} 
      {/* A. quick apps are being removed :( and b. we only want open apps! */}
      {SAC.openApps.map((app, index) => (
        <>{app && (!app.url.startsWith('glacier://') ? <FrameWindow cssInject={app.cssInject ? app.cssInject : ''} key={index} defaultUseUV={process.env.NODE_ENV == 'development' ? false : app.unblock} id={(nameToID(app.name, app.url))} url={app.url} title={formatName(selectedOS, app.name)} /> : null)}</>
      ))}
    </>
  );
};

export default StoreApps;