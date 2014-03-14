#pragma strict

public var txtrWaiting:Texture2D; 
public var customGUI:GUISkin; 

function Start ()
{

}

function Update ()
{
	// to advance scene, for testing
	if(Input.GetKeyUp("y"))
		LevelExit();
}
function OnGUI()
{
	GUI.skin = customGUI;
	GUI.Box(Rect((Screen.width - txtrWaiting.width)/2, (Screen.height - txtrWaiting.height)/2, txtrWaiting.width, txtrWaiting.height), txtrWaiting, "blankbox");
}
internal function HostSentStart():void
{
	Debug.Log("Host is ready to start introduction level");
	LevelExit();
}
private function LevelExit():void
{
	Debug.Log("ready to proceed");
	Application.LoadLevel(4);
}
