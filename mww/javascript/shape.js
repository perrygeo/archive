//
// Point and Polygon classes.
//
function Point(x, y)
{
  this.x = x;
  this.y = y;
}

new Point(0);

function Polygon()
{
  this.points = new Array();
  this.numpoints = 0;
}

function Polygon_add(point)
{
  this.points[this.numpoints] = point;
  this.numpoints++;
}

function Polygon_contains(point)
{
  var i, j, status=false;

  for (i=0, j=this.numpoints-1; i<this.numpoints; j=i++) {
    if ((((this.points[i].y<=point.y) && (point.y<this.points[j].y)) || ((this.points[j].y<=point.y) && (point.y<this.points[i].y))) && (point.x < (this.points[j].x - this.points[i].x) * (point.y - this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x))
      status = !status;
  }
  return status;
}

new Polygon(0);

Polygon.prototype.add = Polygon_add;
Polygon.prototype.contains = Polygon_contains;
