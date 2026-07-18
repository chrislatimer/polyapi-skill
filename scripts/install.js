#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function usage() {
  console.log(`polyapi-docs-skill installer

Usage:
  polyapi-docs-skill [--target <project-dir>] [--force]

What it installs into the target project:
  .claude/polyapi-docs-skill/knowledge/*
  .claude/polyapi-docs-skill/AGENTS.md
  .claude/skills/polyapi-platform.md

Notes:
  - Run this inside the project where you want Claude Code to use the PolyAPI docs.
  - The installer vendors the knowledge pack into the target project so the skill has local files to read.
`);
}

function parseArgs(argv) {
  const out = { target: process.cwd(), force: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--target') {
      out.target = argv[++i];
    } else if (arg === '--force') {
      out.force = true;
    } else if (arg === '--help' || arg === '-h') {
      out.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return out;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function writeFileSafe(dest, content, force) {
  if (fs.existsSync(dest) && !force) {
    throw new Error(`Refusing to overwrite existing file without --force: ${dest}`);
  }
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content, 'utf8');
}

function relPosix(fromDir, toPath) {
  return path.relative(fromDir, toPath).split(path.sep).join('/');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const repoRoot = path.resolve(__dirname, '..');
  const targetRoot = path.resolve(args.target);
  const vendorRoot = path.join(targetRoot, '.claude', 'polyapi-docs-skill');
  const targetSkillDir = path.join(targetRoot, '.claude', 'skills');
  const sourceKnowledge = path.join(repoRoot, 'knowledge');
  const sourceAgents = path.join(repoRoot, 'AGENTS.md');
  const sourceSectionIndex = path.join(vendorRoot, 'knowledge', 'SECTION_INDEX.md');

  if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
    throw new Error(`Target directory does not exist: ${targetRoot}`);
  }

  copyRecursive(sourceKnowledge, path.join(vendorRoot, 'knowledge'));
  copyRecursive(sourceAgents, path.join(vendorRoot, 'AGENTS.md'));

  const skillPath = path.join(targetSkillDir, 'polyapi-platform.md');
  const relSectionIndex = relPosix(targetSkillDir, sourceSectionIndex);
  const relKnowledgeDir = relPosix(targetSkillDir, path.join(vendorRoot, 'knowledge'));
  const relPagesGlob = `${relKnowledgeDir}/pages/`;

  const skillText = `# PolyAPI platform skill

Use this skill when the task involves building, debugging, or explaining anything that depends on PolyAPI.

## When to use

- API Function Training
- Generated SDK usage
- Authentication, API keys, SSO, or MFA
- Canopy applications and CRUD flows
- Vari Variables or Tabi Tables
- Jobs, webhooks, GraphQL subscriptions, logging, schemas, or snippets
- Project Glide or the GitHub Copilot extension

## Workflow

1. Read \`${relSectionIndex}\`.
2. Find the matching PolyAPI section.
3. Read the relevant files under \`${relPagesGlob}\`.
4. Use the page \`Source:\` URL when you need to justify behavior.
5. Synthesize multiple pages when the workflow spans several features.

## Lookup map

- API training: \`${relPagesGlob}api_functions__*.md\`
- SDKs: \`${relPagesGlob}generated_sdks__*.md\`
- Auth: \`${relPagesGlob}authentication__*.md\`
- Canopy: \`${relPagesGlob}canopy__*.md\`
- Variables: \`${relPagesGlob}vari_variables__*.md\`
- Tables: \`${relPagesGlob}tabi_tables__*.md\`
- Webhooks: \`${relPagesGlob}webhooks__*.md\`
- GraphQL subscriptions: \`${relPagesGlob}graphql_subscriptions__*.md\`
- Jobs: \`${relPagesGlob}jobs__*.md\`
- Logging: \`${relPagesGlob}logging__*.md\`
- Schemas: \`${relPagesGlob}schemas__*.md\`
- Snippets: \`${relPagesGlob}snippets__*.md\`
- Environments: \`${relPagesGlob}environments__*.md\`
- Project Glide: \`${relPagesGlob}project_glide__*.md\`
- GitHub Copilot extension: \`${relPagesGlob}copilot__*.md\`

## Constraints

- Do not invent undocumented PolyAPI behavior.
- Prefer page-level files over the full combined export.
- If the docs are ambiguous or incomplete, say that directly.
`;

  writeFileSafe(skillPath, skillText, args.force);

  const summary = {
    target: targetRoot,
    installed: {
      vendorRoot,
      skillPath,
      sectionIndex: sourceSectionIndex,
    },
    next_steps: [
      'Open Claude Code in the target project.',
      'Ask Claude to use the PolyAPI platform skill or the local PolyAPI docs.',
      'If you reinstall over an existing skill file, pass --force.'
    ]
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
