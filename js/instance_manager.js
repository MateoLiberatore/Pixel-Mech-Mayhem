import { Keyboard } from './character_controler.js';
import { Character } from './character_animations.js';
import { ResourceLoader } from './resource_loader.js';
import { SetupUI } from './setup_UI.js';

/**
 * @class InstanceManager
 * @classdesc Central class that manages:
 *      @instance   Character instances
 *      @instance   UI configurations 
 *      @instance   Keyboard controller
 *      @extends {CustomEvent}
 *          @example 'ready'           
 *      @extends {Event}
 *          @example 'click'
 */
export class InstanceManager extends EventTarget
{
    constructor()
    {
        /**
         * @constructor
         * @property {Super}            Super                   - EventTarget inicialization         
         * @property {Object}           loader                  - Resource loader insatnce
         * @property {Object}           Controller              - Keyboard instance 
         * @property {Object}           SetupUI                 - Interface instance
         * @property {Object Array[]}   Characters              - Array of character instances
         * @property {ID}               nextCharacterId         - Next Character instance ID to spawn
         * @property {Instance}         selectedCharacterId     - Current instance ID
         */
        super();
        this.loader                 = new ResourceLoader();
        this.controller             = new Keyboard();
        this.setupUI                = new SetupUI();
        this.characters             = [];
        this.nextCharacterId        = 1;
        this.selectedCharacterId    = null;
    }

    /**
     * @method
     * @instance SetupUI
     * @instance Loader
     *      @returns graphic resources
     *      @emits CustomEvent 'loaded'
     */
    initialize()
    {
        this.setupUI.initialize();
        this.loader.addEventListener('loaded', this.onResourcesLoaded.bind(this));
        this.loader.loadImages(this.setupUI.images);
    }

    /**
     * @method
     * @param {Event} event -'click'
     */
    handleSpawnClick(event)
    {
        const botKey = event.currentTarget.dataset.botKey;
        if(botKey)
        {
            this.spawnCharaceter(botKey);
        }
    }

    /**
     * @method
     * @event 'click'
     * @event 'ready'
     * @description 
     *      - click event to spawn Character instances
     *      - ready customEvent to allow the gameloop to to start
     */
    onResourcesLoaded(event)
    {
        const payload = event.detail;
        if (payload && payload.size > 0)
        {
            this.setupUI.isLoaded = true;
            console.log('Carga de recursos terminada. Habilitando UI.');

            for (const key in this.setupUI.buttons)
            {
                const button = this.setupUI.buttons[key];
                button.disabled = false;
                button.addEventListener('click', this.handleSpawnClick.bind(this));
            }
            this.dispatchEvent(new Event('ready'));
        }
        else
        {
            this.setupUI.isLoaded = false;
            console.error('Error en la carga de recursos.');
        }
    }

    /**
     * @method
     * @param {String} imageKey 
     * @returns 
     */
    spawnCharaceter(imageKey)
    {
        if(!this.setupUI.isLoaded)
        {
            console.warn('Los recursos no se han cargado aún');
            return;
        }

        const characterImage = this.loader.getImage(imageKey);
        if(!characterImage)
        {
            console.error(`La imagen '${imageKey}' no esta disponible en el Loader`);
            return;
        }
        //imagKey in contructor to apply correct CSS styles when spawn
        const newBot = new Character(characterImage, this.setupUI.canvas, this.setupUI.context, imageKey);
        newBot.id = this.nextCharacterId++;

        this.characters.push(newBot);
        console.log(`Robot ID ${newBot.id} (${imageKey}) instanciado`);

        this.addToList(newBot);
    }

    /**
     * @param {stopPropagation} event
     * @description
     *      -  Stop 'click' event propagation on character list selection 
     */
    characterSelection(event)
    {
        if (event && event.stopPropagation)
        {
            event.stopPropagation();
        }

        const clickedElement = event.currentTarget;
        const charId = parseInt(clickedElement.dataset.characterId);

        if (!isNaN(charId))
        {
            this.selectCharacter(charId);
        }
        else
        {
            console.warn("Error: No se pudo obtener el ID del personaje del elemento clickeado.");
        }
    }

    /**
     * 
     * @param {int} charId 
     * @select : selects new instance to use with keyboard controller
     */
    selectCharacter(charId)
    {
        const foundCharacter = this.characters.find(function matchId(c)
        {
            return c.id === charId;
        });

        if (foundCharacter)
        {
            this.selectedCharacterId = charId;

            if (this.controller)
            {
                this.controller.setControlledCharacter(foundCharacter);
            }
            else
            {
                console.error("Error: El controlador 'this.controller' no ha sido inicializado al intentar seleccionar un personaje.");
                return;
            }

            console.log(`Controlador reasignado al Personaje ID: ${charId}`);
            this.updateHiglight();
        }
        else
        {
            console.warn(`Advertencia: No se encontró el personaje con ID: ${charId} para seleccionar.`);
        }
    }

    /**
     * @param {Object} character 
     * @description 
     *      - generate new button with character.id + imageKey to apply the correct CSS styles  
     */
    addToList(character)
    {
        const listItem = document.createElement('li');
        listItem.classList.add('character-list-item');
        listItem.dataset.characterId = character.id;
        listItem.id = `character-item-${character.id}`;

        const textSpan = document.createElement('span');
        textSpan.textContent = `Personaje ID: ${character.id}`;
        listItem.appendChild(textSpan);

        const selectButton = document.createElement('button');
        selectButton.textContent = 'SELECT';
        selectButton.classList.add('select-btn');
        selectButton.dataset.characterId = character.id;
        
        // Añadir la clase de color correspondiente al botón de seleccionar
        if (this.setupUI.colors[character.imageKey]) {
            selectButton.classList.add(this.setupUI.colors[character.imageKey].selectClass);
        }

        listItem.appendChild(selectButton);

        selectButton.addEventListener('click', this.characterSelection.bind(this));
        listItem.addEventListener('click', this.characterSelection.bind(this));

        if (this.setupUI.charactersList)
        {
            this.setupUI.charactersList.appendChild(listItem);
        }
        else
        {
            console.error("Error: setupUI.charactersList no está inicializada.");
        }
    }
    
    /**
     * @description
     *      - visual update of the selected character instance
     */
    updateHiglight()
    {
        if (this.setupUI.charactersList) {
            const listItems = this.setupUI.charactersList.querySelectorAll('.character-list-item');

            for (const item of listItems) {
                if (parseInt(item.dataset.characterId, 10) === this.selectedCharacterId) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            }
        }
    }
}