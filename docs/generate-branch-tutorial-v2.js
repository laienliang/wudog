const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  HeadingLevel, LevelFormat
} = require('docx');
const fs = require('fs');

// Helper: styled code block with left accent bar
function codeBlock(text) {
  return new Paragraph({
    children: [
      new TextRun({ text, font: 'Consolas', size: 22, color: '1A1A1A' })
    ],
    spacing: { before: 100, after: 100 },
    shading: { type: ShadingType.CLEAR, fill: 'F5F8FA' },
    border: {
      left: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 8 },
      top: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0', space: 4 },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0', space: 4 },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0', space: 4 }
    },
    tabStops: [{ type: AlignmentType.RIGHT, position: 9360 }]
  });
}

// Helper: bullet list item
function bulletPoint(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun(text)],
    spacing: { before: 60, after: 60 }
  });
}

// Helper: numbered step
function numberedStep(text) {
  return new Paragraph({
    numbering: { reference: 'steps', level: 0 },
    children: [new TextRun(text)],
    spacing: { before: 80, after: 80 }
  });
}

// Helper: tip/note box
function tipBox(text, type = 'tip') {
  const colors = {
    tip: { fill: 'EBF5E9', accent: '375623', label: '提示' },
    warn: { fill: 'FFF2CC', accent: '92700D', label: '注意' },
    info: { fill: 'EBF5E9', accent: '2E75B6', label: '说明' }
  };
  const c = colors[type] || colors.tip;
  return new Paragraph({
    children: [
      new TextRun({ text: c.label + '：', bold: true, size: 22, font: 'Arial', color: c.accent }),
      new TextRun({ text, size: 22, font: 'Arial', color: '333333' })
    ],
    spacing: { before: 100, after: 100 },
    shading: { type: ShadingType.CLEAR, fill: c.fill },
    border: {
      left: { style: BorderStyle.SINGLE, size: 6, color: c.accent, space: 8 },
      top: { style: BorderStyle.SINGLE, size: 1, color: c.accent, space: 4 },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: c.accent, space: 4 },
      right: { style: BorderStyle.SINGLE, size: 1, color: c.accent, space: 4 }
    }
  });
}

// Helper: section divider line
function divider() {
  return new Paragraph({
    children: [],
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: 'D6E4F0', space: 12 }
    }
  });
}

// Helper: chapter header with colored bar
function chapterHeader(title) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, size: 32, font: 'Arial', color: '1F4E79' })
    ],
    spacing: { before: 300, after: 200 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 10, color: '2E75B6', space: 12 }
    },
    indent: { left: 20 }
  });
}

// Helper: subheading
function subHeading(title) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, bold: true, size: 26, font: 'Arial', color: '2E75B6' })
    ],
    spacing: { before: 200, after: 120 }
  });
}

// Helper: body text
function bodyText(text, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Arial', bold })],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 }
  });
}

// Helper: bold label + normal text inline
function labelValue(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, size: 24, font: 'Arial', color: '2E75B6' }),
      new TextRun({ text: value, size: 24, font: 'Arial', color: '333333' })
    ],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 }
  });
}

// Helper: page break
function pageBreak() {
  return new Paragraph({ children: [new TextRun({ text: '' })], pageBreakBefore: true });
}

// Helper: intro text for sections
function introText(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Arial', color: '444444' })],
    spacing: { before: 60, after: 80 },
    indent: { left: 360 }
  });
}

