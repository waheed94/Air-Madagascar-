App.controller('bookController-flights', function($scope) {

$scope.dradioModel = 'dradio3';
$scope.retradioModel = 'retradio3';

$scope.dep_isSelected = "First";
$scope.ret_isSelected = "First";

$scope.flights = [   {  "flightNumber": '1',
                           "depTime":'12:00',
                           "arrTime":'15:00',
                           "duration":'3 hour(s)',
                           "planeModel":'Airbus A319',
                           "class": 'Economy',
                           "price": '3,500 EGP',
                           "stops": '2',
                           "remaining_seats": '5',
                           "entertainment": [
                              "Wifi", "Radio"
                           ]},

                        {  "flightNumber": '1',
                           "depTime":'12:00',
                           "arrTime":'15:00',
                           "duration":'3 hour(s)',
                           "planeModel":'Airbus A319',
                           "class": 'First',
                           "stops": '2',
                           "price": '5,000 EGP',
                           "remaining_seats": '0',
                           "entertainment": [
                              "Radio"
                           ]},

                        {  "flightNumber": '1',
                           "depTime":'12:00',
                           "arrTime":'15:00',
                           "duration":'3 hour(s)',
                           "planeModel":'Airbus A319',
                           "class": 'Business',
                           "stops": '2',
                           "price": '4,200 EGP',
                           "remaining_seats": '1',
                           "entertainment": [
                              "Wifi", "Radio"
                           ]},

                        {  "flightNumber": '2',
                           "depTime":'19:30',
                           "arrTime":'22:30',
                           "duration":'3 hour(s)',
                           "planeModel":'Airbus A322',
                           "class": 'Economy',
                           "price": '3,800 EGP',
                           "stops": '2',
                           "remaining_seats": '3',
                           "entertainment": [
                              "Wifi"
                           ]},

                           {  "flightNumber": '2',
                           "depTime":'19:30',
                           "arrTime":'22:30',
                           "duration":'3 hour(s)',
                           "planeModel":'Airbus A322',
                           "class": 'Business',
                           "price": '4,700 EGP',
                           "stops": '2',
                           "remaining_seats": '0',
                           "entertainment": [
                              "Power Cord", "Radio"
                           ]}
                      ];

});
