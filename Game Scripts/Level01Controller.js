#pragma strict

private var gameScript:GameController;
private var netScript:NetworkController;
private var hudStatusScript:HudStatusController;
private var hudQuestionScript:HudQuestionController;
private var hudCounterScript:HudCounterController;
private var locatorScript:LocateLevel01Controller;
private var reticleScript:ReticleController;
private var spawnGridScript:SpawnGridController;
private var settingsScript:SettingsController;
private var rovScript:ROVMotor;
private var targetedTnf:GameObject;
private var playerPrefabArray:GameObject[];  //to hold and organize other player prefabs
private var tnfPrefabArray:Array;
public var playerPrefab:GameObject;
public var tnfPrefab:GameObject;
private var lockedOn:boolean = false;
private var sendPosLeader:float;
private var sendPosClient:float;

private var sfxScript:SoundEffectsController;
private var ambientSound:GameObject;

function Start ()
{
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);
	netScript = GameObject.Find("Game Manager").GetComponent(NetworkController);
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);
	rovScript = GameObject.Find("ROV Manager").GetComponent(ROVMotor);
	locatorScript = GameObject.Find("ROV Manager/Locator").GetComponent(LocateLevel01Controller);
	reticleScript = GameObject.Find("ROV Manager/Reticle").GetComponent(ReticleController);
	spawnGridScript = GetComponent(SpawnGridController);
	hudStatusScript = GameObject.Find("HUD Manager").GetComponent(HudStatusController);
	hudQuestionScript = GameObject.Find("HUD Manager").GetComponent(HudQuestionController);
	hudCounterScript = GameObject.Find("HUD Manager").GetComponent(HudCounterController);

	//initiate and null out player reference array
	playerPrefabArray = new GameObject[6];
	playerPrefabArray[0] = (null);
	playerPrefabArray[1] = (null);
	playerPrefabArray[2] = (null);
	playerPrefabArray[3] = (null);
	playerPrefabArray[4] = (null);
	playerPrefabArray[5] = (null);

	yield InitStartPos(netScript.RetrieveLevel01Pos());

	//Grab relavent values from .ini file
	yield ImportSettings();

	//update HUD status bar
	hudStatusScript.SwapStatus(0);

	InvokeRepeating("SendClientPosSelf", 0, sendPosClient);
	InvokeRepeating("SendLeaderboardPosSelf", 0, sendPosLeader);
}

function Update () 
{
	//SendPosSelf();
}

internal function OnTnfLocated(triggerObject : GameObject):void
{
	//Send Request to game server for Tnf lock
	netScript.SendLeaderboard("Lock_Request|" + triggerObject.name, "tcp");
	Debug.Log("Lock_Request|" + triggerObject.name);
}

internal function RequestLockReply(data:Array):void
{
	if(int.Parse(data[1]) == gameScript.oPP.GetPlayerNumber() && lockedOn == false){
		// keep self from repeating code when LOCK_REQUEST is sent from server
		lockedOn = true; //	** remember to turn false **

		// Grab tnf and set it's  "locked by" value to appropriate player number
		targetedTnf = GameObject.Find(data[2]);
		targetedTnf.GetComponent(TnfController).SetTargetedBy(int.Parse(data[1]));

		// initiate reticle
		reticleScript.OnTnfLocked(targetedTnf.transform.position);

		//tell rov to center on this Tnf, turn player control off
		rovScript.TnfLocated(targetedTnf.transform);
		//update HUD status bar
		hudStatusScript.SwapStatus(1);

		//tell target to except mouse event
		targetedTnf.GetComponent(TnfController).SetTargeted(true);
		targetedTnf.GetComponent(TnfController).SetLocked();

		sfxScript.playAudio("tnfLocked");
		
		Debug.Log("Tnf locked");
	}else{
		Debug.Log("Tnf lock denied");

		// Grab tnf and set it's  "locked by" value to appropriate player number
		var opponentTargetScript = GameObject.Find(data[2]).GetComponent(TnfController);
		opponentTargetScript.SetTargetedBy(int.Parse(data[1]));
		opponentTargetScript.SetTargeted(true);
		opponentTargetScript.SetLocked();
		Debug.Log("player " + data[1] + " has locked tnf-a: " + data[2]);

		locatorScript.TnfRelease();
	}
}

internal function InitateQuestion():void
{
	Debug.Log("initiating question");
	//Update status bar
	hudStatusScript.SwapStatus(2);

	//Have Hud show question
	hudQuestionScript.InitQuestion();
}

internal function OnQuestionComplete():void
{
	//update HUD status bar
	hudStatusScript.SwapStatus(0);

	// tell locator to release the current tnf-a
	locatorScript.TnfRelease();

	//return rov control to player
	rovScript.TnfRelease();

	//release the lockedOn var 
	lockedOn = false;
}
internal function SendResult(correct:boolean, qNumber:int, time:float, clientAnswer:String):void
{
	netScript.SendLeaderboard("Question|" + qNumber + "|" + correct + "|" + targetedTnf.name + "|" + time + "|" + clientAnswer, "tcp");

	//if correct 
	if(correct){
		// increase tnf count dial
		hudCounterScript.IncreaseCount();
	}

	// release reticle
	reticleScript.OnTnfReleased();
}
internal function HostSentMove(data:Array)
{
	if(data[1] == "MOVE"){
		// do some move code
		Debug.Log("host sent MOVE");
		spawnGridScript.HostSentWrong(data[2],data[3],data[4]);
	}else if(data[1] == "KILL"){
		// do some kill code
		spawnGridScript.HostSentCorrect(data[2],data[3],data[4]);
		Debug.Log("host sent MOVE");
	}else{
		Debug.Log("error. Unknow move data sent");
	}
}

