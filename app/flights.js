var moment = require('moment');
var db = require('./db');
var fs = require('fs');
var http = require('http');
var mongo = require('mongodb');
var stripe = require('stripe')(process.env.STRIPETSK);

/**
* This function return an array of length 1 of a specific reservation info.
* @param {Function} callback function, {String} the booking reference
* @returns {JSONObject}
*/
var getReservation = function(callback, bookingReference) {
	db.getDatabase().collection('reservations').find({booking_ref_number: bookingReference}).toArray(function(err, reservation) {
		callback(err, reservation);
	});
};

/**
* This function returns a JSON object with all the countries.
*
* @param {Function} callback function that is called after retrieving the countries.
* @returns {JSONObject}
*/
var getCountries = function(callback) {
	db.getDatabase().collection('countries').find().toArray(function(err, docs) {
		callback(err, docs);
	});
};

/**
* This function returns a JSON object with all the Airports.
*
* @param {Function} callback function that is called after retrieving the airports.
* @returns {JSONObject}
*/
var getAirports = function(callback) {
	db.getDatabase().collection('airports').find().toArray(function(err, docs) {
		callback(err, docs);
	});
};

/**
* This function return a random boolean value.
*
* @returns {Boolean}
*/
var randomBoolean = function() {
	var chosenBoolean = Math.random() < 0.5 ? true : false;
	return chosenBoolean;
};

/**
* returns a random element from a givin array.
*
* @param {Array} an array of elements
* @returns {Object}
*/
var chooseRandomElement = function(array) {
	var number = Math.floor(Math.random() *(array.length));
	return array[number];
};

/**
* This function generates a random flight number.
*
* @returns {String}
*/
var generateFlightnumber = function() {
	var text = "";
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var numbers = "0123456789";

	for(var i = 0; i < 2; i++) {
		text += letters.charAt(Math.floor(Math.random() * letters.length));
	}
	for(var i = 0; i < 4; i++) {
		text += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}

	return text;
};

/**
* This function generates a random promotion codes
*
* @returns {JSONObject}
*/
var generatePromo = function() {
	//genereating a code
	var code = "";
	for (var i = 0; i < 8; i++) {
		if(randomBoolean()){
			//Capital Letter
			var letter = String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
			code += letter;
		}
		else{
			//number
			var number = Math.floor(Math.random() * 10);
			code += number;
		}
	}

	//genereating a discount
	var discount = ((Math.floor(Math.random() * 100)) + 1) / 100;

	var valid = true;

	var promoCode = {
		"code": code,
		"discount": discount,
		"valid": valid
	};

	return promoCode;
};

