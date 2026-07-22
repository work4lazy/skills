---
name: python-preferences
description: 当处理 Python 代码时使用 — 任何涉及 .py 文件或 python 相关的任务。
---

# Python 开发偏好

## 依赖管理
使用 `uv`管理 Python 项目。切勿手动编辑 `pyproject.toml`始终通过 `uv` 命令以保持 `uv.lock` 同步。如果不确定命令，请查阅 `uv --help`

## 目录布局
当创建新项目或包时：使用 src 布局。将 `[tool.setuptools.packages.find]` 指向 `src`。始终通过 `uv run python -m pkg.module` 运行 — 不要使用文件路径方式，这会破坏包内导入。

## 日志记录

在关键决策点和错误处理处添加日志输出。使用 `loguru` 而非标准库 `logging` 或 `print()`。注意日志级别的正确使用。

**为什么用 loguru**：loguru 开箱即用，无需配置 logger 层级，自动捕获异常堆栈，格式化比标准库简洁。标准库 logging 需要大量样板才能达到同等效果。

## 编码风格：函数优先

尽量用函数式风格编写代码。当满足以下条件之一时可以使用 `class`：
- 必须继承框架基类（如 `nn.Module`、`pydantic.BaseModel`）
- 实现复杂状态机（5 个以上状态转换）
- 框架强制要求（如 Django View 类、DRF Serializer）

**为什么函数优先**：函数天然低耦合、易测试、易组合。类一旦引入继承，测试时需要 mock 的依赖链会急剧膨胀。只在真正需要状态封装或多态时引入类。
