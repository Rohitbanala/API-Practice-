import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchPlaces() {
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsLoading(false);
        });
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    }
    fetchPlaces();
  }, []);
  if (error) {
    return <Error title="An error Occured" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      isLoading={isLoading}
      loadingText={"fetching places...."}
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