/**
* This function seeds the database.
*
* @param {Function} callback function that is called after the seeding is complete.
*/
var seed = function(callback) {
	/* static arrays */
	var aircraftTypes =["Airbus", "Boeing"];

	var originOrDestination1 =["BOM", "CAI", "HKG", "JNB", "RUH",
	"LHR", "LCF", "LAX", " FRA", "FCO"];

	var originOrDestination2 =["DEL", "JED", "TPE", "CPT", "JED",
	"JFK", "LAX", "SFO", "TXL", "LIN"];

	var airCrafts = [];

	for (var i = 0; i < 200; i++) {
		var generatedAircraftModel = String.fromCharCode(65 + (Math.floor(Math.random() * 26))) + '' + Math.floor(100 + Math.random() * 900).toString();
		var date_of_manufacture = moment('1990-06-10').toDate().getTime();

		var airCraft = 	{
			"aircraftType": chooseRandomElement(aircraftTypes),
			"aircraftModel": generatedAircraftModel,
			"date_of_manufacture": date_of_manufacture,
			"capacity": "300",
			"avg_speed": "700",
			"total_flight_hours": "2000",
			"in_flight_entertainment": 	{
				"wifi": randomBoolean(),
				"radio": randomBoolean(),
				"power_port": randomBoolean()
			}
		};

		airCrafts.push(airCraft);
	}

	//generating the empty seatmap
	var seatmap = [];
	for (var i = 1; i < 2/*12*/; i++) { /*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
		for (var j = 0; j < 9; j++) {
			seatmap.push({
				"seatNumber": (i + String.fromCharCode(65 + j)),
				"taken": false
			});
		}
	}
	//seatmap generated

	var number = Math.floor(Math.random() * (originOrDestination1.length));
	var dep_date = moment('2016-04-11');
	var dep_dateTime = moment('2016-04-11 03:40 AM', 'YYYY-MM-DD hh:mm A');

	var flights = [];

	/* seeding the flight table back and forth form list originOrDestination1 to originOrDestination2 and vice versa */
	for (var i = 11; i < 62; i++) {
		for (var j = 0; j < originOrDestination1.length; j++) {
			var flightDuration = Math.floor(1 + (Math.random() * 16));
			var randomCost = Math.floor(600+Math.random() * 2000);


			var ret_dateTime = dep_dateTime.clone();
			ret_dateTime = ret_dateTime.add(flightDuration, 'h');

			var origin = originOrDestination1[j];
			var destination = originOrDestination2[j];
			var flight =	{
				"Airline": "Air Madagascar",
				"flightNumber": generateFlightnumber(),
				"departureDate":  dep_date.format('YYYY-MM-DD'),
				"departureDateTime":dep_dateTime.toDate().getTime(),
				"arrivalDateTime": ret_dateTime.toDate().getTime(),
				"class": "economy",
				"type": "Direct",
				"tranzit": [],
				"duration": flightDuration,
				"origin": origin,
				"destination": destination,
				"remaining_seats": 270,
				"cost": randomCost,
				"currency": "USD",
				"nextFreeSeat": 0,
				"seatmap": 	seatmap,
				"aircraft": airCrafts[Math.floor(Math.random() * airCrafts.length)]
			};

			flights.push(flight);
			var flightB = JSON.parse(JSON.stringify(flight));
			flightB.class = "business";
			flightB.cost = parseInt(flightB.cost) + 300;
			flights.push(flightB);

			origin = originOrDestination2[j];
			destination = originOrDestination1[j];
			flight =	{
				"Airline": "Air Madagascar",
				"flightNumber": generateFlightnumber(),
				"departureDate": dep_date.format('YYYY-MM-DD'),
				"departureDateTime": dep_dateTime.toDate().getTime(),
				"arrivalDateTime": ret_dateTime.toDate().getTime(),
				"class": "economy",
				"type": "Direct",
				"tranzit": [],
				"duration": flightDuration,
				"origin": origin,
				"destination": destination,
				"remaining_seats": 270,
				"cost": randomCost,
				"currency": "USD",
				"nextFreeSeat": 0,
				"seatmap": 	seatmap,
				"aircraft": airCrafts[Math.floor(Math.random() * airCrafts.length)]
			};

			flights.push(flight);
			flightB = JSON.parse(JSON.stringify(flight));
			flightB.class = "business";
			flightB.cost = parseInt(flightB.cost) + 300;
			flights.push(flightB);

		}

		dep_date = dep_date.add('1', 'd');
		dep_dateTime = dep_dateTime.add('1', 'd');
	}

	/* seeding the countries table */
	var countries = JSON.parse(fs.readFileSync('data/countries.json', 'utf8'));

	/* seeding the airports table */
	var airports = JSON.parse(fs.readFileSync('data/airports.json', 'utf8'));

	/* seeding the promotion codes table */
	var promotionCodes = [];
	for (var i = 0; i < 100; i++) {
		var promoCode = generatePromo();

		promotionCodes.push(promoCode);
	}

	var database = db.getDatabase();

	//clearing the database
	db.clear(function(){
		//seeding the database
		database.collection('airCrafts').insert(airCrafts, function(err, docs) {
			if(err){
				callback(err,false);
			}
			else{
				database.collection('flights').insert(flights, function(err, docs) {
					if(err){
						callback(err,false);
					}
					else{
						database.collection('countries').insert(countries, function(err, docs) {
							if(err){
								callback(err,false);
							}
							else{
								database.collection('airports').insert(airports, function(err, docs) {
									if(err){
										callback(err,false);
									}
									else{
										database.collection('promotionCodes').insert(promotionCodes, function(err, docs) {
											if(err){
												callback(err,false);
											}
											else{
												callback(null,true);
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	});
};

//updating a reservation of a given booking reference with given new information
var updateReservation = function (bookRef, newInfo, callback){

	db.getDatabase().collection('reservations').find({booking_ref_number : bookRef}).toArray(function (err,record) {
		if(err) throw err;

		var adults = record[0].adults;
		var children = record[0].children;
		var infants = record[0].infants;

		var newAdults = newInfo.adults;
		var newChildren = newInfo.children;
		var newInfants = newInfo.infants;

		var finalAdults = [];
		var finalChildren = [];
		var finalInfants = [];

		for (var i=0; i<adults.length; i++) {
			var passport_number = adults[i].passport_number;
			var issue_date = adults[i].issue_date;
			var expiry_date = adults[i].expiry_date;

			newAdults[i].passport_number = passport_number;
			newAdults[i].issue_date = issue_date;
			newAdults[i].expiry_date = expiry_date;

			finalAdults.push(newAdults[i]);

		}

		if(adults.length === 0)
		finalAdults = adults;

		db.getDatabase().collection('reservations').updateOne(
			{booking_ref_number: bookRef},
			{ $set:
				{
					adults: finalAdults
				}
			},
			function(err, results) {

			}
		);

		for (var i=0; i<children.length; i++) {
			var passport_number = children[i].passport_number;
			var issue_date = children[i].issue_date;
			var expiry_date = children[i].expiry_date;

			newChildren[i].passport_number = passport_number;
			newChildren[i].issue_date = issue_date;
			newChildren[i].expiry_date = expiry_date;
			finalChildren.push(newChildren[i]);

		}

		if(children.length === 0){
			finalChildren = children;
		}

		db.getDatabase().collection('reservations').updateOne(
			{booking_ref_number: bookRef},
			{ $set:
				{
					children: finalChildren
				}
			},
			function(err, results) {

			}
		);



		for (var i=0; i<infants.length; i++) {
			var passport_number = infants[i].passport_number;
			var issue_date = infants[i].issue_date;
			var expiry = infants[i].expiry;

			newInfants[i].passport_number = passport_number;
			newInfants[i].issue_date = issue_date;
			newInfants[i].expiry = expiry_date;

			finalInfants.push(newInfants[i]);

		}

		if (infants.length === 0){
			finalInfants=infants;
		}

		db.getDatabase().collection('reservations').updateOne(
			{booking_ref_number: bookRef},
			{ $set:
				{
					infants: finalInfants
				}
			},
			function(err, results) {

			}
		);
		callback();

	}
);
};

//deleting/cancelling a reservation of a given booking reference
var cancelReservation = function (bookRef, callback) {
	db.getDatabase().collection('reservations').find({booking_ref_number : bookRef}).toArray(function (err,record){
		if(err) throw err;

		record = record[0];

		var totalSeats = record.total_seats;

		db.getDatabase().collection('reservations').remove({'booking_ref_number' : bookRef }, 1, function(err, result) {
			record.dep_flight._id = new mongo.ObjectID(record.dep_flight._id);
			db.getDatabase().collection('flights').updateOne(
				{ _id: record.dep_flight._id },
				{ $inc: { remaining_seats: totalSeats, nextFreeSeat: -totalSeats} },
				function(err, result) {
					if(!record.ret_flight){
						callback();
					}
					else{
						record.ret_flight._id = new mongo.ObjectID(record.ret_flight._id);
						db.getDatabase().collection('flights').updateOne(
							{ _id: record.ret_flight._id },
							{ $inc: { remaining_seats: totalSeats, nextFreeSeat: -totalSeats} },
							function(err, result) {
								callback();
							});
						}
					});
				});
			});
		};

		/**
		* This function searchs for one way trip flights.
		*
		* @param {JSONObject} search constraints, {Function} callback function that is called after the search is complete.
		* @returns {JSONObject}
		*/
		var getOneWayFlights = function(oneway, callback){
			var flights = [] ;

			db.getDatabase().collection('flights').find(oneway).toArray(function(err,data){
				if(err){
					callback(err) ;
				}
				else {
					for( i=0; i<data.length ;i++){
						var currFlight = data[i];
						var aircraft = currFlight.aircraft;
						var aircraftType = aircraft.aircraftType;
						var aircraftModel = aircraft.aircraftModel ;

						var flight =	{
							"flightId": currFlight._id,
							"flightNumber": currFlight.flightNumber,
							"aircraftType":  aircraftType,
							"aircraftModel": aircraftModel,
							"departureDateTime": currFlight.departureDateTime,
							"arrivalDateTime": currFlight.arrivalDateTime,
							"origin": currFlight.origin,
							"destination": currFlight.destination,
							"cost": currFlight.cost,
							"currency": currFlight.currency,
							"class": currFlight.class,
							"Airline": currFlight.Airline
						};
						flights.push(flight) ;
					}

					callback(null,flights) ;
				}
			});
		};

		/**
		* This function adds a reservation to the database and generates a unique booking reference.
		*
		* @param {JSONObject} reservation, {Function} callback function that is called after the insertion is complete.
		*/
		var reserveHelp = function(reserve_info, callback){
			var code = "";
			var totalSeats = parseInt(reserve_info.total_seats);

			for (var i = 0; i < 15; i++) {
				if(randomBoolean()){
					//Capital Letter
					var letter = String.fromCharCode(65 + (Math.floor(Math.random() * 26)));
					code += letter;
				}
				else{
					//number
					var number = Math.floor(Math.random() * 10);
					code += number;
				}
			}

			try{
				addFlights(reserve_info, function(){
					db.getDatabase().collection('reservations').count({"booking_ref_number": code}, function(err, count) {
						if(count === 0){
							reserve_info.booking_ref_number = code;
							seatMapDep = reserve_info.dep_flight.seatmap;
							seatMapDep = updateSeats(reserve_info.dep_flight.seatmap, reserve_info.dep_flight.nextFreeSeat, totalSeats, reserve_info, true);
							delete reserve_info.dep_flight.seatmap;
							seatMapRet = null;
							if(reserve_info.ret_flight){
								seatMapRet = reserve_info.ret_flight.seatmap;
								seatMapRet = updateSeats(reserve_info.ret_flight.seatmap, reserve_info.ret_flight.nextFreeSeat, totalSeats, reserve_info, false);
								delete reserve_info.ret_flight.seatmap;
							}
							db.getDatabase().collection('reservations').insert(reserve_info, function(err, docs) {
								if(err){
									callback(err, null);
								}
								else{
									reserve_info.dep_flight._id = new mongo.ObjectID(reserve_info.dep_flight._id);
									db.getDatabase().collection('flights').updateOne(
										{ _id: reserve_info.dep_flight._id },
										{ $inc: { remaining_seats: -totalSeats, nextFreeSeat: totalSeats} ,
										$set:	{	seatmap: seatMapDep	}
									},
									function(err, docs) {
										if(err){
											callback(err, null);
										}
										else{
											if(!reserve_info.ret_flight){
												callback(null, code);
											}
											else{
												reserve_info.ret_flight._id = new mongo.ObjectID(reserve_info.ret_flight._id);
												db.getDatabase().collection('flights').updateOne(
													{ _id: reserve_info.ret_flight._id },
													{ $inc: { remaining_seats: -totalSeats, nextFreeSeat: totalSeats} ,
													$set:	{	seatmap: seatMapRet	}
												},
												function(err, docs) {
													if(err){
														callback(err, null);
													}
													else{
														callback(null, code);
													}
												});
											}
										}
									});
								}
							});
						}
						else{
							reserve(reserve_info, callback);
						}
					});
				});
			}
			catch(err) {
				callback(err, null);
			}
		};

				/**
				* This function adds the flights to the reservation
				*
				* @param {JSONObject} the reservation, {Function} callback function
				*/
				var addFlights = function(reservation, callback) {
					reservation.dep_flight._id = new mongo.ObjectID(reservation.dep_flight._id);
					db.getDatabase().collection('flights').find({_id: reservation.dep_flight._id}).toArray(function(err, data) {
						reservation.dep_flight = data[0];
						if(reservation.ret_flight){
							reservation.ret_flight._id = new mongo.ObjectID(reservation.ret_flight._id);
							db.getDatabase().collection('flights').find({_id: reservation.ret_flight._id}).toArray(function(err, data) {
								reservation.ret_flight = data[0];
								callback();
							});
						}
						else{
							callback();
						}
					});
				};

				/**
				 * This function updates the seatmap according to the reservation
				 *
				 * @param {Object} seatmap, {Integer} nextFreeSeat, {Integer} total seats, {Object} reservation, {Boolean} oneway
				 * @returns {Object}
				 */
				 var updateSeats = function(seatmap, nextFreeSeat, totalSeats, reserve_info, oneWay) {
					 var reservation = JSON.parse(JSON.stringify(reserve_info));
					 delete reservation.dep_flight;
					 delete reservation.ret_flight;
					 var seats = [];
					 for (var i = 0; i < totalSeats; i++) {
					 	seats.push(seatmap[i + nextFreeSeat].seatNumber);
					 }
					 for (var i = 0; i < totalSeats; i++) {
					 	seatmap[i + nextFreeSeat].taken = true;
						seatmap[i + nextFreeSeat].reservation = reservation;
					 }

					 if(oneWay){
						 reserve_info.seatsDep = seats;
					 }
					 else{
						 reserve_info.seatsRet = seats;
					 }

					 return seatmap;
				 };

				/**
				* This function adds a feedback to the database.
				*
				* @param {JSONObject} feedback, {Function} callback function that is called after the insertion is complete.
				*/
				var addFeedback = function (feed, callback){
					db.getDatabase().collection('feedbacks').insert(feed, function(err, docs) {
						if (err){
							callback(err , null);
						}else{
							callback(null,docs);
						}
					});
				};

				/**
				* This function make http request
				* @param {onResult} callback function that is called after the requesting is complete.
				*/
				var makeOnlineRequest =  function(options, body, onResult)
				{
					var req = http.request(options, function(res)
					{

						var output = '';
						res.setEncoding('utf8');

						res.on('data', function (chunk) {

							output += chunk;

						});

						res.on('end', function() {
							var obj = output;
							console.log('done');
							onResult(200, obj);
						});
					});

					req.on('socket', function (socket) {
						socket.setTimeout(5000);
						socket.on('timeout', function() {
							console.log('timeout');
							req.destroy();
						});
					});

					req.on('error', function(err) {
						console.log('error');
						req.destroy();
						onResult(400, null);
					});

					if(options.method === 'POST'){
						req.write(JSON.stringify(body));
					}
					req.end();
				};

				/**
				* This function search for flights in airlines.json One way.
				*
				* @param {Function} callback function that is called after the searching is complete.
				*/
				var airlines = JSON.parse(fs.readFileSync('data/airlines.json', 'utf8'));
				flightsOne = {
					outgoingFlights: []
				};
				var getOtherFlightsOneWay = function(oneway, i, callback){
					console.log(i);
					if(i === airlines.length){
						callback(null,flightsOne);
						return;
					}

					var currAirLine = airlines[i];

					console.log(currAirLine.airline);
					var ip = currAirLine.IP;

					console.log('searcing for flights in: ' + ip + '/api/flights/search/'+oneway.origin+'/'+oneway.destination+'/'+oneway.departureDateTime+'/'+oneway.class+'/'+oneway.numberOfSeats+'/?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaXIgTWFkYWdhc2NhciIsImlhdCI6MTQ2MDk1MDc2NywiZXhwIjoxNDkyNDg2NzcyLCJhdWQiOiI1NC4xOTEuMjAyLjE3Iiwic3ViIjoiQWlyLU1hZGFnYXNjYXIifQ.E_tVFheiXJwRLLyAIsp1yoKcdvb8_xCfhjODqG2QkBI');

					var options = {
						host: ip ,
						path: '/api/flights/search/'+oneway.origin+'/'+oneway.destination+'/'+oneway.departureDateTime+'/'+oneway.class+'/'+oneway.numberOfSeats+'/?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaXIgTWFkYWdhc2NhciIsImlhdCI6MTQ2MDk1MDc2NywiZXhwIjoxNDkyNDg2NzcyLCJhdWQiOiI1NC4xOTEuMjAyLjE3Iiwic3ViIjoiQWlyLU1hZGFnYXNjYXIifQ.E_tVFheiXJwRLLyAIsp1yoKcdvb8_xCfhjODqG2QkBI',
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					};

					makeOnlineRequest(options, {}, function(statusCode, result){
						try {
							console.log(result);
							var json = JSON.parse(result);

							flightsOne.outgoingFlights = concat(flightsOne.outgoingFlights, json.outgoingFlights, ip);
						}catch(err) {

						}
						finally{
							getOtherFlightsOneWay(oneway, (i + 1), callback);
						}
					});
				};

				/**
				* This function search for flights in airlines.json round trip.
				*
				* @param {Function} callback function that is called after the searching is complete.
				*/
				flightsRound = {
					outgoingFlights: [],
					returnFlights: []
				};
				var getOtherFlightsRound = function(constraints, i, callback){
					console.log(i);
					if(i === airlines.length){
						return callback(null,flightsRound);
					}

					var currAirLine = airlines[i];

					console.log(currAirLine.airline);
					var ip = currAirLine.IP;

					console.log('searcing for flights in: ' + ip + '/api/flights/search/'+constraints.origin+'/'+constraints.destination+'/'+constraints.departureDateTime+'/'+constraints.returnDate+'/'+constraints.class+'/'+constraints.numberOfSeats+'/?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaXIgTWFkYWdhc2NhciIsImlhdCI6MTQ2MDk1MDc2NywiZXhwIjoxNDkyNDg2NzcyLCJhdWQiOiI1NC4xOTEuMjAyLjE3Iiwic3ViIjoiQWlyLU1hZGFnYXNjYXIifQ.E_tVFheiXJwRLLyAIsp1yoKcdvb8_xCfhjODqG2QkBI');

					var options = {
						host: ip ,
						path: '/api/flights/search/'+constraints.origin+'/'+constraints.destination+'/'+constraints.departureDateTime+'/'+constraints.returnDate+'/'+constraints.class+'/'+constraints.numberOfSeats+'/?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaXIgTWFkYWdhc2NhciIsImlhdCI6MTQ2MDk1MDc2NywiZXhwIjoxNDkyNDg2NzcyLCJhdWQiOiI1NC4xOTEuMjAyLjE3Iiwic3ViIjoiQWlyLU1hZGFnYXNjYXIifQ.E_tVFheiXJwRLLyAIsp1yoKcdvb8_xCfhjODqG2QkBI',
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					};

					makeOnlineRequest(options, {}, function(statusCode, result){
						try {
							var json = JSON.parse(result);

							flightsRound.outgoingFlights = concat(flightsRound.outgoingFlights, json.outgoingFlights, ip);
							flightsRound.returnFlights = concat(flightsRound.returnFlights, json.returnFlights, ip);
						}catch(err) {

						}
						finally{
							getOtherFlightsRound(constraints, (i + 1), callback);
						}
					});
				};

				var concat = function(x, y, ip) {
					for (var i = 0; i < y.length; i++) {
						y[i].IP = ip;
						x.push(y[i]);
					}

					return x;
				};

				/**
				* This function calculates the age from a given birthDate
				*
				* @param {String} birthDate
				* @returns {Integer}
				*/
				var getAge = function(dateString){
					var today = new Date();
					var birthDate = new Date(new moment(parseInt(dateString)).format('YYYY-MM-DD'));
					var age = today.getFullYear() - birthDate.getFullYear();
					var m = today.getMonth() - birthDate.getMonth();
					if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
					{
						age--;
					}
					return age;
				};

				/**
				* This function charges a credit card with a specific amount
				*
				* @param {Token} paymentToken, {Integer} cost, {Function} callback function that is called once the payment is done
				* @returns
				*/
				var charge  = function (token, cost, callback) {
					callback(null); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
					// cost *= 100;
					// stripe.charges.create({
					// 	amount: cost,
					// 	currency: "usd",
					// 	source: token,
					// }, function(err, data) {
					// 	if(err){
					// 		console.log(err);
					// 		callback('error');
					// 	}
					// 	else{
					// 		callback(null);
					// 	}
					// });
				};


				/**
				* This function books a flight in the database
				*
				* @param {JSONObject} reservation info, {Function} callback function that is called when the reservation is done.
				*/
				var reserveLocal  = function(reservation, callback) {
					charge(reservation.paymentTokenDep, reservation.cost, function(err) {
						if(err){
							callback({
								"refNum": null,
								"errorMessage": 'An error occurred while trying to charge the given credit card'
							});
						}
						else{
							delete reservation.paymentTokenDep;

							reserveHelp(reservation, function(err, code) {
								if(err){
									callback({
										"refNum": null,
										"errorMessage": 'An error occurred while trying to book the flight'
									});
								}
								else{
									callback({
										"refNum": code,
										"errorMessage": null
									});
								}
							});
						}
					});
				};

				var reserve = function (ip, out, reservation, isReturn,  callback){
					if(ip === "54.191.202.17"){
						delete reservation.dep_price;
						delete reservation.ret_price;
						reservation.cost = out.cost;

						if(isReturn){
							reservation.paymentTokenDep = reservation.paymentTokenRet;
							delete reservation.paymentTokenRet;
							reservation.dep_flight = reservation.ret_flight;
							delete reservation.ret_flight;
						}

						reserveLocal(reservation, function(object) {
							callback(object);
						});
					}
					else{
						var options = {
							host: ip,
							path: '/booking/?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaXIgTWFkYWdhc2NhciIsImlhdCI6MTQ2MDk1MDc2NywiZXhwIjoxNDkyNDg2NzcyLCJhdWQiOiI1NC4xOTEuMjAyLjE3Iiwic3ViIjoiQWlyLU1hZGFnYXNjYXIifQ.E_tVFheiXJwRLLyAIsp1yoKcdvb8_xCfhjODqG2QkBI',
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
						};


						makeOnlineRequest(options, out, function(statusCode, response) {
							try {
								var json = JSON.parse(response);
								console.log('response: ');
								console.log(json);
								callback(json);
							}catch(err) {
								callback({
									"refNum": null,
									"errorMessage": 'An error occurred while trying to book the flight'
								});
							}
						});

					}

				};

				module.exports = {
					getCountries: getCountries,
					getAirports: getAirports,
					randomBoolean: randomBoolean,
					chooseRandomElement: chooseRandomElement,
					generateFlightnumber: generateFlightnumber,
					seed: seed,
					addFeedback:addFeedback,
					getOneWayFlights:getOneWayFlights,
					reserve:reserve,
					generatePromo: generatePromo,
					getReservation: getReservation,
					updateReservation: updateReservation,
					cancelReservation: cancelReservation,
					getOtherFlightsOneWay :getOtherFlightsOneWay ,
					getOtherFlightsRound: getOtherFlightsRound,
					makeOnlineRequest : makeOnlineRequest,
					concat: concat,
					addFlights: addFlights,
					reserveHelp : reserveHelp ,
					reserveLocal : reserveLocal,
					getAge : getAge ,
					charge : charge
				};
