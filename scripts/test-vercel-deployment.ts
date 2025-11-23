#!/usr/bin/env bun
/**
 * VERCEL DEPLOYMENT TESTER
 * 
 * This script tests your live Vercel deployment by making HTTP requests
 * to verify that all endpoints are functioning correctly.
 * 
 * Usage:
 *   bun run scripts/test-vercel-deployment.ts https://your-app.vercel.app
 *   
 * Or set VERCEL_URL environment variable:
 *   VERCEL_URL=https://your-app.vercel.app bun run scripts/test-vercel-deployment.ts
 */

interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'warn';
  statusCode?: number;
  responseTime?: number;
  message: string;
}

const results: TestResult[] = [];
let totalPassed = 0;
let totalFailed = 0;
let totalWarnings = 0;

async function testEndpoint(
  baseUrl: string,
  path: string,
  expectedStatus: number = 200,
  options: RequestInit = {}
): Promise<TestResult> {
  const url = `${baseUrl}${path}`;
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.status === expectedStatus) {
      return {
        endpoint: path,
        status: 'pass',
        statusCode: response.status,
        responseTime,
        message: `OK (${responseTime}ms)`,
      };
    } else if (response.status >= 200 && response.status < 400) {
      return {
        endpoint: path,
        status: 'warn',
        statusCode: response.status,
        responseTime,
        message: `Unexpected status ${response.status}, expected ${expectedStatus} (${responseTime}ms)`,
      };
    } else {
      return {
        endpoint: path,
        status: 'fail',
        statusCode: response.status,
        responseTime,
        message: `Failed with status ${response.status} (${responseTime}ms)`,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    return {
      endpoint: path,
      status: 'fail',
      responseTime,
      message: `Request failed: ${errorMsg}`,
    };
  }
}

