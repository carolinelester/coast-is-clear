
$(document).ready(function() {
  $(".menu-icon").on("click", function() {
        $("nav ul").toggleClass("showing");
        
  });


// Scrolling Effect


  // This is our API key
  var mapAPIKey = "AIzaSyCAgC_4Ah49trBRbFVc3emcuZ-vzz8yEcA";
  var wtrAPIKey = "cd080552-9bd7-11ea-b3e2-0242ac130002-cd080606-9bd7-11ea-b3e2-0242ac130002";

  // Here we are building the URL we need to query the database

  //var inputPlace;

  //Add variables for location, etc.
  //var WTRqueryURL = "https://api.stormglass.io/v2/tide/extremes/point";
  
  var latitude = 0;
  var longitude = 0;
  var params = "";
  var place = "";
  var start = "";
  var rain = 0;
  
  function search()  {

    //Clear Values
  $("#data").html("");
  $("#warning").html("");
  var placeScore = 0;
  

    //Scroll down
    event.preventDefault();
    autoScrollTo("weather");
    place = $("#place-input").val().trim();

  // Here we run our AJAX call to the Google Places API

  var MAPqueryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=beaches+in+" + place + "&key=" + mapAPIKey;

  $.ajax({
    url: MAPqueryURL,
    method: "GET",
  })
    // We store all of the retrieved data inside of an object called "response"
    .then( function(response) {
    

      // Log the queryURL
      console.log(MAPqueryURL);

      // Log the resulting object
      console.log(response);
    
      console.log(moment().format("YYYY-MM-DD HH:MM"))
      //1970-01-11 00:00
  
      start = moment().format("YYYY-MM-DD HH:MM")
      latitude = response.results[0].geometry.location.lat;
      longitude = response.results[0].geometry.location.lng;
      params = "waterTemperature,airTemperature,cloudCover,gust,precipitation"
      // Transfer content to HTML IMPORTANT

      var mapWidgetURL = "https://www.google.com/maps/embed/v1/streetview?key=" + mapAPIKey + "&location=" + latitude + "," + longitude + "&heading=210&pitch=10&fov=35"

      $("#mapwidget").attr("src", mapWidgetURL)
    
     console.log(latitude);
     console.log(longitude);

     
    fetch(`https://api.stormglass.io/v2/weather/point?start=${start}&lat=${latitude}&lng=${longitude}&params=${params}`, {
      headers: {
        'Authorization': wtrAPIKey
      }
    }).then((response) => response.json()).then((jsonData) => {
      // Do something with response data
      console.log(jsonData);
     
      var wTemp = Math.round(((jsonData.hours[0].waterTemperature.noaa) * 9/5) + 32);
      var aTemp = Math.round(((jsonData.hours[0].airTemperature.noaa) * 9/5) + 32);
      var cCover = jsonData.hours[0].cloudCover.noaa;
      var gst = Math.round((jsonData.hours[0].gust.noaa) * 2.237);

      var rawW = Math.abs((wTemp-80)/80);
      var wtrScore = (2.5 - (2.5 * rawW));

      var rawA = Math.abs((aTemp-88)/88);
      var airScore = (2.5 - (2.5 * rawA));

      var cldScore = (2.5 - (2.5*(cCover/100)));

      var gustScore = (2.5 - (2.5*(gst/30)));

      console.log("Water temperature is " + wTemp + " degrees Fahrenheit");
      console.log("Air temperature is " + aTemp + " degrees Fahrenheit");
      console.log(jsonData.hours[0].precipitation.noaa);
      rain = jsonData.hours[0].precipitation.noaa;

      console.log(wtrScore + " " + airScore + " " + cldScore + " " + gustScore);

      placeScore = (Math.round(wtrScore + airScore + cldScore + gustScore));

      console.log(placeScore);

      
      $("#data").append("The Water Temperature is " + wTemp + " degrees Fahrenheit.<br>")
      $("#data").append("The Air Temperature is " + aTemp + " degrees Fahrenheit.<br>")
      $("#data").append("The Cloud Coverage is " + cCover + "%.<br>")
      $("#data").append("The Wind Speed is " + gst + " mph.<br>")

      $("#temp").html(

        "<h1>We give this spot a rating of " + placeScore + "/10 right now!</h1>"

        );

        if (wTemp>=96) {
          $("#warning").append("The water temperature is a bit high for children and the elderly at " + wTemp + " degrees Fahrenheit!<br>")
        };
        if (wTemp<=64) {
          $("#warning").append("The water temperature is noticeably low at " + wTemp + " degrees Fahrenheit!<br>")
        };
        if (aTemp>=90) {
          $("#warning").append("The air temperature is noticeably high at " + aTemp + " degrees Fahrenheit!<br>")
        };
        if (aTemp<=78) {
          $("#warning").append("The air temperature is noticeably low at " + aTemp + " degrees Fahrenheit!<br>")
        };
        if (cCover>=50) {
          $("#warning").append("The cloud coverage is noticeably high at " + cCover + "%!<br>")
        };
        if (gustScore<=2) {
          $("#warning").append("It is quite windy at " + gst + " mph!<br>")
        };
        if (rain>0) {
          $("#data").append("The Precipitation Level is " + rain + " kg/m^2.<br>")
          $("#warning").append("Warning! There has been some rain today!<br>")
        };
      

    });
    });
    };

    $(function() {
    $("#inputBeach").click(search);
    });


    //Submit on Enter Key
    
    $("#input-form").submit(function() {
      search($("#place-input").get(0));
      return false;
  });

    

})





    


