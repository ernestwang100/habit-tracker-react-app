import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

interface ItinerarySelectProps {
  value: string;
  onChange: (value: string) => void;
  itineraryItems: string[];
  setItineraryItems: (items: string[]) => void;
}

export default function ItinerarySelect({
  value,
  onChange,
  itineraryItems,
  setItineraryItems,
}: ItinerarySelectProps) {
  const [newItem, setNewItem] = useState("");

  const handleAddNewItem = () => {
    if (newItem.trim() && !itineraryItems.includes(newItem)) {
      const updatedItems = [...itineraryItems, newItem];
      setItineraryItems(updatedItems);
      onChange(newItem);
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
            <SelectItem key={item} value={item}>
              {item}
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
