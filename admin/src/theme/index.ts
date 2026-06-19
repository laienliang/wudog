/**
 * 乌东文旅 - Ant Design 5 主题配置
 *
 * 设计理念："苗寨有银，文化有纹"
 * 将苗族银饰的冷冽光泽、蜡染靛蓝、刺绣暖调融入现代数字界面
 *
 * 色彩来源：
 * - 苗银蓝 #1F5FA8：苗族银饰的冷光反射
 * - 刺绣橙 #E85D2F：苗绣中常见的暖调点缀
 * - 梯田绿 #6B8E3D：贵州山间梯田的生机
 * - 黎明金 #D4A14B：苗寨晨曦的温暖
 * - 古木棕 #7A5230：吊脚楼木构的沉稳
 */
import type { ThemeConfig } from 'antd';

/** 品牌色彩系统 */
export const colors = {
  // ── 品牌主色（苗银蓝）──
  primary: '#1F5FA8',
  primaryHover: '#3B7BC5',    // +10% 亮度，hover 态
  primaryActive: '#0E3D75',   // -10% 亮度，pressed 态
  primaryLight: '#E8F1FB',    // 浅色背景、选中态、标签底色
  primaryBg: '#F0F6FD',       // 更浅的主色背景

  // ── 品牌辅色 ──
  embroideryOrange: '#E85D2F',     // 刺绣橙，强调/徽章/价格
  embroideryOrangeLight: '#FFF1EA', // 刺绣橙浅色背景
  terracedGreen: '#6B8E3D',         // 梯田绿，成功态/自然分类
  terracedGreenLight: '#F0F7E8',    // 梯田绿浅色背景
  dawnGold: '#D4A14B',              // 黎明金，VIP/精品/装饰
  dawnGoldLight: '#FDF6E9',         // 黎明金浅色背景
  ancientWoodBrown: '#7A5230',      // 古木棕，文案点缀

  // ── 中性色 ──
  textPrimary: '#1A1A1A',    // 主标题/正文
  textSecondary: '#595959',  // 辅助文字
  textTertiary: '#8C8C8C',   // 占位符/提示
  textDisabled: '#BFBFBF',   // 禁用文字
  border: '#E5E5E5',         // 边框
  borderLight: '#F0F0F0',    // 浅边框
  bgPage: '#F7F8FA',         // 页面背景
  bgCard: '#FFFFFF',         // 卡片背景
  bgLight: '#FAFAFA',        // 浅色背景

  // ── 功能色 ──
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
  info: '#1F5FA8',

  // ── 侧边栏品牌深色 ──
  siderBg: '#0A1929',           // 深邃的苗银蓝暗调
  siderMenuBg: '#0A1929',
  siderText: 'rgba(255,255,255,0.75)',
  siderTextActive: '#FFFFFF',
  siderHighlight: '#1F5FA8',    // 选中菜单项高亮
} as const;

