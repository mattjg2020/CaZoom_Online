var playerName;
var DBName;
var host;
var inLobby = false;
var inPreLobby = true;

AWS.config.update({
    region: "us-east-2",
    // endpoint: 'http://localhost:8000',
    // accessKeyId default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "AKIA4UCFAJ3GTR7IWRFZ",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "iYdjC9J6JIyWAXs+zeiIoRDN+v/JVfvHIqwGg5Ez"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

  
function makeLobby(){
    var params = {
        TableName : DBName,
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
            setTimeout(initiateLobby, 1000);
        }
    });
}

function initiateLobby(){
    var params = {
        TableName : DBName,
        Item:{
            "variable": "lobbyPlayers",
            "variableData": []
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
            setTimeout(initiateLobby, 1000);
        } else {
            finishLobbyInitiation();
        }
    });
}

function finishLobbyInitiation(){
    var items = [{
        "variable": "dateCreated",
        "variableData": new Date().getDate()
    },{
        "variable": "inLobby",
        "variableData": true
    },{
        "variable": "test",
        "variableData": 'lakdsjflk'
    }]
    for(i in items){
        var params = {
            TableName : DBName,
            Item: items[i]
        };
        docClient.put(params, function(err, data) {
            if (err) {
            }else{}
        });
    }
     
    document.getElementById('pageDarken').style.visibility = 'hidden';
    document.getElementById('loadingMessage').style.display = 'none';
    addName();
    inLobby = true;  
    deleteOldTables();    
}

function addName(){ 
        var params = {
            TableName: DBName,
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
                alert('The lobby you tried to join is unavailable')
                console.log("Unable to update item: " + "\n" + JSON.stringify(err, undefined, 2));
            } else {
                updateLobbyDisplay();
            }
        });
}

function preLobby(){
    if(document.getElementById('makeLobby').checked){
        document.getElementById('joinLobbyInputs').style.display = 'none';
        document.getElementById('makeLobbyInputs').style.display = 'block';
    }else if(document.getElementById('joinLobby').checked){
        document.getElementById('joinLobbyInputs').style.display = 'block';
        document.getElementById('makeLobbyInputs').style.display = 'none';
    }else{}
}

function attemptLobby(){
    host = document.getElementById('makeLobby').checked;
    if(host){
        playerName = document.getElementById('make_name').value;
        DBName = document.getElementById('make_lobbyName').value;
    }else{  
        playerName = document.getElementById('join_name').value;
        DBName = document.getElementById('join_lobbyName').value;
    }

    if(!validateName(playerName)){
        alert('Please give yourself a valid name \n Names must be 3 characters long \n Names can only contain characters a-z A-Z 0-9 _ . -')
    }else if(!validateName(DBName) && host){
        alert('Please give your lobby a valid name \n Lobby names must be 3 characters long \n Lobby names can only contain characters a-z A-Z 0-9 _ . -')
    }else{
        if(host){
            makeLobby();
        }else{
            addName();
            document.getElementById('preLobby').style.display = 'none';;
            inLobby = true;
            inPreLobby = false;
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
                if(tables[t] != DBName){
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
            if(createdDate < currentDate && (createdDate - currentDate) > 2){
                deleteIt = true;
            }else if(createdDate > currentDate && currentDate < 2){
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
        //the check for the visibility to make sure that you don't close out someone else's game if the lobby name you use is taken
        //this means that it only deletes the table if you are past the pregame screen (meaning you've made a new, unique table)
        //deletes the table in the database
        var params = {
            TableName : DBName
        };
        
        dynamodb.deleteTable(params, function(err, data) {});

        evt.returnValue = ''
        return null;
    }else{}    
});

function removePlayerFromLobby(player){   
    var params = {
        TableName: DBName,
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
                TableName: DBName,
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

function updateLobbyDisplay(){
    if(inLobby){
        document.getElementById('lobby').style.visibility = 'visible';
        document.getElementById('lobbyNameDisplay').innerHTML = 'Lobby: ' + DBName;

        var params = {
            TableName: DBName,
            Key:{
                "variable": 'lobbyPlayers'
            }
        };
    
        docClient.get(params, function(err, data) {
            if (err) {
                console.log("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
                alert('The lobby was closed');
            }else{
                var lobbyPlayersArray = data.Item.variableData;
                
                document.getElementById('lobbyPlayersDisplay').innerHTML = '<b style = "text-decoration: underline">Players: </b><br>';
                var namePresent = false;
                for(i in lobbyPlayersArray){
                    if(host && lobbyPlayersArray[i] != playerName){
                        document.getElementById('lobbyPlayersDisplay').innerHTML += lobbyPlayersArray[i] + `
                            <span onclick = "removePlayerFromLobby('` + lobbyPlayersArray[i] + `')" class = "removePlayer">
                            ` + ' x'.sup() + `</span><br>`;
                    }else{
                        document.getElementById('lobbyPlayersDisplay').innerHTML += lobbyPlayersArray[i] + '<br>';
                    }

                    if(lobbyPlayersArray[i] == playerName){
                        namePresent = true;
                    }else{}
                }
                if(host){
                    document.getElementById('lobbyPlayersDisplay').innerHTML += '<br><button onclick = "startGame()">Start Game</button>'; 
                }
                if(!namePresent){
                    alert('You were kicked out of the lobby')
                }else{
                    setTimeout(updateLobbyDisplay, 1000)
                }
            }
        })
    }else{
        document.getElementById('lobby').style.visibility = 'hidden';
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
