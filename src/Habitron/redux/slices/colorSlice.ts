import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// API URL
const API_BASE = import.meta.env.VITE_API_BASE;
const COLORS_URL = `${API_BASE}/api/colors`;

// Initial State
interface ColorState {
  colors: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ColorState = {
  colors: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"], // Default colors
  status: "idle",
  error: null,
};

// Fetch colors for a specific user
export const fetchColors = createAsyncThunk(
  "colors/fetchColors",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${COLORS_URL}?id=${id}`);
      return response.data.colors || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch colors");
    }
  }
);

// Update colors for a specific user
export const updateColors = createAsyncThunk(
  "colors/updateColors",
  async ({ id, colors }: { id: string; colors: string[] }, { rejectWithValue }) => {
    try {
      await axios.put(`${COLORS_URL}/${id}`, { colors });
      return colors;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update colors");
    }
  }
);

// Delete colors for a specific user
export const deleteColors = createAsyncThunk(
  "colors/deleteColors",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${COLORS_URL}/${id}`);
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete colors");
    }
  }
);

// Create slice
const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchColors.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.status = "succeeded";
        state.colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateColors.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.colors = action.payload;
      })
      .addCase(deleteColors.fulfilled, (state) => {
        state.colors = [];
      });
  },
});

export default colorSlice.reducer;
export const selectColors = (state: RootState) => state.colors.colors;
