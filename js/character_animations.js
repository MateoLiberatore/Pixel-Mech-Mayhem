import { drawFrame, flipView } from "./draw.js";

/**
 * @class - Character
 */

export class Character
{
    constructor(img, mainCanvas, mainContext, imageKey)
    {
        /**
        * @constructor  
        *      @param {img}         image           - Image object, sprite to hydrate other class animations 
        *      @param {mainCanvas}  canvas          - canvas canvas where to draw the animations
        *      @param {mainContext} context         - 'this' context where the drawing will be done
        *      @param {imageKey}    imageKey        - string to reference the image resource and apply CSS styles
        */

        this.canvas  = mainCanvas;
        this.context = mainContext;
        this.imageKey = imageKey;
        this.image   = img

        /**
         * @type {integer}
         * @property {X position}   canvasX         - starting draw position
         * @property {Y position}   canvasY         - starting draw position
         * @property {Floor}        groundY         - definition of the lower position in the canvas
         * @property {Speed}        speed           - pixel displacement in animations (adds to canvasX positions)
         * @property {Scale}        scale           - sprite size multiplayer to determine 
         * @property {Width}        width           - represents the amount of width pixels to use in the capture of sprite images
         * @property {Height}       height          - represents the amount of height pixels to use in the capture of sprite images
         * @property {Scale}        scaledWidth     - size to draw
         * @property {Scale}        scaledHeight    - size to draw
         */
        this.canvasX = 500;
        this.canvasY = 640;
        this.groundY = 640;
        this.speed   = 2;
        this.scale  = 6;
        this.width  = 32;
        this.height = 32;
        this.scaledWidth  = this.scale * this.width;
        this.scaledHeight = this.scale * this.height;

        /**
         * @type {Object} 
         * @description
         *      - movement classes, they manage animation loops and movement around the canvas
         */
        this.rightStepAction = new RightStep(this);
        this.leftStepAction  = new LeftStep(this);
        this.jumpAction      = new Jump(this);
        this.stopAction      = new Stop(this);

        /**
         * @type {string}
         * @description
         *      - states to representig movements
         */
        this.states =   
        {
            'walkingRight': this.rightStepAction,
            'walkingLeft':  this.leftStepAction,
            'jumping':      this.jumpAction,
            'idle':         this.stopAction,
        };

        /**
         * @type {string, state}
         * @description
         *      - state:
         *          - setup
         *          - management
         *          - representation
         */
        this.currentState = 'idle';
        this.currentAction = this.states[this.currentState];
        this.characterDirection = null;
    }

    /**
     * @method
     * @param {String} newState 
     * @links : links the states with the movement and animation
     * @param {integer} direction 
     * - 1  = rigth
     * - 0  = null
     * - -1 = left
     */
    setState(newState, direction = 0)
    {
        // verify if is jumping to avoid double jumps
        if (this.isJumping && newState === 'jumping') {
            return;
        }

        this.currentState = newState;

        switch (newState)
        {
            case 'walkingRight':
                this.currentAction = this.rightStepAction;
                break;

            case 'walkingLeft':
                this.currentAction = this.leftStepAction;
                break;

            case 'jumping':
                this.currentAction = this.jumpAction;
                this.jumpAction.init(direction);
                break;

            case 'idle':
                this.currentAction = this.stopAction;
                this.cancelAnimation();
                break;
                
            default:
                console.warn(`setState: Estado desconocido: ${newState}`);
                this.currentAction = this.stopAction;
        }

        // starts the action if it's not 'jumping', since jumping starts it self
        if (this.currentAction && this.currentAction.init && newState !== 'jumping')
        {
            this.currentAction.init();
        }
    }

