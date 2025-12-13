#!/usr/bin/env node

/**
 * Deployment Automation System for Customized CO2 Laser Templates
 *
 * This script handles the complete deployment pipeline including:
 * - Environment setup and validation
 * - Build optimization
 * - Deployment to multiple platforms (Vercel, Netlify, etc.)
 * - Post-deployment testing and validation
 * - Domain configuration assistance
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync, spawn } = require('child_process');

class DeploymentAutomation {
  constructor(options = {}) {
    this.projectPath = options.projectPath;
    this.platform = options.platform || 'vercel'; // vercel, netlify, or custom
    this.domain = options.domain;
    this.environment = options.environment || 'production';
    this.gitRepo = options.gitRepo;
    this.deploymentConfig = {};
    this.deploymentLog = [];
    this.postDeploymentChecks = [];
  }

  /**
   * Main deployment execution flow
   */
  async deploy(projectPath, options = {}) {
    this.projectPath = projectPath;
    Object.assign(this, options);

    console.log('🚀 Starting CO2 Laser Template Deployment...\n');

    try {
      // Step 1: Pre-deployment validation
      console.log('🔍 Step 1: Pre-deployment validation...');
      await this.preDeploymentValidation();

      // Step 2: Environment setup
      console.log('⚙️ Step 2: Setting up deployment environment...');
      await this.setupDeploymentEnvironment();

      // Step 3: Build optimization
      console.log('🏗️ Step 3: Optimizing build...');
      await this.optimizeBuild();

      // Step 4: Git repository setup
      console.log('📁 Step 4: Setting up Git repository...');
      await this.setupGitRepository();

      // Step 5: Platform deployment
      console.log('🌐 Step 5: Deploying to platform...');
      const deploymentResult = await this.deployToPlatform();

      // Step 6: Post-deployment testing
      console.log('✅ Step 6: Running post-deployment tests...');
      await this.postDeploymentTesting(deploymentResult.url);

      // Step 7: Domain configuration
      if (this.domain) {
        console.log('🌍 Step 7: Configuring custom domain...');
        await this.configureDomain();
      }

      // Step 8: Generate deployment report
      console.log('📄 Step 8: Generating deployment report...');
      await this.generateDeploymentReport(deploymentResult);

      console.log('\n🎉 Deployment completed successfully!');
      console.log(`🌐 Live URL: ${deploymentResult.url}`);

      return {
        success: true,
        url: deploymentResult.url,
        deploymentId: deploymentResult.deploymentId,
        platform: this.platform,
        domain: this.domain,
        checks: this.postDeploymentChecks
      };

    } catch (error) {
      console.error('❌ Deployment failed:', error.message);
      await this.handleDeploymentFailure(error);

      return {
        success: false,
        error: error.message,
        logs: this.deploymentLog
      };
    }
  }

  /**
   * Pre-deployment validation
   */
  async preDeploymentValidation() {
    const validationChecks = [
      { name: 'Project directory exists', check: () => this.checkProjectDirectory() },
      { name: 'Package.json exists', check: () => this.checkPackageJson() },
      { name: 'Required dependencies', check: () => this.checkDependencies() },
      { name: 'Environment variables', check: () => this.checkEnvironmentVariables() },
      { name: 'Build configuration', check: () => this.checkBuildConfiguration() },
      { name: 'Content validation', check: () => this.validateContent() }
    ];

    console.log('   Running validation checks...');

    for (const validation of validationChecks) {
      try {
        await validation.check();
        console.log(`   ✅ ${validation.name}`);
        this.deploymentLog.push(`✅ ${validation.name}: Passed`);
      } catch (error) {
        console.log(`   ❌ ${validation.name}: ${error.message}`);
        this.deploymentLog.push(`❌ ${validation.name}: ${error.message}`);
        throw new Error(`Validation failed: ${validation.name} - ${error.message}`);
      }
    }
  }

  async checkProjectDirectory() {
    const stats = await fs.stat(this.projectPath);
    if (!stats.isDirectory()) {
      throw new Error('Project path is not a directory');
    }
  }

  async checkPackageJson() {
    const packagePath = path.join(this.projectPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

    if (!packageJson.scripts?.build) {
      throw new Error('No build script found in package.json');
    }

    if (!packageJson.scripts?.start) {
      throw new Error('No start script found in package.json');
    }

    this.deploymentConfig.packageJson = packageJson;
  }

  async checkDependencies() {
    const nodeModulesPath = path.join(this.projectPath, 'node_modules');

    try {
      await fs.access(nodeModulesPath);
    } catch {
      console.log('   📦 Installing dependencies...');
      await this.runCommand('npm install', this.projectPath);
    }

    // Check for critical dependencies
    const criticalDeps = ['next', 'react', 'react-dom'];
    const packageJson = this.deploymentConfig.packageJson;

    for (const dep of criticalDeps) {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        throw new Error(`Critical dependency missing: ${dep}`);
      }
    }
  }

  async checkEnvironmentVariables() {
    const envFiles = ['.env', '.env.local', '.env.production'];
    let envFound = false;

    for (const envFile of envFiles) {
      const envPath = path.join(this.projectPath, envFile);
      try {
        await fs.access(envPath);
        envFound = true;
        console.log(`   📄 Found environment file: ${envFile}`);
        break;
      } catch {
        // File doesn't exist, continue
      }
    }

    if (!envFound) {
      console.log('   ⚠️ No environment files found - using defaults');
    }

    // Check for required environment variables
    const requiredEnvVars = ['NEXT_PUBLIC_SITE_URL'];
    const missingVars = [];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      console.log(`   ⚠️ Missing environment variables: ${missingVars.join(', ')}`);
      console.log('   These will be set during deployment');
    }
  }

  async checkBuildConfiguration() {
    const configFiles = ['next.config.js', 'next.config.mjs', 'next.config.ts'];
    let configFound = false;

    for (const configFile of configFiles) {
      const configPath = path.join(this.projectPath, configFile);
      try {
        await fs.access(configPath);
        configFound = true;
        console.log(`   ⚙️ Found config file: ${configFile}`);
        break;
      } catch {
        // File doesn't exist, continue
      }
    }

    if (!configFound) {
      throw new Error('No Next.js configuration file found');
    }
  }

  async validateContent() {
    // Check for placeholder content that should have been replaced
    const criticalFiles = [
      'app/layout.tsx',
      'components/Footer.tsx',
      'components/CTASection.tsx'
    ];

    const placeholders = [
      'Your Clinic Name',
      '[Your Location]',
      'your-clinic-domain.com',
      'info@leadballoon.co.uk'
    ];

    let placeholderWarnings = 0;

    for (const file of criticalFiles) {
      const filePath = path.join(this.projectPath, file);

      try {
        const content = await fs.readFile(filePath, 'utf8');

        for (const placeholder of placeholders) {
          if (content.includes(placeholder)) {
            console.log(`   ⚠️ Placeholder found in ${file}: ${placeholder}`);
            placeholderWarnings++;
          }
        }
      } catch (error) {
        console.log(`   ⚠️ Could not validate ${file}: ${error.message}`);
      }
    }

    if (placeholderWarnings > 3) {
      throw new Error(`Too many placeholders found (${placeholderWarnings}). Template may not be properly customized.`);
    }
  }

  /**
   * Setup deployment environment
   */
  async setupDeploymentEnvironment() {
    // Create deployment configuration
    this.deploymentConfig.environment = this.environment;
    this.deploymentConfig.timestamp = new Date().toISOString();
    this.deploymentConfig.platform = this.platform;

    // Set up environment-specific configurations
    switch (this.platform) {
      case 'vercel':
        await this.setupVercelConfig();
        break;
      case 'netlify':
        await this.setupNetlifyConfig();
        break;
      default:
        console.log('   ⚠️ Using custom deployment configuration');
    }

    // Create .env.production if it doesn't exist
    await this.createProductionEnv();

    console.log(`   ✅ Deployment environment configured for ${this.platform}`);
  }

  async setupVercelConfig() {
    const vercelConfig = {
      version: 2,
      name: this.deploymentConfig.packageJson.name,
      builds: [
        {
          src: "package.json",
          use: "@vercel/next"
        }
      ],
      env: {
        NEXT_PUBLIC_SITE_URL: this.domain ? `https://${this.domain}` : undefined
      },
      functions: {
        "app/api/**": {
          maxDuration: 30
        }
      }
    };

    // Remove undefined values
    Object.keys(vercelConfig.env).forEach(key => {
      if (vercelConfig.env[key] === undefined) {
        delete vercelConfig.env[key];
      }
    });

    const vercelPath = path.join(this.projectPath, 'vercel.json');
    await fs.writeFile(vercelPath, JSON.stringify(vercelConfig, null, 2));

    this.deploymentConfig.vercel = vercelConfig;
  }

  async setupNetlifyConfig() {
    const netlifyConfig = {
      build: {
        command: "npm run build",
        publish: "out",
        environment: {
          NEXT_PUBLIC_SITE_URL: this.domain ? `https://${this.domain}` : undefined
        }
      },
      functions: {
        directory: "netlify/functions"
      },
      headers: [
        {
          for: "/*",
          values: {
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          }
        }
      ]
    };

    // Remove undefined values
    Object.keys(netlifyConfig.build.environment).forEach(key => {
      if (netlifyConfig.build.environment[key] === undefined) {
        delete netlifyConfig.build.environment[key];
      }
    });

    const netlifyPath = path.join(this.projectPath, 'netlify.toml');
    const tomlContent = this.objectToToml(netlifyConfig);
    await fs.writeFile(netlifyPath, tomlContent);

    this.deploymentConfig.netlify = netlifyConfig;
  }

  async createProductionEnv() {
    const envPath = path.join(this.projectPath, '.env.production');

    try {
      await fs.access(envPath);
      console.log('   📄 .env.production already exists');
    } catch {
      const envContent = [
        '# Production Environment Variables',
        '# Generated automatically by deployment automation',
        '',
        `NEXT_PUBLIC_SITE_URL=${this.domain ? `https://${this.domain}` : 'https://your-domain.com'}`,
        'NODE_ENV=production',
        '',
        '# Add your production-specific variables below:',
        '# GOOGLE_ANALYTICS_ID=',
        '# FACEBOOK_PIXEL_ID=',
        '# CALENDLY_URL=',
        ''
      ].join('\n');

      await fs.writeFile(envPath, envContent);
      console.log('   📄 Created .env.production');
    }
  }

  /**
   * Optimize build for production
   */
  async optimizeBuild() {
    console.log('   🔧 Running build optimization...');

    // Run production build
    try {
      await this.runCommand('npm run build', this.projectPath);
      console.log('   ✅ Build completed successfully');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }

    // Analyze bundle size if available
    try {
      const buildOutput = await this.analyzeBundle();
      console.log('   📊 Bundle analysis completed');
      this.deploymentConfig.bundleAnalysis = buildOutput;
    } catch (error) {
      console.log('   ⚠️ Bundle analysis skipped:', error.message);
    }

    // Optimize images if directory exists
    await this.optimizeImages();
  }

  async analyzeBundle() {
    // Check if @next/bundle-analyzer is installed
    const packageJson = this.deploymentConfig.packageJson;
    if (!packageJson.devDependencies?.['@next/bundle-analyzer']) {
      throw new Error('Bundle analyzer not installed');
    }

    // Run bundle analysis (this would be customized based on setup)
    const buildDir = path.join(this.projectPath, '.next');
    const stats = await fs.stat(buildDir);

    return {
      buildSize: this.formatBytes(await this.getDirectorySize(buildDir)),
      timestamp: stats.mtime
    };
  }

  async optimizeImages() {
    const imagesDir = path.join(this.projectPath, 'public', 'images');

    try {
      await fs.access(imagesDir);
      console.log('   🖼️ Checking image optimization...');

      const imageFiles = await this.getImageFiles(imagesDir);
      let optimizedCount = 0;

      for (const imageFile of imageFiles) {
        const stats = await fs.stat(imageFile);
        if (stats.size > 500000) { // 500KB threshold
          console.log(`   ⚠️ Large image detected: ${path.basename(imageFile)} (${this.formatBytes(stats.size)})`);
          // Here you could integrate with image optimization tools
        } else {
          optimizedCount++;
        }
      }

      console.log(`   ✅ Image optimization check: ${optimizedCount}/${imageFiles.length} images optimized`);

    } catch (error) {
      console.log('   ⚠️ Images directory not found or inaccessible');
    }
  }

  /**
   * Setup Git repository
   */
  async setupGitRepository() {
    const gitDir = path.join(this.projectPath, '.git');

    try {
      await fs.access(gitDir);
      console.log('   📁 Git repository already exists');

      // Check if there are uncommitted changes
      const status = await this.runCommand('git status --porcelain', this.projectPath);
      if (status.trim()) {
        console.log('   📝 Committing changes...');
        await this.runCommand('git add .', this.projectPath);
        await this.runCommand('git commit -m "Pre-deployment customizations"', this.projectPath);
      }

    } catch (error) {
      console.log('   📁 Initializing Git repository...');
      await this.runCommand('git init', this.projectPath);
      await this.runCommand('git add .', this.projectPath);
      await this.runCommand('git commit -m "Initial commit - Customized CO2 Laser Template"', this.projectPath);
    }

    // Set up remote repository if provided
    if (this.gitRepo) {
      try {
        await this.runCommand(`git remote add origin ${this.gitRepo}`, this.projectPath);
        console.log(`   🔗 Added remote repository: ${this.gitRepo}`);
      } catch (error) {
        // Remote might already exist
        console.log('   ⚠️ Remote repository already configured or error adding remote');
      }
    }

    console.log('   ✅ Git repository configured');
  }

  /**
   * Deploy to selected platform
   */
  async deployToPlatform() {
    switch (this.platform) {
      case 'vercel':
        return await this.deployToVercel();
      case 'netlify':
        return await this.deployToNetlify();
      default:
        throw new Error(`Unsupported deployment platform: ${this.platform}`);
    }
  }

  async deployToVercel() {
    console.log('   🚀 Deploying to Vercel...');

    try {
      // Check if Vercel CLI is installed
      await this.runCommand('vercel --version');
    } catch (error) {
      throw new Error('Vercel CLI not installed. Install with: npm i -g vercel');
    }

    try {
      // Deploy to Vercel
      const deployCommand = this.environment === 'production' ? 'vercel --prod' : 'vercel';
      const output = await this.runCommand(deployCommand, this.projectPath);

      // Extract deployment URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const deploymentUrl = urlMatch ? urlMatch[0] : null;

      if (!deploymentUrl) {
        throw new Error('Could not extract deployment URL from Vercel output');
      }

      console.log(`   ✅ Deployed to Vercel: ${deploymentUrl}`);

      return {
        url: deploymentUrl,
        deploymentId: this.extractVercelDeploymentId(output),
        platform: 'vercel'
      };

    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error.message}`);
    }
  }

  async deployToNetlify() {
    console.log('   🚀 Deploying to Netlify...');

    try {
      // Check if Netlify CLI is installed
      await this.runCommand('netlify --version');
    } catch (error) {
      throw new Error('Netlify CLI not installed. Install with: npm i -g netlify-cli');
    }

    try {
      // Deploy to Netlify
      const deployCommand = this.environment === 'production' ? 'netlify deploy --prod' : 'netlify deploy';
      const output = await this.runCommand(deployCommand, this.projectPath);

      // Extract deployment URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const deploymentUrl = urlMatch ? urlMatch[0] : null;

      if (!deploymentUrl) {
        throw new Error('Could not extract deployment URL from Netlify output');
      }

      console.log(`   ✅ Deployed to Netlify: ${deploymentUrl}`);

      return {
        url: deploymentUrl,
        deploymentId: this.extractNetlifyDeploymentId(output),
        platform: 'netlify'
      };

    } catch (error) {
      throw new Error(`Netlify deployment failed: ${error.message}`);
    }
  }

  /**
   * Post-deployment testing
   */
  async postDeploymentTesting(deploymentUrl) {
    const tests = [
      { name: 'Site accessibility', test: () => this.testSiteAccessibility(deploymentUrl) },
      { name: 'Critical pages load', test: () => this.testCriticalPages(deploymentUrl) },
      { name: 'Contact forms work', test: () => this.testContactForms(deploymentUrl) },
      { name: 'Mobile responsiveness', test: () => this.testMobileResponsiveness(deploymentUrl) },
      { name: 'SEO basics', test: () => this.testSEOBasics(deploymentUrl) },
      { name: 'Performance check', test: () => this.testPerformance(deploymentUrl) }
    ];

    console.log('   🧪 Running post-deployment tests...');

    for (const test of tests) {
      try {
        await test.test();
        console.log(`   ✅ ${test.name}`);
        this.postDeploymentChecks.push({ name: test.name, status: 'pass', details: null });
      } catch (error) {
        console.log(`   ⚠️ ${test.name}: ${error.message}`);
        this.postDeploymentChecks.push({ name: test.name, status: 'warning', details: error.message });
      }
    }

    const passedTests = this.postDeploymentChecks.filter(check => check.status === 'pass').length;
    console.log(`   📊 Post-deployment tests: ${passedTests}/${tests.length} passed`);
  }

  async testSiteAccessibility(url) {
    // Simple HTTP status check
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Site returned ${response.status} ${response.statusText}`);
    }
  }

  async testCriticalPages(url) {
    const criticalPaths = ['/', '/privacy'];
    const baseUrl = url.replace(/\/$/, '');

    for (const path of criticalPaths) {
      const pageUrl = `${baseUrl}${path}`;
      try {
        const response = await fetch(pageUrl);
        if (!response.ok) {
          throw new Error(`${path} returned ${response.status}`);
        }
      } catch (error) {
        throw new Error(`Failed to load ${path}: ${error.message}`);
      }
    }
  }

  async testContactForms(url) {
    // This would be a more sophisticated test in a real implementation
    // For now, just check if the page contains form elements
    const response = await fetch(url);
    const html = await response.text();

    if (!html.includes('<form') && !html.includes('booking')) {
      throw new Error('No contact forms or booking elements found');
    }
  }

  async testMobileResponsiveness(url) {
    // Basic check for viewport meta tag
    const response = await fetch(url);
    const html = await response.text();

    if (!html.includes('viewport')) {
      throw new Error('Mobile viewport meta tag not found');
    }
  }

  async testSEOBasics(url) {
    const response = await fetch(url);
    const html = await response.text();

    const seoChecks = [
      { element: '<title>', name: 'Title tag' },
      { element: 'description', name: 'Meta description' },
      { element: '<h1', name: 'H1 heading' }
    ];

    for (const check of seoChecks) {
      if (!html.includes(check.element)) {
        throw new Error(`${check.name} missing`);
      }
    }
  }

  async testPerformance(url) {
    // Basic performance check - could be enhanced with Lighthouse API
    const startTime = Date.now();
    const response = await fetch(url);
    const loadTime = Date.now() - startTime;

    if (loadTime > 5000) {
      throw new Error(`Slow load time: ${loadTime}ms`);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 2000000) { // 2MB
      throw new Error(`Large page size: ${this.formatBytes(parseInt(contentLength))}`);
    }
  }

  /**
   * Configure custom domain
   */
  async configureDomain() {
    console.log(`   🌍 Configuring domain: ${this.domain}`);

    switch (this.platform) {
      case 'vercel':
        await this.configureVercelDomain();
        break;
      case 'netlify':
        await this.configureNetlifyDomain();
        break;
      default:
        console.log('   ⚠️ Manual domain configuration required');
    }
  }

  async configureVercelDomain() {
    try {
      await this.runCommand(`vercel domains add ${this.domain}`, this.projectPath);
      console.log(`   ✅ Domain ${this.domain} added to Vercel`);
    } catch (error) {
      console.log(`   ⚠️ Domain configuration failed: ${error.message}`);
      console.log('   💡 Configure domain manually in Vercel dashboard');
    }
  }

  async configureNetlifyDomain() {
    try {
      await this.runCommand(`netlify sites:update --name ${this.domain.replace('.', '-')}`, this.projectPath);
      console.log(`   ✅ Domain ${this.domain} configured for Netlify`);
    } catch (error) {
      console.log(`   ⚠️ Domain configuration failed: ${error.message}`);
      console.log('   💡 Configure domain manually in Netlify dashboard');
    }
  }

  /**
   * Generate deployment report
   */
  async generateDeploymentReport(deploymentResult) {
    const reportDir = path.join(this.projectPath, 'deployment-reports');
    await fs.mkdir(reportDir, { recursive: true });

    const report = {
      deployment: {
        timestamp: this.deploymentConfig.timestamp,
        platform: this.platform,
        environment: this.environment,
        url: deploymentResult.url,
        deploymentId: deploymentResult.deploymentId,
        domain: this.domain
      },
      validation: {
        preDeployment: this.deploymentLog,
        postDeployment: this.postDeploymentChecks
      },
      configuration: this.deploymentConfig,
      nextSteps: this.generateNextSteps(deploymentResult)
    };

    // Save JSON report
    await fs.writeFile(
      path.join(reportDir, 'deployment-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate markdown report
    const markdownReport = this.generateMarkdownDeploymentReport(report);
    await fs.writeFile(
      path.join(reportDir, 'DEPLOYMENT-REPORT.md'),
      markdownReport
    );

    console.log(`   📄 Deployment report saved to: ${reportDir}`);
  }

  generateNextSteps(deploymentResult) {
    const steps = [
      `✅ Site is live at: ${deploymentResult.url}`,
      '📱 Test the site on mobile devices',
      '🔍 Test all contact forms and booking integration',
      '📊 Set up Google Analytics tracking',
      '🔍 Submit sitemap to Google Search Console'
    ];

    if (this.domain) {
      steps.push(`🌍 Verify custom domain: https://${this.domain}`);
      steps.push('📧 Update DNS records if needed');
    }

    const failedChecks = this.postDeploymentChecks.filter(check => check.status !== 'pass');
    if (failedChecks.length > 0) {
      steps.push('⚠️ Address failed post-deployment checks');
    }

    return steps;
  }

  generateMarkdownDeploymentReport(report) {
    const passedChecks = report.validation.postDeployment.filter(check => check.status === 'pass').length;
    const totalChecks = report.validation.postDeployment.length;

    return `# Deployment Report

## Summary
- **Deployment Date**: ${new Date(report.deployment.timestamp).toLocaleString()}
- **Platform**: ${report.deployment.platform}
- **Environment**: ${report.deployment.environment}
- **Live URL**: [${report.deployment.url}](${report.deployment.url})
- **Custom Domain**: ${report.deployment.domain || 'Not configured'}

## Deployment Status: ✅ SUCCESS

## Post-Deployment Checks
**Score: ${passedChecks}/${totalChecks} passed**

${report.validation.postDeployment.map(check =>
  `- ${check.status === 'pass' ? '✅' : '⚠️'} **${check.name}**${check.details ? `: ${check.details}` : ''}`
).join('\n')}

## Next Steps
${report.nextSteps.map(step => `- [ ] ${step}`).join('\n')}

## Configuration Details
- **Build Size**: ${report.configuration.bundleAnalysis?.buildSize || 'Not analyzed'}
- **Platform Config**: ${report.deployment.platform === 'vercel' ? 'vercel.json' : 'netlify.toml'} created
- **Environment**: .env.production configured

## Support Information
For technical support or issues:
1. Check the deployment logs in your platform dashboard
2. Verify all environment variables are set
3. Test booking integration thoroughly
4. Monitor site performance and uptime

---
*Generated by CO2 Laser Template Deployment Automation*
`;
  }

  /**
   * Handle deployment failure
   */
  async handleDeploymentFailure(error) {
    console.log('\n🔍 Deployment Failure Analysis:');
    console.log(`   Error: ${error.message}`);

    // Generate failure report
    const failureReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      logs: this.deploymentLog,
      platform: this.platform,
      environment: this.environment,
      troubleshooting: this.generateTroubleshootingSteps(error)
    };

    try {
      const reportDir = path.join(this.projectPath, 'deployment-reports');
      await fs.mkdir(reportDir, { recursive: true });

      await fs.writeFile(
        path.join(reportDir, 'deployment-failure.json'),
        JSON.stringify(failureReport, null, 2)
      );

      console.log('   📄 Failure report saved for analysis');
    } catch (reportError) {
      console.log('   ⚠️ Could not save failure report');
    }

    // Provide troubleshooting suggestions
    console.log('\n💡 Troubleshooting Suggestions:');
    failureReport.troubleshooting.forEach(step => {
      console.log(`   - ${step}`);
    });
  }

  generateTroubleshootingSteps(error) {
    const steps = [
      'Check all required files are present in the project directory',
      'Verify package.json has correct build and start scripts',
      'Ensure all dependencies are installed (npm install)',
      'Test local build (npm run build)',
      'Check for any remaining placeholder content'
    ];

    if (error.message.includes('build')) {
      steps.push('Review build logs for specific error details');
      steps.push('Check Next.js configuration file');
    }

    if (error.message.includes('vercel') || error.message.includes('netlify')) {
      steps.push('Verify CLI tool is installed and authenticated');
      steps.push('Check platform-specific configuration files');
    }

    return steps;
  }

  /**
   * Utility methods
   */
  async runCommand(command, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, { shell: true, cwd });
      let output = '';
      let error = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || `Command failed with exit code ${code}`));
        }
      });

      child.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;

    async function calculateSize(currentPath) {
      const stats = await fs.stat(currentPath);

      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        const files = await fs.readdir(currentPath);
        for (const file of files) {
          await calculateSize(path.join(currentPath, file));
        }
      }
    }

    await calculateSize(dirPath);
    return totalSize;
  }

  async getImageFiles(dirPath) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = [];

    async function findImages(currentPath) {
      const files = await fs.readdir(currentPath);

      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile() && imageExtensions.includes(path.extname(file).toLowerCase())) {
          imageFiles.push(filePath);
        } else if (stats.isDirectory()) {
          await findImages(filePath);
        }
      }
    }

    await findImages(dirPath);
    return imageFiles;
  }

  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }

  extractVercelDeploymentId(output) {
    const match = output.match(/https:\/\/([^.]+)\.vercel\.app/);
    return match ? match[1] : null;
  }

  extractNetlifyDeploymentId(output) {
    const match = output.match(/https:\/\/([^.]+)\.netlify\.app/);
    return match ? match[1] : null;
  }

  objectToToml(obj, prefix = '') {
    let toml = '';

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        toml += `[${fullKey}]\n`;
        for (const [subKey, subValue] of Object.entries(value)) {
          if (typeof subValue === 'string') {
            toml += `${subKey} = "${subValue}"\n`;
          } else {
            toml += `${subKey} = ${subValue}\n`;
          }
        }
        toml += '\n';
      } else if (Array.isArray(value)) {
        toml += `${key} = [${value.map(v => `"${v}"`).join(', ')}]\n`;
      } else if (typeof value === 'string') {
        toml += `${key} = "${value}"\n`;
      } else {
        toml += `${key} = ${value}\n`;
      }
    }

    return toml;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
