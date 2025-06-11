import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentRoleDataInterFace } from "@/utility/queryFetcher";

interface RoleState {
  selectedRole: CurrentRoleDataInterFace | null;
}

const initialState: RoleState = {
  selectedRole: null,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<CurrentRoleDataInterFace | null>) => {
      state.selectedRole = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
});

export const { setSelectedRole, clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer; 