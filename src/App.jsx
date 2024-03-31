import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {

  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [meanDate, setMeanDate] = useState(null);
  const [medianDate, setMedianDate] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');


  useEffect(() => {
    fetchEvents().catch(console.error);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`https://api.seatgeek.com/2/events?client_id=NDA2ODU3MzJ8MTcxMTgzOTAxNi43ODc5Nzc3`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API');
      }
      const { events } = await response.json();
      setEvents(events);
      setFilteredEvents(events);
      calculateStatistics(events);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      alert('Error fetching data. Please try again later.');
    }
  };


  const calculateStatistics = (events) => {
    // Calculate total number of events
    setTotalEvents(events.length);

    // Calculate mean date
    const eventDates = events.map(event => new Date(event.datetime_utc));
    const meanTimestamp = eventDates.reduce((acc, date) => acc + date.getTime(), 0) / eventDates.length;
    setMeanDate(new Date(meanTimestamp));

    // Calculate median date
    const sortedEventDates = eventDates.sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedEventDates.length / 2);
    setMedianDate(sortedEventDates[medianIndex]);
  };



  useEffect(() => {
    applyFilters();
  }, [searchInput, selectedVenue, selectedLocation, events]);

  const applyFilters = () => {
    let filtered = events.filter(event => {
      let matchSearch = true;
      let matchVenue = true;
      let matchLocation = true;

      // Apply search filter
      if (searchInput) {
        matchSearch = event.title.toLowerCase().includes(searchInput.toLowerCase());
      }

      // Apply venue filter
      if (selectedVenue) {
        matchVenue = event.venue.name === selectedVenue;
      }

      // Apply location filter
      if (selectedLocation) {
        matchLocation = event.venue.display_location === selectedLocation;
      }

      return matchSearch && matchVenue && matchLocation;
    });
    setFilteredEvents(filtered);
  };


  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleVenueChange = (event) => {
    setSelectedVenue(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  return (
    <div className="App">


      <div className='search'>
        <input
          type="text"
          placeholder="Search events..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />




        <select value={selectedVenue} onChange={handleVenueChange}>
          <option value="">Select Venue</option>
          {/* Populate options dynamically based on available venues */}
          {events.map(event => (
            <option key={event.id}>{event.venue.name}</option>
          ))}
        </select>

        <select value={selectedLocation} onChange={handleLocationChange}>
          <option value="">Select Location</option>
          {/* Populate options dynamically based on available locations */}
          {events.map(event => (
            <option key={event.id}>{event.venue.display_location}</option>
          ))}
        </select>





      </div>


      <div className='leftSide'>
        <div className='header'>
          <h2>Header</h2>
          <h1 className='smallboxes'>Event dashboard</h1>
        </div>
        <div className='header'>
          <h2 className='nav'>NavBar</h2>
          <div className='smallboxes'>
            <h2>Dashboard</h2>
            <h2>Search</h2>
            <h2>About</h2>
          </div>
        </div>
      </div>


      <div className='cardalign'>
        <h2 className='card cardLeft'>Total number of events: {totalEvents} </h2>
        <h2 className='card'>Mean date: {meanDate ? meanDate.toDateString() : 'Loading...'} </h2>
        <h2 className='card'>Median date: {medianDate ? medianDate.toDateString() : 'Loading...'} </h2>
      </div>



      <div className='results'>
        {filteredEvents.map(event => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>Date: {event.datetime_utc}</p>
            <p>Venue: {event.venue.name}</p>
            <p>Location: {event.venue.display_location}</p>
            <p>Performer: {event.performers[0].name}</p>
            <p>Country: {event.venue.country}</p>
            {/* You can add more details here */}
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;