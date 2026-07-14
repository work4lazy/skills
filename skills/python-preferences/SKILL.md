---
name: python-preferences
description: 当处理 Python 代码时使用 — 任何涉及 .py 文件或 python 相关的任务。
---

# Python 开发偏好

## 依赖管理
当添加、删除或安装任何包时：使用 `uv`（`uv add`、`uv remove`、`uv sync`、`uv run`）。切勿手动编辑 `pyproject.toml` — 始终通过 `uv add`/`uv remove` 操作以保持 `uv.lock` 同步。如果不确定命令，请查阅 `uv --help`

## 目录布局
当创建新项目或包时：使用 src 布局。将 `[tool.setuptools.packages.find]` 指向 `src`。始终通过 `uv run python -m pkg.module` 运行 — 不要使用文件路径方式，这会破坏包内导入。

## 日志记录
在每个函数入口/出口、错误处理器、外部调用和分支决策处，适当添加日志输出。
使用 `loguru`，而非标准库 `logging` 或裸 `print()`。

## 编码风格：函数优先
当编写任何 Python 逻辑（数据转换、业务规则、API 处理器、CLI 内部逻辑）时：
- 优先使用纯函数而非类。使用 `@dataclass(frozen=True)`等作为数据容器，不要使用带方法的 `class`。
- 避免原地修改：不使用 `list.append`、`dict.update` 或 `set.add`。改为返回新副本。
- 链式数据转换：使用 `map`、`filter`、`functools.reduce` 或管道辅助函数 — 避免堆积中间变量。
- 隔离 I/O：将 print、文件读取、网络调用和 `loguru` 日志放在 `main()` 或最外层编排层。保持核心逻辑无副作用。

当 `class` 无法避免时（继承自 `nn.Module`、具有 5+ 个状态转换的复杂状态机，或框架强制要求的基类），可以使用。