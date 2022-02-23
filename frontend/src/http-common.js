import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.0.10:5000/api/v1/blogs",
    header: {
        "Content-type": "application/json"
    }
});