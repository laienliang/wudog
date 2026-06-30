const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType } = require("docx");
const fs = require("fs");
const children = [];

const H = (t, l) => new Paragraph({ text: t, heading: l, spacing: { before: 300, after: 200 } });
const P = (t) => new Paragraph({ spacing: { after: 100, line: 400 }, indent: { firstLine: 480 }, children: [new TextRun({ text: t, size: 24, font: "宋体" })] });

children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 3000 }, children: [new TextRun({ text: "人工智能工程实践", size: 44, bold: true, font: "黑体" })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "课程设计大作业报告", size: 44, bold: true, font: "黑体" })] }));
children.push(H("一、引言与项目背景", HeadingLevel.HEADING_1));
children.push(P("2026年6月，我有幸参与了人工智能工程实践课程的大作业——乌东文旅衣食住行综合服务平台的全栈开发。该课程是校企合作的重要实践环节，旨在通过真实的文旅行业场景，探索AI技术辅助软件开发的可行路径与效率边界。课程将人工智能技术与传统软件工程方法深度融合，要求学生在三周内独立完成覆盖小程序端、PC网页端、管理后台的全栈项目。"));
children.push(P("乌东村位于贵州黔东南苗族侗族自治州雷山县，是典型的特色苗寨，拥有丰富的苗族非遗文化旅游资源——苗绣、蜡染、银饰锻造、吊脚楼建筑、苗族歌舞、长桌宴、梯田风光等。然而其文旅运营长期以线下为主，缺乏统一的线上数字化服务入口。本项目以衣食住行为业务主线，构建一站式数字化服务平台，帮助乌东苗寨完成全链路数字化转型。"));
children.push(H("二、需求分析与可行性研究", HeadingLevel.HEADING_1));
children.push(P("项目涉及三类用户角色：游客、商家、平台管理员。游客可以浏览商品、搜索、下单购买、预订民宿、发布游记。商家可以管理自家商品和订单。平台管理员可以进行用户管理、订单管理、财务管理、系统设置等。技术选型方面，后端采用Midway.js框架，前端采用React 18 + Ant Design，数据库使用MySQL 8.0，缓存使用Redis。AI在需求分析、代码生成、代码审查、文档编写等环节深度参与。"));
children.push(H("三、系统设计与架构搭建", HeadingLevel.HEADING_1));
children.push(P("系统采用前后端分离架构，分为客户端层、API网关层、业务服务层和数据存储层。数据库遵循统一命名规范，共计51张业务表。AI辅助生成接口文档，确保文档与代码保持一致。"));
children.push(H("四、AI辅助开发与核心编码实现", HeadingLevel.HEADING_1));
children.push(P("衣模块实现了非遗商品的完整交易链路，包括商品列表、详情、购物车、收藏、评价等功能。食模块涵盖餐厅展示、餐位预订和农产品电商。住模块的特色在于房态日历系统。行模块支持景区门票和路线套餐的在线购买与电子票核销。社区模块构建了完整的UGC内容生态。管理后台包含12张数据表和40多个API端点，实现了数据看板、用户管理、商家管理、订单管理、系统设置等全部功能。"));
children.push(H("五、测试、部署与交付", HeadingLevel.HEADING_1));
children.push(P("通过AI辅助生成测试用例，发现了JSON字段解析问题、数据统计口径不一致、列名不匹配等多个业务逻辑漏洞并修复。项目采用本地部署方式，后端运行在7001端口，PC端在3000端口，管理后台在3001端口。"));
children.push(H("六、模拟运营与业务流程实战", HeadingLevel.HEADING_1));
children.push(P("AI辅助生成了覆盖全模块的模拟数据。通过游客浏览购买流程和管理员后台运营流程两个场景的演练，验证了从内容浏览到下单支付的全链路连通性。"));
children.push(H("七、实践总结与反思", HeadingLevel.HEADING_1));
children.push(P("通过本项目深刻认识到AI不是程序员的替代者，而是高效的协作工具。AI可以将重复性编码工作自动化，让人聚焦在架构设计和业务逻辑上。软件工程的核心理念在AI时代没有过时，需求分析、系统设计、代码审查、版本控制仍然是保证代码质量的基石。"));

new Document({ sections: [{ children }] });
Packer.toBuffer(new Document({ sections: [{ children }] })).then(buf => {
    fs.writeFileSync("docs/课程设计大作业报告.docx", buf);
    console.log("OK");
});
