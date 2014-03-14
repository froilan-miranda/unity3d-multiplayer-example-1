#pragma strict

public var cameraTarget:Transform;

function LateUpdate()
{
	transform.position = new Vector3(cameraTarget.position.x, transform.position.y, cameraTarget.position.z);
	 transform.eulerAngles.y = cameraTarget.eulerAngles.y;
}