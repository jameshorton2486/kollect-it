import http from 'http';

const BASE_URL = 'http://localhost:3000';

const routesToCheck = [
  // Header
  '/',
  '/shop',
  '/categories',
  '/how-it-works',
  '/about',
  '/contact',
  '/sell',
  
  // Footer Shop
  '/category/rare-books',
  '/category/fine-art',
  '/category/militaria',
  '/category/collectibles',
  
  // Footer Company
  '/authentication',
  
  // Footer Support
  '/faq',
  '/shipping-returns',
  '/payment',
  '/privacy',
  '/terms',
  '/cookies'
];

async function checkRoute(route: string): Promise<boolean> {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${route}`, (res) => {
      const success = res.statusCode === 200;
      if (success) {
        console.log(`✅ ${route} - 200 OK`);
      } else {
        console.error(`❌ ${route} - ${res.statusCode}`);
      }
      resolve(success);
    }).on('error', (e) => {
      console.error(`❌ ${route} - Error: ${e.message}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('Starting navigation verification...');
  
  // Wait for server to be ready (simple retry logic)
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(BASE_URL, (res) => {
          if (res.statusCode === 200) resolve(true);
          else reject();
        });
        req.on('error', reject);
      });
      serverReady = true;
      break;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      process.stdout.write('.');
    }
  }
  
  if (!serverReady) {
    console.error('\nServer not ready after 30 seconds. Please ensure "npm run dev" is running.');
    process.exit(1);
  }
  
  console.log('\nServer is ready. Checking routes...');
  
  let allPassed = true;
  for (const route of routesToCheck) {
    const passed = await checkRoute(route);
    if (!passed) allPassed = false;
  }
  
  if (allPassed) {
    console.log('\n🎉 All routes verified successfully!');
    process.exit(0);
  } else {
    console.error('\n⚠️ Some routes failed verification.');
    process.exit(1);
  }
}

main();
