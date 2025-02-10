import http from '../axios';

const loginApi = {
  getMenu: async (params) => http.post('/permission/getMenu', params),
};

export default loginApi;
