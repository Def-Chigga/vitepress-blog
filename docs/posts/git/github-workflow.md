---
title: GitHub Workflow
categories: [Git]
tags: [Git, GitHub]
---

# GitHub Workflow

## 概述

本文档基于实际项目中的 GitHub Actions 工作流配置，详细说明 npm 包发布和 VitePress 静态站点部署的最佳实践方案。

## 1. 包发布工作流（Publish Workflow）

### 1.1 完整配置文件

```yaml
name: Publish to npm

# 触发条件：仅当推送以 v 开头的标签时执行
on:
  push:
    tags:
      - 'v*' # 匹配 v1.0.0, v20.19.6 等语义化版本标签

jobs:
  publish:
    runs-on: ubuntu-latest # 使用 GitHub 托管的 Ubuntu 最新版本运行器

    # 权限配置：启用 OIDC 认证用于供应链安全
    permissions:
      contents: write # 允许创建 GitHub 发布
      id-token: write # 启用 OIDC 用于 npm provenance

    steps:
      # 步骤1：检出代码仓库
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0 # 获取完整 git 历史记录，支持版本信息生成

      # 步骤2：设置 Node.js 环境
      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 'lts/*' # 自动使用最新的 LTS 版本
          registry-url: 'https://registry.npmjs.org' # 配置 npm 发布注册表
          cache: 'npm' # 启用 npm 缓存加速依赖安装

      # 步骤3：安装项目依赖
      - name: Install dependencies
        run: npm install

      # 步骤4：发布到 npm 注册表
      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} # 使用安全令牌认证
```

### 1.2 配置详解与最佳实践

#### 触发条件设计

```yaml
on:
  push:
    tags:
      - 'v*' # 基础匹配规则
      - 'v*.*.*' # 精确语义化版本匹配
      - 'v[0-9]+.[0-9]+.[0-9]+' # 正则表达式精确匹配
```

**配置说明：**

- **标签触发机制**：避免频繁发布，仅在正式版本标签推送时执行
- **语义化版本规范**：遵循 `v主版本.次版本.修订版本` 的行业标准
- **渐进式匹配**：从宽松到严格的标签匹配策略

#### 安全配置强化

```yaml
permissions:
  contents: write # 允许工作流创建 GitHub 发布
  id-token: write # 必需：启用 OIDC 用于生成 provenance 数据

# 环境变量安全配置
env:
  NODE_ENV: production
  CI: true
```

**安全最佳实践：**

- **最小权限原则**：仅授予工作流执行所需的最小权限
- **OIDC 集成**：利用 GitHub 的 OpenID Connect 实现无密码认证
- **Provenance 支持**：生成软件来源证明，增强供应链安全性

### 1.3 NPM Access Token 生成指南

#### 生成步骤

1. **登录 npm 官网**：访问 https://npmjs.com 并完成身份验证
2. **访问令牌管理**：点击用户头像 → Access Tokens → Generate New Token
3. **配置令牌参数**：

- **Token Name**：`github-actions-publish`（描述性名称）
- **Description**：`用于 GitHub Actions 自动发布 npm 包`
- **2FA 要求**：必须启用双因素认证以增强安全性
- **权限范围**：Packages and scopes → Read and write（读写权限）
- **有效期**：建议设置 90 天或自定义过期时间

4. **生成并保存**：复制生成的令牌字符串，此令牌仅显示一次

#### GitHub 仓库配置

1. **进入仓库设置**：对应源码仓库 → Settings → Secrets and variables → Actions
2. **创建新密钥**：点击 New repository secret
3. **配置密钥信息**：

- **Name**：`NPM_TOKEN`（与工作流中的变量名一致）
- **Secret**：粘贴从 npm 复制的令牌内容

4. **保存生效**：密钥将用于工作流执行时的身份认证

### 1.4 版本管理规范

#### 版本号管理命令

```bash
# 递增修订版本号（向后兼容的 bug 修复）
npm version patch  # 1.0.0 → 1.0.1

# 递增次版本号（向后兼容的新功能）
npm version minor  # 1.0.0 → 1.1.0

# 递增主版本号（不兼容的 API 修改）
npm version major  # 1.0.0 → 2.0.0

# 同步推送标签到远程仓库
git push --follow-tags
```

