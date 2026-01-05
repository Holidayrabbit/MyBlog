---
title: "代码块增强功能演示"
date: "2025-01-05"
tags: ["演示", "代码块", "语法高亮"]
excerpt: "展示MyBlog代码块的所有增强功能，包括语法高亮、复制功能、行号显示和行高亮等特性。"
---

# 代码块增强功能演示

这篇文章展示了MyBlog博客系统中代码块的所有增强功能。

## 基本语法高亮

### JavaScript示例

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to MyBlog`;
}

const message = greet("Developer");
console.log(message);
```

### Python示例

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 打印前10个斐波那契数
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")
```

## 行高亮功能

### 高亮单行

```typescript{5}
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';  // 这行被高亮
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin"
};
```

### 高亮多行

```javascript{2,4-6}
function calculate(a, b) {
  const sum = a + b;        // 高亮
  const product = a * b;
  const difference = a - b;  // 高亮
  const quotient = a / b;    // 高亮
  const remainder = a % b;   // 高亮
  return { sum, product };
}
```

### 高亮范围组合

```python{1,3-5,8}
import asyncio  # 高亮

async def fetch_data(url):  # 高亮
    await asyncio.sleep(2)  # 高亮
    return f"Data from {url}"  # 高亮

async def main():
    results = await asyncio.gather(  # 高亮
        fetch_data("api.com/1"),
        fetch_data("api.com/2")
    )
    return results

asyncio.run(main())
```

## 自动行号显示

当代码超过10行时，会自动显示行号：

```rust
// Rust示例 - 快速排序实现
fn quick_sort<T: Ord>(arr: &mut [T]) {
    if arr.len() <= 1 {
        return;
    }

    let pivot_index = partition(arr);
    quick_sort(&mut arr[0..pivot_index]);
    quick_sort(&mut arr[pivot_index + 1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
    let len = arr.len();
    let pivot_index = len / 2;
    arr.swap(pivot_index, len - 1);

    let mut i = 0;
    for j in 0..len - 1 {
        if arr[j] <= arr[len - 1] {
            arr.swap(i, j);
            i += 1;
        }
    }

    arr.swap(i, len - 1);
    i
}
```

## 多种语言支持

### Go语言

```go
package main

import "fmt"

func main() {
    ch := make(chan int, 2)
    ch <- 1
    ch <- 2
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

### Java

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### C++

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    return 0;
}
```

### Shell/Bash

```bash
#!/bin/bash

for file in *.md; do
    echo "Processing: $file"
    wc -l "$file"
done
```

### SQL

```sql
SELECT
    u.name,
    COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC;
```

## 配置文件示例

### JSON

```json
{
  "name": "myblog",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-markdown": "^10.1.0"
  }
}
```

### YAML

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm run build
```

## 行内代码

你可以在文本中使用行内代码，比如 `const name = "value"` 或者 `npm install react`。

## 复制功能测试

每个代码块右上角都有复制按钮，点击可以一键复制代码：

```javascript
// 尝试复制这段代码
const message = "Code block copy feature works!";
console.log(message);
```

## 主题适配

代码块会自动适配Light和Dark主题。试试切换页面右上角的主题按钮，看看代码块的颜色变化！

```typescript
// 这段代码在不同主题下会有不同的配色
type Theme = 'light' | 'dark';

const getCurrentTheme = (): Theme => {
  return document.documentElement.getAttribute('data-theme') as Theme || 'light';
};
```

## 总结

MyBlog的代码块增强功能提供了：

1. ✅ 50+种编程语言的语法高亮
2. ✅ 一键复制代码到剪贴板
3. ✅ 自动显示语言标签
4. ✅ 超过10行自动显示行号
5. ✅ 支持行高亮（单行、多行、范围）
6. ✅ 自动适配Light/Dark主题
7. ✅ 响应式设计，移动端友好
8. ✅ 优雅的滚动条和横向滚动

开始在你的文章中使用这些功能吧！