private function InitStartPos(data:Array):IEnumerator
{
	Debug.Log("initStartFromHost");
	//data[0]; //prefix id
	InitPlayerPositions(data[1]); //player pos
	InitTnfPositions(data[2]); // tnf pos
}

private function InitPlayerPositions(data:String)
{
	var players:Array = data.Split(";"[0]);

	for(var player:String in players){
		var pData:Array = player.Split(","[0]);
		Debug.Log(pData + " is inside the for loop");
		if(int.Parse(pData[0]) != gameScript.oPP.GetPlayerNumber()){
			Debug.Log("initializing player other");
			InitPlayerOther(pData);
		}else{
			Debug.Log("initializing player self");
			InitPlayerSelf(pData);
		}//if:else
	}//for
}

private function InitPlayerOther(data:Array)
{
	var newPlayerOther:GameObject = Instantiate(playerPrefab, Vector3 (int.Parse(data[1]), 0, int.Parse(data[2])), Quaternion.identity);
	playerPrefabArray[int.Parse(data[0]) - 1] = newPlayerOther;
	newPlayerOther.gameObject.transform.eulerAngles.y = int.Parse(data[3]);
	newPlayerOther.GetComponent(OtherPlayerController).SkinROV(int.Parse(data[0]));
	//grab script on newPlayer and set name
}

private function InitPlayerSelf(data:Array)
{
	playerPrefabArray[int.Parse(data[0]) - 1] = rovScript.gameObject;
	var xPos = int.Parse(data[1]);
	var zPos = int.Parse(data[2]);
	var rot = int.Parse(data[3]);
	//Set up fp rov
	rovScript.gameObject.transform.position.x = xPos;
	rovScript.gameObject.transform.position.z = zPos;
	rovScript.gameObject.transform.eulerAngles.y = rot;
}

private function InitTnfPositions(data:String)
{
	tnfPrefabArray = new Array();
	var tnfs:Array = data.Split(";"[0]);
	Debug.Log("Tnf count :" + tnfs.length);
	for(var tnf:String in tnfs){
		var tData:Array = tnf.Split(","[0]);
		Debug.Log(tData + " is inside the for loop");

		var newTnf:GameObject = Instantiate(tnfPrefab, Vector3(int.Parse(tData[2]), 0, int.Parse(tData[3])), Quaternion.identity);
		newTnf.name = tData[0] + "," + tData[1];
		Debug.Log("new tnf name : " + newTnf.name);
		tnfPrefabArray.Add(newTnf);
	}
}

private function SendClientPosSelf():void
{
	var posMess:String = rovScript.gameObject.transform.position.x + "|" + rovScript.gameObject.transform.position.z + "|" + rovScript.gameObject.transform.eulerAngles.y;
	netScript.SendClient(posMess, "udp");
}

private function SendLeaderboardPosSelf():void
{
	var posMess:String = rovScript.gameObject.transform.position.x + "|" + rovScript.gameObject.transform.position.z + "|" + rovScript.gameObject.transform.eulerAngles.y;
	netScript.SendLeaderboard(posMess, "udp");
}

internal function HostSentPosOther(data:Array):void
{
	if(int.Parse(data[1]) != gameScript.oPP.GetPlayerNumber()){
		var otherPlayer:GameObject = playerPrefabArray[int.Parse(data[1]) -1];
		var newX:float = float.Parse(data[2]);
		var newZ:float = float.Parse(data[3]);
		var newRot:float = float.Parse(data[4]);
		var newPos:Vector3 = new Vector3(newX, 0, newZ);
		otherPlayer.transform.position = newPos;
		otherPlayer.transform.eulerAngles.y = newRot;
	}
}

private function ImportSettings():IEnumerator
{
	sendPosLeader = settingsScript.GetSetting("sendLeaderPos");
	sendPosClient = settingsScript.GetSetting("sendClientPos");
}

internal function InitEOG(data:Array):IEnumerator
{
	rovScript.SetControllable(false);
	rovScript.thumbPressLocked = true;
	locatorScript.SetInactive();

	if(hudQuestionScript.GetQuestionActive()){
		Debug.Log("question is active");
		hudQuestionScript.CancelQuestion();
	}

	var playerNumber = gameScript.oPP.GetPlayerNumber();
	var scores:Array = data[2].ToString().Split(","[0]);

	hudQuestionScript.SetScore(int.Parse(scores[playerNumber-1]));

	if(playerNumber != int.Parse(data[1])){
		hudQuestionScript.ShowFinalScore(true);
	}else if(playerNumber == int.Parse(data[1])){
		hudQuestionScript.GameComplete(true);
	}
	//Debug.Log("winner is: " + data[1].GetType() + "| you are: " + playerNumber.GetType());
}
private function LevelExit():void
{
	Application.LoadLevel(7);
}