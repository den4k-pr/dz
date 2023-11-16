

var screenWidth = window.innerWidth;

var myValue;
var myWidth;

if (screenWidth >= 400) {
    myWidth = 0.5;
} else {
    myWidth = 0.3
}

if (screenWidth >= 1200) {
    myValue = 0.45;
} else if (screenWidth >= 768) {
    myValue = 0.55;
} else if (screenWidth <= 768) {
    myValue = 0.65;
} else if (screenWidth <= 400) {
    myValue = 0.65;
}

console.log("Значення для використання:", myValue);

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gap = 4;
    const mouse = {
        radius: 3000,
        x: undefined,
        y: undefined,
    };

    const particlesArray = [];

    const image = document.getElementById('image1');
    const centerX = canvas.width * 0.45;
    const centerY = canvas.height * Number(myValue);
    const x = centerX - image.width * myWidth;
    const y = centerY - image.height * 0.5;

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('touchmove', function(event) {
        if (event.touches.length > 0) {
            mouse.x = event.touches[0].clientX;
            mouse.y = event.touches[0].clientY;
        }
    });

    function Particle(x, y, originX, originY, color, size) {
        this.x = x;
        this.y = y;
        this.originX = originX;
        this.originY = originY;
        this.color = color;
        this.size = size;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.05;
        this.friction = 0.90;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.fourse = 0;
        this.angle = 0;

        this.exploded = false;

        this.explode = function () {
            this.exploded = true;
            this.vx = (Math.random() - 0.5) * 20;
            this.vy = (Math.random() - 0.5) * 20;
        };
    }

    function init(context){
        const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
        context.drawImage(image, x, y, image.width * scaleFactor, image.height * scaleFactor);

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for(let y = 0; y < canvas.height; y += gap){
            for(let x = 0; x < canvas.width; x += gap){
                const index = (y * canvas.width + x) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                if(alpha > 0){
                    particlesArray.push(new Particle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        Math.floor(x),
                        Math.floor(y),
                        color,
                        2.5
                    ));
                }
            }
        }
    }

    function drawParticle(particle, context){
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
    }

    function updateParticle(particle){
        if (!particle.exploded) {
            particle.dx = mouse.x - particle.x;
            particle.dy = mouse.y - particle.y;
            particle.distance = particle.dx * particle.dx + particle.dy * particle.dy;
            particle.fourse = -mouse.radius / particle.distance;

            if(particle.distance < mouse.radius){
                const angle = Math.atan2(particle.dy, particle.dx);
                particle.vx += particle.fourse * Math.cos(angle);
                particle.vy += particle.fourse * Math.sin(angle);
            }

            particle.x += (particle.vx *= particle.friction) + (particle.originX - particle.x) * particle.ease;
            particle.y += (particle.vy *= particle.friction) + (particle.originY - particle.y) * particle.ease;
        } else {
            // Призначте нові координати для розліталих частинок
            particle.x += particle.vx;
            particle.y += particle.vy;
        }
    }

    function draw(context){
        particlesArray.forEach(particle => drawParticle(particle, context));
    }

    function update(){
        particlesArray.forEach(updateParticle);
    }

    function explodeParticles() {
        particlesArray.forEach(particle => particle.explode());
    }

    init(ctx);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(ctx);
        update();
        requestAnimationFrame(animate);
    }

    animate();

    const content = document.getElementById("content")
    const sitebar = document.getElementById("sitebar")
    const warpButton = document.getElementById('warpButton');
    warpButton.addEventListener('click', function(){
        explodeParticles();
        
        setTimeout(() => {
            canvas.style.opacity = "0"

            setTimeout(() => {
                canvas.style.display = "none"
                content.style.display = "block"
                warpButton.style.display = "none"
                sitebar.classList.add("visibleVindow")
            }, 1000)
        }, 1000)
    });
});

const sitebar = document.getElementById("sitebar")
const btn = document.getElementById("wB")

btn.addEventListener("click", () => {
    sitebar.classList.toggle("visibleVindow")
    if(sitebar.classList.contains("visibleVindow")){
        btn.style.transform = "rotate(180deg)"
    } else (
        btn.style.transform = "rotate(0deg)"
    )
})