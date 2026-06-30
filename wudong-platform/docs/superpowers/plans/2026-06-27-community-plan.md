# 社区模块实施计划

**Goal:** 完成社区模块后端API + 管理后台

**Architecture:** Midway.js 分层 + React Ant Design Pro，4个 Tab：待审核、游记管理、评论管理、话题管理

---

### Task 1: 后端实体 + Service + Controller
- Create: entity files (travelogue, comment, like, topic)
- Create: service/community.service.ts
- Create: controller/community.controller.ts
- Update: auth.middleware.ts whitelist

### Task 2: 管理后台路由 + API 服务
- Create: web-admin/src/services/community.ts
- Create: web-admin/src/pages/modules/community/index.tsx
- Update: App.tsx route

### Task 3-6: 各 Tab 页面
- pending.tsx (待审核) + travelogue.tsx (游记管理) + comment.tsx (评论管理) + topic.tsx (话题管理)
