'use client';
import dynamic from 'next/dynamic';

const DotLottiePlayer = dynamic(
  async () => (await import('@dotlottie/react-player')).DotLottiePlayer,
  { ssr: false }
);

const LottiePlayer = ({ src, size }: { src: string, size: string }) => {
    const sizeMap: { [key: string]: number } = {
        s: 150,
        m: 300,
        l: 450,
    };
    const dimension = sizeMap[size] || sizeMap['m'];
    if (typeof window === 'undefined') {
        return null;
    }
    if (dimension) {
        return <DotLottiePlayer src={src} autoplay loop style={{ width: dimension, height: dimension }} />;
    }   
  return <DotLottiePlayer src={src} autoplay loop style={{ width: '100%', height: '100%' }} />;
};

export default LottiePlayer;