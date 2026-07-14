#!/usr/bin/env node

import { existsSync, readdirSync, mkdirSync, cpSync, symlinkSync, rmSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_SOURCE = join(__dirname, '..', 'skills');
const GLOBAL_TARGET = join(homedir(), '.config', 'opencode', 'skills');
const LOCAL_TARGET = join(process.cwd(), '.opencode', 'skills');

function getSourceSkills() {
  if (!existsSync(SKILLS_SOURCE)) {
    console.error(`❌ 未找到技能源目录: ${SKILLS_SOURCE}`);
    process.exit(1);
  }
  return readdirSync(SKILLS_SOURCE, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function getSkillDesc(skillPath) {
  const p = join(skillPath, 'SKILL.md');
  if (!existsSync(p)) return '';
  const m = readFileSync(p, 'utf-8').match(/^description:\s*(.+)$/m);
  return m ? m[1].trim() : '';
}

function cmdDeploy(flags) {
  const target = flags.get('global') ? GLOBAL_TARGET : flags.get('local') ? LOCAL_TARGET : GLOBAL_TARGET;
  const skills = getSourceSkills();
  const label = flags.get('global') ? '全局' : '项目';

  console.log(`📦 源: ${SKILLS_SOURCE}`);
  console.log(`🎯 ${label}目标: ${target}`);
  console.log(`📋 技能: ${skills.join(', ')}`);

  if (flags.get('dryRun')) {
    console.log('🔍 [预览模式] 未执行操作');
    return;
  }

  if (!existsSync(target)) mkdirSync(target, { recursive: true });

  for (const s of skills) {
    const src = join(SKILLS_SOURCE, s);
    const dst = join(target, s);
    if (existsSync(dst)) {
      console.warn(`⚠️  ${s}: 已存在，覆盖...`);
      rmSync(dst, { recursive: true, force: true });
    }
    if (flags.get('symlink')) {
      try {
        symlinkSync(src, dst, 'junction');
        console.log(`🔗 ${s}: 符号链接`);
      } catch (e) {
        console.warn(`  ⚠️ 符号链接失败 (${e.message}), 回退复制`);
        cpSync(src, dst, { recursive: true });
        console.log(`✅ ${s}: 已复制`);
      }
    } else {
      cpSync(src, dst, { recursive: true });
      console.log(`✅ ${s}: 已复制`);
    }
  }
  console.log(`\n🎉 部署完成 → ${target}`);
}

function cmdList(flags) {
  const scopes = [];
  if (flags.get('all') || flags.get('global') || (!flags.get('all') && !flags.get('global') && !flags.get('local')))
    scopes.push({ label: '全局', path: GLOBAL_TARGET });
  if (flags.get('all') || flags.get('local') || (!flags.get('all') && !flags.get('global') && !flags.get('local')))
    scopes.push({ label: '项目', path: LOCAL_TARGET });

  let found = false;
  for (const { label, path: p } of scopes) {
    if (!existsSync(p)) continue;
    found = true;
    const dirs = readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    console.log(`\n📂 ${label} (${p}):`);
    if (!dirs.length) { console.log('   (空)'); continue; }
    for (const d of dirs) {
      const desc = getSkillDesc(join(p, d));
      console.log(`   · ${d}${desc ? ` — ${desc}` : ''}`);
    }
  }
  if (!found) console.log('📭 未安装任何技能');
}

function cmdRemove(flags) {
  const target = flags.get('global') ? GLOBAL_TARGET : flags.get('local') ? LOCAL_TARGET : GLOBAL_TARGET;
  if (!existsSync(target)) { console.log('📭 目标目录不存在'); return; }

  const name = flags.get('name');
  if (name) {
    const dst = join(target, name);
    if (!existsSync(dst)) { console.error(`❌ 技能 "${name}" 未安装`); process.exit(1); }
    rmSync(dst, { recursive: true, force: true });
    console.log(`✅ 已卸载: ${name}`);
  } else {
    const dirs = readdirSync(target, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    if (!dirs.length) { console.log('📭 目标目录为空'); return; }
    for (const d of dirs) {
      rmSync(join(target, d), { recursive: true, force: true });
      console.log(`✅ 已卸载: ${d}`);
    }
    console.log(`\n🎉 共卸载 ${dirs.length} 个技能`);
  }
}

function help() {
  console.log(`@work4lazy/skills — 个人 AI 技能管理工具

用法:
  npx github:work4lazy/skills <命令> [选项]

命令:
  deploy   安装技能到全局或项目
  list     列出已安装技能
  remove   卸载技能
  help     显示帮助

选项:
  -g, --global     全局目录 (~/.config/opencode/skills/)
  -l, --local      项目目录 (.opencode/skills/)
  -s, --symlink    符号链接模式 (仅 deploy)
  -d, --dry-run    预览 (仅 deploy)
  -n, --name <名>  指定技能名 (仅 remove)
  -a, --all        列出所有 (仅 list)

示例:
  npx github:work4lazy/skills deploy -g
  npx github:work4lazy/skills deploy -l -s
  npx github:work4lazy/skills list -a
  npx github:work4lazy/skills remove -g -n to-arch
`);
}

const args = process.argv.slice(2);
const cmd = args[0];
const flags = new Map();

for (let i = 1; i < args.length; i++) {
  const a = args[i];

  if (a === '-n' || a === '--name') {
    if (i + 1 < args.length) flags.set('name', args[++i]);
    continue;
  }

  switch (a) {
    case '-g': case '--global': flags.set('global', true); break;
    case '-l': case '--local': flags.set('local', true); break;
    case '-s': case '--symlink': flags.set('symlink', true); break;
    case '-d': case '--dry-run': flags.set('dryRun', true); break;
    case '-a': case '--all': flags.set('all', true); break;
    default:
      if (a !== 'help' && a !== '--help' && a !== '-h') {
        console.error(`❌ 未知选项: ${a}`);
      }
  }
}

switch (cmd) {
  case 'deploy': cmdDeploy(flags); break;
  case 'list': cmdList(flags); break;
  case 'remove': cmdRemove(flags); break;
  case 'help': case '--help': case '-h': case undefined: help(); break;
  default:
    console.error(`❌ 未知命令: "${cmd}"`);
    help();
    process.exit(1);
}
