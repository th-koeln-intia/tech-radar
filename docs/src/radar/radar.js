//#region load data
// d3.json("dummy_data.json").then((data) => createRadar(data.config, data.entries, data.structure))
//#endregion

// function test(x){
//   console.log("TEST", x)
// }
/* 
all occurring angles are in radian 
*/
function createRadar(config, entries, structure){
    

    
    const 
        radarId = config.radar.id,
        diameter = config.radar.renderResolution,
        radius = diameter / 2,
        ringThickness = radius / structure.rings.length,
        sectorThickness = 2 * Math.PI / structure.sectors.length,
        blipRadiusWithPadding = config.blip.size / 2 + config.segment.padding,
        firstRingBlipMinRadius = blipRadiusWithPadding / Math.sin(sectorThickness / 2);
    
    let 
        radarData={}, // object to save all radar data
        seed = 42,  // seed number for reproducible random sequence
        blipIdCounter = 1, // counter variable to give each blip a unique id
        onlyOneSectorDisplayed = false
        mobileMode = (document.getElementById(radarId).offsetWidth < 730) ? true : false;

    window.onresize = () => {
        mobileMode = (document.getElementById(radarId).offsetWidth < 730) ? true : false;
        update();
    }

    //#region radar helper functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let translate = (x, y) => `translate(${x}, ${y})`;
    /*-------------------------------------------------------------------
    custom random number generator, to make random sequence reproducible
    source: https://stackoverflow.com/questions/521295
    -------------------------------------------------------------------*/
    let random = () => {let x = Math.sin(seed++) * 10000; return x - Math.floor(x);};
    let random_between = (min, max) => (min+random()*(max-min));
    let normal_between = (min, max) => (min+(random()+random())*0.5*(max-min));

    let pointByAngleAndRadius = (angle, radius) => ({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius  
    })
    
    let angleAndRadiusByPoint = (point) => ({      
        angle: angleOfPoint(point),
        radius: radiusOfPoint(point),
    })

    let angleOfPoint = (point) => (point.y < 0) 
        ? Math.PI*2 + Math.atan2(point.y, point.x)
        : Math.atan2(point.y, point.x);

    let radiusOfPoint = (point) => 
        Math.sqrt(point.x * point.x + point.y * point.y);

    let calcOffsetAngle = (radius) => 
        Math.atan(blipRadiusWithPadding / radius);

    let bounded_interval = (value, min, max) => {
        let low = Math.min(min, max);
        let high = Math.max(min, max);
        return Math.min(Math.max(value, low), high);
    }

    let boundedRadius = (point, minRadius, maxRadius) => ({ 
        angle: point.angle,
        radius: bounded_interval(point.radius, minRadius, maxRadius)
    })
    
    let boundedAngle = (point, minAngle, maxAngle) => {
        let blipPointRadius = radiusOfPoint(point);    
        let offsetAngle = calcOffsetAngle(blipPointRadius);  
        let minOffsetAngle = minAngle + offsetAngle;
        let maxOffsetAngle = maxAngle - offsetAngle;
        let blipPointAngle = angleOfPoint(point);
        let angle = bounded_interval(blipPointAngle, minOffsetAngle, maxOffsetAngle);
        //if the blip was outside the interval the blip point is recalculated
        if(angle == minOffsetAngle) return pointByAngleAndRadius(minOffsetAngle, blipPointRadius);
        if(angle == maxOffsetAngle) return pointByAngleAndRadius(maxOffsetAngle, blipPointRadius);
        else return point;
    }

    let segmentFunctions = (segment) => ({
        clip: (blip) => {
            let pointInAngleInterval = boundedAngle(blip, segment.startAngle, segment.endAngle);
            let pointInRadiusInterval = boundedRadius(
                angleAndRadiusByPoint(pointInAngleInterval),
                segment.blipMinRadius,
                segment.blipMaxRadius
            );
            blip.x = pointByAngleAndRadius(pointInRadiusInterval.angle, pointInRadiusInterval.radius).x; // adjust data too!
            blip.y = pointByAngleAndRadius(pointInRadiusInterval.angle, pointInRadiusInterval.radius).y;
            return { x: blip.x, y: blip.y };
        },
        random: () => pointByAngleAndRadius(
            random_between(segment.startAngle, segment.endAngle),
            normal_between(segment.blipMinRadius, segment.blipMaxRadius))
    })    

    let arc = (segment) => {  
        const startMaxPoint = pointByAngleAndRadius(segment.startAngle, segment.outerRadius);
        const startMinPoint = pointByAngleAndRadius(segment.startAngle, segment.innerRadius);
        const endMaxPoint = pointByAngleAndRadius(segment.endAngle, segment.outerRadius);
        const endMinPoint = pointByAngleAndRadius(segment.endAngle, segment.innerRadius);
        return [
          'M', startMaxPoint.x, startMaxPoint.y,
          'A', segment.outerRadius, segment.outerRadius, 0, 0, 1, endMaxPoint.x, endMaxPoint.y, 
          'L', endMinPoint.x, endMinPoint.y,
          'A', segment.innerRadius, segment.innerRadius, 0, 0, 0, startMinPoint.x, startMinPoint.y,
          'L', startMaxPoint.x, startMaxPoint.y,
          'Z'
        ].join(' ');
    }

    let getSectorColorPalette = (colorCode) => {
        let colorStart = d3.rgb(config.radar.defaultColor),
            colorEnd = d3.rgb(config.radar.defaultColor);        
        if(config.sector.useColor){
            colorStart = d3.rgb(colorCode);
            colorEnd = d3.rgb(colorCode);
        }
        if(config.sector.useColor && config.segment.colorGradient){
            let brighterColor = d3.hsl(colorCode);
            brighterColor.l *= config.segment.colorGradientLimit;
            colorStart = d3.rgb(colorCode);
            colorEnd = d3.rgb(brighterColor);
        }        
        return d3.scaleLinear()
                    .domain([0, structure.rings.length])
                    .range([colorStart, colorEnd]);
    }

    let getBlipColor = (blip) => 
        (blip.stateID >= 0 && blip.stateID < structure.entryStates.length)
            ? structure.entryStates[blip.stateID].color
            : config.blip.defaultColor;

    let getBlipRingColor = (blip) => {
        let color = (blip.stateID >= 0 && blip.stateID < structure.entryStates.length)
            ? d3.rgb(structure.entryStates[blip.stateID].color)
            : d3.rgb(config.blip.defaultColor);
        if(blip.moved != 0) color.opacity = 0.5; 
        return color;
    }
    let getBlipMovedIndicator = (blip) => {
        if(blip.moved != 0){
            let radius = config.blip.outerCircleRadius;

            let startAngle = (blip.moved > 0) 
                ? radarData.sectors[blip.sectorID].startAngle + Math.PI
                : radarData.sectors[blip.sectorID].startAngle;
            let endAngle = (blip.moved > 0)
                ? radarData.sectors[blip.sectorID].endAngle + Math.PI
                : radarData.sectors[blip.sectorID].endAngle;
            let startPoint = pointByAngleAndRadius(startAngle, radius);
            let endPoint = pointByAngleAndRadius(endAngle, radius); 
            return [
                'M', startPoint.x, startPoint.y,
                'A', radius, radius, 0, 0, 1, endPoint.x, endPoint.y,
            ].join(' ');
        }  
        return ``; 
    }
    //#endregion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    //#region preparing radar data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // adding inner and outer radius for each ring
    radarData.rings = structure.rings.map((ring, index) => ({
        ...ring,
        index: index,
        innerRadius: ringThickness * index,
        blipMinRadius: (index==0) ? firstRingBlipMinRadius : ringThickness * index + blipRadiusWithPadding,
        outerRadius: ringThickness * ++index,        
        blipMaxRadius: ringThickness * index - blipRadiusWithPadding,
    }));

    // generate equal pie pieces 
    radarData.sectors = structure.sectors.map((sector, index) => ({
        ...sector,
        id: index,
        idText: `${radarId}_sector${index}`,
        startAngle: sectorThickness * index,
        endAngle: sectorThickness * ++index,
        color: getSectorColorPalette(sector.color),               
        segments: radarData.rings,
    }))
    // adding sector data to segments
    radarData.sectors.forEach(sector => {
        sector.segments = sector.segments.map((segment, index) => ({
            ...segment,
            idText: `${sector.idText}_segment${index}`,
            // index: index,
            endAngle: sector.endAngle,
            startAngle: sector.startAngle,
            color: sector.color(index),
            blips: entries.entries.filter(entry => entry.sectorID == sector.id && entry.ringID == index)                    
        }))
    })
    radarData.blips = []; // list of all blips, for a better processing later on
    radarData.sectors.forEach(sector => sector.segments.forEach(segment => {
        // give each blip the corresponding segment functions
        segment.blips = segment.blips.map(blip => ({
            ...blip,
            idText: `${segment.idText}_blip${blipIdCounter}`,
            id: blipIdCounter++,
            segmentFunctions: segmentFunctions(segment),
        }))
        // save each blip in a list, for better processing later on
        segment.blips.forEach(blip => radarData.blips.push(blip))
    }));

    // give each blip the first random position
    radarData.blips.forEach(blip => {
        let point = blip.segmentFunctions.random();
        blip.x = point.x;
        blip.y = point.y;
    });

    // add data to the configuration of a blip to create blips later on
    let fontSize = config.blip.size*0.33,
        blipRadius = config.blip.size * 0.5,
        strokeWidth = blipRadius * 0.2,
        outerCircleRadius = blipRadius - strokeWidth * 0.5,
        innerCircleRadius = outerCircleRadius - strokeWidth;    

    config.blip = ({
        ...config.blip,
        fontSize: fontSize,
        radius: blipRadius,
        strokeWidth: strokeWidth,
        outerCircleRadius: outerCircleRadius,
        innerCircleRadius: innerCircleRadius
    });

    structure.entryStates = structure.entryStates.map((state, index)=>({
        ...state, 
        index: index
    }));

    console.log(structure)
    //#endregion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region create div structure
    let radarDiv = d3.select(`div#${radarId}`).classed(`radarContainer`, true);
    radarDiv.append(`div`)
        .classed(`radarTitle`, true)
        .text(config.radar.name);
    radarDiv.append(`div`)
        .classed(`radarSelection`, true);
    radarDiv.append(`div`)
        .classed(`radar`, true);
    radarDiv.append(`div`)
        .classed(`radarBlipLegend`, true);
    //#endregion

    //#region adding SVG to radarSvgDiv
    radarDiv.select(`.radar`)
        .append(`div`)
        .classed(`radarContent`, true)
        .append(`svg`)
        .attr(`id`, `${radarId}_svg`)
        .classed(`radarSVG`, true)
        .attr(`preserveAspectRatio`, `xMinYMin meet`)
        .attr(`viewBox`, `0 0 ${diameter} ${diameter}`)
    // place a rectangle behind the radar 
    radarDiv.select(`svg#${radarId}_svg`)
        .append(`rect`)
    radarDiv.select(`svg#${radarId}_svg`).append(`g`)
                .attr(`id`, `${radarId}_radarContent`)
                .attr(`transform`, translate(radius, radius));
    radarDiv.select(`.radar`)
        .append(`div`)
        .attr(`id`, `${radarId}_radarLegend`)
        .classed(`radarLegend`, true)
        .on(`click`, ()=>
            document.getElementById(`${radarId}_radarLegend`).classList.toggle(`active`))
        .text(`Legende`);
    //#endregion

    //#region event fuctions ***********************************************************************
    let update = () => {
        selectionSector.select(`.selectionButton`).style(`display`, (mobileMode) ? `none` : `block`)
        if(mobileMode && !onlyOneSectorDisplayed){
            displaySector(radarData.sectors[0]);
            changeSvgViewbox(radarData.sectors[0].idText);
        } 
    }
    
    let changeSvgViewbox = (idText) => {
        onlyOneSectorDisplayed = (idText == `${radarId}_radarContent`) ? false : true;
        let box = radarDiv.select(`g#${idText}`).node().getBBox()
        let size = Math.max(box.width, box.height);
        let x = radius + box.x;
        let y = radius + box.y;
        d3.select(`svg#${radarId}_svg`).attr(`viewBox`, `${x} ${y} ${size} ${size}`);  
    }
    let showBubble = (blip) => {
        let bubble = radarDiv.select(`g#${radarId}_bubble`).style(`display`, `block`);
        let text = bubble.select(`text`).text(blip.name);
        let textBox = text.node().getBBox();
        bubble.attr('transform', translate(blip.x - textBox.width / 2, blip.y - 19))
        bubble.select(`rect`)
            .attr('x', -5)
            .attr('y', -textBox.height)
            .attr('width', textBox.width + 10)
            .attr('height', textBox.height + 4);
        bubble.select(`path`).attr('transform', translate(textBox.width / 2 - 5, 3));
    }
    let hideBubble = () => radarDiv.select(`g#${radarId}_bubble`).style(`display`, `none`)
    let displaySector = (sector) => {
        sectors.style(`display`, `none`)
        radarDiv.select(`g#${sector.idText}`).style(`display`, `block`)
        legendSectors.style(`display`, `none`)        
        radarDiv.select(`div#${sector.idText}_legend`).style(`display`, `block`) 
    }
    let displayAllSectors = () => {
        sectors.style(`display`, `block`)
        legendSectors.style(`display`, `block`)
    }
    let focusBlip = (blip) => {
        blips.filter(data => data.sectorID == blip.sectorID).style(`opacity`, 0.5)
        radarDiv.select(`g#${blip.idText}`).style(`opacity`, 1)     
        document.getElementById(`${blip.idText}_legend`).classList.toggle(`active`)
        showBubble(blip);
    }
    let focusBlipByState = (state) => {
        blips.style(`opacity`, 0.25);
        blips.filter(blip => blip.stateID == state.index).style(`opacity`, 1)
    }

    let deFocusBlip = (blip) => {
        blips.style(`opacity`, 1);
        document.getElementById(`${blip.idText}_legend`).classList.toggle(`active`);
        hideBubble();    
    }
    let deFocusAllBlips = () => {
        blips.style(`opacity`, 1)  
    }
    let focusSector = (sector) => {
        if(!onlyOneSectorDisplayed){
            sectors.style(`opacity`, 0.5)
            radarDiv.select(`g#${sector.idText}`).style(`opacity`, 1)
            legendSectors.style(`opacity`, 0.5)        
            radarDiv.select(`div#${sector.idText}_legend`).style(`opacity`, 1) 
        }       
    }
    let focusAllSector = () => {
        sectors.style(`opacity`, 1)
        legendSectors.style(`opacity`, 1)
    }
    // radarLegend
    let focusRing = (ring) => {        
        segments.style(`opacity`, 0.25)
        segments.filter(seg => seg.index == ring.index).style(`opacity`, 1)        
    }
    let focusAllRings = () => segments.style(`opacity`, 1);
    //#endregion ***********************************************************************************

    //#region define d3 components -----------------------------------------------------------------
    let makeSector = (selection) => {
        selection           
            .attr(`id`, sector => `${sector.idText}`)
            .on(`mouseover`, sector => focusSector(sector))
            .on(`mouseout`, focusAllSector)
            .on(`click`, sector => {changeSvgViewbox(sector.idText); 
                                    displaySector(sector); })
    }    
    let makeSegment = (selection) => {
        selection            
            .attr(`id`, segment => `${segment.idText}`) 
            .classed(`segment`, true)
            .append(`path`)                       
                .attr(`d`, segment => arc(segment))
                .attr(`fill`, segment => segment.color)
                .attr(`stroke`, `grey`)
    }
    let makeBlip = (selection) => {
        selection
            .attr(`id`, blip => `${blip.idText}`)
            .classed(`blip`, true)
            .attr(`transform`, blip => translate(blip.x, blip.y))
            .on(`click, mouseover`, blip => focusBlip(blip))
            .on(`mouseout`, blip=> deFocusBlip(blip))            
        let blip = selection.append(`a`).attr(`xlink:href`, blip => blip.link);        
        // blip outer ring
        blip.append(`circle`)
            .attr(`r`, config.blip.outerCircleRadius)
            .attr(`fill`, `rgba(0, 0, 0, 0)`)
            .attr(`stroke-width`, config.blip.strokeWidth)
            .attr(`stroke`, getBlipRingColor);    
        // blip indicater for movement    
        blip.append(`path`, false)
            .attr(`d`, getBlipMovedIndicator)
            .attr(`fill`, `none`)
            .attr(`stroke-width`, config.blip.strokeWidth)
            .attr(`stroke`, getBlipColor);
        // blip innerCircle
        blip.append('circle')
            .attr('r', config.blip.innerCircleRadius)
            .attr('fill', getBlipColor); 
        // blip text
        blip.append('text')
            .classed('blipText', true)
            .attr('y', config.blip.fontSize/3)
            .attr('text-anchor', 'middle')
            .style(`font-size`, config.blip.fontSize)
            .text(blip => blip.id); 
    }
    let makeBubble = (selection) => {
        selection
            .classed(`radarBubble`, true)
            .attr(`id`, `${radarId}_bubble`)
            .style(`display`, `none`)
        let fontSize = config.blip.size/2;
        selection.append('rect')
            .attr('class', 'background')
            .attr('rx', 4)
            .attr('ry', 4);
        selection.append('text')
            .attr('class', 'bubbleText')
            .attr(`y`, -fontSize/9)
            .style(`font-size`, fontSize);
        selection.append('path')
            .attr('class', 'background')
            .attr('d', 'M 0,0 10,0 5,8 z');
    }
    let makeLegendCard = (selection, title, data, mouseover, mouseout) => {
        selection.classed(`card`, true);
        selection.append(`div`)
            .classed(`cardTitle`, true)
            .text(title);
        selection.append(`hr`);
        selection.selectAll(`div.cardItem`)
            .data(data)
            .enter()
            .append(`div`)
            .classed(`cardItem`, true)
            .text(data => data.name)
            .on(`mouseover`, (data)=> mouseover(data))
            .on(`mouseout`, (data)=> mouseout(data))
        console.log(data)
    }
    let makeLegendSector = (selection) => {
        selection            
            .attr(`id`, sector => `${sector.idText}_legend`)
            .classed(`legendSector`, true)            
            .on(`click, mouseover`, sector => focusSector(sector))
            .on(`mouseout`, focusAllSector)
            .text(sector => sector.name);
    }
    let makeLegendSegment = (selection) => {
        selection
            .attr(`id`, segment => `${segment.idText}_legend`)
            .classed(`legendSegment`, true)
            .text(segment => segment.name)
    }
    let makeLegendBlip = (selection) => {
        selection
            .attr(`id`, blip => `${blip.idText}_legend`)
            .classed(`legendBlip`, true)
            .on(`click, mouseover`, blip => focusBlip(blip))
            .on(`mouseout`, blip=> deFocusBlip(blip))
            .text(blip => `${blip.id} ${blip.name}`)
    }
    //#endregion ---------------------------------______--------------------------------------------

    //#region generate selection area ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    let selectionSector = radarDiv.select(`.radarSelection`)
    selectionSector
        .append(`div`)
        .classed(`selectionButton`, true)
        .style(`display`, (mobileMode) ? `none` : `block`)
        .on(`click`, () => { displayAllSectors();
                                changeSvgViewbox(`${radarId}_radarContent`);})
        .text(`Alle`)
    selectionSector.selectAll(null)
        .data(radarData.sectors)
        .enter()
        .append(`div`)
            .classed(`selectionButton`, true)
            .on(`click`, sector => { displaySector(sector);
                                        changeSvgViewbox(sector.idText)})
            .on(`mouseover`, sector => focusSector(sector))
            .on(`mouseout`, focusAllSector)
            .text(sector => sector.name)
    //#endregion :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    //#region generate radar :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    let sectors = d3.select(`g#${radarId}_radarContent`)
        .selectAll(`g`)
        .data(radarData.sectors)
        .enter()
        .append(`g`)
        .call(makeSector)
    let segments = sectors.selectAll(`g`)
        .data(sector => sector.segments )
        .enter()
        .append(`g`)
        .call(makeSegment)
    let blips = segments.selectAll(`g`)
        .data(segment => segment.blips)
        .enter()
        .append(`g`)        
        .call(makeBlip) 
    let bubble = d3.select(`g#${radarId}_radarContent`)
        .append(`g`)
        .call(makeBubble)
    //#endregion :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    //#region generate radarLegend :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    radarDiv.select(`.radarLegend`)
        .append(`div`)
        .attr(`id`, `${radarId}_radarLegendContainer`)
        .classed(`container`, true);
    radarDiv.select(`div#${radarId}_radarLegendContainer`)
        .append(`div`)
        .call(makeLegendCard, 
            `Blip Zustände`, 
            structure.entryStates, 
            focusBlipByState, 
            deFocusAllBlips
        );
    radarDiv.select(`div#${radarId}_radarLegendContainer`)
        .append(`div`)
        .call(makeLegendCard, 
            `Ringe/Segmente`, 
            radarData.rings, 
            focusRing, 
            focusAllRings
        );
    //#endregion :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    //#region generate radar blip legend :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    let legendSectors = radarDiv.select(`.radarBlipLegend`).selectAll(null)
        .data(radarData.sectors)
        .enter()
        .append(`div`)
        .call(makeLegendSector)            
    let legendSegments = legendSectors.selectAll(null)
        .data(sector => sector.segments.filter(segment => segment.blips.length != 0))
        .enter()
        .append(`div`)
        .call(makeLegendSegment)
    let legendBlips = legendSegments.selectAll(null)
        .data(segment => segment.blips)
        .enter()
        .append(`div`)
        .call(makeLegendBlip)
    //#endregion :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    //#region forceSimulation **********************************************************************
    // make sure that blips stay inside their segment
    let ticked = () => blips.attr(`transform`, (d) => translate(
            d.segmentFunctions.clip(d).x, 
            d.segmentFunctions.clip(d).y
    ));    
    // distribute blips, while avoiding collisions
    d3.forceSimulation(radarData.blips)
        .force(`collision`, 
            d3.forceCollide()
                .radius(config.blip.size/2 + config.blip.margin)
                .strength(0.15))
                .on(`tick`, ticked);
    //#endregion ***********************************************************************************
    
    update();
    console.log(radarData);
}