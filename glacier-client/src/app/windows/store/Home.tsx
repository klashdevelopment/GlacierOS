import { getCategories, getWithCategory, reloadData } from "@/app/utils/AppListHelper";
import { Button, Dropdown, Option } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { nameToID, toggleStoreApp } from "./StoreApps";

import { ArrowClockwiseFilled } from "@fluentui/react-icons";
import { StoreGridItem } from "./Games";
import { useFavorites } from "../useFavorites";

export default function Apps() {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [updated, setUpdated] = useState(false);
    const favs = useFavorites();

    const updateCategories = () => {
        setCategories(getCategories());
    }

    useEffect(updateCategories, []);

    return (
        <div>
            <h1>Home</h1>
            <p>Either use the tabs on the left for broad categories, or search for a specific category here:</p>
            <Button icon={<ArrowClockwiseFilled/>} onClick={reloadData}>Reload App Data</Button>
            <p style={{gap:'2px',display:'flex'}}><Dropdown disabled={!updated} placeholder="Select a category..." defaultSelectedOptions={[""]} defaultValue={"None"} onOptionSelect={(e,d)=>{setSelectedCategory(d.optionValue||'');}}>
                <Option value="">None</Option>
                {categories.map((category, index) => {
                    return <Option key={index}>{category}</Option>
                })}
                </Dropdown><Button icon={<ArrowClockwiseFilled/>} onClick={()=>{updateCategories();setUpdated(true);}} /></p>
            {selectedCategory !== '' && <div className="store-games-panel store-panel store-grid">
                {getWithCategory(selectedCategory).map((app, i) => (
                    StoreGridItem(i, app, favs)
                ))}
            </div>}
        </div>
    )
}