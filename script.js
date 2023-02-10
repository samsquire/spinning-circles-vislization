const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 1000, 1000);

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function rotate(angle, point_x, point_y, scale_x, scale_y, center_x, center_y) {
  
  var x1 = point_x - center_x;
  var y1 = point_y - center_y;
  
  var x2 = (x1 * Math.cos(angle) - y1 * Math.sin(angle)) * scale_x;
  var y2 = (x1 * Math.sin(angle) + y1 * Math.cos(angle)) * scale_y;
  
  var result = {
    x: x2 + center_x,
    y: y2 + center_y
}
  return result;
}

var circles = [
  {
      radius: 30,
      x: 140,
      y: 300,
      dots: [
        {
          x: 150,
          y: 150,
          radius: 30,
          angle: 180,
          movement: 5,
          children: [],
          dots: []
        },
         {
          x: 150,
          y: 150,
          radius: 30,
          angle: 100,
          movement: 5,
          children: [],
          dots: []
        },
            {
          x: 150,
          y: 150,
          radius: 30,
          angle: 50,
          movement: 5,
          children: [],
          dots: []
        }
      ],
      movement: 5,
      angle: 0, 
      children: []
    },
  {
      
      radius: 100,
      x: 300,
      y: 300,
      dots: [
        {
          x: 300,
          y: 300,
          radius: 100,
          angle: 180,
          movement: 5,
          children: [],
          dots: []
        },
         {
          x: 300,
          y: 300,
          radius: 100,
          angle: 100,
          movement: 5,
          children: [],
          dots: []
        },
            {
          x: 300,
          y: 300,
          radius: 100,
          angle: 50,
          movement: 5,
          children: [],
          dots: []
        }
      ],
      movement: 5,
      angle: 0, 
      children: [
      
          {
            x: 25,
            y: -25,
            radius: 50,
            dots: [],
            angle: 300,
            movement: 5,
            angle: 0,
            children: [
               {
                x: -25,
                y: 25,
                radius: 25,
                angle: 180,
                dots: [],
                movement: 10,
                angle: 180,
                children: [
                  {
                    x: 25,
                    y: -25,
                    radius: 150,
                    angle: 300,
                    movement: 1,
                    angle: 0,
                    children: [],
                    dots: []
                  }
                ]
              }
            ]
          },
        
      ]
      
    }
  ];

function renderCircles(center_x, center_y, circles) {
  for (var i = 0 ; i < circles.length; i++) {
        circles[i].drawn_line = false;
        drawCircle(center_x + circles[i].x, center_y + circles[i].y, circles[i].radius);
        var new_x = 0;
        var new_y = 0;
        if (!center_x) {
           new_x = circles[i].x;
        } else {
           new_x = center_x + circles[i].x;
        }
        if (!center_y) {
          new_y = circles[i].y;
        } else {
          new_y = center_y + circles[i].y;
        }
        var radius = circles[i].radius;
        var distance = 1;
        var x = new_x + radius * Math.cos((-circles[i].angle)*Math.PI/180) * distance;
    var y = new_y + radius * Math.sin((-circles[i].angle)*Math.PI/180) * distance;
    var point_size = 12;

    if (circles[i].children) {
          renderCircles(x, y, circles[i].children);
        }
    if (circles[i].dots) {
      
      for (var j = 0 ; j < circles[i].dots.length; j++) {
        var radius = circles[i].dots[j].radius;
        var distance = 1;
        var dot_x = new_x + radius * Math.cos((-circles[i].dots[j].angle)*Math.PI/180) * distance;
    var dot_y = new_y + radius * Math.sin((-circles[i].dots[j].angle)*Math.PI/180) * distance;
    var point_size = 12;
        ctx.beginPath();
        ctx.arc(dot_x, dot_y, point_size, 0, 2 * Math.PI);
        ctx.fill();
        circles[i].dots[j].angle = (circles[i].dots[j].angle + circles[i].dots[j].movement) % 360;
        circles[i].dots[j].actual_x = dot_x;
        circles[i].dots[j].actual_y = dot_y;
      }
    }

   

        
    ctx.beginPath();
    circles[i].actual_x = x;
    circles[i].actual_y = y;
    ctx.arc(x, y, point_size, 0, 2 * Math.PI);
    ctx.fill();
    circles[i].angle = (circles[i].angle + circles[i].movement) % 360;
    
    
  }
  drawLineBetween(circles, circles, circles);
   
}

function drawLineBetween(root, circles_a, circles_b) {
  for (var i = 0 ; i < circles_a.length; i++) {
  for (var j = 0 ; j < circles_b.length; j++) {
      if (j != i) {
        drawLine(circles_a[i], circles_b[j]);
        drawLineBetween(root, circles_a[i].dots, circles_b[j].children);
        drawLineBetween(root, root, circles_b[j].children);
         drawLineBetween(root, circles_a[i].dots, circles_b[j].children);
        
        recurseChildren(circles_a[i], circles_b[j]);
      }
    }
    
    
  }
  drawChildrenLines(i, circles_a, circles_b)
  
}

function recurseChildren(circles_a, circles_b) {
  
  for (var m = 0 ; m < circles_b.children.length; m++) {

          for (var k = 0 ; k < circles_a.dots.length; k++) {
            drawLine(circles_a.dots[k], circles_b.children[m]);
            recurseChildren(circles_a, circles_b.children[m]);
            
          }
        }
}

function drawChildrenLines(i, circles_a, circles_b) {
  
  for (var j = 0 ; j < circles_a.length; j++) {
    
      for (var d = 0; d < circles_a[j].dots.length; d++) {
        for (var m = 0 ; m < circles_b.length; m++) {
         if (j != i) {
           for (var k = 0; k < circles_b[m].dots.length; k++) {
          drawLine(circles_a[j].dots[d], circles_b[m].dots[k]);
             
             
             
             
           }
         }
        }
      }
    }
}

function drawLine(circle_a, circle_b) {
  ctx.beginPath();
        ctx.moveTo(circle_a.actual_x, circle_a.actual_y);
        ctx.lineTo(circle_b.actual_x, circle_b.actual_y);
        ctx.stroke();
        circle_a.drawn_line = true;
        circle_b.drawn_line = true;
}

function tick() {
  var point_size = 0.1;
  
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle();
  
  

  
   renderCircles(0, 0, circles);
}

setInterval(tick, 30);