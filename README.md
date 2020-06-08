简体中文 | [English](https://github.com/umijs/sula/blob/master/README.en-US.md)

# sula (alpha)

> Sula 当前还处于 alpha 社区内测阶段，请不要直接在生产环境使用。

[![codecov](https://codecov.io/gh/umijs/sula/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/sula) [![CircleCI](https://circleci.com/gh/umijs/sula/tree/master.svg?style=svg)](https://circleci.com/gh/umijs/sula/tree/master) [![GitHub Actions status](https://github.com/umijs/sula/workflows/Node%20CI/badge.svg)](https://github.com/umijs/sula) ![npm](https://img.shields.io/npm/v/sula) ![npm](https://img.shields.io/npm/dm/sula) ![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)

## 特点

- 💻 **产品级配置**，sula 通过行为链管理实现了渲染组件与用户行为的连接，实现了行为配置，极大扩展了配置范围。
- 🌴 **语义化**，通过渲染插件与行为插件的组合，一段段配置可以语义化的描述UI呈现及用户行为动作。
- 🚀 **开发提效**，sula 提供 4 大配置模板，可以满足80%以上的中台场景，提效明显。
- 🔌 **高扩展性**，sula 通过 ctx 实现了插件与核心组件的通信，配置规则灵活且易于扩展。
- 📦 **开箱即用**，sula 内置请求插件与灵活扩展点、国际化，路由等能力，让开发者更加专注核心功能的开发。
- 📀 **自动 loading**，sula 不侵入式帮助用户完成按钮、超链接、图标点击过程的 loading 管理。

## 📺 视频教程

- [表单快速配置](https://www.bilibili.com/video/BV1rC4y1p71m/) 3分钟
- [查询表格快速配置](https://www.bilibili.com/video/BV1qA411q7kb/) 4分钟
- [Sula-Cooker 的使用](https://www.bilibili.com/video/BV1jz4y197EG/) 3分钟

## 🍳 Sula 在线配置化工具

仅通过 JSON 配置就可以完成整个项目的「产品级配置」。

- [sula-cooker](https://cook.sula.now.sh)

<div>
  <img src="https://img.alicdn.com/tfs/TB1l6A_HXY7gK0jSZKzXXaikpXa-2680-1412.png" width="49%"/>
  <img src="https://img.alicdn.com/tfs/TB1VWE5HkT2gK0jSZFkXXcIQFXa-2682-1412.png" width="49%"/>
</div>

## 🍙 例子

- [sula-samples](https://github.com/umijs/sula-samples) by umi

## 📦 安装

```bash
npm i sula --save
```

## 🔨 用法

```js
import { Form, Table, CreateForm, QueryTable, StepForm, StepQueryTable } from 'sula';
```

## 📋 待完成

- [x] umi-plugin-sula
- [ ] 最终的模板设计
- [ ] 更好的 typescript 支持
- [ ] 文档

## 🔗 友情链接

- [Sula Blogs](https://zhuanlan.zhihu.com/sulajs)


## 讨论群

<div>
  <img src="https://img.alicdn.com/tfs/TB1iE3OCxD1gK0jSZFsXXbldVXa-1242-1602.jpg" width="300" />
</div>
