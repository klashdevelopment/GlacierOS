import { Button, Checkbox, CheckboxOnChangeData, CheckboxProps, Dropdown, Input, Option, OptionOnSelectData, SelectionEvents } from "@fluentui/react-components";
import Window from "../components/Window";
import {CameraFilled} from '@fluentui/react-icons';
import { ChangeEvent, useEffect, useState } from "react";

export default function CameraApp() {
  const [ timer, setTimer ] = useState<CheckboxProps["checked"]>(true);

  useEffect(() => {
    const video = document.getElementById('camera-player') as HTMLVideoElement;
    const canvas = document.getElementById('camera-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const timercooldown = document.getElementById('timer-cooldown') as HTMLDivElement;
    const timercooldowntext = document.getElementById('timer-cooldown-text') as HTMLDivElement;
    const takePhotoButton = document.getElementById('camera-take-photo') as HTMLButtonElement;
    const constraints = {
      video: true
    };
    function startApp() {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.play();
      });
      function takeImage() {
        canvas.classList.remove('hidden');
        video.classList.add('hidden');
        takePhotoButton.disabled = true;
        (context as CanvasRenderingContext2D).drawImage(video, 0, 0, canvas.width, canvas.height);
        setTimeout(() => {
          canvas.classList.add('hidden');
          video.classList.remove('hidden');
          takePhotoButton.disabled = false;
        }, 1500);
      }
      takePhotoButton.addEventListener('click', () => {
        timercooldowntext.innerText=""+(timer)+"";
        if(timer) {
          timercooldown.classList.remove('hidden');
          timercooldowntext.innerText = '3';
          takePhotoButton.disabled = true;

          setTimeout(() => {
            timercooldowntext.innerText = '2';
            setTimeout(() => {
              timercooldowntext.innerText = '1';
              setTimeout(() => {
                // setTimeout(() => {
                timercooldown.classList.add('hidden');
                takePhotoButton.disabled = false;
                  takeImage();
                  setTimeout(() => {
                    var dataURL = canvas.toDataURL("image/png");
                    var a = document.createElement('a');
                    a.href = dataURL;
                    a.download = 'glacier-camera-image.png';
                    a.click();
                  }, 100);
                // }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }else {
          takeImage();
        }
      });
    }
    (document.getElementById('open-camera-app') as HTMLButtonElement).addEventListener('click', () => {
      startApp();
      (document.querySelector('.camera-app-container') as HTMLDivElement).classList.remove('hidden');
      (document.querySelector('.open-camera-container') as HTMLDivElement).classList.add('hidden');
    });
  }, []);

  function close() {
    const video = document.getElementById('camera-player') as HTMLVideoElement;
    if(video && video.srcObject) {
      (video.srcObject as any).getVideoTracks().forEach((track: any) => track.stop());
    }
    (document.querySelector('.camera-app-container') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.open-camera-container') as HTMLDivElement).classList.remove('hidden');
  }

    return (
      <Window title="Camera" id="camera" taskbarIconID="camera" defaultSize={{width:545,height:450}} onClose={close} color={'gray'} seperateBorder="1px solid #ffffff0a">
        {/* Camera app similar to windows 11 camera app */}
        <div className="camera-app-container hidden">
          <video id="camera-player" autoPlay style={{width: "100%", height: "100%"}}></video>
          <canvas id="camera-canvas" className="hidden" style={{position:'absolute',width: "100%", height: "100%"}}></canvas>
          <div style={{position: "absolute", bottom: "10px",width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Button id="camera-take-photo" icon={<CameraFilled/>}>Take Photo</Button>
            <div style={{width:'1px',background:'#ccc',height:'22px',margin:'0px 10px'}}></div>
            <Checkbox id="camera-timer" label={"Timer"} checked={timer} onChange={function(ev: ChangeEvent<HTMLInputElement>, data: CheckboxOnChangeData){
              setTimer(data.checked);
            }} />
          </div>
          <div id="timer-cooldown" className="hidden" style={{width:'100%',height:'100%',position:'absolute',top:'0',left:'0',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{fontSize:'2rem',fontWeight:'800',padding:'20px',border:'3px solid white',borderRadius:'50%'}} id="timer-cooldown-text">3</div></div>
        </div>
        <div className="open-camera-container" style={{textAlign:'center',height:'100%',marginTop:'20%'}}>
          <div style={{width:"100%"}}><Button id="open-camera-app">Start Camera</Button></div>
          <div style={{width:"100%"}}><b>This will request permission to use your camera.</b></div>
          <div style={{width:"100%"}}><b>To turn off camera use, refresh the page or click "Stop Camera".</b></div>
        </div>
      </Window>
    );
}