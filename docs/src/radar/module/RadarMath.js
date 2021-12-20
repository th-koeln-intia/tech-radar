export function translate(x, y) {
  return "translate(" + x + "," + y + ")";
}

export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function toGrad(degrees) {
  return degrees * (180 / Math.PI);
}

export function radiusOfPoint(point) {
  return Math.sqrt(point.x * point.x + point.y * point.y);
}

export function bounded_interval(value, min, max) {
  var low = Math.min(min, max);
  var high = Math.max(min, max);
  return Math.min(Math.max(value, low), high);
}

export function boundedRing(blipPoint, minRadius, maxRadius, config) {
  
  
  return {
    degree: blipPoint.degree,
    radius: bounded_interval(
      blipPoint.radius, 
      minRadius + (config.blip.size/2 + config.segment.padding), 
      maxRadius - (config.blip.size/2 + config.segment.padding)
    )
  };
}

export function boundedRadius(blipPoint, segment, config) {
  //TODO
}

export function boundedAngle(blipPoint, sector, config) {
  let blipPointRadius = radiusOfPoint(blipPoint);
  

  let offsetAngle = calcOffsetAngle(blipPointRadius, config);

  let sectorStartOffsetAngle = sector.startAngle + offsetAngle;
  let sectorEndOffsetAngle = sector.endAngle - offsetAngle;
  let blipPointAngle = angleOfPoint(blipPoint);
  let angle = bounded_interval(
    blipPointAngle,
    sectorStartOffsetAngle,
    sectorEndOffsetAngle
  );
  //if the blip was outside the interval the blip point is recalculated
  if (angle == sectorStartOffsetAngle)
    return pointByAngleAndRadius(
      sectorStartOffsetAngle,
      blipPointRadius
    );
  if (angle == sectorEndOffsetAngle)
    return pointByAngleAndRadius(
      sectorEndOffsetAngle,
      blipPointRadius
    );
  else return blipPoint;
}

function calcOffsetAngle(blipRadius, config){
  let oppositeCathete = config.blip.size/2 + config.segment.padding;
  let hypothenuse = Math.sqrt((Math.pow(blipRadius, 2) + Math.pow(oppositeCathete, 2)));
  let offsetAngle = toGrad(Math.asin((oppositeCathete / hypothenuse)));
  return offsetAngle;
}

export function polar(cartesian) {
  var x = cartesian.x;
  var y = cartesian.y;
  return {
    degree: Math.atan2(y, x), //degree in radians
    radius: radiusOfPoint(cartesian),
  };
}

//TODO remove -> replace with pointByAngleAndRadius
export function cartesian(polar) {
  return {
    x: polar.radius * Math.cos(polar.degree),
    y: polar.radius * Math.sin(polar.degree),
  };
}

export function angleOfPoint(point) {
  if (point.y < 0) return 360 - Math.abs(toGrad(Math.atan2(point.y, point.x)));
  else return toGrad(Math.atan2(point.y, point.x));
}

export function pointByAngleAndRadius(angle, radius) {
  return {
    x: Math.cos(toRadians(angle)) * radius,
    y: Math.sin(toRadians(angle)) * radius
  };
}

export function describeArc(startAngle, endAngle, radius){
  let startPoint = pointByAngleAndRadius(startAngle, radius);
  let endPoint = pointByAngleAndRadius(endAngle, radius);
  return [
    'M', startPoint.x, startPoint.y,
    'A', radius, radius, 0, 0, 1, endPoint.x, endPoint.y,
  ].join(' ');
}

export function describeSectorOutlines(startPoint, endPoint, radius){
  return [
    'M', startPoint.x, startPoint.y,
    'A', radius, radius, 0, 0, 1, endPoint.x, endPoint.y,
    'M 0 0 L', startPoint.x, startPoint.y, //startLine
    'M 0 0 L', endPoint.x, endPoint.y, //endLine
    'Z',
  ].join(' ');
}

export function arc(innerRadius, outerRadius, startAngle, endAngle){  
  const startMaxPoint = pointByAngleAndRadius(startAngle, outerRadius);
  const startMinPoint = pointByAngleAndRadius(startAngle, innerRadius);
  const endMaxPoint = pointByAngleAndRadius(endAngle, outerRadius);
  const endMinPoint = pointByAngleAndRadius(endAngle, innerRadius);
  return [
    'M', startMaxPoint.x, startMaxPoint.y,
    'A', outerRadius, outerRadius, 0, 0, 1, endMaxPoint.x, endMaxPoint.y, 
    'L', endMinPoint.x, endMinPoint.y,
    'A', innerRadius, innerRadius, 0, 0, 0, startMinPoint.x, startMinPoint.y,
    'L', startMaxPoint.x, startMaxPoint.y,
    'Z'
  ].join(' ');
}

export function centroid(startAngle, endAngle, minRadius, maxRadius){
  let middleAngle = (endAngle-startAngle) / 2 + startAngle;
  let middleRadius = (maxRadius-minRadius) / 2 + minRadius;

  // console.log(startAngle, endAngle, minRadius, maxRadius);
  return pointByAngleAndRadius(middleAngle, middleRadius);
}