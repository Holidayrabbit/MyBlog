---
title: "再见conda - - uv快速使用教程"
date: "2025-09-28"
tags: ["Python", "uv", "环境管理", "机器学习"]
excerpt: "从一个机器学习项目入手，如何从零开始使用 uv"
---

# 再见conda - - uv快速使用教程

随着 Python 生态的不断发展，虚拟环境管理工具也在推陈出新。`conda` 曾经是数据科学领域的标配，但新兴的 `uv` 工具凭借其速度和简洁性逐渐崭露头角。本文将带你了解 `uv` 与 `conda` 的核心区别，并通过一个机器学习项目的环境管理案例，详细讲解如何从零开始使用 `uv`。

## 一、uv 和 conda 管理 Python 环境的主要区别

### 1. 性能与实现

- **uv**：由 Rust 编写，创建环境和解析依赖速度极快，基于 Python 内置的 `venv` 模块，轻量高效。
- **conda**：由 Python 编写，性能较慢，环境创建时会安装独立的 Python 解释器，资源占用较高。

**重点**：`uv` 追求速度和轻量，`conda` 更注重完整性和隔离。

### 2. 依赖管理

- **uv**：专注于 Python 包管理，支持 `pip` 生态（PyPI），解析依赖快，但不支持非 Python 包。
- **conda**：跨语言包管理，支持 Anaconda 和 conda-forge 仓库，能处理底层依赖（如 MKL 优化的 NumPy）。

**重点**：`uv` 简单高效，`conda` 功能全面。

### 3. 环境创建

- **uv**：依赖系统 Python，创建轻量级虚拟环境（`uv venv`），占用空间小。
- **conda**：创建独立环境（`conda create`），自带 Python 解释器，隔离性强但较重。

**重点**：`uv` 适合快速开发，`conda` 适合复杂隔离场景。

### 4. 使用场景

- **uv**：纯 Python 项目，尤其是需要快速迭代的开发。
- **conda**：数据科学、机器学习，需管理复杂依赖或跨平台一致性。

**总结**：`uv` 是轻量级新星，`conda` 是全能老将。接下来，我们通过一个机器学习项目，实践 `uv` 的用法。

---

## 二、uv cheetsheet

### **1.安装**

```bash
# On Linux.
curl -LsSf https://astral.sh/uv/install.sh | sh

# On macOS
brew install uv

# On Windows.
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# With pip.
pip install uv
```

### 2.常用命令列表

| **命令** | **描述** |
| --- | --- |
| run | 运行命令或脚本 |
| init | 创建一个新项目 |
| add | 向项目中添加依赖项 |
| remove | 从项目中移除依赖项 |
| sync | 更新项目的环境 |
| lock | 更新项目的锁定文件 |
| export | 将项目的锁定文件导出为其他格式 |
| tree | 显示项目的依赖树 |
| tool | 运行和安装由 Python 包提供的命令 |
| python | 管理 Python 版本和安装 |
| pip | 使用兼容 pip 的接口管理 Python 包 |
| venv | 创建虚拟环境 |
| build | 将 Python 包构建为源代码分发包和 wheels |
| publish | 将分发包上传到索引 |
| cache | 管理 uv 的缓存 |
| self | 管理 uv 可执行文件 |
| version | 显示 uv 的版本 |
| generate-shell-completion | 生成 shell 自动补全脚本 |
| help | 显示某个命令的文档 |

### **3. 文件结构 📂**

首先，让我们看看如何用 `uv` 初始化一个新项目。

执行命令：`uv init test-uv`

这会创建一个名为 `test-uv` 的项目，其基本结构如下：

```bash
test-uv
    ├─ .git
    ├─ .gitignore
    ├─ .python-version
    ├─ README.md
    ├─ main.py
    └─ pyproject.toml
```

可以看到，除了 Python 相关的脚本和配置文件，`uv` 还贴心地为我们初始化了 `git` 相关的文件，方便进行版本控制。

**`pyproject.toml`** (项目配置文件，类似 JavaScript 中的 `package.json`)：

```bash
[project]
name = "test-uv"
version = "0.1.0"
description = "Add your description here"
readme = "README.md"
requires-python = ">=3.9"  # 指定项目依赖的 Python 版本
dependencies = []           # 项目的生产依赖列表
```

**`.python-version`** (记录当前项目使用的 Python 版本)：`3.10`

你可以根据需要编辑这个文件来修改项目所用的 Python 版本。

