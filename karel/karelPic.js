function drawKarelPic(context,x,y){
    context.lineWidth = 1;
    context.fillStyle="red";
    context.strokeStyle = 'black';

    context.fillRect(x+15, y+15, 20, 20);
    context.strokeRect(x+15, y+15, 20, 20);

    context.fillRect(x+20, y+5, 10, 10);

    context.fillRect(x+18, y+35, 4, 9);
    context.fillRect(x+28, y+35, 4, 9);

    context.fillStyle="black";
    context.arc(x+23, y+8, 2, 0, 2*Math.PI);
    context.fill();
    context.beginPath();

    context.fillStyle="black";
    context.arc(x+28, y+8, 2, 0, 2*Math.PI);
    context.fill();
    context.beginPath();

    context.beginPath();
    context.moveTo(x+22, y+12);
    context.lineTo(x+28, y+12);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(x+20, y);
    context.lineTo(x+25, y+5);
    context.lineTo(x+30, y);
    context.stroke();
    context.closePath();

    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x+15, y+15);
    context.lineTo(x+5, y+31);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(x+35, y+15);
    context.lineTo(x+42, y+31);
    context.stroke();
    context.closePath();

}