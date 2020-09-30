import axios from "axios";

const http = axios.create({
    baseURL: "https://btphrlwy5e.execute-api.us-east-1.amazonaws.com/dev",
    headers: {
        "Content-type": "application/json"
        ,
        "x-api-key": "b7rjb98KSG7rPAt6FsxhM18pSa1YF9Yi5COGAcZO"
        // "Access-Control-Allow-Origin" : "*"
    }
});


const getAll = () => {
    return http.get("/identities");
};

const get = id => {
    return http.get(`/identities/?id=${id}`);
};


export default {
    getAll,
    get
};