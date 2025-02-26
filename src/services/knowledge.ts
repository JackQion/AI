import api from './axios';

// 获取知识库列表
interface getKnowledgeListParams {
    Authorization: string;
}

// 获取知识库列表
export const getKnowledgeListParams = async (params: getKnowledgeListParams) => {
    if (!params.Authorization) {
        throw new Error("token不能为空！(Authorization)-获取知识库列表");
    }

    try {
        const response = await api.get('/v1/api/knowledge_base/list', {
            headers: {
                Authorization: params.Authorization,
            },
        });
        return response;
    } catch (error) {
        console.error('获取知识库列表失败:', error);
        throw error;
    }
};


// 新建知识库
interface createKonwledgeParams {
    description: string;
    name: string;
}

export const createKonwledge = async (params: createKonwledgeParams) => {
    if (!params.name || !params.description) {
        throw new Error("知识库名称和简介不能为空！");
      }
    
      const requestBody = {
        interface: "/v1/api/knowledge_base/new",
        name: params.name,
        description: params.description,
        team_id: sessionStorage.getItem("team_id"),
        Authorization: sessionStorage.getItem("api_key")
      };
    
      try {
        const response = await api.post('/v1/api/knowledge_base/new', requestBody,);
        return response;
      } catch (error) {
        console.error('创建知识库失败:', error);
        throw error;
      }
}