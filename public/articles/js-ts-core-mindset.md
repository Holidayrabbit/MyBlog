---
title: "JS / TS 核心思维速学：从混乱到可控"
date: "2025-11-17"
tags: ["JavaScript", "TypeScript"]
excerpt: "这是一篇介绍javascript和typescript核心设计思路的文章。"
---

# JS / TS 核心思维速学：从混乱到可控

这是一篇面向已经有一定编程基础、希望在较短时间内吃透 JavaScript 与 TypeScript 核心设计思路的开发者的文章。重点不在罗列 API，而在建立一套可以迁移和扩展的“语言模型”：理解语言的骨架与约束，而不是死记语法细节。

全文分为两部分：
- **第一部分：JavaScript 的三大核心模型**——类型系统、对象模型、异步模型
- **第二部分：TypeScript 的类型思维**——静态类型、泛型与工具类型、可辨识联合

---

## 一、JavaScript：在混乱中寻找秩序

### 1. 值与类型：理解 JS 类型系统的边界

JavaScript 只有少量原始类型：
- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `symbol`
- `bigint`

以及一个统一的复杂类型：`object`（包括数组、函数、日期等）。

`typeof` 是理解 JS 类型系统的起点：

```javascript
typeof "Hello"      // "string"
typeof 100          // "number"
typeof true         // "boolean"
typeof {}           // "object"
typeof []           // "object"
typeof (() => {})   // "function"
typeof undefined    // "undefined"
typeof null         // "object"  // 历史遗留问题
```

需要特别注意：
- `typeof null === "object"` 是规范级别的历史包袱，只能接受并绕开
- 数组本质上是对象，因此 `typeof [] === "object"`
- 函数在规范中属于对象的一个子类型，因此单独返回 `"function"`

#### 包装对象与隐式复杂性

原始值之所以可以调用方法（例如 `"hello".toUpperCase()`），是因为引擎在内部临时创建了包装对象：

```javascript
let greeting = "hello";
let loudGreeting = greeting.toUpperCase(); 
// 类似于 (new String(greeting)).toUpperCase()
```

对于日常开发，有两条简单实践：
- 不主动使用 `new String` / `new Number` / `new Boolean`
- 将其视为实现细节，只需要知道“原始值会被临时包装成对象以便访问方法”

#### 隐式类型转换与相等比较

JS 在算术运算、逻辑运算和宽松相等比较中会执行复杂的隐式类型转换：

```javascript
"5" + 1    // "51"
"5" - 1    // 4
true + 1   // 2
false * 10 // 0
```

逻辑上下文中，值会被转为布尔值。需要记住的“falsy”集合只有：
- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`（空字符串）

其他所有值（包括 `[]`、`{}`）都被视为 `true`。

在比较运算上，务必区分：
- **严格相等 `===`**：不进行类型转换，类型不同直接为 `false`
- **宽松相等 `==`**：会触发复杂的隐式转换，是大量 bug 的来源

建议的实践：
- 统一使用 `===` 和 `!==`
- 只在需要同时判断 `null` 与 `undefined` 时，使用 `x == null` 这一少数特例

核心结论：
- 不依赖隐式类型转换
- 把 `===` 当作默认的比较方式

---

### 2. 原型与原型链：对象委托，而非类继承

JavaScript 的对象系统围绕一个核心机制：`[[Prototype]]` 链接。每个对象内部都有一个隐藏的 `[[Prototype]]` 指针，指向另一个对象；多个对象顺次相连构成原型链。

属性查找规则：
1. 先在对象自身查找属性
2. 找不到则沿 `[[Prototype]]` 向上查找
3. 一直到 `null` 为止，若仍未找到则返回 `undefined` 或抛错

这是一个单向链表式的委托模型，而非传统意义上的“类继承”。

#### 创建原型链的几种方式

**方式一：`Object.create`（最直观）**

```javascript
const humanPrototype = {
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

const linus = Object.create(humanPrototype);
linus.name = "Linus Torvalds";

linus.greet(); // 从原型上委托到 greet
```

**方式二：构造函数 + `prototype`**

```javascript
function Human(name) {
  this.name = name;
}

Human.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name}`);
};

const ada = new Human("Ada Lovelace");
ada.greet();
```

`new` 做了四件事：
1. 创建一个空对象
2. 将其 `[[Prototype]]` 指向构造函数的 `prototype`
3. 以该对象为 `this` 执行构造函数
4. 默认返回该对象

**方式三：`class` 语法（语法糖）**

```javascript
class Human {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
```

`class` 在语义上仍然基于原型委托，只是提供了更熟悉的语法形式。理解 JS 对象模型的关键在于：
- 本质上只有对象与原型链
- `class` / 构造函数都是对“对象委托”的封装

设计建议：
- 理解并接受“对象委托”这一模型，而不是生搬硬套传统类继承体系
- 更倾向组合与委托，而非深层继承树

