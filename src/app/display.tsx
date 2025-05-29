import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "./firebaseConfig";
import HistoricalGraph from "./graph";
import { Head } from "@inertiajs/react";

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 60;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="relative flex h-70 w-70 items-center justify-center">
      <svg
        className="absolute top-0 left-0 h-full w-full"
        viewBox="0 0 120 120"
      >
        <circle
          className="text-gray-300"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-blue-500"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx="60"
          cy="60"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute text-5xl font-bold text-blue-500">
        {percentage}%
      </div>
    </div>
  );
};

const RealtimeDisplay = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);

  useEffect(() => {
    const tempRef = ref(database, "realtime/temperature");
    const tempListener = onValue(tempRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    const humRef = ref(database, "realtime/humidity");
    const humListener = onValue(humRef, (snapshot) => {
      setHumidity(snapshot.val());
    });

    return () => {
      tempListener();
      humListener();
    };
  }, []);

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-start bg-gray-100 p-4">
        <h2 className="mb-8 text-center text-4xl font-bold text-gray-700">
          RTC Monitor
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="relative h-100 w-100 overflow-hidden p-6 shadow-lg">
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: 0.035,
                transform: "rotate(10deg)",
              }}
            >
              <svg
                fill="#000000"
                className="h-[300%] w-[300%] -translate-x-1/4 translate-y-1"
                viewBox="0 0 56 56"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 25.0117 54.0391 C 31.7617 54.0391 37.2461 48.5547 37.2461 41.8047 C 37.2461 38.2422 35.7696 35.125 32.9805 32.5938 C 32.4649 32.125 32.3476 31.8672 32.3476 31.1641 L 32.3945 10.1172 C 32.3945 5.2187 29.4180 1.9609 25.0117 1.9609 C 20.5820 1.9609 17.6055 5.2187 17.6055 10.1172 L 17.6289 31.1641 C 17.6289 31.8672 17.5117 32.125 17.0196 32.5938 C 14.2070 35.125 12.7539 38.2422 12.7539 41.8047 C 12.7539 48.5547 18.2149 54.0391 25.0117 54.0391 Z M 25.0117 50.6407 C 20.1367 50.6407 16.1758 46.6563 16.1758 41.8047 C 16.1758 38.8750 17.5586 36.2266 20.0430 34.5625 C 20.7696 34.0703 21.0508 33.625 21.0508 32.6641 L 21.0508 10.2578 C 21.0508 7.3047 22.6680 5.4063 25.0117 5.4063 C 27.3320 5.4063 28.9258 7.3047 28.9258 10.2578 L 28.9258 32.6641 C 28.9258 33.625 29.2070 34.0703 29.9336 34.5625 C 32.4180 36.2266 33.8008 38.8750 33.8008 41.8047 C 33.8008 46.6563 29.8633 50.6407 25.0117 50.6407 Z M 36.7539 10.5625 L 41.8633 10.5625 C 42.6836 10.5625 43.2461 9.9297 43.2461 9.2031 C 43.2461 8.4766 42.6836 7.8438 41.8633 7.8438 L 36.7539 7.8438 C 35.9336 7.8438 35.3711 8.4766 35.3711 9.2031 C 35.3711 9.9297 35.9336 10.5625 36.7539 10.5625 Z M 36.7539 17.1485 L 41.8633 17.1485 C 42.6836 17.1485 43.2461 16.5156 43.2461 15.7891 C 43.2461 15.0625 42.6836 14.4297 41.8633 14.4297 L 36.7539 14.4297 C 35.9336 14.4297 35.3711 15.0625 35.3711 15.7891 C 35.3711 16.5156 35.9336 17.1485 36.7539 17.1485 Z M 24.9883 47.4766 C 28.1289 47.4766 30.6602 44.9453 30.6602 41.7813 C 30.6602 39.5781 29.4180 37.7734 27.6133 36.7891 C 26.8633 36.3907 26.6055 36.1094 26.6055 34.9609 L 26.6055 22.5156 C 26.6055 21.2969 25.9023 20.5703 24.9883 20.5703 C 24.0976 20.5703 23.3711 21.2969 23.3711 22.5156 L 23.3711 34.9609 C 23.3711 36.1094 23.1133 36.3907 22.3633 36.7891 C 20.5586 37.7734 19.3164 39.5781 19.3164 41.7813 C 19.3164 44.9453 21.8476 47.4766 24.9883 47.4766 Z M 36.7539 23.7344 L 41.8633 23.7344 C 42.6836 23.7344 43.2461 23.1016 43.2461 22.375 C 43.2461 21.6485 42.6836 20.9922 41.8633 20.9922 L 36.7539 20.9922 C 35.9336 20.9922 35.3711 21.6485 35.3711 22.375 C 35.3711 23.1016 35.9336 23.7344 36.7539 23.7344 Z M 36.7539 30.3203 L 41.8633 30.3203 C 42.6836 30.3203 43.2461 29.6641 43.2461 28.9375 C 43.2461 28.2109 42.6836 27.5782 41.8633 27.5782 L 36.7539 27.5782 C 35.9336 27.5782 35.3711 28.2109 35.3711 28.9375 C 35.3711 29.6641 35.9336 30.3203 36.7539 30.3203 Z" />
              </svg>
            </div>

            <CardHeader className="relative z-10 text-center text-2xl font-bold">
              Temperature
            </CardHeader>
            <CardContent className="relative z-10 flex h-full items-center justify-center">
              {temperature !== null ? (
                <div className="text-7xl font-semibold text-blue-500">{`${temperature} °C`}</div>
              ) : (
                <Spinner size="large" />
              )}
            </CardContent>
          </Card>

          <Card className="relative h-100 w-100 overflow-hidden p-6 shadow-lg">
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: 0.035,
                transform: "rotate(10deg)",
              }}
            >
              <svg
                className="h-[300%] w-[300%] -translate-x-1/4 translate-y-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 14.5714C20 18.7526 16.3364 22 12 22C7.66359 22 4 18.7526 4 14.5714C4 12 5.30472 9.45232 6.71637 7.42349C8.1468 5.36767 9.79177 3.69743 10.6777 2.85537M20 14.5714L10.6777 2.85537M20 14.5714C20 12 18.6953 9.45232 17.2836 7.42349C15.8532 5.36767 14.2082 3.69743 13.3223 2.85537C12.5778 2.14778 11.4222 2.14778 10.6777 2.85537M20 14.5714L10.6777 2.85537"
                  stroke="#33363F"
                  strokeWidth="2"
                />
                <path
                  d="M12 18C11.4747 18 10.9546 17.8965 10.4693 17.6955C9.98396 17.4945 9.54301 17.1999 9.17157 16.8284C8.80014 16.457 8.5055 16.016 8.30448 15.5307C8.10346 15.0454 8 14.5253 8 14"
                  stroke="#33363F"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <CardHeader className="text-center text-2xl font-bold">
              Humidity
            </CardHeader>
            <CardContent className="flex h-full flex-col items-center justify-center">
              {humidity !== null ? (
                <CircularProgress percentage={humidity} />
              ) : (
                <Spinner size="large" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <HistoricalGraph />
    </>
  );
};

export default RealtimeDisplay;