#### 预发布版本管理

```bash
# 创建预发布版本
npm version prerelease --preid=beta  # 1.0.0 → 1.0.1-beta.0

# 发布预发布版本
npm publish --tag beta
```

## 2. 静态站点部署工作流（Deploy Workflow）

### 2.1 完整配置文件

```yaml
name: Deploy VitePress site to Pages

# 触发条件：主分支推送或手动触发
on:
  push:
    branches: [master] # 主分支代码推送时自动触发
  workflow_dispatch: # 支持在 GitHub 界面手动触发工作流

# 工作流级别权限配置（设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages）
permissions:
  contents: read # 读取仓库内容权限
  pages: write # GitHub Pages 写入权限
  id-token: write # OIDC 令牌写入权限

# 并发控制：避免同时运行多个部署任务
concurrency:
  group: pages # 同一组的任务会排队执行
  cancel-in-progress: false # 不取消进行中的部署，确保稳定性

jobs:
  # 构建任务：负责编译静态站点
  build:
    runs-on: ubuntu-latest
    steps:
      # 步骤1：检出代码仓库
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0 # 完整检出以支持 VitePress 的 lastUpdated 功能

      # 步骤2：设置 pnpm 包管理器
      - uses: pnpm/action-setup@v4
        with:
          version: 9 # 固定 pnpm 版本确保一致性

      # 步骤3：设置 Node.js 环境
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 20 # 使用 Node.js 20 LTS
          cache: pnpm # 启用 pnpm 缓存加速安装
          cache-dependency-path: '**/pnpm-lock.yaml'

      # 步骤4：配置 GitHub Pages 环境
      - name: Setup Pages
        uses: actions/configure-pages@v4

      # 步骤5：安装项目依赖
      - name: Install dependencies
        run: pnpm install

      # 步骤6：构建 VitePress 站点
      - name: Build with VitePress
        run: pnpm docs:build # 替换为项目打包命令

      # 步骤7：上传构建产物
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist # VitePress 默认输出目录，替换为项目产出目录

  # 部署任务：将构建产物部署到 GitHub Pages
  deploy:
    environment:
      name: github-pages # 环境名称，用于监控和审计
      url: ${{ steps.deployment.outputs.page_url }} # 部署后的访问 URL
    needs: build # 依赖构建任务，确保构建成功后再部署
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      # 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2.2 配置详解与最佳实践

#### 触发策略优化

```yaml
on:
  push:
    branches: [master, main] # 支持常见的主分支命名
  pull_request:
    branches: [master] # PR 创建/更新时触发预览构建
  schedule:
    - cron: '0 2 * * 1' # 每周一凌晨2点自动构建（可选）
```

**触发策略说明：**

- **自动触发**：主分支推送时自动部署，确保生产环境及时更新
- **手动控制**：支持紧急部署和测试环境更新
- **预览构建**：PR 时自动构建预览环境，便于代码审查

#### 性能优化配置

```yaml
# 缓存配置示例
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.pnpm-store
      node_modules
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

**性能优化实践：**

- **依赖缓存**：利用 GitHub Actions 缓存机制减少安装时间
- **版本固定**：确保构建环境的一致性，避免意外行为
- **并行任务**：合理设计任务依赖关系，最大化利用并发资源

#### 环境配置管理

```yaml
# 多环境部署策略
jobs:
  build:
    outputs:
      environment: ${{ steps.env.outputs.environment }}
    steps:
      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
          elif [[ "${{ github.ref }}" == "refs/heads/master" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          else
            echo "environment=preview" >> $GITHUB_OUTPUT
          fi
```

## 总结

本文档详细介绍了基于 GitHub Actions 的 npm 包发布和静态站点部署的最佳实践方案。通过合理的触发条件、安全配置和性能优化，可以建立可靠、高效的自动化发布流水线。

**核心要点总结：**

1. **安全性**：正确配置权限和认证机制，确保供应链安全
2. **可靠性**：完善的错误处理和并发控制，保证部署稳定性
3. **性能**：利用缓存和优化策略，提升构建和部署效率
4. **可维护性**：清晰的配置结构和注释，便于团队协作和维护

建议根据具体项目需求调整配置参数，并定期审查工作流执行情况，持续优化自动化流程。
