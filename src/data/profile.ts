// 导航里「个人主页」的全部内容都集中在这个文件，改这里即可更新页面，无需动组件代码。
//
// 编辑说明：
//   - 需要 zh / en 两个版本的内容写成 { zh: '...', en: '...' }（LocalText）；
//     如果两种语言共用同一份文字（如人名、时间、专有名词），直接写普通字符串即可。
//   - 正文条目（bullets）支持行内富文本：[文字](链接) 渲染为超链接，**文字** 渲染为加粗，
//     类似 LaTeX 里的 \href 与 \textbf。
//   - 区块（研究经历/项目经历/实习/教育）都是数组，增删条目直接增删数组元素。
//   - 空数组（[]）的区块不会出现在页面上。

export type Language = 'zh' | 'en';

export interface LocalText {
  zh: string;
  en: string;
}

/** 两种语言共用的文字可以直接写字符串 */
export type Text = LocalText | string;

/** 经历类条目：教育 / 研究经历 / 项目经历 / 实习与工作共用同一结构 */
export interface ResumeEntry {
  /** 时间段，如 '2025.09 - 2028.06' */
  period: Text;
  /** 条目标题：学校 / 论文或项目名 / 公司与项目名 */
  title: Text;
  /** 副标题（斜体展示）：学位、研究方向、承担角色等 */
  subtitle?: Text;
  /** 详细条目，支持 [文字](链接) 与 **加粗** */
  bullets?: Text[];
}

/** 荣誉奖项条目 */
export interface Award {
  year?: string;
  name: Text;
  url?: string;
}

