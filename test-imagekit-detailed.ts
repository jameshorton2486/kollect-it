import ImageKit from 'imagekit';

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

console.log('🔍 ImageKit Detailed Test\n');
console.log('Configuration:');
console.log(`  Public Key: ${process.env.IMAGEKIT_PUBLIC_KEY?.slice(0, 20)}...`);
console.log(`  URL Endpoint: ${process.env.IMAGEKIT_URL_ENDPOINT}\n`);

try {
  console.log('Attempting to list files...');
  const response = await imageKit.listFiles({
    path: '/',
    limit: 5
  });
  console.log('✅ Success! Files found:', response.length);
  console.log(JSON.stringify(response, null, 2));
} catch (error: any) {
  console.error('❌ Error:', error.message);
  console.error('Full Error:', JSON.stringify(error, null, 2));
  if (error.response) {
    console.error('Response Status:', error.response.status);
    console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
  }
}
