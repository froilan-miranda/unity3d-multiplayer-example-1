#pragma strict

private var gameScript:GameController;
private var fpInputScript:FPInputController;
private var rollMeter:GameObject;
private var useJoystick:boolean;

function Start () {
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);
	fpInputScript = GameObject.Find("ROV Manager").GetComponent(FPInputController);

	rollMeter = GameObject.Find("HUD Manager/Tilt Manager/Tilt Meter Rotator");
	useJoystick = gameScript.useJoystick;
}

function Update () {
	// add rotation based on horizontal movement
	if(useJoystick)
		rollMeter.transform.localEulerAngles.z = fpInputScript.joystick.X * fpInputScript.joystick.Y * -10;
		//Debug.Log(rollMeter.transform.localEulerAngles.z + ":" + fpInputScript.joystick.X + ":" + fpInputScript.joystick.Y);
	else
		rollMeter.transform.localEulerAngles.z = Input.GetAxis("Horizontal") * Input.GetAxis("Vertical") * -10;
}

//(GameObject.Find("Game Manager").GetComponent(GameController).useJoystick == true)