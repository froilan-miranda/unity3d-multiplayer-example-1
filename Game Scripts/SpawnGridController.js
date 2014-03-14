import System.Collections.Generic;

/****************************************
 ** Class for holding general grid data
 ****************************************/
private class SpawnGrid extends System.Object
{
	internal var cols:int = 16;
	internal var rows:int = 9;

	private var gridW:int = 185;
	private var gridH:int = 88;

	internal var spaceW:int = gridW / cols;
	internal var spaceH:int = gridH / rows;

	//this is used to off set entire grid and center to playing area
	internal var offsetW:int = (gridW - (spaceW * (cols - 1))) * 0.5;
	internal var offsetH:int = (gridH - (spaceH * (rows - 1))) * 0.5;
}

/************************************
 ** Class for creating Spawn Points
 ************************************/
private class SpawnPoint extends System.Object
{
	internal var coordX:int;
	internal var coordY:int;
	internal var coordZ:int;

	function SpawnPoint(x:int, z:int, spaceW:int, spaceH:int, offsetW:int, offsetH:int)
	{
		//Debug.Log("hello world, I'm a spawn point");
		coordX = x * spaceW + offsetW;
		coordY = 10;
		coordZ = z * spaceH + offsetH;
	}
}


/*********************
 ** Begin Game Logic
 *********************/
private var grid:SpawnGrid = SpawnGrid();
private var aGrid:Array = new Array();
private var aAvailPoints = new Array();
private var availPointsList: List.<Vector2> = new List.<Vector2>();
private var gridManager:GameObject;
private var tnfManager:GameObject;
public var tnfPrefab:GameObject;
private var numTnf:int = 7;

public function Start ()
{	
	/*
	//alias game objects
	gridManager = GameObject.Find("Grid Manager");
	tnfManager = GameObject.Find("Tnf Spawn Manager");

	InitSpawnGrid();
	//BuildGridMarkers(); //~this is for visualizing all spawn points
	InitTnfPlacement();
	*/
}

public function Update ()
{
	//Debug.Log("space - " + grid.spaceW + " : " + grid.spaceH);
	//Debug.Log("offset - " + grid.offsetW + " : " + grid.offsetH);
}

private function InitSpawnGrid():void
{
	//create array and attach spawn point info
	for(var i=0; i<grid.cols; i++){
		aGrid[i] = new Array(); // Create a new, empty array at index i 

		for(var j=0; j<grid.rows; j++){
			aGrid[i][j] = new SpawnPoint(i, j, grid.spaceW, grid.spaceH, grid.offsetW, grid.offsetH);
			availPointsList.Add(Vector2(i,j));
		}
	}
}

private function InitTnfPlacement():void
{
	for(var i=0; i<numTnf; i++){
		//find random point from availible
		var openPointIndex:int = Random.Range(0, availPointsList.Count);
		var openPointVector:Vector2 = availPointsList[openPointIndex];

		//remove point from availible list
		availPointsList.RemoveAt(openPointIndex);

		//grab point info from 2D Array using position values from availPoints
		var prefabX:int = aGrid[openPointVector.x][openPointVector.y].coordX;
		var prefabZ:int = aGrid[openPointVector.x][openPointVector.y].coordZ;

		//instantiate and place tnf at point
		var clone:GameObject = Instantiate (tnfPrefab, Vector3(prefabX, 0, prefabZ), Quaternion.identity);
		clone.transform.parent = tnfManager.transform;	// Add to Tnf Manger for a bit of organization :)

		//use array position as name for later use making position available again
		clone.name = openPointVector.x + "," + openPointVector.y;
		Debug.Log(clone.name);
	}//for loop
}

internal function OnAnswered(targetTnf:GameObject, correct:boolean):void
{
	Debug.Log("here in spawn controller" + targetTnf.name);
	if(correct){
		// Deactivate and Move out of the way
		//  Create new Tnf and place
		UpdateCorrect(targetTnf);
	}else{
		// Move Tnf to another point update
		UpdateWrong(targetTnf);
	}
}

