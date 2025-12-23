#!/usr/bin/env bun

import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_1MwR2t3I95qAJXc72h1DzbbLLZU=",
  privateKey: "private_C5l6XYj7keSe1uBHlCedLI2/F9s=",
  urlEndpoint: "https://ik.imagekit.io/kollectit",
});

console.log("🧪 Testing ImageKit Credentials...\n");

try {
  // Try a simple operation to test authentication
  const result = await imagekit.listFiles({
    limit: 1,
  });
  console.log("✅ ImageKit Authentication Successful!");
  console.log("Files found:", result.length);
} catch (error: any) {
  console.log("❌ ImageKit Authentication Failed");
  console.log("Error Message:", error.message);
  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }
}
