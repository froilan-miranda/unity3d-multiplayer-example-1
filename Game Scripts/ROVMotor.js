#pragma strict
#pragma implicit
#pragma downcast

class CharacterMotorMovement 
{
	// The maximum horizontal speed when moving
	internal var maxForwardSpeed : float = 20.0;
	internal var maxBackwardsSpeed : float = 10.0;

	internal var maxRotationSpeed : float = 20.0;
	
	// How fast does the character change speeds?  Higher is faster.
	internal var maxAcceleration : float = 20.0;

	// We will keep track of the character's current velocity,
	internal var velocity : Vector3;
	
	//We will keep track of the characters's rotation,
	internal var rotation : Vector3;

	// This keeps track of our current velocity while we're not grounded
	internal var frameVelocity : Vector3 = Vector3.zero;
}

private var canPlayerControl : boolean = true;	// Does this script currently respond to input?
private var useFixedUpdate : boolean = true;
internal var inputMoveDirection : Vector3 = Vector3.zero;  // The current global direction we want the character to move in.
internal var inputRotateDirection : Vector3 = Vector3.zero;  // The current global direction we want the character to rotate to.
private var targetDistance:int = 5;  // Distance for rov to keep when incountering TNF-a;
private var movement : CharacterMotorMovement = CharacterMotorMovement();
private var tr : Transform;
private var hasLocated : boolean;
private var tnfTarget : Transform;	//variable to hold the target TNF-a transform info
private var keepDistance:Vector3; // variable to hold the position to keep away from target tnf

private var thumbPressed : boolean = false;
internal var thumbPressLocked:boolean = false;

private var settingsScript:SettingsController;

function Awake () 
{
	tr = transform;
	Debug.Log("Motor is Awake, Zoom Zoom");
}
function Start():IEnumerator
{
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);
	yield GetSettings();
}
function GetSettings():IEnumerator
{
	movement.maxForwardSpeed = settingsScript.GetSetting("maxForwardSpeed");

	movement.maxBackwardsSpeed = settingsScript.GetSetting("maxBackwardsSpeed");

	movement.maxRotationSpeed = settingsScript.GetSetting("maxRotationSpeed");

	movement.maxAcceleration = settingsScript.GetSetting("maxAcceleration");
}
private function UpdateFunction () 
{
	// We copy the actual velocity into a temporary variable that we can manipulate.
	var velocity : Vector3 = movement.velocity;
	var rotation : Vector3 = movement.rotation;

	// Update rotation based on input
	rotation = ApplyInputRotationChange(rotation);

	// Update velocity based on input
	velocity = ApplyInputVelocityChange(velocity);

	// Save lastPosition for velocity calculation.
	var lastPosition : Vector3 = tr.position;

	// We always want the movement to be framerate independent.  Multiplying by Time.deltaTime does this.
	var currentMovementOffset : Vector3 = velocity * Time.deltaTime;
	tr.position += currentMovementOffset;

	var currentRotationOffset : Vector3 = rotation * Time.deltaTime;
	tr.Rotate(currentRotationOffset);


	// Calculate the velocity based on the current and previous position.  
	// This means our velocity will only be the amount the character actually moved as a result of collisions.
	var oldHVelocity : Vector3 = new Vector3(velocity.x, 0, velocity.z);
	movement.velocity = (tr.position - lastPosition) / Time.deltaTime;
	var newHVelocity : Vector3 = new Vector3(movement.velocity.x, 0, movement.velocity.z);
	
	// The CharacterController can be moved in unwanted directions when colliding with things.
	// We want to prevent this from influencing the recorded velocity.
	if (oldHVelocity == Vector3.zero) {
		movement.velocity = new Vector3(0, movement.velocity.y, 0);
	}
	else {
		var projectedNewVelocity : float = Vector3.Dot(newHVelocity, oldHVelocity) / oldHVelocity.sqrMagnitude;
		movement.velocity = oldHVelocity * Mathf.Clamp01(projectedNewVelocity) + movement.velocity.y * Vector3.up;
	}

	// Center and keep distance a located tnf-a
	if(hasLocated == true && tnfTarget != null) {
		iTween.MoveUpdate(gameObject, {"position":keepDistance, "looktarget":tnfTarget, "axis":"y", "time": 5});
		if (thumbPressed && !thumbPressLocked) {
			var tnfScript:TnfController = tnfTarget.gameObject.GetComponent("TnfController");
			/*****************************************************************
			*****************************************************************
			changed code here
			*****************************************************************
			*****************************************************************/
			//if(tnfScript.GetTnfStatus == "TNF Active"){
				tnfScript.OnMouseUpAsButton();
				thumbPressLocked = true;
			//}
		}
		//iTween.LookUpdate(gameObject, {"looktarget":tnfTarget, "axis": "y", "time": 10});
		//Debug.Log((transform.position - tnfTarget.transform.position).normalized * targetDistance + tnfTarget.transform.position);
	}

	thumbPressed = false;
}

