#pragma strict

public var customGUI:GUISkin;
private var gameScript:GameController;
private var settingsScript:SettingsController;
private var showPage01:boolean = false;
private var showPage02:boolean = false;
public var txtrIsiPage01:Texture2D;
public var txtrIsiPage02:Texture2D;
private var waitOnIsiPage01:int = 4;
private var waitOnIsiPage02:int = 4;

function Start () {
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);

	//Stop ambient sounds
	GameObject.Find("Ambient Sound").audio.Stop();
	
	//Grab relavent values from .ini file
	yield ImportSettings();

	InitISI();
}
private function ImportSettings():IEnumerator
{
	waitOnIsiPage01 = settingsScript.GetSetting("waitOnIsiPage1");
	waitOnIsiPage02 = settingsScript.GetSetting("waitOnIsiPage2");
}
function Update () 
{
	if(Input.GetButtonUp("Fire1")){
		if(showPage01 == true){
			showPage01 = false;
			showPage02 = true;
		}else if (showPage02 == true){
			//showPage02 = false;
			LevelExit();
		}else{
			Debug.Log("not showing any page");
		}
	}
}

public function OnGUI():void
{
	GUI.skin = customGUI;

	if(showPage01)
		GUI.Box(Rect(0, 0, 1920, 1080), txtrIsiPage01, "blankbox");		//show first page of ISI
	if(showPage02)
		GUI.Box(Rect(0, 0, 1920, 1080), txtrIsiPage02, "blankbox");		//show second page of ISI
}

private function InitISI():IEnumerator
{
	showPage01 = true;
	yield WaitForSeconds(waitOnIsiPage01);
	showPage01 = false;
	showPage02 = true;
	yield WaitForSeconds(waitOnIsiPage02);
	LevelExit();
}

private function AdvancePage():void
{
	showPage01 = false;
	showPage02 = true;
}

private function LevelExit():void
{
	//Application.LoadLevel(1);
	gameScript.ResetGame();
}
