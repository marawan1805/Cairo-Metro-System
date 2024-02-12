import React, { useContext } from 'react';
import { MapContext } from './Map/Map';
import './ThemeSelector.css'; 

const ThemeSelector = () => {
  const { setMapStyle } = useContext(MapContext);

  const handleChange = (event) => {
    const style = event.target.value;
    setMapStyle(style);
    localStorage.setItem('selectedTheme', style);
  };

  return (
    <div className="theme-selector">
      <select className='select' id="theme-dropdown" onChange={handleChange}>
        <option value="mapbox://styles/marawan1805/clh7obmkt00ph01qt3fz40g7g">Light</option>
        <option value="mapbox://styles/marawan1805/clh7miglu00vh01pg1vr50erd">Streets</option>
        <option value="mapbox://styles/marawan1805/clh7ogv2200un01pgepew5i0c">Dark</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
