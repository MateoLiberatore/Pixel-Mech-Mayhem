import { InstanceManager } from "./js/instance_manager.js";

let instanceManager; 

function gameLoop() 
{
    const ui = instanceManager.setupUI;
    const context = ui.context;
    const canvas = ui.canvas;

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const cityImage = instanceManager.loader.getImage('city');

    if (cityImage) 
    {
        context.drawImage(cityImage, 0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < instanceManager.characters.length; i++) 
    {
        let character = instanceManager.characters[i];
        if (character)   
        {
            character.update();
            character.draw();
        }
    }
    requestAnimationFrame(gameLoop);
} 

function main() 
{

    instanceManager = new InstanceManager(); 

    instanceManager.addEventListener('ready', gameLoop);
    instanceManager.initialize();

    console.log('Instance Manager listo, iniciado el game-loop');
}

window.onload = main;