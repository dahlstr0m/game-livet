// Initialiser spillet, angi størrelse på spillvindu.
Crafty.init(1000,700, document.getElementById('game'));

// Boundaries for brettet.
Crafty.map.boundaries({min: {x:0, y:0}, max: {x:1000, y:700}})

// Fast bakgrunn.
Crafty.background("#7DDEEF url(assets/img/livet_background.png) no-repeat center center");

// Bakken som spilleren løper på.
Crafty.e('Floor, 2D, Canvas, Color, Collision')
  .attr({x: 0, y: 600, w: 1000, h: 100})
  .color('#303030');

// Spiller
Crafty.e('2D, Canvas, Color, Twoway, Gravity, Collision, spiller')
  .attr({x: 200, y: 0, w: 75, h: 125, hoppi: 0})
  .color('#F00')
  .twoway(200)
  .gravity('Floor')
  .checkHits('Vegg,VeggMidt, Floor')
  .onHit("Vegg", function(){
    this.x=0;
  })
  .onHit("VeggMidt", function(){
    this.x=526;
  })
  .onHit("Floor", function(){
    this.hoppi = 0;
  })
  .onHit("undersideGulv", function(){
    this.y=320;
    this.hoppi = 2;
  })
  .onHit("fremsideGulv", function(){
    this.x=this.x-20;
    this.y=this.y+10;
  })
  //Fjernes før levering
    //Fjern fra her-
  .bind("HitOn", function(hitData) {
    Crafty("Vegg").color('red');
    Crafty("VeggMidt").color('red');
  })
  .bind("HitOff", function(comp) {
    Crafty("Vegg").color('black');
    Crafty("VeggMidt").color('black');
  })
    //Fjern hit -
  //Kun tillatt dobbelhopp
    .bind("CheckJumping",function(){
      this.jumpspeed = 150;
      this.canJump = true;
      if(this.hoppi==0){
        this.hoppi++;
        this.canJump = true;
      }else if (this.hoppi==1) {
          this.canJump = true;
          this.hoppi++;
      }else{
        this.canJump = false;
      }

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
    Crafty.e("2D, Canvas, Color, VeggDestroy")
      .attr({
        x: -100,
        y: -500,
        w: 1,
        h: 2000
      })
      .color('black');


// Bakken som spilleren løper på 2. nivå
  //Definerer variabler
  let bakkeIder,randomBakkebredde,posisjonSisteBakke = -1000000,sluttposisjonSisteBakke;
  //Oppdateringsfrekvens
  setInterval(spawnBakke, 1000);
  //Funksjon hver klokkefrekvens
  function spawnBakke(){
    //Sjekk om det er første 2.etg som genereres eller om det finnes en fra før
      //Oppdaterer variablene til siste posisjon om den finnes, ellers "default"
      if (posisjonSisteBakke==-1000000) { //Default
          sluttposisjonSisteBakke = -999; //Default
      }else{
          posisjonSisteBakke = Crafty("andreEtg").get(bakkeIder.length-1).x;
          sluttposisjonSisteBakke = randomBakkebredde*-1.15;
      }
      //Sjekk om siste bakke/gulv er ute av frame, generer ny
      if (posisjonSisteBakke <= sluttposisjonSisteBakke){
        //Slett forrige bakke, hopp over om default verdi
        if (posisjonSisteBakke!=-1000000){
        Crafty("andreEtg").get(bakkeIder.length-1).destroy();
      }
      //Kalkuler bredde
      randomBakkebredde = Math.floor(((Math.random()*250)+200));
      randomBakkebredde = randomBakkebredde*3,5;

        //Generer bakke/gulv
        Crafty.e("Floor, 2D, Canvas, Color, Collision, andreEtg")
          .attr({x: 1050, y: 300, w: randomBakkebredde, h: 15, hSpeed: -2})
          .color('black')
          .bind('EnterFrame', function() {
            this.x += this.hSpeed;

          })
        //Generer kolisjonbarriere for underside og front av bakke/gulv
        Crafty.e("2D, Canvas, Color, Collision, undersideGulv")
          .attr({x: 1050, y: 315, w: randomBakkebredde, h: 5, hSpeed: -2})
          .color('green')
          .bind('EnterFrame', function() {
            this.x += this.hSpeed;
          })
        Crafty.e("2D, Canvas, Color, Collision, fremsideGulv")
          .attr({x: 1045, y: 301, w: 5, h: 19, hSpeed: -2})
          .color('green')
          .bind('EnterFrame', function() {
            this.x += this.hSpeed;
          })

        //Oppdater array med alle andreEtg bakker/gulv
        bakkeIder = Crafty("andreEtg").toArray();
        posisjonSisteBakke = Crafty("andreEtg").get(bakkeIder.length-1).x;
      }
}
//spawn area
  let spawnY = [20, 160, 340, 480];
  let spawnX = 985;
  let spawnW = 15;
  let spawnH = 120
  //Generer fire spawnAreas fra array spawnY
  for(var i=0;i<spawnY.length;i++){
    Crafty.e("2D, Canvas, Color")
      .attr({
      x: spawnX,
      y: spawnY[i],
      w: spawnW,
      h: spawnH
      })
      .color('blue');
  }

// FiendtligObjekter
    setInterval(spawnFiendlig, 1000);
    let randomY = 0;
    let randomspawn;
    function spawnFiendlig(){
       randomY = Math.floor((Math.random()*70));
       randomspawn = Math.floor(((Math.random()*5)+1));
       //Select spawn
       switch(randomspawn) {
         case 1:
            randomY +=spawnY[1];
         break;
         case 2:
            randomY += spawnY[2];
         break;
         case 3:
            randomY += spawnY[3];
         break;
         case 4:
             randomY += spawnY[4];
         break;
         default:
             randomY += 1000; //Utenfor skjermen
       }
       //Generer det fiendlige objektet
        Crafty.e("2D, Canvas, Color, Collision, FiendtligObjekt")
          .attr({x: 1050, y: randomY, w: 40, h: 40, hSpeed: -4, rotation: 45})
          .checkHits()
          .onHit("spiller", function(){
            this.color("black");
          })
          .onHit("VeggDestroy", function() { // Fjern objektet når det treffer bakveggen
            this.destroy();
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
 document.getElementById("bgDataL2").innerText = "_  spawn: " + randomspawn;
 document.getElementById('bgDataL3').innerText = "_ Verdi på siste andreEtg: " + bakkeIder.length + " xverdi: "+ Crafty("andreEtg").get(bakkeIder.length-1).x;
 document.getElementById('bgDataL4').innerText = "_ HarDoublejump: " +  Crafty("spiller").harDobbelHopp + "_ er i hopp: " + Crafty("spiller").hoppi;
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
