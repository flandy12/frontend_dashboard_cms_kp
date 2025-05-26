import api from "../main";

export const getUsers = async () => {
    const res = await api.get("/users");
    return res;
};

export const postUsers = async () => {
    const res = await api.post("/users");
    return res.data;
};
