import * as vMethods from "./visualMethods.js";
import * as rM from "./RadarMath.js";

export default class Blip {
  constructor(segment, id, stateID, name, link, moved){
    this.SEGMENT = segment;
    this.id = id;
    this.stateID = stateID;
    this.name = name;
    this.link = link;
    this.moved = moved;

    this.initPosition();
    this.configure();
  }

  initPosition(){
    let obj = this.SEGMENT.segmentFunctions.random(this.SEGMENT.SECTOR.RADAR.seed);
    this.SEGMENT.SECTOR.RADAR.seed = obj.seed;
    this.x = obj.point.x;
    this.y = obj.point.y;
  }

  configure() {
    let blip = d3.select(`g#${this.SEGMENT.SECTOR.RADAR.CONFIG.radar.id}_blip${this.id}`);
    
    // add eventlisteners
    blip
      .on('mouseover', () => {
        vMethods.showBubble(this);
        vMethods.highlitingLegendItem(this.id, this.SEGMENT.SECTOR.RADAR.CONFIG.radar.id);
      })
      .on('mouseout', () => {
        vMethods.hideBubble();
        vMethods.unhighlitingLegendItem(this.id, this.SEGMENT.SECTOR.RADAR.CONFIG.radar.id);
      });    

    // add link to blip
    blip = blip.append('a').attr('xlink:href', this.link);

    // create blip background
    let blipCircleFillColor = (this.stateID >= 0 && this.stateID < this.SEGMENT.SECTOR.RADAR.STRUCTURE.entryStates.length)
      ? d3.hsl(this.SEGMENT.SECTOR.RADAR.STRUCTURE.entryStates[this.stateID].color)
      : d3.hsl(this.SEGMENT.SECTOR.RADAR.CONFIG.blip.defaultColor);

    let blipSize = this.SEGMENT.SECTOR.RADAR.CONFIG.blip.size;
    let blipStrokeWidth = blipSize*0.1;
    let blipRingRadius = blipSize*0.5 - blipStrokeWidth*0.5;

    // add ring around blip
    let blipRingColor = d3.hsl(blipCircleFillColor);
    if(this.moved != 0) {
      blipRingColor.l = blipRingColor.l * 1.1;
      blipRingColor.opacity = 0.55;
    }
    blip.append(`circle`)
      .attr(`r`, blipRingRadius)
      .attr(`fill`, `none`)
      .attr(`stroke-width`, blipStrokeWidth)
      .attr(`stroke`, blipRingColor);

    // add arc on ring
    if(this.moved != 0){
      let arc = (this.moved < 0)
        ? rM.describeArc(this.SEGMENT.SECTOR.startAngle, this.SEGMENT.SECTOR.endAngle, blipRingRadius)
        : rM.describeArc(this.SEGMENT.SECTOR.startAngle +180, this.SEGMENT.SECTOR.endAngle +180, blipRingRadius);
      blip.append(`path`)
        .attr(`d`, arc)
        .attr(`fill`, `none`)
        .attr(`stroke-width`, blipStrokeWidth)
        .attr(`stroke`, blipCircleFillColor);
    }

    // add inner circle
    blip.append('circle')
      .attr('r', blipSize*0.7/2)
      .attr('fill', blipCircleFillColor); 

    // add id as text in the middle, textSize oriented at configured blipSize
    let fontSize = blipSize*0.33;
    blip.append('text')
      .attr('class', 'blipText')
      .attr('y', fontSize/3)
      .attr('text-anchor', 'middle')
      .style(`font-size`, fontSize)
      .text(this.id);    
  }
}