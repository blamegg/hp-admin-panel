import { user1, user2, user3 } from "@/assets";
import { MessageBoxProps } from "../../components/Message/MessageBox";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserMessages {
  userId: string;
  messages: MessageBoxProps[];
  userName: string;
  profileImage: string;
  isActive: boolean;
}

interface AppState {
  users: UserMessages[];
}

const initialChat: AppState = {
  users: [
    {
      userId: "1",
      userName: "Sophie Müller",
      profileImage: user1.src,
      isActive: true,
      messages: [
        { role: "sender", message: "Hey, how are you?", time: "1:55pm" },
        { role: "receiver", message: "I'm good, thanks!", time: "1:55pm" },
      ],
    },
    {
      userId: "2",
      userName: "Isabelle Dupont",
      profileImage: user2.src,
      isActive: false,
      messages: [
        { role: "sender", message: "Hello!", time: "2:00pm" },
        { role: "receiver", message: "Hi there!", time: "2:01pm" },
      ],
    },
    {
      userId: "3",
      userName: "Elena Rossi",
      profileImage: user3.src,
      isActive: true,
      messages: [
        { role: "sender", message: "Good afternoon!", time: "2:15pm" },
        {
          role: "receiver",
          message: "Afternoon, how's it going?",
          time: "2:16pm",
        },
      ],
    },
  ],
};

const messageSlice = createSlice({
  name: "message",
  initialState: initialChat,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ userId: string; message: MessageBoxProps }>,
    ) => {
      const user = state.users.find((u) => u.userId === action.payload.userId);
      if (user) {
        user.messages.push(action.payload.message);
      }
    },
  },
});

export default messageSlice.reducer;
export const { addMessage } = messageSlice.actions;
