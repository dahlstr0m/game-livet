
//Generer bakgrunnstall til utviklingsøyemed
    let bgData = document.getElementById('game');
    let div = document.createElement('div');
    div.innerHTML = '<p id="bgDataL1"></p>';
    div.style ="display:block;"; //----------------------> Endres til "none" for å skjule bakgrunnstall
    div.id = "bgData"
    bgData.appendChild(div);

    setInterval(bgDataOppdater, 100);
    function bgDataOppdater() {
     document.getElementById("bgDataL1").innerText = "_  X: "+ Crafty("spiller").x.toFixed(1) + ' , ' + "Y: " + Crafty("spiller").y.toFixed(1) + ' ___hoppi: '+Crafty("spiller").hoppi;
    }

// Initialiser spillet, angi størrelse på spillvindu.
Crafty.init(1000,700, document.getElementById('game'));

// Boundaries for brettet.
Crafty.map.boundaries({min: {x:0, y:0}, max: {x:1000, y:700}})
// Fast bakgrunn.
Crafty.background("#7DDEEF url(assets/img/livet_background.png) no-repeat center center");

// Definerer Startskjerm
Crafty.defineScene("startSkjerm", function() {

  Crafty.e("2D, DOM, Text, Mouse, Collision, starter")
      .attr({ w: 300, h: 160, x: 300, y: 200 })
      .text("Start")
      .textFont({size:'130px', weight:'bold'})
      .css({"text-align": "center"})
      .textColor("#FFFFFF")
      .bind('Click', function(MouseEvent){
        Crafty.enterScene("spillet");
      });

      // Spiller
      Crafty.e('2D, Canvas, Color, Twoway, Gravity, Collision, spiller, Persist')
        .attr({x: 200, y: 225, w: 75, h: 125, hoppi: 0})
        .color('#F00')
        .twoway(200)
        .gravity('Floor')
        .checkHits('Vegg,VeggMidt, Floor')
        .onHit("Vegg", function(){
          this.x=0;
        })
        .onHit("VeggMidt", function(){
          this.x=726;
        })
        .onHit("Floor", function(){
          this.hoppi = 0;
      //    this.rotation = 0;        //Tryn/fall
        })
        .onHit("starter", function(){
          Crafty.enterScene("spillet");
        })
        .onHit("undersideGulv", function(){
          this.y=320;
          this.hoppi = 3;           //Tryn/fall
        //  this.rotation = 45;       //Tryn/fall
        })
        .onHit("fremsideGulv", function(){
          this.x=this.x-2;
          this.y=this.y+2;
        })
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
              if (this.y==475) {
                  this.hoppi=0;
              }else{
                this.canJump = false;
              }
            }

        });

        // Bakken som spilleren løper på.
        Crafty.e('Floor, 2D, Canvas, Color, Collision, Persist')
          .attr({x: 0, y: 600, w: 1000, h: 100})
          .color('#303030');

          // Vegger
          Crafty.e("2D, Canvas, Color, Vegg, Persist")
            .attr({
              x: 0,
              y: 0,
              w: 1,
              h: 700
            })
            .color('black');
          Crafty.e("2D, Canvas, Color, VeggMidt, Persist")
            .attr({
              x: 800,
              y: 0,
              w: 1,
              h: 700
            })
            .color('black');
          Crafty.e("2D, Canvas, Color, VeggDestroy, Persist")
            .attr({
              x: -100,
              y: -500,
              w: 1,
              h: 2000
            })
            .color('black');
          //Timer tekst
          Crafty.e("2D, DOM, Text, timerText, Persist")
            .attr({ w:700, h:50, x: 250, y: 15})
            .textFont({size:'40px', weight:'bold'})
            .css({"text-align": "right"})
            .textColor("#FFFFFF")
            .text("0.000 sek");
          //Poengtekst
          Crafty.e("2D, DOM, Text, poengText, Persist")
            .attr({w:700, h:50, x: 250, y: 60})
            .textFont({size:'40px'})
            .css({"text-align": "right"})
            .textColor("#FFFFFF")
            .text("0 livspoeng");
});

//Definerer spillet
Crafty.defineScene("spillet", function() {
        //Oppdater hver klokkefrekvens
        setInterval(function () {
            spawnBakke();
            spawnFiendlig();
          }, 1000);
        setInterval(function () {
            poengUpdate();
            timerUpdate();
          }, 100);



        // Bakken som spilleren løper på 2. nivå
          //Definerer variabler
          let bakkeIder,randomBakkebredde,posisjonSisteBakke = -1000000,sluttposisjonSisteBakke;
          //Spawn bakke
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
            let randomY = 0;
            let randomspawn;
            //Spawn fiender funksjon
            function spawnFiendlig(){
               randomY = Math.floor((Math.random()*68)+2);
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
                    Crafty.enterScene("dode");
                  })
                  .onHit("VeggDestroy", function() { // Fjern objektet når det treffer bakveggen
                    this.destroy();
                  })
                  .color('orange')
                  .bind('EnterFrame', function() {
                    this.x += this.hSpeed;
                  })
            };


        // Tidsteller, teller tiendedels sekunder. On spiller death - run clearInterval (ikke implementert)
        var time = 0;
        var startTime = Date.now();
        function timerUpdate () {
          let time = Date.now() - startTime;
          Crafty("timerText").text((time/1000).toFixed(3).toString() + " sek");
        }

        // Poengteller, gir gitt mengde poeng per intervall.
        var poeng = 0;
        // Kan brukes til å øke hastigheten på økningen av poeng, feks når man passerer en viss poenggrense.
        var poengMultiplier = 1.5;
        function poengUpdate () {
          poeng += 1 * poengMultiplier;
          Crafty("poengText").text(poeng.toFixed(0).toString() + " livspoeng");
        }

}); //Avslutt define spillet

//Definerer dode scene
Crafty.defineScene("dode", function() {



}); //Avslutt define dode

//Kjør spillet
Crafty.enterScene("startSkjerm");
