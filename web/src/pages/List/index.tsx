/* ============================================================
   民宿列表页 — 日期筛选 + 价格设施筛选 + 分页 + 空状态
   文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\List\index.tsx
   ============================================================ */
import { useEffect, useState, useCallback } from 'react';
import { Row, Col, Input, Select, DatePicker, Slider, Checkbox, Spin, Empty, Pagination, Tag, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import HomestayCard from '../../components/HomestayCard';
import { searchHomestays, getHomestays, Homestay } from '../../api/lodging';
import './style.css';

const { RangePicker } = DatePicker;

const ALL_FACILITIES = ['WiFi', '空调', '停车场', '餐厅', '茶室', '洗衣服务', '行李寄存', '旅游咨询', '独立卫浴', '观景阳台'];

export default function ListPage() {
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (dateRange && dateRange[0] && dateRange[1]) {
        res = await searchHomestays({
          checkInDate: dateRange[0], checkOutDate: dateRange[1],
          minPrice: priceRange[0], maxPrice: priceRange[1],
          facilities: facilities.length > 0 ? facilities : undefined,
          page, pageSize,
        });
      } else {
        res = await getHomestays({ page, pageSize, keyword: keyword || undefined, sort: 'rating_desc' });
      }
      setList((res as any).list || []);
      setTotal((res as any).total || 0);
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, keyword, dateRange, priceRange, facilities]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="list-page">
      {/* 搜索栏 */}
      <div className="list-toolbar">
        <div className="toolbar-row">
          <Input
            placeholder="搜索民宿名称、地址..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
            style={{ width: 280 }}
            allowClear
          />
          <RangePicker
            placeholder={['入住日期', '离店日期']}
            disabledDate={(d) => d.isBefore(dayjs(), 'day') || d.isAfter(dayjs().add(90, 'day'))}
            onChange={(vals) => {
              if (vals && vals[0] && vals[1]) {
                setDateRange([vals[0].format('YYYY-MM-DD'), vals[1].format('YYYY-MM-DD')]);
              } else {
                setDateRange(null);
              }
              setPage(1);
            }}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowFilter(!showFilter)}
            type={showFilter ? 'primary' : 'default'}
          >
            筛选
          </Button>
        </div>

        {/* 展开筛选 */}
        {showFilter && (
          <div className="filter-panel">
            <div className="filter-item">
              <label>价格范围：¥{priceRange[0]} - ¥{priceRange[1]}</label>
              <Slider
                range
                min={0}
                max={2000}
                step={50}
                value={priceRange}
                onChange={(v) => setPriceRange(v as [number, number])}
              />
            </div>
            <div className="filter-item">
              <label>设施筛选：</label>
              <Checkbox.Group
                options={ALL_FACILITIES}
                value={facilities}
                onChange={(vals) => setFacilities(vals as string[])}
              />
            </div>
            <Button type="primary" size="small" onClick={() => { setPage(1); fetchData(); }}>
              应用筛选
            </Button>
          </div>
        )}
      </div>

      {/* 结果 */}
      <Spin spinning={loading}>
        {list.length === 0 ? (
          <Empty description="暂无符合条件的民宿" style={{ padding: 80 }} />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {list.map((h) => (
                <Col key={h.id} xs={24} sm={12} md={8} lg={6}>
                  <HomestayCard homestay={h} />
                </Col>
              ))}
            </Row>
            <div className="list-pagination">
              <Pagination
                current={page}
                total={total}
                pageSize={pageSize}
                onChange={setPage}
                showTotal={(t) => `共 ${t} 家民宿`}
              />
            </div>
          </>
        )}
      </Spin>
    </div>
  );
}
