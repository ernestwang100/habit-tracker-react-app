// src/redux/slices/itinerarySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of an itinerary item
interface ItineraryItem {
  id: string;
  name: string;
  description?: string;
}

// Define the initial state for the itinerary
interface ItineraryState {
  items: ItineraryItem[];
}

const initialState: ItineraryState = {
  items: [],
};

// Create the slice for itinerary state
const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    // Action to add an itinerary item
    addItineraryItem: (state, action: PayloadAction<ItineraryItem>) => {
      state.items.push(action.payload);
    },
    // Action to update an itinerary item
    updateItineraryItem: (
      state,
      action: PayloadAction<ItineraryItem>
    ) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    // Action to remove an itinerary item
    removeItineraryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addItineraryItem, updateItineraryItem, removeItineraryItem } = itinerarySlice.actions;

export default itinerarySlice.reducer;
