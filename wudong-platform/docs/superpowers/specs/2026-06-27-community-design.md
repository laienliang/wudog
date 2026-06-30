# 社区模块设计文档

> 对应需求：需求规格说明书第10章「社区——照片分享模块」
> 开发范围：后端 API + 管理后台

---

## 一、数据实体

### 1.1 Travelogue（游记）
表：`wd_community_travelogue`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| user_id | BIGINT | 作者ID |
| title | VARCHAR(200) | 标题 |
| content | TEXT | 内容（富文本） |
| cover_image | VARCHAR(500) | 封面图 |
| images | JSON | 图片列表 |
| video_url | VARCHAR(500) | 视频URL |
| location | VARCHAR(200) | 发布位置 |
| topic_id | BIGINT | 关联话题ID |
| status | TINYINT | 0待审 1已发布 2驳回 |
| view_count | INT | 浏览数 |
| like_count | INT | 点赞数 |
| comment_count | INT | 评论数 |
| linked_type | VARCHAR(20) | 关联类型 |
| linked_id | BIGINT | 关联业务ID |
| created_at / updated_at / deleted_at | | |

### 1.2 Comment（评论）
表：`wd_community_comment`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| user_id | BIGINT | 评论者ID |
| target_type | VARCHAR(50) | 目标类型（travelogue/comment）|
| target_id | BIGINT | 目标ID |
| parent_id | BIGINT | 父评论ID（回复）|
| content | TEXT | 评论内容 |
| created_at / deleted_at | | |

### 1.3 Like（点赞）
表：`wd_community_like`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| user_id | BIGINT | 用户ID |
| target_type | VARCHAR(50) | 目标类型（travelogue/comment）|
| target_id | BIGINT | 目标ID |
| created_at | DATETIME | |

### 1.4 Favorite（收藏）
表：`wd_community_favorite`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| user_id | BIGINT | 用户ID |
| target_type | VARCHAR(50) | 目标类型 |
| target_id | BIGINT | 目标ID |
| created_at | DATETIME | |

### 1.5 Follow（关注）
表：`wd_community_follow`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| follower_id | BIGINT | 关注者 |
| following_id | BIGINT | 被关注者 |
| created_at | DATETIME | |

### 1.6 Topic（话题）
表：`wd_community_topic`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | |
| name | VARCHAR(100) | 话题名 |
| icon | VARCHAR(500) | 图标 |
| sort_order | INT | 排序 |
| created_at / deleted_at | | |

---

## 二、后端 API

### 2.1 游记
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/travelogues | 游记列表（分页+状态筛选） |
| GET | /api/v1/travelogues/:id | 游记详情（含评论） |
| POST | /api/v1/travelogues | 创建游记 |
| PUT | /api/v1/travelogues/:id | 更新游记 |
| PUT | /api/v1/travelogues/:id/status | 审核（通过/驳回） |
| DELETE | /api/v1/travelogues/:id | 删除（软删除） |

### 2.2 评论
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/travelogues/:id/comments | 游记评论列表 |
| POST | /api/v1/travelogues/:id/comments | 发表评论 |
| DELETE | /api/v1/comments/:id | 删除评论 |

### 2.3 点赞
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/likes | 点赞/取消点赞 |

### 2.4 话题
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/topics | 话题列表 |
| POST | /api/v1/topics | 创建话题 |
| PUT | /api/v1/topics/:id | 更新话题 |
| DELETE | /api/v1/topics/:id | 删除话题 |

---

## 三、管理后台页面

放在 `业务管理 → 内容审核` 下。Tabs：待审核、游记管理、评论管理、话题管理。

### 3.1 待审核 Tab
- 列表：封面/标题/作者/时间/操作（通过/驳回）
- 通过 → status=1，驳回 → status=2

### 3.2 游记管理 Tab
- 列表：封面/标题/作者/点赞/评论/状态/时间
- 状态标签：待审(橙)/已发布(绿)/驳回(红)
- 操作：编辑/下架/删除

### 3.3 评论管理 Tab
- 列表：用户/内容/游记/时间
- 操作：删除

### 3.4 话题管理 Tab
- 列表：名称/图标/排序/游记数
- 操作：编辑/删除
- 新增弹窗

---

## 四、目录结构

```
server/src/modules/community/
├── controller/
│   └── community.controller.ts
├── service/
│   └── community.service.ts
├── entity/
│   ├── travelogue.entity.ts
│   ├── comment.entity.ts
│   ├── like.entity.ts
│   └── topic.entity.ts

web-admin/src/pages/modules/community/
├── index.tsx        # Tabs 主页面
├── pending.tsx      # 待审核 Tab
├── travelogue.tsx   # 游记管理 Tab
├── comment.tsx      # 评论管理 Tab
└── topic.tsx        # 话题管理 Tab
```
