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

// Legg til spiller.
Crafty.e('2D, Canvas, Color, Twoway, Gravity, Collision, spiller')
  .attr({x: 200, y: 0, w: 100, h: 200})
  .color('#F00')
  .twoway(200)
  .gravity('Floor')
  .checkHits('Vegg,VeggMidt')
  .onHit("Vegg", function(){
    this.x=0;
  })
  .onHit("VeggMidt", function(){
    this.x=500;
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

//Generer bakgrunnstall til utviklingsøyemed
let bgData = document.getElementById('game');
let p = document.createElement('p');
p.innerText = "X: " + ', ' + "Y: ";
p.style ="display:block;"; //----------------------> Endres til "none" for å skjule bakgrunnstall
p.id = "bgData"
bgData.appendChild(p);

setInterval(bgDataOppdater, 100);
function bgDataOppdater() {
 document.getElementById("bgData").innerText = "X: "+ Crafty("spiller").x.toFixed(1) + ' , ' + "Y: " + Crafty("spiller").y.toFixed(1);
}
