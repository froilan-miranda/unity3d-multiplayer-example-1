#pragma strict

private var totalScore:int = 0;
private var showScore:boolean = false;

public var customGUI:GUISkin;

public function OnGUI()
{
	GUI.skin = customGUI;

	if(showScore)
			GUI.Box(Rect((Screen.width-1325)/2, (Screen.height-657)/2, 1315, 657), totalScore.ToString("n0"), "totalscorebox");
}

internal function ShowFinalScore(show:boolean)
{
	showScore = show;
}

internal function SetScore(score:int)
{
	totalScore = score;
}