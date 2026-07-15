# @work4lazy/skills

work4lazy 的个人 AI 技能集合。

## 结构

```
skills/
  personal/     ← 个人技能，自动注册到 marketplace
  anthropics/   ← 来自 anthropics/skills 的外部技能（只读，自动同步）
```

## 安装

```bash
# 全局安装
npx skills add work4lazy/skills -g

# 安装到当前项目
npx skills add work4lazy/skills
```

## 自动同步

仓库有两个自动同步工作流：

| Workflow | 触发 | 职责 |
|----------|------|------|
| `Sync Personal Skills` | push 到 `skills/personal/**` | 扫描个人技能目录，更新 `.claude-plugin/marketplace.json` |
| `Sync External Skills` | 每日 UTC 18:00（北京时间次日 02:00）/ 手动触发 | 按 `external-sources.json` 同步外部技能、清理孤儿、更新 marketplace |

### 管理外部源

编辑 `external-sources.json` 增减源，然后手动触发同步即可自动完成下载 + 清理 + marketplace 更新：

```bash
gh workflow run sync-external-skills.yml
```

或 GitHub 页面 → Actions → **Sync External Skills** → **Run workflow**。

### 分组展示

`.claude-plugin/marketplace.json` 定义 `npx skills@latest add` 时的分组，由同步脚本自动维护，无需手动编辑。

## 开发

在 `skills/personal/` 下新建目录并放入 `SKILL.md` 即可新增个人技能，推送后自动注册到 marketplace。
