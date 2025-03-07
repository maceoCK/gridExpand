/**
 * Compresses an image to reduce file size for storage
 * @param imageData Base64 string of the image
 * @param maxWidth Maximum width to resize to
 * @param quality Quality level (0-1)
 * @returns Promise resolving to compressed image data URL
 */
export const compressImage = (
  imageData: string, 
  maxWidth = 1200, 
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed image data (WebP format is more efficient)
        const compressedData = canvas.toDataURL('image/webp', quality);
        resolve(compressedData);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = imageData;
    } catch (err) {
      reject(err);
    }
  });
}; 