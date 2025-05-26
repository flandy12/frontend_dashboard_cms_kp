import api from "../main";

export const getCategories = async () => {
    const res = await api.get("/categories");
    return res.data;
};

export const postCategories = async () => {
    const res = await api.post("/categories");
    return res.data;
};
