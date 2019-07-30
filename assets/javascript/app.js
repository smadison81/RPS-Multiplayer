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
          var app =  firebase.initializeApp(firebaseConfig);

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

            function getMyUserId() {
                return prompt('Username?', 'Guest');
            }



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
                    con.set(player);

                    con.onDisconnect().remove();

                } else {

                    $('section').remove();
                    $('.alert').show();
                    app.delete();
                }
                console.log(player.number)
            });


            function gameLogic() {
                if ($("#player-one-input") === "rock" && $("#player-two-input") === "scissors") {
                    alert("Player 1 Wins");
                } else if ($("#player-one-input") === "paper" && $("#player-two-input") === "rock") {
                    alert("Player 1 Wins");
                } else if ($("#player-one-input") === "scissors" && $("#player-two-input") === "paper") {
                    alert("Player 1 Wins");

                } else if ($("#player-one-input") === $("#player-two-input")) {
                        alert("It's a Tie");
                    } else {

                        alert("Player 2 Wins")
                    }
                };




            })