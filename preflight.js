const fs = require('fs');
const path = require('path');

const PROJECTS = {
  paradise: {
    name: 'paradise',
    issuesDir: path.join(__dirname, 'issues'),
    aliases: ['paradise', 'paradise-engine'],
  },
  'river-solo': {
    name: 'river-solo',
    issuesDir: path.resolve(__dirname, '..', 'river-solo', 'issues'),
    aliases: ['river-solo', 'river solo', 'riversolo'],
  },
  cymru: {
    name: 'cymru',
    issuesDir: path.resolve(__dirname, '..', 'cymru', 'issues'),
    aliases: ['cymru'],
  },
  playground: {
    name: 'playground',
    issuesDir: path.resolve(__dirname, '..', 'river-playground', 'issues'),
    aliases: ['playground', 'river-playground', 'river playground'],
  },
};

function detectProject(message) {
  if (!message || typeof message !== 'string') return null;
  const lower = message.toLowerCase();

  const issueRefRegex = /(?:([a-z0-9_-]+)#|#\d+\s+(?:in|from|of)\s+)([a-z0-9_-]+)/i;
  const issueMatch = message.match(issueRefRegex);
  if (issueMatch) {
    const projectRef = (issueMatch[1] || issueMatch[2]).toLowerCase();
    for (const [key, config] of Object.entries(PROJECTS)) {
      if (config.aliases.includes(projectRef)) return key;
    }
  }

  for (const [key, config] of Object.entries(PROJECTS)) {
    for (const alias of config.aliases) {
      if (lower.includes(alias.toLowerCase())) return key;
    }
  }

  return null;
}

function loadIssues(projectKey) {
  const config = PROJECTS[projectKey];
  if (!config) return null;

  const result = {
    project: config.name,
    issuesDir: config.issuesDir,
    issues: [],
  };

  if (!fs.existsSync(config.issuesDir)) {
    result.error = 'Issues directory not found';
    return result;
  }

  const files = fs
    .readdirSync(config.issuesDir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort();

  result.issues = files.map((file) => {
    const content = fs.readFileSync(path.join(config.issuesDir, file), 'utf-8');
    return {
      file,
      title: content.split('\n')[0].replace(/^#\s*/, '').trim(),
      content,
    };
  });

  return result;
}

function preflight(message) {
  const projectKey = detectProject(message);
  if (!projectKey) {
    return { detectedProject: null, issues: [] };
  }
  return { detectedProject: projectKey, ...loadIssues(projectKey) };
}

module.exports = { PROJECTS, detectProject, loadIssues, preflight };
