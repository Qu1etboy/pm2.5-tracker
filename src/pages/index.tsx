import Head from "next/head";
import { Inter } from "next/font/google";
import axios from "axios";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface AirPollution {
  coord: {
    lat: number;
    lon: number;
  };
  list: Data[];
}

interface Data {
  components: {
    co: number;
    nh3: number;
    no: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
    so2: number;
  };
  dt: number;
  main: {
    aqi: number;
  };
}

export default function Home() {
  const [airPollution, setAirPollution] = useState<AirPollution | null>(null);

  async function getAirPollution(lat: string, lon: string) {
    const res = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API}`
    );

    const data = await res.data;

    setAirPollution(data);
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function setPosition(position: any) {
    getAirPollution(position.coords.latitude, position.coords.longitude);
  }

  useEffect(() => {
    console.log(airPollution);
  }, [airPollution]);

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      <Head>
        <title>PM 2.5 Tracker</title>
        <meta
          name="description"
          content="Know how much PM 2.5 is. In your area"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-gray-50">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="my-5 text-4xl font-bold md:text-6xl lg:text-8xl">
            <span className="text-emerald-500">
              PM <sub>2.5</sub>
            </span>{" "}
            Tracker
          </h1>
          <h2 className="text-center text-lg md:text-3xl">
            Know how much PM <sub>2.5</sub> is. In your area.
          </h2>

          {airPollution ? (
            <>
              <div className="m-5 inline-block rounded-lg bg-yellow-500 p-5 text-4xl md:text-6xl">
                {airPollution.list[0].components.pm2_5}{" "}
                <b>
                  μg/m<sup>3</sup>
                </b>
              </div>
              <div className="w-full overflow-scroll">
                <table className="mx-auto">
                  <thead>
                    <tr>
                      <th>CO</th>
                      <th>
                        NH<sub>3</sub>
                      </th>
                      <th>NO</th>
                      <th>
                        NO<sub>2</sub>
                      </th>
                      <th>
                        O<sub>3</sub>
                      </th>
                      <th>
                        PM<sub>10</sub>
                      </th>
                      <th>
                        PM<sub>2.5</sub>
                      </th>
                      <th>
                        SO<sub>2</sub>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.co}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.nh3}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.no}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.no2}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.o3}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.pm10}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.pm2_5}
                      </td>
                      <td className="px-6 py-3">
                        {airPollution.list[0].components.so2}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // Loading spinner
            <div role="status">
              <svg
                aria-hidden="true"
                className="mr-2 mt-5 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          <div className="w-full overflow-scroll">
            <table className="mx-auto my-10">
              <thead>
                <tr>
                  <th>Qualitative name</th>
                  <th>Index</th>
                  <th colSpan={4}>
                    Pollutant concentration in μg/m<sup>3</sup>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2}></td>
                  <td className="px-6 py-3">
                    SO<sub>2</sub>
                  </td>
                  <td className="px-6 py-3">
                    NO<sub>2</sub>
                  </td>
                  <td className="px-6 py-3">
                    PM<sub>10</sub>
                  </td>
                  <td className="px-6 py-3">
                    PM<sub>2.5</sub>
                  </td>
                  <td className="px-6 py-3">
                    O<sub>3</sub>
                  </td>
                  <td>CO</td>
                </tr>
                <tr className="bg-neutral-800">
                  <td className="px-6 py-3">Good</td>
                  <td className="px-6 py-3">1</td>
                  <td className="px-6 py-3">0-20</td>
                  <td className="px-6 py-3">0-40</td>
                  <td className="px-6 py-3">0-20</td>
                  <td className="px-6 py-3">0-10</td>
                  <td className="px-6 py-3">0-60</td>
                  <td className="px-6 py-3">0-4400</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">Fair</td>
                  <td className="px-6 py-3">2</td>
                  <td className="px-6 py-3">20-80</td>
                  <td className="px-6 py-3">40-70</td>
                  <td className="px-6 py-3">20-50</td>
                  <td className="px-6 py-3">10-25</td>
                  <td className="px-6 py-3">60-100</td>
                  <td className="px-6 py-3">4400-9400</td>
                </tr>
                <tr className="bg-neutral-800">
                  <td className="px-6 py-3">Moderate</td>
                  <td className="px-6 py-3">3</td>
                  <td className="px-6 py-3">80-250</td>
                  <td className="px-6 py-3">70-150</td>
                  <td className="px-6 py-3">50-100</td>
                  <td className="px-6 py-3">25-50</td>
                  <td className="px-6 py-3">100-140</td>
                  <td className="px-6 py-3">9400-12400</td>
                </tr>
                <tr>
                  <td className="px-6 py-3">Poor</td>
                  <td className="px-6 py-3">4</td>
                  <td className="px-6 py-3">250-350</td>
                  <td className="px-6 py-3">150-200</td>
                  <td className="px-6 py-3">100-200</td>
                  <td className="px-6 py-3">50-75</td>
                  <td className="px-6 py-3">140-180</td>
                  <td className="px-6 py-3">12400-15400</td>
                </tr>
                <tr className="bg-neutral-800 ">
                  <td className="px-6 py-3">Very Poor</td>
                  <td className="px-6 py-3">5</td>
                  <td className="px-6 py-3">&gt;350</td>
                  <td className="px-6 py-3">&gt;200</td>
                  <td className="px-6 py-3">&gt;200</td>
                  <td className="px-6 py-3">&gt;75</td>
                  <td className="px-6 py-3">&gt;180</td>
                  <td className="px-6 py-3">&gt;15400</td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer className="mb-2 text-gray-300">
            <span className="mr-3">
              Powered by{" "}
              <a
                href="https://openweathermap.org/"
                className="text-emerald-300"
              >
                OpenWeatherMap.org
              </a>
            </span>
            <span>
              Made with ❤️ by{" "}
              <a href="https://qu1etboy.dev" className="text-emerald-300">
                Qu1etboy
              </a>
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}