// Table cell with alternating row colors
function tableRow(cmd, desc, rowIdx) {
  const bg = rowIdx % 2 === 0 ? 'FFFFFF' : 'F5F8FA';
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cmd, font: 'Consolas', size: 20 })] })],
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        width: { size: 3600, type: WidthType.DXA }
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20 })] })],
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        width: { size: 5760, type: WidthType.DXA }
      })
    ]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 24 } },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 32, bold: true, font: 'Arial', color: '1F4E79' },
          paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 }
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 26, bold: true, font: 'Arial', color: '2E75B6' },
          paragraph: { spacing: { before: 180, after: 160 }, outlineLevel: 1 }
        },
        {
          id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 24, bold: true, italic: true, font: 'Arial', color: '375623' },
          paragraph: { spacing: { before: 140, after: 120 }, outlineLevel: 2 }
        }
      ]
    }
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      },
      {
        reference: 'steps',
        levels: [
          {
            level: 0,
            format: LevelFormat.ARABIC_DIGIT,
            text: '%1)',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        width: 12240,
        height: 15840,
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // ===== TITLE PAGE =====
      new Paragraph({
        children: [new TextRun({ text: 'Git 分支管理与 GitHub 提交教程', bold: true, size: 48, font: 'Arial', color: '1F4E79' })],
        spacing: { before: 1800, after: 200, alignment: AlignmentType.CENTER }
      }),
      new Paragraph({
        children: [new TextRun({ text: '从创建分支到推送代码的完整指南', size: 26, font: 'Arial', color: '595959' })],
        spacing: { after: 600, alignment: AlignmentType.CENTER }
      }),
      // Divider on title page
      new Paragraph({
        children: [],
        spacing: { before: 100, after: 100 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 2, color: '2E75B6', space: 16 }
        },
        alignment: AlignmentType.CENTER
      }),
      labelValue('适用项目：', '乌东文旅综合管理平台（wudog）'),
      labelValue('适用对象：', '课程学生'),
      labelValue('版本：', 'v1.0'),
      new Paragraph({
        children: [new TextRun({ text: '', size: 20, font: 'Arial', color: '999999' })],
        spacing: { before: 600, after: 200, alignment: AlignmentType.CENTER }
      }),
      pageBreak(),

      // ===== TABLE OF CONTENTS =====
      new Paragraph({
        children: [new TextRun({ text: '目  录', bold: true, size: 32, font: 'Arial', color: '1F4E79' })],
        spacing: { before: 200, after: 200 },
        border: {
          left: { style: BorderStyle.SINGLE, size: 10, color: '2E75B6', space: 12 }
        }
      }),
      tocItem('一、准备工作', '1'),
      tocItem('二、创建个人分支', '2'),
      tocItem('三、日常开发流程', '4'),
      tocItem('四、同步最新代码', '5'),
      tocItem('五、常见问题解答', '6'),
      tocItem('六、附录', '8'),
      pageBreak(),

      // ===== CHAPTER 1: 准备工作 =====
      chapterHeader('第一章 准备工作'),
      introText('在开始使用 Git 进行协作开发之前，你需要完成以下准备工作。'),

      subHeading('1.1 安装 Git'),
      introText('如果你还没有安装 Git，请按以下步骤操作：'),
      numberedStep('访问 Git 官网 https://git-scm.com/downloads'),
      numberedStep('根据你的操作系统（Windows / macOS / Linux）下载并安装最新版本'),
      numberedStep('安装完成后，打开终端（macOS）或命令行（Windows），运行以下命令验证安装：'),
      codeBlock('git --version'),

      subHeading('1.2 配置 Git 用户信息'),
      introText('在提交代码之前，需要设置你的用户名和邮箱，这些信息会出现在每次提交的记录中：'),
      codeBlock('git config --global user.name "你的名字"'),
      codeBlock('git config --global user.email "your_email@example.com"'),
      tipBox('这里的用户名和邮箱应该与你 GitHub 账户注册时使用的信息保持一致，否则可能会导致推送失败。', 'warn'),

      subHeading('1.3 克隆项目仓库'),
      introText('首先将项目克隆到本地电脑：'),
      codeBlock('git clone https://github.com/你的用户名/wudog.git'),
      codeBlock('cd wudog'),
      tipBox('请将上面的 "你的用户名" 替换为你实际的 GitHub 用户名。克隆完成后，所有的开发操作都在这个文件夹中进行。', 'info'),

      // ===== CHAPTER 2: 创建分支 =====
      chapterHeader('第二章 创建个人分支'),
      introText('每位同学都需要创建自己的专属分支来进行开发工作。'),

      subHeading('2.1 为什么需要创建分支'),
      introText('在团队协作开发中，每个开发者都应该在自己的分支上工作，而不是直接在主分支（master）上修改代码。这样做的好处包括：'),
      bulletPoint('避免不同开发者的代码互相干扰'),
      bulletPoint('方便每个人独立开发和测试自己的功能'),
      bulletPoint('主分支始终保持稳定可用的状态'),
      bulletPoint('代码审查时可以清晰地看到每个人的改动'),

      subHeading('2.2 查看当前分支'),
      introText('在进入分支操作之前，先确认自己当前所在的分支：'),
      codeBlock('git branch'),
      introText('输出结果中带 * 号的分支表示当前所在的分支。正常情况下，你应该在 master 分支上。'),

      subHeading('2.3 创建并切换到个人分支'),
      introText('每位同学按照以下命名规则创建自己的分支：'),
      tipBox('命名格式：group_XX（XX 为你的小组编号，例如 group_01、group_02、group_12 等）', 'info'),
      introText('创建并切换到你的分支，假设你是第 1 组：'),
      codeBlock('git checkout -b group_01'),
      introText('其中：'),
      bulletPoint('-b 参数表示同时创建新分支并切换过去（相当于先创建再切换两步合一）'),
      bulletPoint('group_01 是分支名称，请根据自己的小组编号替换（如 group_05、group_10 等）'),
      introText('创建完成后，再次确认分支已切换成功：'),
      codeBlock('git branch'),
      tipBox('此时应该能看到 group_01 分支前有 * 号标记，表示你已经在这个分支上了。', 'tip'),

      subHeading('2.4 推送分支到远程仓库'),
      introText('将本地创建的分支推送到 GitHub 远程仓库，让老师和团队成员都能看到：'),
      codeBlock('git push -u origin group_01'),
      tipBox('-u 参数会将本地分支与远程分支关联起来。关联之后，后续可以直接使用 git push 而无需指定远程分支名。', 'info'),

      // ===== CHAPTER 3: 日常开发流程 =====
      chapterHeader('第三章 日常开发流程'),
      introText('在你的分支上完成开发任务后，按以下流程提交代码。'),

      subHeading('3.1 查看文件修改状态'),
      introText('随时可以查看哪些文件被修改了：'),
      codeBlock('git status'),
      introText('该命令会列出三类文件：'),
      bulletPoint('红色文件 — 已修改但未暂存的文件'),
      bulletPoint('绿色文件 — 已暂存（staged），等待提交的文件'),
      bulletPoint('未跟踪文件 — 新创建的文件，需要用 git add 添加到版本控制'),

      subHeading('3.2 添加文件到暂存区'),
      introText('将你修改或新建的文件添加到暂存区，准备提交：'),
      codeBlock('git add 文件名.vue'),
      introText('或者一次性添加所有改动：'),
      codeBlock('git add .'),

      subHeading('3.3 提交修改'),
      introText('将暂存区的修改正式提交到本地仓库。提交信息要用中文，简洁说明本次改动：'),
      codeBlock('git commit -m "添加商品列表页面"'),
      introText('好的提交信息示例：'),
      bulletPoint('"添加用户登录功能"'),
      bulletPoint('"修复订单金额计算错误"'),
      bulletPoint('"更新导航栏样式"'),
      tipBox('提交信息应该简明扼要，让别人一看就知道你改了什么。避免使用 "update"、"fix" 这样模糊的描述。', 'warn'),

      subHeading('3.4 推送代码到 GitHub'),
      introText('将本地提交推送到远程仓库的 group_01 分支：'),
      codeBlock('git push'),
      introText('因为之前使用了 -u 参数建立了关联，这里直接 git push 即可自动推送到 origin/group_01。'),

      // ===== CHAPTER 4: 同步最新代码 =====
      chapterHeader('第四章 同步最新代码'),
      introText('每天开始工作前，务必先拉取最新代码，确保自己的工作基于最新版本。'),

      subHeading('4.1 拉取团队最新改动'),
      codeBlock('git pull origin group_01'),

      subHeading('4.2 同步主分支最新代码'),
      introText('如果老师更新了 master 分支的代码，你需要将其合并到自己的分支：'),
      codeBlock('git checkout master'),
      codeBlock('git pull origin master'),
      codeBlock('git checkout group_01'),
      codeBlock('git merge master'),
      tipBox('这样就将 master 的最新改动合并到了你的分支。如果有冲突，Git 会提示你手动解决。', 'info'),

      // ===== CHAPTER 5: 常见问题 =====
      chapterHeader('第五章 常见问题解答'),

      subHeading('Q1: 输错了分支名怎么办？'),
      codeBlock('git branch -m group_01 group_02'),
      introText('将 group_01 重命名为 group_02。如果已经推送到远程，还需要更新远程分支：'),
      codeBlock('git push origin -u group_02'),
      codeBlock('git push origin --delete group_01'),

      subHeading('Q2: 想删除一个分支怎么办？'),
      codeBlock('git branch -d group_01'),
      introText('删除本地分支。如果要删除远程分支：'),
      codeBlock('git push origin --delete group_01'),

      subHeading('Q3: 不小心提交了错误的代码怎么撤销？'),
      codeBlock('git reset HEAD~1'),
      introText('撤回最近一次提交，但保留文件修改。如果需要撤回多次提交，将 1 改为相应的次数。'),
      tipBox('如果已经推送到远程，需要使用 git push --force 强制推送，但这会影响团队成员，请谨慎操作。', 'warn'),

      subHeading('Q4: 遇到代码冲突怎么办？'),
      introText('当多人修改了同一个文件的同一部分时会产生冲突。Git 会在文件中标记冲突位置：'),
      codeBlock('<<<<<<< group_01'),
      codeBlock('自己的代码'),
      codeBlock('======='),
      codeBlock('其他人的代码'),
      codeBlock('>>>>>>> master'),
      introText('你需要手动编辑文件，保留正确的代码，删除这些标记，然后重新提交即可。'),
      tipBox('遇到冲突不要慌张，这是正常的协作现象。仔细分析两边的改动，保留需要的部分，删除冲突标记。', 'tip'),

      // ===== APPENDIX: Command reference =====
      chapterHeader('第六章 附录'),

      subHeading('常用 Git 命令速查表'),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' },
          insideH: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' },
          insideV: { style: BorderStyle.SINGLE, size: 1, color: 'D6E4F0' }
        },
        rows: [
          // Header
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: '命令', bold: true, size: 22 })] })],
                shading: { fill: '1F4E79', type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: '说明', bold: true, size: 22 })] })],
                shading: { fill: '1F4E79', type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }
              })
            ]
          }),
          tableRow('git branch', '查看所有本地分支', 0),
          tableRow('git checkout -b 分支名', '创建并切换到新分支', 1),
          tableRow('git checkout 分支名', '切换到已有分支', 0),
          tableRow('git add .', '将所有修改添加到暂存区', 1),
          tableRow('git commit -m "信息"', '提交暂存区的修改', 0),
          tableRow('git push', '推送到远程仓库', 1),
          tableRow('git pull', '从远程仓库拉取最新代码', 0),
          tableRow('git status', '查看当前仓库状态', 1),
          tableRow('git log', '查看提交历史记录', 0),
          tableRow('git merge master', '合并主分支的最新改动', 1),
        ]
      }),

      subHeading('每日工作流程'),
      introText('以下是每天工作的标准流程，建议打印出来贴在桌前：'),
      numberedStep('打开终端，进入项目目录'),
      numberedStep('切换到自己的分支：git checkout group_XX'),
      numberedStep('拉取最新代码：git pull origin group_XX'),
      numberedStep('开始编写或修改代码'),
      numberedStep('保存修改后，查看状态：git status'),
      numberedStep('添加修改的文件：git add .'),
      numberedStep('提交修改：git commit -m "描述信息"'),
      numberedStep('推送到远程：git push'),
      numberedStep('如有需要，在 GitHub 上发起 Pull Request 请求代码审查'),

      // Footer
      new Paragraph({
        spacing: { before: 400 },
        children: [
          new TextRun({
            text: '如有疑问，请咨询指导老师或在 GitHub 上提 Issue。',
            italic: true,
            size: 20,
            font: 'Arial',
            color: '999999'
          })
        ]
      }),
    ]
  }]
});

function tocItem(text, page) {
  return new Paragraph({
    children: [
      new TextRun({ text, size: 24, font: 'Arial', color: '333333' }),
      new TextRun({ children: Array(40).fill(' '), joinText: '' }),
      new TextRun({ text: page, size: 24, font: 'Arial', color: '999999' })
    ],
    spacing: { before: 80, after: 80 },
    tabStops: [{ type: AlignmentType.RIGHT, position: 9360 }]
  });
}

Packer.toBuffer(doc).then((buffer) => {
  const outputPath = '/Users/lianglaiyang_1/svn/理工/2026课程/项目/wudog/docs/Git-分支管理与GitHub提交教程.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log('美化版教程文档已生成！');
  console.log('文件大小：' + (buffer.length / 1024).toFixed(1) + ' KB');
});
