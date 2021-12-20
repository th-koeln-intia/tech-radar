import * as rM from "./RadarMath.js";
import Segment from "./Segment.js";

export default class Sector { 
  constructor(RADAR, id, name, color, startAngle, endAngle) {
    this.RADAR = RADAR;
    this.radarID = RADAR.CONFIG.radar.id;
    this.id = id;
    this.IdText = `${this.radarID}_sector${this.id}`;
    this.name = name;
    this.color = color;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    //radialMin/radialMax are multiples of PI
    this.radialMin = rM.toRadians(this.startAngle) / Math.PI;
    this.radialMax = rM.toRadians(this.endAngle) / Math.PI;
    //calc each segment of sektor
    this.segments = [];       
    
    this.createSelectionButton();
    this.createSvgGroup();
    this.createBlipLegendDiv();

    this.calcSegments(); 
  }

  createSelectionButton(){
    let selectionDiv = document.getElementById(`${this.radarID}_selectionDiv`);
    this.buttonDiv = document.createElement(`div`);
    this.buttonDiv.id = `${this.RADAR.NAME}_selectionButton` + (this.id);
    this.buttonDiv.classList.add(`selectionButton`);
    this.buttonDiv.innerText = this.name;
    this.buttonDiv.onclick = () => {
      this.RADAR.show_sector = this.id;
      this.RADAR.update();
    };
    selectionDiv.appendChild(this.buttonDiv);
  }
  createSvgGroup(){
    let radarContent = d3.select(`g#${this.radarID}_radarContent`);
    this.svgGroup = radarContent.append(`g`)
      .attr(`id`, `${this.IdText}`)
      .attr(`class`, `radarSector`)
      .on(`mouseover`, () => this.RADAR.show_sector < 0 ? this.highlight() : null)
      .on(`mouseout`, () => this.RADAR.show_sector < 0 ? this.unhighlight() : null)
      .on(`dblclick`, () => {this.RADAR.show_sector = this.id; this.RADAR.update();});

    // append sector headline if needed
    this.RADAR.CONFIG.sector.showHeadline ? this.appendHeadline(this.svgGroup) : null;
  }
  createBlipLegendDiv(){
    let blipLegendDiv = document.getElementById(`${this.radarID}_blipLegendDiv`);
    this.legendDiv = document.createElement(`div`);
    this.legendDiv.id = `${this.radarID}_sectorLegend${this.id}`;
    this.legendDiv.classList.add(`sectorDiv`); 
    this.legendDiv.addEventListener(`mouseover`, ()=> this.RADAR.show_sector < 0 ? this.highlight() : null);
    this.legendDiv.addEventListener(`mouseout`, ()=> this.RADAR.show_sector < 0 ? this.unhighlight() : null); 
    let legendSectorHeadline = document.createElement(`div`);
    legendSectorHeadline.classList.add(`headline`);
    legendSectorHeadline.innerText = this.name;
    this.legendDiv.appendChild(legendSectorHeadline);  
    blipLegendDiv.appendChild(this.legendDiv);  
  }

  getBlips() {
    let blips = [];
    for(let segment of this.segments) 
      for(let blip of segment.blips) 
        blips.push(blip);
    return blips;
  }

  appendHeadline() {
    let headlineGroup = this.svgGroup.append(`g`)
      .attr(`class`, `sectorHeadline`);
    const sectorOuterArc = rM.describeArc(
      this.startAngle,
      this.endAngle,
      this.RADAR.RADIUS+2
    );
    headlineGroup.append(`path`)
      .attr(`id`, `${this.IdText}_headlineArc`)
      .attr(`fill`, `none`)
      .attr(`d`, sectorOuterArc);
      headlineGroup.append(`text`).append(`textPath`)
      .attr(`href`, `#${this.IdText}_headlineArc`, `http://www.w3.org/1999/xlink`)
      .attr(`startOffset`, `50%`)
      .attr(`style`, `text-anchor:middle;`)
      .text(this.name);
  }

  highlight(){
    let radarID = this.RADAR.CONFIG.radar.id;
    let svg = d3.select(`svg#${radarID}_SVG`);
    // lower opacity of all sectors first, then rise the opacity of sector to be highlighted
    svg.selectAll(`.radarSector`).style('opacity', 0.2);
    let sector = svg.select(`g#${radarID}_sector${this.id}`).style('opacity', 1);
    
    // hide all ringHeadlines and show the segmentHeadlines of sector to be highlighted
    svg.selectAll(`.ringHeadline`).attr(`display`, `none`);
    sector.selectAll(`.segmentHeadline`).attr(`display`, `block`);
  }
  unhighlight(){
    let radarID = this.RADAR.CONFIG.radar.id;
    let svg = d3.select(`svg#${radarID}_SVG`);
    svg.selectAll(`.radarSector`).style('opacity', 1);
    svg.selectAll(`.ringHeadline`).attr(`display`, `block`);
    svg.selectAll(`.segmentHeadline`).attr(`display`, `none`);
  }

  calcSegments() {
    this.RADAR.rings.forEach((ring, index) => {
      let polarMin = {
        pi: this.radialMin * Math.PI,
        radius: (index === 0) 
          ? this.RADAR.CONFIG.segment.firstMinRadiusPixel 
          : this.RADAR.rings[index - 1].radius
      };
      let polarMax = {
        pi: this.radialMax * Math.PI,
        radius: ring.radius,
      };
      this.segments.push(
        new Segment(
          this,
          index,
          ring.name,
          polarMin,
          polarMax
        )
      );
    });
  }
}
