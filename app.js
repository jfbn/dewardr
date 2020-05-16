const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const width = 400;
const height = 400;

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

loadImage('./images/dotamap.PNG').then(image => {
    context.drawImage(image, 0, 0, 400, 400);
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./dist/fixed.png', buffer)
})

/* const text = 'Hello, World!'
context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.fillStyle = '#fff'
context.fillText(text, 200, 200) */


