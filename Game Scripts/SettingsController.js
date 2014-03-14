#pragma strict

import System.Xml;
import System.IO;

private var www:WWW;

function Start () {
	//Load XML data from a URL
	var url:String = "file://" + Application.dataPath + "/settings.ini";
	//Debug.Log(Application.dataPath);

	www = new WWW(url);
	yield www;
	Debug.Log(www.text);

	//now that settings are loaded tell game logic to continue
	GetComponent(GameController).InitGame();
}

internal function GetSetting(nodeName:String):float
{
	Debug.Log("Getting Setting");
	if(www != null){
		var reader:XmlTextReader = new XmlTextReader(new StringReader(www.text));
		reader.WhitespaceHandling = WhitespaceHandling.None;

		while(reader.Read()){
			if(reader.Name == nodeName){
				Debug.Log(reader.Name + " value = " + reader.GetAttribute("value"));
				var setting:float = float.Parse(reader.GetAttribute("value"));
				return setting;
			}
		}
		reader.Close();
	}else{
		Debug.Log("null ini file");
	}
}

// The server ip gets it's own settings call due to its need to return a string
// If this becomes a pattern the GetSetting function will need to be reworked
internal function GetServerIP():String
{
	Debug.Log("Getting Setting");
	if(www != null){
		var reader:XmlTextReader = new XmlTextReader(new StringReader(www.text));
		reader.WhitespaceHandling = WhitespaceHandling.None;

		while(reader.Read()){
			if(reader.Name == "serverIP"){
				Debug.Log(reader.Name + " value = " + reader.GetAttribute("value"));
				var setting:String = reader.GetAttribute("value");
				return setting;
			}
		}
		reader.Close();
	}else{
		Debug.Log("null ini file");
	}
}
