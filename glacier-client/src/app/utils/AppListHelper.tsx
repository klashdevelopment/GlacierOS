import React, { useEffect, useState } from "react";

export let apps: any[] = [];

export async function getApps() {
    // Ensure data is loaded before resolving the promise
    await ensureDataLoaded();
    return apps;
}

export function getWithCategory(category: string) {
    return apps.filter(app => app.category.split(",").includes(category));
}
export function getCustomFilter(filter: (app: any) => boolean) {
    return apps.filter(filter);
}
export  function getWithName(name: string) {
    return apps.find(app => app.name === name) || null;
}
export function getAllNames() {
    return apps.map(app => app.name);
}
export function getAllIcons() {
    return apps.map(app => app.image);
}
const blacklistedCategories = ["Hidden", "Minecraft", "Apps", "Games", "VMP", "VMS", "Devtools", "Movies", "", " "];
export function getCategories() {
    let categories: string[] = [];
    apps.forEach(app => {
        app.category.split(",").forEach((category: string) => {
            category = category.trim();
            categories.push(category);
        });
    });
    const uniqueCategories = Array.from(new Set(categories));
    return uniqueCategories.filter(category => !blacklistedCategories.includes(category));
}

async function ensureDataLoaded() {
    if (apps.length === 0) {
        const response = await fetch('/applist.json');
        const data = await response.json();
        // replace all %BASE% in app urls with the origin (ex. %BASE%/test -> http://localhost:3000/test)
        data.forEach((app: any) => {
            app.url = app.url.replace(/%BASE%/g, window.location.origin);
        });
        apps = data;
    }
}

export async function reloadData() {
    apps = [];
    await ensureDataLoaded();
}

export default function AppListHelper() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            ensureDataLoaded().then(() => {
                setLoaded(true);
            }).catch(err => {
                throw err;
            });
        }
    }, [loaded]);

    return null;
}
