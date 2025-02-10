import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  setCurrentPosition,
  setPlaces,
  setSelectedPlace,
  setError,
} from "../redux/slices/placesSlice";
import "../styles/SearchNearMe.css";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

// Map container style
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default map center
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const PetSalonPage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPosition, places, selectedPlace, error } = useSelector(
    (state: RootState) => state.places
  );

  const { t } = useTranslation(); // Initialize translation hook

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setCurrentPosition({ lat: latitude, lng: longitude }));
          fetchNearbyPlaces(latitude, longitude);
        },
        () => {
          dispatch(setError(t('searchNearMe.locationAccessError')));
        }
      );
    }
  }, [dispatch]);

  const fetchNearbyPlaces = (latitude: number, longitude: number) => {
    const map = new window.google.maps.Map(document.createElement("div"));
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(latitude, longitude),
      radius: 5000,
      keyword: "pet salon",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const fetchedPlaces = results.map((place) => ({
          id: place.place_id!,
          name: place.name!,
          location: {
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
          },
          address: place.vicinity!,
        }));
        dispatch(setPlaces(fetchedPlaces));
      } else {
        dispatch(setError(t('searchNearMe.fetchError')));
      }
    });
  };

  const openGoogleMaps = (place: { location: { lat: number; lng: number } }) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`,
      "_blank"
    );
  };

  return (
    <>
      <Header showCart showHamburger />
      <Box sx={{ width: "200%", height: "100vh", marginTop: "100px", paddingBottom: "70px" }}>
        {/* Header Section */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            padding: "16px",
            backgroundColor: "#000000",
            color: "rgba(238, 193, 102, 1)",
            marginBottom: "16px",
          }}
        >
          {t('searchNearMe.salonheader')}
        </Typography>

        {error ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 150px)",
            }}
          >
            <Typography variant="h6" color="#4a4948">
              {error}
            </Typography>
            <img
              src="https://treeoflifevet.com/wp-content/uploads/2022/10/48401d_b5e2c16723df4a52857f0184566f0336_mv2.gif"
              alt="Location required"
              style={{ maxWidth: "400px", marginTop: "20px" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "calc(100% - 72px)", // Adjust height based on header
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "16px",
            }}
          >
            {/* Left Side: Pet Salon List */}
            <Box
              sx={{
                width: "40%",
                paddingRight: "16px",
                overflowY: "auto",
                backgroundColor: "#f5f5f5",
                maxHeight: "calc(100% - 32px)",
              }}
            >
              <List>
                {places.map((place) => (
                  <ListItem
                    key={place.id}
                    sx={{
                      marginBottom: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <ListItemText
                      primary={<Typography variant="h6">{place.name}</Typography>}
                      secondary={place.address}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openGoogleMaps(place)}
                    >
                      {t('searchNearMe.navigateButton')}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Right Side: Google Map */}
            <Box
              sx={{
                width: "60%",
                height: "100%",
                position: "relative",
                display: "flex",
              }}
            >
              <LoadScript googleMapsApiKey="AIzaSyCrPmk62ARLAKvy25SSmK54qOHSr5aQofo" libraries={["places"]}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={currentPosition || defaultCenter}
                  zoom={14}
                >
                  {places.map((place) => (
                    <Marker
                      key={place.id}
                      position={place.location}
                      onClick={() => dispatch(setSelectedPlace(place))}
                    />
                  ))}
                  {selectedPlace && (
                    <InfoWindow
                      position={selectedPlace.location}
                      onCloseClick={() => dispatch(setSelectedPlace(null))}
                    >
                      <div>
                        <Typography variant="h6">{selectedPlace.name}</Typography>
                        <Typography>{selectedPlace.address}</Typography>
                      </div>
                    </InfoWindow>
                  )}
                  {currentPosition && <Marker position={currentPosition} label="You" />}
                </GoogleMap>
              </LoadScript>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default PetSalonPage;
