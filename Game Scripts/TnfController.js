#pragma strict

private var targeted : boolean = false;
private var targetedBy:int = 0;
private var level01Script:Level01Controller = null;
private var gameScript:GameController;
public var matTnfInactive:Material;
private var waitOnFadeOut:int = 4;
private var tnfHighlight:GameObject;

private var sfxScript:SoundEffectsController;

function Start () 
{
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);

	if(Application.loadedLevel == 6)
		level01Script = GameObject.Find("Level 01 Manager").GetComponent(Level01Controller);

	tnfHighlight = transform.Find("Tnf alpha highlight").gameObject;
	tnfHighlight.active = false;
}

function Update () 
{
	transform.Rotate(Vector3(0, 1, 0));
}

function OnMouseUpAsButton () 
{
	Debug.Log("tnf clicked");
	
	if(targeted && targetedBy == gameScript.oPP.GetPlayerNumber()){
		sfxScript.playAudio("scan");
  		Debug.Log("tnf clicked");
  		Debug.Log("Ready to Initiate quiz");
  		SetBusy();

  		if(level01Script != null){
	  		// tell game logic to initiate question sequence
	  		level01Script.InitateQuestion();
	  	}
  	}
}
internal function SetTargetedBy(rov:int):void
{
	targetedBy = rov;
}
internal function SetTargeted(isTargeted:boolean):void
{
	targeted = isTargeted;
}

internal function SetActive():void
{
	gameObject.tag = "TNF Active";
	gameObject.collider.enabled = true;
	SetTargeted(false);
	SetTargetedBy(-1);
	tnfHighlight.active = false;
}
internal function SetLocked():void
{
	gameObject.tag = "TNF Locked";
	tnfHighlight.active = (true);
}
private function SetBusy():void
{
	gameObject.tag = "TNF Busy";
	gameObject.collider.enabled = false;
}

internal function SetInactive():void
{
	gameObject.tag = "TNF Inactive";
	gameObject.collider.enabled = false;
	gameObject.renderer.material = matTnfInactive;
	iTween.MoveTo(gameObject, {"y":-5, "oncomplete":"RemoveTnf", "oncompletetarget":gameObject, "delay" : 1});
	tnfHighlight.active = false;
}
internal function GetTnfStatus():String
{
	return gameObject.tag;
}
internal function MoveToPoint(newPoint:Vector3):void
{
	//Debug.Log(newPoint);
	iTween.MoveTo(gameObject, { "position":newPoint, "time":6, "oncomplete":"SetActive", "oncompletetarget":gameObject, "delay" : 1});
}

private function RemoveTnf():IEnumerator
{
	yield WaitForSeconds(waitOnFadeOut);
	iTween.FadeTo(gameObject, 0, 4);
	Destroy(gameObject);
}
