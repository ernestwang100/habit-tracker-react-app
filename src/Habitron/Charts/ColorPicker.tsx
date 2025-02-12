import React, { useState } from "react";

interface ColorPickerProps {
  onChange: (colors: string[]) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const [colors, setColors] = useState<string[]>([
    "#3498db",
    "#e74c3c",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
  ]);

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
    onChange(updatedColors);
  };

  const addColor = () => {
    setColors([...colors, "#ffffff"]);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const updatedColors = colors.filter((_, i) => i !== index);
      setColors(updatedColors);
      onChange(updatedColors);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Customize Colors</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => (
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
