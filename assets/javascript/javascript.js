var config = {
    apiKey: "AIzaSyC_iCNRw1-_EefEtmgoyiHN5XdB3UGisvA",
    authDomain: "brew-database-97a1f.firebaseapp.com",
    databaseURL: "https://brew-database-97a1f.firebaseio.com",
    storageBucket: "brew-database-97a1f.appspot.com",
  };


// make sure they are connecting
firebase.initializeApp(config);

var database = firebase.database();

// hiding card until needed
$('.selected-card').hide();

$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 2, // Creates a dropdown of 15 years to control year,
    format: 'yyyy-mm-dd',
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: true // Close upon selecting a date,
});

//var genreChange = false;

//-----------------------------------------------------------

// $("#submit-btn").on("click", function(event){
function onSubmit(e){

  // this prevents the page from reloading
  e.preventDefault();
  $('.concert-btn').empty();

  // constructing a queryURL variable we will use instead of the literal string inside of the ajax method
  var startDates = $("#startDate").val();
  var endDates = $("#endDate").val();
  var time = "T00:00:00Z";
  var title = "Ticket Master";
  var genre = $("#genre").val();
  var startDate = startDates.concat(time);
  var endDate = endDates.concat(time);
  var size = 20;
  var apiKey="qq8XdJrLt8geS8g2CUjbY9sqKk8crlQw";
  var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&city=Chicago&classificationName=music&classificationName="+genre+"&startDateTime="+startDate+"&endDateTime="+endDate+"&size="+size+"&apikey="+apiKey;

  // var myShows = {
  //   "shows": []
  // };

  //"https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&city=Chicago&endDateTime=2017-10-28T00:00:00Z&startDateTime=2017-10-23T00:00:00Z&classificationId=KZFzniwnSyZfZ7v7nJ&classificationName=pop&size=31&apikey="+ apiKey;
  //"https://app.ticketmaster.com/classification/v2/Id=KZFzniwnSyZfZ7v7nJ&apikey"+apiKey;
  // "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&city=Chicago&keyword=katy perry&apikey="+ apiKey;
  //"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=chicago&apikey="+apiKey;


    //the ajax call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response);
        if (response.page.totalElements > 0){

        var events = response._embedded.events;
        myShows = {

          "shows": []
      };

      for(var i=0;i<events.length;i++){
        var aShow ={
          "name": events[i].name,
          "date": events[i].dates.start.localDate,
          "venue": events[i]._embedded.venues[0].name,
          "photoURL": events[i].images[0].url,
          "ticketURL": events[i].url
          //"latitude": events[i]._embedded.venues[0].location.latitude,
          //"longitude": events[i]._embedded.venues[0].location.longitude
        } ;

        myShows.shows.push(aShow);
        
        var myButton = $("<button class='api-btn'>" + events[i].name + "</button>");
        
        //adding attribute to show as a string
        myButton.attr("data-show", i);

        //adding all info for buttons to the div we set
        $('.concert-btn').append(myButton);

        // create a click function for the results of the api
        myButton.click(function() {

          // grabs the index of show
          var showIndex = $(this).attr('data-show');

          // calling function that changes 'src'
          changeSrc(myShows.shows[showIndex].venue);

          // calling function that pupulates card
          makeCard(myShows.shows[showIndex].name, 
            myShows.shows[showIndex].photoURL, 
            myShows.shows[showIndex].venue, 
            myShows.shows[showIndex].date,
            myShows.shows[showIndex].ticketURL
            );

            $(".selected-card").show();

            $(".btn-floating").on("click", function(){
              var thisShow = myShows.shows[showIndex]
              
              database.ref().push(thisShow);

              $(".btn-floating").html('<i class="material-icons">star</i></a>');
            })
        });
      }
    }
    else{
     $(".error-msg").text("Your search came up empty. Try another date range or genre.");
    }

    });
  

};  



//-----------------------------------------------------------

// this will store the info to firebase
database.ref().on("child_added", function(snapshot) {

    // $("#fave-area").append(snapshot.val().name);
    // $("#fave-area").append(snapshot.val().venue);
    // $("#fave-area").append(snapshot.val().date);
// 
    var bandName = snapshot.val().name;
var bandVenue = snapshot.val().venue;
var bandDate = snapshot.val().date;

$("#band-table> tbody").prepend("<tr><td>" + bandName + "</td><td>" + bandVenue + "</td><td>" + bandDate + "</td><td>");

});



//-----------------------------------------------------------

// this function populates the info on the card

function makeCard(myCard, myCard2, myCard3, myCard4, myCard5) {
  
  var myText = myCard;

  $("#card-p").text(myText);
  $("#card-img").attr('src', myCard2);
  $("#card-v").text(myCard3);
  $("#card-t").text(myCard4);
  $("#card-url").attr("href", myCard5);
  
}

//this will be the function that changes the src in the map
function changeSrc(myobj) {

    // we grab what the api specifies
    var userLocation = myobj;

    //once submit gets clicked we change the path of the iframe to what the user has typed
    $("#myFrame").attr('src', "https://www.google.com/maps/embed/v1/search?q=" + userLocation + "&key=AIzaSyB7ydrZE1U4_y3TjyeaO2aVyfWzxUnxKuk");
}

//-----------------------------------------------------------

// when the document loads this happens...
$(document).ready(function() {
 // materialize jquery for selection boxes
  $('select').material_select();
  $("#submit-btn").on("click", function(event){
    onSubmit(event);
  });

});