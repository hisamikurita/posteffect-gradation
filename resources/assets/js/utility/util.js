export default class Utils {
  static norm(value, min, max) {
    return (value - min) / (max - min);
  }
  static lerp(norm, min, max) {
    return (max - min) * norm + min;
  }
  static map(value, sourceMin, sourceMax, destMin, destMax) {
    return Utils.lerp(
      Utils.norm(value, sourceMin, sourceMax),
      destMin,
      destMax
    );
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  }

  static distance(p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceXY(x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static circleCollision(c0, c1) {
    return Utils.distance(c0, c1) <= c0.radius + c1.radius;
  }

  static circlePointCollision(x, y, circle) {
    return Utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  }

  static pointInRect(x, y, rect) {
    return (
      Utils.inRange(x, rect.x, rect.x + rect.width) &&
      Utils.inRange(y, rect.y, rect.y + rect.height)
    );
  }

  static inRange(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  }

  static rangeIntersect(min0, max0, min1, max1) {
    return (
      Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1)
    );
  }

  static rectIntersect(r0, r1) {
    return (
      Utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      Utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
    );
  }

  static degreesToRads(degrees) {
    return (degrees / 180) * Math.PI;
  }

  static radsToDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  static randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  static randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  static randomDist(min, max, iterations) {
    var total = 0;

    for (var i = 0; i < iterations; i += 1) {
      total += Utils.randomRange(min, max);
    }
    return total / iterations;
  }

  static randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  static mod(x, y) {
    return x - y * Math.floor(x / y);
  }
}