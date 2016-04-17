App.controller('bookController-personalinformation', function($scope, PersonalSrv, $location) {
	/*
      Angular Bootstrap Datepicker.
    */
   $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
   $scope.format = $scope.formats[0];
   $scope.altInputFormats = ['M!/d!/yyyy'];

   $scope.open1 = function() {
      $scope.popup1.opened = true;
   };

   $scope.popup1 = {
      opened: false
   };

	$scope.open2 = function() {
      $scope.popup2.opened = true;
   };

   $scope.popup2 = {
      opened: false
   };

	$scope.open3 = function() {
      $scope.popup3.opened = true;
   };

   $scope.popup3 = {
      opened: false
   };




   // $scope.next = function() {
   //    /* personal Infromation*/
   //    personalSrv.setFirstName($scope.first_name);
   //    personalSrv.setLastName($scope.last_name);
   //    personalSrv.setTitle($scope.title)
   //    personalSrv.setNationality($scope.nationality);
   //    personalSrv.setBirthDate($scope.birth_date);
   //    personalSrv.setPassportNumber($scope.passport_number);

   //    /*Contact information */
   //    personalSrv.setPersonalEmail($scope.personal_email);
   //    personalSrv.setPersonalMobile($scope.personal_Mobile);

   //    /*Emergency contact information*/
   //    personalSrv.setPersonalEmail($scope.emergency_email);
   //    personalSrv.setPersonalMobile($scope.emergency_Mobile);

   //    /*Special requirements */
   //    personalSrv.setMealPreference($scope.meal_preference);
   //    personalSrv.setSpecialNeeds($scope.special_needs);

   //  };

 //   $http.get('/api/countries').success(function (res){
	// 	$scope.countries = res;
	// });


   $scope.adults = 2; // should get it from the service.
   var children = 1; // should get it from the service.
   var infants = 1; // should get it from the service.

   $scope.numAdults = function(){
        return new Array($scope.adults);
   };
   $scope.numChildren = function(){
        return new Array(children);
   };
   $scope.numInfants = function(){
        return new Array(infants);
   };

   /*
   Validations
   */
   $scope.submitted = false;
   // function to submit the form after all validation has occurred
   $scope.submitForm = function(isValid) {
      $scope.submitted = true;

      // check to make sure the form is completely valid
      if (isValid) {
         console.log('good');
         // /* personal Infromation*/
         // personalSrv.setFirstName($scope.first_name);
         // personalSrv.setLastName($scope.last_name);
         // personalSrv.setTitle($scope.title)
         // personalSrv.setNationality($scope.nationality);
         // personalSrv.setBirthDate($scope.birth_date);
         // personalSrv.setPassportNumber($scope.passport_number);
         //
         // /*Contact information */
         // personalSrv.setPersonalEmail($scope.email);
         // personalSrv.setPersonalMobile($scope.phone_number);
         //
         // /*Emergency contact information*/
         // personalSrv.setEmergencyEmail($scope.em_email);
         // personalSrv.setEmergencyMobile($scope.em_phone_number);
         //
         // /*Special requirements */
         // personalSrv.setMealPreference($scope.meal_preference);
         // personalSrv.setSpecialNeeds($scope.special_needs);


         $location.url('/book/payment');
      }
      else {
         console.log('bad');
      }

   };

});
