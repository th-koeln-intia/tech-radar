import * as rM from "./module/RadarMath.js";
import * as vMethods from "./module/visualMethods.js";
import Ring from "./module/Ring.js";
import Blip from "./module/Blip.js";
import Sector from "./module/Sector.js";
import Bubble from "./module/Bubble.js";

let RADAR = {
  CONFIG: undefined,
  ENTRIES: undefined,
  STRUCTURE: undefined,
  NAME: undefined,
  WIDTH: undefined,
  RADIUS: undefined,
  DIV: undefined,
  show_sector: -1,
  blip_id_counter: 1,
  seed: 42,
  sectors: [],
  rings: [],
  update: () =>{update();},
};
let MOBILE = false;


export function createRadar(config, entries, structure){ 
  RADAR.CONFIG = config;
  RADAR.ENTRIES = entries;
  RADAR.STRUCTURE = structure;
  RADAR.NAME = config.radar.id;
  RADAR.WIDTH = config.radar.renderResolution;
  RADAR.RADIUS = config.radar.renderResolution / 2;
  RADAR.DIV = document.getElementById(RADAR.NAME);
  RADAR.DIV.classList.add(`radarDiv`);

  console.log(RADAR);

  let radarDivWidth = RADAR.DIV.offsetWidth;
  if (radarDivWidth < 730 && !MOBILE){
    MOBILE = true;
    RADAR.show_sector = 0;
  }
  else if(radarDivWidth >= 730) {MOBILE = false;}
      
  window.onresize = () => {
    let radarDivWidth = RADAR.DIV.offsetWidth;
    if (radarDivWidth < 730 && !MOBILE){
      MOBILE = true;
      RADAR.show_sector = 0;
    }
    else if(radarDivWidth >= 730) {MOBILE = false;}
    update();
  };

  // logRadar();
  init();      
}

function init(){
  createRadarDivStructure();
  initSVG();

  fillDivStructure();

  calculatingRadar();  
  drawRadar();
  
  update();  
}
function update(){
  displayRadarSectors();
  displayBlipLegend();
  changeSvgViewBox();
  displaySelection();
  displayRingOrSegmentHeadline();
}

function createRadarDivStructure(){
  let radarHeadlineDiv = document.createElement(`div`);
  radarHeadlineDiv.id = `${RADAR.NAME}_headlineDiv`;
  radarHeadlineDiv.classList.add(`radarHeadlineDiv`);
  radarHeadlineDiv.innerText = RADAR.CONFIG.radar.headline;

  let radarSelectionDiv = document.createElement(`div`);
  radarSelectionDiv.id = `${RADAR.NAME}_selectionDiv`;
  radarSelectionDiv.classList.add(`radarSelectionDiv`);

  let radarSvgDiv = document.createElement(`div`);
  radarSvgDiv.id = `${RADAR.NAME}_svgDiv`;
  radarSvgDiv.classList.add(`radarSvgDiv`);

  let legendDiv = document.createElement(`div`);
  legendDiv.id = `${RADAR.NAME}_legendDiv`;
  legendDiv.classList.add(`radarLegendDiv`);

  let blipLegendDiv = document.createElement(`div`);
  blipLegendDiv.id = `${RADAR.NAME}_blipLegendDiv`;
  blipLegendDiv.classList.add(`radarBlipLegendDiv`);

  RADAR.DIV.appendChild(radarHeadlineDiv);
  RADAR.DIV.appendChild(radarSelectionDiv);
  RADAR.DIV.appendChild(radarSvgDiv);
  RADAR.DIV.appendChild(legendDiv);
  RADAR.DIV.appendChild(blipLegendDiv);
}

function initSVG(){
  let radarSvgDiv = document.getElementById(`${RADAR.NAME}_svgDiv`);
  let radarSVG = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
  radarSVG.id = `${RADAR.NAME}_SVG`;
  radarSVG.classList.add(`radarSVG`);
  radarSvgDiv.appendChild(radarSVG);
  let svg = d3
    .select(`svg#${RADAR.NAME}_SVG`)
    .attr(`preserveAspectRatio`, `xMinYMin meet`)
    .attr(`viewBox`, `0 0 ${RADAR.WIDTH} ${RADAR.WIDTH}`);
  svg.append(`g`)
    .attr(`id`, `${RADAR.NAME}_radarContent`)
    .attr(`transform`, rM.translate(RADAR.RADIUS, RADAR.RADIUS));


}



