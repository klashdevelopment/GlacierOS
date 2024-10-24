'use client';
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { Rnd } from "react-rnd";
import { formatName } from "../windows/store/StoreApps";

export default function Window({
  children,
  title,
  id,
  taskbarIconID,
  color = "glass",
  seperateBorder = "none",
  className = "",
  defaultClosed = true,
  defaultPosition = { x: 40, y: 40 },
  defaultSize = { width: 800, height: 500 },
  defaultMaximized = false,
  style = { borderTop: seperateBorder },
  noDragging = false,
  onClose = () => { }
}: Readonly<{
  children: React.ReactNode;
  title: string;
  id: string;
  taskbarIconID: string;
  color?: string;
  seperateBorder?: string;
  className?: string;
  defaultClosed?: boolean;
  defaultPosition?: { x: number, y: number };
  defaultSize?: { width: number, height: number };
  defaultMaximized?: boolean;
  style?: React.CSSProperties;
  noDragging?: boolean;
  onClose?: () => void;
}>) {
  const [maximized, setMaximized] = useState(defaultMaximized);
  const [selectedOS, setSelectedOS] = useState('windows');

  function close() {
    (document.getElementsByClassName(id)[0] as HTMLDivElement).classList.add('closing');
    if (document.getElementById(taskbarIconID + '-tb-app')) {
      (document.getElementById(taskbarIconID + '-tb-app') as HTMLDivElement).classList.remove('active');
    }
    onClose();
  }

  useEffect(() => {
    const div = document.getElementsByClassName(id)[0] as HTMLDivElement;
    let pxShiftBottom = {
      'windows': '48px',
      'chromeos': '48px',
      'macos': '90px',
      'ubuntu': '2px',
      'kali': '40px',
    } as any;
    let pxShiftTop = {
      'windows': '0px',
      'chromeos': '0px',
      'macos': '30px',
      'ubuntu': '0px',
      'kali': '30px',
    } as any;
    if (maximized) {
      div.style.top = `${pxShiftTop[selectedOS]}`;
      div.style.left = '0px';
      div.style.width = `calc(100% - ${selectedOS == "ubuntu" ? '48px' : '0px'})`;
      div.style.height = `calc(100% - ${pxShiftBottom[selectedOS]})`;
      div.style.transform = "none";
    } else {
      div.style.top = `${defaultPosition.y}px`;
      div.style.left = `${defaultPosition.x}px`;
      div.style.width = `${defaultSize.width}px`;
      div.style.height = `${defaultSize.height}px`;
    }
  }, [maximized]);


  useEffect(() => {
    if (window.localStorage.getItem('os')) {
      setSelectedOS(window.localStorage.getItem('os') || "windows");
    }
    if (defaultClosed) {
      (document.getElementsByClassName(id)[0] as HTMLDivElement).style.display = 'none';
      close();
      setTimeout(() => {
        (document.getElementsByClassName(id)[0] as HTMLDivElement).style.display = 'block';
      }, 500);
    } else {
      if (document.getElementById(taskbarIconID + '-tb-app')) {
        (document.getElementById(taskbarIconID + '-tb-app') as HTMLDivElement).classList.add('active');
      }
    }
    (document.getElementsByClassName(id)[0] as HTMLDivElement).addEventListener('click', () => {
      let allWindows = document.querySelectorAll('.w11-window');
      allWindows.forEach((x) => {
        (x as HTMLDivElement).style.zIndex = '4';
      });

      (document.getElementsByClassName(id)[0] as HTMLDivElement).style.zIndex = '5';
    })
  }, []);

  const windowColors = ['gray', 'glass', 'black', 'white', 'onedarkbg'];

  return (
    <Rnd
      default={{
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height,
      }}
      minWidth={600}
      minHeight={350}

      dragHandleClassName="w11-top"
      className={`w11-window ${windowColors.includes(color) ? color + ' ' : ''}${id}`}
      style={{
        zIndex: '4',
        color: windowColors.includes(color) ? undefined : 'white',
        background: windowColors.includes(color) ? undefined : color
      }}
      disableDragging={maximized}
      enableResizing={!maximized && !noDragging}
    >
      <div className="w11-top">
        <div className="w11-title">{formatName(selectedOS, title)}</div>
        <div className="w11-controls">
          <div className="w11-minimize left"><img src="/windows/icons/minimize.png" alt="" style={{ width: '18px', marginTop: '1px', filter: (color == 'white' ? 'none' : 'brightness(0) invert(1)') }} /></div>
          <div className="w11-fullscreen mid" onClick={() => {
            setMaximized(!maximized);
          }}><img src="/windows/icons/maximize.png" alt="" style={{ width: '18px', marginTop: '1px', filter: (color == 'white' ? 'none' : 'brightness(0) invert(1)') }} /></div>
          <div className="w11-close end" onClick={close}><img src="/windows/icons/close.png" alt="" style={{ width: '18px', marginTop: '1px', filter: (color == 'white' ? 'none' : 'brightness(0) invert(1)') }} /></div>
        </div>
      </div>
      <div className="w11-content" style={style}>
        {children}
      </div >
    </Rnd >
  )
}