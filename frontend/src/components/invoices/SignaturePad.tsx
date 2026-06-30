'use client';

import { useRef, useState, useEffect } from 'react';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onChange: (signatureDataUrl: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

export default function SignaturePad({ onChange, defaultValue = '', placeholder = 'Sign here' }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw initial signature if provided
    if (defaultValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = defaultValue;
      setHasSigned(true);
    } else {
      clearCanvas();
    }
  }, [defaultValue]);

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check for touch event
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    
    // Mouse event
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: any) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Configure stroke styles
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FFFFFF'; // White ink for dark theme

    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw placeholder helper text inside the canvas if empty
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(placeholder, canvas.width / 2, canvas.height / 2);

    setHasSigned(false);
    onChange('');
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;

    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  };

  // Prevent default drawing behaviors on mobile scroll
  const handleTouchStart = (e: any) => {
    // If drawing is not set, clean canvas helper text on first touch
    if (!hasSigned) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    startDrawing(e);
  };

  const handleMouseDown = (e: any) => {
    if (!hasSigned) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    startDrawing(e);
  };

  return (
    <div className="space-y-2">
      <div className="relative border border-white/10 bg-[#0B0F19] rounded-xl overflow-hidden h-36 w-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={clearCanvas}
          className="h-8 border border-gray-700 bg-transparent text-gray-400 hover:text-white px-2.5 rounded-lg flex items-center gap-1 text-xs cursor-pointer transition-colors"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
        <button
          type="button"
          onClick={saveSignature}
          disabled={!hasSigned}
          className="h-8 bg-accent-primary hover:bg-accent-hover text-white px-2.5 rounded-lg flex items-center gap-1 text-xs disabled:opacity-50 cursor-pointer transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          Apply
        </button>
      </div>
    </div>
  );
}
