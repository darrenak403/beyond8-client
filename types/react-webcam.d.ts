declare module 'react-webcam' {
  import * as React from 'react';

  export interface WebcamProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    audio?: boolean;
    screenshotFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
    videoConstraints?: MediaTrackConstraints;
    onUserMedia?: (stream: MediaStream) => void;
    onUserMediaError?: (error: string | DOMException) => void;
    width?: number;
    height?: number;
  }

  export interface WebcamInstance {
    getScreenshot(): string | null;
    getCanvas(): HTMLCanvasElement | null;
  }

  const WebcamComponent: React.ForwardRefExoticComponent<WebcamProps & React.RefAttributes<WebcamInstance>>;
  export default WebcamComponent;
}
