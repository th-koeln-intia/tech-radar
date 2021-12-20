import * as vMethods from "./visualMethods.js";

export default class Blip {
  constructor(segment, id, stateID, lable, active, link, moved){
    this.SEGMENT = segment;
    this.id = id;
    this.stateID = stateID;
    this.label = lable;
    this.active = active;
    this.link = link;
    this.moved = moved;

    this.radarConfig = this.SEGMENT.sector.RADAR.CONFIG;

    this.initPosition();
    this.configure();
  }

  initPosition(){
    let obj = this.SEGMENT.segmentFunctions.random(this.SEGMENT.sector.RADAR.seed);
    this.SEGMENT.sector.RADAR.seed = obj.seed;
    this.x = obj.point.x;
    this.y = obj.point.y;
  }

  configure() {
    let blip = d3.select(`#${this.SEGMENT.sector.radarID}_blip${this.id}`);
    
    // add eventlisteners
    blip
      .on('mouseover', () => {
        vMethods.showBubble(this);
        vMethods.highlitingLegendItem(this.id, this.SEGMENT.sector.radarID);
      })
      .on('mouseout', () => {
        vMethods.hideBubble();
        vMethods.unhighlitingLegendItem(this.id, this.SEGMENT.sector.radarID);
      });    

    // add link to blip
    blip = blip.append('a').attr('xlink:href', this.link);
  
    // add circle 
    // 
    let blipSize = this.radarConfig.blip.size;
    let blipCircle = blip.append('circle').attr('r', blipSize/2);
    let blipCircleFillColor = ``;
    (this.stateID >= 0 && this.stateID < this.SEGMENT.sector.RADAR.STRUCTURE.entryStates.length)
      ? blipCircleFillColor = this.SEGMENT.sector.RADAR.STRUCTURE.entryStates[this.stateID].color
      : blipCircleFillColor = this.radarConfig.blip.defaultColor;
    blipCircle.attr('fill', blipCircleFillColor);

    // add id as text in the middle, textSize oriented at configured blipSize
    let fontSize = blipSize/2;
    blip.append('text')
      .attr('class', 'blipText')
      .attr('y', fontSize/3)
      .attr('text-anchor', 'middle')
      .style(`font-size`, fontSize)
      .text(this.id);
    
    // if (this.moved > 0) {
    //   blip.append('path')
    //     .attr('d', 'M -11,5 11,5 0,-13 z') // triangle pointing up
    //     .style('fill', this.color);
    // } else if (this.moved < 0) {
    //   blip.append('path')
    //     .attr('d', 'M -11,-5 11,-5 0,13 z') // triangle pointing down
    //     .style('fill', this.color);
    // } 

    
  }
}