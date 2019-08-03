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

    //Start on.click function that allows players to select paper rock scissors and disables the button

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


        console.log("numbers of people connected are:" + snapshot.numChildren());

    })

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
            $("#gameStatus").text("Game Room Filled").css("color", "red");


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