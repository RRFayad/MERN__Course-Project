import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import AuthContext from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { clearError, error, isLoading, sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleMapHandler = () => {
    setShowMap((prevState) => !prevState);
  };

  const toggleShowConfirmModalHandler = () => {
    setShowConfirmModal((prevState) => !prevState);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${authCtx.token}` }
      );
      props.onDelete(props.id);
    } catch (err) {}
    toggleShowConfirmModalHandler();
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        cancel={toggleMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={toggleMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <iframe // Instead of trying to render Max' Map, someone showed this solution (which means we did not use the Map component)
            title="map"
            width="100%"
            height="100%"
            src={
              "https://maps.google.com/maps?q=" +
              props.coordinates.lat.toString() +
              "," +
              props.coordinates.lng.toString() +
              "&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          ></iframe>
          <script
            type="text/javascript"
            src="https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165"
          ></script>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={toggleShowConfirmModalHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={toggleShowConfirmModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Are you sure you want to proceed and delete place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={toggleMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && (
              <>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={toggleShowConfirmModalHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
