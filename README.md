# my-first-demo-front

前端子仓库：Next.js（App Router）+ React + TypeScript（strict）+ Tailwind CSS。

首页是 Server Component，在服务端直接请求后端 `/api/health` 并渲染状态；后端不可达时渲染可读错误态，点击「重新检查」通过 Server Action 触发 `revalidatePath('/')` 重新取数。

## 环境变量

| 变量          | 默认值                  | 说明                             |
| ------------- | ----------------------- | -------------------------------- |
| `BACKEND_URL` | `http://localhost:8081` | 后端地址，只在 `lib/api.ts` 读取 |

复制 `.env.example` 为 `.env.local` 后按需覆盖。业务代码不得出现后端地址字面量。

## 常用命令

```powershell
npm install          # 安装依赖
npm run dev          # 开发服务器，端口 5173
npm run build        # 生产构建
npm run start        # 启动生产构建，端口 5173
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test:unit    # Vitest 单元测试
npm run format:check # Prettier 检查
```

本地联调需先启动后端（默认 8081），再访问 <http://localhost:5173>。

## 目录

```
app/          路由与页面（layout / page / error / actions）
components/   客户端交互组件
lib/          数据访问与错误归一化
```
