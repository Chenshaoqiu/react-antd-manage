import http from '../axios';

const homeApi = {
  getData: async (params) => http.get('/home/getData', params),
};

export default homeApi;
