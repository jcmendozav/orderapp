import axios from "axios";

export default axios.create({
  baseURL: "https://w1wqxy352b.execute-api.us-east-1.amazonaws.com/dev",
  headers: {
    "Content-type": "application/json"
    ,
    "x-api-key":"b7rjb98KSG7rPAt6FsxhM18pSa1YF9Yi5COGAcZO"
    // "Access-Control-Allow-Origin" : "*"
  }
});

// const http = axios.create({
//   baseURL: "https://w1wqxy352b.execute-api.us-east-1.amazonaws.com/dev",
//   headers: {
//     "Content-type": "application/json"
//     // ,
//     // "Access-Control-Allow-Origin" : "*"
//   }
// });

// export default {
//   http
// }
