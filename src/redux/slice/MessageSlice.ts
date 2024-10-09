import { MessageBoxProps } from "../../components/Message/MessageBox";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserMessages {
  userId: string;
  messages: MessageBoxProps[];
  userName: string;
}

interface AppState {
  users: UserMessages[];
}

const initialState: AppState = {
  users: [
    {
      userId: "1",
      userName: "John Doe",
      messages: [
        { role: "sender", message: "Hey, how are you?", time: "1:55pm" },
        { role: "receiver", message: "I'm good, thanks!", time: "1:55pm" },
      ],
    },
    {
      userId: "2",
      userName: "User 2",
      messages: [
        { role: "sender", message: "Hello!", time: "2:00pm" },
        { role: "receiver", message: "Hi there!", time: "2:01pm" },
      ],
    },
  ],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
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
