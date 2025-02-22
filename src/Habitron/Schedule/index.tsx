import { useState } from "react";
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
  const [startTime, setStartTime] = useState("08:00");
  const [interval, setInterval] = useState(30);
  const [weekStart, setWeekStart] = useState("Sunday");
  const [itineraryItems, setItineraryItems] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<{ [key: string]: string }>({});

  const generateTimes = () => {
    const times = [];
    let [hours, minutes] = startTime.split(":").map(Number);
    for (let i = 0; i < 24 * (60 / interval); i++) {
      // Normalize time if it goes past 24:00
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

  const orderedDays = (() => {
    const startIndex = daysOfWeek.indexOf(weekStart);
    return [
      ...daysOfWeek.slice(startIndex),
      ...daysOfWeek.slice(0, startIndex),
    ];
  })();

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
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Time Interval (mins)
            </label>
            <Select
              value={String(interval)}
              onValueChange={(value) => setInterval(Number(value))}
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
            <Select value={weekStart} onValueChange={setWeekStart}>
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
                        setSchedule((prev) => ({
                          ...prev,
                          [`${day}-${time}`]: value,
                        }))
                      }
                      itineraryItems={itineraryItems}
                      setItineraryItems={setItineraryItems}
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