export const profile = {
  name: { zh: '赵甫霖', en: 'Fulin Zhao' } as LocalText,
  /** 头像图片，放在 public/ 下（对应 public/fulin-avatar.jpg，512px 压缩版，肉眼无损） */
  avatar: 'fulin-avatar.jpg',
  role: {
    zh: '算法与 LLM Agent 开发方向 · HUST 硕士在读',
    en: 'ML & LLM Agent development · M.S. student at HUST',
  } as LocalText,
  email: 'zhaoqie888@icloud.com',
  location: { zh: '湖北武汉', en: 'Wuhan, China' } as LocalText,

  /** 左侧栏的外链（原样展示，如 GitHub / LinkedIn / Google Scholar） */
  links: [
    { label: 'GitHub', url: 'https://github.com/Holidayrabbit' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/fulin-zhao-261479308/' },
  ],

  /** 简历 PDF，放在 public/ 下（对应 public/pdfs/resume.pdf），下载按钮会指向它 */
  resumePdf: 'pdfs/resume.pdf',

  /** 关于我：一个元素是一段话 */
  about: [
    {
      zh: '我是赵甫霖，华中科技大学信息与通信工程专业硕士研究生，研究方向是强化学习、Agent 技术与大语言模型安全。',
      en: "I'm Fulin Zhao, a master's student in Information and Communication Engineering at Huazhong University of Science and Technology (HUST). My research focuses on reinforcement learning, agent technology, and LLM safety.",
    },
  ] as Text[],

  /** 研究兴趣标签 */
  interests: [
    'LLM Agent',
    { zh: '强化学习', en: 'Reinforcement Learning' },
    { zh: '大语言模型安全', en: 'LLM Safety' },
    { zh: '软件安全', en: 'Software Security' },
  ] as Text[],

  /** 教育经历 */
  education: [
    {
      period: '2025.09 - 2028.06',
      title: { zh: '华中科技大学 · 电子信息与通信学院', en: 'HUST · School of Electronic Information and Communications' },
      subtitle: { zh: '信息与通信工程专业，学术型硕士研究生（预计毕业）', en: 'M.S. in Information and Communication Engineering (expected)' },
      bullets: [{ zh: '研究方向：强化学习、Agent 技术、大语言模型安全', en: 'Research direction: reinforcement learning, agent technology, and LLM safety' }],
    },
    {
      period: '2021.09 - 2025.06',
      title: { zh: '华中科技大学 · 未来技术学院', en: 'HUST · Institute of Future Technology' },
      subtitle: { zh: '人工智能专业，本科（已毕业）', en: 'B.Eng. in Artificial Intelligence' },
      bullets: [{ zh: 'GPA：4.23/5.0，综合排名 15/104', en: 'GPA: 4.23/5.0, ranked 15/104' }],
    },
  ] as ResumeEntry[],

  /** 荣誉奖项 */
  awards: [
    { year: '2025', name: { zh: '太湖奖学金', en: 'Taihu Scholarship' } },
    { year: '2025', name: { zh: '华中科技大学优秀毕业生', en: 'Outstanding Graduate of HUST' } },
  ] as Award[],

  /** 研究经历 */
  research: [
    {
      period: '2024.11 - 2025.08',
      title: { zh: 'RoMac：鲁棒 Android 恶意软件家族分类框架', en: 'RoMac: A Robust Android Malware Family Classification Framework' },
      subtitle: { zh: '负责实验', en: 'Led experiments' },
      bullets: [
        { zh: '研发面向 Android 恶意软件的鲁棒分类模型，针对高标签噪声与类别不均衡问题提升分类稳定性。', en: 'Developed a robust classification model for Android malware, improving stability under high label noise and class imbalance.' },
        { zh: '在 Android 恶意软件数据集上与 Mentormix 等深度学习方法进行对比实验，验证 RoMac 方法的有效性与优势。', en: 'Ran comparison experiments against deep learning methods such as Mentormix on Android malware datasets, validating the effectiveness and advantages of RoMac.' },
        { zh: '论文计划投稿 CCF-A 类期刊 [TIFS](https://signalprocessingsociety.org/publications-resources/ieee-transactions-information-forensics-and-security)。', en: 'Paper to be submitted to [TIFS](https://signalprocessingsociety.org/publications-resources/ieee-transactions-information-forensics-and-security), a CCF-A journal.' },
      ],
    },
    {
      period: '2026.01 - 2026.08',
      title: { zh: '基于人机 UI 不同步感知的 Mobile Agent 安全风险研究', en: 'Mobile Agent Security Risks via Human-Agent UI Desynchronization' },
      subtitle: { zh: '共同一作，负责实验和论文撰写', en: 'Co-first author; led experiments and paper writing' },
      bullets: [
        { zh: '提出「人-智能体 UI 失同步」这一不可信观测攻击面，并设计实现面向 Android 应用的扰动自动构建与部署框架。', en: "Proposed the 'human-agent UI desynchronization' untrusted-observation attack surface, and designed a framework that automatically constructs and deploys perturbations against Android apps." },
        { zh: '开展大规模攻击评估与用户研究，验证了攻击对未见任务的迁移性。', en: 'Conducted large-scale attack evaluation and a user study, demonstrating the transferability of the attack to unseen tasks.' },
        { zh: '论文投稿 CCF-A 类会议，论文见 [arXiv](https://arxiv.org/abs/2609.16732)。', en: 'Paper submitted to a CCF-A conference; see [arXiv](https://arxiv.org/abs/2609.16732).' },
      ],
    },
  ] as ResumeEntry[],

  /** 项目经历 */
  projects: [
    {
      period: '2024.10 - 2025.03',
      title: { zh: '基于 GNN 的电信诈骗检测算法', en: 'GNN-based Telecom Fraud Detection' },
      subtitle: {
        zh: '项目负责人 & 算法工程师（合作方：[中国移动湖北公司](https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/hb/index.html?id=1)）',
        en: 'Project lead & algorithm engineer (with [China Mobile Hubei](https://www.10086.cn/aboutus/culture/intro/province_culture_intro_detail/hb/index.html?id=1))',
      },
      bullets: [
        { zh: '基于 GAT 与 AdaBoost 算法设计半监督电信诈骗检测方法，用于识别复杂关系网络中的异常用户与风险行为。', en: 'Designed a semi-supervised fraud detection method based on GAT and AdaBoost to identify anomalous users and risky behaviors in complex relational networks.' },
        { zh: '完成模型训练、评估与效果分析，并协助将算法部署至服务器环境。', en: 'Completed model training, evaluation, and performance analysis, and helped deploy the algorithm to server environments.' },
      ],
    },
    {
      period: '2024.02 - 2024.08',
      title: { zh: 'ArtemisBot：基于 RobeiEDA 与 Vivado 的可重构机器人驱动芯片设计', en: 'ArtemisBot: Reconfigurable Robot Driver Chip Design with RobeiEDA and Vivado' },
      subtitle: { zh: '项目负责人 & 驱动算法工程师', en: 'Project lead & driver algorithm engineer' },
      bullets: [
        { zh: '负责机器人驱动数字芯片的逻辑设计与仿真验证，优化芯片控制逻辑与运行性能。', en: 'Led the logic design and simulation verification of the robot driver chip, optimizing control logic and performance.' },
        { zh: '在机器人实体平台上完成芯片性能验证，并开发通信 App 实现机器人控制。', en: 'Validated chip performance on a physical robot platform and developed a companion app for robot control.' },
        { zh: '**获奖：**第八届全国大学生集成电路创新创业大赛**全国三等奖**，代码见 [GitHub](https://github.com/Holidayrabbit/IC_design_armcar_Robei/)。', en: '**Award:** National Third Prize in the 8th China College Students Integrated Circuit Innovation and Entrepreneurship Competition; code on [GitHub](https://github.com/Holidayrabbit/IC_design_armcar_Robei/).' },
      ],
    },
  ] as ResumeEntry[],

  /** 实习与工作经历 */
  internships: [
    {
      period: '2024',
      title: { zh: '深圳零一学院 · 基于 AI 的社会创新项目', en: 'Shenzhen Zero-One Academy · AI-driven Social Innovation Program' },
      subtitle: { zh: 'X-Challenge 暑期研究实习', en: 'X-Challenge summer research intern' },
      bullets: [
        { zh: '参与 X-Challenge 暑期研究实习，获 2024 年大学生创新发明大赛**全国三等奖**。', en: 'Completed the X-Challenge summer research program; won **National Third Prize** in the 2024 College Student Innovation and Invention Competition.' },
      ],
    },
    {
      period: '2025',
      title: { zh: 'Aibrary · 基于 LLM 的经典书籍播客生成框架', en: 'Aibrary · LLM-based Podcast Generation for Classic Books' },
      subtitle: { zh: '机器学习算法实习生', en: 'Machine learning algorithm intern' },
      bullets: [
        { zh: '构建基于 LLM 的双人播客脚本生成框架，应用已上线 **App Store** 与 **Google Play**（[项目链接](https://www.aibrary.ai/)）。', en: 'Built an LLM-based two-host podcast script generation framework; the app is live on **App Store** and **Google Play** ([link](https://www.aibrary.ai/)).' },
      ],
    },
    {
      period: '2025',
      title: { zh: '奇绩创坛 · 面向创业者的前沿知识平台「齐思」，部署 Agent 赋能内部业务', en: 'MiraclePlus · "Qisi", a frontier-knowledge platform for founders, plus internal Agent deployment' },
      subtitle: { zh: '全栈工程师', en: 'Full-stack engineer' },
      bullets: [
        { zh: '基于 Ruby 与 Python 开发后端系统并为内部业务部署 AI 智能体，Web 应用「齐思」已上线（[齐思链接](https://news.miracleplus.com/)）。', en: 'Developed backend systems in Ruby and Python and deployed AI agents for internal teams; the web app "Qisi" is live ([link](https://news.miracleplus.com/)).' },
      ],
    },
  ] as ResumeEntry[],

  /** 技能：一行一条，**开头加粗**的是分类名 */
  skills: [
    { zh: '**编程语言：**Python、Ruby、C/C++', en: '**Languages:** Python, Ruby, C/C++' },
    { zh: '**框架与工具：**PyTorch、LangChain & LangGraph、FastAPI、Rails、Docker、Git', en: '**Frameworks & Tools:** PyTorch, LangChain & LangGraph, FastAPI, Rails, Docker, Git' },
    { zh: '**英语：**CET-4 / CET-6，可阅读与撰写英文技术文档', en: '**English:** CET-4 / CET-6, comfortable reading and writing technical documents' },
  ] as Text[],

  /** 区块标题 */
  sectionTitles: {
    about: { zh: '关于我', en: 'About Me' } as LocalText,
    interests: { zh: '研究兴趣', en: 'Research Interests' } as LocalText,
    education: { zh: '教育经历', en: 'Education' } as LocalText,
    awards: { zh: '荣誉奖项', en: 'Honors & Awards' } as LocalText,
    research: { zh: '研究经历', en: 'Research Experience' } as LocalText,
    projects: { zh: '项目经历', en: 'Projects' } as LocalText,
    internships: { zh: '工作经历', en: 'Work Experience' } as LocalText,
    skills: { zh: '技能', en: 'Skills' } as LocalText,
  },
};