    /**
     * @method
     * @fires cancelAnimationFrame()
     *      - animationFrameId = null;
     */
    cancelAnimation()
    {
        if (this.animationFrameId !== null)
        {
            window.cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * @method
     * @implements {draw()}
     * @implements {class.update()}
     * @description
     *      - uses the update method of the corresponding animation class
     */
    update()
    {
        this.currentAction.update(); // first, updates the intern state of the action
        this.draw();                 // then draws the character with the updated states
    }

    /**
     * @method
     * @description
     *      - draw te corresponding frame alocated in each class loopindex
     */
    draw()
    {
        const currentFrameX = this.loopIndex;
        const currentFrameY = this.frameY; // frameY it is the updated value to draw

        if (this.characterDirection === 'left')
        {
            // if 'left' need to mirror the draw
            flipView(   currentFrameX,      currentFrameY,
                        this.canvasX,       this.canvasY,
                        this.context,       this.image,
                        this.width,         this.height,
                        this.scaledWidth,   this.scaledHeight   );
        } 
        else 
        {
            drawFrame(  currentFrameX,      currentFrameY,
                        this.canvasX,       this.canvasY,
                        this.context,       this.image,
                        this.width,         this.height,
                        this.scaledWidth,   this.scaledHeight   );
        }
    }
}

/**
 * @class - walk right
 */
class RightStep
{
    constructor(character)
    {
        /**
         * @constructor
         * @param    {Object}       Character
         * @property {sprite row}   cycleLoop   - sprite images
         * @property {loopIndex}    loopIndex   - current sprite
         * @property {frameY}       frameY      - row of srpites selected
         * @property {frameCount}   frameCount  - tracking of draw frames   
         */
        this.character    = character;
        this.cycleLoop    = [0,1,2,3,4,5];
        this.loopIndex    = 0;
        this.frameY       = 1;
        this.frameCount   = 0;
    }

    /**
     * @method
     * @description
     *      - init the loop index in the first frame selected
     *      - set direction to define movement animation orientation
     */
    init()
    {
        this.loopIndex = 0;
        this.character.characterDirection = 'right';
    }
    
    /**
     * @method
     * @description
     *      - updates instance position to the right 'movement'
     *      - limit the movement to the canvas size
     *      - regulates animation speed (15 frames/s)
     */
    update()
    {
        this.character.canvasX += this.character.speed;

        if (this.character.canvasX > this.character.canvas.width - this.character.scaledWidth) 
        {
            this.character.canvasX = this.character.canvas.width - this.character.scaledWidth;
        }

        this.frameCount++;
        if (this.frameCount >= 15) 
        {
            this.frameCount = 0;
            this.loopIndex = (this.loopIndex + 1) % this.cycleLoop.length;
        }
        this.character.loopIndex = this.cycleLoop[this.loopIndex];
        this.character.frameY = this.frameY;
    }
}

class LeftStep
{
    constructor(character)
    {
        /**
         * @constructor
         * @param    {Object}       Character
         * @property {sprite row}   cycleLoop   - sprite images
         * @property {loopIndex}    loopIndex   - current sprite
         * @property {frameY}       frameY      - row of srpites selected
         * @property {frameCount}   frameCount  - tracking of draw frames   
         */
        this.character    = character;
        this.cycleLoop    = [0,1,2,3,4,5];
        this.loopIndex    = 0;
        this.frameCount   = 0;
        this.frameY       = 1;
    }

    /**
     * @method
     * @description
     *      - init the loop index in the first frame selected
     *      - set direction to define movement animation orientation
     */
    init()
    {
        this.loopIndex = 0;
        this.character.characterDirection = 'left';
    }


    /**
     * @method
     * @description
     *      - updates instance position to the right 'movement'
     *      - limit the movement to the canvas size
     *      - regulates animation speed (15 frames/s)
     */
    update()
    {
        this.character.canvasX -= this.character.speed;

        if (this.character.canvasX < 0) {
            this.character.canvasX = 0;
        }

        this.frameCount++;
        if (this.frameCount >= 15) {
            this.frameCount = 0;
            this.loopIndex = (this.loopIndex + 1) % this.cycleLoop.length;
        }
        this.character.loopIndex = this.cycleLoop[this.loopIndex];
        this.character.frameY = this.frameY;
    }
}
/**
 * @class
 * @description
 *      - The Jump class is different from other movement classes. It has its own animation loop,
 *        which is represented by a single static image frame.
 *      - The focus is on simulating a parabolic trajectory, so there's no need to cycle through multiple frames.
 *      - All the effort is dedicated to creating and applying a physics-based simulation.
 *        Once the jump is complete, the character returns to a state where other movements can be used again.
 */
class Jump 
{
    /**
     * @param       {Character} character - The character instance.
     * @property    {canvas}    canvas
     */
    constructor(character)
    {
        this.character      = character;
        this.canvas         = character.canvas;
        this.context        = character.context;
        this.img            = character.image;

        this.x              = character.canvasX;                        
        this.y              = character.canvasY;                        
        
        this.cycleLoop      = [5];                                      
        this.loopIndex      = 0;
        this.frameCount     = 0;
        this.frameY         = 0;                                        // Row for the jump animation

        this.gravity                    = 0.08;                         // Gravity to apply to vertical movement
        this.initialJumpVelocity        = -4.5;                         // Adjust this value for higher/lower jump

        this.velocityY      = 0;                                        // Vertical velocity
        this.velocityX      = 0;                                        // Horizontal velocity during the jump
        this.jumpDirection  = 0;                                        // -1 for left, 0 for straight up, 1 for right
        
        this.init           = this.init.bind(this);
        this.update         = this.update.bind(this);                   
    }

    /**
     * @method
     * @param {Direction}   jumpDirection 
     * @description
     *      - Uses the direction state so the draw() method can use the corresponding orientation
     */
    init(jumpDirection) 
    { 
        this.character.isJumping = true;
        this.character.velocityY = this.initialJumpVelocity;            // Use the initial upward velocity
        this.jumpDirection = jumpDirection;                             // Direction of the jump

        this.character.frameY = this.frameY;                            // Sprite row
        this.character.loopIndex = this.cycleLoop;                      // Jump frame
    }

    /**
     * @method
     * @description
     *      - updates canvas location during the movement
     *      - updates character orientation to draw
     *      - prevents going off the canvas edge
     */
    update() 
    {
        this.character.canvasY += this.character.velocityY;             // Apply vertical movement
        this.character.velocityY += this.gravity;                       // Gradually increase downward velocity (parabola)

        if (this.jumpDirection === 1)                                   
        {
            this.character.canvasX += this.character.speed;
            this.character.characterDirection = 'right';
        } 
        else if (this.jumpDirection === -1)                             
        {
            this.character.canvasX -= this.character.speed;
            this.character.characterDirection = 'left';
        }

        if (this.character.canvasX < 0)                                 // Prevent going off the left edge
        {
            this.character.canvasX = 0;
        } 
        else if (this.character.canvasX > this.character.canvas.width - this.character.scaledWidth) 
        {
            this.character.canvasX = this.character.canvas.width - this.character.scaledWidth;
        }

        // Landing
        if (this.character.canvasY >= this.character.groundY) 
        {
            this.character.canvasY = this.character.groundY;
            this.character.isJumping = false;
            this.character.velocityY = 0;
            this.character.setState('idle');                    // Return to 'idle' state
            this.character.cancelAnimation();                   // Stop the jump animation loop
            return;
        }
    }
}

/**
 * @class
 * @description
 *      - Initializer of the 'idle' state
 */
class Stop
{
    constructor(character) 
    {
        /**
         * 
         */
        this.character      = character;
        this.loopIndex      = 0;
        this.frameCount     = 0;
        this.frameY         = 0;
    }

    /**
     * @method
     * @description
     *      - initializes values in 0
     */
    init()
    {
        this.loopIndex      = 0;
        this.frameCount     = 0;
    }

    /**
     * @method
     * @description
     *      - sets all to 0;
     */
    update()
    {
       this.loopIndex           = 0;
       this.frameCount          = 0;
       this.character.loopIndex = this.loopIndex;
       this.character.frameY    = this.frameY;
    }
}