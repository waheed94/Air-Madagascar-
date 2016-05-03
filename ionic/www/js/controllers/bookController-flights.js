
App.controller('bookController-flights', function($scope, FlightsSrv, $location) { 
      FlightsSrv.setFlightType("round"); //dummy
      FlightsSrv.setSelectedOriginAirport("CAI"); //dummy
      FlightsSrv.setSelectedDestinationAirport("TXL"); //dummy

       var flights = 
      [
        {id:1, Airline:"Air Madagascar", Time:"03:40 - 07:40", Seats:"50", planeModel:"Bombardier F868", Cost:"8127 USD",  Entertainment:"Wifi Radio USB "},
        {id:2, Airline:"Air Madagascar", Time:"03:40 - 07:40", Seats:"50", planeModel:"Bombardier F868", Cost:"8127 USD",  Entertainment:"Wifi Radio USB "},
        {id:3, Airline:"Air Madagascar", Time:"03:40 - 07:40", Seats:"50", planeModel:"Bombardier F868", Cost:"8127 USD",  Entertainment:"Wifi Radio USB "},
        ];
        $scope.flights = flights;

      var retFlights = 
      [
        {id:4, Airline:"Air Madagascar", Time:"03:40 - 07:40", Seats:"50", planeModel:"Bombardier F868", Cost:"8127 USD",  Entertainment:"Wifi Radio USB "},
        {id:5, Airline:"Air Madagascar", Time:"03:40 - 07:40", Seats:"50", planeModel:"Bombardier F868", Cost:"8127 USD",  Entertainment:"Wifi Radio USB "},
      ];
      $scope.retFlights = retFlights;


      if (FlightsSrv.getFlightType() == "round") {
      $scope.show_incoming = true;
      }

      $scope.dep_airport = FlightsSrv.getSelectedOriginAirport();
      $scope.ret_airport = FlightsSrv.getSelectedDestinationAirport();
      
      $scope.showInfo = function(flightID) {
        console.log("clicked");
        console.log(flightID);
        var flight;
        var found=false;
       for (var i = 0; i < flights.length && !found; i++) {
        if (flights[i].id === flightID) {
          flight= flights[i];
          found=true;
        }
      }
      for (var i = 0; i < retFlights.length && !found; i++) {
        if (retFlights[i].id === flightID) {
          flight= retFlights[i];
          found=true;
        }
      }

      // FlightSrv.setAirline(flight.Airline);
      // FlightSrv.setFlightTime(flight.Time);
      // FlightSrv.setSeats(flight.Seats);
      // FlightSrv.setPlaneModel(flight.planeModel);
      // FlightSrv.setCost(flight.Cost);
      // FlightSrv.setEntertainment(flight.Entertainment);
      $location.url("/tabs/flights-details");
      console.log(flight);
      };
    
    /*
    Validations
    */
   $scope.submitted = false;
      //should be editted
      $scope.submitForm = function(isValid) {
        $scope.submitted = true;

        // check to make sure the form is completely valid
        if (isValid) {
           console.log('good');

           
           
           FlightsSrv.setDepartureFlight($scope.dep_flight);
           FlightsSrv.setReturnFlight($scope.ret_flight);
           FlightsSrv.setOutgoingPrice(parseInt($scope.dep_price));
           FlightsSrv.setIncomingPrice(parseInt($scope.ret_price));
           FlightsSrv.setTotalPrice(parseInt($scope.dep_price) + parseInt($scope.ret_price));

          $location.url("/tabs/personalInfo");

        }
        else {
           console.log('bad');
        }

      };

      })





  


