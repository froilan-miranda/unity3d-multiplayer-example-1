#pragma strict

private var level01Script:Level01Controller;
private var tnfLocated:boolean;  // a variable to determine if locator is locked on to a tnf-a

function Start () {
	level01Script = GameObject.Find("Level 01 Manager").GetComponent(Level01Controller);
}

function Update () {

}

internal function OnTriggerEnter(triggerObject : Collider) 
{
	if (triggerObject.tag == "TNF Active" && tnfLocated == false) {
		// toggle to true so locator doesn't attemp to lock on to more than one tnf
		tnfLocated = true;
		// turn off collider so that it does not send more message request
		collider.enabled = false;

		// tell level login to react to tnf found
		level01Script.OnTnfLocated(triggerObject.transform.gameObject);

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
internal function SetInactive():void
{
	collider.enabled = false;
}
/**********************************************
 ** Class for holding the current target info
 **********************************************/
class TnfTarget extends System.Object
{
	
}