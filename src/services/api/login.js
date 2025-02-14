import http from '../axios';

const loginApi = {
  // getMenu: async (params) => http.post('/permission/getMenu', params),
  getMenu: async (params) => http.get('/api/doLogin', params),
};

export default loginApi;