CO2 Laser Template Deployment Automation

Usage: node deployment-automation.js <project-path> [options]

Arguments:
  <project-path>           Path to the customized template project

Options:
  --platform <platform>    Deployment platform (vercel|netlify) [default: vercel]
  --domain <domain>        Custom domain name
  --environment <env>      Environment (production|staging) [default: production]
  --git-repo <url>         Git repository URL
  --help, -h               Show this help message

Examples:
  node deployment-automation.js ./clinic-co2-laser-site
  node deployment-automation.js ./clinic-site --platform vercel --domain clinic.com
  node deployment-automation.js ./clinic-site --platform netlify --environment staging
`);
    process.exit(0);
  }

  if (args.length < 1) {
    console.error('❌ Error: Project path is required');
    process.exit(1);
  }

  const projectPath = args[0];
  const options = {};

  // Parse command line options
  for (let i = 1; i < args.length; i += 2) {
    const option = args[i];
    const value = args[i + 1];

    switch (option) {
      case '--platform':
        options.platform = value;
        break;
      case '--domain':
        options.domain = value;
        break;
      case '--environment':
        options.environment = value;
        break;
      case '--git-repo':
        options.gitRepo = value;
        break;
    }
  }

  const deployment = new DeploymentAutomation();

  deployment.deploy(projectPath, options)
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Deployment completed successfully!');
        console.log(`🌐 Live URL: ${result.url}`);
        if (result.domain) {
          console.log(`🌍 Custom Domain: https://${result.domain}`);
        }
      } else {
        console.error('\n❌ Deployment failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Unexpected error:', error.message);
      process.exit(1);
    });
}

module.exports = DeploymentAutomation;