// src/components/shared/Map.tsx
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 👇 FIX: Leaflet sometimes loses its default map pin icons in React. This code fixes that bug permanently.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 👇 This defines what information the map expects to receive (an array of complaints)
interface MapProps {
  complaints: any[];
}

export function ComplaintMap({ complaints }: MapProps) {
  // We center the map on Lucknow coordinates (Latitude: 26.8467, Longitude: 80.9462)
  const centerCoords: [number, number] = [26.8467, 80.9462];

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-xl border border-zinc-200 mt-8">
      {/* MapContainer is the actual map window. We set the zoom level to 12. */}
      <MapContainer center={centerCoords} zoom={12} style={{ height: '100%', width: '100%' }}>
        
        {/* TileLayer is the background imagery. This specific URL pulls from the free OpenStreetMap servers! */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* We loop through every complaint and draw a colored circle on the map for it */}
        {complaints.map((complaint, index) => {
          // Because our dummy data doesn't have GPS coordinates yet, we generate slight random offsets around Lucknow so you can see them!
          const lat = complaint.lat || 26.8467 + (Math.random() - 0.5) * 0.05;
          const lng = complaint.lng || 80.9462 + (Math.random() - 0.5) * 0.05;
          
          // Determine the color of the dot based on the Priority Score
          const priority = complaint.priority_score || 50;
          const dotColor = priority > 70 ? '#FF4D5A' : priority > 40 ? '#FFAC1C' : '#22C55E';

          return (
            <CircleMarker
              key={complaint.id || index}
              center={[lat, lng]}
              radius={12}
              fillColor={dotColor}
              color={dotColor}
              weight={2}
              fillOpacity={0.8}
            >
              {/* Popup is the little speech bubble that appears when you click a dot */}
              <Popup>
                <div className="font-sans">
                  <p className="font-bold text-slate-800">{complaint.ward || 'General Area'}</p>
                  <p className="text-xs text-slate-600 mt-1">Priority Score: {priority}/100</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}