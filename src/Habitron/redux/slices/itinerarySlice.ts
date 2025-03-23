// src/redux/slices/itinerarySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState } from "./authSlice";

// Define the structure of an itinerary item
export interface ItineraryItem {
  id: string;
  name: string;
  description?: string;
}

// Define the initial state for the itinerary
interface ItineraryState {
  items: ItineraryItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ItineraryState = {
  items: [],
  status: "idle",
  error: null,
};

// API Base URL
const API_BASE = import.meta.env.VITE_API_BASE;
const ITINERARY_URL = `${API_BASE}/api/itinerary`;

// Fetch all itinerary items
export const fetchItinerary = createAsyncThunk(
  "itinerary/fetchItinerary",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      const response = await axios.get(`${ITINERARY_URL}?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch itinerary");
    }
  }
);

// Add a new itinerary item
export const addItineraryItem = createAsyncThunk(
  "itinerary/addItineraryItem",
  async (newItem: Omit<ItineraryItem, "id">, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      const response = await axios.post(`${ITINERARY_URL}?userId=${userId}`, newItem);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add itinerary item");
    }
  }
);

// Update an existing itinerary item
export const updateItineraryItem = createAsyncThunk(
  "itinerary/updateItineraryItem",
  async (updatedItem: ItineraryItem, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      const response = await axios.put(`${ITINERARY_URL}/${updatedItem.id}?userId=${userId}`, updatedItem);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update itinerary item");
    }
  }
);

// Delete an itinerary item
export const removeItineraryItem = createAsyncThunk(
  "itinerary/removeItineraryItem",
  async (itemId: string, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?.id;
    try {
      await axios.delete(`${ITINERARY_URL}/${itemId}?userId=${userId}`);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete itinerary item");
    }
  }
);

// Create the slice for itinerary state
const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItinerary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchItinerary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchItinerary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addItineraryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItineraryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeItineraryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default itinerarySlice.reducer;