function FixedUpdate () 
{
	if (useFixedUpdate)
		UpdateFunction();
}

function Update () 
{
	if (!useFixedUpdate)
		UpdateFunction();
}

private function ApplyInputRotationChange (rotate : Vector3)
{
	if(!canPlayerControl){
		inputRotateDirection = Vector3.zero;
	}

	var desiredVelocity:Vector3;

	desiredRotation =  tr.InverseTransformDirection(inputRotateDirection) * GetMaxRotation();

	var maxRotationChange:float = GetMaxRotation() * Time.deltaTime;
	var rotationChangeVector:Vector3 = (desiredRotation - rotate);
	//Debug.Log(desiredRotation + " " + rotate + " " + maxRotationChange);
	rotate += rotationChangeVector;

	return rotate;
}

private function ApplyInputVelocityChange (velocity : Vector3)
{	

	if (!canPlayerControl){
		inputMoveDirection = Vector3.zero;
	}

	// Find desired velocity
	var desiredVelocity : Vector3;

	desiredVelocity = GetDesiredHorizontalVelocity();
	//velocity.y = 0;
	
	// Enforce max velocity change
	var maxVelocityChange : float = GetMaxAcceleration() * Time.deltaTime;
	var velocityChangeVector : Vector3 = (desiredVelocity - velocity);
	if (velocityChangeVector.sqrMagnitude > maxVelocityChange * maxVelocityChange) {
		velocityChangeVector = velocityChangeVector.normalized * maxVelocityChange;
	}

	velocity += velocityChangeVector;

	return velocity;
}

private function GetDesiredHorizontalVelocity () 
{
	// Find desired velocity
	var desiredLocalDirection : Vector3 = tr.InverseTransformDirection(inputMoveDirection);
	
	var maxSpeed : float = MaxSpeedInDirection(desiredLocalDirection);

	return tr.TransformDirection(desiredLocalDirection * maxSpeed);
}

private function GetMaxRotation():float
{
	//Maximum rotation
	return movement.maxRotationSpeed;
}

private function GetMaxAcceleration () : float 
{
	// Maximum acceleration
	return movement.maxAcceleration;
}

internal function SetControllable (controllable : boolean) 
{
	canPlayerControl = controllable;
	thumbPressLocked = false;
}

// Project a direction onto elliptical quater segments based on forward, sideways, and backwards speed.
// The function returns the length of the resulting vector.
private function MaxSpeedInDirection (desiredMovementDirection : Vector3) : float
{
	if (desiredMovementDirection == Vector3.zero)
		return 0;
	else {
		var zAxisEllipseMultiplier : float = (desiredMovementDirection.z > 0 ? movement.maxForwardSpeed : movement.maxBackwardsSpeed);
		var temp : Vector3 = new Vector3(desiredMovementDirection.x, 0, desiredMovementDirection.z / zAxisEllipseMultiplier).normalized;
		var length : float = new Vector3(temp.x, 0, temp.z * zAxisEllipseMultiplier).magnitude;
		return length;
	}
}

internal function TnfLocated(target : Transform):void
{
	SetControllable(false);  	//turn player control off
	Debug.Log("Motor has recieved a message that a Tnf is located");
	hasLocated = true;
	tnfTarget = target;
	keepDistance = (transform.position - tnfTarget.transform.position).normalized * targetDistance + tnfTarget.transform.position;
}
internal function TnfRelease():void
{
	SetControllable(true);  	//turn player control off
	Debug.Log("Motor has recieved a message that a Tnf is released");
	hasLocated = false;
	tnfTarget = null;
}
internal function GetPlayerPosition():String
{
	return "10|20|10";
}

function ThumbPress() 
{
	thumbPressed = true;
}

function getThumbPress() :boolean
{
	return thumbPressed;
}