private var motor : ROVMotor;
private var gameScript:GameController;
internal var joystick:Joystick;

// Use this for initialization
function Awake () 
{
	motor = GetComponent(ROVMotor);
	Debug.Log("FP awake");
}
function Start()
{
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);

	if(gameScript.useJoystick == true && joystick == null)
		joystick = gameScript.joystick;
}
// Update is called once per frame
function Update () 
{
	var directionVector;
	var rotateVector;

	//Debug.Log("X: " + joystick.X.ToString() + " Y: " + joystick.Y.ToString() + " Thumb: " + joystick.Thumb.ToString());
	
	// Get the input vector from kayboard(wdsa) or analog stick
	if(gameScript.useJoystick == true){
		directionVector = new Vector3(0, 0, joystick.Y);
		var rotationX:float;
		if(joystick.Y < 0)
			rotationX = -(joystick.X);
		rotateVector = new Vector3(0, joystick.X, 0);

		if(Mathf.Abs(joystick.X) < gameScript.joystickThreshold)
			rotateVector = new Vector3(0, 0, 0);
		if(Mathf.Abs(joystick.Y) < gameScript.joystickThreshold)
			directionVector = new Vector3(0, 0, 0);

		if (joystick.Thumb)
			motor.ThumbPress();

	}else if(gameScript.useJoystick == false){
		directionVector = new Vector3(0, 0, Input.GetAxis("Vertical"));
		if( Input.GetAxis("Vertical") < 0)
			rotationX = -(Input.GetAxis("Vertical"));
		rotateVector = new Vector3(0, Input.GetAxis("Horizontal"), 0);
	}

	if (directionVector != Vector3.zero && !gameScript.useJoystick) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;

		// Make sure the length is no bigger than 1	
		directionLength = Mathf.Min(1, directionLength);

		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;

		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
		//Debug.Log("Direction Vector" + directionVector);
	}

	if (rotateVector != Vector3.zero && !gameScript.useJoystick) {
		var rotateLength = rotateVector.magnitude;

		rotateVector = rotateVector / rotateLength;

		rotateLength = Mathf.Min(1, rotateLength);

		rotateLength = rotateLength * rotateLength;

		rotateVector = rotateVector * rotateLength;
		//Debug.Log("Rotation Vector" + rotateVector);
	}
	// Apply the direction to the CharacterMotor
	motor.inputRotateDirection = rotateVector;
	motor.inputMoveDirection = transform.rotation * directionVector;
}

// Require a ROVMotor to be attached to the same game object
@script RequireComponent(ROVMotor)