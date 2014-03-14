#pragma strict

private var settingsScript:SettingsController;

public var correct:AudioClip;
public var incorrect:AudioClip;
public var lock:AudioClip;
public var scan:AudioClip;
public var doorOpen:AudioClip;
public var doorClose:AudioClip;
public var factoid:AudioClip;

public var selectCharacter:AudioClip;
public var selectInitial:AudioClip;
public var sendInitials:AudioClip;

public var hudSlideOn:AudioClip;
public var moleculeSlideOn:AudioClip;

public var tnfLocked:AudioClip;

private var sfxVolume:float;

function Awake():void
{

}

public function playAudio(audioToPlay):IEnumerator
{
	switch (audioToPlay) {
		case "selectCharacter":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = selectCharacter;
			audio.Play();
			break;
		case "selectInitial":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = selectInitial;
			audio.Play();
			break;
		case "sendInitials":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = sendInitials;
			audio.Play();
			break;
		case "hudSlideOn":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = hudSlideOn;
			audio.Play();
			break;
		case "moleculeSlideOn":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = moleculeSlideOn;
			audio.Play();
			break;
		case "tnfLocked":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = tnfLocked;
			audio.Play();
			break;
		case "correct":
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = correct;
			audio.Play();
			break;
		case "incorrect" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = incorrect;
			audio.Play();
			break;
		case "lock" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = lock;
			audio.Play();
			break;
		case "scan" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = scan;
			audio.Play();
			break;
		case "doorOpen" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = doorOpen;
			audio.Play();
			break;
		case "doorClose" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = doorClose;
			audio.Play();
			break;
		case "factoid" :
			audio.Stop();
			audio.volume = sfxVolume;
			audio.clip = factoid;
			audio.Play();
			break;
		default :
			Debug.Log("What audio?");
			break;
	}
}

internal function InitAudio():void
{
	LoadSettings();
}

private function LoadSettings():void
{
	settingsScript = GameObject.Find("Game Manager").GetComponent(SettingsController);
	sfxVolume = settingsScript.GetSetting("sfxVolume");
}

@script RequireComponent(AudioSource) 