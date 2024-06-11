const url = `
https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dnew/hk416_805/normal/motions/login.motion3.json

`; // 替换为实际的URL

// 从URL中提取文件名
const fileName = url.split('/').pop();

// 发送HTTP请求获取资源内容
fetch(url)
  .then(response => response.blob())
  .then(blob => {
    // 创建下载链接并触发点击事件以保存文件
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  })
  .catch(error => console.error('Error:', error));
