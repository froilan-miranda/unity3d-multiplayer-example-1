#pragma strict

private var xInputScript:XInput;
private var gameScript:GameController;
private var sessionBeginScript:SessionBeginController;
private var introductionScript:IntroductionController;
private var practiceScript:PracticeController;
private var level01Script:Level01Controller;
private var initPracticePos:Array;
private var initLevel01Pos:Array;
private var exeMessages:boolean = true;  //use to stop execution of incoming messages. for idle machines

private var messageQ:String[];
private var prefix:String;

public function Start ():void 
{
	xInputScript = GetComponent(XInput);
	gameScript = GetComponent(GameController);
}

 public function FixedUpdate ():void
{
	if(xInputScript.serverConnected == true)
		SetMessageQ();
}

/************************************
 **  code for sending information
 *************************************/

internal function SendClient(message:String, protocol:String):void
{
	if(protocol == "udp")
		xInputScript. SendClientUDP(prefix + message);
	else if (protocol == "tcp")
		xInputScript. SendClient(prefix + message);
}

internal function SendHost(message:String, protocol:String):void
{
	if(protocol == "udp")
		xInputScript.SendHostUDP(prefix + message);
	else if (protocol == "tcp")
		xInputScript.SendHost(prefix + message);
}

internal function SendLeaderboard(message:String, protocol:String):void
{
	if(protocol == "udp")
		xInputScript.SendLeaderboardUDP(prefix + message);
	else if (protocol == "tcp")
		xInputScript.SendLeaderboard(prefix + message);
}

internal function SendGlobal(message:String, protocol:String):void
{
	if(protocol == "udp")
		xInputScript.SendGlobalUDP(prefix + message);
	else if (protocol == "tcp")
		xInputScript.SendGlobal(prefix + message);
}

internal function InitComm(playerNumber:int):void
{
	SetPrefix(playerNumber);
	SendHost("Initiated", "tcp");
}

internal function SetPrefix(playerNumber:int):void
{
	prefix = "ROV|" + playerNumber + "|";
}

/************************************
 **  code for receiving information
 *************************************/

internal function SetMessageQ():IEnumerator
{
	messageQ = null;
	messageQ = xInputScript.GetMessages();
	ProccessMessageQ();
}

internal function ProccessMessageQ():void
{
	// iterate through the array
	for (var mess:String in messageQ) {
		ReceivedMessage(mess);
	}
}

internal function OnLevelWasLoaded(level:int):IEnumerator
{
	Debug.Log("on level loaded");
	
	switch(level){
		case 0:
			// Load Start Up Scene Scripts
			break;
		case 1:
			// Load Splash Scene Scripts
			exeMessages = true;
			break;
		case 2:
			//  Load Enter Initials Scripts
			break;
		case 3:
			sessionBeginScript = GameObject.Find("Session Begin Manager").GetComponent(SessionBeginController);
			Debug.Log(sessionBeginScript + " was loaded");
			break;
		case 4:
			introductionScript = GameObject.Find("Introduction Manager").GetComponent(IntroductionController);
			Debug.Log(introductionScript + " was loaded");
			break;
		case 5:
			practiceScript = GameObject.Find("Practice Manager").GetComponent(PracticeController);
			Debug.Log(practiceScript + " was loaded");
			break;
		case 6:
			level01Script = GameObject.Find("Level 01 Manager").GetComponent(Level01Controller);
			Debug.Log(level01Script + " was loaded");
		default:
			Debug.Log("An unexpected level was loaded");
			break;
	}
}

/********************************
 ** Process Received Message
  *******************************/
internal function ReceivedMessage(message:String):void
{
	var messSegs:Array = message.Split("|"[0]);
	
/* the following is to be executed, reguardless of game state (e.g. wait for next session to begin) */
	if((messSegs[0] == "RESET") || (messSegs[0] == "GO_ISI" && Application.loadedLevel  == 8)) {
		Debug.Log("received message to execute: " + messSegs[0]);
		gameScript.ResetGame();
	} 

/* the following will only be executed if client is actively playing */
	if(exeMessages == true){
		switch(messSegs[0]){
			case "GO_INSTRUCTIONS" :
				if(Application.loadedLevel != 3){
					exeMessages = false;  // stop messages if machine is not in use
					Application.LoadLevel(8);  // got to waiting screen
				}else{
					sessionBeginScript.HostSentStart();
				}
				Debug.Log("received message to execute: " + messSegs[0]);
				break;
			case "GO_TNFA" :
				introductionScript.StepNext();
				Debug.Log("received message to execute: " + messSegs[0]);
				break;
			case "GO_TNFB" :
				introductionScript.StepNext();
				Debug.Log("received message to execute: " + messSegs[0]);
				break;
			case "GO_IL23" :
				introductionScript.StepNext();
				Debug.Log("received message to execute: " + messSegs[0]);
				break;
			case "GO_IL12" :
				introductionScript.StepNext();
				Debug.Log("received message to execute: " + messSegs[0]);
				break;
			case "START_PRACTICE" :
				Debug.Log("recived message to execute:" + messSegs[0]);
				introductionScript.StepNext();
				initPracticePos = messSegs;  // hold for later use by Practice Controller
				Debug.Log("practice pos:" + initPracticePos);
				break;
			case "LOCK_REQUEST" :
				Debug.Log("received message to execute: " + messSegs[0]);
				if(Application.loadedLevel == 5)
					practiceScript.RequestLockReply(messSegs);
				if(Application.loadedLevel == 6)
					level01Script.RequestLockReply(messSegs);
				break;
			case "START_GAME" :
				Debug.Log("received message to execute: " + messSegs[0]);
				practiceScript.HostSentStart();
				initLevel01Pos = messSegs;  // hold for later use by Level 01 script
				Debug.Log("level 1 pos:" + initLevel01Pos);
				break;
			case "TNF" :
				Debug.Log("received message to execute: " + messSegs[0]);
				level01Script.HostSentMove(messSegs);
				break;
			case "ROV" :
				//Debug.Log("received message to execute: " + messSegs[0]);
				if(Application.loadedLevel == 5)
					practiceScript.HostSentPosOther(messSegs);	
				if(Application.loadedLevel == 6)
					level01Script.HostSentPosOther(messSegs);
				break;
			case "RESET" :
				Debug.Log("received message to execute: " + messSegs[0]);
				gameScript.ResetGame();
				break;
			case "EOG" :
				Debug.Log("received message to execute: " + messSegs[0]);
				level01Script.InitEOG(messSegs);
				break;
			case "GO_ISI" :
				Debug.Log("received message to execute: " + messSegs[0]);
				Application.LoadLevel(7);
			default :
				Debug.Log("Unrecognized value: " + messSegs[0]);
				break;
		}//switch
	}// if
}
internal function RetrievePracticePos():Array
{
	return initPracticePos;
}
internal function RetrieveLevel01Pos():Array
{
	return initLevel01Pos;
}