import React, { useEffect, useRef } from "react";

const Map = (props) => {
  const mapRef = useRef();

  useEffect(() => {
    console.log(props.center);
    const map = new window.google.maps.Map(mapRef.current, {
      center: props.center,
      zoom: props.zoom,
    }); // Availale from the Google Mpas sdk

    new window.google.maps.Marker({
      position: props.center,
      map,
    });
  }, [props.center, props.zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
