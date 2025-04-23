import React, {useState} from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";


const MAPBOX_TOKEN = "pk.eyJ1Ijoia2FybmFtLXAiLCJhIjoiY205a2VnYW1pMGxlYTJrcG5vOHVwNnk0diJ9.aU3bMVTraO_3v3CyJ05eWg";
const mapStyle = "mapbox://styles/mapbox/light-v10";

const religiousEvents = [
  { name: "Maha Kumbh Mela", country: "India", longitude: 81.8852, latitude: 25.4328, attendance: 120 },
  { name: "Arba'een Pilgrimage", country: "Iraq", latitude: 31.5085, longitude: 44.7140, attendance: 20 },
  { name: "Pope Francis' Catholic Mass (2015)", country: "Philippines", latitude: 14.5820, longitude: 120.9790, attendance: 7 },
  { name: "Hajj", country: "Saudi Arabia", latitude: 21.4225, longitude: 39.8262, attendance: 3 },
  { name: "Makara Jyothi (Sabarimala, 2007)", country: "India", latitude: 9.4346, longitude: 77.0814, attendance: 5 },
  { name: "Bishwa Ijtema", country: "Bangladesh", latitude: 23.8915, longitude: 90.3969, attendance: 5 },
  { name: "Attukal Temple", country: "India", latitude: 8.4698, longitude: 76.9555, attendance: 3 },
  { name: "Black Nazarene Procession", country: "Philippines", latitude: 14.5995, longitude: 120.9842, attendance: 6 },
  { name: "Nabakalebara Festival (2015)", country: "India", latitude: 19.8028, longitude: 85.8177, attendance: 5 },
  { name: "Beatification of Pope John Paul II (2005)", country: "Vatican City", latitude: 41.9022, longitude: 12.4539, attendance: 1 }
];

export default function ReligiousEventsMap({ viewState, setViewState }) {
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const layers = [
    new ScatterplotLayer({
      id: "religious-events",
      data: religiousEvents,
      getPosition: d => [d.longitude, d.latitude],
      getRadius: d => d.attendance,
      getFillColor: [147, 43, 35],
      
      lineWidthMinPixels: 1,
      opacity: 0.8,
      filled: true,
      
      radiusScale: 15000,
      radiusMinPixels: 2,
      radiusMaxPixels: 100,
      pickable: true,
      onHover: ({ object, x, y }) =>
        setHoveredInfo(object ? { object, x, y } : null),
      transitions:
      {
        getPosition: 200,
        getRadius: 200
      }

    })
  ];

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState)}
      controller={true}
      layers={layers}
      style={{ position: "relative", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={mapStyle}
      />
    
    {hoveredInfo && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            pointerEvents: "none",
            left: hoveredInfo.x + 10,
            top: hoveredInfo.y + 10,
            background: "rgba(0,0,0,0.8)",
            padding: "6px 10px",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "12px",
            maxWidth: "200px",
          }}
        >
          <div><strong>{hoveredInfo.object.name}</strong></div>
          <div>{hoveredInfo.object.country}</div>
          <div>Attendance: {hoveredInfo.object.attendance} million</div>
        </div>
      )}
    </DeckGL>
  );
}
