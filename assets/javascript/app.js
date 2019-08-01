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
        wins: 0,
        losses: 0,
        choice: ''
    };
    var opponent = {
        number: '0',
        wins: 0,
        losses: 0,
        choice: ''
    };

    const options = ["paper", "rock", "scissors"];

    $("#player-button").on("click", function (event) {
        event.preventDefault();
        player.choice = $("#player-input").val();

        if (options.indexOf(player.choice) > -1) {

            opponent.choice = player.choice;
            console.log(`Player ${player.number} Selected ${player.choice}`)
            console.log(`Opponent ${opponent.number} Selected ${opponent.choice}`)
            con.update({
                choice: player.choice
            });

        } else {

            $("#playerStatus").text("Invalid Choice")
        }


    })



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
            console.log("You are Player " + player.number)
            console.log("You are Opponent " + opponent.number)
        } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
            player.number = '2';
            opponent.number = '1';
            console.log("You are Player " + player.number)
            console.log("You are Opponent " + opponent.number)
        }

        // If you got a player number, you're 1 or 2.
        if (player.number !== '0') {
            // Make a connection to Firebase and send your info.
            con = connectionsRef.child(player.number);
            con.set(player);

            // When I disconnect, remove this device.
            con.onDisconnect().remove();

            // If 1 and 2 were taken, your number is still 0.
        } else {

            $("#player-form").hide();
            $("#gameStatus").text("Spectator").css("color", "red");


            app.delete();
        }
    });

    connectionsRef.on('value', function (snapshot) {

        if (con) {

            if (Object.keys(snapshot.val()).indexOf(opponent.number) !== -1) {
                opponent = snapshot.val()[opponent.number];
                player = snapshot.val()[player.number];


                playGame()

            }
        }
    })

  


    function playGame() {
        if (options.indexOf(player.choice) > -1 && options.indexOf(opponent.choice) > -1) {
            if (player.choice === "rock" && opponent.choice === "scissors") {
                alert("You Win");
                player.wins++;
                opponent.losses++;
            } else if ($("#player-input") === "paper" && $("#opponent-input") === "rock") {
                alert("You Win");
                player.wins++;
                opponent.losses++;
            } else if ($("#player-input") === "scissors" && $("#opponent-input") === "paper") {
                alert("You Win");
                player.wins++;
                opponent.losses++;
            } else if ($("#player-input") === $("#opponent-input")) {
                alert("It's a Tie");
            } else {

                alert("Opponent Wins")
                player.losses++;
                opponent.wins++;
            }

            con.update({
                choice: "",
                wins: player.wins,
                losses: player.losses

            });


            $("#playerScore").text(player.wins)
            $("#opponentScore").text(opponent.wins)


        }


    };




})