import Map from "../components/Map/Map";
import { StationProvider } from "../Context/StationContext";

const Metro = () => (
  <StationProvider>
    <Map />
  </StationProvider>
);

export default Metro;
