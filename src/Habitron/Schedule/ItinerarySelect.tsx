import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  addItineraryItem,
  fetchItinerary,
} from "../redux/slices/itinerarySlice";
import { AppDispatch, RootState } from "../redux/store";

interface ItinerarySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ItinerarySelect({
  value,
  onChange,
}: ItinerarySelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const itineraryItems = useSelector(
    (state: RootState) => state.itinerary.items
  );
  const status = useSelector((state: RootState) => state.itinerary.status);
  const [newItem, setNewItem] = useState("");

  // Fetch itinerary items when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItinerary()); // Dispatch to fetch items from the API
    }
  }, [status, dispatch]);

  const handleAddNewItem = () => {
    if (
      newItem.trim() &&
      !itineraryItems.some((item) => item.name === newItem)
    ) {
      dispatch(addItineraryItem({ name: newItem })); // Dispatch action to add new item
      onChange(newItem); // Update the selected value
    }
    setNewItem("");
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select activity" />
        </SelectTrigger>
        <SelectContent>
          {itineraryItems.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
          <SelectItem value="add-new">➕ Add New</SelectItem>
        </SelectContent>
      </Select>

      {value === "add-new" && (
        <div className="flex space-x-2">
          <input
            type="text"
            className="border p-1 rounded"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="New item"
          />
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={handleAddNewItem}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
