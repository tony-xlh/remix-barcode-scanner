import {CameraEnhancer,PlayCallbackInfo} from "dynamsoft-camera-enhancer";
import {BarcodeReader,TextResult}from "dynamsoft-javascript-barcode";
import React from "react";
import { ReactNode } from "react";

export interface ScanRegion {
  left:number;
  top:number;
  right:number;
  bottom:number;
}

export interface ScannerProps{
  isActive?: boolean;
  children?: ReactNode;
  interval?: number;
  license?: string;
  scanRegion?: ScanRegion;
  onInitialized?: (enhancer:CameraEnhancer,reader:BarcodeReader) => void;
  onScanned?: (results:TextResult[]) => void;
  onPlayed?: (playCallbackInfo: PlayCallbackInfo) => void;
  onClosed?: () => void;
}

const BarcodeScanner = (props:ScannerProps): React.ReactElement => {
  const mounted = React.useRef(false);
  const container = React.useRef(null);
  const enhancer = React.useRef<CameraEnhancer>();
  const reader = React.useRef<BarcodeReader>();
  const interval = React.useRef<any>(null);
  const decoding = React.useRef(false);
  React.useEffect(()=>{
    const init = async () => {
      if (BarcodeReader.isWasmLoaded() === false) {
        if (props.license) {
          BarcodeReader.license = props.license;
        }else{
          BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ==";
        }
        BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.6.31/dist/";
      }
      reader.current = await BarcodeReader.createInstance();
      enhancer.current = await CameraEnhancer.createInstance();
      await enhancer.current.setUIElement(container.current!);
      enhancer.current.on("played", (playCallbackInfo: PlayCallbackInfo) => {
        if (props.onPlayed) {
          props.onPlayed(playCallbackInfo);
        }
        startScanning();
      });
      enhancer.current.on("cameraClose", () => {
        if (props.onClosed) {
          props.onClosed();
        }
      });
      enhancer.current.setVideoFit("cover");
      
      if (props.scanRegion) {
        enhancer.current.setScanRegion({
          regionLeft:props.scanRegion.left,
          regionTop:props.scanRegion.top,
          regionRight:props.scanRegion.right,
          regionBottom:props.scanRegion.bottom,
          regionMeasuredByPercentage:true
        });
      }

      if (props.onInitialized) {
        props.onInitialized(enhancer.current,reader.current);
      }
      
      
      toggleCamera();
    }
    if (mounted.current === false) {
      init();
    }
    mounted.current = true;
  },[])

  const toggleCamera = () => {
    if (mounted.current === true) {
      if (props.isActive === true) {
        enhancer.current?.open(true);
      }else{
        stopScanning();
        enhancer.current?.close();
      }
    }
  }

  React.useEffect(()=>{
    toggleCamera();
  },[props.isActive])

  const startScanning = () => {
    stopScanning();
    const decode = async () => {
      if (decoding.current === false && reader.current && enhancer.current) {
        decoding.current = true;
        const results = await reader.current.decode(enhancer.current.getFrame());
        if (props.onScanned) {
          props.onScanned(results);
        }
        decoding.current = false;
      }
    }
    if (props.interval) {
      interval.current = setInterval(decode,props.interval);
    }else{
      interval.current = setInterval(decode,40);
    }
  }

  const stopScanning = () => {
    clearInterval(interval.current);
  }

  

  return (
    <div ref={container} className="dce-container">
      <svg className="dce-bg-loading"
        viewBox="0 0 1792 1792">
        <path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" />
      </svg>
      <svg className="dce-bg-camera"
        viewBox="0 0 2048 1792">
        <path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z" />
      </svg>
      <div className="dce-video-container"></div>
      <select className="dce-sel-camera"></select>
      <select className="dce-sel-resolution"></select>
      {props.children}
    </div>
  )
}

export default BarcodeScanner;
