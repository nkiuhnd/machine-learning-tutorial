# 部署指南

## 本地开发

### 1. 使用Python内置服务器
```bash
# 在项目根目录运行
python -m http.server 8000

# 然后在浏览器中访问
# http://localhost:8000/index-modern.html
```

### 2. 使用Node.js live-server（推荐）
```bash
# 安装live-server
npm install -g live-server

# 在项目根目录运行
live-server --port=8000

# 或者使用npm脚本
npm run dev
```

### 3. 使用其他静态服务器
```bash
# 使用http-server
npm install -g http-server
http-server -p 8000

# 使用serve
npm install -g serve
serve -p 8000
```

## 静态托管部署

### 1. GitHub Pages

1. **创建GitHub仓库**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/machine-learning-tutorial.git
git push -u origin main
```

2. **启用GitHub Pages**
   - 进入仓库设置
   - 找到"Pages"选项
   - 选择"Deploy from a branch"
   - 选择main分支和根目录
   - 保存设置

3. **访问网站**
   - 网站将在几分钟内可用
   - 地址：`https://your-username.github.io/machine-learning-tutorial`

### 2. Netlify

1. **准备部署**
```bash
# 确保所有文件都在根目录
# 主页面应该是 index.html 或 index-modern.html
```

2. **部署步骤**
   - 访问 [Netlify](https://netlify.com)
   - 注册/登录账户
   - 点击"New site from Git"
   - 连接GitHub仓库
   - 选择分支（通常是main）
   - 设置构建命令（可选）
   - 点击"Deploy site"

3. **自定义域名**
   - 在Netlify控制台添加自定义域名
   - 配置DNS记录

### 3. Vercel

1. **安装Vercel CLI**
```bash
npm install -g vercel
```

2. **部署**
```bash
# 在项目根目录运行
vercel

# 按照提示完成配置
# 选择项目名称和团队
```

3. **自动部署**
   - 连接GitHub仓库
   - 每次推送代码都会自动部署

## 云服务器部署

### 1. 阿里云/腾讯云

1. **购买服务器**
   - 选择轻量应用服务器
   - 配置：1核2GB内存
   - 系统：Ubuntu 20.04

2. **安装Nginx**
```bash
sudo apt update
sudo apt install nginx
```

3. **上传文件**
```bash
# 使用scp上传
scp -r ./ root@your-server-ip:/var/www/html/

# 或使用git
git clone https://github.com/your-username/machine-learning-tutorial.git
sudo cp -r machine-learning-tutorial/* /var/www/html/
```

4. **配置Nginx**
```bash
sudo nano /etc/nginx/sites-available/default
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index-modern.html;

    location / {
        try_files $uri $uri/ /index-modern.html;
    }

    # 启用gzip压缩
    gzip on;
    gzip_types text/css application/javascript text/javascript;
}
```

5. **重启Nginx**
```bash
sudo systemctl restart nginx
```

### 2. AWS S3 + CloudFront

1. **创建S3存储桶**
   - 进入AWS控制台
   - 创建新的S3存储桶
   - 启用静态网站托管

2. **上传文件**
```bash
# 使用AWS CLI
aws s3 sync . s3://your-bucket-name --delete
```

3. **配置CloudFront**
   - 创建CloudFront分发
   - 设置S3为源
   - 配置缓存策略

4. **设置HTTPS**
   - 申请SSL证书
   - 配置到CloudFront

## 性能优化

### 1. 文件压缩
```bash
# 压缩CSS
npm install -g clean-css-cli
cleancss -o styles/main.min.css styles/main.css

# 压缩JS
npm install -g uglify-js
uglifyjs js/utils.js -o js/utils.min.js
```

### 2. 图片优化
```bash
# 安装图片压缩工具
npm install -g imagemin-cli

# 压缩图片
imagemin images/* --out-dir=images/optimized
```

### 3. CDN加速
- 使用jsDelivr CDN加载Chart.js
- 配置CloudFlare CDN
- 使用阿里云CDN

## 监控和分析

### 1. Google Analytics
```html
<!-- 在HTML头部添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. 错误监控
```html
<!-- 添加错误监控 -->
<script>
window.addEventListener('error', function(e) {
  console.error('页面错误:', e.error);
  // 发送到监控服务
});
</script>
```

## 安全配置

### 1. HTTPS强制
```nginx
# Nginx配置
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # 强制HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### 2. 安全头
```nginx
# 添加安全头
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

### 3. CSP策略
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';">
```

## 备份策略

### 1. 代码备份
```bash
# 定期推送到Git
git add .
git commit -m "Backup $(date)"
git push
```

### 2. 数据备份
```bash
# 备份网站文件
tar -czf backup-$(date +%Y%m%d).tar.gz ./
```

## 维护计划

### 1. 定期更新
- 每月检查依赖更新
- 每季度更新安全补丁
- 每年评估技术栈

### 2. 性能监控
- 监控页面加载速度
- 检查服务器资源使用
- 分析用户行为数据

### 3. 内容更新
- 定期添加新算法
- 更新教学内容
- 收集用户反馈

---

**注意**：部署前请确保：
1. 所有文件路径正确
2. 外部资源链接有效
3. 浏览器兼容性测试通过
4. 移动端适配良好 