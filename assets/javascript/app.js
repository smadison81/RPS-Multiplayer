$(document).ready(function () {


    var firebaseConfig = {
        apiKey: "AIzaSyBGM3ttQ19ef3XbKXFrvQXTWnYjzpfo0h4",
        authDomain: "rock-paper-scissors-2aaef.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-2aaef.firebaseio.com",
        projectId: "rock-paper-scissors-2aaef",
        storageBucket: "",
        messagingSenderId: "634583802795",
        appId: "1:634583802795:web:b1d78946c4613657"
    };
    // Initialize Firebase
    var app = firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    var connectionsRef = database.ref("/connections");

    var connectedRef = database.ref(".info/connected");

    var con;

    var player = {
        number: '0',
        name: '',
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ''
    };
    var opponent = {
        number: '0',
        name: '',
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ''
    };



    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);

            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    connectionsRef.on("value", function (snapshot) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        console.log("numbers of people connected are:" + snapshot.numChildren());

    })


    connectionsRef.once('value', function (snapshot) {
        if (Object.keys(snapshot.val()).indexOf('1') === -1) {
            player.number = '1';
            opponent.number = '2';
        } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
            player.number = '2';
            opponent.number = '1';
        }

        if (player.number !== '0') {

            con = connectionsRef.child(player.number);
            connectionsRef.set(player);

            con.onDisconnect().remove();

        } else {
            app.delete();
        }
        console.log("You are Player " + player.number)
        console.log("You are Opponent " + opponent.number)
    });


    if (player.number === 1) {

        $("#player-score").text(player.wins);
        $("#opponent-score").text(opponent.wins);
        playerOneGame();
    }

    else if (player.number === 2) {
        $("button").attr("id", "opponent-button");
        playerTwoGame();

    }











    function gameSetup() {


    }


    function playerOneGame() {
        $('.player-button').on('click', function () {
            if ($("#player-input") === "rock" && $("#opponent-input") === "scissors") {
                console.log("You Wins");
            } else if ($("#player-input") === "paper" && $("#opponent-input") === "rock") {
                alert("Player 1 Wins");
            } else if ($("#player-input") === "scissors" && $("#opponent-input") === "paper") {
                alert("Player 1 Wins");

            } else if ($("#player-input") === $("#opponent-input")) {
                alert("It's a Tie");
            } else {
                alert("Opponent Wins")
            }
        })
    };
    function playerTwoGame() {
        $('.player-button').on('click', function () {
            if ($("#player-input") === "rock" && $("#opponent-input") === "scissors") {
                console.log("You Wins");
            } else if ($("#player-input") === "paper" && $("#opponent-input") === "rock") {
                alert("Player 1 Wins");
            } else if ($("#player-input") === "scissors" && $("#opponent-input") === "paper") {
                alert("Player 1 Wins");

            } else if ($("#player-input") === $("#opponent-input")) {
                alert("It's a Tie");
            } else {
                alert("Opponent Wins")
            }
        })




})