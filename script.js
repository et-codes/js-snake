const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 800;

ctx.fillStyle = 'lightgreen';
ctx.fillRect(0, 0, canvas.width, canvas.height);