---

### 3. 作用域与闭包：函数如何“记住”环境

JS 使用 **词法作用域（Lexical Scope）**：变量的可见范围由“代码写在哪里”决定，而不是“函数在哪里被调用”决定。

#### 词法作用域与作用域链

```javascript
const globalVar = "global";

function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(innerVar);
    console.log(outerVar);
    console.log(globalVar);
  }

  inner();
}
```

变量查找逻辑：
1. 先在当前函数作用域查找
2. 再向外一层作用域查找
3. 一直到全局作用域

这一链式结构就是作用域链，与原型链类似，但作用于“标识符解析”而非“属性查找”。

#### `var` 的问题与 `let` / `const` 的改进

`var` 只有函数作用域，并且存在“变量提升”（hoisting）：

```javascript
function testVar() {
  console.log(myVar); // undefined
  var myVar = 10;
}
```

循环中的典型陷阱：

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 10);
}
// 输出: 3, 3, 3
```

原因在于：三个回调共享同一个函数级变量 `i`，执行时该值已变为 3。

使用 `let` 引入块级作用域，可自然消除该问题：

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 10);
}
// 输出: 0, 1, 2
```

建议的实践：
- 默认使用 `const`
- 只有确实需要重新赋值时才使用 `let`
- 避免使用 `var`

#### 闭包：函数与其词法环境的绑定

**闭包**是指：函数在其定义的作用域之外被调用时，仍然能够访问该作用域中的变量。

```javascript
function makeGreeter(greeting) {
  return function (name) {
    console.log(`${greeting}, ${name}!`);
  };
}

const greetEn = makeGreeter("Hello");
greetEn("world"); // 仍可访问 greeting
```

本质上：
- 返回的函数持有对其词法作用域的引用
- 该作用域因此不会被垃圾回收

闭包常用于：
- 封装私有状态
- 高阶函数与函数式编程
- 实现模块化（在早期无模块系统时）

---

### 4. 异步模型：事件循环与 Promise / async-await

JavaScript 依赖 **单线程 + 事件循环** 实现高并发。运行时环境（浏览器或 Node.js）提供：
- 调用栈（Call Stack）
- 后台异步 API（如 `setTimeout`、`fetch`）
- 任务队列（Task Queue）
- 事件循环（Event Loop）

示例：

```javascript
console.log("A");

setTimeout(() => {
  console.log("C");
}, 0);

console.log("B");
// 输出顺序: A, B, C
```

关键点：
- `setTimeout(fn, 0)` 并非“立即执行”，而是“当前同步任务执行完之后尽快执行”
- 回调函数在任务队列中排队，等待调用栈为空时被调度执行

#### 从回调到 Promise

多层嵌套回调容易导致“回调地狱”与控制反转问题。Promise 将异步结果封装为一个状态机对象：
- `pending`
- `fulfilled`
- `rejected`

链式写法：

```javascript
doTask1()
  .then(result1 => doTask2(result1))
  .then(result2 => doTask3(result2))
  .then(finalResult => {
    console.log(finalResult);
  })
  .catch(err => {
    console.error(err);
  });
```

优势：
- 逻辑线性，从上到下
- 集中式错误处理（单个 `catch`）

#### `async/await`：异步代码的最终形态

`async/await` 是 Promise 之上的语法糖，使异步代码看起来接近同步写法：

```javascript
async function process() {
  try {
    const r1 = await doTask1();
    const r2 = await doTask2(r1);
    const r3 = await doTask3(r2);
    console.log(r3);
  } catch (err) {
    console.error(err);
  }
}
```

实践建议：
- 内部业务逻辑统一使用 `async/await`
- 理解其背后仍然基于 Promise 与事件循环

---

## 二、TypeScript：为混乱施加纪律

### 1. TypeScript 的定位与编译模型

TypeScript 是 JavaScript 的**严格超集**：
- 任何合法 JS 代码都是合法 TS 代码
- TS 在 JS 之上添加静态类型系统
- TS 代码经过编译（通常使用 `tsc`）输出纯 JS，在运行时不会有类型检查

静态类型的价值主要体现在：
- 协作开发中的“可执行文档”（类型即契约）
- 大规模重构时的安全网
- 将大量“低级错误”提前到编译期暴露

---

### 2. 基础类型、接口与 `any` / `unknown`

#### 显式类型与函数签名

```typescript
let kernelVersion: string = "5.18";
let majorRelease: number = 5;
let isStable: boolean = true;

function formatVersion(major: number, minor: number): string {
  return `${major}.${minor}`;
}

function logMessage(message: string): void {
  console.log(message);
}
```

显式类型的作用：
- 编译期捕获类型不匹配
- 让函数使用方式一目了然（参数与返回值）

#### 使用 `interface` / `type` 定义结构

```typescript
interface Commit {
  hash: string;
  author: string;
  message: string;
  revertedFrom?: string; // 可选属性
}

function processCommit(commit: Commit): void {
  console.log(commit.message);
}
```

