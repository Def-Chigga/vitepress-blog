---
title: Git Cheat Sheet
sticky: 1
categories: [Git]
tags: [Git]
---

# Git Cheat Sheet

## 1. Git 基本概念

### 三种状态

- **已修改（modified）**：修改了文件但还没保存到数据库
- **已暂存（staged）**：对修改的文件做了标记，包含在下次提交中
- **已提交（committed）**：数据安全保存在本地数据库

### 三个工作区域

- **工作目录**：实际文件操作的地方
- **暂存区**：临时保存下次要提交的文件列表
- **Git仓库**：存储项目元数据和对象数据库的地方

## 2. 安装与配置

### 在 Windows 上安装

官方版本可以在 Git 官方网站下载。打开 https://git-scm.com/download/win，下载会自动开始。

### 全局配置

```bash
# 配置用户信息
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"

# 查看配置
git config --list
git config -l
```

### Git 别名设置

```bash
# 常用别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

## 3. 基础工作流程

### 创建/获取仓库

```bash
# 初始化新仓库
git init
git add .
git commit -m "初始提交"

# 克隆现有仓库
git clone https://github.com/用户名/仓库名.git
git clone https://github.com/libgit2/libgit2 mylibgit # 自定义本地仓库名
```

### 日常开发流程

```bash
# 查看状态
git status
git status -s        # 简洁状态显示
git status --short   # 同上

# 添加文件到暂存区
git add 文件名
git add .          # 添加所有文件

# 提交更改
git commit -m "提交描述"
git commit -a -m "提交描述"  # 跳过git add，自动跟踪所有已修改文件

# 推送到远程仓库
git push origin 分支名
```

## 4. 文件状态管理

### 查看状态

```bash
git status
git status -s        # 简洁状态显示
git status --short   # 同上
```

### 查看差异

```bash
git diff                    # 工作区 vs 暂存区
git diff --staged           # 暂存区 vs 最后一次提交
git diff <commit1> <commit2>
git diff <branch1>..<branch2>
```

### 撤销操作

```bash
# 撤销工作区修改
git restore 文件名
git checkout -- 文件名      # 旧版命令

# 撤销暂存区文件
git restore --staged 文件名
git reset HEAD 文件名       # 旧版命令

# 停止跟踪文件（保留本地文件）
git rm --cached 文件名
echo 文件名 >> .gitignore   # 添加到忽略文件
```

## 5. 分支管理

### 基本分支操作

```bash
# 查看分支
git branch           # 本地分支
git branch -v        # 显示最近提交信息
git branch -r        # 远程分支
git branch -a        # 所有分支

# 创建分支
git branch 新分支名

# 切换分支
git switch 分支名
git checkout 分支名   # 旧版命令

# 创建并切换分支
git checkout -b 新分支名

# 删除分支
git branch -d 分支名
git push origin --delete 分支名  # 删除远程分支
```

### 分支合并与变基

#### 合并（Merge）

```bash
# 切换到要合并到的分支
git switch main

# 合并分支
git merge 分支名
git merge --abort    # 终止合并

# 解决冲突后提交
git add .
git commit -m "解决合并冲突"
```

#### 变基（Rebase）

```bash
git switch 分支名
git rebase main
git switch main
git merge 分支名
```

**比喻说明**：

- **合并**：用胶水把两条绳子粘在一起，承认两条分支独立发展的事实
- **变基**：把一条绳子拆开接到另一条绳子的最新位置，历史更简洁但被改写

## 6. Git Flow 工作流

### 主要分支

- **main/master**：稳定版本分支，存放可随时部署的代码
- **develop**：开发集成分支，最新开发成果

### 辅助分支

- **feature/**：功能开发分支
- **release/**：版本发布分支
- **hotfix/**：紧急修复分支

### 工作流程

```bash
# 开发新功能
git switch develop
git checkout -b feature/新功能
# 开发完成后
git switch develop
git merge --no-ff feature/新功能

# 发布版本
git switch develop
git branch release/1.0.0

# 热修复
git switch master
git branch hotfix/紧急修复
```

## 7. 远程仓库操作

```bash
# 查看远程仓库
git remote
git remote -v

# 添加远程仓库
git remote add 别名 仓库地址

# 抓取与拉取
git fetch origin                    # 只下载不合并
git pull                          # = git fetch + git merge
git pull --rebase                 # = git fetch + git rebase

# 推送更改
git push -u origin 分支名         # 首次推送建立跟踪
git push                         # 后续直接推送
```

## 8. 提交管理

### 提交操作

```bash
# 普通提交
git commit -m "提交描述"

# 修改最后一次提交
git commit --amend -m "新的提交消息"

# 提交后发现需要添加文件，合并为一次提交
git commit -m "first commit"
git add 遗漏的文件
git commit --amend
```

### 撤销提交

```bash
# 撤销上次提交（保留修改）
git reset --soft HEAD^

