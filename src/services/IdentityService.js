import axios from "axios";

const http = axios.create({
    baseURL: "https://btphrlwy5e.execute-api.us-east-1.amazonaws.com/dev",
    headers: {
        "Content-type": "application/json",
        "x-api-key": "b7rjb98KSG7rPAt6FsxhM18pSa1YF9Yi5COGAcZO"
        // ,
        // "Access-Control-Allow-Origin" : "*",
        // 'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
        // 'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'          

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
