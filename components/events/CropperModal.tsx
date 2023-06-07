import { FC } from 'react';
import { IconButton, Modal } from '@mui/material';
import React, { useState, useRef } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from '@/utils/useDebounceEffect';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Props = {
  openModal: boolean;
  handleCloseModal: () => void;
  onFileChange: (file: Blob) => void;
  imgSrc: string;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const CropperModal: FC<Props> = ({
  openModal,
  handleCloseModal,
  onFileChange,
  imgSrc,
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const blobUrlRef = useRef('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  // const [aspect, setAspect] = useState<number | undefined>(16 / 7);

  const aspect = 16 / 7;

  const applyCrop = () => {
    console.log('apply');
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  };
  //  console.log('cropper comp src prop:', imgSrc);
  const TO_RADIANS = Math.PI / 180;

  function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0
  ) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    // const rotateRads = rotate * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;
    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    // ctx.rotate(rotateRads);
    // ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      onFileChange(blob);
      console.log('emit crop to parent');
    });
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  return (
    <Modal
      open={openModal}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
        onClick: (event) => {
          handleCloseModal();
        },
      }}
      sx={{ zIndex: 100 }}
      className="p-3 md:p-5 flex items-center"
    >
      <>
        <div className="modal m-auto bg-white relative p-2 rounded w-fit min-w-[300px] max-h-[80vh]">
          <h3 className="mt-2 text-center text-2xl">Crop image</h3>
          <div className="modal">
            <div className="image-crop flex flex-col justify-center">
              {imgSrc && (
                <div className="crop-container m-auto flex flex-col">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                  >
                    {/* <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              //   style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={onImageLoad}
            /> */}
                    <Image
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      width="300"
                      height="150"
                    />
                  </ReactCrop>

                  {!!completedCrop && (
                    <canvas
                      ref={previewCanvasRef}
                      className="hidden"
                      style={{
                        border: '1px solid black',
                        objectFit: 'contain',
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  )}
                  <button
                    className="m-auto w-fit flex p-2 mt-2 rounded border-2 border-teal-500"
                    onClick={applyCrop}
                    type="button"
                  >
                    <CheckCircleIcon className="text-emerald-400 mr-2" /> apply
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};
