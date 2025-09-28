#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'public', 'articles');
const outputFile = path.join(rootDir, 'public', 'articles.json');

/**
 * 从文件名生成文章ID
 */
function generateIdFromFilename(filename) {
  return filename.replace('.md', '');
}

/**
 * 处理markdown内容：移除frontmatter和第一个h1标题
 */
function processMarkdownContent(content) {
  let processedContent = content;
  
  // 移除frontmatter（如果存在）
  if (processedContent.startsWith('---')) {
    const frontmatterEnd = processedContent.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      processedContent = processedContent.substring(frontmatterEnd + 3).replace(/^\s*\n/, '');
    }
  }
  
  // 移除第一个h1标题
  processedContent = processedContent.replace(/^#\s+.+$/m, '');
  
  // 清理开头的空行
  processedContent = processedContent.replace(/^\s*\n+/, '');
  
  return processedContent;
}

/**
 * 从markdown内容中提取摘要
 */
function extractExcerpt(content, maxLength = 200) {
  // 先处理内容，移除frontmatter和重复标题
  const processedContent = processMarkdownContent(content);
  
  // 移除markdown语法
  const plainText = processedContent
    .replace(/^#.*/gm, '') // 移除剩余标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接
    .replace(/\n+/g, ' ') // 换行改为空格
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
}

/**
 * 从内容中提取标签（基于一些启发式规则）
 */
function extractTags(content, filename) {
  const tags = new Set();
  
  // 根据文件名添加标签
  if (filename.includes('api')) tags.add('API');
  if (filename.includes('tool') || filename.includes('工具')) tags.add('工具');
  if (filename.includes('tutorial') || filename.includes('教程')) tags.add('教程');
  if (filename.includes('review') || filename.includes('评测')) tags.add('评测');
  
  // 从内容中识别技术关键词
  const keywords = [
    { pattern: /python|Python/gi, tag: 'Python' },
    { pattern: /react|React/gi, tag: 'React' },
    { pattern: /javascript|JavaScript|JS/gi, tag: 'JavaScript' },
    { pattern: /typescript|TypeScript|TS/gi, tag: 'TypeScript' },
    { pattern: /ai|AI|人工智能/gi, tag: 'AI' },
    { pattern: /claude|Claude/gi, tag: 'Claude' },
    { pattern: /爬虫|scraping/gi, tag: '爬虫' },
    { pattern: /数据|data/gi, tag: '数据分析' },
    { pattern: /开发|development/gi, tag: '开发' },
    { pattern: /machine learning|机器学习/gi, tag: '机器学习' },
    { pattern: /conda|pip|环境管理/gi, tag: '环境管理' },
    { pattern: /uv/gi, tag: 'uv' },
  ];
  
  keywords.forEach(({ pattern, tag }) => {
    if (pattern.test(content)) {
      tags.add(tag);
    }
  });
  
  return Array.from(tags);
}

/**
 * 格式化日期
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 获取ISO格式日期（用于排序）
 */
function getISODate(date) {
  return date.toISOString().split('T')[0];
}

/**
 * 处理单个markdown文件
 */
function processMarkdownFile(filename) {
  const filePath = path.join(articlesDir, filename);
  const fileStats = fs.statSync(filePath);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // 使用gray-matter解析frontmatter
  const parsed = matter(fileContent);
  const { data: frontmatter, content } = parsed;
  
  // 从frontmatter或文件内容中提取信息
  const id = frontmatter.id || generateIdFromFilename(filename);
  const title = frontmatter.title || content.match(/^#\s+(.+)$/m)?.[1] || filename.replace('.md', '');
  const date = frontmatter.date ? new Date(frontmatter.date) : fileStats.mtime;
  const excerpt = frontmatter.excerpt || extractExcerpt(content);
  const tags = frontmatter.tags || extractTags(content, filename);
  
  return {
    id,
    title,
    date: formatDate(date),
    excerpt,
    tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
    filename,
    dateSort: getISODate(date)
  };
}

/**
 * 主函数
 */
function generateArticlesIndex() {
  try {
    console.log('🔍 扫描文章目录...');
    
    // 检查articles目录是否存在
    if (!fs.existsSync(articlesDir)) {
      console.error(`❌ 文章目录不存在: ${articlesDir}`);
      process.exit(1);
    }
    
    // 读取所有markdown文件
    const files = fs.readdirSync(articlesDir)
      .filter(file => file.endsWith('.md'))
      .sort();
    
    if (files.length === 0) {
      console.log('⚠️  未找到markdown文件');
      return;
    }
    
    console.log(`📄 找到 ${files.length} 篇文章:`);
    
    // 处理每个文件
    const articles = files.map(filename => {
      console.log(`   - ${filename}`);
      return processMarkdownFile(filename);
    });
    
    // 按日期倒序排列（最新的在前面）
    articles.sort((a, b) => new Date(b.dateSort) - new Date(a.dateSort));
    
    // 写入JSON文件
    fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2), 'utf-8');
    
    console.log(`✅ 文章索引已生成: ${outputFile}`);
    console.log(`📊 统计信息:`);
    console.log(`   - 总文章数: ${articles.length}`);
    console.log(`   - 总标签数: ${new Set(articles.flatMap(a => a.tags)).size}`);
    console.log(`   - 最新文章: ${articles[0]?.title} (${articles[0]?.date})`);
    
  } catch (error) {
    console.error('❌ 生成文章索引时出错:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateArticlesIndex();
}

export { generateArticlesIndex };
