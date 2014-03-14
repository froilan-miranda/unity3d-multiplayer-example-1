#pragma strict

public var txtrWaiting:Texture2D; 
public var customGUI:GUISkin; 

function Start ()
{

}

function Update ()
{

}

function OnGUI()
{
	GUI.skin = customGUI;
	GUI.Box(Rect((Screen.width - txtrWaiting.width)/2, (Screen.height - txtrWaiting.height)/2, txtrWaiting.width, txtrWaiting.height), txtrWaiting, "blankbox");
}