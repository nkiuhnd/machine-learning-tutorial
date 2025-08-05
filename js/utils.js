// 机器学习算法教学工具库

// 全局变量 - 使用命名空间避免冲突
let globalChart = null;
let dataPointsVisible = false;
let regressionLineVisible = false;

// 图表初始化函数
function initChart(canvasId = 'myChart', options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const defaultOptions = {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: '数据点',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                },
                {
                    label: '回归线',
                    data: [],
                    type: 'line',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'X轴'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y轴'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    };

    // 合并选项
    const finalOptions = mergeDeep(defaultOptions, options);
    
    globalChart = new Chart(ctx, finalOptions);
    return globalChart;
}

// 深度合并对象
function mergeDeep(target, source) {
    const result = { ...target };
    
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = mergeDeep(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    
    return result;
}

// 线性回归计算
function calculateLinearRegression(data) {
    const n = data.length;
    if (n < 2) return null;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let point of data) {
        sumX += point.x;
        sumY += point.y;
        sumXY += point.x * point.y;
        sumX2 += point.x * point.x;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
}

// 计算R²值
function calculateRSquared(data, slope, intercept) {
    const n = data.length;
    if (n < 2) return 0;
    
    // 计算平均值
    const meanY = data.reduce((sum, point) => sum + point.y, 0) / n;
    
    let ssRes = 0; // 残差平方和
    let ssTot = 0; // 总平方和
    
    for (let point of data) {
        const predicted = slope * point.x + intercept;
        ssRes += Math.pow(point.y - predicted, 2);
        ssTot += Math.pow(point.y - meanY, 2);
    }
    
    return 1 - (ssRes / ssTot);
}

// 生成回归线数据点
function generateRegressionLine(slope, intercept, xMin, xMax, steps = 100) {
    const lineData = [];
    const step = (xMax - xMin) / steps;
    
    for (let i = 0; i <= steps; i++) {
        const x = xMin + i * step;
        const y = slope * x + intercept;
        lineData.push({ x, y });
    }
    
    return lineData;
}

// 更新图表数据
function updateChartData(dataPoints, regressionData = null) {
    if (!globalChart) return;
    
    // 更新数据点
    globalChart.data.datasets[0].data = dataPoints;
    
    // 更新回归线
    if (regressionData) {
        globalChart.data.datasets[1].data = regressionData;
    }
    
    globalChart.update();
}

// 显示/隐藏数据点
function toggleDataPoints() {
    if (!globalChart) return;
    
    dataPointsVisible = !dataPointsVisible;
    const btn = document.getElementById('showDataBtn');
    
    if (dataPointsVisible) {
        btn.innerHTML = '👁️ 隐藏数据点';
        btn.style.background = '#28a745';
    } else {
        btn.innerHTML = '👁️ 显示数据点';
        btn.style.background = '#dc3545';
    }
}

// 显示/隐藏回归线
function toggleRegressionLine() {
    if (!globalChart) return;
    
    regressionLineVisible = !regressionLineVisible;
    const btn = document.getElementById('showRegressionBtn');
    
    if (regressionLineVisible) {
        btn.innerHTML = '📉 隐藏回归线';
        btn.style.background = '#28a745';
    } else {
        btn.innerHTML = '📉 显示回归线';
        btn.style.background = '#dc3545';
    }
}

// 格式化数字显示
function formatNumber(num, decimals = 2) {
    return Number(num).toFixed(decimals);
}

// 生成随机数据
function generateRandomData(count = 8, xRange = [1, 8], yRange = [40, 100], noise = 20) {
    const data = [];
    for (let i = 1; i <= count; i++) {
        const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
        const y = x * 8 + 40 + Math.random() * noise;
        data.push({
            x: Math.round(x * 10) / 10,
            y: Math.round(Math.min(yRange[1], Math.max(yRange[0], y))),
            name: `数据点${i}`
        });
    }
    return data;
}

// 更新表格
function updateTable(data, tableId = 'dataTable') {
    const tbody = document.getElementById(tableId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    data.forEach((item, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `<td>${item.name || `点${index + 1}`}</td><td>${item.x}</td><td>${item.y}</td>`;
    });
}

// 显示计算结果
function displayResults(slope, intercept, rSquared, formulaId = 'formulaDisplay') {
    const formulaElement = document.getElementById(formulaId);
    if (!formulaElement) return;
    
    const equation = `y = ${formatNumber(slope)}x + ${formatNumber(intercept)}`;
    const r2Text = `R² = ${formatNumber(rSquared)}`;
    
    formulaElement.innerHTML = `
        <div class="formula">
            📊 回归方程：${equation}<br>
            📈 拟合优度：${r2Text}
        </div>
    `;
}

// 预测函数
function predict(slope, intercept, x, resultId = 'predictionResult') {
    const predicted = slope * x + intercept;
    const resultElement = document.getElementById(resultId);
    
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="prediction-result">
                🎯 预测结果：当 x = ${x} 时，y = ${formatNumber(predicted)}
            </div>
        `;
    }
    
    return predicted;
}

// 页面加载动画
function addPageAnimations() {
    const sections = document.querySelectorAll('.algorithm-section, .section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// 添加交互效果
function addInteractiveEffects() {
    // 算法项悬停效果
    document.querySelectorAll('.algorithm-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// 初始化页面
function initPage() {
    addPageAnimations();
    addInteractiveEffects();
}

// 导出工具函数
window.MLUtils = {
    initChart,
    calculateLinearRegression,
    calculateRSquared,
    generateRegressionLine,
    updateChartData,
    toggleDataPoints,
    toggleRegressionLine,
    formatNumber,
    generateRandomData,
    updateTable,
    displayResults,
    predict,
    initPage
}; 