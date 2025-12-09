#!/usr/bin/env node

/**
 * Release Script for Obsidian Code Runner Plugin
 * 
 * This script automates the release process:
 * 1. Builds the plugin for production
 * 2. Creates a release directory with only necessary files
 * 3. Zips the release for distribution
 * 
 * Usage: npm run release
 */

import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const releaseDir = path.join(rootDir, 'release');
const zipPath = path.join(rootDir, 'release.zip');

// Files needed for Obsidian plugin distribution
const REQUIRED_FILES = [
    'main.js',
    'manifest.json',
    'styles.css'
];

/**
 * Execute a command and log output
 */
function exec(command, cwd = rootDir) {
    console.log(`\n→ ${command}`);
    try {
        execSync(command, {
            cwd,
            stdio: 'inherit',
            shell: true
        });
    } catch (error) {
        console.error(`✗ Command failed: ${command}`);
        process.exit(1);
    }
}

/**
 * Clean previous release artifacts
 */
function cleanRelease() {
    console.log('\n📦 Cleaning previous release...');

    if (fs.existsSync(releaseDir)) {
        fs.removeSync(releaseDir);
        console.log('  ✓ Removed release directory');
    }

    if (fs.existsSync(zipPath)) {
        fs.removeSync(zipPath);
        console.log('  ✓ Removed release.zip');
    }
}

/**
 * Build the plugin
 */
function buildPlugin() {
    console.log('\n🔨 Building plugin...');
    exec('npm run build');
    console.log('  ✓ Build completed');
}

/**
 * Create release directory with required files
 */
function createReleaseDir() {
    console.log('\n📂 Creating release directory...');

    // Create release directory
    fs.ensureDirSync(releaseDir);

    // Copy required files
    for (const file of REQUIRED_FILES) {
        const srcPath = path.join(rootDir, file);
        const destPath = path.join(releaseDir, file);

        if (!fs.existsSync(srcPath)) {
            console.error(`✗ Required file not found: ${file}`);
            process.exit(1);
        }

        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied ${file}`);
    }
}

/**
 * Create zip archive
 */
function createZip() {
    return new Promise((resolve, reject) => {
        console.log('\n📦 Creating release.zip...');

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });

        output.on('close', () => {
            const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
            console.log(`  ✓ Created release.zip (${sizeMB} MB)`);
            resolve();
        });

        archive.on('error', (err) => {
            console.error('✗ Error creating zip:', err);
            reject(err);
        });

        archive.pipe(output);
        archive.directory(releaseDir, false);
        archive.finalize();
    });
}

/**
 * Display release summary
 */
function displaySummary() {
    const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'));

    console.log('\n' + '═'.repeat(60));
    console.log('✨ Release Package Created Successfully!');
    console.log('═'.repeat(60));
    console.log(`\nPlugin: ${manifest.name} v${manifest.version}`);
    console.log(`\n📁 Release folder: ${path.relative(rootDir, releaseDir)}/`);
    console.log(`📦 Distribution zip: ${path.relative(rootDir, zipPath)}`);
    console.log('\nContents:');
    REQUIRED_FILES.forEach(file => console.log(`  • ${file}`));
    console.log('\n🚀 Next Steps:');
    console.log('  1. Test the plugin by copying release/ to your vault/.obsidian/plugins/');
    console.log('  2. Create a GitHub release and upload release.zip');
    console.log('  3. Users extract the zip into their .obsidian/plugins/ folder');
    console.log('═'.repeat(60) + '\n');
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Obsidian Code Runner - Release Builder');
    console.log('═'.repeat(60));

    try {
        cleanRelease();
        buildPlugin();
        createReleaseDir();
        await createZip();
        displaySummary();
    } catch (error) {
        console.error('\n✗ Release failed:', error.message);
        process.exit(1);
    }
}

main();
