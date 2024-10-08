import { MessageBoxProps } from "../../components/Message/MessageBox";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state type
interface AppState {
  initialMessage: MessageBoxProps[];
}

// Define the initial state
const initialState: AppState = {
  initialMessage: [
    {
      role: "sender",
      message: "Hey, how are you?",
      time: "1:55pm",
    },
    {
      role: "receiver",
      message: "I'm good, thanks! How about you?",
      time: "1:55pm",
    },
    {
      role: "sender",
      message: "Doing great! Working on some cool projects.",
      time: "1:55pm",
    },
    {
      role: "receiver",
      message: "That's awesome! Keep me posted!",
      time: "1:55pm",
    },
  ],
};

// Create the message slice
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Reducer to add a new message
    addMessage: (state, action: PayloadAction<MessageBoxProps>) => {
      state.initialMessage.push(action.payload);
    },
  },
});

// Export the actions
export const { addMessage } = messageSlice.actions;

// Export the reducer
export default messageSlice.reducer;
