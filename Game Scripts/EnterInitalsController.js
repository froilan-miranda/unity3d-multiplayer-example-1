#pragma strict

import viJoystickLib;

private var joystick:Joystick;

private var gameObj:GameObject;
private var gameScript:GameController;
private var netScript:NetworkController;
public var customGUI:GUISkin;
private var charList:Array;

private var initialFirst:String ="_";
private var initialSecond:String ="_";
private var initialThird:String ="_";

private var  initialFirstIndex:int = -1;
private var  initialSecondIndex:int = -1;
private var  initialThirdIndex:int = -1;

public var bgInitialBoxNorm:Texture2D;
public var bgInitialBoxFocus:Texture2D;

private var currentControl:String = "initialFirst";

private var canFireThumb:boolean = false;
private var settingsScript:SettingsController;
private var waitOnClick:float = 5.00;

private var sfxScript:SoundEffectsController;

function Start ()
{
	gameObj = GameObject.Find("Game Manager");
	gameScript = gameObj.GetComponent(GameController);
	netScript = gameObj.GetComponent(NetworkController);
	settingsScript = gameObj.GetComponent(SettingsController);
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);

	yield GetSettings();
	canFireThumb = true;

	if (gameScript.useJoystick == true && joystick == null)
		joystick = gameScript.joystick;

	InitCharList();
	InvokeRepeating("InitialsUpdate", 0.0 , 0.25);
}
function Update () 
{
	//Debug.Log("X: " + joystick.X.ToString() + " Y: " + joystick.Y.ToString() + " Thumb: " + joystick.Thumb.ToString());
	//Debug.Log(Input.GetAxis ("Vertical")); 
	//Debug.Log(Input.GetAxis ("Horizontal")); 
	if(gameScript.useJoystick == true && currentControl == "initialComplete"){ // &&  joystick.Thumb.ToString() == "True"
		InitialsSubmit();
	}else if(gameScript.useJoystick == false && Input.GetButtonUp("Fire1")){
		InitialsSubmit();
	}
}
function OnGUI()
{

	GUI.skin = customGUI;

	GUI.BeginGroup (new Rect (279, 131, 1362, 818));
	    GUILayout.BeginHorizontal ("initialcontainer");

			if(currentControl == "initialFirst")
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxFocus;
			else
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxNorm; 
	    	GUILayout.Box(initialFirst, "initialbox");

			if(currentControl == "initialSecond")
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxFocus;
			else
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxNorm;
			GUILayout.Box(initialSecond, "initialbox");

			if(currentControl == "initialThird")
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxFocus;
			else
				GUI.skin.customStyles[0].normal.background =  bgInitialBoxNorm;
			GUILayout.Box(initialThird, "initialbox");
		GUILayout.EndHorizontal();
	GUI.EndGroup();
}

private function InitCharList():void
{
	charList = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");

	for (var chars in charList){
		Debug.Log(chars);
	}
}

private function CharListIncrease():void
{
	switch(currentControl){
		case "initialFirst" :
			if(initialFirstIndex < charList.length - 1)
				initialFirstIndex++;
			else
				initialFirstIndex = 0;
			initialFirst = charList[initialFirstIndex];
			break;
		case "initialSecond" :
			if(initialSecondIndex < charList.length - 1)
				initialSecondIndex++;
			else
				initialSecondIndex = 0;
			initialSecond = charList[initialSecondIndex];
			break;
		case "initialThird" :
			if(initialThirdIndex < charList.length - 1)
				initialThirdIndex++;
			else
				initialThirdIndex = 0;
			initialThird = charList[initialThirdIndex];
			break;
	} //switch
	sfxScript.playAudio("selectCharacter");
}

