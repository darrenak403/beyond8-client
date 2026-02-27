declare module "react-easy-crop" {
  import * as React from "react";

  export interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface Crop {
    x: number;
    y: number;
  }

  export interface CropperProps {
    image: string;
    crop: Crop;
    zoom: number;
    aspect: number;
    cropShape?: "rect" | "round";
    showGrid?: boolean;
    onCropChange: (crop: Crop) => void;
    onZoomChange: (zoom: number) => void;
    onCropComplete?: (croppedArea: Area, croppedAreaPixels: Area) => void;
  }

  const Cropper: React.FC<CropperProps>;

  export default Cropper;
}

