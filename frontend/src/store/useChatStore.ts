import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

interface message {
  _id: string;
  senderId: string;
  recieverId: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}

interface ChatStore {
  messages: message[];
  users: any[];
  selectedUser: any;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: any) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  sendMessage: (messageData: {
    text: string;
    image: string | ArrayBuffer | null;
  }) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error getting USers", error);
        toast.error("Error getting users");
      }
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Error getting Messages", error);
        toast.error("Error getting messages");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData: {
    text: string;
    image: string | ArrayBuffer | null;
  }) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: message) => {
      if (newMessage.senderId !== selectedUser._id)return
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
  },

  setSelectedUser: (user: any) => {
    set({ selectedUser: user });
  },
}));
