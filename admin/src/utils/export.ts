/**
 * Excel 导出工具
 * 基于 xlsx (SheetJS) 封装通用导出函数
 */
import * as XLSX from 'xlsx';

export interface ExportColumn {
  title: string;
  dataIndex: string;
  render?: (value: any, record: any) => string | number;
}

/**
 * 导出数据到 Excel 文件
 * @param data 数据数组
 * @param columns 列定义（title + dataIndex + 可选 render）
 * @param filename 文件名（不含后缀）
 */
export function exportToExcel(data: any[], columns: ExportColumn[], filename: string) {
  const header = columns.map(c => c.title);
  const rows = data.map(record =>
    columns.map(col => {
      const val = record[col.dataIndex];
      if (col.render) return col.render(val, record);
      return val ?? '';
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  // 设置列宽
  ws['!cols'] = columns.map(() => ({ wch: 18 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * 导出看板汇总数据
 */
export function exportDashboardData(data: any) {
  const rows = [
    ['指标', '数值'],
    ['注册用户总数', data?.users?.total || 0],
    ['今日活跃用户', data?.users?.todayActive || 0],
    ['今日新增用户', data?.users?.todayNew || 0],
    ['今日订单数', data?.orders?.todayCount || 0],
    ['今日GMV', data?.orders?.todayGMV || 0],
    ['本月GMV', data?.orders?.monthGMV || 0],
    ['商家总数', data?.merchants?.total || 0],
    ['活跃商家数', data?.merchants?.active || 0],
    ['总流水', data?.financial?.totalRevenue || 0],
    ['平台收入', data?.financial?.platformIncome || 0],
    ['商家收入', data?.financial?.merchantIncome || 0],
    ['待结算金额', data?.financial?.pendingSettlement || 0],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 20 }, { wch: 18 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '数据看板');
  XLSX.writeFile(wb, `数据看板_${new Date().toLocaleDateString('zh-CN')}.xlsx`);
}
