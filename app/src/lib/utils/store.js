/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { create } from "zustand";

const useStore = create((set) => ({
    bearerToken : null,
    setBearerToken : (token) => set({bearerToken : token})
}));

export default useStore;