async function testHealthEndpoints(baseUrl: string) {
  console.log('\n1️⃣  Testing Health & Diagnostic Endpoints\n');
  console.log('='.repeat(80));
  
  const endpoints = [
    { path: '/api/health', description: 'Health check' },
    { path: '/api/diagnostics/env', description: 'Environment diagnostics' },
  ];

  for (const { path, description } of endpoints) {
    console.log(`  Testing: ${description} (${path})`);
    const result = await testEndpoint(baseUrl, path);
    
    if (result.status === 'pass') {
      console.log(`    ✅ ${result.message}`);
      totalPassed++;
    } else if (result.status === 'warn') {
      console.log(`    ⚠️  ${result.message}`);
      totalWarnings++;
    } else {
      console.log(`    ❌ ${result.message}`);
      totalFailed++;
    }
    
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testPublicPages(baseUrl: string) {
  console.log('2️⃣  Testing Public Pages\n');
  console.log('='.repeat(80));
  
  const pages = [
    { path: '/', description: 'Homepage' },
    { path: '/about', description: 'About page' },
    { path: '/shop', description: 'Shop page' },
    { path: '/categories', description: 'Categories page' },
    { path: '/how-it-works', description: 'How it works' },
    { path: '/contact', description: 'Contact page' },
    { path: '/faq', description: 'FAQ page' },
    { path: '/privacy', description: 'Privacy policy' },
    { path: '/terms', description: 'Terms of service' },
  ];

  for (const { path, description } of pages) {
    console.log(`  Testing: ${description} (${path})`);
    const result = await testEndpoint(baseUrl, path);
    
    if (result.status === 'pass') {
      console.log(`    ✅ ${result.message}`);
      totalPassed++;
    } else if (result.status === 'warn') {
      console.log(`    ⚠️  ${result.message}`);
      totalWarnings++;
    } else {
      console.log(`    ❌ ${result.message}`);
      totalFailed++;
    }
    
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testAuthEndpoints(baseUrl: string) {
  console.log('3️⃣  Testing Authentication Endpoints\n');
  console.log('='.repeat(80));
  
  const endpoints = [
    { path: '/login', description: 'Login page', expectedStatus: 200 },
    { path: '/register', description: 'Register page', expectedStatus: 200 },
    { path: '/api/auth/csrf', description: 'CSRF token', expectedStatus: 200 },
  ];

  for (const { path, description, expectedStatus } of endpoints) {
    console.log(`  Testing: ${description} (${path})`);
    const result = await testEndpoint(baseUrl, path, expectedStatus);
    
    if (result.status === 'pass') {
      console.log(`    ✅ ${result.message}`);
      totalPassed++;
    } else if (result.status === 'warn') {
      console.log(`    ⚠️  ${result.message}`);
      totalWarnings++;
    } else {
      console.log(`    ❌ ${result.message}`);
      totalFailed++;
    }
    
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testAPIEndpoints(baseUrl: string) {
  console.log('4️⃣  Testing Public API Endpoints\n');
  console.log('='.repeat(80));
  
  const endpoints = [
    { path: '/api/products', description: 'Products API' },
    { path: '/api/categories', description: 'Categories API' },
    { path: '/api/search?q=test', description: 'Search API' },
  ];

  for (const { path, description } of endpoints) {
    console.log(`  Testing: ${description} (${path})`);
    const result = await testEndpoint(baseUrl, path);
    
    if (result.status === 'pass') {
      console.log(`    ✅ ${result.message}`);
      totalPassed++;
    } else if (result.status === 'warn') {
      console.log(`    ⚠️  ${result.message}`);
      totalWarnings++;
    } else {
      console.log(`    ❌ ${result.message}`);
      totalFailed++;
    }
    
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testStaticAssets(baseUrl: string) {
  console.log('5️⃣  Testing Static Assets\n');
  console.log('='.repeat(80));
  
  const assets = [
    { path: '/favicon.svg', description: 'Favicon' },
    { path: '/manifest.json', description: 'PWA Manifest' },
    { path: '/robots.txt', description: 'Robots.txt' },
  ];

  for (const { path, description } of assets) {
    console.log(`  Testing: ${description} (${path})`);
    const result = await testEndpoint(baseUrl, path);
    
    if (result.status === 'pass') {
      console.log(`    ✅ ${result.message}`);
      totalPassed++;
    } else if (result.status === 'warn') {
      console.log(`    ⚠️  ${result.message}`);
      totalWarnings++;
    } else {
      console.log(`    ❌ ${result.message}`);
      totalFailed++;
    }
    
    results.push(result);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testPerformance(baseUrl: string) {
  console.log('6️⃣  Performance Analysis\n');
  console.log('='.repeat(80));
  
  // Test homepage load time
  console.log('  Testing homepage performance...');
  const startTime = Date.now();
  
  try {
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(30000),
    });
    const html = await response.text();
    const loadTime = Date.now() - startTime;
    
    console.log(`  ✅ Homepage loaded in ${loadTime}ms`);
    
    // Performance assessment
    if (loadTime < 1000) {
      console.log(`  🚀 EXCELLENT: Load time under 1 second`);
    } else if (loadTime < 3000) {
      console.log(`  ✅ GOOD: Load time under 3 seconds`);
    } else if (loadTime < 5000) {
      console.log(`  ⚠️  SLOW: Load time over 3 seconds`);
    } else {
      console.log(`  ❌ VERY SLOW: Load time over 5 seconds`);
    }
    
    // Check HTML size
    const htmlSize = new Blob([html]).size;
    const htmlSizeKB = (htmlSize / 1024).toFixed(2);
    console.log(`  📦 HTML size: ${htmlSizeKB} KB`);
    
    if (htmlSize < 100 * 1024) {
      console.log(`  ✅ HTML size is optimal`);
    } else {
      console.log(`  ⚠️  HTML size is large (${htmlSizeKB} KB)`);
    }
    
  } catch (error) {
    console.log(`  ❌ Performance test failed: ${error}`);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

async function testSecurityHeaders(baseUrl: string) {
  console.log('7️⃣  Security Headers Analysis\n');
  console.log('='.repeat(80));
  
  try {
    const response = await fetch(baseUrl);
    const headers = response.headers;
    
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'referrer-policy',
      'strict-transport-security',
    ];
    
    console.log('  Checking security headers...\n');
    
    for (const header of securityHeaders) {
      const value = headers.get(header);
      if (value) {
        console.log(`  ✅ ${header}: ${value}`);
      } else {
        console.log(`  ⚠️  ${header}: Not set`);
        totalWarnings++;
      }
    }
    
  } catch (error) {
    console.log(`  ❌ Failed to check security headers: ${error}`);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

function generateSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 DEPLOYMENT TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  // Calculate average response time
  const responseTimes = results
    .filter(r => r.responseTime !== undefined)
    .map(r => r.responseTime!);
  
  if (responseTimes.length > 0) {
    const avgResponseTime = Math.round(
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    );
    const minResponseTime = Math.min(...responseTimes);
    const maxResponseTime = Math.max(...responseTimes);
    
    console.log('Performance Metrics:');
    console.log(`  Average response time: ${avgResponseTime}ms`);
    console.log(`  Fastest response: ${minResponseTime}ms`);
    console.log(`  Slowest response: ${maxResponseTime}ms`);
    console.log('');
  }

  console.log('Test Results:');
  console.log(`  ✅ Passed:   ${totalPassed}`);
  console.log(`  ❌ Failed:   ${totalFailed}`);
  console.log(`  ⚠️  Warnings: ${totalWarnings}`);
  console.log('');

  // Final assessment
  console.log('='.repeat(80));
  console.log('🎯 DEPLOYMENT STATUS');
  console.log('='.repeat(80) + '\n');

  if (totalFailed === 0 && totalWarnings === 0) {
    console.log('✅ EXCELLENT: All endpoints operational!');
  } else if (totalFailed === 0) {
    console.log('✅ GOOD: Core functionality working. Review warnings.');
  } else if (totalFailed <= 3) {
    console.log('⚠️  ISSUES DETECTED: Some endpoints failing. Investigate errors.');
  } else {
    console.log('❌ CRITICAL: Multiple failures detected. Deployment needs attention.');
  }

  console.log('\n' + '='.repeat(80) + '\n');

  // Failed endpoints detail
  if (totalFailed > 0) {
    console.log('❌ Failed Endpoints:\n');
    results
      .filter(r => r.status === 'fail')
      .forEach(r => {
        console.log(`  • ${r.endpoint}: ${r.message}`);
      });
    console.log('');
  }
}

async function main() {
  // Use provided URL, VERCEL_URL env var, NEXTAUTH_URL env var, or default to localhost
  const baseUrl = process.argv[2] ||
                  process.env.VERCEL_URL ||
                  process.env.NEXTAUTH_URL ||
                  'http://localhost:3000';

  console.log(`🔗 Testing deployment at: ${baseUrl}`);
  if (baseUrl === 'http://localhost:3000') {
    console.log('ℹ️  Using localhost - make sure your dev server is running\n');
  }

  // Ensure URL doesn't end with slash
  const cleanUrl = baseUrl.replace(/\/$/, '');

  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'VERCEL DEPLOYMENT TESTER' + ' '.repeat(34) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\n');
  console.log(`Testing deployment: ${cleanUrl}\n`);

  try {
    await testHealthEndpoints(cleanUrl);
    await testPublicPages(cleanUrl);
    await testAuthEndpoints(cleanUrl);
    await testAPIEndpoints(cleanUrl);
    await testStaticAssets(cleanUrl);
    await testPerformance(cleanUrl);
    await testSecurityHeaders(cleanUrl);
    generateSummary();

    // Exit code based on results
    if (totalFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Fatal error during testing:', error);
    process.exit(1);
  }
}

main();
