#pragma strict

private var videoPlane:GameObject;
private var movie:MovieTexture;
private var netScript:NetworkController;
private var gameScript:GameController;

private function Awake()
{
  Debug.Log("Video Controller Awake");
}

private function Start()
{
	videoPlane = GameObject.Find("Video Plane");
	netScript = GameObject.Find("Game Manager").GetComponent(NetworkController);
	gameScript = GameObject.Find("Game Manager").GetComponent(GameController);

	movie = videoPlane.renderer.material.mainTexture;
	movie.loop = true;
	movie.Play();
}

private function Update()
{
	if(Input.GetButtonUp("Fire1")){
		netScript.SendHost("GameStart", "tcp");
		movie.Stop();
		LevelExit();
	}
}

private function LevelExit():void
{
	 	Debug.Log("Splash video exiting to next level");
	 	Application.LoadLevel(2);
}