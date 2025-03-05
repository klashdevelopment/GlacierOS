"use client";
import { Button, Checkbox, Dropdown, Input, Label, Option, OptionOnSelectData, Persona, SelectionEvents, Slider, Textarea } from "@fluentui/react-components";
import Window from "../components/Window";
import './settings.css';
import { useEffect, useState } from "react";
import { EyeOffFilled, EyeFilled, ArrowUploadFilled } from "@fluentui/react-icons";
import Emoji from "../components/Emoji";
import xor from "../utils/XOR";
import constants from "../Constants";
import Icons from "./MoreIcons";
export let wallpapers = ["Motion Layered", "Sphere Green", "Sphere Purple", "Light Wave", "Light Fluent", "Dark Fluent", "Light Sand", "Windows Kali", "Motion Cones", "Motion Ribbon", "Motion Blobs", "Sun Daytime", "Sun Mountain", "Sun Setting", "Sun Desert", "Fluent Blue", "Fluent Green", "Fluent Pink", "Fluent Gray", "Windows 11 Dark", "Windows 11 Light", "Sun Nighttime", "MacOS Mojave", "MacOS Catalina", "MacOS Big Sur", "MacOS Monterey", "Chrome OS Default", "Frosty Glaciers", "Ubuntu 20.04", "Ubuntu Clean", "Cyberrush Rooftop (Lux)", "Cyberrush Track (Lux)", "Cyberrush Void (Lux)", "Cyberrush Building (Lux)", "Kali Trail", "Kali Prompt", "Kali Legacy", "Kali Layers", "Kali Luminara", "MacOS Somona", "Glacier Blue", "Raspberry Pi Default"];

export function SetWallpaperNum(wp: string) {
  document.body.style.backgroundImage = `url("/windows/wallpaper${wp}.webp")`;
  window.localStorage.setItem('background', `/windows/wallpaper${wp}.webp`);
}
export function SetWallpaperURL(wp: string) {
  document.body.style.backgroundImage = `url("${wp}")`;
  window.localStorage.setItem('background', wp);
}

