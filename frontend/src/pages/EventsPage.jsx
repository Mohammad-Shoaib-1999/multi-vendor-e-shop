import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Loader from "../components/Layout/Loader";
import Header from "../components/Layout/Header";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />

          {allEvents.length !== 0 ? (
            allEvents.map((event, index) => (
              <EventCard key={index} active={true} data={event} />
            ))
          ) : (
            <h4>No Events have!</h4>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;