### **4. 运行脚本 🚀**

在 `uv` 中，执行脚本的命令非常简洁：

```bash
uv run <你的脚本或命令>
```

这有点像 JavaScript 生态中的 `npm run dev`。

`uv run` 的执行逻辑：

1. **检查虚拟环境**：检查当前目录是否存在 `.venv` 目录。如果不存在，`uv` 会自动为你创建一个新的虚拟环境。
2. **依赖验证与安装**：验证当前环境是否包含脚本运行所需的所有依赖。如果缺少依赖，`uv` 会自动从 `pyproject.toml` 或 `uv.lock` 文件中读取并安装它们。
3. **隔离执行**：在当前项目的虚拟环境中执行命令，确保不会与其他项目的 Python 环境产生冲突。

**`uv run` vs. 常规 Python 命令对比：**

### **5. 管理依赖 📦**

### **5.1 `add` (添加依赖)**

用于安装包，并自动更新 `pyproject.toml` 和 `uv.lock` (如果存在)。

```bash
# 安装最新版本的包
uv add requests

# 安装指定版本的包 (例如 Flask 版本大于等于 2.0.0)
uv add "flask>=2.0.0"

# 从 Git 仓库安装
uv add git+https://github.com/psf/requests.git
```

可以把 `uv add` 理解为 `uv pip install` 的增强版。它底层也利用了 `pip` 的能力，但额外增加了自动更新项目配置文件的功能。

### **5.2 `remove` (移除依赖)**

用于卸载包，并自动从 `pyproject.toml` 中移除对应的依赖声明。

```bash
uv remove requests
```

### **5.3 `sync` (同步依赖)**

根据锁定文件 (`uv.lock`) 或 `pyproject.toml` 来精确安装或更新环境中的依赖，确保环境的一致性。

```bash
# 同步所有依赖（包括开发依赖）
uv sync

# 仅同步生产依赖
uv sync --production

# 同步依赖，并清理掉锁定文件中不存在的多余包
uv sync --clean
```

### **5.4 `lock` (锁定依赖)**

创建或更新 `uv.lock` 文件。这个文件会记录所有直接和间接依赖的精确版本，确保在不同环境、不同时间都能安装完全相同的依赖版本，实现可复现的构建。

```bash
# 生成新的锁定文件或更新现有锁定文件
uv lock

# 检查是否有可更新的包，但并不实际写入锁定文件 (dry-run)
uv lock --check

# 强制重新解析所有依赖关系并更新锁定文件
uv lock --update
```

### **5.5 `tree` (可视化依赖树)**

用于清晰地展示项目的依赖关系。

```bash
# 显示完整的依赖树
uv tree

# 仅显示指定包 (如 flask) 的依赖路径
uv tree flask

# 反向追溯依赖：查看哪些包依赖了 sqlalchemy
uv tree --reverse sqlalchemy

# 将依赖树输出为 JSON 格式
uv tree --format json
```

---

### **6. 管理 Python 环境 🐍**

`uv` 还能帮助你管理系统中的 Python 安装版本。

基本命令格式：

```bash
uv python [OPTIONS] <COMMAND>
```

常用子命令：

| **命令** | **描述** |
| --- | --- |
| `list` | 列出 `uv` 可发现和可下载的 Python 安装版本 |
| `install` | 下载并安装一个指定的 Python 版本 |
| `find` | 显示当前配置的 Python 安装的具体位置 |
| `pin` | 将当前项目固定使用特定的 Python 版本 |
| `dir` | 显示 `uv` 用来存放其下载的 Python 版本的目录 |
| `uninstall` | 卸载一个由 `uv` 安装的 Python 版本 |

**示例：列出可用的 Python 版本**

```bash
uv python list
```

**示例：安装 Python 版本**

尝试安装一个 `uv python list` 中未明确列为可下载的版本，比如 Python 3.6（假设它在当前 `uv` 版本中不直接支持下载）：

```bash
uv python install python3.6
```

可能会得到错误：

`error: No download found for request: cpython-3.6-macos-aarch64-none`

这是因为 `uv` 的可下载列表中没有这个特定版本和架构的组合。

现在尝试安装一个列表中的可用版本，比如 Python 3.8：

```bash
uv python install python3.8
```

### **7. 智能解决**`requirements.txt`中的依赖冲突

创建一个`requirements.txt`，填入以下内容

```bash
langchain**==**0.3.23
langchain-core**==**0.1.0
lxml**==**5.2.0
```

