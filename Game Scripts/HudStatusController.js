#pragma strict

import System.Collections.Generic;

private var statusBar:GameObject;
private var statusTxtrList:List.<Texture2D> = new List.<Texture2D>();;

// status bar textures for introduction
public var txtrIntro_01:Texture2D;
public var txtrIntro_02:Texture2D;
public var txtrIntro_03:Texture2D;
public var txtrIntro_04:Texture2D;
public var txtrIntro_05:Texture2D;

// status bar textures for practice
public var txtrPractice_01:Texture2D;
public var txtrPractice_02:Texture2D;
public var txtrPractice_03:Texture2D;

// status bar textures for level 1
public var txtrLevel01_01:Texture2D;
public var txtrLevel01_02:Texture2D;
public var txtrLevel01_03:Texture2D;
public var txtrLevel01_04:Texture2D;

function Start () 
{
	statusBar = GameObject.Find("Status Bar Message");

	 if(Application.loadedLevelName == "04_Introduction")
	 	InitStatusIntro();
	 else if (Application.loadedLevelName == "05_Practice")
	 	InitStatusPractice();
	 else if (Application.loadedLevelName == "06_Level_01")
	 	InitStatusLevel01();
}

private function InitStatusIntro():void
{
	statusTxtrList.Add(txtrIntro_01);  //instructions
	statusTxtrList.Add(txtrIntro_02); //tnfa introduction
	statusTxtrList.Add(txtrIntro_03); //tnfb introduction
	statusTxtrList.Add(txtrIntro_04); //il23 introduction
	statusTxtrList.Add(txtrIntro_05); //il12 introduction
}
private function InitStatusPractice():void
{
	statusTxtrList.Add(txtrPractice_01);  //move forward
	statusTxtrList.Add(txtrPractice_02);  //pull trigger
	statusTxtrList.Add(txtrPractice_03);  //wait for game to begin
}
private function InitStatusLevel01():void
{
	statusTxtrList.Add(txtrLevel01_01);  //search for tnf-a
	statusTxtrList.Add(txtrLevel01_02);  //pull trigger
	statusTxtrList.Add(txtrLevel01_03);  //question
	statusTxtrList.Add(txtrLevel01_04);  //good job
}
internal function SwapStatus(statusIndex:int):void
{
	statusBar.renderer.material.mainTexture = statusTxtrList[statusIndex];
}