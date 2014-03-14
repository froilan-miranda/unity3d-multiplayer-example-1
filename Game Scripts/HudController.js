#pragma strict
private var sfxScript:SoundEffectsController;
private var minimap:GameObject;
private var statusBar:GameObject;
private var rollMeter:GameObject;
private var tnfCounter:GameObject; 

function Start () 
{
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);
	minimap = GameObject.Find("HUD Manager/Minimap Manager");
	statusBar = GameObject.Find("HUD Manager/Status Bar Manager");
	rollMeter = GameObject.Find("HUD Manager/Tilt Manager");
	tnfCounter = GameObject.Find("HUD Manager/Tnf Counter");
}

function Update () {

}
internal function InitOffscreen():void
{
	minimap.transform.position.x = 41.14;
	statusBar.transform.localPosition.y = 23.3;
	rollMeter.transform.position.x = 40.3;
	tnfCounter.transform.position.x = -42.5;

	MoveOnscreen();
}
private function MoveOnscreen():IEnumerator
{
	iTween.MoveTo(minimap, {"x":28.47, "delay":1});
	iTween.MoveTo(statusBar, {"y":17.05, "islocal":true, "delay":1});
	iTween.MoveTo(rollMeter, { "x":29.64, "delay":1});
	iTween.MoveTo(tnfCounter, {"x":-29.3346, "delay":1});
	yield WaitForSeconds(1);
	sfxScript.playAudio("hudSlideOn");
}