#pragma strict

private var countMeter:GameObject;
private var txtrArray:Array;
public var txtrCounter01:Texture2D;
public var txtrCounter02:Texture2D;
public var txtrCounter03:Texture2D;
public var txtrCounter04:Texture2D;
public var txtrCounter05:Texture2D;
public var txtrCounter06:Texture2D;
public var txtrCounter07:Texture2D;
private var tnfCount:int;

function Start () 
{
	countMeter = GameObject.Find("HUD Manager/Tnf Counter");
	tnfCount = 0;
	txtrArray = new Array();
	txtrArray.Add(txtrCounter01);
	txtrArray.Add(txtrCounter02);
	txtrArray.Add(txtrCounter03);
	txtrArray.Add(txtrCounter04);
	txtrArray.Add(txtrCounter05);
	txtrArray.Add(txtrCounter06);
	txtrArray.Add(txtrCounter07);
}

internal function IncreaseCount():void
{
	tnfCount++;
	countMeter.renderer.material.mainTexture = txtrArray[tnfCount - 1];
	
	if(tnfCount < 7){
		//continue game play	
	}else if (tnfCount == 7){
		// start EOG sequence
	}
}
internal function GetCount():int
{
	return tnfCount;
}