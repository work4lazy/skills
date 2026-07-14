# @work4lazy/skills

work4lazy 的个人 AI 技能集合。

## 安装

要求 [Node.js](https://nodejs.org) 18+。

```bash
# 安装所有技能到全局（所有项目可用）
npx skills add work4lazy/skills -g

# 安装到当前项目
npx skills add work4lazy/skills

# 只安装某个技能
npx skills add work4lazy/skills --skill to-arch

# 查看仓库中有哪些技能
npx skills add work4lazy/skills --list
```

`npx skills` 会自动检测环境中的 AI 工具（Claude Code、OpenCode、Cursor 等），将技能安装到对应的目录。

## 包含的技能

| 技能 | 说明 |
|------|------|
| to-arch | 从对话生成架构蓝图（文件树 + 类型骨架 + Mermaid 图） |
| python-preferences | Python 开发偏好（uv、src 布局、loguru、函数优先） |

## 开发

在 `skills/` 下新建目录，放入 `SKILL.md` 即可新增技能。
