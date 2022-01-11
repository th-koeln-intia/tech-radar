import * as rM from "./RadarMath.js";

export function showBubble(blip){
  var tooltip = d3.select('#bubble text').text(blip.name);
  var bbox = tooltip.node().getBBox();
  d3.select('#bubble')
    .attr('transform', rM.translate(blip.x - bbox.width / 2, blip.y - 16))
    .style('opacity', 0.8);
  d3.select('#bubble rect')
    .attr('x', -5)
    .attr('y', -bbox.height)
    .attr('width', bbox.width + 10)
    .attr('height', bbox.height + 4);
  d3.select('#bubble path')
    .attr('transform', rM.translate(bbox.width / 2 - 5, 3));
}
export function hideBubble(){
  d3.select('#bubble')
    .attr('transform', rM.translate(0, 0))
    .style('opacity', 0);
}

export function highlitingLegendItem(blipID, NAME){
  let blipLegendItem = document.getElementById(`${NAME}_blipLegendItem${blipID}`);
  blipLegendItem.classList.add(`itemHover`);
}
export function unhighlitingLegendItem(blipID, NAME){
  let blipLegendItem = document.getElementById(`${NAME}_blipLegendItem${blipID}`);
  blipLegendItem.classList.remove(`itemHover`);
}





export function appendCurvedHeadline(svgGroup, startAngle, endAngle, radius, text, id){
  let arc = rM.describeArc(startAngle, endAngle, radius);
  svgGroup.append(`path`)
    .attr(`id`, `${id}_headlineArc`)
    .attr('fill', 'none')
    .attr(`d`, arc);
  svgGroup.append('text').append('textPath')    
    .attr('href', `#${id}_headlineArc`, 'http://www.w3.org/1999/xlink')
    .attr('startOffset', '50%')
    .attr('style', 'text-anchor:middle;')
    .text(text);
}