`interface` 与 `type` 的常见分工：
- `interface`：描述对象形状
- `type`：别名、联合类型等

#### 谨慎使用 `any`，优先使用 `unknown`

`any` 会关闭该值上的所有类型检查：

```typescript
let value: any = "str";
value = 123;            // 允许
value.nonExistMethod(); // 编译器也不会报错
```

而 `unknown` 则更安全：

```typescript
function process(value: unknown) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

建议：
- 将 `any` 视为迁移旧项目时的临时方案
- 在不确定类型时优先用 `unknown`，配合类型守卫

---

### 3. 泛型：类型参数化与复用

泛型可以看作“类型的参数”，以占位符代替具体类型，由使用者在调用时提供。

#### 基本泛型函数

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const s = identity("str"); // 推断 T 为 string
const n = identity(123);   // 推断 T 为 number
```

#### 泛型与数组

```typescript
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const nums = [1, 2, 3];
const firstNum = getFirstElement(nums); // number | undefined
```

#### 泛型约束（`extends`）

当算法需要使用某些属性时，可以通过约束泛型：

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");
logLength([1, 2, 3]);
// logLength(123); // 编译错误
```

#### 泛型接口

```typescript
interface ResponsePayload<T> {
  success: boolean;
  data: T;
  error?: string;
}

const userResponse: ResponsePayload<{ name: string; id: number }> = {
  success: true,
  data: { name: "linus", id: 1 }
};
```

---

### 4. 常用工具类型：像操作数据一样操作类型

TypeScript 内置了一批基于泛型的工具类型，用于从已有类型派生新类型。

#### `Partial<T>`：将属性全部变为可选

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

function updateUser(id: number, patch: Partial<User>) {
  // 可以只更新部分字段
}
```

适合用于“部分更新”场景（如 PATCH 接口）。

#### `Readonly<T>`：不可变视图

```typescript
const initialConfig = {
  apiUrl: "/api",
  timeout: 5000
};

const config: Readonly<typeof initialConfig> = initialConfig;
// config.timeout = 10000; // 编译错误
```

用于保护不应被修改的配置数据。

#### `Pick<T, K>` 与 `Omit<T, K>`：裁剪类型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  lastLogin: Date;
}

type UserProfile = Pick<User, "id" | "name" | "email">;
type UserForLogging = Omit<User, "passwordHash">;
```

通过从统一的核心模型派生不同“视图”，可保持类型定义的一致性与可维护性。

#### `Record<K, T>`：键值映射

```typescript
type Feature = "darkMode" | "betaAccess" | "newUserOnboarding";

const featureFlags: Record<Feature, boolean> = {
  darkMode: true,
  betaAccess: false,
  newUserOnboarding: true
};
```

相较于 `{ [key: string]: T }`，`Record<K, T>` 能避免键名拼写错误等问题。

---

### 5. 可辨识联合：让非法状态不可表示

现实业务中经常出现“多种互斥状态”的场景，例如网络请求：
- 加载中
- 成功
- 失败

如果用多个布尔值与可选字段来表示，容易产生各种非法组合。可辨识联合通过“辨识字段”精确建模状态。

#### 定义联合类型

```typescript
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: string;
}

interface ErrorState {
  status: "error";
  error: Error;
}

type NetworkState = LoadingState | SuccessState | ErrorState;
```

#### 利用辨识字段进行类型收窄

```typescript
function render(state: NetworkState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`;
    case "error":
      return `Error: ${state.error.message}`;
  }
}
```

在每个 `case` 分支中，TypeScript 会自动收窄 `state` 的类型，使访问属性时类型安全。

#### 穷尽性检查（`never`）

当为联合类型新增成员时，可通过 `never` 辅助检查所有分支是否处理完整：

```typescript
function renderState(state: NetworkState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return state.data;
    case "error":
      return state.error.message;
    default: {
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
    }
  }
}
```

若后续为 `NetworkState` 新增其他状态而未在 `switch` 中处理，编译器会在 `never` 赋值处报错，从而强制更新所有相关逻辑。

---

## 结语：用模型理解语言，而非堆砌语法细节

这篇文章并未尝试覆盖 JavaScript 与 TypeScript 的所有特性，而是聚焦于构成它们“性格”的关键模型：
- JavaScript：原始类型与隐式转换、原型委托、词法作用域与闭包、事件循环与异步
- TypeScript：静态类型系统、泛型与工具类型、可辨识联合与穷尽性检查

在日常开发中，更推荐围绕这些模型来思考问题：
- 新特性如何映射到已有模型之上
- 代码是否在有意避开语言的“坏部分”
- 是否利用类型系统表达业务约束，让非法状态在类型层面就无法出现

当这些模型足够清晰时，API 文档与框架细节就只是可随时查阅的“词典”，而不再是学习的主要负担。


