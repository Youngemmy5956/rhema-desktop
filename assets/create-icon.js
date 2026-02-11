const { createCanvas } = require('canvas');
const fs = require('fs');

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, 512, 512);
ctx.font = '320px serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('📖', 256, 256);

fs.writeFileSync('assets/icon.png', canvas.toBuffer('image/png'));
console.log('Icon created!');
