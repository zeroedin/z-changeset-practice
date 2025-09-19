#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface Release {
  version: string;
  url: string;
}

interface TagData {
  releases: Release[];
  generatedAt: string;
}

async function generateTagData(): Promise<void> {
  try {
    console.log('Generating releases data...');
    
    // Get all git tags that start with 'v'
    const gitTagsOutput = execSync('git tag -l "v*"', { 
      encoding: 'utf8',
      cwd: process.cwd()
    });
    
    // Split by newlines and filter out empty strings
    const tags = gitTagsOutput
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .sort((a, b) => {
        // Sort tags by version (semantic versioning)
        const aVersion = a.replace('v', '');
        const bVersion = b.replace('v', '');
        return aVersion.localeCompare(bVersion, undefined, { numeric: true });
      });
    
    // Create releases array with version and URL pairs
    const releases: Release[] = tags.map(tag => ({
      version: tag,
      url: `https://z-changeset-practice.netlify.app/${tag}/`
    }));
    
    const tagData: TagData = {
      releases,
      generatedAt: new Date().toISOString()
    };
    
    // Ensure _site directory exists
    const siteDir = join(process.cwd(), 'docs');
    mkdirSync(siteDir, { recursive: true });
    
    // Write the JSON file
    const outputPath = join(siteDir, 'releases.json');
    writeFileSync(outputPath, JSON.stringify(tagData, null, 2));
    
    console.log(`✅ Generated releases.json with ${releases.length} releases`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`🏷️  Releases: ${releases.map(r => r.version).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error generating tag data:', error);
    process.exit(1);
  }
}

// Run the script
generateTagData();