/** Ant Design 5 主题配置 */
export const themeConfig: ThemeConfig = {
  token: {
    // ── 品牌色 ──
    colorPrimary: colors.primary,
    colorPrimaryBg: colors.primaryLight,
    colorPrimaryBgHover: colors.primaryBg,
    colorPrimaryBorder: colors.primary,
    colorPrimaryBorderHover: colors.primaryHover,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,
    colorPrimaryText: colors.primary,
    colorPrimaryTextHover: colors.primaryHover,

    // ── 功能色 ──
    colorSuccess: colors.terracedGreen,
    colorWarning: colors.embroideryOrange,
    colorError: colors.error,
    colorInfo: colors.info,

    // ── 链接色 ──
    colorLink: colors.primary,
    colorLinkHover: colors.primaryHover,
    colorLinkActive: colors.primaryActive,

    // ── 文字色 ──
    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,
    colorTextDisabled: colors.textDisabled,

    // ── 边框 ──
    colorBorder: colors.border,
    colorBorderSecondary: colors.borderLight,

    // ── 背景 ──
    colorBgLayout: '#F5F2EF',
    colorBgContainer: '#FDFCFB',
    colorBgElevated: '#FDFCFB',
    colorBgSpotlight: colors.primaryLight,

    // ── 圆角（设计规范：中等 8px 基准）──
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // ── 字体（阿里普惠体 + Inter 回退链）──
    fontFamily: "'Alibaba PuHuiTi', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Source Han Sans SC', 'Noto Sans SC', sans-serif",

    // ── 字号 ──
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 13,
    fontSizeXL: 20,
    fontSizeHeading1: 24,
    fontSizeHeading2: 20,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,

    // ── 间距（8px 基准栅格）──
    marginXS: 8,
    marginSM: 12,
    marginMD: 16,
    marginLG: 24,
    marginXL: 32,
    paddingXS: 8,
    paddingSM: 12,
    paddingMD: 16,
    paddingLG: 24,

    // ── 阴影 ──
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    boxShadowSecondary: '0 4px 16px rgba(0,0,0,0.10)',

    // ── 动效 ──
    motionDurationFast: '0.2s',
    motionDurationMid: '0.3s',
    motionDurationSlow: '0.5s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',

    // ── 控件高度 ──
    controlHeight: 36,
    controlHeightLG: 48,
    controlHeightSM: 28,
  },

  components: {
    // ── 按钮 ──
    Button: {
      primaryShadow: '0 4px 12px rgba(31,95,168,0.20)',
      defaultBorderColor: colors.border,
      defaultBg: colors.bgCard,
      paddingInline: 20,
      fontWeight: 500,
    },

    // ── 卡片 ──
    Card: {
      paddingLG: 24,
      borderRadiusLG: 12,
      boxShadowTertiary: '0 1px 3px rgba(0,0,0,0.04)',
      colorBgContainer: '#FDFCFB',
      colorBorderSecondary: '#F0EDE8',
    },

    // ── 表格 ──
    Table: {
      headerBg: colors.primaryLight,
      headerColor: colors.primaryActive,
      headerSortActiveBg: '#F0F0F0',
      rowHoverBg: '#F0F6FD',
      borderColor: colors.borderLight,
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },

    // ── 菜单（侧边栏）──
    Menu: {
      darkItemBg: colors.siderBg,
      darkSubMenuItemBg: '#061520',
      darkItemSelectedBg: colors.siderHighlight,
      darkItemColor: colors.siderText,
      darkItemSelectedColor: colors.siderTextActive,
      darkItemHoverColor: '#FFFFFF',
      darkItemHoverBg: 'rgba(31,95,168,0.30)',
      itemHeight: 44,
      iconSize: 16,
      collapsedIconSize: 18,
    },

    // ── 布局 ──
    Layout: {
      headerBg: colors.bgCard,
      siderBg: colors.siderBg,
      bodyBg: colors.bgPage,
      headerHeight: 64,
      headerPadding: '0 24px',
    },

    // ── 输入框 ──
    Input: {
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryHover,
      activeShadow: `0 0 0 2px ${colors.primaryLight}`,
      paddingBlock: 8,
    },

    // ── 选择器 ──
    Select: {
      optionSelectedBg: colors.primaryLight,
      optionActiveBg: colors.primaryBg,
    },

    // ── 标签 ──
    Tag: {
      defaultBg: colors.bgLight,
      defaultColor: colors.textSecondary,
    },

    // ── 消息提示 ──
    Message: {
      contentBg: colors.bgCard,
    },

    // ── 模态框 ──
    Modal: {
      titleFontSize: 18,
      contentBg: colors.bgCard,
      headerBg: colors.bgCard,
    },

    // ── 分页 ──
    Pagination: {
      itemActiveBg: colors.primary,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
    },

    // ── 标签页 ──
    Tabs: {
      inkBarColor: colors.primary,
      itemActiveColor: colors.primary,
      itemHoverColor: colors.primaryHover,
      itemSelectedColor: colors.primary,
    },
  },
};
