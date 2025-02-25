import api from './axios';

// 登录接口函数
interface LoginParams {
  name: string;
  password: string;
}

// 登录请求
export const login = async (params: LoginParams) => {
  if (!params.name || !params.password) {
    throw new Error("用户名和密码不能为空！");
  }

  const requestBody = {
    interface: "/v1/api/user/auth/login",
    name: params.name,
    password: params.password,

  };

  try {
    const response = await api.post('/v1/api/user/auth/login', requestBody,);
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};



// 注册请求

// 注册接口函数
interface ResgisterParams {
    name: string;
    password: string;
  }

export const resgister = async (params: ResgisterParams) => {
    if (!params.name || !params.password) {
      throw new Error("用户名和密码不能为空！");
    }
  
    const requestBody = {
      interface: "/v1/api/user/new",
      name: params.name,
      password: params.password,
  
    };
  
    try {
      const response = await api.post('/v1/api/user/new', requestBody,);
      return response;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  };