#pragma strict

import viJoystickLib;

internal var oPP:PlayerPrefs;
private var settingsScript:SettingsController;
private var netScript:NetworkController;
private var xInputScript:XInput;
private var sfxScript:SoundEffectsController;
public var useJoystick:boolean;
public var joystickThreshold:float;

public var jm:JoystickManager;
public var joystick:Joystick;

function Start ()
{
	 //Keep these object persistant
	DontDestroyOnLoad(GameObject.Find("Sound Manager")); 
	DontDestroyOnLoad(gameObject);

	oPP = new PlayerPrefs();
	settingsScript = GetComponent(SettingsController);
	netScript = GetComponent(NetworkController);
	xInputScript = GetComponent(XInput);
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);

	jm = new JoystickManager();
	joystick = jm.Joysticks[0];

}

function Update ()
{
	 if (Input.GetKeyDown(KeyCode.Escape)) {
		Application.Quit();
	}
}

internal function InitGame():void
{
	//Grab and set player number from settings to object
	xInputScript.ConnectGameServer();
	oPP.SetPlayerNumber(settingsScript.GetSetting("playerNumber"));
	netScript.InitComm(oPP.GetPlayerNumber());

	if(settingsScript.GetSetting("useJoystick") == 1){
		useJoystick = true;
		Debug.Log("joystick Preferences true");
	}else if(settingsScript.GetSetting("useJoystick") == -1){
		useJoystick = false;
		Debug.Log("joystick Preferences false");
	}else{
		Debug.Log("joystick Preferences Unrecognized");
	}

	joystickThreshold = settingsScript.GetSetting("joystickThreshold");

	// initiate audio
	sfxScript.InitAudio();
	
	//Exit Level
	Debug.Log("Ready to exit level");
	Application.LoadLevel(1);
}

//Reset Game
internal function ResetGame():IEnumerator
{
	yield oPP.ClearAll();
	netScript.SendHost("Idle", "tcp");
	Application.LoadLevel(1);
}

/********************************************************
 **	Player Preferences class to hold persistant player data
 ********************************************************/
internal class PlayerPrefs extends System.Object
{
	private var playerNumber:int;
	private var playerInitials:String;

	public function PlayerPrefs()
	{

	}

	internal function SetPlayerNumber(number:int):void
	{
		playerNumber = number;
	}
	internal function GetPlayerNumber():int
	{
		return playerNumber;
	}
	internal function SetPlayerInitials(initials:String):void
	{
		playerInitials = initials;
	}
	internal function GetPlayerInitials():String
	{
		return playerInitials;
	}
	internal function ClearAll():IEnumerator
	{
		playerInitials = null;
	}
}