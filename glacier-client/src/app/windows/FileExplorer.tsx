import { Button, Dropdown, Input, Option, OptionOnSelectData, Persona, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";
import './explorer.css';
import { useEffect, useState } from "react";
import { ArrowLeftFilled, ArrowRightFilled, ArrowUpFilled, ArrowClockwiseFilled, DesktopRegular, SearchRegular, PinFilled } from "@fluentui/react-icons";

function FileItemQuickAccess({ icon, name, pinned, oc }: { icon: string, name: string, pinned: boolean, oc?: any }) {
    return (
        <div className="fiqa" onClick={oc}>
            <img src={icon} height={20} />
            <span>{name}</span>
            {pinned && <PinFilled />}
        </div>
    )
}
function FileItemWithType({ icon, name, type, date, size }: { icon: string, name: string, type: string, date: string, size: string }) {
    return (
        <div className="fiwt">
            <div className="fiwt-left">
                <img src={icon} height={20} />
                <span>{name}</span>
            </div>
            <div className="fiwt-right">
                <span className="type">
                    {type}
                </span>
                <span className="date">
                    {date}
                </span>
                <span className="size">
                    {size}
                </span>
            </div>
        </div>
    )
}
function FileItemLink({ icon, name, type, date, size, url, down = false }: { icon: string, name: string, type: string, date: string, size: string, url: string, down?: boolean }) {
    return (
        <div className="fiwt" onClick={() => { window.open(url) }}>
            <div className="fiwt-left" style={down ? { color: 'red' } : {}}>
                <img style={down ? { filter: 'hue-rotate(170deg)' } : {}} src={icon} height={20} />
                <span>{name}</span>
            </div>
            <div className="fiwt-right">
                <span className="type">
                    {type}
                </span>
                <span className="date">
                    {date}
                </span>
                <span className="size">
                    {size}
                </span>
            </div>
        </div>
    )
}

interface LinkData {
    name: string;
    link: string;
    reccomended: boolean;
    official: boolean;
    speed: string;
}

export default function FileExplorer() {
    const [links, setLinks] = useState<LinkData[]>([]);

    function refreshData() {
        fetch('https://raw.githack.com/klashdevelopment/glacier-data-repo/main/links.json')
            .then(res => res.text())
            .then(data => {
                setLinks(JSON.parse(data.substring(12)));
            })
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <Window title="File Explorer" id="file-explorer" taskbarIconID="file-explorer" color={'black'} seperateBorder="none" style={{ overflow: 'hidden' }}>
            <div className="window-tabs">
                <div className="tab">
                    <img src={`/windows/icons/folder.webp`} height={20} /> Files
                </div>
            </div>
            <div className="fewp" style={{ overflow: 'hidden' }}>
                <div className="fewp-icons">
                    <ArrowLeftFilled color={'#555'} />
                    <ArrowRightFilled color={'#555'} />
                    <ArrowUpFilled color={'#555'} />
                    <ArrowClockwiseFilled color={'#555'} />
                </div>
                <div className="fewp-input">
                    <Input placeholder="Glacier  ›  Files" style={{ width: '100%' }} contentBefore={<DesktopRegular />} />
                </div>
                <div className="fewp-search">
                    <Input placeholder="Search Files" contentAfter={<SearchRegular />} />
                </div>
            </div>
            <div className="fecontent" style={{ overflow: 'hidden' }}>
                <div className="fe-split-left" style={{ overflowY: 'scroll' }}>
                    <div className="padding10">
                        <FileItemQuickAccess icon="/windows/folders/desktop.ico" name="Desktop" pinned={true} />
                        <FileItemQuickAccess icon="/windows/folders/downloads.webp" name="Downloads" pinned={true} />
                        <FileItemQuickAccess icon="/windows/folders/documents.webp" name="Documents" pinned={true} />
                        <FileItemQuickAccess icon="/windows/folders/pictures.webp" name="Pictures" pinned={false} />
                        <FileItemQuickAccess icon="/windows/folders/movies.webp" name="Videos" pinned={false} />
                        <FileItemQuickAccess icon="/windows/folders/music.webp" name="Music" pinned={false} />
                        <FileItemQuickAccess icon="/windows/icons/folder.webp" name="Refresh" pinned={false} oc={refreshData} />
                    </div>
                </div>
                <div className="fe-split-right" style={{ overflowY: 'scroll' }}>
                    <div className="padding10">
                        {links.map((link) => {
                            return (
                                <FileItemLink down={link.speed == "Down"} icon="/windows/glacierlink.ico" url={link.link} name={link.name} type={`${link.reccomended ? "Full (UV)" : "Static (NoUV)"}`} date={`${link.official ? "Official" : "Unofficial"}`} size={`Speed - ${link.speed}`} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </Window>
    );
}