# 住宿 PC 端实施计划

**Goal:** 完成住宿模块的 PC 前端三个页面：民宿列表、民宿详情、预订页

**Architecture:** 三个独立页面通过 React Router 跳转，API 调用走 `/api/v1` proxy，图片走 web-pc 静态文件服务。遵循现有 clothing/food 页面模式。

**Tech Stack:** React 18, Ant Design 5, axios, dayjs

## Global Constraints
- API 路径 `/api/v1` 由 Vite proxy 转发到后端 7001
- 图片路径 `/images/...` 从 `public/images/` 提供
- 路由在 `App.tsx` 中添加
- 统一订单 `order_type = 'accommodation'`

---

### Task 1: 添加路由 + 创建民宿列表页

**Files:**
- Create: `packages/web-pc/src/pages/accommodation/index.tsx`
- Modify: `packages/web-pc/src/App.tsx` (add routes)

- [ ] **Step 1: Create accommodation directory and list page**

```bash
mkdir -p packages/web-pc/src/pages/accommodation
```

- [ ] **Step 2: Write list page**

Write `packages/web-pc/src/pages/accommodation/index.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Rate, Tag, Skeleton, Empty, message, Typography, Space, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, StarFilled } from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { Search } = Input;
const api = axios.create({ baseURL: '/api/v1' });

const AccommodationList: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => { fetchData(); }, [keyword, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/homestays', { params: { page: 1, pageSize: 50, keyword } });
      let data = res.data?.data?.list || [];
      if (sortBy === 'price') data.sort((a: any, b: any) => Number(a.rating ? 0 : b.rating ? 1 : 0));
      if (sortBy === 'rating') data.sort((a: any, b: any) => Number(b.rating) - Number(a.rating));
      setList(data);
    } catch { message.error('加载失败'); }
    setLoading(false);
  };

  if (loading) return <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}><Skeleton active paragraph={{ rows: 6 }} /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* 标题区 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}><HomeOutlined style={{ color: '#1F5FA8', marginRight: 8 }} />苗寨民宿</Title>
        <Text type="secondary">体验原生态苗家生活，住进风景里</Text>
      </div>

      {/* 搜索+筛选 */}
      <Row gutter={16} style={{ marginBottom: 24 }} align="middle">
        <Col span={8}>
          <Search placeholder="搜索民宿名称" allowClear onSearch={v => { setKeyword(v); }} />
        </Col>
        <Col>
          <Space>
            <Text type="secondary">排序：</Text>
            <Select value={sortBy} onChange={setSortBy} style={{ width: 120 }}
              options={[
                { label: '评分最高', value: 'rating' },
                { label: '价格最低', value: 'price' },
              ]} />
          </Space>
        </Col>
      </Row>

      {/* 列表 */}
      {list.length === 0 ? <Empty description="暂无民宿" /> : (
        <Row gutter={[24, 24]}>
          {list.map(item => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card hoverable cover={
                <Image src={item.coverImage} height={200} style={{ objectFit: 'cover' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  preview={false} />
              } onClick={() => navigate(`/accommodation/${item.id}`)}
                style={{ borderRadius: 12, overflow: 'hidden' }}
                bodyStyle={{ padding: '12px 16px' }}>
                <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 4 }}>{item.name}</Text>
                <Space style={{ marginBottom: 6 }}>
                  <Rate disabled value={Number(item.rating)} style={{ fontSize: 13 }} />
                  <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{item.rating}</Text>
                </Space>
                <div style={{ marginBottom: 4 }}>
                  {item.facilities?.slice(0, 3).map((f: string) => (
                    <Tag key={f} style={{ fontSize: 11, borderRadius: 4, marginBottom: 2 }}>{f}</Tag>
                  ))}
                </div>
                <Text style={{ color: '#E85D2F', fontWeight: 700, fontSize: 15 }}>¥{item.roomTypes?.[0]?.price || '??'}起</Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
export default AccommodationList;
```

- [ ] **Step 3: Update App.tsx routes**

In `packages/web-pc/src/App.tsx`:
- Add import: `import AccommodationList from './pages/accommodation';`
- Add routes after line 108:
```tsx
<Route path="/accommodation" element={<AccommodationList />} />
<Route path="/accommodation/:id" element={<AccommodationDetail />} />
<Route path="/accommodation/booking/:id" element={<AccommodationBooking />} />
```
- Remove the placeholder line for accommodation

- [ ] **Step 4: Commit**

---

### Task 2: 创建民宿详情页

**Files:**
- Create: `packages/web-pc/src/pages/accommodation/detail.tsx`

**Step 1: Write detail page**

Page structure:
- Cover image (large hero image)
- Homestay info: name, rating, phone, address
- Facilities tags
- Description text
- Room types table with "Book" button per row
- Back to list button

Key API call: `GET /api/v1/homestays/:id` returns homestay + roomTypes array

Room type table columns: name, bedType, area, maxGuests, price, weekendPrice, action (book button)

**Step 2: Commit**

---

### Task 3: 创建预订页

**Files:**
- Create: `packages/web-pc/src/pages/accommodation/booking.tsx`

**Step 1: Write booking page**

Page flow:
1. Receive homestayId from URL params
2. Show homestay name and selected room type info
3. Date inputs: check-in date, check-out date
4. Contact form: name, phone, remark
5. Submit button → calls order API
6. On success, show order number and success message

Key API call: `POST /api/v1/orders` with order_type='accommodation'

```typescript
const handleSubmit = async () => {
  const res = await axios.post('/api/v1/orders', {
    orderType: 'accommodation',
    merchantId: 1,
    items: [{
      productType: 'room_type',
      productId: selectedRoomType.id,
      productName: selectedRoomType.name,
      unitPrice: selectedRoomType.price,
      quantity: nights,
    }],
    remark: `入住${checkIn} 离店${checkOut} 联系人${name} ${phone}`,
  });
  // Show success with order number
};
```

**Step 2: Commit**

---

### Task 4: 集成验证

- [ ] **Step 1: Restart web-pc and verify**

```bash
# Restart web-pc
pid=$(netstat -ano | grep ":3000" | grep LISTEN | awk '{print $NF}' | head -1)
[ -n "$pid" ] && taskkill //F //PID $pid 2>/dev/null
sleep 1
cd packages/web-pc && npx vite --port 3000 --host > /tmp/webpc.log 2>&1 &
sleep 4
echo "Status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)"
```

- [ ] **Step 2: Test pages**

Open http://localhost:3000/accommodation in browser and navigate through all 3 pages.
