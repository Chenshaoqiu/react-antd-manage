import axios from 'axios';

const baseUrl = '/api';

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getInsideConfig() {
    console.log(process.env.NODE_ENV);
    const config = {
      baseUrl: this.baseUrl,
      timeout: 10000, // 设置请求超时时间
      headers: {
        // 默认 headers，可以根据需要添加其他通用的 headers
        'Content-Type': 'application/json',
      },
    };
    return config;
  }
  interceptors(instance) {
    // 添加请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // 在请求发送之前添加 token 或其他设置
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // 请求错误处理
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
      (response) => {
        // 响应成功，可以做一些统一的响应数据处理
        return response;
      },
      (error) => {
        // 统一错误处理
        if (error.response) {
          // 根据错误的状态码处理不同的错误
          switch (error.response.status) {
            case 401:
              // 401 未授权，可以跳转到登录页
              console.error('Unauthorized');
              break;
            case 500:
              // 500 服务器错误
              console.error('Server error');
              break;
            default:
              console.error(error.response.data.message || 'Unknown error');
          }
        } else if (error.request) {
          // 请求没有收到响应
          console.error('Network Error');
        } else {
          // 其他错误
          console.error(error.message);
        }
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = { ...this.getInsideConfig(), ...options };
    this.interceptors(instance);
    return instance(options);
  }
}
export default new HttpRequest(baseUrl);