function Personalization({ switchPage }: { switchPage: any }) {
  const [prevWallp, setPrevWallp] = useState(false);
  const [selectedOS, setSelectedOS] = useState('windows');
  const [macOSDockEffects, setMacOSDockEffects] = useState(true);
  const [fakeMode, setFakeMode] = useState(false);

  const onChange = (event: SelectionEvents, data: OptionOnSelectData): void => {
    SetWallpaperNum(data.optionValue as string);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const url = e.target.result;
        SetWallpaperURL(url as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    (document.getElementById('imageUpload') as HTMLButtonElement).click();
  };

  useEffect(() => {
    if (window.localStorage.getItem('os')) {
      setSelectedOS(window.localStorage.getItem('os') as string);
    }
    if (window.localStorage.getItem('macOS-dock-effects')) {
      setMacOSDockEffects(window.localStorage.getItem('macOS-dock-effects') === 'true');
    }
    if (window.localStorage.getItem('fake-mode')) {
      setFakeMode(window.localStorage.getItem('fake-mode') === 'true');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('macOS-dock-effects', macOSDockEffects.toString());
  }, [macOSDockEffects]);

  return (
    <>
      <h1>Personalization</h1>
      <b>Window/Tab Title</b>
      <br />
      <div style={{ display: 'flex', gap: '5px' }}>
        <Button onClick={() => {
          switchPage('icons');
        }}>Edit Icon</Button>
        <Input placeholder="Edit Title..." onChange={function (event, data) {
          window.localStorage.setItem('title', data.value);
          document.title = data.value;
        }} />
      </div>
      <br />
      <br />
      <b>Wallpaper</b>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>

          <Button appearance="outline" onClick={() => {
            setPrevWallp(!prevWallp);
          }} icon={prevWallp ? <EyeFilled /> : <EyeOffFilled />}></Button>

          <input
            type="file"
            id="imageUpload"
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <Button appearance="outline" onClick={triggerFileInput} icon={<ArrowUploadFilled />}></Button>

          <Dropdown id="background-select" onOptionSelect={onChange} placeholder="Choose a new wallpaper..." style={{ width: '50%' }}>
            {wallpapers.map((wallpaper, index) => {
              return <Option key={index + 1} value={`${index + 1}`} text={wallpaper}>
                {<Persona
                  name={wallpaper}
                  secondaryText={`#${index + 1}`}
                  avatar={prevWallp ? {
                    image: {
                      src: `/windows/wallpaper${index + 1}.webp`,
                      loading: 'lazy',
                      alt: wallpaper
                    },
                    style: {
                      borderRadius: '8px',
                      width: '50px'
                    }
                  } : undefined}
                />}
              </Option>
            })}
          </Dropdown></div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button appearance="outline" disabled icon={<ArrowUploadFilled />}></Button>
          <Dropdown placeholder="Choose a new OS..." style={{ width: '50%' }} onOptionSelect={(event, data) => {
            window.localStorage.setItem('os', data.optionValue as string);
            window.location.reload(); 
          }}>
            <Option value={'windows'}>Windows 11</Option>
            <Option value={'macos'}>Mac OS</Option>
            <Option value={'chromeos'}>Chrome OS</Option>
            <Option value={'ubuntu'}>Ubuntu</Option>
            <Option value={'kali'}>Kali Linux</Option>
          </Dropdown>
        </div>
      </div>
      <br />
      <br />
      <b>OS Settings</b>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          <Dropdown disabled placeholder="Choose a new accent color..." style={{ width: '50%' }}>
            <Option disabled value={'blue'}>Blue</Option>
            <Option disabled value={'green'}>Green</Option>
            <Option disabled value={'pink'}>Pink</Option>
            <Option disabled value={'gray'}>Gray</Option>
          </Dropdown>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <Checkbox label={"Show Fake before Launch"} checked={fakeMode} onChange={(e, d) => {
            setFakeMode(d.checked == "mixed" ? false : d.checked);
            window.localStorage.setItem('fake-mode', d.checked.toString());
          }} />
        </div>
      </div>
    </>
  )
}

function Accounts() {
  return (
    <>
      <h1>Credits</h1>
      <ul>
        <li>gavingogaming (github: gavingogaming) - Lead dev</li>
        <li>foxmoss (github: foxmoss) - Mediaology, Games, Support</li>
      </ul>
    </>
  );
}

function Debugger() {
  const [threadName, setThreadName] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  function sendBugReport() {
    if (content.trim().length < 20) {
      alert('Bug report must be more than 20 characters.');
      return;
    }

    fetch('https://discord.com/api/webhooks/1276625589981151333/O51uXtrYhl0bSYU11tPxjrnsaiQhLSjDoKtZauUOhp8I4KBb-JCEN3kdC1g1EBkAzr5a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        thread_name: threadName || 'Untitled Bug Report',
        content: content
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));

    setThreadName('');
    setContent('');
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  }

  const [bugReports, setBugReports] = useState<{ title: string, content: {author: string, content: string}[] }[]>([{"title":"Refresh First","content":[{"author":"GlacierOS","content":"Refresh to load in all bug reports and responses. Currently, no bug reports have been loaded in - which is why you're seeing this message."}]}]);
  function refreshBugReports() {
    fetch('/check-forums')
      .then(response => response.json())
      .then(data => {
        setBugReports(data);
      })
      .catch(error => console.error('Error:', error));
  }
  useEffect(refreshBugReports, []);

  function truncate(str: string, n: number) {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
  }

  function BugReportCard({ title, author, content, firstReply }: { title: string, author: string, content: string, firstReply?: string }) {
    return (
      <div style={{ width: 'calc(100% - 10px)', height: firstReply ? '96px' : '60px', overflowY: 'hidden', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', flexDirection: 'column', padding: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <b>{title}</b>
          <code>{author.includes("Glacier In-App") ? "Sent from Glacier" : author}</code>
        </div>
        <div style={{width:'100%',minHeight:'1px',background:'#00000080'}}></div>
        <span>{truncate(content, 141)}</span>
        {firstReply && <>
          <div style={{width:'100%',minHeight:'1px',background:'#00000080'}}></div>
          <span>{firstReply}</span>
        </>}
      </div>
    );
  }

  return (
    <>
      <h1>Bug Reporting</h1>
      {/* Text box for typing a message raw, then a send button */}
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <Input disabled={showSuccess} placeholder="Bug Report Title" value={threadName} onChange={
          (e, d) => {
            setThreadName(d.value);
          }
        } />
        <Textarea disabled={showSuccess} placeholder="Type your bug report here..." value={content} onChange={
          (e, d) => {
            setContent(d.value);
          }
        } />
        <Button disabled={showSuccess} onClick={sendBugReport}>Send</Button>

        <b style={{ display: showSuccess ? 'block' : 'none' }}>Your bug report has been sent. Thank you!</b>
        <h2>Bug Reports</h2>
        <Button onClick={refreshBugReports}>Refresh</Button>
        {bugReports.map((report, index) => {
          // first reply - first reply that starts with "[Response]"
          const firstReply = report.content.find((c) => c.content.startsWith("[Response]")) || { content: "" };
          return <BugReportCard key={index} title={report.title} author={report.content[0].author} content={report.content[0].content} firstReply={firstReply.content} />
        })}
      </div>
    </>
  );
}

function System() {
  return (
    <>
      <h1>System</h1>
      <h4>You are using <code style={{ fontFamily: '"JetBrains Mono"' }}>{process.env.NODE_ENV.charAt(0).toUpperCase() + process.env.NODE_ENV.slice(1)} {constants.VERSION}</code></h4>
      <h4>Browser: <code style={{ fontFamily: '"JetBrains Mono"' }}>{navigator.userAgent}</code></h4>
      <h4>Setting (OS): <code style={{ fontFamily: '"JetBrains Mono"' }}>{window.localStorage.getItem('os') || 'Windows 11'}</code></h4>
      <h4>Debugger Enabled: <code style={{ fontFamily: '"JetBrains Mono"' }}>{process.env.NODE_ENV == "development" ? "Yes" : "No"}</code></h4>
    </>
  );
}
function Accessibility() {
  const [screenTint, setScreenTint] = useState(false);
  const [screenTintValue, setScreenTintValue] = useState(0);

  useEffect(() => {
    window.localStorage.setItem('screenTint', JSON.stringify({ enabled: screenTint, value: screenTintValue }));
    document.body.style.setProperty('filter', screenTint ? `hue-rotate(${screenTintValue}deg)` : 'none');
    document.body.style.setProperty('backdrop-filter', screenTint ? `hue-rotate(${screenTintValue}deg)` : 'none');
  }, [screenTint, screenTintValue]);
  useEffect(() => {
    var screenTint = window.localStorage.getItem('screenTint');
    if (screenTint) {
      var tint = JSON.parse(screenTint);
      setScreenTint(tint.enabled);
      setScreenTintValue(tint.value);
    }
  }, []);

  return (
    <>
      <h1>Accessibility</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <b>Screen Tint</b>
        <Checkbox onChange={(e, d) => { setScreenTint(d.checked == "mixed" ? false : d.checked) }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Slider min={0} max={360} defaultValue={0} onChange={(e, d) => { setScreenTintValue(d.value) }} />
        <code style={{ fontFamily: '"JetBrains Mono"' }}>{screenTintValue}°</code>
      </div>
    </>
  );
}
function Apps() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  return (
    <>
      <h1>Apps</h1>
      <b>Input</b><br />
      <Input placeholder="XOR Input" onChange={(event, data) => { setInput(data.value) }} /><br /><br />
      <b>Output</b><br />
      <Input placeholder="XOR Output" readOnly={true} value={output} /><br />
      <a id="xor_output_url" target="_blank" style={{ color: '#57575B' }}>Open URL Output</a>
      <br />
      <br />
      <Button onClick={() => {
        setOutput(xor.decode(input));
        (document.getElementById('xor_output_url') as HTMLAnchorElement).style.color = '#57575B';
      }}>Decode</Button>
      <Button onClick={() => {
        setOutput(xor.encode(input));
        (document.getElementById('xor_output_url') as HTMLAnchorElement).style.color = '#57575B';
      }}>Encode</Button>
      <Button onClick={() => {
        setOutput(xor.quickURL(input));
        document.getElementById('xor_output_url')?.setAttribute('href', xor.quickURL(input));
        (document.getElementById('xor_output_url') as HTMLAnchorElement).style.color = '#28A9FF';
      }}>Encode to URL</Button>
    </>
  );
}

export default function SettingsApp() {
  const [tab, setTab] = useState('personalization');

  useEffect(() => {
    var title = window.localStorage.getItem('title');
    var icon = window.localStorage.getItem('icon');

    if (title) {
      document.title = title;
    } else {
      document.title = 'Glacier';
      window.localStorage.setItem('title', 'Glacier');
    }
    if (icon) {
      document.querySelector('link[rel="shortcut icon"]')?.setAttribute('href', `/windows/${icon}.webp`);
    } else {
      window.localStorage.setItem('icon', 'glacierwhite');
    }
  }, []);
  return (
    <Window title="Settings" id="settings" taskbarIconID="settings" color={'gray'} seperateBorder="1px solid #cccccc0a">
      <div className="window-padding">
        <div className="settings-split">
          <div className="left">
            <Input placeholder="Search settings..." />
            <div className={`settings-section ${tab === 'system' && 'active'}`} onClick={() => { setTab('system') }}>
              <img src="/windows/icons/System.webp" alt="" />
              <p>System</p>
            </div>
            <div className="settings-section disabled">
              <img src="/windows/icons/Bluetooth & devices.webp" alt="" />
              <p>Bluetooth & Devices</p>
            </div>
            <div className="settings-section disabled">
              <img src="/windows/icons/Network & internet.webp" alt="" />
              <p>Network & Internet</p>
            </div>
            <div className={`settings-section ${tab === 'personalization' && 'active'}`} onClick={() => { setTab('personalization') }}>
              <img src="/windows/icons/Personalisation.webp" alt="" />
              <p>Personalization</p>
            </div>
            {tab === 'icons' &&
              <div className={`settings-section active`} onClick={() => { setTab('icons') }}>
                <img src="/windows/icons/Personalisation.webp" alt="" />
                <p>Icons</p>
              </div>
            }
            <div className={`settings-section ${tab === 'apps' && 'active'}`} onClick={() => { setTab('apps') }}>
              <img src="/windows/icons/Apps.webp" alt="" />
              <p>Apps</p>
            </div>
            <div className={`settings-section ${tab === 'accounts' && 'active'}`} onClick={() => { setTab('accounts') }}>
              <img src="/windows/icons/Accounts.webp" alt="" />
              <p>Accounts</p>
            </div>
            <div className="settings-section disabled">
              <img src="/windows/icons/Time & language.webp" alt="" />
              <p>Time & Language</p>
            </div>
            <div className="settings-section disabled">
              <img src="/windows/icons/Gaming.webp" alt="" />
              <p>Gaming</p>
            </div>
            <div className={`settings-section ${tab === 'accessibility' && 'active'}`} onClick={() => { setTab('accessibility') }}>
              <img src="/windows/icons/Accessibility.webp" alt="" />
              <p>Accessibility</p>
            </div>
            <div className={`settings-section ${tab === 'debugger' && 'active'}`} onClick={() => { setTab('debugger') }}>
              <img src="/windows/icons/Privacy & security.webp" alt="" />
              <p>Privacy & Security</p>
            </div>
          </div>
          <div className="right">
            {tab === 'personalization' && <Personalization switchPage={setTab} />}
            {tab === 'accounts' && <Accounts />}
            {tab === 'apps' && <Apps />}
            {tab === 'debugger' && <Debugger />}
            {tab === 'system' && <System />}
            {tab === 'accessibility' && <Accessibility />}
            {tab === 'icons' && <Icons back={() => { setTab('personalization') }} />}
          </div>
        </div>
      </div>
    </Window>
  );
}