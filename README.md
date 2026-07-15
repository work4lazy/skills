# @work4lazy/skills

work4lazy 的个人 AI 技能集合。

## 结构

```
skills/
  personal/     ← 个人技能，手动维护
  external/     ← 外部技能，GitHub Actions 自动同步（只读）
```

## 安装

```bash
# 全局安装
npx skills add work4lazy/skills -g

# 安装到当前项目
npx skills add work4lazy/skills
```

## 管理外部技能

编辑 `external-sources.json` 添加要同步的源，然后在 Actions 手动触发：

```bash
gh workflow run sync-external-skills.yml
```

或 GitHub 页面 → Actions → **Sync External Skills** → **Run workflow**。

## 开发

在 `skills/personal/` 下新建目录并放入 `SKILL.md` 即可新增个人技能。
