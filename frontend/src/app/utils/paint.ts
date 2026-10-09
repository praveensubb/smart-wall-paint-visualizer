export function paintWalls(
  canvas: HTMLCanvasElement, 
  img: HTMLImageElement | HTMLCanvasElement, 
  walls: {polygon:{x:number;y:number}[]; hex?:string; colorHex?:string; opacity:number; brightness:number}[]
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  
  const imgW = (img as HTMLImageElement).naturalWidth || img.width;
  const imgH = (img as HTMLImageElement).naturalHeight || img.height;
  canvas.width = imgW;
  canvas.height = imgH;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  const width = canvas.width;
  const height = canvas.height;
  
  let imgData = ctx.getImageData(0, 0, width, height);
  let data = imgData.data;

  // Offscreen canvas for mask
  const offCanvas = document.createElement('canvas');
  offCanvas.width = width;
  offCanvas.height = height;
  const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
  if (!offCtx) return;

  for (const wall of walls) {
    const wallHex = wall.hex || wall.colorHex;
    if (!wallHex || wall.polygon.length < 3) continue;

    // Build mask
    offCtx.clearRect(0, 0, width, height);
    offCtx.beginPath();
    offCtx.moveTo(wall.polygon[0].x, wall.polygon[0].y);
    for (let i = 1; i < wall.polygon.length; i++) {
      offCtx.lineTo(wall.polygon[i].x, wall.polygon[i].y);
    }
    offCtx.closePath();
    offCtx.fillStyle = 'white';
    offCtx.fill();

    const maskData = offCtx.getImageData(0, 0, width, height).data;
    
    // Compute mean luminance
    let totalLum = 0;
    let count = 0;
    for (let i = 0; i < maskData.length; i += 4) {
      if (maskData[i+3] > 0) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLum += lum;
        count++;
      }
    }
    
    if (count === 0) continue;
    const meanLum = totalLum / count;
    
    // Parse target color
    const hexStr = wallHex.replace('#', '');
    const tr = parseInt(hexStr.substring(0, 2), 16);
    const tg = parseInt(hexStr.substring(2, 4), 16);
    const tb = parseInt(hexStr.substring(4, 6), 16);
    
    const opacity = wall.opacity !== undefined ? wall.opacity : 0.8;
    const brightness = wall.brightness !== undefined ? wall.brightness : 1.0;

    for (let i = 0; i < maskData.length; i += 4) {
      const maskAlpha = maskData[i+3] / 255;
      if (maskAlpha > 0) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        
        let k = meanLum > 0 ? (lum / meanLum) * brightness : brightness;
        const t = opacity * maskAlpha;
        
        data[i]   = r * (1 - t) + Math.min(Math.max(tr * k, 0), 255) * t;
        data[i+1] = g * (1 - t) + Math.min(Math.max(tg * k, 0), 255) * t;
        data[i+2] = b * (1 - t) + Math.min(Math.max(tb * k, 0), 255) * t;
      }
    }
    
    // put updated data immediately if subsequent walls overlap (though unlikely)
    ctx.putImageData(imgData, 0, 0);
  }
}
