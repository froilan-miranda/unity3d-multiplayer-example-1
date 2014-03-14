#pragma strict

internal function OnTnfLocked(pos:Vector3):void
{
	iTween.MoveTo(gameObject, pos, 4);
}
internal function OnTnfReleased():void
{
	iTween.MoveTo(gameObject, { "position":Vector3(0,0,0), "time":2, "islocal":true});
}