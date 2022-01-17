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
  // displaySelection();
  displaySelectAllButton();
  displayRingOrSegmentHeadline();
}

function createRadarDivStructure(){
  let radarDiv = d3.select(`div#${RADAR.NAME}`);

  // append div for headline
  radarDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_headlineDiv`)
    .attr(`class`, `radarHeadlineDiv`)
    .text(RADAR.CONFIG.radar.headline);

  // append div for selection
  radarDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_selectionDiv`)
    .attr(`class`, `radarSelectionDiv`);

  // append div to create the svg in
  radarDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_svgDiv`)
    .attr(`class`, `radarSvgDiv`);

  // append div for legend
  radarDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_legendDiv`)
    .attr(`class`, `radarLegendDiv`);

  // append div for blipLegend
  radarDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_blipLegendDiv`)
    .attr(`class`, `radarBlipLegendDiv`);
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
  appendSelectAllButton();
  fillLegendDiv();
}
function appendSelectAllButton(){
  let selectionDiv = d3.select(`div#${RADAR.NAME}_selectionDiv`);
  selectionDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_selectionButton`)
    .attr(`class`, `selectionButton`)
    .text(`Alle Sektoren`)
    .on(`click`, ()=>{RADAR.show_sector = -1; update();})
}

function displayLegendContent(){
  let legendContentDiv = document.getElementById(`${RADAR.NAME}_legendContent`);
  (legendContentDiv.style.display === `grid`)
    ? legendContentDiv.style.display = `none`
    : legendContentDiv.style.display = `grid`;
}

function fillLegendDiv(){
  let legendDiv = d3.select(`div#${RADAR.NAME}_legendDiv`);
  console.log(legendDiv)
  // append headline text
  legendDiv.append(`div`)
    .attr(`class`, `headline`)
    .text(`Legende`)
    .on(`click`, ()=> displayLegendContent());
  // append content div
  let content = legendDiv.append(`div`)
    .attr(`id`, `${RADAR.NAME}_legendContent`)
    .attr(`class`, `content`)
    .style(`display`, `none`)

  // #region append and fill entryStatesDiv
  let entryStatesDiv = content.append(`div`)
    .attr(`id`, `${RADAR.NAME}_entryStatesDiv`)
    .attr(`class`, `entryStatesDiv`);
  entryStatesDiv.append(`div`)
    .attr(`class`, `subHeadline`)
    .text(`Zustände`);

  RADAR.STRUCTURE.entryStates.forEach((state) => {
    let stateDiv = entryStatesDiv.append(`div`)
      .attr(`class`, `stateDiv`);
    stateDiv.append(`div`)
      .attr(`class`, `colorCode`)
      .style(`background-color`, state.color);
    stateDiv.append(`div`)
      .attr(`class`, `text`)
      .text(state.name);
  });
  // #endregion

  // #region append and fill ringLegendDiv
  let ringLegendDiv = content.append(`div`)
    .attr(`id`, `${RADAR.NAME}_ringLegendDiv`)
    .attr(`class`, `ringLegendDiv`);
  ringLegendDiv.append(`div`)
    .attr(`class`, `subHeadline`)
    .text(`Ringe/Segmente`);

  RADAR.STRUCTURE.rings.forEach((ring, index) => {
    ringLegendDiv.append(`div`)
      .attr(`class`, `text`)
      .text(`${index}. ${ring.name}`);
  });
  // #endregion
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
        180, 
        0, 
        middleRadius -3, 
        segment.name, 
        ringHeadlineID);
  });


  let blips = d3.selectAll(`.blip`);
  blips.each((blip) => blip.configure());


  // create a bubble for the tooltip for each blip
  let bubble = new Bubble(RADAR, radarGroup);

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr(`transform`, (d) => rM.translate(
      d.SEGMENT.segmentFunctions.clip(d).x, 
      d.SEGMENT.segmentFunctions.clip(d).y
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

let displaySelectAllButton = () =>
  d3.select(`div#${RADAR.NAME}_selectionButton`).style(`display`, MOBILE ? `none` : `block`);

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