function fillDivStructure(){
  fillSelectionDiv();
  fillLegendDiv();
}
function fillSelectionDiv(){
  let selectionDiv = document.getElementById(`${RADAR.NAME}_selectionDiv`);

  let allButton = document.createElement(`div`);
  allButton.id = `${RADAR.NAME}_selectionButton`;
  allButton.classList.add(`selectionButton`);
  allButton.innerText = `Alle Sectoren`
  allButton.onclick = () => {
    RADAR.show_sector = -1;
    update();
  };
  selectionDiv.appendChild(allButton); 
}
function fillLegendDiv(){
  let legendDiv = document.getElementById(`${RADAR.NAME}_legendDiv`);
  let headline = createTag(`div`, null, `headline`, `Legende`);
  legendDiv.appendChild(headline);  
  let content = createTag(`div`, `${RADAR.NAME}_legendContent`, `content`, null);

  let entryStatesDiv = createTag(`div`, `${RADAR.NAME}_entryStatesDiv`, `entryStatesDiv`, null);
  let entryStatesHeadline = createTag(`div`, null, `subHeadline`, `States`); 
  entryStatesDiv.appendChild(entryStatesHeadline);
  RADAR.STRUCTURE.entryStates.forEach((state) => {
    let stateDiv = createTag(`div`, null, `stateDiv`, null);

    let circle = createTag(`span`, null, `colorCode`, null);
    circle.style.backgroundColor = state.color;

    let text = createTag(`span`, null, `text`, state.name);

    stateDiv.appendChild(circle);
    stateDiv.appendChild(text);
    entryStatesDiv.appendChild(stateDiv);
  });


  let ringLegendDiv = document.createElement(`div`);
  ringLegendDiv.id = `${RADAR.NAME}_ringLegendDiv`;
  ringLegendDiv.classList.add(`ringLegendDiv`);
  
  let ringLegendHeadline = document.createElement(`div`); 
  ringLegendHeadline.classList.add(`subHeadline`);
  ringLegendHeadline.innerText = `Ringe/Segmente`;
  ringLegendDiv.appendChild(ringLegendHeadline);

  // let hr = document.createElement(`hr`);
  // ringLegendDiv.appendChild(hr);

  RADAR.STRUCTURE.rings.forEach((ring, index) => {
    let ringDiv = document.createElement(`div`);
    ringDiv.classList.add(`text`);
    ringDiv.innerText = `${index}. ${ring.name}`;

    ringLegendDiv.appendChild(ringDiv);
  });
  content.appendChild(entryStatesDiv);
  content.appendChild(ringLegendDiv);

  legendDiv.appendChild(content);
}

function calculatingRadar() {
  // copie and calc rings
  let firstRingThickness = RADAR.RADIUS * RADAR.CONFIG.segment.firstSegmentRadiusPercent;
  let ringThickness = (RADAR.RADIUS - firstRingThickness) / (RADAR.STRUCTURE.rings.length - 1);
  RADAR.STRUCTURE.rings.forEach((ring, index) => RADAR.rings.push(new Ring(
    ring.name,
    ring.color,
    firstRingThickness + ringThickness * index
  )));

  // copie and calc sectors
  let sectorAngleSpan = 360 / RADAR.STRUCTURE.sectors.length;
  RADAR.STRUCTURE.sectors.forEach((sector, index) => RADAR.sectors.push(new Sector( 
    RADAR,     
    index,
    sector.name,
    sector.color,
    sectorAngleSpan * index,
    sectorAngleSpan * (index + 1)
  )));
}

