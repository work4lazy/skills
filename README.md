# @work4lazy/skills

work4lazy 的个人 [opencode](https://opencode.ai) AI 技能集合。

## 安装

```bash
# 一键部署到全局（所有项目自动可用）
npx github:work4lazy/skills deploy -g

# 部署到当前项目
npx github:work4lazy/skills deploy -l
```

## 使用

### deploy — 安装技能

```bash
npx github:work4lazy/skills deploy -g          # 安装到 ~/.config/opencode/skills/
npx github:work4lazy/skills deploy -l          # 安装到 ./.opencode/skills/
npx github:work4lazy/skills deploy -g -s       # 符号链接模式，源更新后自动同步
npx github:work4lazy/skills deploy -g -d       # 预览模式，查看要安装的技能
```

### list — 查看已安装技能

```bash
npx github:work4lazy/skills list -a            # 查看全局 + 项目所有技能
npx github:work4lazy/skills list -g            # 仅查看全局技能
npx github:work4lazy/skills list -l            # 仅查看当前项目技能
```

### remove — 卸载技能

```bash
npx github:work4lazy/skills remove -g          # 卸载全局所有技能
npx github:work4lazy/skills remove -g -n to-arch  # 卸载指定技能
npx github:work4lazy/skills remove -l          # 卸载项目所有技能
```

## 开发

```bash
# 新增技能
# 在 skills/ 下新建目录，放入 SKILL.md，CLI 会自动识别
```

## 包含的技能

| 技能 | 说明 |
|------|------|
| to-arch | 从对话生成架构蓝图（文件树 + 类型骨架 + Mermaid 图） |
| python-preferences | Python 开发偏好（uv、src 布局、loguru、函数优先） |

## 原理

opencode 自动从以下路径加载技能：

- 全局: `~/.config/opencode/skills/<name>/SKILL.md`
- 项目: `.opencode/skills/<name>/SKILL.md`

`deploy` 命令将本包中的 `skills/<name>/SKILL.md` 复制到对应路径，opencode 即可自动发现和使用。
