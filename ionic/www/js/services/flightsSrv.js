App.factory('FlightsSrv', function ($http) {
   return {
      /*Flight Info */
      setSearchOther: function(value) {
         this.searchOther = value;
      },
      getSearchOther: function() {
         return this.searchOther;
      },
      setFlightType: function(value) {
         this.flightType = value;
      },
      getFlightType: function() {
         return this.flightType;
      },
      setSelectedOriginAirport: function(value) {
         this.selectedOriginAirport = value;
      },
      getSelectedOriginAirport: function() {
         return this.selectedOriginAirport;
      },
      setSelectedDestinationAirport: function(value) {
         this.selectedDestinationAirport = value;
      },
      getSelectedDestinationAirport: function() {
         return this.selectedDestinationAirport;
      },
      setDepartureDate: function(value) {
         this.departureDate = value;
      },
      getDepartureDate: function() {
         return this.departureDate;
      },
      setReturnDate: function(value) {
         this.returnDate = value;
      },
      getReturnDate: function() {
         return this.returnDate;
      },
      setAdults: function(value) {
         this.adults = value;
      },
      getAdults: function() {
         return this.adults;
      },
      setChildren: function(value) {
         this.children = value;
      },
      getChildren: function() {
         return this.children;
      },
      setInfants: function(value) {
         this.infants = value;
      },
      getInfants: function() {
         return this.infants;
      },
      setClass: function(value) {
         this.class = value;
      },
      getClass: function() {
         return this.class;
      },
      setDepartureFlight: function(value) {
         this.departureFlight = value;
      },
      getDepartureFlight: function() {
         return this.departureFlight;
      },
      setReturnFlight: function(value) {
         this.returnFlight = value;
      },
      getReturnFlight: function() {
         return this.returnFlight;
      },
      setOutgoingPrice: function(value) {
         this.outgoing_price = value;
      },
      getOutgoingPrice: function() {
         return this.outgoing_price;
      },
      setIncomingPrice: function(value) {
         this.incoming_price = value;
      },
      getIncomingPrice: function() {
         return this.incoming_price;
      },
      setTotalPrice: function(value) {
         this.total_price = value;
      },
      getTotalPrice: function() {
         return this.total_price;
      },
   };   
});