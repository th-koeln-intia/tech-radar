import * as rM from "./RadarMath.js";
import * as vMethods from "./visualMethods.js";
import Blip from "./Blip.js";

export default class Segment {
  constructor(sector, id, name, polarMin, polarMax) {
    this.radarConfig = sector.RADAR.CONFIG;
    this.sector = sector;
    this.id = id;    
    this.name = name;
    this.polarMin = polarMin;
    this.polarMax = polarMax;
    this.IdText = `${sector.IdText}_segment${id}`;
    this.blips = [];    
    this.segmentFunctions = this.segmentFunctions();

    this.createSvgGroup();
    this.addBlips();
    this.createBlipGroups();
    this.createBlipLegendDiv();
  }

  createSvgGroup(){
    this.svgGroup = this.sector.svgGroup.append(`g`);
    let arc = rM.arc(
      this.polarMin.radius === this.radarConfig.segment.firstMinRadiusPixel 
        ? 0 
        : this.polarMin.radius, 
      this.polarMax.radius, 
      this.sector.startAngle, 
      this.sector.endAngle);

    let segmentPath = this.svgGroup.append('path')
      // .attr("id", "segment" + this.id)
      .attr("class", "radarLines")
      .attr("d", arc);

    /* if sectors are not to be drawn in separate colors the default color is used */
    this.radarConfig.sector.useColor === true ? segmentPath.attr('fill', this.sector.color) : segmentPath.attr('fill', this.radarConfig.radar.defaultColor);

    if( this.radarConfig.segment.colorGradient){
      /* if sectors are not to be drawn in separate colors the default color is used */
      let sectorColorHSL = this.radarConfig.sector.useColor === true ? d3.hsl(this.sector.color) : d3.hsl(this.radarConfig.radar.defaultColor);
      //brightens the color in steps depending on the number of the total of segments
      let remainingLightness = (this.radarConfig.segment.colorGradientLigther)
        ? Math.abs(this.radarConfig.segment.colorLigthnessMax - sectorColorHSL.l)
        : Math.abs(sectorColorHSL.l - this.radarConfig.segment.colorLigthnessMin);
      let lightnessSteps = remainingLightness / this.sector.RADAR.rings.length;
      let lightnessValue = (this.radarConfig.segment.colorGradientLigther)
        ? sectorColorHSL.l + lightnessSteps*this.id
        : sectorColorHSL.l - lightnessSteps*this.id;
      let segmentColor = d3.hsl(
        sectorColorHSL.h, 
        sectorColorHSL.s, 
        lightnessValue
      );
      segmentPath.attr('fill', segmentColor);
    }

    // append segmentID as headline in middle of segment
    let middlePoint = rM.centroid(this.sector.startAngle, this.sector.endAngle, this.polarMin.radius, this.polarMax.radius);
    let headline = this.svgGroup.append(`text`)
      .attr(`class`, `segmentHeadline`)
      .attr(`transform`, rM.translate(middlePoint.x, middlePoint.y))      
      .text(this.id);
    let headlineFontSize = parseInt(getComputedStyle(document.querySelector('.segmentHeadline')).getPropertyValue('font-size'), 10);
    headline.attr(`y`, headlineFontSize/3);
    
  }

  createBlipGroups(){
    let blipGroup = this.svgGroup.append(`g`);

    blipGroup.selectAll(`.blip`)
      .data(this.blips)
      .enter()
      .append(`g`)
      .attr(`class`, `blip`)
      .attr(`id`, (blip) => `${this.sector.radarID}_blip${blip.id}`);
  }
  createBlipLegendDiv(){
    if (!(this.blips === undefined || this.blips.length == 0)){
      this.legendDiv = document.createElement(`div`);
      this.legendDiv.classList.add(`segmentDiv`);

      let headline = document.createElement(`div`);
      headline.classList.add(`headline`);
      headline.innerText = this.name;
      this.legendDiv.appendChild(headline);    
      let blipList = document.createElement(`div`);
      blipList.classList.add(`blipList`);
      this.legendDiv.appendChild(blipList);
      this.blips.forEach(blip => {
        let blipListItem = document.createElement(`div`);
        blipListItem.id = `${this.sector.radarID}_blipLegendItem${blip.id}`;
        blipListItem.classList.add(`item`);
        blipListItem.innerText = `${blip.id}. ${blip.label}`;  
        blipListItem.addEventListener(`mouseover`, ()=>{
          vMethods.showBubble(blip);
          vMethods.highlitingLegendItem(blip.id, this.sector.radarID);
        });
        blipListItem.addEventListener(`mouseout`, ()=>{
          vMethods.hideBubble();
          vMethods.unhighlitingLegendItem(blip.id, this.sector.radarID);
        });  
        blipList.appendChild(blipListItem);
      });
      this.sector.legendDiv.appendChild(this.legendDiv);
    }
  }

  addBlips(){
    // filter entries list from radar to a list containing only entries for this segment and activ entries
    let blipList = this.sector.RADAR.ENTRIES.entries.filter(
      (entry) => 
        entry.sectorID == this.sector.id && entry.ringID == this.id &&  // filter entries to this segment
        entry.active);  // filter only activ entries
    // push each entry for this segment, as Blip in blipList
    blipList.forEach((entry) => {
      this.blips.push(new Blip(
        this,
        this.sector.RADAR.blip_id_counter++,
        entry.sectorID,
        entry.ringID,
        entry.stateID,
        entry.name,
        entry.active,
        entry.link,
        entry.moved
      ));
    });      
  }

  segmentFunctions(){
    return {
      clip: (blip) => {
        var pointInAngleInterval = rM.boundedAngle(blip, this.sector, this.radarConfig);
        var pointInRadiusInterval = rM.boundedRing(
          rM.polar(pointInAngleInterval),
          this.polarMin.radius,
          this.polarMax.radius,
          this.radarConfig
        );
        blip.x = rM.cartesian(pointInRadiusInterval).x; // adjust data too!
        blip.y = rM.cartesian(pointInRadiusInterval).y;
        return { x: blip.x, y: blip.y };
      },
      random: (seed) => {
        /*-----------------------------------------------------------------------------------------------
          custom random number generator, to make random sequence reproducible
          source: https://stackoverflow.com/questions/521295
          -----------------------------------------------------------------------------------------------*/
        //TODO move random to radarMath.js
        function random() {
          var x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        }
        function random_between(min, max) {
          return min + random() * (max - min);
        }
        function normal_between(min, max) {
          return min + (random() + random()) * 0.5 * (max - min);
        }
        return {
          point: 
            rM.cartesian({
              degree: random_between(this.polarMin.pi, this.polarMax.pi),
              radius: normal_between(this.polarMin.radius, this.polarMax.radius),
            }),
          seed: seed
        };
      },
    };
  }
}
