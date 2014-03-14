#pragma strict

import System.Collections.Generic;

public var customGUI:GUISkin;
public var txtrIntro:Texture2D;
public var txtrTnfA:Texture2D;
public var txtrTnfB:Texture2D;
public var txtrIl23:Texture2D;
public var txtrIl12:Texture2D;
private var stepsList:List.<String>;
private var currentStep:String = "initiating";
private var hudStatusScript:HudStatusController;
private var settingsScript:SettingsController;
private var hudScript:HudController;

private var sfxScript:SoundEffectsController;
private var ambientSound:GameObject;
private var ambientVolume:float;
function Awake()
{
	Debug.Log("Introduction awake");
}
function Start()
{
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);
	hudStatusScript = GameObject.Find("HUD Manager").GetComponent(HudStatusController);
	hudScript = GameObject.Find("HUD Manager").GetComponent(HudController);
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);
	ambientSound = GameObject.Find("Ambient Sound");

	yield SetSettings();
	ambientSound.audio.volume = ambientVolume;
	ambientSound.audio.Play();
	
	hudScript.InitOffscreen();

	InitStepIndex();
}
function Update()
{
	if (Input.GetKeyUp ("p")){
 		StepPrev();
	}else if (Input.GetKeyUp("n")){
		StepNext();
	}
}
function OnGUI()
{
	GUI.skin = customGUI;

	switch(currentStep){
		case "initiating" :
			//Debug.Log("starting up scene");
			break;
		case "intro" :
			GUI.Box(Rect((Screen.width - txtrIntro.width)/2, (Screen.height - txtrIntro.height)/1.25, txtrIntro.width, txtrIntro.height), txtrIntro, "introductionbox");
			break;
		case "tnf-a" :
			GUI.Box(Rect((Screen.width - txtrTnfA.width)/2, (Screen.height - txtrTnfA.height)/1.25, txtrTnfA.width, txtrTnfA.height), txtrTnfA, "introductionbox");
			break;
		case "tnf-b" :
			GUI.Box(Rect((Screen.width - txtrTnfB.width)/2, (Screen.height - txtrTnfB.height)/1.25, txtrTnfB.width, txtrTnfB.height), txtrTnfB, "introductionbox");
			break;
		case "il-23" :
			GUI.Box(Rect((Screen.width - txtrIl23.width)/2, (Screen.height - txtrIl23.height)/1.25, txtrIl23.width, txtrIl23.height), txtrIl23, "introductionbox");
			break;
		case "il-12" :
			GUI.Box(Rect((Screen.width - txtrIl12.width)/2, (Screen.height - txtrIl12.height)/1.25, txtrIl12.width, txtrIl12.height), txtrIl12, "introductionbox");
			break;
		default :
			Debug.Log("Error: unknown value of currentStep in switch statement");
			break;
	}
}
private function InitStepIndex():IEnumerator
{
	stepsList = new List.<String>();
	stepsList.Add("intro");
	stepsList.Add("tnf-a");
	stepsList.Add("tnf-b");
	stepsList.Add("il-23");
	stepsList.Add("il-12");

	yield WaitForSeconds(2);
	InitIntro();
}
private function InitIntro():void
{
	currentStep = stepsList[0];
	sfxScript.playAudio("moleculeSlideOn");
}
private function StepPrev():void
{
	var currentIndex:int = stepsList.IndexOf(currentStep);

	if(currentIndex != 0)
		currentStep = stepsList[currentIndex - 1];

	UpdateStatusBar();
}
internal function StepNext():void
{
	var currentIndex:int = stepsList.IndexOf(currentStep);

	if(currentIndex < stepsList.Count - 1)
		currentStep = stepsList[currentIndex + 1];
	else if (currentIndex == stepsList.Count - 1)
		ExitLevel();

	UpdateStatusBar();
	Debug.Log("next step reached");
	sfxScript.playAudio("moleculeSlideOn");
}
private function UpdateStatusBar():void
{
	var currentIndex:int = stepsList.IndexOf(currentStep);
	hudStatusScript.SwapStatus(currentIndex);
}
private function SetSettings():IEnumerator
{
	ambientVolume = settingsScript.GetSetting("ambientVolume");
}
private function ExitLevel():void
{
	Debug.Log("Go to next level");
	Application.LoadLevel(5);
}