function drawRadar(){
  let radarGroup = d3.select(`g#${RADAR.NAME}_radarContent`);

  //draw ring headline
  RADAR.sectors[0].segments.forEach((segment) => {
    let middleRadius = (segment.polarMax.radius-segment.polarMin.radius)/2 + segment.polarMin.radius; 
    let headlineGroup = radarGroup.append(`g`)
      .attr(`class`, `ringHeadline`);

    let ringHeadlineID = `${RADAR.CONFIG.radar.id}_ring${segment.id}`;
      vMethods.appendCurvedHeadline(
        headlineGroup, 
        185, 
        355, 
        middleRadius -3, 
        segment.name, 
        ringHeadlineID);
  });


  let blips = d3.selectAll(`.blip`);
  blips.each((blip) => blip.configure());

  // create a bubble for the tooltip for each blip
  let bubble = new Bubble(radarGroup);

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr(`transform`, (d) => rM.translate(
      d.segment.segmentFunctions.clip(d).x, 
      d.segment.segmentFunctions.clip(d).y
    ));
  }
  
  // create a array from the data binded to all blips in this radar
  let blipsNodeData = Array.from(RADAR.DIV.querySelectorAll('.blip')).map(e => e.__data__);

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(blipsNodeData)
    .velocityDecay(0.19) // magic number (found by experimentation)
    .force(`collision`, d3.forceCollide().radius(RADAR.CONFIG.blip.size/2 + RADAR.CONFIG.blip.margin).strength(0.85))
    .on(`tick`, ticked);
}
// when RADAR.show_sector is negativ show whole radar, when RADAR.show_sector >= 0 show only radar sector equal to that number
 function changeSvgViewBox(){
  let strokeThickness = 1;
  let svg = d3.select(`svg#${RADAR.NAME}_SVG`);  
  let box = (RADAR.show_sector < 0)
    ? d3.select(`g#${RADAR.NAME}_radarContent`).node().getBBox()
    : d3.select(`g#${RADAR.NAME}_sector${RADAR.show_sector}`).node().getBBox();
  let size = Math.max(box.width, box.height) + strokeThickness * 2;
  let x = RADAR.RADIUS + box.x - strokeThickness;
  let y = RADAR.RADIUS + box.y - strokeThickness;
  svg.attr(`viewBox`, `${x} ${y} ${size} ${size}`);  
}
// display all sectors by negativ id, when id equal or higher than 0 only show that sector
function displayRadarSectors(){
  let svg = d3.select(`svg#${RADAR.NAME}_SVG`);
  svg.selectAll(`.radarSector`).nodes().forEach(node =>{
    let radarSector = d3.select(node).style('opacity', 1);
    (`${RADAR.NAME}_sector${RADAR.show_sector}` === node.id || RADAR.show_sector < 0)
      ? radarSector.attr(`display`, `block`)
      : radarSector.attr(`display`, `none`);
  });
}
// display all blipLegendDivs by negativ id, when id equal or higher than 0 only show that blipLegendDivs
function displayBlipLegend(){
  let legendSectorDivs = RADAR.DIV.getElementsByClassName(`sectorDiv`);
  Array.prototype.forEach.call(legendSectorDivs, (element) =>{
    (`${RADAR.NAME}_sectorLegend${RADAR.show_sector}` === element.id || RADAR.show_sector < 0)
      ? element.style.display = `block`
      : element.style.display = `none`;
  });
}

function displaySelection(){
  let selectionDivs = RADAR.DIV.getElementsByClassName(`selectionButton`);  
  Array.prototype.forEach.call(selectionDivs, (element) =>{
    (element.id === `${RADAR.NAME}_selectionButton` && MOBILE)
      ? element.style.display = `none`
      : element.style.display = `block`;
  });
}
function displayRingOrSegmentHeadline(){
  let svg = d3.select(`svg#${RADAR.NAME}_SVG`);
  if (RADAR.show_sector>=0){
    svg.selectAll(`.ringHeadline`).attr(`display`, `none`);
    svg.selectAll(`.segmentHeadline`).attr(`display`, `block`);
  }else{
    svg.selectAll(`.ringHeadline`).attr(`display`, `block`);
    svg.selectAll(`.segmentHeadline`).attr(`display`, `none`);
  }
}



function createTag(tag, id, className, innerText){
  let htmlTag = document.createElement(tag);
  id === false
    ? null
    : htmlTag.id = id;
  className === null 
    ? null
    : htmlTag.classList.add(className);
  innerText === null  
    ? null
    : htmlTag.innerText = innerText;  
  return htmlTag;
}