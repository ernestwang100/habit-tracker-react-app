import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchColors, updateColors } from "../redux/slices/colorSlice";

const ColorPicker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const colors = useSelector((state: RootState) => state.colors.colors);
  const [localColors, setLocalColors] = useState<string[]>(colors);

  useEffect(() => {
    dispatch(fetchColors()); // Fetch colors on mount
  }, [dispatch]);

  useEffect(() => {
    setLocalColors(colors); // Sync local state when Redux updates
  }, [colors]);

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...localColors];
    updatedColors[index] = newColor;
    setLocalColors(updatedColors);
    dispatch(updateColors(updatedColors)); // Save to backend
  };

  const addColor = () => {
    const newColors = [...localColors, "#ffffff"];
    setLocalColors(newColors);
    dispatch(updateColors(newColors));
  };

  const removeColor = (index: number) => {
    if (localColors.length > 1) {
      const newColors = localColors.filter((_, i) => i !== index);
      setLocalColors(newColors);
      dispatch(updateColors(newColors));
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Customize Colors</h3>
      <div className="flex flex-wrap gap-3">
        {localColors.map((color, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="w-10 h-10 border rounded-md cursor-pointer"
            />
            <button
              onClick={() => removeColor(index)}
              className="text-red-500 hover:text-red-700 font-bold text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addColor}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + Add Color
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
