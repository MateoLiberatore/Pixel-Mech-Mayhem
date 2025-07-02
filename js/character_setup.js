
/**
 * Configura y devuelve un elemento canvas.
 * @returns {HTMLCanvasElement} El elemento canvas encontrado.
 */
export function setupCanvas() 
{
    let canvas = document.getElementById('canvas');
    if (!canvas) 
    {
        canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        document.body.appendChild(canvas); 
        console.log('setupCanvas: Canvas creado y añadido al DOM.', canvas); //
    } 
    else
    {
        console.log('setupCanvas: Canvas encontrado (ya existía).', canvas); //
    }
    return canvas;
}

/**
 * @param {Document} canvas - el canvas del html    
 * @returns {context} El elemento canvas encontrado.
 */
export function setupContext(canvas)
{
   if (!canvas) {
        console.error('setupContext: ¡ERROR! Canvas es nulo o indefinido.');
        return null;
    }
    const context = canvas.getContext('2d'); // context of the drawing associated to canvas
    if (context) 
    {
        console.log('setupContext: Contexto 2D obtenido.', context); 
    } 
    else 
    {
        console.error('setupContext: ¡ERROR! No se pudo obtener el contexto 2D.'); 
    }
    return context;
}


