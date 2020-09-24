import axios from "axios";

const http = axios.create({
  baseURL: "https://btphrlwy5e.execute-api.us-east-1.amazonaws.com/dev",
  headers: {
    "Content-type": "application/json"
    ,
    "x-api-key":"b7rjb98KSG7rPAt6FsxhM18pSa1YF9Yi5COGAcZO"
    // "Access-Control-Allow-Origin" : "*"
  }
});


const findEventsStatsByOrderId = (orderId,timeResolution) => {
  return http.get(`/events/stats?orderId=${orderId}&timeResolution=${timeResolution}`);
};

const findMailStatsByOrderId = (orderId,timeResolution) => {
  return http.get(`/mail/stats?orderId=${orderId}&timeResolution=${timeResolution}`);
};

export default {
  findEventsStatsByOrderId,
  findMailStatsByOrderId
};
