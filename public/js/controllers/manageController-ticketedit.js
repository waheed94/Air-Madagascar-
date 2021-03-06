App.controller('manageController-ticketedit', function($scope, ManageSrv, FlightsSrv, $location) {
   var reservationData = ManageSrv.getReservationData();

   $scope.adults = reservationData.adults;
   $scope.children = reservationData.children;
   $scope.infants = reservationData.infants;

   $scope.adultFormData = [];
   $scope.childFormData = [];
   $scope.infantFormData = [];

   /*
   Angular Bootstrap Datepicker.
   */
   $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
   $scope.format = $scope.formats[0];
   $scope.altInputFormats = ['M!/d!/yyyy'];

   /* Get All The Countries With Their Country Codes */
   function Countries() {
      FlightsSrv.getCountries().success(function(countries) {
         $scope.Countries = countries;
      });
   };

   Countries();

   /* By Default all the formData arrays should contain the old data */
   for(i = 0; i < $scope.adults.length; i++) {
      var currentAdult = $scope.adults[i];
      // console.log(currentAdult);

      var json = {};
      json.first_name = currentAdult.first_name;
      json.last_name = currentAdult.last_name;
      json.nationality = currentAdult.nationality;
      json.birth_date = currentAdult.birth_date;
      json.email = currentAdult.email;
      json.phone_number = currentAdult.phone_number;
      json.em_email = currentAdult.em_email;
      json.em_phone_number = currentAdult.em_phone_number;
      json.passport_number = currentAdult.passport_number;

      $scope.adultFormData[i] = json;
   }

   for(i = 0; i < $scope.children.length; i++) {
      var currentChild = $scope.children[i];
      var json = {};
      json.first_name = currentChild.first_name;
      json.last_name = currentChild.last_name;
      json.nationality = currentChild.nationality;
      json.birth_date = currentChild.birth_date;

      $scope.childFormData[i] = json;
   }

   for(i = 0; i < $scope.infants.length; i++) {
      var currentInfant = $scope.infants[i];
      var json = {};
      json.first_name = currentInfant.first_name;
      json.last_name = currentInfant.last_name;
      json.nationality = currentInfant.nationality;
      json.birth_date = currentInfant.birth_date;

      $scope.infantFormData[i] = json;
   }


   $scope.save = function() {
      reservationData.adults = $scope.adultFormData;
      reservationData.children = $scope.childFormData;
      reservationData.infants = $scope.infantFormData;

      ManageSrv.setReservationData(reservationData);

      ManageSrv.editReservation(reservationData).success(function() {
         swal({
            title: "Edited!",
            text: "Your reservation has been updated.",
            type: "success"
         });

         $location.url('/manage/ticketinfo');
      });
   };

   $scope.goBack = function() {
      $location.url('/manage/ticketinfo');
   }
});
