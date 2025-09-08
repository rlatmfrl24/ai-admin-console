// This module used to delegate image resizing to a Web Worker. To simplify
// the build and remove the worker file, we now perform resizing on the main
// thread. The public API remains the same for callers.

type GenerateOptions = {
  maxEdge?: number;
  quality?: number; // 0..1 for JPEG quality
};

const createImageBitmapSafe = async (file: File): Promise<ImageBitmap> => {
  try {
    return await createImageBitmap(file);
  } catch {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
      image.src = dataUrl;
    });
    return await createImageBitmap(img);
  }
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob from canvas"));
      },
      "image/jpeg",
      quality
    );
  });
};

export async function generateThumbnailsWithWorker(
  files: File[],
  options?: GenerateOptions
): Promise<Blob[]> {
  if (typeof window === "undefined") return [];

  const maxEdge = options?.maxEdge ?? 640;
  const quality = options?.quality ?? 0.85;

  const results: Blob[] = [];
  for (const file of files) {
    const bitmap = await createImageBitmapSafe(file);
    const { width, height } = bitmap;
    const scale = Math.min(1, maxEdge / Math.max(width, height));
    const targetWidth = Math.round(width * scale);
    const targetHeight = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new Error("2D context not available");
    }
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    const blob = await canvasToBlob(canvas, quality);
    results.push(blob);
    bitmap.close();
  }
  return results;
}
