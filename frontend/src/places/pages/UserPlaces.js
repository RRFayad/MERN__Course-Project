import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Budapest Parliament",
    description: "One of the most beautifuls parliaments in the world",
    imageUrl:
      "https://www.historyhit.com/app/uploads/fly-images/5158752/parliament-budapest-788x537.jpg",
    address: "Budapest, Kossuth Lajos tér 1-3, 1055 Hungria",
    location: {
      lat: 47.5070988,
      lng: 19.0405461,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky screapers in the world",
    imageUrl:
      "https://s39023.pcdn.co/wp-content/uploads/2022/10/Where-Are-Those-Morgans-Empire-State-Building-728x546.jpg.webp",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484404,
      lng: -73.9905353,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const userPlaces = DUMMY_PLACES.filter((item) => item.creator === userId);
  return <PlaceList items={userPlaces} />;
};

export default UserPlaces;
