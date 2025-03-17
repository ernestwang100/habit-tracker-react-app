import React from "react";
import ItinerarySelect from "../Habitron/Schedule/ItinerarySelect";

function ItineraryPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Select Itinerary</h1>
      <ItinerarySelect value="" onChange={() => {}} />
    </div>
  );
}

export default ItineraryPage;