# 完全撤销上次提交（删除修改）
git reset --hard HEAD^
git reset --hard HEAD~1     # 等价写法

# 撤销已推送的提交
git revert 提交哈希值
git push
```

### 不同场景的撤销策略

#### 撤销工作区修改

有改动 / 无add / 无commit / 无push

```bash
git restore 文件名     	# 撤销工作区修改
git checkout -- 文件名		# 旧版命令
```

#### 撤销暂存区文件

有改动 / 有add / 无commit / 无push

```bash
git restore --staged 文件名
git reset HEAD 文件名      # 旧版命令
```

#### 撤销提交

有改动 / 有add / 有commit / 无push

```bash
# 撤销上次提交（保留修改）
git reset --soft HEAD^

# 完全撤销上次提交（删除修改）
git reset --hard HEAD^
```

#### 撤销已推送的提交

有改动 / 有add / 有commit / 有push

```bash
git revert 提交哈希值
git push
```

## 9. 贮藏（Stash）管理

```bash
# 基本贮藏操作
git stash                   # 贮藏当前修改
git stash list              # 查看贮藏列表
git stash apply             # 应用上一次贮藏
git stash apply stash@{n}   # 应用指定贮藏
git stash drop stash@{n}    # 移除贮藏
git stash pop               # 应用后并移除

# 高级用法
git stash --keep-index      # 贮藏但保留索引
git stash -u                # 包含未跟踪文件
git stash -a                # 包含所有文件（包括忽略的）

# 从贮藏创建分支
git stash branch 新分支名
```

## 10. 标签管理

```bash
# 列出标签
git tag
git tag -l "v1.8.5*"              # 模式匹配

# 创建标签
git tag v1.0.0                    # 轻量标签
git tag -a v1.0.0 -m "版本描述"    # 附注标签

# 后期打标签
git log --pretty=oneline
git tag -a v1.2 提交哈希值

# 推送标签
git push origin v1.0.0            # 单个标签
git push origin --tags            # 所有标签

# 删除标签
git tag -d v1.0.0                 # 本地删除
git push origin --delete v1.0.0   # 远程删除

# 显示标签信息
git show v1.0.0
```

## 11. 高级操作

### 查看历史

```bash
# 基本查看
git log
git log --oneline                # 简洁显示
git log --oneline --decorate --graph --all  # 图形化完整历史

# 详细查看
git log -p -2                    # 显示最近2次提交的差异
git log --pretty=format:"%h %s"  # 自定义格式

# 引用日志（恢复误操作）
git reflog
```

### 拣选（Cherry-pick）

```bash
git cherry-pick 提交哈希值    # 将单个提交引入当前分支
```

## 12. 忽略文件配置

创建 `.gitignore` 文件示例：

```
# 编译文件
*.class
*.exe
*.dll

# 日志文件
*.log

# 依赖目录
node_modules/
vendor/

# 系统文件
.DS_Store
Thumbs.db

# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

## 13. 提交信息规范

使用约定式提交格式：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具变动
- `build:` 构建系统或外部依赖变更

示例：

```
feat: 添加用户登录功能
fix: 修复首页加载错误
docs: 更新API文档
```

## 14. 重要提醒

1. **变基风险**：不要对已推送的提交执行变基操作
2. **强制推送**：谨慎使用 `git push --force`，可能覆盖他人工作
3. **数据安全**：`git reset --hard` 会永久删除未提交的修改
4. **备份习惯**：重要修改前先提交或贮藏
5. **团队协作**：遵循团队约定的工作流程和提交规范

## 常用命令速查表

| 操作     | 命令                                          | 说明         |
| -------- | --------------------------------------------- | ------------ |
| 初始化   | `git init`                                    | 初始化新仓库 |
| 克隆     | `git clone <url>`                             | 克隆远程仓库 |
| 状态查看 | `git status` `git status -s`                  | 查看文件状态 |
| 文件对比 | `git diff` `git diff --staged`                | 查看差异     |
| 暂存文件 | `git add <file>` `git add .`                  | 添加到暂存区 |
| 提交更改 | `git commit -m "消息"`                        | 提交到仓库   |
| 分支管理 | `git branch` `git switch <branch>`            | 分支操作     |
| 合并变基 | `git merge <branch>` `git rebase <branch>`    | 整合分支     |
| 远程操作 | `git push` `git pull` `git fetch`             | 远程仓库交互 |
| 撤销操作 | `git restore <file>` `git reset` `git revert` | 各种撤销场景 |
| 贮藏管理 | `git stash` `git stash pop`                   | 临时保存更改 |
| 标签管理 | `git tag` `git push --tags`                   | 版本标签操作 |
| 历史查看 | `git log --oneline` `git log --graph`         | 查看提交历史 |
