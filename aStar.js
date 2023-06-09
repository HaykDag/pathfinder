

//This is the same dijkstar Algorithm with one difference
//we make an educated guess and update the neihbour's distance considering
//how far is neihbour from the end node
const aStar = (grid,startNode,endNode)=>{
    //if given start poin and end point are the same just return the start point;
    if(startNode.row === endNode.row && startNode.col === endNode.col) return [startNode];
    //collect all the visited nodes for later visualization iterate and show
    const visitedNodes = [];
    //get all the nodes as unvisited in an array , mark startNode's distance 0,
    //then sort the array and start iteration until find the endNode, hit walls 
    //or visit all the nodes in unvistedNodes array;
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0;

    while(unvisitedNodes.length>0){
        unvisitedNodes.sort((a,b)=>a.distance-b.distance);
        //because we sort the array by distance the first element
        //will be the the closest one.
        //take the closest node and remove it from the unvisitedNodes array
        const closestNode = unvisitedNodes.shift();

        //if our closest node is a wall just skip
        if(closestNode.isWall) continue;

        //if our closestNode's distance is infinity it means we have no way to 
        //reach the end node we hit walls
        if(closestNode.distance === Infinity) return visitedNodes;

        //mark the node as visited and push it in the visited array for visualization
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        //if we found the endNode just return the visited nodes array
        if(closestNode === endNode) return visitedNodes;
        //if we haven't fount the endNode 
        //updtae the neighbour nodes of our closest node by setting their distance
        //closestNode.distance+1+heuristicValue between neihbour and the end node
        //it's like to make an educated guess in waht direction the Endnode will be.
        Neighbours(closestNode,grid);
        
    }
    return visitedNodes
} 
const heuristicValue = (start,end) =>{
    const rowDif = start.row-end.row;
    const colDif = start.col-end.col;

    const value = Math.sqrt(rowDif*rowDif+colDif*colDif)
    
    return value
}
const Neighbours = (node,grid)=>{
    
    const row = node.row;
    const col = node.col;

    const neighbours = [];
    //boundry check and pushing all the neighbours in the array
    if(grid[row+1]) neighbours.push(grid[row+1][col]);
    if(grid[row-1]) neighbours.push(grid[row-1][col]);
    if(grid[row][col+1]) neighbours.push(grid[row][col+1]);
    if(grid[row][col-1]) neighbours.push(grid[row][col-1]);

    //filter out the nodes that are already visited
    const unvisitedNeighbours =  neighbours.filter(neighbour=>neighbour.isVisited===false);
    //then iterate over that neighnours and set the distance
    //as well as set the prev our current node,
    //later when we want to show the actual shortest path
    //we will use prev property of the end node to backtrack to our start node
    //it will work like a link list.
    for(const unvisitedNode of unvisitedNeighbours){
        unvisitedNode.distance = node.distance+1+heuristicValue(unvisitedNode,endNode)*1.5;
        unvisitedNode.prev = node;
    }
}

// const getAllNodes = (grid)=>{
//     const nodes = [];
//     for(let row of grid){
//         for(let node of row){
//             nodes.push(node)
//         }
//     }
//     return nodes;
// }
