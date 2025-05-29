"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import { onValue, ref, DataSnapshot } from "firebase/database";
import { CalendarIcon } from "lucide-react";
import { Line } from "react-chartjs-2";
import { database } from "./firebaseConfig";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  Legend
);

interface Entry {
  temperature: number;
  humidity: number;
}

interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
}

const HistoricalGraph: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [filter, setFilter] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!selectedDate) return;

    const year = format(selectedDate, "yyyy");
    const month = format(selectedDate, "MM");
    const day = filter === "daily" ? format(selectedDate, "dd") : null;

    const path =
      filter === "daily"
        ? `data/${year}/${month}/${day}`
        : `data/${year}/${month}`;
    const dataRef = ref(database, path);

    const processData = (snapshot: DataSnapshot) => {
      const rawData = snapshot.val() as Record<string, Record<string, Entry>>;
      const formattedData: ChartData[] = [];

      if (rawData) {
        if (filter === "daily") {
          Object.keys(rawData).forEach((time) => {
            const entry = rawData[time] as Entry;
            formattedData.push({
              time,
              temperature: entry.temperature,
              humidity: entry.humidity,
            });
          });
        } else if (filter === "monthly") {
          Object.keys(rawData).forEach((day) => {
            const dayData = rawData[day] as Record<string, Entry>;
            const averageTemp =
              Object.values(dayData).reduce(
                (acc, entry) => acc + entry.temperature,
                0
              ) / Object.keys(dayData).length;
            const averageHumidity =
              Object.values(dayData).reduce(
                (acc, entry) => acc + entry.humidity,
                0
              ) / Object.keys(dayData).length;
            formattedData.push({
              time: day,
              temperature: averageTemp,
              humidity: averageHumidity,
            });
          });
        }
      }

      setData(formattedData);
    };

    const dataListener = onValue(dataRef, processData);

    return () => {
      dataListener();
    };
  }, [filter, selectedDate]);

  const temperatureData = {
    labels: data.map((entry) => entry.time),
    datasets: [
      {
        label: "Temperature (°C)",
        data: data.map((entry) => entry.temperature),
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const temperatureOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === "daily" ? "Time (HH:MM)" : "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  const humidityData = {
    labels: data.map((entry) => entry.time),
    datasets: [
      {
        label: "Humidity (%)",
        data: data.map((entry) => entry.humidity),
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const humidityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === "daily" ? "Time (HH:MM)" : "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Humidity (%)",
        },
      },
    },
  };

  return (
    <div className="px-10 py-5">
      {/* Filter and Date Picker */}
      <div className="mb-6 flex items-center space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "daily" | "monthly")}
          className="rounded border border-gray-300 p-2"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? format(selectedDate, filter === "daily" ? "PPP" : "MMMM yyyy")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Temperature Chart */}
      <div className="relative mb-8 h-[400px] w-full">
        <h3 className="mb-2 text-lg font-semibold">Temperature Graph</h3>
        <Line data={temperatureData} options={temperatureOptions} />
      </div>

      {/* Humidity Chart */}
      <div className="relative h-[400px] w-full">
        <h3 className="mb-2 text-lg font-semibold">Humidity Graph</h3>
        <Line data={humidityData} options={humidityOptions} />
      </div>
    </div>
  );
};

export default HistoricalGraph;
