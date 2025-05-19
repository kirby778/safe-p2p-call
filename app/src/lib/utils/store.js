/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { create } from "zustand";

const useStore = create((set) => ({
    bearerToken : null,
    setBearerToken : (token) => set({bearerToken : token}),
    userId : null,
    setUserId : (userId) => set({userId })
}));

export default useStore;