private function UpdateCorrect(targetTnf:GameObject):void
{
	targetTnf.GetComponent(TnfController).SetInactive();
	
	var GridPointNew:Vector2 = GetRandomOpenPoint();	//get new point
	var GridPointOld:Vector2 = GetOldPoint(targetTnf.name);  //get old point from name

	//remove new point from available list
	AvailableListRemove(GridPointNew);

	//grab new available point from Spawn Point Grid
	var spawnPoint:SpawnPoint = aGrid[GridPointNew.x][GridPointNew.y];

	//instantiate and place tnf at point
	var clone:GameObject = Instantiate (tnfPrefab, Vector3(spawnPoint.coordX, 0, spawnPoint.coordZ), Quaternion.identity);
	clone.transform.parent = tnfManager.transform;	// Add to Tnf Manger for a bit of organization :)

	//use array position as name for later use making position available again
	clone.name = GridPointNew.x + "," + GridPointNew.y;

	// add old point to available list
	AvailableListAdd(GridPointOld);

	Debug.Log(clone.name);
}
private function UpdateWrong(targetTnf:GameObject):void
{	
	var GridPointNew:Vector2 = GetRandomOpenPoint();	//get new point
	var GridPointOld:Vector2 = GetOldPoint(targetTnf.name);  //get old point from name

	//remove new point from available list
	AvailableListRemove(GridPointNew);

	//grab new available point from Spawn Point Grid
	var spawnPoint:SpawnPoint = aGrid[GridPointNew.x][GridPointNew.y];

	//use array position as name for later use making position available again
	targetTnf.name = GridPointNew.x + "," + GridPointNew.y;

	//  tell tnf to move to new point
	targetTnf.GetComponent(TnfController).MoveToPoint(Vector3(spawnPoint.coordX, 0, spawnPoint.coordZ));

	// add old point to available list
	AvailableListAdd(GridPointOld);

	Debug.Log(targetTnf.name);
}


internal function HostSentCorrect(oldName:String, newName:String, newPos:String)
{
	Debug.Log("here in correct");
	GameObject.Find(oldName).GetComponent(TnfController).SetInactive();

	var tnfPos = newPos.Split(","[0]);
	var clone:GameObject = Instantiate (tnfPrefab, Vector3(int.Parse(tnfPos[0]), 0, int.Parse(tnfPos[1])), Quaternion.identity);
	clone.name = newName;
}
internal function HostSentWrong(oldName:String, newName:String, newPos:String)
{
	Debug.Log("here in wrong");
	var tnf:GameObject = GameObject.Find(oldName);
	tnf.name = newName;

	var tnfPos = newPos.Split(","[0]);
	tnf.GetComponent(TnfController).MoveToPoint(Vector3(int.Parse(tnfPos[0]), 0, int.Parse(tnfPos[1])));
}


private function GetRandomOpenPoint():Vector2
{
	var openPointIndex:int = Random.Range(0, availPointsList.Count);
	var openPointVector:Vector2 = availPointsList[openPointIndex];

	Debug.Log("new x and y:" + openPointVector.x + "," + openPointVector.y);
	return openPointVector;
}

private function GetOldPoint(name:String):Vector2
{
	var oldPos = name.Split(","[0]);
	var oldX = int.Parse(oldPos[0]);
	var oldY = int.Parse(oldPos[1]);
	
	Debug.Log("old x and y: " + oldX + "," + oldY);
	return Vector2(oldX, oldY);
}

private function AvailableListRemove(newVector:Vector2):void
{
	availPointsList.Remove(newVector);
}

private function AvailableListAdd(oldVector:Vector2):void
{
	availPointsList.Add(oldVector);
}

/***************************************
 ** This function is used to view
 ** all spawn points on grid for testing
 ***************************************/
private function BuildGridMarkers():void
{
	//Begin vertical rows
	for(var i=0; i<grid.cols; i++)
	{
		//Begin horizontal rows
		for (var j=0; j<grid.rows; j++) {
			// grab refrence to spawn point
			var spawnPoint:Object = aGrid[i][j];

			// place object
			var sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
			sphere.transform.parent = gridManager.transform;
			sphere.transform.localScale = Vector3.one;
			sphere.transform.position = Vector3(spawnPoint.coordX, spawnPoint.coordY, spawnPoint.coordZ);
		}//end horizontal row
	}//end vertical row
}//BuildGrid