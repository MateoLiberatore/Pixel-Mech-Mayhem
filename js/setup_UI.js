import { setupCanvas, setupContext} from "./character_setup.js";

/**
 * @class
 */

export class SetupUI
{
    constructor()
    {
        /**
         * @constructor
         * @property    {isLoaded}              - flag
         * @property    {images}                - image src
         * @property    {colors}                - match code an css styles        
         * @property    {canvas}
         * @property    {context}               - canvas context (2d)
         * @property    {buttons}   -
         * @property    {characterList}
         * @property    {spawnButtonContainer}  - 
         * @property    {gameTitle}             - H1 HTML element compound of span elements
         */
        this.isLoaded = false;
        this.images =
        {
            'cian_bot': './css/static/images/cian_bot.svg',
            'yellow_bot': './css/static/images/yellow_bot.svg',
            'magenta_bot': './css/static/images/magenta_bot.svg',
            'black_bot': './css/static/images/black_bot.svg',
            'city': './css/static/backgrounds/city.jpg'
        };
       
        this.colors = {
            'cian_bot': {
                name: 'cian',
                bgClass: 'bot-cian',
                selectClass: 'bot-cian-select'
            },
            'yellow_bot': {
                name: 'yellow',
                bgClass: 'bot-yellow',
                selectClass: 'bot-yellow-select'
            },
            'magenta_bot': {
                name: 'magenta',
                bgClass: 'bot-magenta',
                selectClass: 'bot-magenta-select'
            },
            'black_bot': {
                name: 'black',
                bgClass: 'bot-black',
                selectClass: 'bot-black-select'
            }
        };
        this.canvas                 = null;
        this.context                = null;
        this.buttons                = {};
        this.charactersList         = null;
        this.spawnButtonContainer   = null;
        this.gameTitle              = null; 
    }

    /**
     * @method
     * @description
     *      - UI HTML generation
     *      - H1  element compound of span elements
     *      - internal resolution of the canvas (1200*800)
     *      - buttons & button list
     */
    initialize()
    {
        this.gameTitle = document.createElement('h1');
        this.gameTitle.id = 'game_title';

        const pixelSpan = document.createElement('span');
        pixelSpan.textContent = 'PIXEL';
        pixelSpan.classList.add('gradient-text', 'pixel-cyan-gradient');
        this.gameTitle.appendChild(pixelSpan);

        const mechSpan = document.createElement('span');
        mechSpan.textContent = 'MECH';
        mechSpan.classList.add('gradient-text', 'mech-yellow-gradient');
        this.gameTitle.appendChild(mechSpan);

        const mayhemSpan = document.createElement('span');
        mayhemSpan.textContent = 'MAYHEM';
        mayhemSpan.classList.add('gradient-text', 'mayhem-magenta-gradient');
        this.gameTitle.appendChild(mayhemSpan);

        document.body.appendChild(this.gameTitle); // <-- Añadir el H1 con sus spans al body

        this.canvas = setupCanvas();
        this.context = setupContext(this.canvas);


        
        if (!this.canvas)
        {
            console.error("Error: Canvas no pudo ser creado o encontrado.");
            return;
        }

        this.canvas.width = 1200;
        this.canvas.height = 800;

        this.spawnButtonContainer = document.createElement('div');
        this.spawnButtonContainer.id = 'spawn_button_container';
        document.body.appendChild(this.spawnButtonContainer);

        if (!this.spawnButtonContainer) {
            console.error("Error: Elemento con ID 'spawn_button_container' no encontrado.");
            return;
        }

        for (const key in this.images)
        {
            if (key.includes('_bot'))
            {
                const button = document.createElement('button');
                button.dataset.botKey = key;

                const botName = key.replace('_', ' ').replace('bot', ' Bot');
                button.innerText = `Spawn ${botName.charAt(0).toUpperCase() + botName.slice(1)}`;

                button.classList.add('bot_button');
                if (this.colors[key]) {
                    button.classList.add(this.colors[key].bgClass);
                }
                button.id = `spawn_${key}`;
                button.disabled = true;

                this.spawnButtonContainer.appendChild(button);
                this.buttons[key] = button;
            }
        }

        this.charactersList = document.createElement('ul');
        this.charactersList.id = 'characters_list';
        document.body.appendChild(this.charactersList);

        console.log('SetupUI: Todos los elementos del DOM han sido creados y añadidos.');

    }
}
