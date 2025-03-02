import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import ItinerarySelect from "./ItinerarySelect";
import {
  setStartTime,
  setInterval,
  setWeekStart,
  updateScheduleSlot,
  removeScheduleSlot,
  fetchSchedule,
} from "../redux/slices/scheduleSlice";
import {
  addItineraryItem,
  fetchItineraryItems,
} from "../redux/slices/itinerarySlice";
import { AppDispatch, RootState } from "../redux/store";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const timeIntervals = [15, 30, 60];

export default function ScheduleTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { startTime, interval, weekStart, schedule } = useSelector(
    (state: RootState) => state.schedule
  );
  const itineraryItems = useSelector(
    (state: RootState) => state.itinerary.items
  );

  // Function to generate time slots for the day
  const generateTimes = () => {
    const times = [];
    let [hours, minutes] = startTime.split(":").map(Number);
    for (let i = 0; i < 24 * (60 / interval); i++) {
      const normalizedHours = hours % 24;
      times.push(
        `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}`
      );
      minutes += interval;
      if (minutes >= 60) {
        hours += 1;
        minutes = minutes % 60;
      }
    }
    return times;
  };

  // Reorder days based on the start of the week
  const orderedDays = (() => {
    const startIndex = daysOfWeek.indexOf(weekStart);
    return [
      ...daysOfWeek.slice(startIndex),
      ...daysOfWeek.slice(0, startIndex),
    ];
  })();

  // Dispatch actions to update the start time, interval, and week start
  const handleStartTimeChange = (str: string) => {
    dispatch(setStartTime(str));
  };

  const handleIntervalChange = (value: Number) => {
    dispatch(setInterval(Number(value)));
  };

  const handleWeekStartChange = (value: string) => {
    dispatch(setWeekStart(value));
  };

  // Dispatch actions to update the schedule slot
  const handleItineraryChange = (day: string, time: string, value: string) => {
    if (value === "new-item") return; // Handle new items in ItinerarySelect
    const slotKey = `${day}-${time}`;

    if (value) {
      dispatch(updateScheduleSlot({ slot: slotKey, itineraryItemId: value }));
    } else {
      dispatch(removeScheduleSlot(slotKey));
    }
  };

  // Fetch itinerary items and schedule on initial load
  useEffect(() => {
    if (itineraryItems.length === 0) {
      dispatch(fetchItineraryItems()); // Fetch itinerary items if empty
    }

    dispatch(fetchSchedule()); // Fetch schedule data when the component loads
  }, [dispatch, itineraryItems.length]);

  useEffect(() => {
    // Initialize itineraryItems if necessary
    if (itineraryItems.length === 0) {
      dispatch(
        addItineraryItem({ name: "Sample Itinerary Item", id: "sample-id" })
      );
    }
  }, [itineraryItems, dispatch]);

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium">
              Schedule Start Time
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Time Interval (mins)
            </label>
            <Select
              value={String(interval)}
              onValueChange={(value) => handleIntervalChange(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {timeIntervals.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} mins
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium">Week Beginning</label>
            <Select value={weekStart} onValueChange={handleWeekStartChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              {orderedDays.map((day) => (
                <TableHead key={day}>{day}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {generateTimes().map((time) => (
              <TableRow key={time}>
                <TableCell className="align-top p-2">{time}</TableCell>
                {orderedDays.map((day) => (
                  <TableCell
                    key={`${day}-${time}`}
                    className="border align-top p-2"
                  >
                    <ItinerarySelect
                      value={schedule[`${day}-${time}`] || ""}
                      onChange={(value) =>
                        handleItineraryChange(day, time, value)
                      }
                      itineraryItems={itineraryItems}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
