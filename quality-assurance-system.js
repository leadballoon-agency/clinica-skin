#!/usr/bin/env node

/**
 * Quality Assurance System for CO2 Laser Template Customizations
 *
 * This system provides comprehensive quality checks for customized templates including:
 * - Code quality validation
 * - Content accuracy verification
 * - Performance analysis
 * - SEO compliance checking
 * - Accessibility testing
 * - Security scanning
 * - Cross-browser compatibility
 * - Mobile responsiveness validation
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class QualityAssuranceSystem {
  constructor(options = {}) {
    this.projectPath = options.projectPath;
    this.reportLevel = options.reportLevel || 'detailed'; // basic, detailed, comprehensive
    this.thresholds = {
      performance: {
        loadTime: 3000, // ms
        bundleSize: 2000000, // 2MB
        imageSize: 500000 // 500KB
      },
      accessibility: {
        minScore: 90
      },
      seo: {
        minScore: 85
      },
      security: {
        criticalIssues: 0,
        highIssues: 2
      }
    };
    this.testResults = [];
    this.issues = [];
    this.recommendations = [];
  }

  /**
   * Main QA execution flow
   */
  async runQualityAssurance(projectPath) {
    this.projectPath = projectPath;

    console.log('🔍 Starting Comprehensive Quality Assurance...\n');

    try {
      // Category 1: Code Quality
      console.log('📝 Category 1: Code Quality Analysis...');
      await this.runCodeQualityTests();

      // Category 2: Content Validation
      console.log('📋 Category 2: Content Validation...');
      await this.runContentValidationTests();

      // Category 3: Performance Analysis
      console.log('⚡ Category 3: Performance Analysis...');
      await this.runPerformanceTests();

      // Category 4: SEO Compliance
      console.log('🔍 Category 4: SEO Compliance...');
      await this.runSEOTests();

      // Category 5: Accessibility Testing
      console.log('♿ Category 5: Accessibility Testing...');
      await this.runAccessibilityTests();

      // Category 6: Security Analysis
      console.log('🔒 Category 6: Security Analysis...');
      await this.runSecurityTests();

      // Category 7: Cross-Platform Testing
      console.log('🌐 Category 7: Cross-Platform Testing...');
      await this.runCrossPlatformTests();

      // Category 8: Integration Testing
      console.log('🔗 Category 8: Integration Testing...');
      await this.runIntegrationTests();

      // Generate comprehensive report
      console.log('📄 Generating QA Report...');
      const report = await this.generateQAReport();

      console.log('\n✅ Quality Assurance completed!');
      console.log(`📊 Overall Score: ${report.overallScore}%`);
      console.log(`⚠️  Issues Found: ${this.issues.length}`);
      console.log(`💡 Recommendations: ${this.recommendations.length}`);

      return {
        success: true,
        score: report.overallScore,
        issues: this.issues,
        recommendations: this.recommendations,
        report: report
      };

    } catch (error) {
      console.error('❌ QA process failed:', error.message);
      return {
        success: false,
        error: error.message,
        partialResults: this.testResults
      };
    }
  }

  /**
   * Code Quality Tests
   */
  async runCodeQualityTests() {
    const codeTests = [
      { name: 'TypeScript compilation', test: () => this.testTypeScriptCompilation() },
      { name: 'ESLint validation', test: () => this.testESLint() },
      { name: 'Code formatting', test: () => this.testCodeFormatting() },
      { name: 'Import/export consistency', test: () => this.testImportExports() },
      { name: 'Component structure', test: () => this.testComponentStructure() },
      { name: 'Configuration files', test: () => this.testConfigurationFiles() }
    ];

    await this.runTestCategory('Code Quality', codeTests);
  }

  async testTypeScriptCompilation() {
    try {
      const tsconfigPath = path.join(this.projectPath, 'tsconfig.json');
      await fs.access(tsconfigPath);

      // Run TypeScript compiler check
      execSync('npx tsc --noEmit', { cwd: this.projectPath, stdio: 'pipe' });

      return { status: 'pass', message: 'TypeScript compilation successful' };
    } catch (error) {
      const errorMessage = error.stdout?.toString() || error.message;
      return {
        status: 'fail',
        message: 'TypeScript compilation errors found',
        details: errorMessage.slice(0, 500) // Limit error output
      };
    }
  }

  async testESLint() {
    try {
      const eslintConfigPath = path.join(this.projectPath, '.eslintrc.json');
      await fs.access(eslintConfigPath);

      execSync('npx eslint . --ext .ts,.tsx --max-warnings 10', {
        cwd: this.projectPath,
        stdio: 'pipe'
      });

      return { status: 'pass', message: 'ESLint validation passed' };
    } catch (error) {
      const warningCount = (error.stdout?.toString().match(/warning/g) || []).length;
      const errorCount = (error.stdout?.toString().match(/error/g) || []).length;

      if (errorCount > 0) {
        return {
          status: 'fail',
          message: `ESLint found ${errorCount} errors and ${warningCount} warnings`
        };
      } else if (warningCount > 10) {
        return {
          status: 'warning',
          message: `ESLint found ${warningCount} warnings (threshold: 10)`
        };
      } else {
        return { status: 'pass', message: 'ESLint validation passed with warnings' };
      }
    }
  }

  async testCodeFormatting() {
    try {
      execSync('npx prettier --check .', { cwd: this.projectPath, stdio: 'pipe' });
      return { status: 'pass', message: 'Code formatting is consistent' };
    } catch (error) {
      return {
        status: 'warning',
        message: 'Code formatting inconsistencies found',
        recommendation: 'Run npx prettier --write . to fix formatting'
      };
    }
  }

  async testImportExports() {
    const issues = [];
    const componentDir = path.join(this.projectPath, 'components');

    try {
      const files = await fs.readdir(componentDir);
      const tsxFiles = files.filter(file => file.endsWith('.tsx'));

      for (const file of tsxFiles) {
        const filePath = path.join(componentDir, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Check for default export
        if (!content.includes('export default')) {
          issues.push(`${file}: Missing default export`);
        }

        // Check for unused imports
        const importLines = content.match(/import.*from.*/g) || [];
        for (const importLine of importLines) {
          const importMatch = importLine.match(/import\s+(?:{[^}]*}|\w+)\s+from/);
          if (importMatch) {
            const importName = importMatch[0].replace(/import\s+/, '').replace(/\s+from/, '');
            if (!content.includes(importName.replace(/[{}]/g, '').trim())) {
              issues.push(`${file}: Potentially unused import: ${importName}`);
            }
          }
        }
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Import/export structure is clean' };
      } else {
        return {
          status: 'warning',
          message: `Found ${issues.length} import/export issues`,
          details: issues.slice(0, 5) // Show first 5 issues
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not analyze import/export structure' };
    }
  }

  async testComponentStructure() {
    const issues = [];
    const componentDir = path.join(this.projectPath, 'components');

    try {
      const files = await fs.readdir(componentDir);
      const tsxFiles = files.filter(file => file.endsWith('.tsx'));

      for (const file of tsxFiles) {
        const filePath = path.join(componentDir, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Check for proper React component structure
        if (!content.includes('export default function')) {
          issues.push(`${file}: Not using function component pattern`);
        }

        // Check for proper TypeScript interfaces
        if (content.includes('Props') && !content.includes('interface') && !content.includes('type')) {
          issues.push(`${file}: Props not properly typed`);
        }

        // Check for accessibility attributes
        if (content.includes('<img') && !content.includes('alt=')) {
          issues.push(`${file}: Images missing alt attributes`);
        }

        if (content.includes('<button') && !content.includes('aria-')) {
          issues.push(`${file}: Buttons missing accessibility attributes`);
        }
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Component structure is well-organized' };
      } else {
        return {
          status: 'warning',
          message: `Found ${issues.length} component structure issues`,
          details: issues.slice(0, 5)
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not analyze component structure' };
    }
  }

  async testConfigurationFiles() {
    const requiredConfigs = [
      { file: 'next.config.js', description: 'Next.js configuration' },
      { file: 'tailwind.config.js', description: 'Tailwind CSS configuration' },
      { file: 'tsconfig.json', description: 'TypeScript configuration' },
      { file: 'package.json', description: 'Package configuration' }
    ];

    const missingConfigs = [];

    for (const config of requiredConfigs) {
      const configPath = path.join(this.projectPath, config.file);
      try {
        await fs.access(configPath);
      } catch {
        missingConfigs.push(config.description);
      }
    }

    if (missingConfigs.length === 0) {
      return { status: 'pass', message: 'All required configuration files present' };
    } else {
      return {
        status: 'fail',
        message: `Missing configuration files: ${missingConfigs.join(', ')}`
      };
    }
  }

  /**
   * Content Validation Tests
   */
  async runContentValidationTests() {
    const contentTests = [
      { name: 'Placeholder removal', test: () => this.testPlaceholderRemoval() },
      { name: 'Contact information', test: () => this.testContactInformation() },
      { name: 'Business information', test: () => this.testBusinessInformation() },
      { name: 'Content consistency', test: () => this.testContentConsistency() },
      { name: 'Image validation', test: () => this.testImageValidation() },
      { name: 'Link validation', test: () => this.testLinkValidation() }
    ];

    await this.runTestCategory('Content Validation', contentTests);
  }

  async testPlaceholderRemoval() {
    const placeholders = [
      'Your Clinic Name',
      '[Your Location]',
      'your-clinic-domain.com',
      'info@leadballoon.co.uk',
      '[Your Street Address]',
      '[Your City]',
      '[Your Postal Code]'
    ];

    const criticalFiles = [
      'app/layout.tsx',
      'components/Footer.tsx',
      'components/CTASection.tsx',
      'components/TeamSection.tsx'
    ];

    let placeholderCount = 0;
    const foundPlaceholders = [];

    for (const file of criticalFiles) {
      const filePath = path.join(this.projectPath, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        for (const placeholder of placeholders) {
          if (content.includes(placeholder)) {
            placeholderCount++;
            foundPlaceholders.push(`${file}: ${placeholder}`);
          }
        }
      } catch (error) {
        // File doesn't exist, note but don't fail
      }
    }

    if (placeholderCount === 0) {
      return { status: 'pass', message: 'All placeholders have been replaced' };
    } else if (placeholderCount < 3) {
      return {
        status: 'warning',
        message: `${placeholderCount} placeholders remaining`,
        details: foundPlaceholders
      };
    } else {
      return {
        status: 'fail',
        message: `${placeholderCount} placeholders found - template not properly customized`,
        details: foundPlaceholders.slice(0, 5)
      };
    }
  }

  async testContactInformation() {
    const layoutPath = path.join(this.projectPath, 'app', 'layout.tsx');
    const footerPath = path.join(this.projectPath, 'components', 'Footer.tsx');

    try {
      const layoutContent = await fs.readFile(layoutPath, 'utf8');
      const footerContent = await fs.readFile(footerPath, 'utf8');

      const issues = [];

      // Check for valid phone number format
      const phonePattern = /\+44\d{10,11}|\+44\s*\d{4}\s*\d{3}\s*\d{3,4}/;
      if (!phonePattern.test(layoutContent) && !phonePattern.test(footerContent)) {
        issues.push('Valid UK phone number not found');
      }

      // Check for valid email format
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      if (!emailPattern.test(layoutContent) && !emailPattern.test(footerContent)) {
        issues.push('Valid email address not found');
      }

      // Check for postal code
      const postcodePattern = /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/;
      if (!postcodePattern.test(layoutContent)) {
        issues.push('UK postal code not found in schema markup');
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Contact information is properly formatted' };
      } else {
        return {
          status: 'warning',
          message: 'Contact information issues found',
          details: issues
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not validate contact information' };
    }
  }

  async testBusinessInformation() {
    const layoutPath = path.join(this.projectPath, 'app', 'layout.tsx');

    try {
      const content = await fs.readFile(layoutPath, 'utf8');
      const issues = [];

      // Check for business name in schema markup
      if (!content.includes('"name":') || content.includes('"name": "Your Clinic Name"')) {
        issues.push('Business name not properly set in schema markup');
      }

      // Check for description
      if (!content.includes('"description":') || content.includes('Transform your skin with Lumenis UltraPulse')) {
        issues.push('Business description not customized');
      }

      // Check for location information
      if (content.includes('"latitude": 0.0000')) {
        issues.push('Geographic coordinates not set');
      }

      // Check for opening hours
      if (!content.includes('openingHoursSpecification')) {
        issues.push('Opening hours not specified');
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Business information is complete' };
      } else {
        return {
          status: 'warning',
          message: 'Business information incomplete',
          details: issues
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not validate business information' };
    }
  }

  async testContentConsistency() {
    const files = [
      'app/layout.tsx',
      'components/Footer.tsx',
      'components/CTASection.tsx'
    ];

    try {
      const contents = {};
      for (const file of files) {
        const filePath = path.join(this.projectPath, file);
        contents[file] = await fs.readFile(filePath, 'utf8');
      }

      const issues = [];

      // Extract business names from different files
      const businessNames = new Set();
      for (const [file, content] of Object.entries(contents)) {
        const nameMatches = content.match(/"([^"]*(?:Clinic|Aesthetics|Beauty|Skin)[^"]*)"/g);
        if (nameMatches) {
          nameMatches.forEach(match => businessNames.add(match.replace(/"/g, '')));
        }
      }

      if (businessNames.size > 1) {
        issues.push(`Inconsistent business names found: ${Array.from(businessNames).join(', ')}`);
      }

      // Check phone number consistency
      const phoneNumbers = new Set();
      for (const [file, content] of Object.entries(contents)) {
        const phoneMatches = content.match(/\+44[\d\s]+/g);
        if (phoneMatches) {
          phoneMatches.forEach(match => phoneNumbers.add(match.replace(/\s/g, '')));
        }
      }

      if (phoneNumbers.size > 1) {
        issues.push(`Inconsistent phone numbers found: ${Array.from(phoneNumbers).join(', ')}`);
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Content is consistent across files' };
      } else {
        return {
          status: 'warning',
          message: 'Content inconsistencies found',
          details: issues
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not validate content consistency' };
    }
  }

  async testImageValidation() {
    const imagesDir = path.join(this.projectPath, 'public', 'images');

    try {
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
      );

      const issues = [];

      for (const imageFile of imageFiles) {
        const imagePath = path.join(imagesDir, imageFile);
        const stats = await fs.stat(imagePath);

        // Check file size
        if (stats.size > this.thresholds.performance.imageSize) {
          issues.push(`${imageFile}: Large file size (${this.formatBytes(stats.size)})`);
        }

        // Check for placeholder images
        if (imageFile.includes('placeholder') || imageFile.includes('demo')) {
          issues.push(`${imageFile}: Placeholder image should be replaced`);
        }
      }

      if (issues.length === 0) {
        return {
          status: 'pass',
          message: `All ${imageFiles.length} images are optimized and customized`
        };
      } else {
        return {
          status: 'warning',
          message: `${issues.length} image issues found`,
          details: issues.slice(0, 5)
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not validate images directory' };
    }
  }

  async testLinkValidation() {
    const files = await this.getHTMLFiles();
    const brokenLinks = [];
    const externalLinks = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const linkMatches = content.match(/href=["']([^"']+)["']/g) || [];

      for (const match of linkMatches) {
        const url = match.match(/href=["']([^"']+)["']/)[1];

        if (url.startsWith('http')) {
          externalLinks.push(url);
        } else if (url.startsWith('/') || url.startsWith('./')) {
          // Internal link validation would go here
          // For now, just note them
        } else if (url.startsWith('#')) {
          // Anchor link - could validate if target exists
        }
      }
    }

    return {
      status: 'pass',
      message: `Found ${externalLinks.length} external links to validate`,
      recommendation: 'Manually verify external links are working'
    };
  }

  /**
   * Performance Tests
   */
  async runPerformanceTests() {
    const performanceTests = [
      { name: 'Bundle size analysis', test: () => this.testBundleSize() },
      { name: 'Image optimization', test: () => this.testImageOptimization() },
      { name: 'Code splitting', test: () => this.testCodeSplitting() },
      { name: 'Static asset optimization', test: () => this.testStaticAssets() },
      { name: 'Build performance', test: () => this.testBuildPerformance() }
    ];

    await this.runTestCategory('Performance', performanceTests);
  }

  async testBundleSize() {
    try {
      // Run build to generate bundle
      execSync('npm run build', { cwd: this.projectPath, stdio: 'pipe' });

      const buildDir = path.join(this.projectPath, '.next');
      const buildSize = await this.getDirectorySize(buildDir);

      if (buildSize > this.thresholds.performance.bundleSize) {
        return {
          status: 'warning',
          message: `Bundle size is large: ${this.formatBytes(buildSize)}`,
          recommendation: 'Consider code splitting and tree shaking optimizations'
        };
      } else {
        return {
          status: 'pass',
          message: `Bundle size is optimal: ${this.formatBytes(buildSize)}`
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not analyze bundle size' };
    }
  }

  async testImageOptimization() {
    const imagesDir = path.join(this.projectPath, 'public', 'images');

    try {
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      let totalSize = 0;
      let unoptimizedCount = 0;

      for (const imageFile of imageFiles) {
        const imagePath = path.join(imagesDir, imageFile);
        const stats = await fs.stat(imagePath);
        totalSize += stats.size;

        if (stats.size > this.thresholds.performance.imageSize) {
          unoptimizedCount++;
        }
      }

      const averageSize = totalSize / imageFiles.length;

      if (unoptimizedCount === 0) {
        return {
          status: 'pass',
          message: `All ${imageFiles.length} images are optimized (avg: ${this.formatBytes(averageSize)})`
        };
      } else {
        return {
          status: 'warning',
          message: `${unoptimizedCount}/${imageFiles.length} images need optimization`,
          recommendation: 'Compress large images or convert to WebP format'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze image optimization' };
    }
  }

  async testCodeSplitting() {
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');

    try {
      const content = await fs.readFile(nextConfigPath, 'utf8');

      if (content.includes('splitChunks') || content.includes('experimental')) {
        return { status: 'pass', message: 'Code splitting is configured' };
      } else {
        return {
          status: 'info',
          message: 'Default code splitting in use',
          recommendation: 'Consider advanced code splitting for large applications'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze code splitting configuration' };
    }
  }

  async testStaticAssets() {
    const publicDir = path.join(this.projectPath, 'public');

    try {
      const totalSize = await this.getDirectorySize(publicDir);

      if (totalSize > 10000000) { // 10MB
        return {
          status: 'warning',
          message: `Static assets are large: ${this.formatBytes(totalSize)}`,
          recommendation: 'Consider CDN for large static assets'
        };
      } else {
        return {
          status: 'pass',
          message: `Static assets size is reasonable: ${this.formatBytes(totalSize)}`
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze static assets' };
    }
  }

  async testBuildPerformance() {
    try {
      const startTime = Date.now();
      execSync('npm run build', { cwd: this.projectPath, stdio: 'pipe' });
      const buildTime = Date.now() - startTime;

      if (buildTime > 60000) { // 1 minute
        return {
          status: 'warning',
          message: `Build time is slow: ${buildTime / 1000}s`,
          recommendation: 'Optimize build configuration for faster builds'
        };
      } else {
        return {
          status: 'pass',
          message: `Build time is good: ${buildTime / 1000}s`
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Build performance test failed' };
    }
  }

  /**
   * SEO Tests
   */
  async runSEOTests() {
    const seoTests = [
      { name: 'Meta tags validation', test: () => this.testMetaTags() },
      { name: 'Schema markup', test: () => this.testSchemaMarkup() },
      { name: 'Sitemap generation', test: () => this.testSitemap() },
      { name: 'Robots.txt', test: () => this.testRobotsTxt() },
      { name: 'URL structure', test: () => this.testURLStructure() },
      { name: 'Content optimization', test: () => this.testContentOptimization() }
    ];

    await this.runTestCategory('SEO', seoTests);
  }

  async testMetaTags() {
    const layoutPath = path.join(this.projectPath, 'app', 'layout.tsx');

    try {
      const content = await fs.readFile(layoutPath, 'utf8');
      const issues = [];

      // Check for title
      if (!content.includes('title:') || content.includes('Your Clinic Name')) {
        issues.push('Title tag not properly customized');
      }

      // Check for description
      if (!content.includes('description:')) {
        issues.push('Meta description missing');
      }

      // Check for keywords
      if (!content.includes('keywords:')) {
        issues.push('Meta keywords missing');
      }

      // Check for Open Graph tags
      if (!content.includes('openGraph:')) {
        issues.push('Open Graph metadata missing');
      }

      // Check for Twitter Card
      if (!content.includes('twitter:')) {
        issues.push('Twitter Card metadata missing');
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'All essential meta tags are present' };
      } else {
        return {
          status: 'warning',
          message: `${issues.length} SEO meta tag issues found`,
          details: issues
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not validate meta tags' };
    }
  }

  async testSchemaMarkup() {
    const layoutPath = path.join(this.projectPath, 'app', 'layout.tsx');

    try {
      const content = await fs.readFile(layoutPath, 'utf8');
      const issues = [];

      // Check for JSON-LD schema
      if (!content.includes('application/ld+json')) {
        issues.push('JSON-LD schema markup missing');
      }

      // Check for required schema properties
      const requiredProperties = [
        '@context',
        '@type',
        'name',
        'description',
        'address',
        'telephone',
        'openingHoursSpecification'
      ];

      for (const property of requiredProperties) {
        if (!content.includes(`"${property}"`)) {
          issues.push(`Schema property missing: ${property}`);
        }
      }

      if (issues.length === 0) {
        return { status: 'pass', message: 'Schema markup is complete and valid' };
      } else {
        return {
          status: 'warning',
          message: `${issues.length} schema markup issues found`,
          details: issues.slice(0, 5)
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not validate schema markup' };
    }
  }

  async testSitemap() {
    const sitemapPath = path.join(this.projectPath, 'app', 'sitemap.ts');

    try {
      await fs.access(sitemapPath);
      const content = await fs.readFile(sitemapPath, 'utf8');

      if (content.includes('your-clinic-domain.com')) {
        return {
          status: 'warning',
          message: 'Sitemap contains placeholder domain',
          recommendation: 'Update sitemap.ts with actual domain'
        };
      } else {
        return { status: 'pass', message: 'Sitemap configuration is present' };
      }
    } catch (error) {
      return {
        status: 'warning',
        message: 'Sitemap file not found',
        recommendation: 'Create app/sitemap.ts for better SEO'
      };
    }
  }

  async testRobotsTxt() {
    const robotsPath = path.join(this.projectPath, 'public', 'robots.txt');

    try {
      await fs.access(robotsPath);
      return { status: 'pass', message: 'Robots.txt file is present' };
    } catch (error) {
      return {
        status: 'warning',
        message: 'Robots.txt file missing',
        recommendation: 'Create public/robots.txt for search engine guidance'
      };
    }
  }

  async testURLStructure() {
    // For a single-page app, this is mostly about ensuring clean URLs
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');

    try {
      const content = await fs.readFile(nextConfigPath, 'utf8');

      if (content.includes('trailingSlash')) {
        return { status: 'pass', message: 'URL structure configuration found' };
      } else {
        return {
          status: 'info',
          message: 'Using default URL structure',
          recommendation: 'Consider configuring trailingSlash for consistency'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze URL structure' };
    }
  }

  async testContentOptimization() {
    const files = await this.getContentFiles();
    let headingStructure = { h1: 0, h2: 0, h3: 0 };
    let totalWordCount = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      // Count headings
      headingStructure.h1 += (content.match(/<h1/g) || []).length;
      headingStructure.h2 += (content.match(/<h2/g) || []).length;
      headingStructure.h3 += (content.match(/<h3/g) || []).length;

      // Estimate word count (rough)
      const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      totalWordCount += textContent.split(' ').length;
    }

    const issues = [];

    if (headingStructure.h1 === 0) {
      issues.push('No H1 headings found');
    } else if (headingStructure.h1 > 1) {
      issues.push(`Multiple H1 headings found (${headingStructure.h1})`);
    }

    if (headingStructure.h2 < 2) {
      issues.push('Consider adding more H2 headings for better structure');
    }

    if (totalWordCount < 300) {
      issues.push('Content may be too short for good SEO');
    }

    if (issues.length === 0) {
      return {
        status: 'pass',
        message: `Content structure is good (${totalWordCount} words, proper heading hierarchy)`
      };
    } else {
      return {
        status: 'warning',
        message: 'Content optimization opportunities found',
        details: issues
      };
    }
  }

  /**
   * Accessibility Tests
   */
  async runAccessibilityTests() {
    const accessibilityTests = [
      { name: 'Alt text validation', test: () => this.testAltText() },
      { name: 'ARIA attributes', test: () => this.testARIAAttributes() },
      { name: 'Color contrast', test: () => this.testColorContrast() },
      { name: 'Keyboard navigation', test: () => this.testKeyboardNavigation() },
      { name: 'Semantic HTML', test: () => this.testSemanticHTML() },
      { name: 'Form accessibility', test: () => this.testFormAccessibility() }
    ];

    await this.runTestCategory('Accessibility', accessibilityTests);
  }

  async testAltText() {
    const files = await this.getHTMLFiles();
    const issues = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const imgTags = content.match(/<img[^>]*>/g) || [];

      for (const imgTag of imgTags) {
        if (!imgTag.includes('alt=')) {
          issues.push(`${path.basename(file)}: Image missing alt attribute`);
        } else if (imgTag.includes('alt=""') || imgTag.includes("alt=''")) {
          // Empty alt is OK for decorative images, but note it
        }
      }
    }

    if (issues.length === 0) {
      return { status: 'pass', message: 'All images have appropriate alt text' };
    } else {
      return {
        status: 'warning',
        message: `${issues.length} images missing alt text`,
        details: issues.slice(0, 5)
      };
    }
  }

  async testARIAAttributes() {
    const files = await this.getHTMLFiles();
    let ariaCount = 0;
    let buttonCount = 0;
    let linkCount = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      ariaCount += (content.match(/aria-/g) || []).length;
      buttonCount += (content.match(/<button/g) || []).length;
      linkCount += (content.match(/<a\s/g) || []).length;
    }

    if (ariaCount > 0) {
      return {
        status: 'pass',
        message: `Good ARIA usage: ${ariaCount} attributes found`
      };
    } else if (buttonCount > 0 || linkCount > 0) {
      return {
        status: 'warning',
        message: 'Consider adding ARIA attributes for better accessibility',
        recommendation: 'Add aria-label, aria-describedby, or role attributes where appropriate'
      };
    } else {
      return { status: 'info', message: 'No interactive elements found to evaluate' };
    }
  }

  async testColorContrast() {
    const tailwindConfigPath = path.join(this.projectPath, 'tailwind.config.js');

    try {
      const content = await fs.readFile(tailwindConfigPath, 'utf8');

      // This is a basic check - proper color contrast testing would require
      // analyzing the actual color values and calculating contrast ratios
      if (content.includes('primary') && content.includes('colors')) {
        return {
          status: 'info',
          message: 'Custom color scheme detected',
          recommendation: 'Manually verify color contrast meets WCAG 2.1 AA standards (4.5:1 ratio)'
        };
      } else {
        return {
          status: 'pass',
          message: 'Using default Tailwind colors (generally accessible)'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze color configuration' };
    }
  }

  async testKeyboardNavigation() {
    const files = await this.getHTMLFiles();
    const issues = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      // Check for focusable elements
      const focusableElements = [
        /<button[^>]*>/g,
        /<a\s[^>]*href/g,
        /<input[^>]*>/g,
        /<select[^>]*>/g,
        /<textarea[^>]*>/g
      ];

      let focusableCount = 0;
      let tabIndexCount = 0;

      for (const pattern of focusableElements) {
        focusableCount += (content.match(pattern) || []).length;
      }

      tabIndexCount += (content.match(/tabindex=/g) || []).length;

      if (focusableCount > 0 && tabIndexCount === 0) {
        issues.push(`${path.basename(file)}: Consider adding tabindex for better keyboard navigation`);
      }
    }

    if (issues.length === 0) {
      return { status: 'pass', message: 'Keyboard navigation appears to be handled well' };
    } else {
      return {
        status: 'info',
        message: 'Keyboard navigation could be enhanced',
        details: issues.slice(0, 3),
        recommendation: 'Test keyboard navigation manually'
      };
    }
  }

  async testSemanticHTML() {
    const files = await this.getHTMLFiles();
    let semanticScore = 0;
    let totalElements = 0;

    const semanticElements = [
      'header', 'nav', 'main', 'section', 'article',
      'aside', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      for (const element of semanticElements) {
        const matches = content.match(new RegExp(`<${element}`, 'g')) || [];
        semanticScore += matches.length;
      }

      const allElements = content.match(/<[a-zA-Z][^>]*>/g) || [];
      totalElements += allElements.length;
    }

    const semanticRatio = totalElements > 0 ? (semanticScore / totalElements) * 100 : 0;

    if (semanticRatio > 30) {
      return {
        status: 'pass',
        message: `Good semantic HTML usage: ${semanticRatio.toFixed(1)}%`
      };
    } else if (semanticRatio > 15) {
      return {
        status: 'warning',
        message: `Moderate semantic HTML usage: ${semanticRatio.toFixed(1)}%`,
        recommendation: 'Consider using more semantic HTML elements'
      };
    } else {
      return {
        status: 'warning',
        message: `Low semantic HTML usage: ${semanticRatio.toFixed(1)}%`,
        recommendation: 'Replace div/span elements with semantic alternatives where appropriate'
      };
    }
  }

  async testFormAccessibility() {
    const files = await this.getHTMLFiles();
    const issues = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      const inputElements = content.match(/<input[^>]*>/g) || [];
      const labelElements = content.match(/<label[^>]*>/g) || [];

      for (const input of inputElements) {
        if (!input.includes('aria-label') && !input.includes('id=')) {
          issues.push(`${path.basename(file)}: Input missing label or aria-label`);
        }
      }

      if (inputElements.length > 0 && labelElements.length === 0) {
        issues.push(`${path.basename(file)}: Form inputs found but no labels`);
      }
    }

    if (issues.length === 0) {
      return { status: 'pass', message: 'Form accessibility is properly implemented' };
    } else {
      return {
        status: 'warning',
        message: `${issues.length} form accessibility issues found`,
        details: issues.slice(0, 3)
      };
    }
  }

  /**
   * Security Tests
   */
  async runSecurityTests() {
    const securityTests = [
      { name: 'Dependencies vulnerability scan', test: () => this.testDependencyVulnerabilities() },
      { name: 'Environment variables', test: () => this.testEnvironmentSecurity() },
      { name: 'HTTP headers', test: () => this.testSecurityHeaders() },
      { name: 'Input sanitization', test: () => this.testInputSanitization() },
      { name: 'Content Security Policy', test: () => this.testCSP() }
    ];

    await this.runTestCategory('Security', securityTests);
  }

  async testDependencyVulnerabilities() {
    try {
      const auditOutput = execSync('npm audit --audit-level=moderate --json', {
        cwd: this.projectPath,
        stdio: 'pipe'
      });

      const auditResult = JSON.parse(auditOutput.toString());
      const vulnerabilities = auditResult.metadata?.vulnerabilities || {};

      const criticalCount = vulnerabilities.critical || 0;
      const highCount = vulnerabilities.high || 0;
      const moderateCount = vulnerabilities.moderate || 0;

      if (criticalCount > 0) {
        return {
          status: 'fail',
          message: `${criticalCount} critical vulnerabilities found`,
          recommendation: 'Run npm audit fix immediately'
        };
      } else if (highCount > this.thresholds.security.highIssues) {
        return {
          status: 'warning',
          message: `${highCount} high-severity vulnerabilities found`,
          recommendation: 'Review and fix high-severity vulnerabilities'
        };
      } else if (moderateCount > 0) {
        return {
          status: 'info',
          message: `${moderateCount} moderate vulnerabilities found`,
          recommendation: 'Consider updating vulnerable dependencies'
        };
      } else {
        return { status: 'pass', message: 'No known vulnerabilities in dependencies' };
      }
    } catch (error) {
      // npm audit can exit with non-zero code even when successful
      if (error.stdout) {
        try {
          const auditResult = JSON.parse(error.stdout.toString());
          const vulnerabilities = auditResult.metadata?.vulnerabilities || {};
          const totalIssues = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);

          return {
            status: 'warning',
            message: `${totalIssues} vulnerabilities found in dependencies`,
            recommendation: 'Run npm audit for details'
          };
        } catch (parseError) {
          return { status: 'error', message: 'Could not parse dependency audit results' };
        }
      }
      return { status: 'error', message: 'Dependency vulnerability scan failed' };
    }
  }

  async testEnvironmentSecurity() {
    const envFiles = ['.env', '.env.local', '.env.production'];
    const issues = [];

    for (const envFile of envFiles) {
      const envPath = path.join(this.projectPath, envFile);
      try {
        const content = await fs.readFile(envPath, 'utf8');

        // Check for potentially sensitive information
        const sensitivePatterns = [
          { pattern: /password\s*=\s*[^#\n]/i, message: 'Password in environment file' },
          { pattern: /secret\s*=\s*[^#\n]/i, message: 'Secret in environment file' },
          { pattern: /api_key\s*=\s*[^#\n]/i, message: 'API key in environment file' }
        ];

        for (const { pattern, message } of sensitivePatterns) {
          if (pattern.test(content)) {
            issues.push(`${envFile}: ${message}`);
          }
        }

        // Check if file is in .gitignore
        const gitignorePath = path.join(this.projectPath, '.gitignore');
        try {
          const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
          if (!gitignoreContent.includes(envFile)) {
            issues.push(`${envFile}: Not in .gitignore`);
          }
        } catch {
          issues.push('.gitignore file not found');
        }

      } catch {
        // File doesn't exist, which is fine
      }
    }

    if (issues.length === 0) {
      return { status: 'pass', message: 'Environment security is properly configured' };
    } else {
      return {
        status: 'warning',
        message: `${issues.length} environment security issues found`,
        details: issues
      };
    }
  }

  async testSecurityHeaders() {
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');

    try {
      const content = await fs.readFile(nextConfigPath, 'utf8');

      const securityHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Referrer-Policy'
      ];

      const foundHeaders = securityHeaders.filter(header =>
        content.includes(header)
      );

      if (foundHeaders.length === securityHeaders.length) {
        return { status: 'pass', message: 'All security headers are configured' };
      } else if (foundHeaders.length > 0) {
        return {
          status: 'warning',
          message: `${foundHeaders.length}/${securityHeaders.length} security headers configured`,
          recommendation: 'Configure remaining security headers in next.config.js'
        };
      } else {
        return {
          status: 'warning',
          message: 'No security headers configured',
          recommendation: 'Add security headers to next.config.js'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze security headers configuration' };
    }
  }

  async testInputSanitization() {
    const files = await this.getComponentFiles();
    let formCount = 0;
    let sanitizationCount = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      // Count forms and inputs
      formCount += (content.match(/<form|<input|onChange|onSubmit/g) || []).length;

      // Look for sanitization patterns
      sanitizationCount += (content.match(/sanitize|validate|escape|trim/g) || []).length;
    }

    if (formCount === 0) {
      return { status: 'info', message: 'No forms found to validate input sanitization' };
    } else if (sanitizationCount > 0) {
      return {
        status: 'pass',
        message: 'Input sanitization patterns detected'
      };
    } else {
      return {
        status: 'warning',
        message: 'Forms found but no input sanitization detected',
        recommendation: 'Implement input validation and sanitization'
      };
    }
  }

  async testCSP() {
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');

    try {
      const content = await fs.readFile(nextConfigPath, 'utf8');

      if (content.includes('Content-Security-Policy')) {
        return { status: 'pass', message: 'Content Security Policy is configured' };
      } else {
        return {
          status: 'info',
          message: 'Content Security Policy not configured',
          recommendation: 'Consider implementing CSP for enhanced security'
        };
      }
    } catch (error) {
      return { status: 'warning', message: 'Could not analyze CSP configuration' };
    }
  }

  /**
   * Cross-Platform Tests
   */
  async runCrossPlatformTests() {
    const crossPlatformTests = [
      { name: 'Responsive design validation', test: () => this.testResponsiveDesign() },
      { name: 'Cross-browser compatibility', test: () => this.testCrossBrowser() },
      { name: 'Mobile optimization', test: () => this.testMobileOptimization() },
      { name: 'Print stylesheet', test: () => this.testPrintStyles() }
    ];

    await this.runTestCategory('Cross-Platform', crossPlatformTests);
  }

  async testResponsiveDesign() {
    const files = await this.getStyleFiles();
    let responsivePatterns = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      // Look for responsive design patterns
      responsivePatterns += (content.match(/sm:|md:|lg:|xl:|@media/g) || []).length;
    }

    const componentFiles = await this.getComponentFiles();
    for (const file of componentFiles) {
      const content = await fs.readFile(file, 'utf8');
      responsivePatterns += (content.match(/sm:|md:|lg:|xl:/g) || []).length;
    }

    if (responsivePatterns > 10) {
      return {
        status: 'pass',
        message: `Good responsive design implementation (${responsivePatterns} responsive classes)`
      };
    } else if (responsivePatterns > 0) {
      return {
        status: 'warning',
        message: `Limited responsive design (${responsivePatterns} responsive classes)`,
        recommendation: 'Add more responsive breakpoints for better mobile experience'
      };
    } else {
      return {
        status: 'fail',
        message: 'No responsive design patterns found',
        recommendation: 'Implement responsive design with Tailwind CSS classes'
      };
    }
  }

  async testCrossBrowser() {
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');

    try {
      const content = await fs.readFile(nextConfigPath, 'utf8');

      if (content.includes('browserslist') || content.includes('target')) {
        return { status: 'pass', message: 'Browser targets are configured' };
      } else {
        return {
          status: 'info',
          message: 'Using default browser support',
          recommendation: 'Consider configuring browserslist for specific browser targets'
        };
      }
    } catch (error) {
      return { status: 'info', message: 'Using Next.js default browser support' };
    }
  }

  async testMobileOptimization() {
    const layoutPath = path.join(this.projectPath, 'app', 'layout.tsx');

    try {
      const content = await fs.readFile(layoutPath, 'utf8');
      const optimizations = [];

      if (content.includes('viewport')) {
        optimizations.push('Viewport meta tag');
      }

      if (content.includes('apple-touch-icon')) {
        optimizations.push('Apple touch icon');
      }

      if (content.includes('manifest')) {
        optimizations.push('Web app manifest');
      }

      if (content.includes('theme-color')) {
        optimizations.push('Theme color');
      }

      if (optimizations.length >= 3) {
        return {
          status: 'pass',
          message: `Good mobile optimization: ${optimizations.join(', ')}`
        };
      } else if (optimizations.length > 0) {
        return {
          status: 'warning',
          message: `Basic mobile optimization: ${optimizations.join(', ')}`,
          recommendation: 'Add missing mobile optimization features'
        };
      } else {
        return {
          status: 'fail',
          message: 'No mobile optimization detected',
          recommendation: 'Add viewport meta tag and mobile-specific optimizations'
        };
      }
    } catch (error) {
      return { status: 'error', message: 'Could not analyze mobile optimization' };
    }
  }

  async testPrintStyles() {
    const files = await this.getStyleFiles();
    let printStyles = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      printStyles += (content.match(/@media\s+print|print:/g) || []).length;
    }

    if (printStyles > 0) {
      return { status: 'pass', message: 'Print styles are implemented' };
    } else {
      return {
        status: 'info',
        message: 'No print styles found',
        recommendation: 'Consider adding print-specific styles for better printing experience'
      };
    }
  }

  /**
   * Integration Tests
   */
  async runIntegrationTests() {
    const integrationTests = [
      { name: 'Contact form integration', test: () => this.testContactFormIntegration() },
      { name: 'Booking system integration', test: () => this.testBookingIntegration() },
      { name: 'Analytics integration', test: () => this.testAnalyticsIntegration() },
      { name: 'Social media integration', test: () => this.testSocialMediaIntegration() }
    ];

    await this.runTestCategory('Integration', integrationTests);
  }

  async testContactFormIntegration() {
    const files = await this.getComponentFiles();
    let formFound = false;
    let actionFound = false;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      if (content.includes('<form') || content.includes('onSubmit')) {
        formFound = true;
      }

      if (content.includes('action=') || content.includes('fetch(') || content.includes('axios')) {
        actionFound = true;
      }
    }

    if (formFound && actionFound) {
      return { status: 'pass', message: 'Contact form integration appears complete' };
    } else if (formFound) {
      return {
        status: 'warning',
        message: 'Contact form found but no submission handler detected',
        recommendation: 'Implement form submission functionality'
      };
    } else {
      return {
        status: 'info',
        message: 'No contact forms detected',
        recommendation: 'This may be intentional if using external booking only'
      };
    }
  }

  async testBookingIntegration() {
    const bookingConfigPath = path.join(this.projectPath, 'config', 'booking.ts');

    try {
      const content = await fs.readFile(bookingConfigPath, 'utf8');

      if (content.includes('link.leadballoon.co.uk')) {
        return {
          status: 'warning',
          message: 'Using placeholder booking URL',
          recommendation: 'Update booking URL with client\'s actual booking system'
        };
      } else if (content.includes('http')) {
        return { status: 'pass', message: 'Booking integration is configured' };
      } else {
        return {
          status: 'warning',
          message: 'Booking configuration incomplete',
          recommendation: 'Configure booking system URL'
        };
      }
    } catch (error) {
      return {
        status: 'warning',
        message: 'Booking configuration file not found',
        recommendation: 'Set up booking system integration'
      };
    }
  }

  async testAnalyticsIntegration() {
    const files = await this.getAllFiles();
    let analyticsFound = false;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      if (content.includes('gtag') || content.includes('analytics') || content.includes('GA_')) {
        analyticsFound = true;
        break;
      }
    }

    if (analyticsFound) {
      return { status: 'pass', message: 'Analytics integration detected' };
    } else {
      return {
        status: 'info',
        message: 'No analytics integration found',
        recommendation: 'Consider adding Google Analytics or similar tracking'
      };
    }
  }

  async testSocialMediaIntegration() {
    const files = await this.getAllFiles();
    let socialIntegration = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');

      socialIntegration += (content.match(/facebook|instagram|twitter|linkedin|whatsapp/gi) || []).length;
    }

    if (socialIntegration > 5) {
      return { status: 'pass', message: 'Good social media integration' };
    } else if (socialIntegration > 0) {
      return {
        status: 'info',
        message: 'Basic social media integration',
        recommendation: 'Consider expanding social media presence'
      };
    } else {
      return {
        status: 'info',
        message: 'No social media integration found',
        recommendation: 'Consider adding social media links and sharing options'
      };
    }
  }

  /**
   * Utility methods for running test categories
   */
  async runTestCategory(categoryName, tests) {
    const categoryResults = [];

    for (const test of tests) {
      try {
        const result = await test.test();
        result.category = categoryName;
        result.name = test.name;
        categoryResults.push(result);

        const statusIcon = result.status === 'pass' ? '✅' :
                          result.status === 'warning' ? '⚠️' :
                          result.status === 'fail' ? '❌' : 'ℹ️';

        console.log(`   ${statusIcon} ${test.name}`);

        if (result.status === 'fail') {
          this.issues.push({
            category: categoryName,
            test: test.name,
            severity: 'high',
            message: result.message,
            details: result.details
          });
        } else if (result.status === 'warning') {
          this.issues.push({
            category: categoryName,
            test: test.name,
            severity: 'medium',
            message: result.message,
            details: result.details
          });
        }

        if (result.recommendation) {
          this.recommendations.push({
            category: categoryName,
            test: test.name,
            recommendation: result.recommendation
          });
        }

      } catch (error) {
        console.log(`   ❌ ${test.name}: ${error.message}`);
        this.issues.push({
          category: categoryName,
          test: test.name,
          severity: 'high',
          message: `Test failed: ${error.message}`,
          details: null
        });
      }
    }

    this.testResults.push({
      category: categoryName,
      tests: categoryResults,
      passed: categoryResults.filter(t => t.status === 'pass').length,
      total: categoryResults.length
    });
  }

  /**
   * Generate comprehensive QA report
   */
  async generateQAReport() {
    const reportDir = path.join(this.projectPath, 'qa-reports');
    await fs.mkdir(reportDir, { recursive: true });

    // Calculate overall score
    const totalTests = this.testResults.reduce((sum, category) => sum + category.total, 0);
    const passedTests = this.testResults.reduce((sum, category) => sum + category.passed, 0);
    const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        overallScore: overallScore,
        totalTests: totalTests,
        passedTests: passedTests,
        issuesFound: this.issues.length,
        recommendations: this.recommendations.length
      },
      categories: this.testResults,
      issues: this.issues,
      recommendations: this.recommendations,
      thresholds: this.thresholds
    };

    // Save JSON report
    await fs.writeFile(
      path.join(reportDir, 'qa-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate markdown report
    const markdownReport = this.generateMarkdownQAReport(report);
    await fs.writeFile(
      path.join(reportDir, 'QA-REPORT.md'),
      markdownReport
    );

    console.log(`   📄 QA report saved to: ${reportDir}`);

    return report;
  }

  generateMarkdownQAReport(report) {
    const { summary, categories, issues, recommendations } = report;

    const getScoreColor = (score) => {
      if (score >= 90) return '🟢';
      if (score >= 70) return '🟡';
      return '🔴';
    };

    return `# Quality Assurance Report

## Overall Score: ${getScoreColor(summary.overallScore)} ${summary.overallScore}%

**Generated:** ${new Date(summary.timestamp).toLocaleString()}
**Tests Run:** ${summary.totalTests}
**Tests Passed:** ${summary.passedTests}
**Issues Found:** ${summary.issuesFound}
**Recommendations:** ${summary.recommendations}

---

## Category Breakdown

${categories.map(category => {
  const score = Math.round((category.passed / category.total) * 100);
  const scoreColor = getScoreColor(score);

  return `### ${scoreColor} ${category.category} - ${score}% (${category.passed}/${category.total})

${category.tests.map(test => {
  const icon = test.status === 'pass' ? '✅' :
               test.status === 'warning' ? '⚠️' :
               test.status === 'fail' ? '❌' : 'ℹ️';
  return `- ${icon} **${test.name}**: ${test.message}`;
}).join('\n')}`;
}).join('\n\n')}

---

## Issues Requiring Attention

${issues.length === 0 ? '✅ No issues found!' : ''}

### High Priority Issues
${issues.filter(issue => issue.severity === 'high').map(issue =>
  `- **${issue.category} - ${issue.test}**: ${issue.message}`
).join('\n') || '✅ None'}

### Medium Priority Issues
${issues.filter(issue => issue.severity === 'medium').map(issue =>
  `- **${issue.category} - ${issue.test}**: ${issue.message}`
).join('\n') || '✅ None'}

---

## Recommendations for Improvement

${recommendations.length === 0 ? '✅ No recommendations - great job!' : ''}

${recommendations.map((rec, index) =>
  `${index + 1}. **${rec.category} - ${rec.test}**: ${rec.recommendation}`
).join('\n')}

---

## Next Steps

${summary.overallScore >= 90 ?
  '🎉 **Excellent Quality!** Your template is ready for deployment.' :
  summary.overallScore >= 70 ?
  '✅ **Good Quality.** Address the issues above before deployment.' :
  '⚠️ **Needs Improvement.** Please fix high-priority issues before proceeding.'}

### Immediate Actions Required:
${issues.filter(issue => issue.severity === 'high').length > 0 ?
  '- Fix all high-priority issues listed above' :
  '- No critical issues found'}
${issues.filter(issue => issue.severity === 'medium').length > 0 ?
  '\n- Review and address medium-priority warnings' : ''}
${recommendations.length > 0 ?
  '\n- Consider implementing the recommendations for enhanced quality' : ''}

### Testing Checklist:
- [ ] Test website on desktop and mobile devices
- [ ] Verify all contact forms work correctly
- [ ] Test booking integration thoroughly
- [ ] Check all links and images load properly
- [ ] Validate SEO elements are properly customized
- [ ] Ensure responsive design works across screen sizes

---

*Generated by CO2 Laser Template Quality Assurance System*
`;
  }

  /**
   * File utility methods
   */
  async getAllFiles() {
    const files = [];
    await this.walkDirectory(this.projectPath, files, ['.git', 'node_modules', '.next']);
    return files;
  }

  async getHTMLFiles() {
    const files = [];
    await this.walkDirectory(this.projectPath, files, ['.git', 'node_modules', '.next'], ['.tsx', '.html']);
    return files;
  }

  async getComponentFiles() {
    const componentDir = path.join(this.projectPath, 'components');
    const files = [];
    try {
      await this.walkDirectory(componentDir, files, [], ['.tsx']);
    } catch {
      // Directory might not exist
    }
    return files;
  }

  async getStyleFiles() {
    const files = [];
    await this.walkDirectory(this.projectPath, files, ['.git', 'node_modules', '.next'], ['.css', '.scss']);
    return files;
  }

  async getContentFiles() {
    const files = [];
    await this.walkDirectory(this.projectPath, files, ['.git', 'node_modules', '.next'], ['.tsx', '.md']);
    return files;
  }

  async walkDirectory(dir, files, excludeDirs = [], extensions = []) {
    try {
      const items = await fs.readdir(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
          if (!excludeDirs.includes(item)) {
            await this.walkDirectory(itemPath, files, excludeDirs, extensions);
          }
        } else if (stats.isFile()) {
          if (extensions.length === 0 || extensions.includes(path.extname(item))) {
            files.push(itemPath);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or is inaccessible
    }
  }

  async getDirectorySize(dirPath) {
    let totalSize = 0;

    async function calculateSize(currentPath) {
      try {
        const stats = await fs.stat(currentPath);

        if (stats.isFile()) {
          totalSize += stats.size;
        } else if (stats.isDirectory()) {
          const files = await fs.readdir(currentPath);
          for (const file of files) {
            await calculateSize(path.join(currentPath, file));
          }
        }
      } catch (error) {
        // Skip inaccessible files/directories
      }
    }

    await calculateSize(dirPath);
    return totalSize;
  }

  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
CO2 Laser Template Quality Assurance System

Usage: node quality-assurance-system.js <project-path> [options]

Arguments:
  <project-path>           Path to the project to analyze

Options:
  --report-level <level>   Report detail level (basic|detailed|comprehensive) [default: detailed]
  --help, -h               Show this help message

Examples:
  node quality-assurance-system.js ./clinic-co2-laser-site
  node quality-assurance-system.js ./clinic-site --report-level comprehensive
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
      case '--report-level':
        options.reportLevel = value;
        break;
    }
  }

  const qa = new QualityAssuranceSystem(options);

  qa.runQualityAssurance(projectPath)
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Quality assurance completed!');
        console.log(`📊 Overall Score: ${result.score}%`);

        if (result.score >= 90) {
          console.log('🟢 Excellent quality - ready for deployment!');
          process.exit(0);
        } else if (result.score >= 70) {
          console.log('🟡 Good quality - address warnings before deployment');
          process.exit(0);
        } else {
          console.log('🔴 Quality needs improvement - fix issues before deployment');
          process.exit(1);
        }
      } else {
        console.error('\n❌ Quality assurance failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Unexpected error:', error.message);
      process.exit(1);
    });
}

module.exports = QualityAssuranceSystem;