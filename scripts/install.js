#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function usage() {
  console.log(`polyapi-docs-skill installer

Usage:
  polyapi-docs-skill [--target <project-dir>] [--force]

What it installs into the target project:
  .claude/polyapi-docs-skill/knowledge/*       (full docs pack — ~70 scraped pages + section index)
  .claude/polyapi-docs-skill/AGENTS.md
  .claude/skills/polyapi-platform/SKILL.md     (skill entrypoint, with YAML frontmatter)
  .claude/skills/polyapi-platform/references/  (the 5 field-notes pages that always travel with the skill)

Notes:
  - Run this inside the project where you want Claude Code to use the PolyAPI docs.
  - The installer vendors the knowledge pack into the target project so the skill has local files to read.
  - If you only want the skill + field notes (no full docs pack), use \`npx skills add <owner>/<repo>\` instead.
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

function copyRecursive(src, dest, force = true) {
  const stat = fs.statSync(src); // follows symlinks by default
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), force);
    }
    return;
  }
  ensureDir(path.dirname(dest));
  if (fs.existsSync(dest) && !force) {
    throw new Error(`Refusing to overwrite existing file without --force: ${dest}`);
  }
  fs.copyFileSync(src, dest);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const repoRoot = path.resolve(__dirname, '..');
  const targetRoot = path.resolve(args.target);

  if (!fs.existsSync(targetRoot) || !fs.statSync(targetRoot).isDirectory()) {
    throw new Error(`Target directory does not exist: ${targetRoot}`);
  }

  const vendorRoot = path.join(targetRoot, '.claude', 'polyapi-docs-skill');
  const skillDir = path.join(targetRoot, '.claude', 'skills', 'polyapi-platform');

  const sourceKnowledge = path.join(repoRoot, 'knowledge');
  const sourceAgents = path.join(repoRoot, 'AGENTS.md');
  const sourceSkillDir = path.join(repoRoot, 'skills', 'polyapi-platform');

  // Guard: if we'd overwrite user edits, require --force.
  const skillTarget = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillTarget) && !args.force) {
    throw new Error(`Refusing to overwrite existing file without --force: ${skillTarget}`);
  }

  // Vendor the full docs pack (with SECTION_INDEX and all 70 scraped pages).
  copyRecursive(sourceKnowledge, path.join(vendorRoot, 'knowledge'));
  copyRecursive(sourceAgents, path.join(vendorRoot, 'AGENTS.md'));

  // Install the skill (SKILL.md + references/ alongside).
  copyRecursive(sourceSkillDir, skillDir);

  const summary = {
    target: targetRoot,
    installed: {
      docsPack: vendorRoot,
      skill: skillDir,
      sectionIndex: path.join(vendorRoot, 'knowledge', 'SECTION_INDEX.md'),
    },
    next_steps: [
      'Open Claude Code in the target project.',
      'Ask Claude to use the PolyAPI platform skill or the local PolyAPI docs.',
      'If you reinstall over an existing skill, pass --force.',
    ],
  };

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
