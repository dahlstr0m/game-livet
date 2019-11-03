// Initialiser spillet, angi størrelse på spillvindu.
Crafty.init(1000,700, document.getElementById('game'));

// Boundaries for brettet.
Crafty.map.boundaries({min: {x:0, y:0}, max: {x:1000, y:700}})

// Fast bakgrunn.
Crafty.background("#7DDEEF url(assets/img/sky1.png) no-repeat center center");

// Bakken som spilleren løper på.
Crafty.e('Floor, 2D, Canvas, Color')
  .attr({x: 0, y: 600, w: 1000, h: 100})
  .color('#303030');

// Spiller
Crafty.e('2D, Canvas, Color, Twoway, Gravity, Collision, spiller')
  .attr({x: 200, y: 0, w: 75, h: 125})
  .color('#F00')
  .twoway(200)
  .gravity('Floor')
  .checkHits('Vegg,VeggMidt')
  .onHit("Vegg", function(){
    this.x=0;
  })
  .onHit("VeggMidt", function(){
    this.x=526;
  })
  .bind("HitOn", function(hitData) {
    Crafty("Vegg").color('red');
    Crafty("VeggMidt").color('red');
  })
  .bind("HitOff", function(comp) {
    Crafty("Vegg").color('black');
    Crafty("VeggMidt").color('black');
  });

// Vegger
Crafty.e("2D, Canvas, Color, Vegg")
  .attr({
    x: 0,
    y: 0,
    w: 1,
    h: 700
  })
  .color('black');
  Crafty.e("2D, Canvas, Color, VeggMidt")
    .attr({
      x: 600,
      y: 0,
      w: 1,
      h: 700
    })
    .color('black');


// Bakken som spilleren løper på 2. nivå
  Crafty.e('Floor, 2D, Canvas, Color')
    .attr({x: 250, y: 300, w: 1000, h: 20})
    .color('#303030');

//Spawn area
  let Spawn1y = 20;
  let Spawn2y = 160;
  let Spawn3y = 340;
  let Spawn4y = 480;
  Crafty.e("2D, Canvas, Color")
    .attr({
    x: 985,
    y: Spawn1y,
    w: 15,
    h: 120
    })
    .color('blue');
  Crafty.e("2D, Canvas, Color")
    .attr({
    x: 985,
    y: Spawn2y,
    w: 15,
    h: 120
    })
    .color('blue');
  Crafty.e("2D, Canvas, Color")
    .attr({
    x: 985,
    y: Spawn3y,
    w: 15,
    h: 120
    })
    .color('blue');
  Crafty.e("2D, Canvas, Color")
    .attr({
      x: 985,
      y: Spawn4y,
      w: 15,
      h: 120
    })
    .color('blue');


// FiendtligObjekter
    setInterval(spawnFiendlig, 1000);
    let randomY = 0;
    function spawnFiendlig(){
       randomY = Math.floor((Math.random()*70));
       randomSpawn = Math.floor(((Math.random()*5)+1));
       //Select spawn
       switch(randomSpawn) {
         case 1:
            testverdi=1;
            randomY +=Spawn1y;
         break;
         case 2:
            testverdi=2;
            randomY += Spawn2y;
         break;
         case 3:
            testverdi=3;
            randomY += Spawn3y;
         break;
         case 4:
             testverdi=4;
             randomY += Spawn4y;
         break;
         default:
             testverdi=5;
             randomY += 1000; //Utenfor skjermen
       }
       //Generer objektet
        Crafty.e("2D, Canvas, Color, Collision, FiendtligObjekt")
          .attr({
            x: 1050,
            y: randomY,
            w: 40,
            h: 40,
            hSpeed: -4,
            rotation: 45
          })
          .checkHits()
          .onHit("spiller", function(){
            this.color("black");
          })
          .color('orange')
          .bind('EnterFrame', function() {
            this.x += this.hSpeed;
          })
    };

//Generer bakgrunnstall til utviklingsøyemed
let bgData = document.getElementById('game');
let div = document.createElement('div');
div.innerHTML = '<p id="bgDataL1"></p><p id="bgDataL2"></p><p id="bgDataL3"></p><p id="bgDataL4"></p>';
div.style ="display:Block;"; //----------------------> Endres til "none" for å skjule bakgrunnstall
div.id = "bgData"
bgData.appendChild(div);

setInterval(bgDataOppdater, 100);
function bgDataOppdater() {
 document.getElementById("bgDataL1").innerText = "_  X: "+ Crafty("spiller").x.toFixed(1) + ' , ' + "Y: " + Crafty("spiller").y.toFixed(1);
 document.getElementById("bgDataL2").innerText = "_  Spawn: " + randomSpawn;
 document.getElementById('bgDataL3').innerText = "_ X";
 document.getElementById('bgDataL4').innerText = "_ X";
}
