简体中文 | [English](https://github.com/umijs/sula/blob/master/README.en-US.md)

# sula (beta)

> Sula 当前还处于 beta 社区内测阶段，建议在对内生产项目使用，对外生产项目暂时不要使用。

## 旧文档地址

- https://sula.vercel.app/

## 里程碑

非常抱歉，由于最近业务爆发导致没有按照既定里程碑发布 sula 1.0 和 builder，我们根据目前看到业务排期修改里程碑，如下，

- 10月30日：发布 1.0 正式版，以及配套文档
- 11月6日：开源 Sula Builder 前端部分（后端部分还无法给出准确时间点）

[![codecov](https://codecov.io/gh/umijs/sula/branch/master/graph/badge.svg)](https://codecov.io/gh/umijs/sula) [![GitHub Actions status](https://github.com/umijs/sula/workflows/Node%20CI/badge.svg)](https://github.com/umijs/sula) ![npm](https://img.shields.io/npm/v/sula) ![npm](https://img.shields.io/npm/dm/sula)

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

## 🔥 Sula 可视化搭建平台（尝鲜版）

- [sula-builder](https://build.sula.now.sh)

## 🍳 Sula 在线配置化工具

仅通过 JSON 配置就可以完成整个项目的「产品级配置」。

- [sula-cooker](https://cook.sula.now.sh)

<div>
  <img src="https://img.alicdn.com/tfs/TB1l6A_HXY7gK0jSZKzXXaikpXa-2680-1412.png" width="49%"/>
  <img src="https://img.alicdn.com/tfs/TB1VWE5HkT2gK0jSZFkXXcIQFXa-2682-1412.png" width="49%"/>
</div>

## 🥗 Real Sula

[sula-real](https://github.com/umijs/sula-real) 是面向 admin 中台应用场景的 low pro code 解决方案，[预览地址](https://real.sula.now.sh/)。

## 🍙 例子

- [sula-samples](https://github.com/umijs/sula-samples) by umi
- [sula-samples-cra](https://github.com/umijs/sula-samples-cra) by create-react-app

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
  <img src="https://img.alicdn.com/imgextra/i4/O1CN01YCq5ye21DbizEsE8e_!!6000000006951-2-tps-828-1068.png" width="300" />
</div>
