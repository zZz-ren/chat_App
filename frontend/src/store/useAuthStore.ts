import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import {} from "socket.io-client";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface AuthStore {
  checkAuth: () => void;
  signUp: (data: {
    fullName: string;
    password: string;
    email: string;
  }) => Promise<void>;
  updateProfile: ({
    profilePic,
  }: {
    profilePic: string | ArrayBuffer | null;
  }) => Promise<void>;
  login: (data: { email: String; password: string }) => Promise<void>;
  logOut: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
  onlineUsers: any[];
  authUser: any;
  socket: any;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  socket: null,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data: {
    fullName: string;
    password: string;
    email: string;
  }) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account Created Succesfully");
      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error in SignUp", error);
        toast.error("Error Creating Account");
      }
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error in Logout", error);
        toast.error("Error logging out ");
      }
      set({ authUser: null });
    }
  },
  login: async (data: { email: String; password: string }) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error in Login", error);
        toast.error("Error logging in ");
      }
      set({ authUser: null });
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async ({
    profilePic,
  }: {
    profilePic: string | ArrayBuffer | null;
  }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", {
        profilePic: profilePic,
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error updating profile", error);
        toast.error("Error Updating Profile");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    console.log("connectSocket");

    const { authUser } = get();
    console.log(get().socket, authUser);

    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      withCredentials: true,
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (users: any[]) => {
      console.log(users);
      set({ onlineUsers: users });
    });
  },
  disconnectSocket: () => {
    console.log(get().socket);

    if (get().socket?.connected) {
      console.log(get().socket.connected);

      get().socket.disconnect();
    }
  },
}));