传统pip安装：

```bash
pip install -r requirements.txt

```

使用uv进行安装：

```bash
uv pip install -r requirements.txt 
```

`pip`会根据文件中列出的顺序逐一下载模块，若遇到版本冲突则会报错，且不会一次性显示所有冲突。修改后需重新开始下载，直到再次遇到冲突，如此反复，直到手动解决所有冲突为止。

相比之下，`uv`更加高效智能，它不会直接下载所有模块，而是先检查依赖是否兼容，并将所有依赖冲突一次性列出，便于用户一次性修改并解决问题。

## 三、uv 使用案例：基于机器学习项目从0到1

假设我们要开发一个简单的机器学习项目：用 scikit-learn 实现一个分类器，并在 Jupyter Notebook 中运行。下面将从环境创建到依赖管理，逐步讲解 `uv` 的使用细节。

### 1. 安装 uv

首先安装 `uv`：

- **通过 pip 安装**：
    
    ```bash
    pip install uv
    
    ```
    
- **检查版本**：
输出类似 `uv 0.1.x`，表示安装成功。
    
    ```bash
    uv --version
    
    ```
    

### 2. 初始化项目并创建虚拟环境

新建一个项目文件夹：

```bash
mkdir ml_project
cd ml_project

```

创建虚拟环境：

```bash
uv venv

```

这会在当前目录下生成一个 `.venv` 文件夹。如果想指定 Python 版本（需系统中已安装）：

```bash
uv venv --python 3.11

```

激活环境：

- **Linux/MacOS**：
    
    ```bash
    source .venv/bin/activate
    
    ```
    
- **Windows**：
    
    ```bash
    .venv\\Scripts\\activate
    
    ```
    

激活后，终端提示符会变为 `(.venv)`，表示已进入虚拟环境。

### 3. 配置项目依赖

**添加依赖到项目**：
可以用 `uv  add`添加依赖，比如下面的numpy，系统会自动更新文件`pyproject.toml`：

```jsx
uv add numpy
```

另外还可以通过 写pyproject.toml更新依赖

机器学习项目需要 scikit-learn、numpy、pandas 和 Jupyter Notebook。我们使用 `pyproject.toml` 管理依赖（更现代化），也可以用 `requirements.txt`。

创建 `pyproject.toml`：

```bash
touch pyproject.toml

```

编辑文件，添加以下内容：

```toml
[project]
name = "ml_project"
version = "0.1.0"
dependencies = [
    "scikit-learn>=1.3.0",
    "numpy>=1.23.0",
    "pandas>=2.0.0",
    "jupyter>=1.0.0"
]

```

同步依赖到虚拟环境：

```bash
uv sync

```

这会从 PyPI 下载并安装所有依赖，速度比 `pip install` 快得多。检查安装：

```bash
uv pip list

```

你会看到列出的包及其版本。

### 4. 编写机器学习代码

创建一个简单的分类器脚本 `train.py`：

```bash
touch train.py
```

编辑内容：

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 加载数据
data = load_iris()
X, y = data.data, data.target

# 划分数据集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 训练模型
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# 预测并评估
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")

```

### 5. 运行代码

无需手动激活环境，直接用 `uv run`：

```bash
uv run python train.py
```

输出类似 `Accuracy: 0.97`，表示模型训练成功。

### 6. 使用 Jupyter Notebook

启动 Notebook：

```bash
uv run jupyter notebook

```

浏览器会打开 Jupyter 界面。新建一个 Notebook，输入以下代码并运行：

```python
import pandas as pd
import numpy as np
from sklearn.datasets import load_iris

data = load_iris()
df = pd.DataFrame(data.data, columns=data.feature_names)
print(df.head())

```

你会看到 Iris 数据集的前几行，说明环境配置正确。

### 7. 更新依赖

如果需要添加新包（如 matplotlib 绘图），直接运行：

```bash
uv add matplotlib

```

这会更新 `pyproject.toml` 并安装包。再次同步：

```bash
uv sync

```

### 8. 删除环境

项目完成后，删除虚拟环境：

```bash
rm -rf .venv

```

简单高效，无残留。

---

## 总结

相比 `conda`，`uv` 的优势在于速度快、占用小、操作简洁。如果你厌倦了 `conda` 的缓慢和臃肿，不妨试试 `uv`，它可能是你新的环境管理利器！

有任何问题或想迁移现有项目到 `uv`？欢迎留言讨论！

