//Variables that shouldn't change
    var mapX = 0;
    var mapY = 0;
    var mapZ = 0;
	var mapR = 0;
	var hostMapR;
    var showMap = false;
    var vertices = {};
	var hexagon = {};
    var roads = {};
	var correctPointsVertices = {};
	var correctPointsHexagon = {};
	var correctPointsRoads = {};
    var dotColor = 'black';
    var mapType = '';
    var normalNums = {numbers: [0,2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12], dots: [0,1,2,2,3,3,4,4,5,5,5,5,4,4,3,3,2,2,1]};
    var extensionNums = {numbers: [0,0,2,2,3,3,3,4,4,4,5,5,5,6,6,6,8,8,8,9,9,9,10,10,10,11,11,11,12,12], dots: [0,0,1,1,2,2,2,3,3,3,4,4,4,5,5,5,5,5,5,4,4,4,3,3,3,2,2,2,1,1]}
    var hexagonValues;
    var scrambledValues = [];
    var scrambledDots = [];
    var hexagonTypes = ['wool', 'wood', 'grain', 'brick', 'ore'];
    var normalMapHexes = ['wool', 'wool', 'wool', 'wool', 'wood', 'wood', 'wood', 'wood', 'grain', 'grain', 'grain', 'grain', 'brick', 'brick', 'brick', 'ore', 'ore', 'ore']
    var extensionMapHexes = ['wool', 'wool', 'wool', 'wool', 'wool', 'wool', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'grain', 'grain', 'grain', 'grain', 'grain', 'grain', 'brick', 'brick', 'brick', 'brick', 'brick', 'ore', 'ore', 'ore', 'ore', 'ore']
    var lobbyName;
    var playerName;
    var host;
    var inLobby = false;
    var inPreLobby = true;
	var turn = 0;
	var playerNumber;
    var names = [];
    var players = [];
    var clickDistance; 	
    var mapMarginTop;
    var mapMarginLeft;
	var settlementWidth = 20;
	var portTypes = ['any','wool','ore','wood','grain','brick'];
    var portSpacing = [true,true,false,true,true,false,false,true,true,false];
    var beginingPlacement = true;
	var numOfTurns = 1;
	var placedRoad = false;
	var placedSettlement = false;
	var undoList = [];
	var dice1 = 6;
    var dice2 = 6;
	var robberPlacement = false;
	var freeRoads = 0;
	var largestArmy = 2;
	var longestRoad = 4;
    var devCards = ['knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 'knight', 
    'VP', 'VP', 'VP', 'VP', 'VP', 'roadBuilding', 'roadBuilding', 'yearOfPlenty', 'yearOfPlenty', 'monopoly', 'monopoly']
	var devCardDisplayName = {'knight': 'Knight: ', 'yearOfPlenty': 'Year of Plenty:', 'VP': 'Victory Point: ', 'roadBuilding': 'Road Building: ', 'monopoly': 'Monopoly: '}

//image sources
    var repository = 'https://mattjg2020.github.io/CaZoom/'
    var brick = repository + 'brick.png';
    var desert = repository + 'desert.png';
    var grain = repository + 'grain.png';
    var ore = repository + 'ore.png';
    var wood = repository + 'wood.png';
    var wool = repository + 'wool.png';
    var water = repository + 'water.png';
    var any_ship = repository + 'any_ship.png';
    var wood_ship = repository + 'wood_ship.png';
    var wool_ship = repository + 'wool_ship.png';
    var grain_ship = repository + 'grain_ship.png';
    var brick_ship = repository + 'brick_ship.png';
    var ore_ship = repository + 'ore_ship.png';
    var waterAL = repository + 'waterAL.png';
    var waterAR = repository + 'waterAR.png';
    var waterBL = repository + 'waterBL.png';
    var waterBR = repository + 'waterBR.png';
    var waterSL = repository + 'waterSL.png';
    var waterSR = repository + 'waterSR.png';
    var wood_icon = repository + 'wood_icon.png';
    var wool_icon = repository + 'wool_icon.png';
    var ore_icon = repository + 'ore_icon.png';
    var grain_icon = repository + 'grain_icon.png';
    var brick_icon = repository + 'brick_icon.png';
    var undo_icon = repository + 'undo.png';
    var building_card = repository + 'building_card.png';
    var robber = repository + 'robber.png';
    var devCard_icon = repository + 'devCard_icon.png';

//Variables that can change	var mapMarginTop = 50;
	var waterWidth = 30;
	var dotSpacing = 5;
	var dotWeight = 3;
	var luckyColor = '#cc0000';
	var tableMarginLeft = 20;
	var iconSize = 0.45;
	var roadWidth = 12;
	var availableColor = '#dbdbdb';
	var colors = ['#ff2e2e', '#2969ff', '#3f663e', '#7a4e00', '#000000', '#7c00ba', '#ff9900', '#32f0e0', '#e3e300', '#84ff00', '#ff00e1', '#9c0000'];
	var secondaryColors = ['#ff8a8a', '#a8c7ff', '#5d945c', '#b07c20', '#919191', '#cb9de3', '#ffc56e', '#cffffb', '#fafaa7', '#d9ffb0', '#fca7f2', '#b53e3e'];
	var undoButtonRadius = 30;
	var diceMargin = 7;
	var diceWidth = 50;
	var diceCornerRadius = 5;
	var diceDotSize = 9;

AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:58e1e59b-1a57-493a-a2b5-aabc32f69a28',
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();
 
  
function makeLobby(){
    var params = {
        TableName : lobbyName,
        KeySchema: [
            { AttributeName: "variable", KeyType: "HASH"}
        ],
        AttributeDefinitions: [
            { AttributeName: "variable", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
  
    dynamodb.createTable(params, function(err, data) {
        if (err) {
            alert('There was a problem creating the lobby\nThe lobby name may already be taken')
            console.log("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2));
        }else{
            inPreLobby = false;
            creatingLoadingMessage();
            document.getElementById('preLobby').style.display = 'none';
            document.getElementById('pageDarken').style.visibility = 'visible';
            document.getElementById('loadingMessage').style.visibility = 'visible';
            initiateLobby()
        }
    });
}

function initiateLobby(){
	eval(`
		var params = {
			RequestItems: {
			` + lobbyName + `: [
				{
					PutRequest: {					
						Item: {
							variable: 'dateCreated',
							"variableData": ` + new Date().getDate() + `
						}
					}
				},{
					PutRequest: {						
						Item: {
							variable: 'lobbyPlayers',
							"variableData": []
						}
					}
				},{
					PutRequest: {
						Item: {
							variable: 'inLobby',
							"variableData": true
						}
					}
				}
			]
			}
		};
	`)
	  
	  docClient.batchWrite(params, function(err, data) {
		if (err){
			console.log(err)
			setTimeout(initiateLobby, 1000);
		}else{
			console. clear() 
			document.getElementById('pageDarken').style.visibility = 'hidden';
			document.getElementById('loadingMessage').style.display = 'none';
			addName();
			inLobby = true;  
			deleteOldTables();
		};
	  });
}

function addName(){ 
	var thingsToUpdate = ['inLobby', 'lobbyPlayers']
	var stringForParams = ''
	for(i in thingsToUpdate){
		stringForParams += "{'variable': '" + thingsToUpdate[i] + "'},"
	}
	eval(`
	var params = {
		RequestItems: {
			` + lobbyName + ` : {
			Keys: [` + stringForParams + `]
		  }
		}
	  };
	`)

	docClient.batchGet(params, function(err, data) {
        if(err){
            alert('The lobby you tried to join is unavailable')
            console.log("Unable to update item: " + "\n" + JSON.stringify(err, undefined, 2));
        }else{
			var lobbyPlayersLOCAL;
			var inLobbyLOCAL;
			for(i in data.Responses[lobbyName]){
				eval(data.Responses[lobbyName][i].variable + 'LOCAL = data.Responses[lobbyName][i].variableData')
			}
            if(inLobbyLOCAL == false){
                alert('You are not currently able to join this lobby')
            }else if(lobbyPlayersLOCAL.length >= 12){
				alert('The lobby is full. Max: 12 players')
			}else{
                var params = {
                    TableName: lobbyName,
                    Key:{
                        "variable": 'lobbyPlayers',
                    },
                    UpdateExpression: "set variableData = list_append(variableData, :name)",
                    ExpressionAttributeValues:{
                        ":name": [playerName]
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                
                docClient.update(params, function(err, data) {
                    if (err) {
                        alert('Something went wrong. Please try again')
                        console.log(err)
                    }else if(!host){
                        document.getElementById('preLobby').style.display = 'none';;
                        inLobby = true;
						inPreLobby = false;
						document.getElementById('lobby').style.display = 'inline';
                        updateLobbyDisplay();
                    }else{
						document.getElementById('lobby').style.display = 'inline';
                        updateLobbyDisplay();
                    }
                });
            }
        }
    })
}

function preLobby(){
    if(document.getElementById('makeLobby').checked){
        document.getElementById('joinLobbyInputs').style.display = 'none';
        document.getElementById('makeLobbyInputs').style.display = 'block';
        document.getElementById('JoinGameInputs').style.display = 'none';
    }else if(document.getElementById('joinLobby').checked){
        document.getElementById('joinLobbyInputs').style.display = 'block';
        document.getElementById('makeLobbyInputs').style.display = 'none';
        document.getElementById('JoinGameInputs').style.display = 'none';
    }else{
        document.getElementById('JoinGameInputs').style.display = 'block';
        document.getElementById('joinLobbyInputs').style.display = 'none';
        document.getElementById('makeLobbyInputs').style.display = 'none';
	}
}

function attemptLobby(){
    host = document.getElementById('makeLobby').checked;
    if(host){
        playerName = document.getElementById('make_name').value;
        lobbyName = document.getElementById('make_lobbyName').value;
    }else if(document.getElementById('rejoinGame').checked){  
        playerName = document.getElementById('rejoin_name').value;
        lobbyName = document.getElementById('rejoin_lobbyName').value;
    }else{  
        playerName = document.getElementById('join_name').value;
        lobbyName = document.getElementById('join_lobbyName').value;
    }

    if(!validateName(playerName)){
        alert('Please give yourself a valid name \n Names must be 3 characters long \n Names can only contain characters a-z A-Z 0-9 _ . -')
    }else if(!validateName(lobbyName) && host){
        alert('Please give your lobby a valid name \n Lobby names must be 3 characters long \n Lobby names can only contain characters a-z A-Z 0-9 _ . -')
    }else{
        if(host){
            makeLobby();
        }else if(document.getElementById('rejoinGame').checked){
			rejoinGame();
		}else{
            addName();
        }
    }
}

function validateName(name){
    if(!/[^a-zA-Z0-9_.-]/.test(name) && name.length >= 3 && name.length <= 25){
        return true;
    }else{
        return false;
    }
}

function deleteOldTables(){
    dynamodb.listTables(null, function(err, data) {
        if(err){
            console.error('Failed to access DB and get the list of tables')
        }else{
            var tables = data.TableNames;
            for(t in tables){
                if(tables[t] != lobbyName){
                    deleteIndividualTable(tables, t)
                }else{}
            }
        }
    })
}

function deleteIndividualTable(tables, t){
    var params = {
        TableName: tables[t],
        Key:{
            "variable": 'dateCreated'
        }
    };

    docClient.get(params, function(err, data) {
        if(err){
        }else{
            var currentDate = new Date().getDate();
            var createdDate = data.Item.variableData;
            var deleteIt = false;
            if(createdDate < currentDate && currentDate - createdDate > 1){
                deleteIt = true;
            }else if(createdDate > currentDate && currentDate > 1){
                deleteIt = true;
            }else{}

            if(deleteIt){                                
                dynamodb.deleteTable({TableName: tables[t]}, function(err, data) {});
            }else{}
        }
    })
}

window.addEventListener("beforeunload", function(evt) {
    if(host && !inPreLobby){
		if(document.getElementById('pageDarken').style.visibility == 'visible' || inLobby){
			//this should make it delete the lobby if you're past the prelobby screen but haven't started the game yet
			//deletes the table in the database
			var params = {
				TableName : lobbyName
			};
			
			dynamodb.deleteTable(params, function(err, data) {});

			evt.returnValue = ''
			return null;
		}else{}
    }else{}    
});

function removePlayerFromLobby(player){   
    var params = {
        TableName: lobbyName,
        Key:{
            "variable": 'lobbyPlayers',
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.log("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
        }else{
            var newLobbyPlayersArray = [];
            var lobbyPlayersArray = data.Item.variableData;

            for(i in lobbyPlayersArray){
                if(lobbyPlayersArray[i] != player){
                    newLobbyPlayersArray.push(lobbyPlayersArray[i])
                }else{}
            }
            
            var params = {
                TableName: lobbyName,
                Key:{
                    "variable": 'lobbyPlayers',
                },
                UpdateExpression: "set variableData = :e",
                ExpressionAttributeValues:{
                    ":e": newLobbyPlayersArray
                },
                ReturnValues:"UPDATED_NEW"
            };
            docClient.update(params, function(err, data) {});  
        }
    });   
}

function rejoinGame(){
	var thingsToCheck = ['lobbyPlayers', 'hostName', 'inLobby']

	var stringForParams = ''
	for(i in thingsToCheck){
		stringForParams += "{'variable': '" + thingsToCheck[i] + "'},"
	}
	eval(`
	var params = {
		RequestItems: {
			` + lobbyName + ` : {
			Keys: [` + stringForParams + `]
		  }
		}
	  };
	`)

	docClient.batchGet(params, function(err, data) {
        if(err){
			alert('Something went wrong. The host may have kicked you from the game, the game may have been deleted, or the game you tried to join may not exist.')
        }else{
			var playerInLobby = false;
			for(i in data.Responses[lobbyName]){
				if(data.Responses[lobbyName][i].variable == 'inLobby'){
					if(data.Responses[lobbyName][i].variableData == true){
						alert('This game has not started yet. Please use "Join a Lobby" instead.')
						return;
					}else{}
				}
				if(data.Responses[lobbyName][i].variable == 'lobbyPlayers'){
					var playersInLobby = data.Responses[lobbyName][i].variableData;
					for(j in playersInLobby){
						if(playersInLobby[j] == playerName){
							playerInLobby = true;
						}else{}
					}
				}else{
					if(data.Responses[lobbyName][i].variableData == playerName){
						host = true;
					}else{}
				}
			}

			if(playerInLobby){
				document.getElementById('preLobby').style.display = 'none';
				inPreLobby = false;
				initiateGameForPlayer();
			}else{
				alert('The name you entered was not a player in the game. Please try again.')
			}
		}
	})
}

//this also calls initiateGameForPlayer() when appropriate
function updateLobbyDisplay(){
    if(inLobby){
        document.getElementById('lobbyNameDisplay').innerHTML = 'Lobby: ' + lobbyName;

        var params = {
            TableName: lobbyName,
            Key:{
                "variable": 'lobbyPlayers'
            }
        };
    
        docClient.get(params, function(err, data) {
            if (err) {
                console.log("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
				alert('The lobby was closed');
				document.getElementById('body').innerHTML = '<H1>Settlers of CaZoom</H1><div>The lobby was closed.'
            }else{
                var lobbyPlayersArray = data.Item.variableData;
                
                document.getElementById('lobbyPlayersDisplay').innerHTML = '';
                var namePresent = false;
                for(i in lobbyPlayersArray){
                    if(host && lobbyPlayersArray[i] != playerName){
                        document.getElementById('lobbyPlayersDisplay').innerHTML += lobbyPlayersArray[i] + `
                            <span onclick = "removePlayerFromLobby('` + lobbyPlayersArray[i] + `')" class = "removePlayer">
                            ` + ' x'.sup() + `</span><br>`;
                    }else{
                        document.getElementById('lobbyPlayersDisplay').innerHTML += `
                        <span style = 'margin-left: 50 px'>` + lobbyPlayersArray[i] + '</span><br>';
                    }

                    if(lobbyPlayersArray[i] == playerName){
                        namePresent = true;
                    }else{}
				}
				
                if(host){
                    document.getElementById('gameSettings').style.display = 'inline';
                    document.getElementById('startGameButton').innerHTML = '<br><button onclick = "startGame()">Start Game</button>'; 
                }

                if(!namePresent){
					alert('You were kicked out of the lobby')
                }else{
                    setTimeout(updateLobbyDisplay, 1000)
                }
            }
        })

        var params = {
            TableName: lobbyName,
            Key:{
                "variable": 'inLobby'
            }
        };
    
        docClient.get(params, function(err, data) {
            if(err){
            }else{
                inLobby = data.Item.variableData;
            }
        })
    }else{
        document.getElementById('lobby').style.display = 'none';
		if(!host){
			initiateGameForPlayer()
		}else{}
    }
}

function initiateGameForPlayer(){
	var thingsToUpdate = ['players', 'vertices', 'hexagon', 'mapType', 'beginingPlacement', 'devCards', 'roads', 'numOfTurns', 'turn', 'dice1', 'dice2', 'largestArmy', 'longestRoad', 'mapX', 'mapY', 'mapZ', 'hostMapR']
	var stringForParams = ''
	for(i in thingsToUpdate){
		stringForParams += "{'variable': '" + thingsToUpdate[i] + "'},"
	}
	eval(`
	var params = {
		RequestItems: {
			` + lobbyName + ` : {
			Keys: [` + stringForParams + `]
		  }
		}
	  };
	`)

	docClient.batchGet(params, function(err, data) {
		if (err) {
		  console.log(err);
		}else{
			for(i in data.Responses[lobbyName]){
				eval(data.Responses[lobbyName][i].variable + '= data.Responses[lobbyName][i].variableData')
			}
			document.getElementById('body').style.backgroundColor = document.getElementById('bgColorSelect').value;
			document.getElementById('lobby').style.display = 'none';
			showMap = true;
			mapR = 1/(((mapY + mapZ + (2/3))*1.5)/windowHeight);
			clickDistance = mapR/4;
			mapMarginTop = mapR;
			mapMarginLeft = Math.sqrt(3)*mapR/2;
			for(i in players){
				if(players[i].name == playerName){
					playerNumber = i;
				}else{}
			}
			makeCorrectPoints();
			correctPoints();
			setup();
			makePlayerDisplay();
			updateResourceDisplay();
			if(turn != playerNumber){
				checkTurnChange();
			}else{}
			createBuildingCard();
		}
	})
}

function updateLocalVariables(){
	var thingsToUpdate = ['players', 'vertices', 'hexagon', 'mapType', 'devCards', 'beginingPlacement', 'robberPlacement', 'roads', 'numOfTurns', 'turn', 'dice1', 'dice2', 'largestArmy', 'longestRoad']
	var stringForParams = ''
	for(i in thingsToUpdate){
		stringForParams += "{'variable': '" + thingsToUpdate[i] + "'},"
	}
	eval(`
	var params = {
		RequestItems: {
			` + lobbyName + ` : {
			Keys: [` + stringForParams + `]
		  }
		}
	  };
	`)

	docClient.batchGet(params, function(err, data) {
		if (err) {
		  console.log(err);
		}else{
			for(i in data.Responses[lobbyName]){
				eval(data.Responses[lobbyName][i].variable + '= data.Responses[lobbyName][i].variableData')
			}
			correctPoints();
			updateResourceDisplay();
			if(turn != playerNumber){
				setTimeout(checkTurnChange, 5000);
			}else{}
		}
	})
}

function initialWriteDBVariables(){
	hostMapR = mapR;
	hostName = playerName;
	var thingsToWrite = ['players', 'vertices', 'hexagon', 'devCards', 'mapType', 'beginingPlacement', 'robberPlacement', 'roads', 'numOfTurns', 'turn', 'dice1', 'dice2', 'largestArmy', 'longestRoad', 'mapX', 'mapY', 'mapZ', 'hostMapR', 'hostName']
	var items = []
	for(i in thingsToWrite){
		items.push({
			'variable': thingsToWrite[i],
			'variableData': eval(thingsToWrite[i])
		})
	}

    for(i in items){
        var params = {
            TableName : lobbyName,
            Item: items[i]
        };
        docClient.put(params, function(err, data) {
            if (err) {
				console.log(err)
            }else{
				if(turn != playerNumber){
					if(turn != playerNumber){
						checkTurnChange();
					}else{}
				}else{}
			}
        });
    }
}

function updateDBVariables(){
	var thingsToWrite = ['players', 'vertices', 'hexagon', 'devCards', 'roads', 'numOfTurns', 'beginingPlacement', 'robberPlacement', 'turn', 'dice1', 'dice2', 'largestArmy', 'longestRoad']
	var items = []
	for(i in thingsToWrite){
		items.push({
			'variable': thingsToWrite[i],
			'variableData': eval(thingsToWrite[i])
		})
	}

    for(i in items){
        var params = {
            TableName : lobbyName,
            Item: items[i]
        };
        docClient.put(params, function(err, data) {
            if (err) {
				console.log(err)
            }else{}
        });
    }
}

function makeCorrectPoints(){
	for(i in vertices){
		correctPointsVertices[i] = {'x': vertices[i].x*(mapR/hostMapR), 'y': vertices[i].y*(mapR/hostMapR)}
	}
	for(i in hexagon){
		correctPointsHexagon[i] = {'x': hexagon[i].x*(mapR/hostMapR), 'y': hexagon[i].y*(mapR/hostMapR)}
	}
	for(i in roads){
		correctPointsRoads[i] = {
			'x1': roads[i].x1*(mapR/hostMapR),
			'x2': roads[i].x2*(mapR/hostMapR),
			'y1': roads[i].y1*(mapR/hostMapR),
			'y2': roads[i].y2*(mapR/hostMapR),
		}
	}
}

function correctPoints(){
	for(i in vertices){
		vertices[i].x = correctPointsVertices[i].x;
		vertices[i].y = correctPointsVertices[i].y;
	}
	for(i in hexagon){
		hexagon[i].x = correctPointsHexagon[i].x;
		hexagon[i].y = correctPointsHexagon[i].y;
	}
	for(i in roads){
		roads[i].x1 = correctPointsRoads[i].x1;
		roads[i].x2 = correctPointsRoads[i].x2;
		roads[i].y1 = correctPointsRoads[i].y1;
		roads[i].y2 = correctPointsRoads[i].y2;
	}
}

function creatingLoadingMessage(){
    var message = 'Loading...'
    for(i = 0; i < message.length; i++){
        document.getElementById('loadingMessage').innerHTML += '<span class = "messageSpans" id = "letter' + i + '">' + String(message[i]) + '</span>'
        setTimeout(letterUp, i*120, i, message.length)
    }
}

function letterUp(spanNumber, messageLength){
    if(!inLobby){
        document.getElementById('letter' + spanNumber).style.top = '-12px'
        setTimeout(letterDown, 333, spanNumber, messageLength)
    }else{}
}

function letterDown(spanNumber, messageLength){
    if(!inLobby){
        document.getElementById('letter' + spanNumber).style.top = '0px'
        setTimeout(letterUp, messageLength*190, spanNumber, messageLength)
    }else{}
}

function resetColors(){
	var resources = document.getElementsByClassName('info');
	for (var i = 0; i < resources.length; i++) {
		resources[i].style.color = 'black';
	}
}

function checkTurnChange(){
	if(beginingPlacement){
		var thingsToCheck = ['beginingPlacement', 'turn']
	}else{
		var thingsToCheck = ['turn']
	}

	var stringForParams = ''
	for(i in thingsToCheck){
		stringForParams += "{'variable': '" + thingsToCheck[i] + "'},"
	}
	eval(`
	var params = {
		RequestItems: {
			` + lobbyName + ` : {
			Keys: [` + stringForParams + `]
		  }
		}
	  };
	`)

	docClient.batchGet(params, function(err, data) {
        if(err){
        }else{
			for(i in data.Responses[lobbyName]){
				if(data.Responses[lobbyName][i].variable == 'turn'){
					if(data.Responses[lobbyName][i].variableData != turn){
						updateLocalVariables();
					}else if(data.Responses[lobbyName][i].variableData == players.length || data.Responses[lobbyName][i].variableData == playerNumber - 1){
						setTimeout(checkTurnChange, 1500)
					}else{
						setTimeout(checkTurnChange, 5000)
					}
				}else{
					if(data.Responses[lobbyName][i].variableData == false){
						//if begining placement ends
						updateLocalVariables();
					}else{}
				}
			}
        }
    }) 
}

function startGame(){
    inLobby = false;
    var params = {
        TableName: lobbyName,
        Key:{
            "variable": 'inLobby',
        },
        UpdateExpression: "set variableData = :d",
        ExpressionAttributeValues:{
            ":d": false
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.update(params, function(err, data) {
        if(err){
            console.log(err)
        }else{
           gameSetup();
        }
    });
}

//calls create map, sets up players[], and sets up html stuff on the side of the screen
function gameSetup() {
	document.getElementById('body').style.backgroundColor = document.getElementById('bgColorSelect').value;

//creates players array
	//creates array with player names, scrambled
    var params = {
        TableName: lobbyName,
        Key:{
            "variable": 'lobbyPlayers'
        }
    };

    docClient.get(params, function(err, data) {
        if(err){
            console.log(err)
        }else{
            var nameInputs = data.Item.variableData;
            if(document.getElementById('customBoardCheckBox').checked){
				mapType = 'custom';
				mapX = parseInt(document.getElementById('customX').value);
				mapY = parseInt(document.getElementById('customY').value);
				mapZ = parseInt(document.getElementById('customZ').value);
				mapR = 1/(((mapY + mapZ + (2/3))*1.5)/windowHeight);
				clickDistance = mapR/4;
                createmap()
            }else if(nameInputs.length > 4){
				mapType = 'extension';
				mapX = 4;
				mapY = 4;
				mapZ = 3;
				mapR = 1/(((mapY + mapZ + (2/3))*1.5)/windowHeight);
				hexagonValues = extensionNums;
				clickDistance = mapR/4;
                createmap()
            }else{
				mapType = 'normal';
				mapX = 3;
				mapY = 3;
				mapZ = 3;
				mapR = 1/(((mapY + mapZ + (2/3))*1.5)/windowHeight);
				hexagonValues = normalNums;
				clickDistance = mapR/4;
				createmap()
            }

            for(i = 0; i < nameInputs.length; i++){
                var randomNum = Math.ceil(Math.random()*names.length);
                names.splice(randomNum, 0, nameInputs[i])
            }
            var randomNum = Math.ceil(Math.random()*names.length);
            names.splice(randomNum, 0, names[0]);
            names.splice(0,1);


            //shuffles colors
            for(i in colors){
                var randomNum = Math.floor(Math.random()*colors.length)
                shuffledColor = colors[i];
                shuffledSecondaryColor = secondaryColors[i];
                colors.splice(i, 1);
                colors.splice(randomNum, 0, shuffledColor)		
                secondaryColors.splice(i, 1);
                secondaryColors.splice(randomNum, 0, shuffledSecondaryColor)
            }

            //turns array of player names into array of objects of each player's info
            for(i in names){
				if(names[i] == playerName){
					playerNumber = i;
				}else{}
                players[i] = {
                'name': names[i], 
                'brick': 0, 
                'wood': 0, 
                'grain': 0, 
                'wool': 0, 
                'ore': 0, 
                'roads': 0, 
                'settlements': 0, 
                'cities': 0,
                'knights': 0,
                'VP': 0,
                'color': colors[i], 
                'secondaryColor': secondaryColors[i],
                'devCards': {'knight': 0, 'yearOfPlenty': 0, 'VP': 0, 'roadBuilding': 0, 'monopoly':0},
                'usedKnights': 0,
                'awards': {'longestRoad': false, 'largestArmy': false}
                }
            }

            //shuffles devCards
            for(i in devCards){
                var randomNum = Math.floor(Math.random()*devCards.length)
                shuffledCard = devCards[i];
                devCards.splice(i, 1);
                devCards.splice(randomNum, 0, shuffledCard)
			}
			createBuildingCard();
			makePlayerDisplay();
			updateResourceDisplay();
			initialWriteDBVariables();
			for(i in vertices){
				correctPointsVertices[i] = {'x': vertices[i].x, 'y': vertices[i].y}
			}
			for(i in hexagon){
				correctPointsHexagon[i] = {'x': hexagon[i].x, 'y': hexagon[i].y}
			}
			for(i in roads){
				correctPointsRoads[i] = {
					'x1': roads[i].x1,
					'x2': roads[i].x2,
					'y1': roads[i].y1,
					'y2': roads[i].y2,
				}
			}
        }
    })
}

function nextTurn(){
	if(!robberPlacement){
		if(freeRoads != 0){
			if(confirm('If you end your turn, you will lose your free road building')){
				freeRoads = 0;
			}else{
				return
			}
		}else{}

		undoList = [];
		if (beginingPlacement){
			placedRoad = false;
			placedSettlement = false;
			if(numOfTurns < players.length){
				turn ++;
				numOfTurns++;
			}else if(numOfTurns > players.length){
				if(turn == 0){
					beginingPlacement = false;
					giveResourcesOnBeginingPlacement();
					numOfTurns++;
				}else{
					turn--;
					numOfTurns++;
				}
			}else{
				numOfTurns++;
			}
		}else{
			if(turn == players.length - 1){
				turn = 0;
			}else{
				turn ++;
			}
		}

		if(!beginingPlacement){
			rollDice();
		}else{
			updateResourceDisplay()
		}

		updateDBVariables();
		setTimeout(checkTurnChange, 5000);
	}else{
		alert('Place the robber first')
	}
}

function updateResourceDisplay(){
	var previous = [];
	for(i in players){
		if(players[i].name == playerName){
			for(j in hexagonTypes){
				var resource = document.querySelector('#p' + i + ' > tbody > tr > .' + hexagonTypes[j])
				if(resource.innerHTML < players[i][hexagonTypes[j]]){
					resource.style.color = '#00e686';
				}else if(resource.innerHTML > players[i][hexagonTypes[j]]){
					resource.style.color = 'red';
				}
				resource.innerHTML = players[i][hexagonTypes[j]];
			}

			var devCardTD = document.querySelector('#p' + i + ' > tbody > tr > .devCards');
			devCardTD.innerHTML = '';	
			devCardTD.innerHTML += 'Knights Used: ' + players[i].usedKnights + '<br>'
			for(j in players[i].devCards){
				if(players[i].devCards[j] > 0){
					devCardTD.innerHTML += '<div onclick = "' + j + 'Used(' + turn + ')">' + devCardDisplayName[j] + players[i].devCards[j] + '</div>'
				}else{}
			}
		}else{
			var usedKnightsTD = document.querySelector('#p' + i + ' > tbody > tr > .usedKnights');
			usedKnightsTD.innerHTML = '';
			usedKnightsTD.innerHTML += 'Knights Used: ' + players[i].usedKnights + '<br>'
		}

		var awardsTD = document.querySelector('#p' + i + ' > tbody > tr > .awards');
		awardsTD.innerHTML = '';

		if(players[i].awards.longestRoad){
			awardsTD.innerHTML += 'Longest Road (+2 VP)<br>'
		}else{}

		if(players[i].awards.largestArmy){
			awardsTD.innerHTML += 'Largest Army (+2 VP)<br>'
		}else{}

		
		var VPTD = document.querySelector('#p' + i + ' > tbody > tr > .playerVP');
		var VP = 0;
		for(k in vertices){
			if(vertices[k].ownership == i){
				if(vertices[k].pieceStatus == 'settlement'){
					VP++;
				}else if(vertices[k].pieceStatus == 'city'){
					VP += 2;
				}else{}
			}else{}
		}

		if(players[i].awards.longestRoad){
			VP += 2;
		}else{}

		if(players[i].awards.largestArmy){
			VP += 2;
		}else{}

		VP += players[i].devCards.VP;
		VPTD.innerHTML = 'VP: ' + VP;
	}

	for(i in players){
		document.getElementById('turnButton' + i).style.boxShadow = '0 0'
	}
	document.getElementById('turnButton' + turn).style.boxShadow = "0 0 10px" + players[turn].color;


	if(playerNumber == turn){
		document.getElementById('nextTurnButton').innerHTML = 'Next Turn';
		document.getElementById('nextTurnButton').style.visibility = 'visible';
	}else{
		document.getElementById('nextTurnButton').style.visibility = 'hidden';
	}

	setTimeout(resetColors,700);
	availability();
}

function availability(){
	//for roads.ownership, -1 = available; -2 = none; if not, then it is the player num of the owner
	if(beginingPlacement){
		for(i in roads){
			if(roads[i].ownership == -2){
				roads[i].ownership = -1;
			}else{}
		}
	}else{
		for(i in roads){
			var adjacentRoad = roadCheckAdjacentRoad(i);
			if(players[turn].roads < 15 && players[turn].brick >= 1 && players[turn].wood >= 1 && adjacentRoad){
				if(roads[i].ownership == -2){
					roads[i].ownership = -1;
				}else{}
			}else if(freeRoads > 0 && adjacentRoad){
				if(roads[i].ownership == -2){
					roads[i].ownership = -1;
				}else{}
			}else{
				if(roads[i].ownership == -1){
					roads[i].ownership = -2;
				}
			}
		}
	}

	//for cities and settlements
	for(i in vertices){
		var adjacentBuilding = checkAdjacentBuildings(i);
		var adjacentRoad = buildingCheckAdjacentRoad(i);
		if(beginingPlacement){
			if(vertices[i].ownership == -2 && !adjacentBuilding){
				vertices[i].available = true;
			}else{
				vertices[i].available = false;
			}
		}else{
			if(vertices[i].pieceStatus == 'none' && !adjacentBuilding && adjacentRoad){
				if(players[turn].wood > 0 && players[turn].wool > 0 && players[turn].grain > 0 && players[turn].brick > 0  && players[turn].settlements < 5){
					vertices[i].available = true;
				}else{
					vertices[i].available = false;
				}
			}else if(vertices[i].pieceStatus == 'settlement' && vertices[i].ownership == turn){
				if(players[turn].grain > 1 && players[turn].ore > 2 && players[turn].cities < 4){
					vertices[i].available = true;
				}else{
					vertices[i].available = false;
				}
			}else{
				vertices[i].available = false;
			}
		}
	}
}

function mouseClicked(){
	if(document.getElementById('pageDarken').style.visibility == 'visible' || playerNumber != turn){
	}else{
		var mouseD;
		var centerX;
		var centerY;

		//if you click on a road
		for(i in roads){
			centerX = (roads[i].x1 + roads[i].x2)/2;
			centerY = (roads[i].y1 + roads[i].y2)/2;
			mouseD = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))
			if(mouseD <= clickDistance && roads[i].ownership == -1){
				roadBought(i);
			}else{}
		}

		for(i in vertices){
			mouseD = Math.sqrt(Math.pow(mouseX - vertices[i].x, 2) + Math.pow(mouseY - vertices[i].y, 2))
			if(mouseD <= clickDistance && vertices[i].available){
				buildingBought(i);
			}else{}
		}

		//if you click the undo button
		centerX = width - undoButtonRadius;
		centerY = height - undoButtonRadius;
		mouseD = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
		if(mouseD <= undoButtonRadius && undoList.length > 0){
			for(i in undoList[undoList.length - 1]){
				eval(undoList[undoList.length - 1][i])
				updateResourceDisplay();
			}
			undoList.pop()
		}else{}

		//for placing robber
		if(robberPlacement){
			for(i in hexagon){
				mouseD = Math.sqrt(Math.pow(mouseX - hexagon[i].x, 2) + Math.pow(mouseY - hexagon[i].y, 2));
				if(mouseD < mapR*Math.sqrt(3)/2){
					hexagon[i].robber = true;
					robberPlacement = false;
					undoList.push(['robberPlacement = true']);
					sevenTakeResources();
				}else{
					hexagon[i].robber = false;
				}
			}
		}else{}

		//for devCard click
		if(width - mapR < mouseX && mouseX < width && 0 < mouseY && mouseY < 479*mapR/326){
			devCardBought();
		}else{}
	}
}

function devCardBought(){
	if(players[turn].ore == 0 || players[turn].wool == 0 || players[turn].grain == 0){
		alert("You can't buy a development card at the moment")
	}else if(devCards.length == 0){
		alert("There are no more development cards left")
	}else if(confirm('Are you sure you want to buy a development card?')){
		players[turn].ore--;
		players[turn].wool--;
		players[turn].grain--;
		players[turn].devCards[devCards[0]]++;
		devCards.splice(0, 1);
		updateResourceDisplay();
	}else{}
}

function buildingBought(i){
	if(beginingPlacement && !placedSettlement){
		vertices[i].ownership = turn;
		vertices[i].available = false;
		vertices[i].pieceStatus = 'settlement'
		placedSettlement = true;
		players[turn].settlements ++;

		var undoFunctions = [];
		undoFunctions.push(String('players[' + turn + '].settlements --'));
		undoFunctions.push('placedSettlement = false;')
		undoFunctions.push(String('vertices.' + i + '.ownership = -2'))
		undoFunctions.push(String('vertices.' + i + '.available = true'))
		undoFunctions.push(String('vertices.' + i + '.pieceStatus = "none"'));
		undoList.push(undoFunctions)
		updateResourceDisplay();
	}else if(!beginingPlacement){
		if(vertices[i].pieceStatus == 'none'){
			vertices[i].ownership = turn;
			vertices[i].available = false;
			vertices[i].pieceStatus = 'settlement';
			players[turn].wood --;
			players[turn].wool --;
			players[turn].grain --;
			players[turn].brick --;
			//placedSettlement = true;
			players[turn].settlements ++;

			var undoFunctions = [];
			undoFunctions.push(String('players[' + turn + '].settlements --'));
			undoFunctions.push(String('vertices.' + i + '.ownership = -2'))
			undoFunctions.push(String('vertices.' + i + '.available = true'))
			undoFunctions.push(String('vertices.' + i + '.pieceStatus = "none"'))
			undoFunctions.push(String('players[' + turn + '].wood++;'))
			undoFunctions.push(String('players[' + turn + '].wool++;'))
			undoFunctions.push(String('players[' + turn + '].grain++;'))
			undoFunctions.push(String('players[' + turn + '].brick++;'))
			undoList.push(undoFunctions)
			updateResourceDisplay();
		}else if(vertices[i].pieceStatus == 'settlement'){
			vertices[i].available = false;
			vertices[i].pieceStatus = 'city';
			players[turn].ore -= 3;
			players[turn].grain -= 2;
			//placedSettlement = true;
			players[turn].settlements --;
			players[turn].cities ++;

			var undoFunctions = [];
			undoFunctions.push(String('players[' + turn + '].settlements ++'));
			undoFunctions.push(String('players[' + turn + '].cities --'));
			undoFunctions.push(String('vertices.' + i + '.available = true'))
			undoFunctions.push(String('vertices.' + i + '.pieceStatus = "settlement"'))
			undoFunctions.push(String('players[' + turn + '].ore += 3;'))
			undoFunctions.push(String('players[' + turn + '].grain += 2;'))
			undoList.push(undoFunctions)
			updateResourceDisplay();
		}else{}
	}else{}
}

function roadBought(i){
	if(beginingPlacement && !placedRoad){
		roads[i].ownership = turn;
		placedRoad = true;
		players[turn].roads ++;

		var undoFunctions = [];
		undoFunctions.push(String('players[' + turn + '].roads --'));
		undoFunctions.push('placedRoad = false;')
		undoFunctions.push(String('roads.' + i + '.ownership = -1'))
		undoList.push(undoFunctions)
		updateResourceDisplay();
	}else if(!beginingPlacement){
		roads[i].ownership = turn;
		players[turn].roads ++;

		var undoFunctions = [];
		undoFunctions.push(String('players[' + turn + '].roads --'));
		undoFunctions.push(String('roads.' + i + '.ownership = -1'));

		if(freeRoads > 0){
			freeRoads--;
			undoFunctions.push('freeRoads++');
		}else{
			players[turn].wood --;
			players[turn].brick --;
			undoFunctions.push(String('players[' + turn + '].wood++'));
			undoFunctions.push(String('players[' + turn + '].brick++'));
		}
		undoList.push(undoFunctions)
		updateResourceDisplay();
		checkLongestRoad();
	}else{}
}

function checkLargestArmy(){
	for(i in players){
		if(players[i].usedKnights > largestArmy){
			for(j in players){
				players[j].awards.largestArmy = false;
			}
			players[i].awards.largestArmy = true;
			largestArmy = players[i].usedKnights;
		}else{}
	}
}

function checkLongestRoad(){
	var numOfRoads = 0;
	for(r in roads){
		if (roads[r].ownership == turn){
			numOfRoads++;
		}else{}
	}

	if(numOfRoads > longestRoad){
		var longestRoadForPlayer = 0;

		for(n = 0; n < 16; n++){
			eval('var roadTreeLayer' + n + " = []")
		}

		for(r in roads){
			if(roads[r].ownership == turn){
				if(roadsOnlyOnOneEnd(r)){
					adjacentRoads = giveAdjacentRoads(r)
					for(a in adjacentRoads){
						roadTreeLayer1.push({'road': adjacentRoads[a], 'parent': r, 'grandparents': []})
					}
				}else{}
			}else{}
		}	
		
		for(n = 1; n < 15; n++){
			var currentLayer = eval('roadTreeLayer' + n);
			var nextLayer = eval('roadTreeLayer' + (n + 1));

			for(i in currentLayer){
				var allAdjacentRoads = giveAdjacentRoads(currentLayer[i].road);
				var parentAdjacentRoads = giveAdjacentRoads(currentLayer[i].parent);

				//road must be neither the parent nor adjacent to the parent to be put in the next layer
				for(j in allAdjacentRoads){

					if(allAdjacentRoads[j] == currentLayer[i].parent){
					}else{
						var adjacentToParent = false;
						for(k in parentAdjacentRoads){
							if(allAdjacentRoads[j] == parentAdjacentRoads[k]){
								adjacentToParent = true;
								break
							}else{}						
						}

						if(!adjacentToParent){
							var isGrandparent = false;
							for(l in currentLayer[i].grandparents){
								if(allAdjacentRoads[j] == currentLayer[i].grandparents[l]){
									isGrandparent = true;
									break
								}else{}						
							}
						}
							
						if(!adjacentToParent && !isGrandparent){
							var newGrandparents = [];
							for(l in currentLayer[i].grandparents){
								newGrandparents.push(currentLayer[i].grandparents[l])
							}
							newGrandparents.push(currentLayer[i].parent);

							nextLayer.push({'road': allAdjacentRoads[j], 'parent': currentLayer[i].road, 'grandparents': newGrandparents})
						}else{}
					}
				}

				if(n + 1 > longestRoadForPlayer){
					longestRoadForPlayer = n + 1;
				}else{}
			}
		}

		if(longestRoadForPlayer > longestRoad){
			longestRoad = longestRoadForPlayer;
			var previousLongestRoadOwner = -1;
			
			for(i in players){
				if(players[i].awards.longestRoad){
					previousLongestRoadOwner = i;
				}else{}
				players[i].awards.longestRoad = false;
			}
			players[turn].awards.longestRoad = true;

			undoList[undoList.length - 1].push('longestRoad--');
			undoList[undoList.length - 1].push('players[' + turn + '].awards.longestRoad = false');
			if(previousLongestRoadOwner >= 0){
				undoList[undoList.length - 1].push('players[' + previousLongestRoadOwner + '].awards.longestRoad = true');
			}else{}
			updateResourceDisplay();
		}
	}else{}
}

function roadsOnlyOnOneEnd(i){
	var adjacentRoadTop_Left = false;
	var adjacentRoadBottom_Right = false;

	if(i.charAt(1) == 'd'){
		var x = parseInt(i.substring(2));
		var y = parseInt(i.substring(i.indexOf('_') + 1));

		if(roads['r' + x + '_' + y]){
			if(roads['r' + x + '_' + y].ownership == turn){
				adjacentRoadTop_Left = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoadTop_Left = true;
			}else{}
		}else{}

		if(roads['r' + x + '_' + (y + 1)]){
			if(roads['r' + x + '_' + (y + 1)].ownership == turn){
				adjacentRoadBottom_Right = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + (y + 1)]){
			if(roads['r' + (x - 1) + '_' + (y + 1)].ownership == turn){
				adjacentRoadBottom_Right = true;
			}else{}
		}else{}
	}else{
		var x = parseInt(i.substring(1));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(roads['rd' + x + '_' + y]){
			if(roads['rd' + x + '_' + y].ownership == turn){
				adjacentRoadTop_Left = true;
			}else{}
		}else{}

		if(roads['rd' + x + '_' + (y - 1)]){
			if(roads['rd' + x + '_' + (y - 1)].ownership == turn){
				adjacentRoadTop_Left = true;
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + y]){
			if(roads['rd' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoadBottom_Right = true;
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + (y - 1)]){
			if(roads['rd' + (x + 1) + '_' + (y - 1)].ownership == turn){
				adjacentRoadBottom_Right = true;
			}else{}
		}else{}

		if(roads['r' + (x + 1) + '_' + y]){
			if(roads['r' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoadBottom_Right = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoadTop_Left = true;
			}else{}
		}else{}
	}
	if(adjacentRoadTop_Left && !adjacentRoadBottom_Right){
		return true;
	}else if(!adjacentRoadTop_Left && adjacentRoadBottom_Right){
		return true;
	}else{
		return false;
	}
}

function giveAdjacentRoads(i){
	var adjacentRoads = [];
	if(i.charAt(1) == 'd'){
		var x = parseInt(i.substring(2));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(roads['r' + x + '_' + y]){
			if(roads['r' + x + '_' + y].ownership == turn){
				adjacentRoads.push('r' + x + '_' + y);
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoads.push('r' + (x - 1) + '_' + y);
			}else{}
		}else{}

		if(roads['r' + x + '_' + (y + 1)]){
			if(roads['r' + x + '_' + (y + 1)].ownership == turn){
				adjacentRoads.push('r' + x + '_' + (y + 1));
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + (y + 1)]){
			if(roads['r' + (x - 1) + '_' + (y + 1)].ownership == turn){
				adjacentRoads.push('r' + (x - 1) + '_' + (y + 1));
			}else{}
		}else{}
	}else{
		var x = parseInt(i.substring(1));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(roads['rd' + x + '_' + y]){
			if(roads['rd' + x + '_' + y].ownership == turn){
				adjacentRoads.push('rd' + x + '_' + y);
			}else{}
		}else{}

		if(roads['rd' + x + '_' + (y - 1)]){
			if(roads['rd' + x + '_' + (y - 1)].ownership == turn){
				adjacentRoads.push('rd' + x + '_' + (y - 1));
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + y]){
			if(roads['rd' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoads.push('rd' + (x + 1) + '_' + y);
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + (y - 1)]){
			if(roads['rd' + (x + 1) + '_' + (y - 1)].ownership == turn){
				adjacentRoads.push('rd' + (x + 1) + '_' + (y - 1));
			}else{}
		}else{}

		if(roads['r' + (x + 1) + '_' + y]){
			if(roads['r' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoads.push('r' + (x + 1) + '_' + y);
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoads.push('r' + (x - 1) + '_' + y);
			}else{}
		}else{}
	}
	return adjacentRoads;
}

function checkAdjacentBuildings(i){
	var x = parseInt(i.substring(1));
	var y = parseInt(i.substring(i.indexOf('_') + 1));
	var adjacentBuilding = false;
	if(vertices['v' + (x + 1) + '_' + y]){
		if(vertices['v' + (x + 1) + '_' + y].ownership != -2){
			adjacentBuilding = true;
		}else{}
	}else {}

	if(vertices['v' + (x - 1) + '_' + y]){
		if(vertices['v' + (x - 1) + '_' + y].ownership != -2){
			adjacentBuilding = true;
		}else{}
	}else {}

	if(vertices['v' + x + '_' + (y + 1)]){
		if(vertices['v' + x + '_' + (y + 1)].ownership != -2 && vertices['v' + x + '_' + (y + 1)].y - vertices[i].y < mapR*1.01){
			adjacentBuilding = true;
		}else{}
	}else {}

	if(vertices['v' + x + '_' + (y - 1)]){
		if(vertices['v' + x + '_' + (y - 1)].ownership != -2 && vertices[i].y - vertices['v' + x + '_' + (y - 1)].y < mapR*1.01){
			adjacentBuilding = true;
		}else{}
	}else{}
	return adjacentBuilding;
}

function buildingCheckAdjacentRoad(i){
	var x = parseInt(i.substring(1));
	var y = parseInt(i.substring(i.indexOf('_') + 1));
	var adjacentRoad = false;
	if(roads['r' + x + '_' + y]){
		if(roads['r' + x + '_' + y].ownership == turn){
			adjacentRoad = true;
		}else{}
	}else{}
	if(roads['r' + (x - 1) + '_' + y]){
		if(roads['r' + (x - 1) + '_' + y].ownership == turn){
			adjacentRoad = true;
		}else{}
	}else{}
	if(roads['rd' + x + '_' + y]){
		if(roads['rd' + x + '_' + y].ownership == turn){
			adjacentRoad = true;
		}else{}
	}else{}

	if(roads['rd' + x + '_' + (y - 1)]){
		if(roads['rd' + x + '_' + (y - 1)].ownership == turn){
			adjacentRoad = true;
		}else{}
	}else{}

	return adjacentRoad;
}

function roadCheckAdjacentRoad(i){
	var adjacentRoad = false;
	if(i.charAt(1) == 'd'){
		var x = parseInt(i.substring(2));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(roads['r' + x + '_' + y]){
			if(roads['r' + x + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['r' + x + '_' + (y + 1)]){
			if(roads['r' + x + '_' + (y + 1)].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + (y + 1)]){
			if(roads['r' + (x - 1) + '_' + (y + 1)].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}
	}else{
		var x = parseInt(i.substring(1));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(roads['rd' + x + '_' + y]){
			if(roads['rd' + x + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['rd' + x + '_' + (y - 1)]){
			if(roads['rd' + x + '_' + (y - 1)].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + y]){
			if(roads['rd' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['rd' + (x + 1) + '_' + (y - 1)]){
			if(roads['rd' + (x + 1) + '_' + (y - 1)].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['r' + (x + 1) + '_' + y]){
			if(roads['r' + (x + 1) + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}

		if(roads['r' + (x - 1) + '_' + y]){
			if(roads['r' + (x - 1) + '_' + y].ownership == turn){
				adjacentRoad = true;
			}else{}
		}else{}
	}
	return adjacentRoad;
}

function rollDice(){
	//actually drawing the dice is taken care of in drawMap()
	dice1 = Math.floor(Math.random()*6) + 1
	dice2 = Math.floor(Math.random()*6) + 1
	for(i in hexagon){
		if(hexagon[i].rollNumber == dice1 + dice2 && !hexagon[i].robber){
			for(j in vertices){
				var distance = Math.sqrt(Math.pow((vertices[j].x - hexagon[i].x), 2) + Math.pow((vertices[j].y - hexagon[i].y), 2))
				if (distance < mapR*1.01){
					if(vertices[j].pieceStatus == 'settlement'){
						eval('players[vertices[j].ownership].' + hexagon[i].type + '++');
					}else if(vertices[j].pieceStatus == 'city'){
						eval('players[vertices[j].ownership].' + hexagon[i].type + '+= 2');
					}else{}
				}else{}
			}
		}else{}
	}
	if(dice1 + dice2 == 7){
		robberPlacement = true;
	}else{}
	updateResourceDisplay()
}

function tradeButtonClick(){
	document.getElementById('tradePage').style.visibility = "visible";
	document.getElementById('pageDarken').style.visibility = "visible";

	document.getElementById('people').innerHTML = '<option value = "bank">Bank</option>';
	for(i in players){
		if(i != turn){
			document.getElementById('people').innerHTML += `
			<option value = '` + players[i].name + `'>` + players[i].name + `</option>`
		}else{}
	}	
	for(i in vertices){
		if(vertices[i].port != 'none' && vertices[i].ownership == turn){
			document.getElementById('people').innerHTML += `
			<option value = '` + vertices[i].port + `'>` + vertices[i].port + ` port</option>`
		}else{}
	}
	updateTradePage('both');
}

function makeTrade(){
	var tradee = document.getElementById('people').value;
	var traderNum = document.getElementById('traderNumber').value;
	var tradeeNum = document.getElementById('tradeeNumber').value;
	var traderType = document.getElementById('traderTypes').value;
	var tradeeType = document.getElementById('tradeeTypes').value;
	players[turn][traderType] -= parseInt(traderNum);
	players[turn][tradeeType] += parseInt(tradeeNum);
	for(i in players){
		if(players[i].name == tradee){
			players[i][tradeeType] -= parseInt(tradeeNum);
			players[i][traderType] += parseInt(traderNum);
		}else{}
	}
	updateResourceDisplay()
	closeTradePage();
}

function updateTradePage(clearNum){
	var tradee = document.getElementById('people');
	var traderNum = document.getElementById('traderNumber');
	var tradeeNum = document.getElementById('tradeeNumber');
	var traderType = document.getElementById('traderTypes');
	var tradeeType = document.getElementById('tradeeTypes');

	if(clearNum){
		if(clearNum == 'both'){
			traderNum.value = 0;
			tradeeNum.value = 0;
		}else{
			eval(clearNum + '.value = 0')
		}
	}else{}
	traderNum.step = 1;
	traderNum.max = players[turn][traderType.value];

	for(i in players){
		if(tradee.value == players[i].name){
			tradeeNum.max = players[i][tradeeType.value]
		}else{}
	}

	if(tradee.value == 'any'){
		traderNum.step = 3;
	}else if(tradee.value == 'bank'){
		//traderNum.step = 4;
	}else{
		for(i in portTypes){
			if(tradee.value == portTypes[i]){
				traderNum.step = 2;
			}else{}
		}
	}	
	changePortNumberForTrade()
}

function changePortNumberForTrade(){
	var tradee = document.getElementById('people');
	var traderNum = document.getElementById('traderNumber');
	var tradeeNum = document.getElementById('tradeeNumber');
	if(tradee.value == 'any'){
		tradeeNum.value = traderNum.value/3;
	}else if(tradee.value == 'bank'){
		//tradeeNum.value = traderNum.value/4;
		//this is to allow manual override of resources if something goes wrong
	}else{
		for(i in portTypes){
			if(tradee.value == portTypes[i]){
				tradeeNum.value = traderNum.value/2;
			}
		}
	}
}

function closeTradePage(){
	document.getElementById('tradePage').style.visibility = 'hidden';
	document.getElementById('pageDarken').style.visibility = 'hidden'
}

function sevenTakeResources(){
	document.getElementById('sevenPage').style.visibility = 'visible';
	document.getElementById('pageDarken').style.visibility = 'visible';
	document.getElementById('sevenSelect').innerHTML = '';
	for(i in players){
		var haveAnything = false;
		for(j in hexagonTypes){
			if(players[i][hexagonTypes[j]] > 0){
				haveAnything = true;
			}else{}
		}
		
		if(i != turn && haveAnything){
			document.getElementById('sevenSelect').innerHTML += `
			<option value = '` + i + `'>` + players[i].name + `</option>`
		}else{}
	}
	document.getElementById('sevenSelect').innerHTML += `
	<option value = 'none'>none</option>`
}

function knightUsed(owner){
	if(owner == turn){
		if(confirm('Are you sure you want to use your knight?')){
			robberPlacement =  true;
			players[turn].devCards.knight--;
			players[turn].usedKnights++;
			checkLargestArmy();
			updateResourceDisplay();
		}else{}
	}else{
		alert('You can only use your knight on your turn')
	}
}

function VPUsed(){}

function roadBuildingUsed(owner){
	if(owner == turn){
		if(confirm('Are you sure you want to use your road building card?')){
			freeRoads += 2;
			players[turn].devCards.roadBuilding--;
			updateResourceDisplay();
		}else{}
	}else{
		alert('You can only use your road building card on your turn')
	}
}

function yearOfPlentyUsed(owner){
	if(owner == turn){
		if(confirm('Are you sure you want to use your year of plenty card?')){
			players[turn].devCards.yearOfPlenty--;
			document.getElementById('yearOfPlentyPage').style.visibility = 'visible';
			document.getElementById('pageDarken').style.visibility = 'visible';
		}else{}
	}else{
		alert('You can only use your year of plenty card on your turn')
	}
}

function yearOfPlentyConfirm(){
	var itemOne = document.getElementById('yearOfPlentyOne').value;
	var itemTwo = document.getElementById('yearOfPlentyTwo').value;
	players[turn][itemOne]++;
	players[turn][itemTwo]++;
	updateResourceDisplay();
	closeYOPPage();
}

function closeYOPPage(){
	document.getElementById('yearOfPlentyPage').style.visibility = 'hidden';
	document.getElementById('pageDarken').style.visibility = 'hidden';
}

function monopolyUsed(owner){
	if(owner == turn){
		if(confirm('Are you sure you want to use your monopoly card?')){
			players[turn].devCards.monopoly--;
			document.getElementById('monopolyPage').style.visibility = 'visible';
			document.getElementById('pageDarken').style.visibility = 'visible';
		}else{}
	}else{
		alert('You can only use your monopoly card on your turn')
	}
}

function monopolyConfirm(){
	var item = document.getElementById('monopolyItem').value;
	var takenResources = 0;
	for(i in players){
		takenResources += players[i][item];
		players[i][item] = 0;
	}
	players[turn][item] += takenResources;
	updateResourceDisplay();
	closeMonopolyPage();
}

function closeMonopolyPage(){
	document.getElementById('monopolyPage').style.visibility = 'hidden';
	document.getElementById('pageDarken').style.visibility = 'hidden';
}

function sevenConfirm(){
	var person = document.getElementById('sevenSelect').value;
	var hasResource = false;
	if(person == 'none'){
		document.getElementById('sevenPage').style.visibility = 'hidden';
		document.getElementById('pageDarken').style.visibility = 'hidden';
		updateResourceDisplay();
		return;
	}else{}
	
	for(i in hexagonTypes){
		if(players[person][hexagonTypes[i]] > 0){
			hasAnyResource = true;
		}else{}
		
		if(i == hexagonTypes.length - 1 && !hasAnyResource){
		}else if(i == hexagonTypes.length - 1){
			while(!hasResource){
				var randomNum = Math.floor(Math.random()*hexagonTypes.length)
				if(players[person][hexagonTypes[randomNum]] > 0){
					hasResource = true;
					players[turn][hexagonTypes[randomNum]]++;
					players[person][hexagonTypes[randomNum]]--;
					undoList[undoList.length - 1].push('players[' + turn + '][hexagonTypes[' + randomNum + ']]--');
					undoList[undoList.length - 1].push('players[' + person + '][hexagonTypes[' + randomNum + ']]++');
				}else{}
			}
			
			document.getElementById('sevenPage').style.visibility = 'hidden';
			document.getElementById('pageDarken').style.visibility = 'hidden';
			updateResourceDisplay();
		}else{}
	}
}

function giveResourcesOnBeginingPlacement(){
	for(i in hexagon){
		for(j in vertices){
			var distance = Math.sqrt(Math.pow((vertices[j].x - hexagon[i].x), 2) + Math.pow((vertices[j].y - hexagon[i].y), 2))
			if (distance < mapR*1.01){
				if(vertices[j].pieceStatus == 'settlement' && hexagon[i].type != 'desert'){
					eval('players[vertices[j].ownership].' + hexagon[i].type + '++');
				}else if(vertices[j].pieceStatus == 'city' && hexagon[i].type != 'desert'){
					eval('players[vertices[j].ownership].' + hexagon[i].type + '+= 2');
				}else{}
			}else{}
		}
	}
}

function makePlayerDisplay(){
	//makes the table for players
	var table = document.getElementById('player_table');
	table.style.maxWidth = Math.floor(window.innerWidth - width - tableMarginLeft - 10) + "px";
	table.style.display = 'inline';
	table.style.marginLeft = (width + tableMarginLeft) +  'px';

	for(i in players){
		if(players[i].name == playerName){
			var playerRow = document.createElement('table');
			playerRow.id = 'p' + i;
			playerRow.innerHTML = `
				<tr>
					<td class = 'playerName' style = 'text-align: left' colspan = 18>` + players[i].name + `</td>
					<td class = 'playerVP' style = 'text-align: right' colspan = 18> VP: 0 </td>
				</tr>
				<tr>
					<td class = 'info' colspan = 3> 
						<img src = ` + brick_icon + `
						alt = 'brick:' width =` + 88*iconSize + `height =` + 48*iconSize + `/>
					</td>
					<td class = 'info brick' colspan = 3>` + players[i].brick + `</td>
					<td class = 'info' colspan = 3>
						<img src = ` + wood_icon + `
						alt = 'wood:' width =` + 89*iconSize + `height =` + 60*iconSize + `/>
						</td>
					<td class = 'info wood' colspan = 3>` + players[i].wood + `</td>
					<td class = 'info' colspan = 3>
						<img src = ` + grain_icon + `
						alt = 'grain:' width =` + 56*iconSize + `height =` + 82*iconSize + `/>
						</td>
					<td class = 'info grain' colspan = 3>` + players[i].grain + `</td>
					<td class = 'info' colspan = 3>
						<img src = ` + wool_icon + `
						alt = 'wool:' width =` + 87*iconSize + `height =` + 62*iconSize + `/>
						</td>
					<td class = 'info wool' colspan = 3>` + players[i].wool + `</td>
					<td class = 'info' colspan = 3>
						<img src = ` + ore_icon + `
						alt = 'ore:' width =` + 86*iconSize + `height =` + 64*iconSize + `/>
						</td>
					<td class = 'info ore' colspan = 3>` + players[i].ore + `</td>
				</tr>
				<tr>
					<td class = 'devCards' colspan = 20 style = 'text-align: left'></td>
					<td class = 'awards' colspan = 20 style = 'text-align: left'></td>
				</tr>
			`;
			table.appendChild(playerRow);
		}else{}
	}

	for(i in players){
		if(players[i].name != playerName){
			var playerRow = document.createElement('table');
			playerRow.id = 'p' + i;
			playerRow.style.width = '100%'
			playerRow.innerHTML = `
				<tr>
					<td class = 'playerName' style = 'text-align: left;'>` + players[i].name + `</td>
					<td class = 'playerVP' style = 'text-align: right;'> VP: 0 </td>
				<tr>

				<tr>
					<td class = 'usedKnights' style = 'text-align: left'></td>
				</tr>

				<tr>
					<td class = 'awards' style = 'text-align: left'></td>
				</tr>
			`;
			table.appendChild(playerRow);
		}else{}
	}

	var buttonRow = document.createElement('table');
	buttonRow.id = 'buttonRow';
	var tableInside = '<tr id = "turnButtonsTR">';
	for(i in players){
		tableInside += `<td class = "turnButtons" id = "` + String('turnButton' + i) + `">` + players[i].name + `</td>`
	}
	tableInside += '</tr>';


	tableInside += `
		<tr>
			<td colspan = ` + players.length  + ` onclick = 'nextTurn()' id = 'nextTurnButton'>Next Turn</td>
		</tr>`

	buttonRow.innerHTML = tableInside;
	table.appendChild(buttonRow);

	if(playerNumber == turn){
		document.getElementById('nextTurnButton').style.visibility = 'visible';
	}else{
		document.getElementById('nextTurnButton').style.visibility = 'hidden';
	}

	for(i in players){
		document.getElementById('turnButton' + i).bgColor = players[i].secondaryColor;
		document.getElementById('turnButton' + i).style.borderColor = players[i].color;
	}
}

function createBuildingCard(){
	var card = document.createElement('img');
	card.id = 'builingCardImg'
	card.src = building_card;
	card.style.width = mapR + 'px';
	card.style.transition = 'width 0.5s'
	document.getElementById('buildingCard').append(card)
}

function cardClick(){
	var card = document.getElementById('builingCardImg')
	if(parseInt(card.style.width) > mapR){
		card.style.width = mapR + 'px'
	}else{
		card.style.width = '300px'
	}
}

function createmap(){
	document.getElementById('lobby').style.display = 'none';
    showMap = true;

	//sets parameters for each dimension on map according to settings of pregame menu

	mapMarginTop = mapR;
	mapMarginLeft = Math.sqrt(3)*mapR/2;
	
	for(j = 0; j < mapY + mapZ; j++){	
		if(j < mapZ && j < mapY){
			create_vertex_row((mapX + j)*2, j, mapZ - j - 1)
		}else if (j >= mapZ && j >= mapY){
			create_vertex_row((mapX + mapY + mapZ - j - 1)*2, j, mapZ - (mapZ + mapY - j) + mapY - mapZ)
		}else {
			if(mapZ > mapY){
				create_vertex_row((mapX + mapY)*2 - 1, j, mapZ - j - 1)
			}else{
				create_vertex_row((mapX + mapZ)*2 - 1, j, -j + mapZ)
			}
		}
	}

	createHexagonValues();
	while(!validateHexagons()){
		scrambledDots = [];
		scrambledValues = [];
		createHexagonValues();
	}

	var k = 0;
	for(i in hexagon){
		hexagon[i].rollNumber = scrambledValues[k];
		hexagon[i].rollDots = scrambledDots[k];
		k++;
	}

	if(mapType == 'custom'){
		var j = 0;
		for(i in hexagon){
			if(j%hexagonTypes.length == 0){
				for(l = 0; l < hexagonTypes.length; l++){
					var randomNumber = Math.floor(Math.random()*hexagonTypes.length);
					var anotherRandomNumber = Math.floor(Math.random()*hexagonTypes.length)
					var shuffledItem = hexagonTypes[randomNumber];
					hexagonTypes.splice(randomNumber, 1);
					hexagonTypes.splice(anotherRandomNumber, 0, shuffledItem);
				}
			}
			if(hexagon[i].rollDots == 0){
				hexagon[i].type = 'desert';
			}else{
				hexagon[i].type = hexagonTypes[j%hexagonTypes.length]
			}
			j++;
		}
	}else if(mapType =='normal'){
		for(l = 0; l < normalMapHexes.length; l++){
			var randomNumber = Math.floor(Math.random()*normalMapHexes.length);
			var anotherRandomNumber = Math.floor(Math.random()*normalMapHexes.length)
			var shuffledItem = normalMapHexes[randomNumber];
			normalMapHexes.splice(randomNumber, 1);
			normalMapHexes.splice(anotherRandomNumber, 0, shuffledItem);
		}
		
		var j = 0;
		for(i in hexagon){
			if(hexagon[i].rollDots == 0){
				hexagon[i].type = 'desert';
			}else{
				hexagon[i].type = normalMapHexes[j];
				j++;
			}
		}
	}else{
		for(l = 0; l < extensionMapHexes.length; l++){
			var randomNumber = Math.floor(Math.random()*extensionMapHexes.length);
			var anotherRandomNumber = Math.floor(Math.random()*extensionMapHexes.length)
			var shuffledItem = extensionMapHexes[randomNumber];
			extensionMapHexes.splice(randomNumber, 1);
			extensionMapHexes.splice(anotherRandomNumber, 0, shuffledItem);
		}
		
		var j = 0;
		for(i in hexagon){
			if(hexagon[i].rollDots == 0){
				hexagon[i].type = 'desert';
			}else{
				hexagon[i].type = extensionMapHexes[j];
				j++;
			}
		}
	}

	//sets robber in place
	for(i in hexagon){
		if(hexagon[i].type == 'desert'){
			hexagon[i].robber = true;
			break;
		}else{}
	}
	createRoads();
	createPorts();
	setup();
}

function create_vertex_row(length,rowNumber,xOffset){
	create_vertex(xOffset, rowNumber);
	for(i = 0; i < length; i++){
		if(i == length - 1){
			create_vertex(xOffset + 1 + i, rowNumber, i, true);
		}
		else{
			create_vertex(xOffset + 1 + i, rowNumber, i, false);
		}
	}
}

//creates vertices and hexagon objects
function create_vertex(x,y, vertexNumber, last) {
	var actualX = sqrt(3)*0.5*x*mapR + mapMarginLeft;
	var actualY;
	if(y%2 == 0){
		if(x%2 !== mapZ%2){
			actualY = 0.5*mapR + 1.5*y*mapR + mapMarginTop;
		}else{
			actualY = mapR*y*1.5 + mapMarginTop;
		}
	}else{
		if(x%2 !== mapZ%2){
			actualY = mapR*y*1.5 + mapMarginTop;
		}else{
			actualY = 0.5*mapR + 1.5*y*mapR + mapMarginTop;
		}
	}
	var pieceStatus = 'none';
	var ownership = -2;
	var port = 'none';
	var available = false;
	var adjacentBuilding = false;
	eval('vertices.v' + x + '_' + y + '= {x,y,rollNumber,rollDots,type,pieceStatus,ownership,available,adjacentBuilding,port}')
	eval('vertices.v' + x + '_' + y + '.x =' + actualX)
	eval('vertices.v' + x + '_' + y + '.y =' + actualY)

	//creates points for hexagon object
	if(y < mapZ && !last){
		if(vertexNumber%2 == 0){
			var rollNumber;
			var rollDots;
			var type;
			var robber = false;
			eval('hexagon.h' + x + '_' + y + '= {x,y,rollNumber,rollDots,type,robber}')
			eval('hexagon.h' + x + '_' + y + '.x =' + actualX)
			eval('hexagon.h' + x + '_' + y + '.y =' + (actualY + mapR))
		}else{}
	}else if(y < mapY + mapZ - 1 && !last){
		if(vertexNumber%2 == 1){
			var rollNumber;
			var rollDots;
			eval('hexagon.h' + x + '_' + y + '= {x,y,rollNumber,rollDots}')
			eval('hexagon.h' + x + '_' + y + '.x =' + actualX)
			eval('hexagon.h' + x + '_' + y + '.y =' + (actualY + mapR))
		}else{}
	}else{}
}

function createHexagonValues(){
	if(mapType == 'custom'){
		var k = 0;
		for(i in hexagon){
			var randomNum = Math.floor(Math.random()*normalNums.numbers.length)
			scrambledValues[k] = normalNums.numbers[randomNum];
			scrambledDots[k] = normalNums.dots[randomNum];
			k++;
		}
	}else{
		for(i in hexagonValues.numbers){
			var randomNum = Math.ceil(Math.random()*scrambledValues.length)
			scrambledValues.splice(randomNum, 0, hexagonValues.numbers[i]);
			scrambledDots.splice(randomNum, 0, hexagonValues.dots[i]);
		}
		var anotherRandomNum = Math.floor(Math.random()*scrambledValues.length)
		scrambledDots.splice(anotherRandomNum, 0, scrambledDots[0])
		scrambledDots.splice(0,1);
		scrambledValues.splice(anotherRandomNum, 0, scrambledValues[0])
		scrambledValues.splice(0,1);
	}
}

function pregameBoxes(){
	if(document.getElementById('customBoardCheckBox').checked){
		document.getElementById('customSettings').style.display = 'block';
	}else {
		document.getElementById('customSettings').style.display = 'none';
	}
}

function validateHexagons(){
	var k = 0;
	for(i in hexagon){
		if(scrambledDots[k] == 5){
			var l = 0;
			for(j in hexagon){
				if(scrambledDots[l] == 5){
					var h1x = parseInt(i.substring(1));
					var h1y = parseInt(i.substring(i.indexOf('_') + 1));
					var h2x = parseInt(j.substring(1));
					var h2y = parseInt(j.substring(j.indexOf('_') + 1));
					if((Math.abs(h1x - h2x) == 1 && Math.abs(h1y - h2y) == 1)){
						return false
					}else if ((Math.abs(h1x - h2x) == 2 && Math.abs(h1y - h2y) == 0)){
						return false;
					}else{}
				}
				l++;
			}
		}
		k++;
	}
	return true;
}

function createRoads(){
	for(i in vertices){
		//even rows, each point make road to right & down, left & up for odd OR do horizontal and then up and down
		var x = parseInt(i.substring(1));
		var y = parseInt(i.substring(i.indexOf('_') + 1));
		if(eval('vertices.v' + (x + 1) + '_' + y)){
			let x1, x2, y1, y2, ownership = -2;
			eval('roads.r' + x + '_' + y + '= {ownership,x1,y1,x2,y2}');
			eval('roads.r' + x + '_' + y + '.x1 = vertices.v' + (x) + '_' + y + '.x');
			eval('roads.r' + x + '_' + y + '.y1 = vertices.v' + (x) + '_' + y + '.y');
			eval('roads.r' + x + '_' + y + '.x2 = vertices.v' + (x + 1) + '_' + y + '.x');
			eval('roads.r' + x + '_' + y + '.y2 = vertices.v' + (x + 1) + '_' + y + '.y');
		}else{}
		if(eval('vertices.v' + x + '_' + (y + 1))){
			if(eval('vertices.v' + x + '_' + (y + 1) + '.y') - eval('vertices.v' + x + '_' + y + '.y') < 1.5*mapR){ 
				//the 1.5 is arbitrary. the differnce will be about mapR, but it's simpler to just say <1.5mapR
				let x1, x2, y1, y2, ownership = -2;
				eval('roads.rd' + x + '_' + y + '= {ownership,x1,y1,x2,y2}');
				eval('roads.rd' + x + '_' + y + '.x1 = vertices.v' + x + '_' + y + '.x');
				eval('roads.rd' + x + '_' + y + '.y1 = vertices.v' + x + '_' + y + '.y');
				eval('roads.rd' + x + '_' + y + '.x2 = vertices.v' + x + '_' + (y + 1) + '.x');
				eval('roads.rd' + x + '_' + y + '.y2 = vertices.v' + x + '_' + (y + 1) + '.y');
			}else{}
		}else{}
	}
}

function createPorts(){
	var Xdiff = Math.sqrt(3)*mapR;
	var numOfVertices = 0;
	var numOfPorts = 0;
	var randomPorts = []
	for(i = 0; i < 5; i++){//5 is arbitrary
		for(l = 0; l < portTypes.length; l++){
			var randomNumber = Math.floor(Math.random()*portTypes.length);
			var anotherRandomNumber = Math.floor(Math.random()*portTypes.length)
			var shuffledItem = portTypes[randomNumber];
			portTypes.splice(randomNumber, 1);
			portTypes.splice(anotherRandomNumber, 0, shuffledItem);
		}
		for(l = 0; l < portTypes.length; l++){
			randomPorts.splice(0, 0, portTypes[l])
		}
	}

	for(i = 0; i < mapX*2; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapZ - 1 + i) + '_0.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}		
	for(i = 0; i < mapY; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapZ - 1 + mapX*2 + i) + '_' + i + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;

		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapZ - 1 + mapX*2 + i) + '_' + (i + 1) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}
	for(i = 0; i < mapZ - 1; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapZ - 1 + mapX*2 + mapY - 2 - i) + '_' + (mapY + i) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;

		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapZ - 1 + mapX*2 + mapY - 2 - i) + '_' + (mapY + i + 1) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}
	for(i = 0; i < mapX*2; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapY - 1 + mapX*2 - i - 1) + '_' + (mapY + mapZ - 1) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}
	for(i = 0; i < mapY - 1; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapY - i - 1) + '_' + (mapZ + mapY - 2 - i) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;

		if(portSpacing[numOfVertices%portSpacing.length]){
			eval('vertices.v' + (mapY - i - 2) + '_' + (mapZ + mapY - 2 - i) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}
	for(i = 0; i < mapZ - 1; i++){
		if(portSpacing[numOfVertices%portSpacing.length]){
			if(i == mapZ - 2 && portSpacing[(numOfVertices + 1)%portSpacing.length]){
			}else{
				eval('vertices.v' + i + '_' + (mapZ - i - 1) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
				numOfPorts ++;
			}
		}else{}
		numOfVertices++;

		if(portSpacing[numOfVertices%portSpacing.length] && i != mapZ - 2){
			eval('vertices.v' + (i + 1) + '_' + (mapZ - i - 1) + '.port = randomPorts[' + Math.floor(numOfPorts/2) + ']');
			numOfPorts ++;
		}else{}
		numOfVertices++;
	}
}

function setup() {
	if(showMap == true){
		if(mapY => mapZ){
			createCanvas((mapY + mapX - 1 - ((mapY - mapZ)/2))*Math.sqrt(3)*mapR + mapMarginLeft*2, windowHeight);
			frameRate(30);
		}else{
			createCanvas((mapZ + mapX - 1 - ((mapZ - mapY)/2))*Math.sqrt(3)*mapR + mapMarginLeft*2, windowHeight);
			frameRate(30);
		}
	}else{}
}

function draw() {
	drawMap()
	if(undoList.length > 0){
		fill('white');
		stroke('black');
		strokeWeight(2);
		circle(width - undoButtonRadius - 2, height - undoButtonRadius - 2, undoButtonRadius*2);
		image(undo_icon, width - undoButtonRadius - 2, height - undoButtonRadius - 2, undoButtonRadius*2*0.85, undoButtonRadius*2*0.85)
	}else{}

	//draws roads
	for(i in roads){
		var color;
		var roadWidthDraw;
		var centerX = (roads[i].x1 + roads[i].x2)/2;
		var centerY = (roads[i].y1 + roads[i].y2)/2;
		var mouseD = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2))
		if(roads[i].ownership == -2){
			roadWidthDraw = 0;
			color = 'white';
		}else if (roads[i].ownership == -1  && playerNumber == turn){
			if(mouseD < clickDistance && beginingPlacement && !placedRoad){
				roadWidthDraw = roadWidth;
				color = availableColor;
			}else if(!beginingPlacement){
				roadWidthDraw = roadWidth;
				color = availableColor;
			}else{
				roadWidthDraw = 0;
				color = 'white';
			}
		}else if(roads[i].ownership != -1){
			roadWidthDraw = roadWidth;
			color = players[roads[i].ownership].secondaryColor;
		}else{
			roadWidthDraw = 0;
			color = 'white';
		}
		strokeWeight(roadWidthDraw);
		stroke(color);;
		line(roads[i].x1, roads[i].y1, roads[i].x2, roads[i].y2);
	}

	//draws settlements and cities
	for(i in vertices){	
		var mouseD = Math.sqrt(Math.pow(mouseX - vertices[i].x, 2) + Math.pow(vertices[i].y - mouseY, 2))
		if(vertices[i].pieceStatus == 'settlement'){
			if(vertices[i].available  && mouseD < clickDistance && playerNumber == turn){
				fill(availableColor);
				drawCity(i);
			}else{
				fill(players[vertices[i].ownership].color);
				drawSettlement(i);
			}
		}else if(vertices[i].pieceStatus == 'city'){
			fill(players[vertices[i].ownership].color);
			drawCity(i)
		}else{
			if(vertices[i].available && playerNumber == turn){
				if(beginingPlacement && !placedSettlement && mouseD < clickDistance){
					fill(availableColor);
					drawSettlement(i);
				}else if(!beginingPlacement && players[turn].wood > 0 && players[turn].wool > 0 && players[turn].grain > 0 && players[turn].brick > 0){
					fill(availableColor);
					drawSettlement(i);
				}
			}else{}
		}
	}

	if(robberPlacement && playerNumber == turn){
		image(robber, mouseX, mouseY, 182*mapR/347, mapR)
	}else{
		for(i in hexagon){
			if(hexagon[i].robber){
				image(robber, hexagon[i].x, hexagon[i].y - mapR/4, 182*mapR/347, mapR)
			}else{}
		}
	}
}

function drawMap(){
	if(showMap == true){
		//draws border lines
		for(i in vertices){
			for(j in vertices){
				var x1 = parseInt(vertices[i].x);
				var x2 = vertices[j].x;
				var y1 = vertices[i].y;
				var y2 = vertices[j].y;
				var distance = Math.pow(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2), 0.5);
				if(distance < mapR*1.1 && distance > mapR*0.9){
					stroke('#e8ce97');
					strokeWeight(5);
					line(x1,y1,x2,y2);
				}
			}
		}


	//creates earth tiles
		for(i in hexagon){
			eval('var shape' + i);
			var x = hexagon[i].x;
			var y = hexagon[i].y;
			imageMode(CENTER)
			image(eval(hexagon[i].type), x, y, Math.sqrt(3)*mapR, mapR*2);
		}
		
	//add water/ports
		for(i = 0; i <= mapX; i++){
			create_water((mapZ - 1 + i*2), 0,0,-mapR,'R','L',waterBR,waterBL);
		}		
		for(i = 0; i < mapY; i++){
			create_water((mapZ - 1 + mapX*2 + i), (i + 1), Math.sqrt(3)*mapR/2, -mapR/2,'R','A',waterBL,waterSL);
		}
		for(i = 0; i < mapZ - 1; i++){
			create_water((mapZ - 1 + mapX*2 + mapY - 2 - i), (mapY + i), Math.sqrt(3)*mapR/2, mapR/2,'R','B',waterAL,waterSL);
		}
		for(i = 0; i <= mapX; i++){
			create_water((mapY - 1 + mapX*2 - i*2), (mapY + mapZ - 1), 0, mapR,'R', 'L', waterAR, waterAL);
		}
		for(i = 0; i < mapY; i++){
			create_water((mapY - i - 1),(mapZ + mapY - 2 - i),-Math.sqrt(3)*mapR/2, mapR/2,'L','B',waterAR,waterSR);
		}
		for(i = 0; i < mapZ - 1; i++){
			create_water((i + 1), (mapZ - i - 1), -Math.sqrt(3)*mapR/2, -mapR/2,'L','A',waterBR,waterSR);
		}


	//draws tile number pieces
		for(i in hexagon){
			var x = hexagon[i].x;
			var y = hexagon[i].y;
			numOfDots = hexagon[i].rollDots;
			//draws circle
			strokeWeight(1);
			fill('none');
			stroke('black');
			if(numOfDots == 0){
			}else{
				circle(x, y, mapR*0.7);
			}

			
			var dotMargin = mapR*0.7*0.26;
			//draws dots in circle
			if(numOfDots%2 == 1){
				strokeWeight(dotWeight);
				if(numOfDots == 5){
					stroke(luckyColor);
				}else{
					stroke('black');
				}
				point(x, y + dotMargin);
				for(j = 0; j < Math.ceil(numOfDots/2); j++){
					point(x + j*dotSpacing, y + dotMargin)
					point(x - j*dotSpacing, y + dotMargin)
				}
			}else{
				strokeWeight(dotWeight)
				stroke('black')
				for(j = 0; j < numOfDots/2; j++){
					point(x + j*dotSpacing + 0.5*dotSpacing, y + dotMargin)
					point(x - j*dotSpacing - 0.5*dotSpacing, y + dotMargin)
				}
			}

			//draws number text in circle
			strokeWeight(1);
			if(numOfDots == 5){
				fill(luckyColor);
				stroke(luckyColor);
			}else{
				fill('black');
				stroke('black');
			}
			textAlign(CENTER, CENTER);
			textSize(mapR*0.3);
			if(numOfDots == 0){
			}else{
				text(hexagon[i].rollNumber, x, y)
			}
		}

		//creates triangles to cover up the water on the sides of the board
		stroke('none');
		strokeWeight(0);
		fill(document.getElementById('bgColorSelect').value);
		triangle(0,0,((mapZ - 1)*Math.sqrt(3)*mapR/2 + mapMarginLeft),-mapR/2,0,((mapZ - 1)*mapR*1.5 + mapMarginTop));
		triangle(0,height,((mapY - 1)*Math.sqrt(3)*mapR/2 + mapMarginLeft),height,0,((mapZ - 1)*mapR*1.5 + mapMarginTop + mapR*2));
		triangle(width,height,(width - mapZ*mapR*Math.sqrt(3)/2),height,width,((mapY - 1)*mapR*1.5 + mapMarginTop + mapR*2));
		triangle(width,0,(width - (mapY - 1)*Math.sqrt(3)*mapR/2 - mapMarginLeft),-mapR/2,width,((mapY - 1)*mapR*1.5 + mapMarginTop));


		//draws devCard
		image(devCard_icon, width - mapR/2, 479*mapR/(326*2), mapR, 479*mapR/326)
		

		//draws dice
		for(i = 1; i <=2; i++){
			stroke('black')
			strokeWeight(2)
			fill('white')
			square(diceMargin*i + diceWidth*(i - 1), height - diceMargin - diceWidth, diceWidth, diceCornerRadius)

			var dice = eval('dice' + i)
			if(dice == 1 || dice == 3 || dice == 5){
				stroke('black')
				strokeWeight(diceDotSize)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth/2, height - diceMargin - diceWidth/2)
			}else{}

			if(dice == 2 || dice == 3 || dice == 4 || dice == 5 || dice == 6){
				stroke('black')
				strokeWeight(diceDotSize)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth/4, height - diceMargin - diceWidth/4)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth*3/4, height - diceMargin - diceWidth*3/4)
			}else{}

			if(dice == 4 || dice == 5 || dice == 6){
				stroke('black')
				strokeWeight(diceDotSize)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth/4, height - diceMargin - diceWidth*3/4)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth*3/4, height - diceMargin - diceWidth/4)
			}else{}

			if(dice == 6){
				stroke('black')
				strokeWeight(diceDotSize)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth/4, height - diceMargin - diceWidth/2)
				point(diceMargin*i + diceWidth*(i - 1) + diceWidth*3/4, height - diceMargin - diceWidth/2)
			}else{}
		}
	}
}

function drawSettlement(i){
	strokeWeight(1);
	stroke('black');
	var x = vertices[i].x - settlementWidth/2;
	var y = vertices[i].y - settlementWidth/2;
	beginShape()
		vertex(x,y);
		vertex(x + settlementWidth/2, y - settlementWidth*0.5);
		vertex(x + settlementWidth, y);
		vertex(x + settlementWidth, y + settlementWidth*0.65);
		vertex(x, y + settlementWidth*0.65)
	endShape(CLOSE);
}

function drawCity(i){
	strokeWeight(1);
	stroke('black');
	var x = vertices[i].x - settlementWidth;
	var y = vertices[i].y - settlementWidth;
	beginShape()
		vertex(x,y);
		vertex(x + settlementWidth/2, y - settlementWidth/2);
		vertex(x + settlementWidth, y);
		vertex(x + settlementWidth, y + settlementWidth/2);
		vertex(x + settlementWidth*2, y + settlementWidth/2);
		vertex(x + settlementWidth*2, y + settlementWidth*3/2);
		vertex(x, y + settlementWidth*3/2)
	endShape(CLOSE);
}

function create_water(x,y,delX,delY,check1,check2,check1Image,check2Image){
	var width = Math.sqrt(3)*mapR;
	var hexType;
	var vertex = eval('vertices.v' + x + '_' + y);
	var vertexR = eval('vertices.v' + (x + 1) + '_' + y);
	var vertexL = eval('vertices.v' + (x - 1) + '_' + y);
	var vertexA = eval('vertices.v' + x + '_' + (y - 1));
	var vertexB = eval('vertices.v' + x + '_' + (y + 1));
	check1V = eval('vertex' + check1);
	check2V = eval('vertex' + check2);
	if(vertex.port != 'none'){
		if (check1V && check1V.port != 'none'){
			hexType = check1Image;
		}else if (check2V && check2V.port != 'none'){
			hexType = check2Image;
		}else{
			hexType = water;
		}
		image(hexType, vertex.x + delX, vertex.y + delY, width, mapR*2)

		//creates ships
		var ship = eval(vertex.port + '_ship');
		var shipX = vertex.x + delX;
		var shipY = vertex.y + delY;
		if(hexType == waterSL){
			shipX += -15;
			shipY += -18;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}else if(hexType == waterSR){
			shipX += 25;
			shipY += -5;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}else if(hexType == waterAL){
			shipX += -3;
			shipY += -20;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}else if(hexType == waterAR){
			shipX += 10;
			shipY += -20;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}else if(hexType == waterBL){
			shipX += 0;
			shipY += 5;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}else if(hexType == waterBR){
			shipX += 10;
			shipY += 10;
			image(ship, shipX, shipY, ship.width*mapR/284, ship.height*mapR/337)
		}
	}else{
		image(water, vertex.x + delX, vertex.y + delY, width, mapR*2);
	}
}

function manual(name, resource, amount){
	var goodName = false;
	var goodResource = false;
	for(i in players){
		if(players[i].name == name){
			goodName = true;
		}else{}
	}
	for(i in hexagonTypes){
		if(hexagonTypes[i] == resource){
			goodResource = true;
		}else{}
	}

	if(!goodName){
		console.error('The name you entered was not found.')
		console.error("Follow this format: manual('Joe', 'wool', -2)")
	}else if(!goodResource){
		console.error('Please enter a valid resource. Resource must be wood, wool, grain, brick, or ore.')
		console.error("Follow this format: manual('Joe', 'wool', -2)")
	}else if(typeof amount != 'number'){
		console.error('Please enter a valid amount. Amount must be a number.')
		console.error("Follow this format: manual('Joe', 'wool', -2)")
	}else{
		for(i in players){
			if(players[i].name == name){
				players[i][resource] += Math.floor(amount);
			}else{}
		}
		updateResourceDisplay();
	}
}

function preload(){
	grain = loadImage(grain);
	brick = loadImage(brick);
	desert = loadImage(desert);
	wood = loadImage(wood);
	wool = loadImage(wool);
	ore = loadImage(ore);
	water = loadImage(water);
	any_ship = loadImage(any_ship);
	wood_ship = loadImage(wood_ship);
	wool_ship = loadImage(wool_ship);
	ore_ship = loadImage(ore_ship);
	grain_ship = loadImage(grain_ship);
	brick_ship = loadImage(brick_ship);
	waterAL = loadImage(waterAL);
	waterAR = loadImage(waterAR);
	waterBL = loadImage(waterBL);
	waterBR = loadImage(waterBR);
	waterSL = loadImage(waterSL);
	waterSR = loadImage(waterSR);
	undo_icon = loadImage(undo_icon);
	robber = loadImage(robber);
	devCard_icon = loadImage(devCard_icon);
}