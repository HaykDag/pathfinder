class Node {
    constructor(row,col,size,isStartNode=false,isEndNode=false){
        this.row = row;
        this.col = col;
        this.isWall = false;
        this.isStartNode = isStartNode;
        this.isEndNode = isEndNode;
        this.isVisited = false;
        this.prev = null;
        this.distance = Infinity;
        this.isShortestPath = false;
        this.size = size;
    }

    draw (ctx) {
        ctx.beginPath();
        ctx.rect(this.col*this.size,this.row*this.size,this.size,this.size);
        if(this.isStartNode){
            ctx.beginPath();
            ctx.moveTo(this.col*this.size+4,this.row*this.size+8)
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 3
            ctx.lineTo(this.col*this.size+this.size-4,this.row*this.size+this.size/2)
            ctx.stroke()
    
            ctx.beginPath()
            ctx.moveTo(this.col*this.size+4,this.row*this.size+this.size-8)
            ctx.lineTo(this.col*this.size+this.size-4,this.row*this.size+this.size/2)
            ctx.stroke()
            ctx.lineWidth = 1;
        }else if(this.isEndNode){
            ctx.beginPath();
            ctx.roundRect(this.col*this.size,this.row*this.size,this.size*0.95,this.size*0.95,[40])
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }
        else if(this.isWall){
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }else if(this.isShortestPath){
            ctx.fillStyle = "orange";
            ctx.fill();
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }else if(this.isVisited){
            ctx.fillStyle = "lightBlue";
            ctx.fill();
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }else{
            ctx.fillStyle = "#333";
            ctx.fill();
            ctx.strokeStyle = "white"
            ctx.stroke();
        }
    }

}
