import http from "../http-common";


const getAll = () => {
  return http.get("/orders");
};

const get = id => {
  return http.get(`/orders/${id}`);
};

const create = data => {
  return http.post("/orders", data);
};

// const update = (id, data) => {
//   return http.put(`/orders/${id}`, data);
// };

const update = data => {
  return http.put("/orders", data);
};

const remove = id => {
  return http.delete(`/orders/${id}`);
};

const removeAll = () => {
  return http.delete(`/orders`);
};

const findByTitle = title => {
  return http.get(`/orders?title=${title}`);
};

const findByUserId = userId => {
  return http.get(`/orders?userId=${userId}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByUserId,
  findByTitle
};
