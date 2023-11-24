import { useEffect, useRef, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [zip, setZip] = useState("");

  useEffect(
    function () {
      async function fetchAPI() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(`https://api.zippopotam.us/in/${zip}`);

          if (!res.ok) throw new Error("ZIP CODE NOT FOUND");

          const data = await res.json([]);
          console.log(data);
          setData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (zip.length < 6) {
        setZip("");
        setError("");
        return;
      }

      fetchAPI();
    },
    [zip]
  );

  const zipCode = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setData("");
    zipCode.current.value = "";
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex justify-center mt-20">
        <input
          type="text"
          className="outline-none text-2xl border border-gray-300 p-2"
          ref={zipCode}
          onChange={(e) => {
            setZip(e.target.value);
          }}
        />
        <button
          type="submit"
          className="text-2xl text-white font-bold ml-20 w-36 h-14  border bg-red-500 rounded-full"
        >
          Clear
        </button>
      </form>
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && <Data data={data} />}
    </div>
  );
}

function Loader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <button
        type="button"
        className="flex items-center rounded-lg bg-green-700 px-4 py-2 text-white"
        disabled
      >
        <svg
          className="mr-3 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="font-medium"> Processing... </span>
      </button>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col justify-center items-center mt-24">
      <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2 ">
        Danger
      </div>
      <div className="mt-5 border border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
        <p>{message}</p>
      </div>
    </div>
  );
}

function Data({ data }) {
  const country = data.country;
  console.log(data);
  return (
    <div className="flex justify-center mt-20">
      {country ? (
        <table className="shadow-2xl botder-2 border-cyan-200 w-6/12 ">
          <thead className="text-white">
            <tr className="">
              <th className="py-5 px-10 bg-cyan-800">Post Code</th>
              <th className="py-5 px-10 bg-cyan-800">Country</th>
              <th className="py-5 px-10 bg-cyan-800">Country abbreviation</th>
              <th className="py-5 px-32 bg-cyan-800">Place Name</th>
              <th className="py-5 px-10 bg-cyan-800">State</th>
              <th className="py-5 px-10 bg-cyan-800">State abbreviation</th>
              <th className="py-5 px-10 bg-cyan-800">longitude</th>
              <th className="py-5 px-10 bg-cyan-800">latitude</th>
            </tr>
          </thead>
          <tbody className="text-cyan-900 text-center">
            {data.places.map((el, idx) => (
              <tr
                className={
                  idx % 2 === 0
                    ? `bg-cyan-200  cursor-pointer duration-300 hover:bg-cyan-400`
                    : `bg-orange-200 cursor-pointer duration-300 hover:bg-orange-300`
                }
              >
                <td>{data["post code"]}</td>
                <td>{data["country"]}</td>
                <td>{data["country abbreviation"]}</td>
                <td> {el["place name"]} </td>
                <td> {el["state"]} </td>
                <td> {el["state abbreviation"]} </td>
                <td> {el["longitude"]} </td>
                <td> {el["latitude"]} </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
