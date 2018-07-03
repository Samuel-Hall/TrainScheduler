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

    // Creating nextArrival and minutesUntil as global variables to be used in .on("child_added") and in a separate interval function
    var nextArrival;
    var minutesUntil;
    var trainName;
    var destination;
    var firstTime;
    var frequency;
    var currentTime;
    var currentDate;
    var nextFormatted;
    var duration;
    

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

    function calculateTime() {
        // Format the current date and time together
        nextFormatted = moment.utc(currentDate + ' ' + nextArrival).format("MM/DD/YYYY HH:mm");

        // moment.duration of the formatted next arrival and its difference with the current moment in time.
        // Calculate the difference between now and next arrival
        duration = moment.duration(moment(nextFormatted).diff(moment()));

        // Round down
        minutesUntil = Math.floor(duration.asMinutes());
    }

    function appendTable() {
        // Append to the table
        $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesUntil + "</td></tr>");
    }

    // When the database is updated, add a new row containing the user input data to the table
    database.ref().on("child_added", function(snapshot) {
        // Get data from DB
        trainName = snapshot.val().name;
        destination = snapshot.val().destination;
        firstTime = snapshot.val().time;
        frequency = snapshot.val().frequency;

        // Calculate next arrival THIS WORKS AND RETURNS 17:25
        nextArrival = moment(firstTime, 'HH:mm').add(frequency, 'm').format("HH:mm");

        // Get current time THIS WORKS AS WELL
        currentTime = moment().format('HH:mm');
        currentDate = moment().format('MM/DD/YYYY');

        calculateTime();
        appendTable();
    });

    // // Update the minutesUntil and nextArrival time every minute
    // setTimeout(function() {
    //     calculateTime()
    //     if (minutesUntil <= 0) {
    //         nextArrival = moment(nextArrival, 'HH:mm').add(frequency, 'm').format("HH:mm");
    //         var table = $("#trainTable").html();
    //         $("#trainTable").html(table);
    //     }
    // }, 3000);

});

// var mins = moment.utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss"))).format("mm")
