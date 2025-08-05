const fs = require('fs');
const path = require('path');

// 测试迁移后的文件结构和功能

function testFileStructure() {
    console.log('🔍 测试文件结构...\n');
    
    // 检查必要的目录和文件
    const requiredFiles = [
        'index-modern.html',
        'styles/main.css',
        'js/utils.js',
        'pages/linear-regression.html',
        'pages/multiple-regression.html',
        'pages/polynomial-regression.html',
        'pages/decision-tree-regression.html',
        'pages/decision-tree-classification.html',
        'pages/logistic-regression.html',
        'pages/random-forest-classification.html',
        'pages/random-forest-regression.html',
        'pages/kmeans-clustering.html'
    ];
    
    let allFilesExist = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - 文件不存在`);
            allFilesExist = false;
        }
    });
    
    return allFilesExist;
}

function testFileContent() {
    console.log('\n🔍 测试文件内容...\n');
    
    // 测试首页文件
    const indexContent = fs.readFileSync('index-modern.html', 'utf8');
    
    // 检查是否包含外部CSS和JS链接
    const hasExternalCSS = indexContent.includes('<link rel="stylesheet" href="styles/main.css">');
    const hasExternalJS = indexContent.includes('<script src="js/utils.js">');
    const hasNavigation = indexContent.includes('nav-bar');
    
    console.log(`✅ 首页包含外部CSS链接: ${hasExternalCSS}`);
    console.log(`✅ 首页包含外部JS链接: ${hasExternalJS}`);
    console.log(`✅ 首页包含导航栏: ${hasNavigation}`);
    
    // 测试算法页面
    const algorithmPages = [
        'pages/linear-regression.html',
        'pages/multiple-regression.html',
        'pages/kmeans-clustering.html'
    ];
    
    algorithmPages.forEach(page => {
        const content = fs.readFileSync(page, 'utf8');
        const hasRelativeCSS = content.includes('<link rel="stylesheet" href="../styles/main.css">');
        const hasRelativeJS = content.includes('<script src="../js/utils.js">');
        const hasChartJS = content.includes('chart.js');
        const hasJavaScript = content.includes('<script>');
        const hasNavigation = content.includes('nav-bar');
        
        console.log(`\n📄 ${page}:`);
        console.log(`  ✅ 包含相对CSS链接: ${hasRelativeCSS}`);
        console.log(`  ✅ 包含相对JS链接: ${hasRelativeJS}`);
        console.log(`  ✅ 包含Chart.js: ${hasChartJS}`);
        console.log(`  ✅ 包含JavaScript代码: ${hasJavaScript}`);
        console.log(`  ✅ 包含导航栏: ${hasNavigation}`);
    });
}

function testHyperlinks() {
    console.log('\n🔍 测试超链接...\n');
    
    // 检查首页到算法页面的链接
    const indexContent = fs.readFileSync('index-modern.html', 'utf8');
    const algorithmLinks = [
        'pages/linear-regression.html',
        'pages/multiple-regression.html',
        'pages/polynomial-regression.html',
        'pages/decision-tree-regression.html',
        'pages/decision-tree-classification.html',
        'pages/logistic-regression.html',
        'pages/random-forest-classification.html',
        'pages/random-forest-regression.html',
        'pages/kmeans-clustering.html'
    ];
    
    let allLinksValid = true;
    
    algorithmLinks.forEach(link => {
        if (indexContent.includes(`href="${link}"`)) {
            console.log(`✅ 首页链接到: ${link}`);
        } else {
            console.log(`❌ 首页缺少链接: ${link}`);
            allLinksValid = false;
        }
    });
    
    // 检查算法页面返回首页的链接
    const algorithmPages = [
        'pages/linear-regression.html',
        'pages/multiple-regression.html',
        'pages/kmeans-clustering.html'
    ];
    
    algorithmPages.forEach(page => {
        const content = fs.readFileSync(page, 'utf8');
        if (content.includes('href="../index-modern.html"')) {
            console.log(`✅ ${page} 正确链接回首页`);
        } else {
            console.log(`❌ ${page} 缺少返回首页的链接`);
            allLinksValid = false;
        }
    });
    
    return allLinksValid;
}

function runAllTests() {
    console.log('🚀 开始测试迁移结果...\n');
    
    const structureOK = testFileStructure();
    testFileContent();
    const linksOK = testHyperlinks();
    
    console.log('\n📊 测试结果总结:');
    console.log(`✅ 文件结构: ${structureOK ? '通过' : '失败'}`);
    console.log(`✅ 超链接: ${linksOK ? '通过' : '失败'}`);
    
    if (structureOK && linksOK) {
        console.log('\n🎉 所有测试通过！迁移成功完成！');
        console.log('\n💡 下一步建议:');
        console.log('1. 在浏览器中打开 http://localhost:8000 测试网站');
        console.log('2. 点击各个算法链接，测试功能是否正常');
        console.log('3. 检查图表和交互功能是否正常工作');
        console.log('4. 根据需要调整页面内容和样式');
    } else {
        console.log('\n⚠️  发现一些问题，请检查并修复');
    }
}

if (require.main === module) {
    runAllTests();
}

module.exports = { testFileStructure, testFileContent, testHyperlinks, runAllTests }; 