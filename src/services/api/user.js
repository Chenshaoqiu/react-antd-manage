import http from '../axios';

const userApi = {
  getUsers: async (params) => http.get('/user/getUser', params),
  addUser: async (params) => http.post('/user/add', params),
  editUser: async (params) => http.post('/user/edit', params),
  deleteUser: async (params) => http.post('/user/del', params),
};

export default userApi;
