private var level01Script:Level01Controller;
private var settingsScript:SettingsController;
private var bgDoorLeft:GameObject;
private var bgDoorRight:GameObject;
private var fgQuestion:GameObject;
public var txtrInvisBttn:Texture2D;
public var customGUI:GUISkin;
private var aQuestions:Array;
private var questionIndex:int = 0;
private var txtrLoadedQA:Texture2D;
private var txtrLoadedFactoid:Texture2D;
private var answerCorrect:boolean;
private var showFactoid:boolean = false;
private var waitOnAnswer:int = 2;
private var waitOnFactoid:int;
private var results:Array  = new Array();  // to keep track of right/wrong
private var timeStart:float;
private var timeStop:float;
private var timeElapsed:float;
private var buttonResponse:boolean = false;
private var questionActive:boolean = false;

//Score stuff
private var totalScore:int = 0;
private var showScore:boolean = false;
private var gameComplete:boolean = false;

private var sfxScript:SoundEffectsController;

function Start ()
{
	sfxScript = GameObject.Find("Sound Effects").GetComponent(SoundEffectsController);
	bgDoorLeft = GameObject.Find("BG Left");
	bgDoorRight = GameObject.Find("BG Right");
	fgQuestion = GameObject.Find("Question Plane");
	level01Script = GameObject.Find("Level 01 Manager").GetComponent(Level01Controller);
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);

	//Grab relavent values from .ini file
	ImportSettings();

	//initialize doors out of view
	bgDoorLeft.transform.position.x = -53.4;
	bgDoorRight.transform.position.x = 53.4;
	fgQuestion.active = false;  //hide question

	CreateQuestions();
}
function OnGUI()
{
	GUI.skin = customGUI;

	// show/hide invisible buttons
	if(fgQuestion.active && buttonResponse == true){
		if(aQuestions[questionIndex].txtrA != ""){
			if(GUI.Button(Rect(330, 475, 525, 225), txtrInvisBttn, "blankbutton")){
				Debug.Log("answered a"); //answered a
				Answered("a");
				buttonResponse = false;
			}
		}

		if(aQuestions[questionIndex].txtrB != ""){
			if(GUI.Button(Rect(1025, 475, 525, 225), txtrInvisBttn, "blankbutton")){
				Debug.Log("answered b"); //answered b
				Answered("b");
				buttonResponse = false;
			}
		}

		if(aQuestions[questionIndex].txtrC != ""){
			if(GUI.Button(Rect(330, 800, 525, 225), txtrInvisBttn, "blankbutton")){
				Debug.Log("answered a"); //answered c
				Answered("c");
				buttonResponse = false;
			}
		}

		if(aQuestions[questionIndex].txtrD != ""){
			if(GUI.Button(Rect(1025, 800, 525, 225), txtrInvisBttn, "blankbutton")){
				Debug.Log("answered b"); //answered d
				Answered("d");
				buttonResponse = false;
			}
		}
	}// show/hide invisible buttons

	// show/hide factoid
	if(showFactoid)
		GUI.Box(Rect((Screen.width - txtrLoadedFactoid.width) * 0.5,Screen.height - (txtrLoadedFactoid.height * 1.5), 720, 328), txtrLoadedFactoid, "factoidbox");

	if(showScore)
		GUI.Box(Rect((Screen.width-1325)/2, (Screen.height-657)/2, 1315, 657), totalScore.ToString("n0"), "totalscorebox");

}// OnGUI