private function CharListDecrease():void
{
	switch(currentControl) {
		case "initialFirst" :
			if(initialFirstIndex > 0)
				initialFirstIndex--;
			else
				initialFirstIndex = charList.length - 1;
			initialFirst = charList[initialFirstIndex];
			break;
		case "initialSecond" :
			if(initialSecondIndex > 0)
				initialSecondIndex--;
			else
				initialSecondIndex = charList.length - 1;
			initialSecond = charList[initialSecondIndex];
			break;
		case "initialThird" :
			if(initialThirdIndex > 0)
				initialThirdIndex--;
			else
				initialThirdIndex = charList.length - 1;
			initialThird = charList[initialThirdIndex];
			break;
	}//switch
	sfxScript.playAudio("selectCharacter");
}

private function SwitchControlPrev():void
{
	switch (currentControl){
		case "initialFirst" :
			Debug.Log("first control, do nothing");
			currentControl = "initialFirst";
			break;
		case "initialSecond" :
			Debug.Log("second control, move to first");
			currentControl = "initialFirst";
			sfxScript.playAudio("selectInitial");
			break;
		case "initialThird" :
			Debug.Log("third control, move to second");
			currentControl = "initialSecond";
			sfxScript.playAudio("selectInitial");
			break; 
	}//switch
}//SwitchControlPrev

private function SwitchControlNext():void
{
	switch (currentControl){
		case "initialFirst" :
			Debug.Log("first control, go to second");
			currentControl = "initialSecond";
			sfxScript.playAudio("selectInitial");
			break;
		case "initialSecond" :
			Debug.Log("second control, move to third");
			currentControl = "initialThird";
			sfxScript.playAudio("selectInitial");
			break;
		case "initialThird" :
			Debug.Log("third control,  move nowhere");
			currentControl = "initialThird";
			break; 
		case "initialComplete":
			Debug.Log("You should not be here. Ever.");
	}//switch
}

private function InitialsUpdate():void
{
	if(gameScript.useJoystick == true){
		if( joystick.Y > 0.50){
			Debug.Log("time to change a letter");
			CharListIncrease();
		}else if( joystick.Y < -0.50){
			Debug.Log("time to change a letter");
			CharListDecrease();
		}

		Debug.Log(joystick.X + ":" + joystick.Y);
		if( joystick.X < -0.50){
			Debug.Log("time to change initial controls");
			SwitchControlPrev();
		}else if( joystick.X > 0.50 || (joystick.Thumb && canFireThumb)){
			Debug.Log("time to change initial controls");
			if (joystick.Thumb && currentControl == "initialThird")
				currentControl = "initialComplete"; //Our only escape
			ResetClick();
			SwitchControlNext();
		}
	}else if(gameScript.useJoystick == false){
		if(Input.GetAxis ("Vertical") > 0.50){
			Debug.Log("time to change a letter");
			CharListIncrease();
		}else if(Input.GetAxis("Vertical") < -0.50){
			Debug.Log("time to change a letter");
			CharListDecrease();
		}

		if(Input.GetAxis("Horizontal") < -0.50){
			Debug.Log("time to change initial controls");
			SwitchControlPrev();
		}else if(Input.GetAxis("Horizontal") > 0.50){
			Debug.Log("time to change initial controls");
			SwitchControlNext();
		}
	}
}
private function GetSettings():IEnumerator
{
	waitOnClick = settingsScript.GetSetting("waitOnClick");
}
private function ResetClick():IEnumerator
{	
	canFireThumb = false;
	yield WaitForSeconds(waitOnClick);
	canFireThumb = true;
}
private function InitialsSubmit():IEnumerator
{
	sfxScript.playAudio("sendInitials");

	//combine Initials
	var initials = initialFirst + initialSecond + initialThird;
	
	// set initials to player prefs
	gameScript.oPP.SetPlayerInitials(initials);
	// send to host
	netScript.SendHost("Initials|" + gameScript.oPP.GetPlayerInitials(), "tcp");
	LevelExit();
}

private function LevelExit():void
{
	Application.LoadLevel(3);
}