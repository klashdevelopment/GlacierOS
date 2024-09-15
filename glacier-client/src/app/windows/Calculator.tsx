import { Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";

export default function CalculatorApp() {
    return (
      <Window title="Calculator" id="calculator" defaultSize={{width: 380, height: 500}} taskbarIconID="calculator" color={'white'} seperateBorder="1px solid #ffffff0a">
        <div className="window-full">
          <iframe src="https://www.desmos.com/scientific" style={{border:'0px',position:'absolute',width:'100%',height:'calc(100% - 40px)'}}></iframe>
        </div>
      </Window>
    );
}