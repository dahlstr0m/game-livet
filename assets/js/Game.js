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

// Legg til spiller, to-veis bevegelse og tyngdekraft mot Floor.
Crafty.e('2D, Canvas, Color, Twoway, Gravity, Collision, spiller')
  .attr({x: 200, y: 0, w: 75, h: 125})
  .color('#F00')
  .twoway(200)
  .gravity('Floor')
// Sjekk etter kollisjon med vegger.
  .checkHits('Vegg,VeggMidt')
  .onHit("Vegg", function(){
    this.x=0
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
  })

// Gir spilleren mulighet til å hoppe flere ganger etter hverandre. (ubegrenset)
  .bind("CheckJumping",function(){
    this.canJump = true;
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
// FiendtligObjekt
setInterval(spawnFiendlig, 1000);
let randomY = 0;

function spawnFiendlig(){
   randomY = Math.floor((Math.random()*600) -40);
   randomSpawn = Math.floor((Math.random()*10)+1);

   if(randomSpawn <=7){
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
      .origin("center")
      .bind('EnterFrame', function() {
        this.x += this.hSpeed;
        this.rotation += 6;
        // Sletter objektet når det treffer bakveggen.
        if (this.x < 0) {
          this.destroy();
        }
      })
    }
};

// Bakken som spilleren løper på.
Crafty.e('Floor, 2D, Canvas, Color')
  .attr({x: 250, y: 300, w: 400, h: 20})
  .color('#303030');



//Generer bakgrunnstall til utviklingsøyemed
let bgData = document.getElementById('game');
let p = document.createElement('p');
p.innerText = "X: " + ', ' + "Y: ";
p.style ="display:block;"; //----------------------> Endres til "none" for å skjule bakgrunnstall
p.id = "bgData"
bgData.appendChild(p);

setInterval(bgDataOppdater, 100);
function bgDataOppdater() {
 document.getElementById("bgData").innerText = "_  X: "+ Crafty("spiller").x.toFixed(1) + ' , ' + "Y: " + Crafty("spiller").y.toFixed(1) + "    Random y= " + randomY;
}

// Tidsteller, teller tiendedels sekunder. On spiller death - run clearInterval (ikke implementert)

var timerText = Crafty.e("2D, DOM, Text")
  .attr({ w:700, h:50, x: 250, y: 0})
  .textFont({size:'40px', weight:'bold'})
  .css({"text-align": "right"})
  .textColor("#FFFFFF");

var time = 0;
var startTime = Date.now();

setInterval(timerUpdate, 100);
function timerUpdate () {
  let time = Date.now() - startTime;
  timerText.text((time/1000).toFixed(3).toString() + " sek");
}

// Poengteller, gir gitt mengde poeng per intervall.

var poengText = Crafty.e("2D, DOM, Text")
  .attr({ w:700, h:50, x: 250, y: 50})
  .textFont({size:'40px'})
  .css({"text-align": "right"})
  .textColor("#FFFFFF");

var poeng = 0;

// Kan brukes til å øke hastigheten på økningen av poeng, feks når man passerer en viss poenggrense.
var poengMultiplier = 1.5;

setInterval(poengUpdate, 100);
function poengUpdate () {
  poeng += 1 * poengMultiplier;
  poengText.text(poeng.toFixed(0).toString() + " livspoeng");
}