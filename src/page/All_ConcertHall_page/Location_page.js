import React, { useState, useEffect } from "react";
import Map from "../../component/Body/Map";
import axios from "axios";
import { useParams } from "react-router-dom";

function Location() {
  const { theaterId } = useParams();
  const [theaterInfo, setTheaterInfo] = useState(null);
  const [theaterLocation, setTheaterLocation] = useState(null);

  useEffect(() => {
    const fetchTheaterLocation = async () => {
      try {
        const response = await axios.get(`/theater/${theaterId}`);
        const theaterData = response.data;
        setTheaterInfo(theaterData);

        // 주소 정보와 검색 중심 좌표를 변수로 준비
        const address = theaterData.theaterLocation;
       

        console.log(address);
    

        // Geocoding API를 사용하여 주소를 위도와 경도로 변환
        const geocodingResponse = await axios.get(
          "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
          
          {
            params: {
              query: address,
             
            },
            headers: {
              
              "X-NCP-APIGW-API-KEY-ID": "ID",
              "X-NCP-APIGW-API-KEY": "KEY",
            },
          }
        );


        const locationData = geocodingResponse.data;
        console.log(locationData);
        if (
          locationData &&
          locationData.addresses &&
          locationData.addresses.length > 0
        ) {
          const { x: longitude, y: latitude } = locationData.addresses[0];
          setTheaterLocation({ latitude, longitude });
        }
      } catch (error) {
        console.error("Error fetching theater location: ", error);
      }
    };

    if (theaterId) {
      fetchTheaterLocation(theaterId);
    }
  }, [theaterId]);

  return (
    <>
      <h1 className="center">주소, 화장실 정보</h1>
      {theaterLocation ? <Map location={theaterLocation} /> : <p>Loading...</p>}
    </>
  );
}

export default Location;
