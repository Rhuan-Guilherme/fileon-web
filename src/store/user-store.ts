import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    cnpj: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));
