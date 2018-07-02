$(document).ready(function() {

    // Get Firebase config
    var config = {
        apiKey: "AIzaSyCUI7jJH6C7MxwFWKNjq4zyIwXSn7b5qdM",
        authDomain: "fir-database-43395.firebaseapp.com",
        databaseURL: "https://fir-database-43395.firebaseio.com",
        projectId: "fir-database-43395",
        storageBucket: "fir-database-43395.appspot.com",
        messagingSenderId: "772992625438"
    };
    // Initialize Firebase
    firebase.initializeApp(config);
    // Create database reference
    var database = firebase.database();

    // Create event listener for addTrain button
    $("#addTrain").on("click", function(event) {
        // Prevent Default submission and page refresh
        event.preventDefault();
        // Get new train data from user
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTime = $("#firstTime").val().trim();
        var frequency = $("#frequency").val().trim();
        // Create train object and push to the database
        var newTrain = {
            name: trainName,
            destination: destination,
            time: firstTime,
            frequency: frequency
        };
        database.ref().push(newTrain);
        // Clear the text fields
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTime").val("");
        $("#frequency").val("");
    });

    // When the database is updated, add a new row containing the user input data to the table
    database.ref().on("child_added", function(snapshot) {
        // Get data from DB
        var trainName = snapshot.val().name;
        var destination = snapshot.val().destination;
        var firstTime = snapshot.val().time;
        var frequency = snapshot.val().frequency;

        console.log("firstTime = " + firstTime);

        console.log("frequency = " + frequency);

        // Calculate next arrival THIS WORKS AND RETURNS 17:25
        var nextArrival = moment(firstTime, 'HH:mm').add(frequency, 'm').format("HH:mm");
        console.log("nextArrival = " + nextArrival);


        // Get current time THIS WORKS AS WELL
        var currentTime = moment().format('HH:mm');
        var currentDate = moment().format('MM/DD/YYYY');
        console.log(currentDate);
        var nextFormatted = moment.utc(currentDate + ' ' + nextArrival).format("MM/DD/YYYY HH:mm");
        console.log("nextFormatted = " + nextFormatted);

        var something = moment.duration(moment(nextFormatted).diff(moment()));
        console.log("something = " + something);
        console.log("something as minutes = " + something.asMinutes());
        var minutesUntil = Math.floor(something.asMinutes());
    
        // Append to the table
        $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesUntil + "</td></tr>");
    });
});

// var mins = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("mm")