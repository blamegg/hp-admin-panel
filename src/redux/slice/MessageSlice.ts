import {
  user1,
  user2,
  user3,
  user4,
  user5,
  user6,
  user7,
  user10,
  user8,
  user9,
} from "@/assets";
import { MessageBoxProps } from "../../components/Message/MessageBox";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserMessages {
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
      profileImage: user2.src,
      isActive: true,
      messages: [
        { role: "sender", message: "Hey, how are you?", time: "1:55pm" },
        { role: "receiver", message: "I'm good, thanks!", time: "1:56pm" },
        { role: "sender", message: "What about you?", time: "1:57pm" },
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
        { role: "sender", message: "Long time no see!", time: "2:02pm" },
        {
          role: "receiver",
          message: "Yeah, we should catch up!",
          time: "2:03pm",
        },
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
        {
          role: "sender",
          message: "Not bad! Just working on some projects.",
          time: "2:17pm",
        },
        {
          role: "receiver",
          message: "Sounds interesting! What kind of projects?",
          time: "2:18pm",
        },
      ],
    },
    {
      userId: "4",
      userName: "Liam Johnson",
      profileImage: user4.src,
      isActive: true,
      messages: [
        {
          role: "sender",
          message: "Hey! Are you free this weekend?",
          time: "3:00pm",
        },
        {
          role: "receiver",
          message: "Yes, I am! What do you have in mind?",
          time: "3:01pm",
        },
        { role: "sender", message: "Maybe a movie night?", time: "3:02pm" },
        {
          role: "receiver",
          message: "That sounds great! Which movie?",
          time: "3:03pm",
        },
      ],
    },
    {
      userId: "5",
      userName: "Mia Chen",
      profileImage: user5.src,
      isActive: false,
      messages: [
        {
          role: "sender",
          message: "Hi Mia! How's the new job?",
          time: "4:00pm",
        },
        {
          role: "receiver",
          message: "It's going well, thank you!",
          time: "4:01pm",
        },
        { role: "sender", message: "Glad to hear that!", time: "4:02pm" },
        {
          role: "receiver",
          message: "I really enjoy the team.",
          time: "4:03pm",
        },
      ],
    },
    {
      userId: "6",
      userName: "Ava Patel",
      profileImage: user6.src,
      isActive: true,
      messages: [
        {
          role: "sender",
          message: "Have you finished the report?",
          time: "5:00pm",
        },
        {
          role: "receiver",
          message: "Almost! Just wrapping it up.",
          time: "5:01pm",
        },
        {
          role: "sender",
          message: "Let me know if you need help.",
          time: "5:02pm",
        },
        {
          role: "receiver",
          message: "Thanks! I appreciate it.",
          time: "5:03pm",
        },
      ],
    },
    {
      userId: "7",
      userName: "Noah Smith",
      profileImage: user7.src,
      isActive: true,
      messages: [
        {
          role: "sender",
          message: "Hey Noah! Are you coming to the party?",
          time: "6:00pm",
        },
        {
          role: "receiver",
          message: "Of course! Wouldn't miss it.",
          time: "6:01pm",
        },
        {
          role: "sender",
          message: "Great! Bring your favorite drink.",
          time: "6:02pm",
        },
        { role: "receiver", message: "Will do!", time: "6:03pm" },
      ],
    },
    {
      userId: "8",
      userName: "Oliver Brown",
      profileImage: user8.src,
      isActive: false,
      messages: [
        { role: "sender", message: "How was your weekend?", time: "7:00pm" },
        {
          role: "receiver",
          message: "It was relaxing, thanks for asking!",
          time: "7:01pm",
        },
        { role: "sender", message: "Any plans for the week?", time: "7:02pm" },
        {
          role: "receiver",
          message: "Just some work projects.",
          time: "7:03pm",
        },
      ],
    },
    {
      userId: "9",
      userName: "Emily Davis",
      profileImage: user9.src,
      isActive: true,
      messages: [
        {
          role: "sender",
          message: "Did you see the latest episode?",
          time: "8:00pm",
        },
        { role: "receiver", message: "Yes! It was so good!", time: "8:01pm" },
        {
          role: "sender",
          message: "I can't believe that happened!",
          time: "8:02pm",
        },
        {
          role: "receiver",
          message: "Me neither! What a twist!",
          time: "8:03pm",
        },
      ],
    },
    {
      userId: "10",
      userName: "Sophia Turner",
      profileImage: user10.src,
      isActive: true,
      messages: [
        {
          role: "sender",
          message: "Are we still on for lunch tomorrow?",
          time: "9:00am",
        },
        {
          role: "receiver",
          message: "Yes, I'm looking forward to it!",
          time: "9:01am",
        },
        {
          role: "sender",
          message: "Great! Any place in mind?",
          time: "9:02am",
        },
        {
          role: "receiver",
          message: "How about that new café?",
          time: "9:03am",
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
