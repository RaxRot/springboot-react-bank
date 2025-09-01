import { create } from "zustand";
import { api } from "../api/api";

export const useAuth = create((set) => ({
    user: null,
    loading: true, // пока не проверили куку

    // login
    signin: async (values) => {
        await api.post("/auth/login", values);
        const res = await api.get("/user");
        set({ user: res.data, loading: false });
        return res.data;
    },

    // logout
    signout: async () => {
        await api.post("/auth/signout");
        set({ user: null, loading: false });
    },

    // check session (on refresh)
    fetchUser: async () => {
        try {
            const res = await api.get("/user");
            set({ user: res.data, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },
}));
