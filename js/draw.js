export function drawFrame(frameX, frameY, canvasX, canvasY,
    context, img, width, height, scaledWidth, scaledHeight)
{
    context.drawImage(img,
    frameX * width, frameY * height, width, height,
    Math.floor(canvasX), Math.floor(canvasY), scaledWidth, scaledHeight);
    // using Math.() to ensure to be using round numbers
}

export function flipView(
            frameX, frameY,
            canvasX, canvasY,
            context, img,
            width, height,
            scaledWidth, scaledHeight)
{
        context.save();     // save context state
        context.translate(Math.floor(canvasX) + scaledWidth, Math.floor(canvasY));
        context.scale(-1, 1); // mirror
    
        drawFrame(
            frameX, frameY,
            0, 0,
            context, img,
            width, height,
            scaledWidth, scaledHeight
        );
    
        context.restore(); 
}

