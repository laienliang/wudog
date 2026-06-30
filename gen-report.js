const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");
const fs = require("fs");

const H1 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
const H2 = (t) => new Paragraph({ text: t, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
const P = (t) => new Paragraph({ spacing: { after: 100, line: 400 }, indent: { firstLine: 480 }, children: [new TextRun({ text: t, size: 24, font: "宋体" })] });
const B = (l, t) => new Paragraph({ spacing: { after: 100, line: 400 }, indent: { firstLine: 480 }, children: [
    new TextRun({ text: l, size: 24, font: "宋体", bold: true }),
    new TextRun({ text: t, size: 24, font: "宋体" })
]});
const LI = (t) => new Paragraph({ spacing: { after: 80, line: 400 }, indent: { firstLine: 480, left: 480 }, children: [new TextRun({ text: "• " + t, size: 24, font: "宋体" })] });

let C = [];
C.push(new Paragraph({ spacing: { before: 3000 } }));
C.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "人工智能工程实践", size: 48, bold: true, font: "黑体" })] }));
C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "课程设计大作业报告", size: 36, bold: true, font: "黑体" })] }));

C.push(H1("一、引言与项目背景"));
C.push(P("本项目是《人工智能工程实践》课程的大作业，旨在通过真实的文旅行业场景，探索AI技术辅助软件开发的可行路径与效率边界。作为唯一的全栈开发者，我独立完成了后端API、PC端、管理后台和小程序四端的开发，覆盖6大功能模块、51张数据库表、100+个API端点。"));
C.push(P("乌东村位于贵州黔东南秒族侨族自治州雷山县，拥有丰富的秒族非遗文化旅游资源。本项目以“衣、食、住、行”为业务主线，构建一站式数字化服务平台，覆盖游客、商家、平台运营方三类用户角色。开发过程中深度使用了Claude AI的Superpowers工作流，验证了AI辅助下个人全栈开发的可行性。"));

C.push(H1("二、需求分析与可行性研究"));
C.push(H2("2.1 业务需求分析"));
C.push(P("项目涉及三类用户角色：游客可以浏览商品、下单购买、预订民宿、发布游记；商家可以管理自家商品和订单；平台管理员可以进行用户管理、订单管理、财务管理、系统设置等。技术选型方面，后端采用Midway.js框架，前端采用React 18 + Ant Design，数据库使用MySQL 8.0，缓存使用Redis。AI在需求分析、代码生成、代码审查、文档编写等环节深度参与。"));

C.push(H1("三、系统设计与架构搭建"));
C.push(H2("3.1 整体架构"));
C.push(P("系统采用前后端分离四层架构：客户端层（微信小程序、PC网页端、管理后台三端独立部署）；API网关层（Midway.js统一处理认证、响应格式化、异常拦截）；业务服务层（6大模块加公共服务）；数据存储层（MySQL 51张表 + Redis）。"));

C.push(H1("四、AI辅助开发与核心编码实现"));
C.push(H2("4.1 衣·非遗商品模块"));
C.push(P("衣模块实现了非遗商品的完整交易链路，包括商品列表、详情、购物车、收藏、评价等功能。后端实现了8个API端点，PC端实现了5个页面，管理后台实现了6个管理页面，小程序实现了3个页面。"));
C.push(H2("4.2 食·餐饮美食模块"));
C.push(P("食模块涵盖餐厅展示、餐位预订和农产品电商三大功能。后端实现了餐厅列表/详情、菜品列表、餐位时段管理、农产品列表/详情等API。"));
C.push(H2("4.3 住·住宿预订模块"));
C.push(P("住模块的特色在于房态日历系统。后端实现了民宿列表/详情、房型管理、按月查询日历、批量设置日历价格和库存等API。"));
C.push(H2("4.4 行·线路订票模块"));
C.push(P("行模块的核心是景区门票和路线套餐的在线购买与电子票核销。后端实现了景区列表/详情、票种管理、路线套餐管理、电子票列表与核销等API。"));
C.push(H2("4.5 社区·照片分享模块"));
C.push(P("社区模块构建了完整的UGC内容生态。后端实现了15个API端点，包括游记发布/列表/详情/审核、评论发布/列表、点赞切换、关注切换、收藏切换、举报管理、话题管理等。"));
C.push(H2("4.6 平台管理后台模块"));
C.push(P("管理后台是项目中体量最大的模块，包含12张数据表和40+个API端点。采用Ant Design Pro的ProLayout + ProTable + ECharts技术栈构建。具体功能包括：管理员鉴权、数据看板（23个指标）、用户管理、商家管理与入驻审核、角色权限管理、首页运营、消息中心、财务结算、全局订单、系统设置、商家后台框架等完整功能。"));

C.push(H1("五、测试、部署与交付"));
C.push(P("通过AI辅助生成测试用例，发现了JSON字段解析问题、数据统计口径不一致、列名不匹配等多个业务逻辑漏洞并修复。项目采用本地部署方式，后端运行在7001端口，PC端在3000端口，管理后台在3001端口。代码托管在Gitee，采用feature分支开发策略。"));

C.push(H1("六、模拟运营与业务流程实战"));
C.push(P("AI辅助生成了覆盖全模块的模拟数据。通过游客浏览购买流程和管理员后台运营流程两个场景的演练，验证了从内容种草到下单支付的全链路连通性。"));

C.push(H1("七、实践总结与反思"));
C.push(P("通过本项目深刻认识到AI不是程序员的替代者，而是高效的协作工具。AI可以将重复性编码工作自动化，让人聚焦在架构设计和业务逻辑上。软件工程的核心理念在AI时代没有过时，需求分析、系统设计、代码审查、版本控制仍然是保证代码质量的基石。"));

C.push(H1("八、参考文献"));
const refs = [
    "[1] Chen M, Tworek J, Jun H, et al. Evaluating Large Language Models Trained on Code[J]. arXiv preprint arXiv:2107.03374, 2021.",
    "[2] Ouyang L, Wu J, Jiang X, et al. Training language models to follow instructions with human feedback[J]. NeurIPS, 2022.",
    "[3] Midway.js 官方文档[EB/OL]. https://midwayjs.org, 2024.",
    "[4] React 官方文档[EB/OL]. https://react.dev, 2024.",
    "[5] Ant Design 5.x 组件库文档[EB/OL]. https://ant.design, 2024.",
];
refs.forEach(r => {
    C.push(new Paragraph({ spacing: { after: 100, line: 400 }, indent: { left: 480, hanging: 480 }, children: [new TextRun({ text: r, size: 24, font: "宋体" })] }));
});

Packer.toBuffer(new Document({ sections: [{ children: C }] })).then(buf => {
    fs.writeFileSync("docs/report.docx", buf);
    console.log("OK: " + buf.length + " bytes");
});
