#!/usr/bin/env bun

/**
 * 🎯 Kollect-It Master Test Runner
 * Orchestrates all testing suites and generates comprehensive reports
 * Run with: bun run scripts/run-all-tests.ts
 */

import { config } from "dotenv";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

// Load environment variables
config({ path: ".env.local" });

interface TestSuite {
  name: string;
  script: string;
  description: string;
  required: boolean;
  timeout: number; // in seconds
}

interface TestResult {
  suite: string;
  status: "pass" | "fail" | "error" | "timeout";
  duration: number;
  output: string;
  error?: string;
}

class MasterTestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  private testSuites: TestSuite[] = [
    {
      name: "Production Verification",
      script: "scripts/verify-production.ts",
      description: "Tests all critical services and configurations",
      required: true,
      timeout: 60,
    },
    {
      name: "Vercel Deployment",
      script: "scripts/test-vercel-deployment.ts",
      description: "Tests deployment-specific functionality",
      required: false,
      timeout: 30,
    },
    {
      name: "Database Tests",
      script: "scripts/test-db-connection.ts",
      description: "Tests database connectivity and operations",
      required: true,
      timeout: 30,
    },
    {
      name: "Service Tests",
      script: "scripts/test-services.ts",
      description: "Tests external service integrations",
      required: true,
      timeout: 45,
    },
    {
      name: "Environment Tests",
      script: "scripts/test-env-complete.ts",
      description: "Tests environment variable configuration",
      required: true,
      timeout: 15,
    },
    {
      name: "Health Check",
      script: "scripts/health-check.ts",
      description: "Comprehensive health check",
      required: false,
      timeout: 30,
    },
  ];

  async runAllTests(): Promise<void> {
    console.log("🎯 Kollect-It Master Test Suite");
    console.log("===============================\n");

    this.startTime = Date.now();

    // Pre-flight checks
    await this.runPreflightChecks();

    // Run test suites
    for (const suite of this.testSuites) {
      await this.runTestSuite(suite);
    }

    // Generate comprehensive report
    this.generateComprehensiveReport();
  }

  private async runPreflightChecks(): Promise<void> {
    console.log("🔍 Running Pre-flight Checks...");

    const checks = [
      {
        name: "Node.js Version",
        check: () => {
          const version = process.version;
          const major = parseInt(version.slice(1).split('.')[0]);
          return major >= 18 ? { pass: true, message: `Node.js ${version}` } :
                 { pass: false, message: `Node.js ${version} (requires 18+)` };
        }
      },
      {
        name: "Package Dependencies",
        check: () => {
          const hasPackageJson = existsSync("package.json");
          const hasLockFile = existsSync("package-lock.json") || existsSync("bun.lockb");
          return hasPackageJson && hasLockFile ?
                 { pass: true, message: "Dependencies configured" } :
                 { pass: false, message: "Missing package.json or lock file" };
        }
      },
      {
        name: "Environment File",
        check: () => {
          const hasEnvLocal = existsSync(".env.local");
          const hasEnv = existsSync(".env");
          return hasEnvLocal || hasEnv ?
                 { pass: true, message: "Environment file found" } :
                 { pass: false, message: "No environment file found" };
        }
      },
      {
        name: "Scripts Directory",
        check: () => {
          return existsSync("scripts") ?
                 { pass: true, message: "Scripts directory exists" } :
                 { pass: false, message: "Scripts directory missing" };
        }
      }
    ];

    let allPassed = true;
    for (const check of checks) {
      const result = check.check();
      const symbol = result.pass ? "✅" : "❌";
      console.log(`${symbol} ${check.name}: ${result.message}`);
      if (!result.pass) allPassed = false;
    }

    if (!allPassed) {
      console.log("\n⚠️  Pre-flight checks failed. Some tests may not run properly.");
    }

    console.log("");
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(`🧪 Running ${suite.name}...`);

    const scriptPath = join(process.cwd(), suite.script);

    if (!existsSync(scriptPath)) {
      if (suite.required) {
        this.results.push({
          suite: suite.name,
          status: "error",
          duration: 0,
          output: "",
          error: `Required script not found: ${suite.script}`,
        });
        console.log(`❌ ${suite.name}: Script not found`);
      } else {
        this.results.push({
          suite: suite.name,
          status: "error",
          duration: 0,
          output: "",
          error: `Optional script not found: ${suite.script}`,
        });
        console.log(`⏭️  ${suite.name}: Script not found (optional)`);
      }
      return;
    }

    const startTime = Date.now();

    try {
      // Run the script with timeout
      const result = await this.runScriptWithTimeout(scriptPath, suite.timeout);

      const duration = Date.now() - startTime;

      if (result.timedOut) {
        this.results.push({
          suite: suite.name,
          status: "timeout",
          duration,
          output: result.output,
          error: `Test timed out after ${suite.timeout}s`,
        });
        console.log(`⏰ ${suite.name}: Timed out (${duration}ms)`);
      } else if (result.code !== 0) {
        this.results.push({
          suite: suite.name,
          status: "fail",
          duration,
          output: result.output,
          error: `Exit code: ${result.code}`,
        });
        console.log(`❌ ${suite.name}: Failed (${duration}ms)`);
      } else {
        this.results.push({
          suite: suite.name,
          status: "pass",
          duration,
          output: result.output,
        });
        console.log(`✅ ${suite.name}: Passed (${duration}ms)`);
      }

    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.results.push({
        suite: suite.name,
        status: "error",
        duration,
        output: "",
        error: error.message,
      });
      console.log(`💥 ${suite.name}: Error (${duration}ms)`);
    }
  }

  private async runScriptWithTimeout(scriptPath: string, timeoutSeconds: number): Promise<{
    code: number | null;
    output: string;
    timedOut: boolean;
  }> {
    return new Promise((resolve) => {
      let output = "";
      let timedOut = false;
      let child: any;

      const timeout = setTimeout(() => {
        timedOut = true;
        if (process.platform === "win32" && child && child.pid) {
          try {
            execSync(`taskkill /pid ${child.pid} /t /f`, { stdio: "ignore" });
          } catch (e) {
            // Ignore kill errors
          }
        }
        resolve({ code: null, output, timedOut: true });
      }, timeoutSeconds * 1000);

      try {
        const result = execSync(`bun run ${scriptPath}`, {
          encoding: "utf8",
          stdio: "pipe",
          timeout: timeoutSeconds * 1000,
        });

        clearTimeout(timeout);
        output = result.toString();
        resolve({ code: 0, output, timedOut: false });
      } catch (error: any) {
        clearTimeout(timeout);
        output = error.stdout || error.stderr || "";
        resolve({ code: error.status || 1, output, timedOut });
      }
    });
  }

  private generateComprehensiveReport(): void {
    const totalTime = Date.now() - this.startTime;

    console.log("\n📊 COMPREHENSIVE TEST REPORT");
    console.log("============================");

    const statusSymbols = {
      pass: "✅",
      fail: "❌",
      error: "💥",
      timeout: "⏰",
    };

    let passed = 0;
    let failed = 0;
    let errors = 0;
    let timeouts = 0;

    console.log("\nTest Results:");
    for (const result of this.results) {
      const symbol = statusSymbols[result.status];
      console.log(`${symbol} ${result.suite}: ${result.duration}ms`);

      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }

      switch (result.status) {
        case "pass": passed++; break;
        case "fail": failed++; break;
        case "error": errors++; break;
        case "timeout": timeouts++; break;
      }
    }

    console.log("\n🎯 TEST SUITE SUMMARY");
    console.log("====================");
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Errors: ${errors}`);
    console.log(`Timeouts: ${timeouts}`);
    console.log(`Total Time: ${Math.round(totalTime / 1000)}s`);

    const successRate = Math.round((passed / this.results.length) * 100);
    console.log(`Success Rate: ${successRate}%`);

    console.log("\n🚀 DEPLOYMENT RECOMMENDATION");
    console.log("============================");

    if (failed === 0 && errors === 0 && timeouts === 0) {
      console.log("✅ EXCELLENT - All tests passed!");
      console.log("🎉 Ready for production deployment");
    } else if (failed === 0 && errors <= 1) {
      console.log("⚠️  GOOD - Minor issues detected");
      console.log("🔧 Fix errors before deployment");
    } else {
      console.log("❌ NEEDS ATTENTION - Critical failures");
      console.log("🛠️  Fix all issues before deployment");
    }

    console.log("\n💡 Next Steps:");
    if (failed > 0 || errors > 0) {
      console.log("   - Review failed tests and fix issues");
      console.log("   - Check service configurations");
      console.log("   - Verify environment variables");
      console.log("   - Run individual test suites for details");
    } else {
      console.log("   - Run production verification: bun run scripts/verify-production.ts");
      console.log("   - Deploy to staging environment");
      console.log("   - Run deployment tests: bun run scripts/test-vercel-deployment.ts");
      console.log("   - Complete final production checklist");
    }
  }
}

// Run the master test suite
async function main() {
  const runner = new MasterTestRunner();
  await runner.runAllTests();
}

if (import.meta.main) {
  main().catch(console.error);
}

export { MasterTestRunner };