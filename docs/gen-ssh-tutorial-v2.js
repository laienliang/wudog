const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
        TabStopType, TabStopPosition, ExternalHyperlink, Footer, PageNumber, Header, LevelFormat } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const tableBorders = {
  top: border, bottom: border, left: border, right: border,
  insideHorizontal: border, insideVertical: border
};
const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
};

const codeBlock = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Consolas", size: 22 })],
  shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
  border: {
    left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
    right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
    top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
  },
  spacing: { before: 120, after: 120 }
});

const successBlock = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Consolas", size: 20 })],
  shading: { type: ShadingType.CLEAR, fill: "D5F5D5" },
  border: {
    left: { style: BorderStyle.SINGLE, size: 6, color: "548235", space: 1 },
    right: { style: BorderStyle.SINGLE, size: 6, color: "548235", space: 1 },
    top: { style: BorderStyle.SINGLE, size: 6, color: "548235", space: 1 },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: "548235", space: 1 },
  },
  spacing: { before: 80, after: 80 }
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
      { id: "Normal", name: "Normal", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: "Arial", size: 24 } }
    ]
  },
  numbering: {
    config: [
      { reference: "ordered-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        width: 11906, height: 16838,
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      },
      header: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: "SSH Key 配置教程", font: "Arial", size: 20, color: "999999" }),
              new TextRun("\t"),
              new TextRun({ text: "wudog 项目", font: "Arial", size: 20, color: "999999" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          })]
        })
      },
      footer: {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ text: "第 ", font: "Arial", size: 20 }),
                       new TextRun({ text: PageNumber.CURRENT, font: "Arial", size: 20 }),
                       new TextRun({ text: " / ", font: "Arial", size: 20 }),
                       new TextRun({ text: PageNumber.TOTAL_PAGES, font: "Arial", size: 20 }),
                       new TextRun({ text: " 页", font: "Arial", size: 20 })],
            alignment: AlignmentType.CENTER,
          })]
        })
      }
    },
    children: [
      // === TITLE PAGE ===
      new Paragraph({
        children: [new TextRun({ text: "SSH Key 配置完整教程", bold: true, font: "Arial", size: 52, color: "1F4E79" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2800, after: 160 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Git 版本控制密钥管理指南", font: "Arial", size: 30, color: "2E75B6" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "1F4E79", space: 1 } },
        spacing: { before: 200, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "适用平台：", bold: true, font: "Arial", size: 26, color: "333333" }),
          new TextRun({ text: "macOS / Linux / Windows", font: "Arial", size: 26, color: "555555" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "适用服务：", bold: true, font: "Arial", size: 26, color: "333333" }),
          new TextRun({ text: "GitHub / Gitee / GitLab / Bitbucket", font: "Arial", size: 26, color: "555555" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "文档版本：", bold: true, font: "Arial", size: 26, color: "333333" }),
          new TextRun({ text: "v1.0", font: "Arial", size: 26, color: "555555" })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({ spacing: { after: 400 } }),

      // === SECTION 1: 什么是 SSH Key ===
      new Paragraph({
        children: [new TextRun({ text: "1. 什么是 SSH Key？", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "SSH Key 是一种基于密钥的身份验证机制。与传统的用户名密码登录方式不同，SSH Key 使用一对加密密钥来确认您的身份：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 120 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [1805, 7221],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA },
                shading: { fill: "1F4E79", type: ShadingType.CLEAR },
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "类型", bold: true, font: "Arial", size: 24, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA },
                shading: { fill: "D6E4F0", type: ShadingType.CLEAR },
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "说明", bold: true, font: "Arial", size: 24, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "公钥", font: "Arial", size: 24 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "提交到 Git 平台，用于服务器端验证", font: "Arial", size: 24 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "私钥", font: "Arial", size: 24 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "保存在本机，绝对不能泄露。用于解密和签名验证", font: "Arial", size: 24 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 120 } }),
      new Paragraph({
        children: [new TextRun({ text: "为什么推荐使用 SSH Key？", bold: true, font: "Arial", size: 28, color: "1F4E79" })],
        spacing: { before: 120, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "更安全：", bold: true, font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "比密码更难被暴力破解，密钥长度可达 4096 bit", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "更方便：", bold: true, font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "配置一次后无需每次输入密码", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "更灵活：", bold: true, font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "可以为不同平台、不同用途生成不同的密钥对", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 200 }
      }),

      // === SECTION 2: 检查是否已有 SSH Key ===
      new Paragraph({
        children: [new TextRun({ text: "2. 检查是否已有 SSH Key", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "在生成新的密钥之前，先检查本机是否已经存在 SSH Key。", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "操作步骤：", bold: true, font: "Arial", size: 26, color: "1F4E79" })],
        spacing: { before: 120, after: 80 }
      }),
      new Paragraph({
        numbering: { reference: "ordered-list", level: 0 },
        children: [new TextRun({ text: "打开终端（Terminal / Git Bash / PowerShell）", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 60 }
      }),
      new Paragraph({
        numbering: { reference: "ordered-list", level: 0 },
        children: [new TextRun({ text: "执行以下命令查看是否存在已有密钥：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 60 }
      }),
      codeBlock("ls ~/.ssh/id_*.pub"),
      new Paragraph({
        children: [new TextRun({ text: "可能的结果：", bold: true, font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2256, 6770],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA },
                shading: { fill: "E2EFDA", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "结果", bold: true, font: "Arial", size: 22, color: "375623" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA },
                shading: { fill: "E2EFDA", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "含义", bold: true, font: "Arial", size: 22, color: "375623" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "显示文件路径", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "已存在密钥，可跳过生成步骤直接使用", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "No such file or directory", font: "Consolas", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "没有现有密钥，需要按照后续步骤生成新密钥", font: "Arial", size: 22 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 } }),

      // === SECTION 3: 生成 SSH Key ===
      new Paragraph({
        children: [new TextRun({ text: "3. 生成 SSH Key", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "推荐使用 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Ed25519", bold: true, font: "Arial", size: 24, color: "1F4E79" }),
          new TextRun({ text: " 算法，它是目前最安全且最高效的密钥算法。", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "3.1 基本生成命令", bold: true, font: "Arial", size: 28, color: "2E75B6" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "在终端中执行以下命令（将邮箱替换为你的邮箱）：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      codeBlock('ssh-keygen -t ed25519 -C "your_email@example.com"'),
      new Paragraph({
        children: [new TextRun({ text: "参数说明：", bold: true, font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [1805, 7221],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA },
                shading: { fill: "D6E4F0", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "参数", bold: true, font: "Arial", size: 22, color: "1F4E79" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA },
                shading: { fill: "D6E4F0", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "说明", bold: true, font: "Arial", size: 22, color: "1F4E79" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "-t ed25519", font: "Consolas", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "指定密钥算法为 Ed25519，安全且高效", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: '-C "email"', font: "Consolas", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "添加注释（通常是你的邮箱），用于识别该密钥的归属", font: "Arial", size: 22 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 } }),

      new Paragraph({
        children: [new TextRun({ text: "3.2 交互式配置流程", bold: true, font: "Arial", size: 28, color: "2E75B6" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "执行命令后，终端会提示你进行以下配置：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "保存文件的目录：", bold: true, font: "Arial", size: 26, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "按 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Enter", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " 键接受默认路径 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "~/.ssh/id_ed25519", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " ，这是推荐的做法。", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "设置密码短语（Passphrase）：", bold: true, font: "Arial", size: 26, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "输入两次密码短语以保护私钥。", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "强烈建议设置密码短语！", bold: true, font: "Arial", size: 24, color: "FF0000" })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "即使私钥文件被盗，没有密码短语也无法使用。如果不想每次输入，可以配合 ssh-agent 使用。", font: "Arial", size: 22, color: "555555" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "如果看到如下输出，说明密钥生成成功：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        style: "Code",
        children: [new TextRun({ text: 'Your identification has been saved in /Users/xxx/.ssh/id_ed25519\nYour public key has been saved in /Users/xxx/.ssh/id_ed25519.pub\n\nThe key fingerprint is:\nSHA256:xxxxxxxxxxxxxxxxxxxx your_email@example.com', font: "Consolas", size: 20 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
        },
        spacing: { before: 120, after: 200 }
      }),

      // === SECTION 4: 将公钥添加到 Git 平台 ===
      new Paragraph({
        children: [new TextRun({ text: "4. 将公钥添加到 Git 平台", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "第一步：查看你的公钥内容", bold: true, font: "Arial", size: 26, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock("cat ~/.ssh/id_ed25519.pub"),
      new Paragraph({
        children: [new TextRun({ text: "输出类似如下内容（整行复制）：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        style: "Code",
        children: [new TextRun({ text: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIxxxxxxxxxxxxxxxxxxxx your_email@example.com', font: "Consolas", size: 20 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
        },
        spacing: { before: 80, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "第二步：添加到各平台", bold: true, font: "Arial", size: 26, color: "1F4E79" })],
        spacing: { before: 120, after: 120 }
      }),

      // GitHub
      new Paragraph({
        children: [new TextRun({ text: "4.1 GitHub", bold: true, font: "Arial", size: 28, color: "2E75B6" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 120, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "① 登录 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "github.com", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: "，点击右上角头像 → ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Settings", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: "（设置）", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "② 左侧菜单选择 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "SSH and GPG keys", font: "Consolas", size: 22, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "③ 点击 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "New SSH key", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " 按钮", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "④ 填写表单：", bold: true, font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2256, 6770],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA },
                shading: { fill: "D6E4F0", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "字段", bold: true, font: "Arial", size: 22, color: "1F4E79" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA },
                shading: { fill: "D6E4F0", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "填写说明", bold: true, font: "Arial", size: 22, color: "1F4E79" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "Title", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "自定义名称，如 \"My MacBook\"", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "Type", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "选择 ED25519（或 RSA）", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "Key", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "粘贴上一步复制的完整公钥内容", font: "Arial", size: 22 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "⑤ 点击 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Add SSH key", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " 完成添加", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { before: 80, after: 200 }
      }),

      // Gitee
      new Paragraph({
        children: [new TextRun({ text: "4.2 Gitee（码云）", bold: true, font: "Arial", size: 28, color: "2E75B6" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "① 登录 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "gitee.com", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: "，点击右上角头像 → ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "设置", font: "Consolas", size: 22, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "② 左侧菜单选择 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "SSH公钥", font: "Consolas", size: 22, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "③ 点击 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "添加公钥", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: "，填写标题并粘贴公钥内容", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "④ 输入登录密码确认后即可完成", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 200 }
      }),

      // GitLab
      new Paragraph({
        children: [new TextRun({ text: "4.3 GitLab", bold: true, font: "Arial", size: 28, color: "2E75B6" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "① 登录后点击右上角头像 → ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Preferences", font: "Consolas", size: 22, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "② 左侧菜单选择 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "SSH Keys", font: "Consolas", size: 22, color: "333333" })
        ],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "③ 粘贴公钥，设置过期时间（建议不设限制），点击 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "Add key", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " 完成", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 200 }
      }),

      // === SECTION 5: 测试连接 ===
      new Paragraph({
        children: [new TextRun({ text: "5. 测试连接", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "密钥添加完成后，测试是否能正常连接：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "以 GitHub 为例：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock("ssh -T git@github.com"),
      new Paragraph({
        children: [
          new TextRun({ text: "首次连接会提示确认指纹，输入 ", font: "Arial", size: 24, color: "333333" }),
          new TextRun({ text: "yes", font: "Consolas", size: 22, color: "333333" }),
          new TextRun({ text: " 即可。成功后会看到：", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 40 }
      }),
      successBlock('Hi username! You\'ve successfully authenticated, but GitHub does not provide shell access.'),
      new Paragraph({
        children: [new TextRun({ text: "注意：这条信息是正常的！它表示认证成功，只是 GitHub 不提供 shell 访问权限。", font: "Arial", size: 22, color: "555555" })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Gitee 测试命令：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock("ssh -T git@gitee.com"),
      new Paragraph({ spacing: { after: 200 } }),

      // === SECTION 6: 配置 Git 用户信息 ===
      new Paragraph({
        children: [new TextRun({ text: "6. 配置 Git 用户信息", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "使用 SSH Key 前，确保 Git 的用户名和邮箱与 Git 平台注册的一致：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "设置用户名：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock('git config --global user.name "Your Name"'),
      new Paragraph({
        children: [new TextRun({ text: "设置邮箱：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock('git config --global user.email "your_email@example.com"'),
      new Paragraph({
        children: [new TextRun({ text: "查看当前配置：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      codeBlock("git config --global --list"),
      new Paragraph({ spacing: { after: 200 } }),

      // === SECTION 7: 使用 SSH 克隆仓库 ===
      new Paragraph({
        children: [new TextRun({ text: "7. 使用 SSH 克隆仓库", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "配置完成后，使用 SSH 地址克隆仓库：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 120 }
      }),
      codeBlock("git clone git@github.com:username/repository.git"),
      new Paragraph({
        children: [new TextRun({ text: "SSH 地址格式为：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 80, after: 40 }
      }),
      new Paragraph({
        style: "Code",
        children: [new TextRun({ text: "git@平台域名:用户名/仓库名.git", font: "Consolas", size: 22 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
        },
        spacing: { before: 120, after: 200 }
      }),

      // === SECTION 8: 常见问题排查 ===
      new Paragraph({
        children: [new TextRun({ text: "8. 常见问题排查", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        children: [new TextRun({ text: "8.1 Permission denied (publickey)", bold: true, font: "Arial", size: 28, color: "FF0000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "原因：", bold: true, font: "Arial", size: 24, color: "1F4E79" }),
          new TextRun({ text: " 服务器未找到你的公钥或密钥文件权限不正确", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "解决方法：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 40, after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "① 确认公钥已正确添加到 Git 平台", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "② 检查密钥文件权限：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 40, after: 40 }
      }),
      codeBlock("chmod 700 ~/.ssh\nchmod 600 ~/.ssh/id_ed25519\nchmod 644 ~/.ssh/id_ed25519.pub"),
      new Paragraph({
        children: [new TextRun({ text: "③ 确认 ssh-agent 正在运行且已添加密钥：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      codeBlock("ssh-add -l"),
      new Paragraph({ spacing: { after: 200 } }),

      new Paragraph({
        children: [new TextRun({ text: "8.2 Host key verification failed", bold: true, font: "Arial", size: 28, color: "FF0000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "原因：", bold: true, font: "Arial", size: 24, color: "1F4E79" }),
          new TextRun({ text: " 远程主机指纹发生变化（常见于重新安装系统后）", font: "Arial", size: 24, color: "333333" })
        ],
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "解决方法：删除旧的已知主机记录：", bold: true, font: "Arial", size: 24, color: "1F4E79" })],
        spacing: { before: 40, after: 40 }
      }),
      codeBlock("ssh-keygen -R github.com"),
      new Paragraph({ spacing: { after: 200 } }),

      new Paragraph({
        children: [new TextRun({ text: "8.3 使用了错误的密钥", bold: true, font: "Arial", size: 28, color: "FF0000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 160, after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "如果你有多对密钥，SSH 可能选择了错误的那一对。", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 80 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "解决方法：在 ~/.ssh/config 中为每个主机指定密钥：", font: "Arial", size: 24, color: "333333" })],
        spacing: { after: 40 }
      }),
      new Paragraph({
        style: "Code",
        children: [new TextRun({ text: '# ~/.ssh/config\n\nHost github.com\n    HostName github.com\n    User git\n    IdentityFile ~/.ssh/id_ed25519_github\n\nHost gitee.com\n    HostName gitee.com\n    User git\n    IdentityFile ~/.ssh/id_ed25519_gitee', font: "Consolas", size: 20 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        border: {
          left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 },
        },
        spacing: { before: 80, after: 200 }
      }),

      // === SECTION 9: 安全注意事项 ===
      new Paragraph({
        children: [new TextRun({ text: "9. 安全注意事项", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [1805, 7221],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA },
                shading: { fill: "1F4E79", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "序号", bold: true, font: "Arial", size: 22, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA },
                shading: { fill: "1F4E79", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "安全建议", bold: true, font: "Arial", size: 22, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "1", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "永远不要将私钥文件上传到任何平台或分享给他人", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "2", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "务必设置密码短语（Passphrase），为私钥增加额外保护层", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "3", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "定期更换密钥，尤其是设备丢失或怀疑密钥泄露时", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "4", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "为不同平台使用不同的密钥对，便于单独吊销", font: "Arial", size: 22 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 1805, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "5", font: "Arial", size: 22 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 7221, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "确保 ~/.ssh 目录权限为 700，私钥文件权限为 600", font: "Arial", size: 22 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 200 } }),

      // === APPENDIX: 常用命令速查表 ===
      new Paragraph({
        children: [new TextRun({ text: "附录：常用命令速查表", bold: true, font: "Arial", size: 34, color: "1F4E79" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [2256, 6770],
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA },
                shading: { fill: "1F4E79", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "操作", bold: true, font: "Arial", size: 22, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA },
                shading: { fill: "1F4E79", type: ShadingType.CLEAR }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "命令", bold: true, font: "Arial", size: 22, color: "FFFFFF" })], alignment: AlignmentType.CENTER })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "生成密钥", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: 'ssh-keygen -t ed25519 -C "email"', font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "查看公钥", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "cat ~/.ssh/id_ed25519.pub", font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "添加密钥到代理", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "ssh-add ~/.ssh/id_ed25519", font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "列出已添加的密钥", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "ssh-add -l", font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "测试连接", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "ssh -T git@github.com", font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "SSH 克隆仓库", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "git clone git@github.com:user/repo.git", font: "Consolas", size: 20 })] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ borders: cellBorder, width: { size: 2256, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "移除所有密钥", font: "Arial", size: 20 })], alignment: AlignmentType.CENTER })]
              }),
              new TableCell({ borders: cellBorder, width: { size: 6770, type: WidthType.DXA }, margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [new TextRun({ text: "ssh-add -D", font: "Consolas", size: 20 })] })]
              })
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { after: 400 } }),

      // End of document
      new Paragraph({
        children: [new TextRun({ text: "—— 文档结束 ——", font: "Arial", size: 24, color: "999999", italic: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 }
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/lianglaiyang_1/svn/理工/2026课程/项目/wudog/docs/SSH-Key配置教程.docx", buffer);
  console.log("Document created successfully!");
}).catch(err => {
  console.error("Error creating document:", err);
});
