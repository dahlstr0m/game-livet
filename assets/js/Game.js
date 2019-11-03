// Initialiser spillet, angi størrelse på spillvindu.
Crafty.init(1000,700, document.getElementById('game'));

// Fast bakgrunn.
Crafty.background("#7DDEEF url(assets/img/sky1.png) no-repeat center center");

// Bakken som spilleren løper på.
Crafty.e('Floor, 2D, Canvas, Color')
  .attr({x: 0, y: 600, w: 1000, h: 100})
  .color('#303030');

// Left border - utenfor spillet for å hindre at spilleren løper utenfor.
Crafty.e('2D, Canvas, Solid, Color')
  .attr({x: -100, y: 0, w: 100, h: 700})
  .color('#303030');

// Legg til spiller.
Crafty.e('2D, Canvas, Color, Twoway, Gravity')
  .attr({x: 0, y: 0, w: 25, h: 50})
  .stopOnSolids()
  .color('#F00')
  .twoway(200)
  .gravity('Floor');