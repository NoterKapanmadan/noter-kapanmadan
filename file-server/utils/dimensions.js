import sharp from 'sharp';

export function getImageDimensionsSync(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  
  const buffer = Buffer.from(base64Data, 'base64');
  
  const metadata = sharp(buffer).metadata();
  
  return metadata.then(({ width, height }) => {
    return { width, height };
  });
}
