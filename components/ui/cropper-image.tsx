"use client";

import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";

// Tạo một đối tượng hình ảnh từ URL
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Cần thiết để tránh lỗi cross-origin
    image.src = url;
  });

export const colors = [
  "foreground",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
] as const;

// Cắt ảnh dựa trên vùng đã chọn và trả về dưới dạng File
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Không thể lấy context của canvas");
  }

  // Đặt kích thước canvas bằng với vùng ảnh được cắt
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Vẽ ảnh đã cắt lên canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Trả về dưới dạng đối tượng File
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

interface AvatarCropperDialogProps {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropped: (file: File) => void;
  aspect?: number;
  cropShape?: "rect" | "round";
}

export function AvatarCropperDialog({
  open,
  imageSrc,
  onClose,
  onCropped,
  aspect = 1,
  cropShape = "round",
}: AvatarCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (file) {
        onCropped(file);
      }
      onClose();
    } catch (error) {
      console.error("Error cropping image", error);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, croppedAreaPixels, onCropped, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cắt ảnh đại diện</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-80 bg-black/80 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>
        <div className="flex items-center gap-3 pt-3">
          <span className="text-xs text-muted-foreground">Thu nhỏ / phóng to</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing || !croppedAreaPixels}>
            {isProcessing ? "Đang xử lý..." : "Lưu ảnh"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}