/**
 * Script to update GitHub repository description and topics
 * 
 * Usage:
 * 1. Create a GitHub Personal Access Token with 'repo' scope
 * 2. Set it as environment variable: GITHUB_TOKEN=your_token
 * 3. Run: node scripts/update-github-repo.js
 */

const https = require('https');

const REPO_OWNER = 'rezxzer';
const REPO_NAME = 'georgia-flow';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN environment variable is not set');
    console.log('\nTo create a token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Generate new token (classic) with "repo" scope');
    console.log('3. Set it: export GITHUB_TOKEN=your_token (Linux/Mac)');
    console.log('   or: set GITHUB_TOKEN=your_token (Windows)');
    process.exit(1);
}

const description = 'Tourism discovery platform for Georgia - Discover places, events, and local vibes across Georgia 🇬🇪';
const topics = [
    'nextjs',
    'typescript',
    'supabase',
    'tourism',
    'georgia',
    'maps',
    'social-network',
    'react',
    'tailwindcss',
    'vercel'
];

// Update repository description and topics
const updateRepo = () => {
    const data = JSON.stringify({
        description: description,
        topics: topics,
        homepage: 'https://github.com/rezxzer/georgia-flow',
        has_issues: true,
        has_projects: true,
        has_wiki: true
    });

    const options = {
        hostname: 'api.github.com',
        path: `/repos/${REPO_OWNER}/${REPO_NAME}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'Node.js'
        }
    };

    const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ Repository updated successfully!');
                console.log(`📝 Description: ${description}`);
                console.log(`🏷️  Topics: ${topics.join(', ')}`);
            } else {
                console.error(`❌ Error: ${res.statusCode}`);
                console.error('Response:', responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:', error);
    });

    req.write(data);
    req.end();
};

updateRepo();
