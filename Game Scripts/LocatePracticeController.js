#pragma strict

private var practiceScript:PracticeController;
private var tnfLocated:boolean = false;  // a variable to determine if locator is locked on to a tnf-a

function Start () {
	practiceScript = GameObject.Find("Practice Manager").GetComponent(PracticeController);
}

function Update () {

}

function OnTriggerEnter(triggerObject : Collider) 
{
	Debug.Log("top of trigger code");

	if (triggerObject.tag == "TNF Active" && tnfLocated == false) {
		// toggle to true so locator doesn't attemp to lock on to more than one tnf
		tnfLocated = true;
		// turn off collider so that it does not send more message request
		collider.enabled = false;

		// tell level login to react to tnf found
		practiceScript.OnTnfLocated(triggerObject.transform.gameObject);

		Debug.Log("TNF has enter locator zone");
		Debug.Log("Debuging: " + triggerObject);

	}else{
		Debug.Log("Someting else has entered the locator zone:" + triggerObject);
	}
}

internal function TnfRelease():void
{
	// toggle to false so locator resumes attemps to lock on to tnfs
	tnfLocated = false;
	// turn collider back on 
	collider.enabled = true;
}
