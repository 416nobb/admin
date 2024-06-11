import os
import requests

def save_json_data(url, folder_name='motions'):
    try:
        # headers = {
        #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        # }
        headers = {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://guansss.github.io/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }

        # response = requests.get(url)
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # 检查是否有错误的响应码

        # 创建文件夹
        os.makedirs(folder_name, exist_ok=True)

        # 从响应头中获取文件名
        content_disposition = response.headers.get('content-disposition')
        if content_disposition:
            file_name = content_disposition.split('filename=')[1].strip('"')
        else:
            file_name = url.split('/')[-1]

        file_path = os.path.join(folder_name, file_name)

        with open(file_path, 'wb') as file:
            file.write(response.content)
            print(f"数据已保存到 {file_path} 文件中")
        
    except requests.exceptions.RequestException as e:
        print("请求失败:", e)

# 调用方法示例
url = '''https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model/%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%20girls%20Frontline/live2dnew/hk416_805/destroy/motions/shake.motion3.json'''


save_json_data(url)


