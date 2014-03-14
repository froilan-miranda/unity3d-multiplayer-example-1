#pragma strict

private var playerNumber:int;

private var rovLegs:GameObject;
private var rovCam:GameObject;

public var aCylinders:Texture2D[] = new Texture2D[6];
public var aLegLeft:Texture2D[] = new Texture2D[6];
public var aLegRight:Texture2D[] = new Texture2D[6];

private var fpInputScript:FPInputController;
private var gameManager:GameController;

function Start () 
{
	fpInputScript = GetComponent(FPInputController);
	rovLegs = GameObject.Find("ROV Manager/ROV FP Legs");
	rovCam = GameObject.Find("ROV Manager/Camera");
	playerNumber = GameObject.Find("Game Manager").GetComponent(GameController).oPP.GetPlayerNumber();
	SkinROV();
}

function Update () 
{
	// add rotation based on horizontal and veritcal movement
	if(GameObject.Find("Game Manager").GetComponent(GameController).useJoystick == true){
		rovLegs.transform.localEulerAngles.z = ( fpInputScript.joystick.X  *  fpInputScript.joystick.Y * -5);
		rovCam.transform.localEulerAngles.z = ( fpInputScript.joystick.X  *  fpInputScript.joystick.Y * -5);
	}else if(GameObject.Find("Game Manager").GetComponent(GameController).useJoystick == false){
		rovLegs.transform.localEulerAngles.z = (Input.GetAxis("Horizontal")  * Input.GetAxis("Vertical") * -5);
		rovCam.transform.localEulerAngles.z = (Input.GetAxis("Horizontal")  * Input.GetAxis("Vertical") * -5);
	}
}
internal function SkinROV():void
{
	rovLegs.renderer.materials[0].mainTexture =aLegLeft[playerNumber - 1];
	rovLegs.renderer.materials[4].mainTexture = aCylinders[playerNumber - 1];
	rovLegs.renderer.materials[5].mainTexture =aLegLeft[playerNumber - 1];
	rovLegs.renderer.materials[10].mainTexture = aLegRight[playerNumber - 1];
	rovLegs.renderer.materials[11].mainTexture = aLegRight[playerNumber - 1];
}