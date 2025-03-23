import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ItinerarySelect from "../Schedule/ItinerarySelect";

function ItineraryPage() {
  const itineraryItems = useSelector(
    (state: RootState) => state.itinerary.items
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Select Itinerary</h1>
      <ItinerarySelect
        value=""
        onChange={() => {}}
        itineraryItems={itineraryItems}
      />
    </div>
  );
}

export default ItineraryPage;
