// src/api.js
import axios from 'axios';

// 创建一个 Axios 实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 15000,
  headers: { 'Content-Type': "application/json; charset=utf-8" }
});

// // 添加请求拦截器（如果需要）
// api.interceptors.request.use(
//   config => {
//     // 在请求发送之前做一些处理
//     return config;
//   },
//   error => {
//     // 处理请求错误
//     return Promise.reject(error);
//   }
// );

// // 添加响应拦截器（如果需要）
// api.interceptors.response.use(
//   response => {
//     // 处理响应数据
//     return response;
//   },
//   error => {
//     // 处理响应错误
//     return Promise.reject(error);
//   }
// );

export default api;
