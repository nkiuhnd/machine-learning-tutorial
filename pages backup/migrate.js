const fs = require('fs');
const path = require('path');

// 迁移脚本：将现有HTML文件转换为使用外部CSS和JS的架构

function extractCSS(htmlContent) {
    const cssMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
    return cssMatch ? cssMatch[1] : '';
}

function extractJS(htmlContent) {
    const jsMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
    return jsMatch ? jsMatch[1] : '';
}

function removeInlineStyles(htmlContent) {
    return htmlContent.replace(/<style>[\s\S]*?<\/style>/g, '');
}

function addExternalLinks(htmlContent, cssPath, jsPath) {
    // 在head标签中添加外部CSS链接
    htmlContent = htmlContent.replace(
        /<head>([\s\S]*?)<\/head>/,
        `<head>$1    <link rel="stylesheet" href="${cssPath}">\n</head>`
    );
    
    // 在body标签结束前添加外部JS链接（在现有script标签之前）
    htmlContent = htmlContent.replace(
        /(\s*)<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js"><\/script>/,
        `$1<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n    <script src="${jsPath}"></script>`
    );
    
    return htmlContent;
}

function addNavigation(htmlContent, pageType = 'algorithm') {
    const navTemplate = `
        <!-- 导航栏 -->
        <nav class="nav-bar">
            <ul class="nav-links">
                <li><a href="../index-modern.html">🏠 返回首页</a></li>
                <li><a href="#theory">📚 理论</a></li>
                <li><a href="#interactive">🎮 互动</a></li>
                <li><a href="#practice">💡 练习</a></li>
            </ul>
        </nav>
    `;
    
    // 在container div的开始处添加导航
    htmlContent = htmlContent.replace(
        /<div class="container">/,
        `<div class="container">\n        ${navTemplate}`
    );
    
    return htmlContent;
}

function migrateFile(inputPath, outputPath, cssPath, jsPath) {
    try {
        // 读取原始HTML文件
        const htmlContent = fs.readFileSync(inputPath, 'utf8');
        
        // 提取CSS（用于合并到main.css）
        const cssContent = extractCSS(htmlContent);
        
        // 移除内联样式，但保留JavaScript
        let newHtmlContent = removeInlineStyles(htmlContent);
        
        // 添加外部CSS链接
        newHtmlContent = addExternalLinks(newHtmlContent, cssPath, jsPath);
        
        // 添加导航栏
        newHtmlContent = addNavigation(newHtmlContent);
        
        // 写入新文件
        fs.writeFileSync(outputPath, newHtmlContent, 'utf8');
        
        console.log(`✅ 成功迁移: ${inputPath} -> ${outputPath}`);
        
        return { cssContent };
    } catch (error) {
        console.error(`❌ 迁移失败: ${inputPath}`, error.message);
        return null;
    }
}

function createPagesDirectory() {
    const pagesDir = 'pages';
    if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir);
        console.log(`📁 创建目录: ${pagesDir}`);
    }
}

function migrateAllFiles() {
    console.log('🚀 开始迁移项目文件...\n');
    
    createPagesDirectory();
    
    const filesToMigrate = [
        { input: '线性回归互动网页1.html', output: 'pages/linear-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '多元线性回归教学网页.html', output: 'pages/multiple-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '多项式回归教学网页.html', output: 'pages/polynomial-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '决策树回归教学网页.html', output: 'pages/decision-tree-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '决策树分类教学网页.html', output: 'pages/decision-tree-classification.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '逻辑回归教学网页.html', output: 'pages/logistic-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '随机森林分类教学网页.html', output: 'pages/random-forest-classification.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: '随机森林回归教学网页.html', output: 'pages/random-forest-regression.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' },
        { input: 'K均值聚类教学网页.html', output: 'pages/kmeans-clustering.html', cssPath: '../styles/main.css', jsPath: '../js/utils.js' }
    ];
    
    let successCount = 0;
    let failCount = 0;
    
    filesToMigrate.forEach(file => {
        const result = migrateFile(file.input, file.output, file.cssPath, file.jsPath);
        if (result) {
            successCount++;
        } else {
            failCount++;
        }
    });
    
    console.log(`\n📊 迁移完成统计:`);
    console.log(`✅ 成功: ${successCount} 个文件`);
    console.log(`❌ 失败: ${failCount} 个文件`);
    
    if (successCount > 0) {
        console.log(`\n🎉 迁移完成！下一步：`);
        console.log(`1. 测试新页面功能是否正常`);
        console.log(`2. 检查超链接是否正确`);
        console.log(`3. 根据需要调整页面内容`);
    }
}

if (require.main === module) {
    migrateAllFiles();
}

module.exports = { migrateFile, migrateAllFiles }; 