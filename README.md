# @work4lazy/skills

work4lazy 的个人 AI 技能集合，由两部分组成：

## 结构

```
skills/
  personal/     ← 个人技能，手动维护
    python-preferences/
    to-arch/
    ...
  external/     ← 外部技能，GitHub Actions 自动同步（只读）
    vercel-labs-agent-skills/
    google-gemini-gemini-skills/
    ...
```

## 安装

需要 [Node.js](https://nodejs.org) 18+。

```bash
# 安装所有技能到全局
npx skills add work4lazy/skills -g

# 安装到当前项目
npx skills add work4lazy/skills
```

## 管理外部技能

1. 编辑 `external-sources.json`，添加要同步的源
2. 在 GitHub 仓库页面 → Actions → **Sync External Skills** → **Run workflow**

或通过 GitHub CLI：

```bash
gh workflow run sync-external-skills.yml
```

## 包含的个人技能

| 技能 | 说明 |
|------|------|
| to-arch | 从对话生成架构蓝图（文件树 + 类型骨架 + Mermaid 图） |
| python-preferences | Python 开发偏好（uv、src 布局、loguru、函数优先） |

## 开发

在 `skills/personal/` 下新建目录放入 `SKILL.md` 即可新增个人技能。
