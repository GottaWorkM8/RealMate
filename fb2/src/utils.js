import Compressor from "compressorjs";

export const compressImage = (file, maxSize = 256) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result.toString();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        // Determine the smaller dimension for cropping
        const minSize = Math.min(width, height);

        // Calculate the cropping offsets
        const xOffset = (width - minSize) / 2;
        const yOffset = (height - minSize) / 2;

        // Set canvas dimensions to the desired maxSize
        canvas.width = maxSize;
        canvas.height = maxSize;

        // Perform the cropping
        ctx.drawImage(
          img,
          xOffset,
          yOffset,
          minSize,
          minSize,
          0,
          0,
          maxSize,
          maxSize
        );

        canvas.toBlob((blob) => {
          new Compressor(blob, {
            quality: 1, // Set to 1 for maximum quality
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        }, "image/*");
      };
    };

    reader.readAsDataURL(file);
  });
};
