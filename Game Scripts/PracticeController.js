#pragma strict

private var hudStatusScript:HudStatusController;
private var gameScript:GameController;
private var netScript:NetworkController;
private var reticleScript:ReticleController;
private var locatorScript:LocatePracticeController;
private var rovScript:ROVMotor;
private var lockedOn:boolean = false;
public var customGUI:GUISkin;
public var txtrGoodJob:Texture2D;
private var showGoodJob:boolean = false;
private var playerPrefabArray:GameObject[];  //to hold and organize other player prefabs
private var tnfPrefabArray:Array;
public var playerPrefab:GameObject;
public var tnfPrefab:GameObject;

private var sfxScript:SoundEffectsController;

function Start () {
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);
	netScript = GameObject.Find("Game Manager").GetComponent(NetworkController);
	rovScript = GameObject.Find("ROV Manager").GetComponent(ROVMotor);
	hudStatusScript = GameObject.Find("HUD Manager").GetComponent(HudStatusController);
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);
	reticleScript = GameObject.Find("ROV Manager/Reticle").GetComponent(ReticleController);
	locatorScript = GameObject.Find("ROV Manager/Locator").GetComponent(LocatePracticeController);
	
	//update Status bar
	hudStatusScript.SwapStatus(0);

	//initiate and null out player reference array
	 playerPrefabArray = new GameObject[6];
	 playerPrefabArray[0] = (null);
	 playerPrefabArray[1] = (null);
	 playerPrefabArray[2] = (null);
	 playerPrefabArray[3] = (null);
	 playerPrefabArray[4] = (null);
	 playerPrefabArray[5] = (null);

	 InitStartPos(netScript.RetrievePracticePos());

	InvokeRepeating("SendClientPosSelf", 0, 0.025);
	InvokeRepeating("SendLeaderboardPosSelf", 0, 0.1);
}
function Update()
{
	if(((lockedOn == true && Input.GetButtonUp("Fire1")) || rovScript.getThumbPress() && showGoodJob != true && lockedOn == true)){
		//rovScript.thumbPressLocked = true;
		showGoodJob = true;
		sfxScript.playAudio("scan");
		hudStatusScript.SwapStatus(2);
		netScript.SendHost("Practice_Done|" + gameScript.oPP.GetPlayerNumber(), "tcp");
		Debug.Log("Practice_Done|" + gameScript.oPP.GetPlayerNumber());
	}

	if(showGoodJob == true && Input.GetKeyUp("y"))
		LevelExit();

	//UpdatePosSelf();
}
function OnGUI () 
{
	GUI.skin = customGUI;

	if(showGoodJob)
		GUI.Box(Rect((Screen.width - txtrGoodJob.width)/2, (Screen.height - txtrGoodJob.height)/2, txtrGoodJob.width, txtrGoodJob.height), txtrGoodJob, "introductionbox");
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
		var tnfLocked:GameObject = GameObject.Find(data[2]);

		//tell rov to center on this Tnf, turn player control off
		rovScript.TnfLocated(tnfLocked.transform);

		//update HUD status bar
		hudStatusScript.SwapStatus(1);

		// initiate reticle
		reticleScript.OnTnfLocked(tnfLocked.transform.position);

		//tell target to except mouse event
		tnfLocked.GetComponent(TnfController).SetTargeted(true);

		// Grab tnf and set it's  "locked by" value to appropriate player number
		tnfLocked.GetComponent(TnfController).SetTargetedBy(int.Parse(data[1]));

		// Turn on tnf highlight
		tnfLocked.GetComponent(TnfController).SetLocked();

		//set mode to locked and look for trigger fire in Update()
		lockedOn = true;

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
private function InitStartPos(data:Array)
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
	if(data[1] != gameScript.oPP.GetPlayerNumber() && data[2] !=  "Practice_Done"){
		var otherPlayer:GameObject = playerPrefabArray[int.Parse(data[1]) -1];
		var newX:float = float.Parse(data[2]);
		var newZ:float = float.Parse(data[3]);
		var newRot:float = float.Parse(data[4]);
		var newPos:Vector3 = new Vector3(newX, 0, newZ);
		otherPlayer.transform.position = newPos;
		otherPlayer.transform.eulerAngles.y = newRot;

	}
}

internal function HostSentStart():void
{
	LevelExit();
}

internal function LevelExit():IEnumerator
{
	Application.LoadLevel(6);
}