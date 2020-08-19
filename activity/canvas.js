let isPenDown = false;
let undoArr = [];
let redoArr = [];
board.addEventListener("mousedown", function(e){
    ctx.beginPath();
    let x = e.clientX;
    let y = e.clientY;
    let top = getLocation(1);
    y = Number(y) - top;
    ctx.moveTo(x, y);
    console.log("Mouse down");
    isPenDown = true;
    let mdp = {
        x,
        y,
        id: "md",
        color: ctx.strokeStyle,
        width: ctx.lineWidth
    }
    undoArr.push(mdp);
    socket.emit("md", mdp);
})
board.addEventListener("mousemove", function(e){
    if(isPenDown){
        console.log("Mouse move");
        let x = e.clientX;
        let y = e.clientY;
        let top = getLocation();
        y = Number(y) - top;
        ctx.lineTo(x, y);
        ctx.stroke();
        let mmp = {
            x,
            y,
            id: "mm",
            color: ctx.strokeStyle,
            width: ctx.lineWidth
        }
        undoArr.push(mmp);
        socket.emit("mm", mmp);
    }
})
window.addEventListener("mouseup", function(){
    console.log("Mouse up");
    isPenDown = false;
})
function getLocation(){
    let { top } = board.getBoundingClientRect();
    return top;
}
function undoLast(){
    if(undoArr.length >= 2){
        console.log(undoArr);
        let tempArr = [];
        for(let i=undoArr.length-1;i>=0;i--){
            console.log(undoArr[i]);
            let id = undoArr[i].id;
            if(id == "md"){
                tempArr.unshift(undoArr.pop());
                break;
            }else{
                tempArr.unshift(undoArr.pop());
            }
        }
        redoArr.push(tempArr);
        ctx.clearRect(0, 0, board.width, board.height);
        redraw();
    }
}
function redoLast(){
    if(redoArr.length > 0){
        let undoPath = redoArr.pop();
        for (let i = 0; i < undoPath.length; i++) {
            undoArr.push(undoPath[i]);
        }
        //  clear canvas=> 
        ctx.clearRect(0, 0, board.width, board.height);
        // redraw
        redraw();
    }
}
function redraw(){
    for(let i=0;i<undoArr.length;i++){
        let { x, y, id, color, width } = undoArr[i];
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if(id == "md"){
            ctx.beginPath();
            ctx.moveTo(x, y);
        }else if(id=="mm"){
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
}