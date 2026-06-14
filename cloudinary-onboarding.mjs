#!/usr/bin/env node

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dd4o9ldx0", // <- replace this
  api_key: "766511744388956", // <- replace this
  api_secret: "SRSffUAPq2OVuwQu-YFXBvicQTU", // <- replace this
});

async function main() {
  const sampleImageUrl =
    "https://res.cloudinary.com/demo/image/upload/sample.jpg";

  const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
    folder: "gift-onboarding",
    public_id: "sample-upload",
    overwrite: true,
    resource_type: "image",
  });

  console.log("Upload secure URL:", uploadResult.secure_url);
  console.log("Upload public ID:", uploadResult.public_id);

  const details = await cloudinary.api.resource(uploadResult.public_id, {
    resource_type: "image",
  });

  console.log("Width:", details.width);
  console.log("Height:", details.height);
  console.log("Format:", details.format);
  console.log("File size (bytes):", details.bytes);

  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    secure: true,
    transformation: [
      {
        fetch_format: "auto", // f_auto lets Cloudinary pick the best image format for the browser.
        quality: "auto", // q_auto lets Cloudinary pick a good compression level automatically.
      },
    ],
  });

  console.log(
    "Done! Click link below to see optimized version of the image. Check the size and the format.",
  );
  console.log("Optimized URL:", transformedUrl);
}

main().catch((error) => {
  console.error("Cloudinary onboarding failed.");
  console.error(error);
  process.exit(1);
});
