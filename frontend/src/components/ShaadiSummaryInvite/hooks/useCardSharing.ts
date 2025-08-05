import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import type { Shaadi } from '../types';

export const useCardSharing = (shaadi: Shaadi) => {
  const [sharingCard, setSharingCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareCard = async () => {
    if (!cardRef.current) return;
    
    setSharingCard(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        allowTaint: false,
        useCORS: true,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          const images = clonedDoc.querySelectorAll('img');
          images.forEach(img => {
            img.crossOrigin = 'anonymous';
          });
        }
      });
      
      await shareCanvas(canvas);
    } catch (err) {
      console.error('Failed to share card:', err);
      throw new Error('Failed to share invitation card');
    } finally {
      setSharingCard(false);
    }
  };

  const shareCanvas = async (canvas: HTMLCanvasElement) => {
    return new Promise<void>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image'));
          return;
        }
        
        const imageFile = new File([blob], `${shaadi.name}-invitation.png`, { type: 'image/png' });
        
        try {
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
            await navigator.share({
              title: `${shaadi.name} - Wedding Invitation`,
              text: `You're invited to ${shaadi.brideName} & ${shaadi.groomName}'s wedding!`,
              files: [imageFile],
            });
            resolve();
          } else {
            fallbackShare(canvas);
            resolve();
          }
        } catch (err) {
          console.log('Native share failed, trying fallback:', err);
          fallbackShare(canvas);
          resolve();
        }
      }, 'image/png');
    });
  };

  const fallbackShare = (canvas: HTMLCanvasElement) => {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${shaadi.name}-invitation.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Fallback share failed:', err);
      throw new Error('Failed to share invitation card');
    }
  };

  return {
    sharingCard,
    cardRef,
    shareCard,
  };
}; 