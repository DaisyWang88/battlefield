var Rules = require('rules'),
      sys = require('sys');

var CollisionChecker = function(battlefieldWidth, battlefieldHeight) {
  var self = this;
  
  self.battlefieldWidth   = battlefieldWidth;
  self.battlefieldHeight  = battlefieldHeight;
  
  var halfWidthOffset     = Rules.tankWidth / 2 - 2;
  var halfHeightOffset    = Rules.tankHeight / 2 - 2;
  
  // Returns false if no collision, or new { x, y } if there was the collision.
  this.checkWallCollision = function(tank) {
    var hit = false;
    var fixx = fixy = angle = 0;
    var x = tank.x, y = tank.y;
    var res = false;
    
    if (x > battlefieldWidth - halfWidthOffset) {
      hit   = true;
      fixx  = battlefieldWidth - halfWidthOffset - x;
    } else if (x < halfWidthOffset) {
			hit   = true;
			fixx  = halfWidthOffset - x;
		}

		if (y > battlefieldHeight - halfHeightOffset) {
			hit   = true;
			fixy  = battlefieldHeight - halfHeightOffset - y;
		} else if (y < halfHeightOffset) {
			hit   = true;
			fixy  = halfHeightOffset - y;
		}
		
		if (hit) res = { x: x + fixx, y: y + fixy }
		
	  return res;
  }
  
  // Returns { x, y, otherTank } if collision detected
  this.checkTankCollision = function(tank, tanks, movedDistance) {
    for (var i in tanks) {
      var otherTank = tanks[i];

      if (!(otherTank == null || otherTank == tank || otherTank.isDead()) &&
          boundsIntersect(tank.boundingBox, otherTank.boundingBox)) {
        
        // Collision -- bounce back
        var c = tank.coordsForMove(-movedDistance);
        c.tank = otherTank;
        return c;
      }
    }
    
    return false;
  }

  this.checkBulletCollision = function(bullet, tanks) {
    var bx = bullet.x, by = bullet.y;
    
    if (bx < 0 || bx > battlefieldWidth || by < 0 || by > battlefieldHeight) {
      // Collision with the wall
      return { };
    } else {
      for (var i in tanks) {
        var tank = tanks[i];
        if (tank == bullet.sourceTank()) continue;
        
        if (boundsContain(tank.boundingBox, bx, by)) {
          return { tank: tank };
        }
      }
    }
    
    return false;
  }
  
  // Checks if two bounding boxes intersect
  function boundsIntersect(box1, box2) {
    var x0 = box1.x, y0 = box1.y, w0 = box1.w, h0 = box1.h;
    var x1 = box2.x, y1 = box2.y, w1 = box2.w, h1 = box2.h;
    
    if (typeof x0 == 'undefined' || typeof x1 == 'undefined') return false;
    
    return (x1 + w1 > x0) && (y1 + h1 > y0) &&
           (x1 < x0 + w0) && (y1 < y0 + h0)
  }
  
  function boundsContain(box, x, y) {
    var x0 = box.x, y0 = box.y, x1 = x0 + box.w, y1 = y0 + box.h;    
    return x > x0 && x < x1 && y > y0 && y < y1;
  }
}

module.exports = CollisionChecker;
