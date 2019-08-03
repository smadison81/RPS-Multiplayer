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

    // Declare all global variables

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

    //Start on.click function that allows players to select paper rock scissors and disables the button after entry. Also doesnt allow anything outside of typing rock paper scissors to be pressed.

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
            $("#player-button").attr("disabled", true);
        } else {

            $("#playerStatus").text("Invalid Choice")
        }
        $("form").trigger("reset");

    })

// Code below adds payers to connections so that you can get an accurate count of number of people connected.  Code should dissconnect from server on exit from game.

    connectedRef.on("value", function (snap) {

       
        if (snap.val()) {

           
            var con = connectionsRef.push(true);

            con.onDisconnect().remove();
        }
    });

    connectionsRef.on("value", function (snapshot) {


        console.log("numbers of people connected are:" + snapshot.numChildren());

    })

    //this code sets the players by connection. If you are Player 1, you are also Opponent 2, Player 2 is Opponent 1. Anything outside of 2 playrs is disconnected and given a game full message.

    connectionsRef.once('value', function (snapshot) {
        if (Object.keys(snapshot.val()).indexOf('1') === -1) {
            player.number = '1';
            opponent.number = '2';
            console.log("You are Player " + player.number)
            console.log("You are Opponent " + opponent.number)
            $("#player-area").text(`You Are Player ${player.number}`)

        } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
            player.number = '2';
            opponent.number = '1';
            console.log("You are Player " + player.number)
            console.log("You are Opponent " + opponent.number)
            $("#player-area").text(`You Are Player ${player.number}`)
        }


        if (player.number !== '0') {

            con = connectionsRef.child(player.number);
            con.set(player);
            con.onDisconnect().remove();


        } else {

            $("#player-form").hide();
            $("#winLose").text("Game Room Filled").css("color", "red");


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

//gmae logic, this runs the game on each connection.  and appends the wins losses to the html.

    function playGame() {
        if (options.indexOf(player.choice) > -1 && options.indexOf(opponent.choice) > -1) {
            if (player.choice === "rock" && opponent.choice === "scissors") {
                console.log("You Win");
                $('#playerImage').prepend('<img id="rock" src="./assets/images/rock.png" />');
                $('#opponentImage').prepend('<img id="scissors" src="./assets/images/scissors.png" />');
                $('#winLose').text("Winner");
                player.wins++;

            } else if (player.choice === "paper" && opponent.choice === "rock") {
                console.log("You Win");
                $('#playerImage').prepend('<img id="paper" src="./assets/images/paper.png" />');
                $('#opponentImage').prepend('<img id="rock" src="./assets/images/rock.png" />');
                $('#winLose').text("Winner");
                player.wins++;

            } else if (player.choice === "scissors" && opponent.choice === "paper") {
                console.log("You Win");
                $('#playerImage').prepend('<img id="scissors" src="./assets/images/scissors.png" />');
                $('#opponentImage').prepend('<img id="paper" src="./assets/images/paper.png" />');
                $('#winLose').text("Winner");
                player.wins++;

            } else if (player.choice === opponent.choice) {
                console.log("It's a Tie");
                $('#winLose').text("TIE!");
            } else {

                console.log("Opponent Wins")
                $('#winLose').text("LOSER!!");
                player.losses++;

            }

            con.update({
                choice: "",
                wins: player.wins,
                losses: player.losses

            });

            $("#playerScore").text(player.wins)
            $("#opponentScore").text(player.losses)
            setTimeout(function () {
                $('#playerImage').html('');
                $('#opponentImage').html('');
                $('#winLose').text("");
                $("#player-button").attr("disabled", false);
            }, 3000);


        }


    };




})