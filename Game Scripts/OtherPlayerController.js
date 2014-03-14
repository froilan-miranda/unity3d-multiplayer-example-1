#pragma strict

private var settingsScript:SettingsController;
private var playerNumber:int;
public var aFlaring:Texture2D[] = new Texture2D[6];
public var aBody:Texture2D[] = new Texture2D[6];
public var aLegLeft:Texture2D[] = new Texture2D[6];
public var aLegRight:Texture2D[] = new Texture2D[6];
public var bubbleVolume:float;

private var propel01:GameObject;
private var propel02:GameObject;

function Start () 
{
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);

	propel01 = GameObject.Find("propeller01");
	propel02 = GameObject.Find("propeller02");

	yield SetSettings();
	audio.volume = bubbleVolume;
}

function Update () 
{
	propel01.transform.rotation.eulerAngles.z += 0.5;
	propel02.transform.rotation.eulerAngles.z += 0.5;
}

internal function SkinROV(playerNum:int):void
{
	playerNumber = playerNum;
	gameObject.name = "player " + playerNumber;
	renderer.materials[0].mainTexture = aBody[playerNumber - 1];
	renderer.materials[4].mainTexture = aLegRight[playerNumber - 1];
	renderer.materials[8].mainTexture = aFlaring[playerNumber - 1];
	renderer.materials[9].mainTexture = aLegLeft[playerNumber - 1];
}
function SetSettings():IEnumerator
{
	bubbleVolume = settingsScript.GetSetting("opponentBubbles");
}