private function CreateQuestions():IEnumerator
{
	aQuestions = new Array();
	
	aQuestions.Add(new Question(1, "Q1/q1_start", "Q1/q1_INC_A", "Q1/q1_COR_B", "", "", "b", "Q1/fact_Q01"));

	aQuestions.Add(new Question(2, "Q2/q2_start", "Q2/q2_COR_A", "Q2/q2_INC_B", "Q2/q2_INC_C", "Q2/q2_INC_D", "a", "Q2/fact_Q02"));

	aQuestions.Add(new Question(3, "Q3/q3_start", "Q3/q3_INC_A", "Q3/q3_INC_B", "Q3/q3_INC_C", "Q3/q3_COR_D", "d", "Q3/fact_Q03"));

	aQuestions.Add(new Question(12, "Q12/q12_start", "Q12/q12_INC_A", "Q12/q12_INC_B", "Q12/q12_INC_C", "Q12/q12_COR_D", "d", "Q12/fact_Q12"));

	aQuestions.Add(new Question(5, "Q5/q5_start", "Q5/q5_INC_A", "Q5/q5_INC_B", "Q5/q5_INC_C", "Q5/q5_COR_D", "d", "Q5/fact_Q05"));

	aQuestions.Add(new Question(6, "Q6/q6_start", "Q6/q6_INC_A", "Q6/q6_INC_B", "Q6/q6_INC_C", "Q6/q6_COR_D", "d", "Q6/fact_Q06"));

	aQuestions.Add(new Question(7, "Q7/q7_start", "Q7/q7_INC_A", "Q7/q7_INC_B", "Q7/q7_COR_C", "Q7/q7_INC_D", "c", "Q7/fact_Q07"));

	aQuestions.Add(new Question(8, "Q8/q8_start", "Q8/q8_COR_A", "Q8/q8_INC_B", "Q8/q8_INC_C", "Q8/q8_INC_D", "a", "Q8/fact_Q08"));

	aQuestions.Add(new Question(9, "Q9/q9_start", "Q9/q9_INC_A", "Q9/q9_INC_B", "Q9/q9_INC_C", "Q9/q9_COR_D", "d", "Q9/fact_Q09"));

	aQuestions.Add(new Question(10, "Q10/q10_start", "Q10/q10_INC_A", "Q10/q10_COR_B", "", "", "b", "Q10/fact_Q10"));

	aQuestions.Add(new Question(11, "Q11/q11_start", "Q11/q11_INC_A", "Q11/q11_COR_B", "Q11/q11_INC_C", "Q11/q11_INC_D", "b", "Q11/fact_Q11"));

	aQuestions.Add(new Question(4, "Q4/q4_start", "Q4/q4_INC_A", "Q4/q4_COR_B", "Q4/q4_INC_C", "Q4/q4_INC_D", "b", "Q4/fact_Q04"));

	aQuestions.Add(new Question(13, "Q13/q13_start", "Q13/q13_INC_A", "Q13/q13_INC_B", "Q13/q13_COR_C", "Q13/q13_INC_D", "c", "Q13/fact_Q13"));

	Debug.Log("Questions created");

}

