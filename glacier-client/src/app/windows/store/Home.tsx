import { getCategories, getWithCategory } from "@/app/utils/AppListHelper";
import { Button, Dropdown, Option } from "@fluentui/react-components";
import { useState, useEffect } from "react";
import { nameToID, toggleStoreApp } from "./StoreApps";

import { ArrowClockwiseFilled } from "@fluentui/react-icons";

export default function Apps() {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [updated, setUpdated] = useState(false);

    const updateCategories = () => {
        setCategories(getCategories());
    }

    useEffect(updateCategories, []);

    return (
        <div>
            <h1>Home</h1>
            <p>Either use the tabs on the left for broad categories, or search for a specific category here:</p>
            <p><Dropdown disabled={!updated} placeholder="Select a category..." defaultSelectedOptions={[""]} defaultValue={"None"} onOptionSelect={(e,d)=>{setSelectedCategory(d.optionValue||'');}}>
                <Option value="">None</Option>
                {categories.map((category, index) => {
                    return <Option key={index}>{category}</Option>
                })}
                </Dropdown><Button icon={<ArrowClockwiseFilled/>} onClick={()=>{updateCategories();setUpdated(true);}} /></p>
            {selectedCategory !== '' && <div className="store-games-panel store-panel store-grid">
                {getWithCategory(selectedCategory).map((app, i) => (
                    <div key={i} className="store-grid-item">
                        <img src={app.image} alt={app.name} onClick={function(){toggleStoreApp(nameToID(app.name), app)}} />
                        <div className="title" onClick={function(){toggleStoreApp(nameToID(app.name), app)}}>{app.name}</div>
                    </div>
                ))}
            </div>}
        </div>
    )
}