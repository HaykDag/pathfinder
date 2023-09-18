//these are options for the board and the nodes;
//canvas size , node size, rows and cols are depend from each other
//nodeSize*columns===canvasWidth
//nodeSize*rows===canvasHeigth
// window.addEventListener("resize",(event)=>{
//     canvas.width = event.target.innerWidth
// })
const settings = {
    canvasWidth: 800,
    canvasHeight:400,
    rows: 20,
    columns: 40,
    startNode:{
        row:7,
        col:5
    },
    endNode:{
        row:7,
        col:20
    },
    nodeSize:25,//make this getter canvasWith/rows or make rows and cols get
}

//get canvas , context, set width and heigth
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext("2d");
canvas.width = settings.canvasWidth;
canvas.height = settings.canvasHeight;

//get the buttons
const dijkstraBtn = document.getElementById("dijkstraBtn");
const aStarBtn = document.getElementById("A*Btn")
const resetBtn = document.getElementById("resetBtn");
const info = document.getElementById("info");
const infoShort = document.getElementById("infoShort");

//make 2D empty array by rows and cols
const grid = Array(settings.rows).fill().map(()=>Array(settings.columns).fill());
//inititialize the grid by filling it with nodes and setting the start and end nodes
let startNode = null;
let endNode = null;
initializeGrid(settings.rows,settings.columns);

//add listener on the pathfinder button
//when clicked call the dijkstra function
//the function will return all the visited nodes in order
//we will get the shortes Path by geting the last element of the 
//visitedNodes array(that will be the endNode) and backtrack to the startNode
dijkstraBtn.addEventListener("click",()=>{
    const visitedNodes = dijkstra(grid,startNode,endNode);
    //getting the shortes path
    const shortestPath = getShortestPath(visitedNodes[visitedNodes.length-1]);
    //as now we have all the visitedNodes and the shortesPath
    //we can animate them by just iterating first by visitedNodes array
    //afther that iterate by shortes path and visualize them by setting timeOut
    animate(visitedNodes,shortestPath);
});
aStarBtn.addEventListener("click",()=>{
    const visitedNodes = aStar(grid,startNode,endNode);

    const shortestPath = getShortestPath(visitedNodes[visitedNodes.length-1]);

    animate(visitedNodes,shortestPath)
});

//reseting the board, just calling initializeGrid to reset everything
resetBtn.addEventListener("click",()=>{
    initializeGrid(settings.rows,settings.columns);
})

const animate = (visitedNodes,shortestPath)=>{
    for(let i = 0;i<=visitedNodes.length;i++){
        //this will be false untill we finish iterating 
        //on visitedNodes array
        if(i===visitedNodes.length){
            //in the case that we didn't find our endNode 
            //don't show the visualization just return
            if(shortestPath[shortestPath.length-1]!==endNode) return;
            //this timeOut and the other One for visitedNodes should be set the same
            //to show synchronously
            setTimeout(()=>{
                for(let j = 0;j<shortestPath.length;j++){
                    //this timeout can be set anything
                    setTimeout(()=>{
                        //go by nodes in the shortestPath array one by one
                        //set them isShortestPath true and then use the draw method
                        shortestPath[j].isShortestPath = true;
                        shortestPath[j].draw(ctx);
                        infoShort.innerText = `Shortest path:${j+1}`;
                    },50*j)
                }
            },10*i)
            return;
        }
        setTimeout(()=>{
            //go by visited nodes in order one by one
            //set them visited and then use the draw method
            visitedNodes[i].isVisited = true;
            visitedNodes[i].draw(ctx);
            info.innerText = `Explored nodes:${i+1}`;
        },10*i)
    }
    
}

//use this variable to draw walls, drag startingNode and endingNode
let isMousedown = false;
let initialSelectedRow = null;
let initialSelectedCol = null;
let startNodeSelected = false;
let endNodeSelected = false;
let selectedRow = null;
let selectedCol = null
//onMouseDown first check if the mouse is on the canvas
//then get the row and col, check if it's a startNode or endNode
//if yes then assingn ***nodeSelected to true 
window.addEventListener("mousedown",(event)=>{
    if(event.target.id === "myCanvas" ){
        initialSelectedRow = Math.floor(event.offsetY/settings.nodeSize);
        initialSelectedCol = Math.floor(event.offsetX/settings.nodeSize);

        if(grid[initialSelectedRow][initialSelectedCol].isStartNode){
            startNodeSelected = true;
        }else if(grid[initialSelectedRow][initialSelectedCol].isEndNode){
            endNodeSelected = true
        }
        isMousedown = true;
    }
});

//reset everything onMouseUp
window.addEventListener('mouseup',()=>{
    isMousedown = false;
    startNodeSelected = false;
    endNodeSelected = false;
});
//if mouse is down and is moving
//get the moving row and col if mouse was down on start node
//we iterate over the grid and set all the node.isStartNode to false and draw them
//then take moving row and col and set the node of that row and col isStartNode to true;
//change the startNode vairable by asinging to new start node and then draw the new startNode
//do the same for the endNode if endNode is selected;
//else just chande the node.isWall to true and draw them
window.addEventListener('mousemove',(event)=>{
   if(isMousedown){
        selectedRow = Math.floor(event.offsetY/settings.nodeSize);
        selectedCol = Math.floor(event.offsetX/settings.nodeSize);
        if(startNodeSelected){
            for(let rows of grid){
                for(let node of rows){
                    node.isStartNode = false;
                    node.draw(ctx)
                }
            }
            grid[selectedRow][selectedCol].isStartNode = true;
            startNode = grid[selectedRow][selectedCol];
            grid[selectedRow][selectedCol].draw(ctx)
        }else if(endNodeSelected){
            for(let rows of grid){
                for(let node of rows){
                    node.isEndNode = false;
                    node.draw(ctx)
                }
            }
            grid[selectedRow][selectedCol].isEndNode = true;
            endNode = grid[selectedRow][selectedCol];
            grid[selectedRow][selectedCol].draw(ctx)
        }
        else{
            grid[selectedRow][selectedCol].isWall = true;
            grid[selectedRow][selectedCol].draw(ctx)
        } 
   }
})

//get the shortest path using recursion
//the endPoint passed the function is a node with prev property
//that points to the node that was before it in the shortest path.
const getShortestPath = (endPoint,path=[])=>{
    //base case
    if(endPoint===startNode || !endPoint) return path;
    //unshift adds elements to the start of the array
    //in the end the endPoint will be in the end 
    path.unshift(endPoint);
    //then we assingn endPoint to be the prev node of the endPoint
    endPoint = endPoint.prev;
    //and make out recursiv code
    return getShortestPath(endPoint,path)
}

function initializeGrid  (rows,columns){
    for(let i = 0;i<rows;i++){
        for(let j = 0;j<columns;j++){
            let node = null;
            if(i===settings.startNode.row && j === settings.startNode.col){
                node = new Node(i,j,settings.nodeSize,true);
                startNode = node;
                grid[i][j] = node;
                
            }else if(i===settings.endNode.row && j === settings.endNode.col){
                node = new Node(i,j,settings.nodeSize,false,true);
                endNode = node;
                grid[i][j] = node;
                
            }else{
                node = new Node(i,j,settings.nodeSize);
                grid[i][j] = node;
            }
            node.draw(ctx);
        }
    }
}