internal function InitQuestion():void
{
	questionActive = true;

	sfxScript.playAudio("doorClose");

	//bring doors back into view
	iTween.MoveTo(bgDoorLeft, {"x" : -17.8, "time" : 1.0});
	iTween.MoveTo(bgDoorRight, {"x" : 17.8, "time" : 1.0, "oncomplete" : "ShowQuestion", "oncompletetarget" : gameObject});
}
private function ShowQuestion():void
{
	// add current question start texture to the foreground
	txtrLoadedQA  = Resources.Load("Questions/" + aQuestions[questionIndex].txtrQStart);
	fgQuestion.renderer.material.mainTexture = txtrLoadedQA;

	Debug.Log("Questions" + aQuestions[questionIndex].txtrQStart);
	fgQuestion.active = true; //show question
	buttonResponse = true;

	timeStart = Time.time;
}
private function Answered(answer:String)
{
	timeStop = Time.time;
	timeElapsed = timeStop - timeStart;

	// check answer and add result to results array
	if(answer == aQuestions[questionIndex].answer){
		sfxScript.playAudio("correct");

		answerCorrect = true;
		results[questionIndex] = true;
	} else {
		sfxScript.playAudio("incorrect");

		answerCorrect = false;
		results[questionIndex] = false;
	}

	// unload texture to make way for new one
	Resources.UnloadAsset(txtrLoadedQA);
	
	//swap q/a image
	switch(answer){
		case "a" :
			txtrLoadedQA = Resources.Load("Questions/" + aQuestions[questionIndex].txtrA);
			fgQuestion.renderer.material.mainTexture = txtrLoadedQA;
			Debug.Log(aQuestions[questionIndex].txtrA);
			break;
		case "b" :
			txtrLoadedQA = Resources.Load("Questions/" + aQuestions[questionIndex].txtrB);
			fgQuestion.renderer.material.mainTexture = txtrLoadedQA;
			Debug.Log(aQuestions[questionIndex].txtrB);
			break;
		case "c" :
			txtrLoadedQA = Resources.Load("Questions/" + aQuestions[questionIndex].txtrC);
			fgQuestion.renderer.material.mainTexture = txtrLoadedQA;
			Debug.Log(aQuestions[questionIndex].txtrC);
			break;
		case "d" :
			txtrLoadedQA = Resources.Load("Questions/" + aQuestions[questionIndex].txtrD);
			fgQuestion.renderer.material.mainTexture = txtrLoadedQA;
			Debug.Log(aQuestions[questionIndex].txtrD);
			break;
		default :
			Debug.Log("Error processing answer: " + answer);
			break;
	}//switch

	yield WaitForSeconds(waitOnAnswer);
	UninitQuestion(answer);

}
private function UninitQuestion(clientAnswer:String):IEnumerator
{
	questionActive = false;

	//remove question
	fgQuestion.active = false; //hide question

	// unload texture to make way for new one
	Resources.UnloadAsset(txtrLoadedQA);

	sfxScript.playAudio("doorOpen");

	//open doors out of view
	iTween.MoveTo(bgDoorLeft, {"x" : -53.4, "time" : 1});
	iTween.MoveTo(bgDoorRight, {"x" : 53.4, "time" : 1});

	// return result, question number, time elapsed, client answer
	level01Script.SendResult(answerCorrect, questionIndex + 1, timeElapsed, clientAnswer);

	// if correct show factoid
	if(answerCorrect)
		 yield InitFactoid();

	if(gameComplete)
		ShowFinalScore(true);

	//tell level logic that question is done and continue game play
	level01Script.OnQuestionComplete();

	//increment question index by 1 and reset if needed
	if (questionIndex < aQuestions.length - 1)
		questionIndex++;
	else if (questionIndex == aQuestions.length - 1)
		questionIndex = 0;
}
internal function CancelQuestion():void
{
	//remove question
	fgQuestion.active = false; //hide question

	// unload texture to make way for new one
	Resources.UnloadAsset(txtrLoadedQA);

	sfxScript.playAudio("doorOpen");

	//open doors out of view
	iTween.MoveTo(bgDoorLeft, {"x" : -53.4, "time" : 1});
	iTween.MoveTo(bgDoorRight, {"x" : 53.4, "time" : 1});
}
internal function GetQuestionActive():boolean
{
	return questionActive;
}
private function InitFactoid():IEnumerator
{
	//load current question factoid
	Debug.Log(aQuestions[questionIndex].txtrFactoid);
	txtrLoadedFactoid = Resources.Load("Questions/" + aQuestions[questionIndex].txtrFactoid);

	sfxScript.playAudio("factoid");

	showFactoid = true;  //show factoid
	yield WaitForSeconds(waitOnFactoid);
	showFactoid = false; //hide factoid
	Resources.UnloadAsset(txtrLoadedFactoid);  //unload factoid
}

private function ImportSettings()
{
	waitOnFactoid = settingsScript.GetSetting("waitOnFactoid");
}

internal function GameComplete(done:boolean)
{
	gameComplete = done;
}

internal function ShowFinalScore(show:boolean)
{
	if(showFactoid)
		showFactoid = false;
	
	showScore = show;
}

internal function SetScore(score:int)
{
	totalScore = score;
}

/**********************************************
 ** Class for holding  question info
 **********************************************/
private class Question extends System.Object
{
	internal var questionId:int;
	internal var txtrQStart:String;
	internal var txtrA:String;
	internal var txtrB:String;
	internal var txtrC:String;
	internal var txtrD:String;
	internal var answer:String;
	internal var txtrFactoid:String;

	public function Question(qId:int, questionStart:String, answerA:String, answerB:String, answerC:String, answerD:String, correctAnswer:String, factoid:String)
	{
		questionId = qId;
		txtrQStart = questionStart;
		txtrA = answerA;
		txtrB = answerB;
		txtrC = answerC;
		txtrD = answerD;
		answer = correctAnswer;
		txtrFactoid = factoid;
	}
}