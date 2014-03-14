import System;
import System.Collections.Generic;
import System.ComponentModel;
import System.Text;
import System.Net.Sockets;
import System.IO;
import System.Threading;

private var cm:ClientHelper = null;
internal var serverConnected:boolean = false;
	
// connect to the server
public  function Connect(serverIp:String):void
{
    if (cm == null){
        cm = new ClientHelper();
        cm.Connect(serverIp, 4444);
        cm.DataRecieved += new ClientHelper.DataRecievedEventHandler(cm_DataRecieved);
    }
}

// we got a message
private function cm_DataRecieved(data:String, protocol:Protocol):void
{
    if (protocol == Protocol.TCP){
        // we got a tcp message
       // Debug.Log("we got a tcp message");
    }else if (protocol == Protocol.UDP){
        //we got a udp message
       //Debug.Log("we got a udp message: ");
    }
}
internal function GetMessages():String[]
{
    if(cm != null){
        var messageQ:String[] = cm.GetMessages();
        return messageQ;
    } else {
        return null;
    }
}
// send a message to clients
public function SendClient(message:String):void
{
    cm.Send(message, PotentialDestination.client, Protocol.TCP);
}

// send a message to host
public function SendHost(message:String):void
{
    cm.Send(message, PotentialDestination.host, Protocol.TCP);
}

// send a message to leaderboard
public function SendLeaderboard(message:String):void
{
    cm.Send(message, PotentialDestination.leaderboard, Protocol.TCP);
}

// send a message to everyohne
public function SendGlobal(message:String):void 
{
    cm.Send(message, PotentialDestination.global, Protocol.TCP);
}

// send a message to clients
public function SendClientUDP(message:String):void 
{
    cm.Send(message, PotentialDestination.client, Protocol.UDP);
}

// send a message to host
public function SendHostUDP(message:String):void
{
    cm.Send(message, PotentialDestination.host, Protocol.UDP);
}

// send a message to leaderboard
public function SendLeaderboardUDP(message:String):void
{
    cm.Send(message, PotentialDestination.leaderboard, Protocol.UDP);
}

public function SendGlobalUDP(message:String):void
{
    cm.Send(message, PotentialDestination.global, Protocol.UDP);
}

public function Update ():void
{

}

public function Start ():void
{
    //Connect("10.0.0.22");
}
internal function ConnectGameServer():void
{
    Connect (GetComponent(SettingsController).GetServerIP());
    serverConnected = true;
}
public function OnApplicationQuit ():void
{

}
