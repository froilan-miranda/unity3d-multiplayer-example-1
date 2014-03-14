var startOnVisible : boolean = true;
var uvAnimationTileX = 24; //Here you can place the number of columns of your sheet. 
                           //The above sheet has 24

var uvAnimationTileY = 1; //Here you can place the number of rows of your sheet. 
                          //The above sheet has 1
var framesPerSecond : float = 10.0;
var useShared : boolean = false;

private var myMaterial : Material;

//private var enabledAtStart : boolean;
function Awake() {
    var rend : Renderer = GetComponentInChildren(Renderer);
    if (useShared)
        myMaterial = rend.sharedMaterial;
    else
        myMaterial = rend.material;
}

function OnBecameVisible() {
	if (startOnVisible)
    	enabled = true;
}

function OnBecameInvisible() {
	if (!useShared)
	    enabled = false;
}

function Update () {

    // Calculate index
    var index : int = Time.time * framesPerSecond;
    // repeat when exhausting all frames
    index = index % (uvAnimationTileX * uvAnimationTileY);
    
    // Size of every tile
    var size = Vector2 (1.0 / uvAnimationTileX, 1.0 / uvAnimationTileY);
    
    // split into horizontal and vertical index
    var uIndex = index % uvAnimationTileX;
    var vIndex = index / uvAnimationTileX;

    // build offset
    // v coordinate is the bottom of the image in opengl so we need to invert.
    var offset = Vector2 (uIndex * size.x, 1.0 - size.y - vIndex * size.y);
    
    myMaterial.SetTextureOffset ("_MainTex", offset);
    myMaterial.SetTextureScale ("_MainTex", size);
}