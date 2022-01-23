/* 
all occurring angles are in radian 
*/
function createRadar(config, entries, structure){   
    const 
        radarId = config.radar.id,
        diameter = config.radar.renderResolution,
        radius = diameter / 2,
        ringThickness = radius / structure.rings.list.length,
        sectorThickness = 2 * Math.PI / structure.sectors.length,
        blipRadiusWithPadding = config.blip.size / 2 + config.segment.padding,
        firstRingBlipMinRadius = blipRadiusWithPadding / Math.sin(sectorThickness / 2);
    
    let 
        radarData={}, // object to save all radar data
        seed = 42,  // seed number for reproducible random sequence
        blipIdCounter = 1, // counter variable to give each blip a unique id
        onlyOneSectorDisplayed = false;

    window.onresize = () => {
        mobileMode = (getSvgDivWidth() < diameter) ? true : false;
        update();
    }    

    //#region helper function math ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    //#endregion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region helper function segment borders ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    /* Checks if a value is in interval between min and max. 
    -> If the value is below the interval minimum, the interval minimum is returned.
    -> If the value is above the interval maximum, the interval maximum is returned.*/
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
            blip.x = pointByAngleAndRadius(pointInRadiusInterval.angle, pointInRadiusInterval.radius).x;
            blip.y = pointByAngleAndRadius(pointInRadiusInterval.angle, pointInRadiusInterval.radius).y;
            return { x: blip.x, y: blip.y };
        },
        random: () => pointByAngleAndRadius(
            random_between(segment.startAngle, segment.endAngle),
            normal_between(segment.blipMinRadius, segment.blipMaxRadius))
    })
    //#endregion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    //#region helper functions radar ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let getSvgDivWidth = () => {
        // returns the width of the div tag where the svg is placed in excluding the padding
        let radarOffsetWidth = radarDiv.select(`.radar`).node().offsetWidth;
        let padding = parseInt(window.getComputedStyle(radarDiv.select(`.radar`).node()).paddingLeft) * 2;
        return radarOffsetWidth - padding;
    }

    let translate = (x, y) => `translate(${x}, ${y})`;       

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

    let arcOuterLine = (segment) => {
        const radius = segment.outerRadius + 6;
        const startPoint = pointByAngleAndRadius(segment.startAngle, radius);
        const endPoint = pointByAngleAndRadius(segment.endAngle, radius);        
        return [
            'M', startPoint.x, startPoint.y,
            'A', radius, radius, 0, 0, 1, endPoint.x, endPoint.y
          ].join(' ');
    }

    let getSectorColorPalette = (colorCode) => {
        let colorStart, colorEnd, brighterColor;   
        switch (true){
            case config.sector.useColor && config.segment.colorGradient:
                brighterColor = d3.hsl(colorCode);
                brighterColor.l *= config.segment.colorGradientLimit;
                colorStart = d3.rgb(colorCode);
                colorEnd = d3.rgb(brighterColor);
                break;
            case config.segment.colorGradient:
                brighterColor = d3.hsl(config.radar.defaultColor);
                brighterColor.l *= config.segment.colorGradientLimit;
                colorStart = d3.rgb(config.radar.defaultColor);
                colorEnd = d3.rgb(brighterColor);
                break;
            case config.sector.useColor:
                colorStart = d3.rgb(colorCode);
                colorEnd = d3.rgb(colorCode);
                break;
            default:
                colorStart = d3.rgb(config.radar.defaultColor);
                colorEnd = d3.rgb(config.radar.defaultColor);    
        }        
        return d3.scaleLinear()
                    .domain([0, structure.rings.list.length])
                    .range([colorStart, colorEnd]);
    }

    let getBlipColor = (blip) => 
        (blip.stateID >= 0 && blip.stateID < structure.entryStates.list.length)
            ? structure.entryStates.list[blip.stateID].color
            : config.blip.defaultColor;

    let getBlipRingColor = (blip) => {
        let color = (blip.stateID >= 0 && blip.stateID < structure.entryStates.list.length)
            ? d3.rgb(structure.entryStates.list[blip.stateID].color)
            : d3.rgb(config.blip.defaultColor);
        if(blip.moved != 0) color.opacity = 0.25; 
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
    //#endregion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    //#region preparing radar data ||||||||||||||||||||||||||||||||||||||||||||||||||||||
    // adding inner and outer radius for each ring
    radarData.rings = structure.rings.list.map((ring, index) => ({
        ...ring,
        index: index,
        innerRadius: ringThickness * index,
        blipMinRadius: (index==0) 
            ? firstRingBlipMinRadius 
            : ringThickness * index + blipRadiusWithPadding,
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
            endAngle: sector.endAngle,
            startAngle: sector.startAngle,
            color: sector.color(index),
            blips: entries
                        .filter(entry => entry.sectorID == sector.id && entry.ringID == index) 
                        .sort((a, b) => a.name.localeCompare(b.name))        
        }))
    })
    radarData.blips = []; // list of all blips, for a better processing later on
    radarData.sectors.forEach(sector => sector.segments.forEach(segment => {
        // give each blip the corresponding segment functions
        segment.blips = segment.blips.map(blip => ({
            ...blip,
            idText: `${segment.idText}_blip${blipIdCounter}`,
            id: blipIdCounter++,
            focused: false,
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
    let fontSize = config.blip.size * 0.33,
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

    structure.entryStates.list = structure.entryStates.list.map((state, index)=>({
        ...state, 
        index: index
    }));
    //#endregion ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    //#region create div structure ______________________________________________________
    let radarDiv = d3.select(`div#${radarId}`).classed(`radarContainer`, true);
    if(config.radar.showName){
        radarDiv.append(`div`)
            .classed(`radarTitle`, true)
            .text(config.radar.name);
    }
    // select sector dropdown
    radarDiv.append(`div`)
        .attr(`id`, `${radarId}_selectionDropdown`)
        .classed(`radarSelection dropdown`, true);   
    radarDiv.append(`div`)
        .classed(`radar`, true)
        .attr(`id`, `${radarId}_radarDiv`);
    radarDiv.append(`div`)
        .classed(`radarBlipLegend`, true);
    //#endregion ________________________________________________________________________

    //#region append radar SVG and legend <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    radarDiv.select(`.radar`)
        .append(`div`)
        .classed(`radarContent`, true)
        .append(`svg`)
        .attr(`id`, `${radarId}_svg`)
        .classed(`radarSVG`, true)
        .attr(`preserveAspectRatio`, `xMinYMin meet`)
        .attr(`viewBox`, `0 0 ${diameter} ${diameter}`);
    radarDiv.select(`svg#${radarId}_svg`).append(`g`)
                .attr(`id`, `${radarId}_radarContent`)
                .attr(`transform`, translate(radius, radius));
    // append radar legend div
    radarDiv.select(`.radar`)
        .append(`div`)
        .attr(`id`, `${radarId}_radarLegend`)
        .classed(`radarLegend dropdown`, true)
        .on(`click`, ()=>
            document.getElementById(`${radarId}_radarLegend`).classList.toggle(`active`))
        .text(`Legende`);
    //#endregion <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // can be declared only after the radar svg is appended
    let mobileMode = (getSvgDivWidth() < diameter) ? true : false;

    //#region event fuctions general ****************************************************
    let update = () => {
        selectionDropdownContent.select(`.selectionButton`)
                                    .style(`display`, (mobileMode) ? `none` : `block`);
        if(mobileMode && !onlyOneSectorDisplayed){
            displaySector(radarData.sectors[0]);
            changeSvgViewbox(radarData.sectors[0].idText);
            selectionDropdownText.text(radarData.sectors[0].name);
        } 
        else changeSvgViewbox(`${radarId}_radarContent`);
    }

    let changeSvgViewbox = (idText) => {
        onlyOneSectorDisplayed = (idText == `${radarId}_radarContent`) ? false : true;
        let box = radarDiv.select(`g#${idText}`).node().getBBox()
        let size = Math.max(box.width, box.height);
        let x = radius + box.x;
        let y = radius + box.y;
        d3.select(`svg#${radarId}_svg`).attr(`viewBox`, `${x} ${y} ${size} ${size}`); 
    }    
    //#endregion ************************************************************************

    //#region event functions sector ****************************************************
    let displayAllSectors = () => {
        sectors.style(`display`, `block`);
        blipLegendSectors.style(`display`, `block`);
    }
    let displaySector = (sector) => {
        sectors.style(`display`, `none`);
        radarDiv.select(`g#${sector.idText}`).style(`display`, `block`);
        blipLegendSectors.style(`display`, `none`);
        radarDiv.select(`div#${sector.idText}_legend`).style(`display`, `block`); 
    }
    let focusAllSector = () => {
        sectors.style(`opacity`, 1);
        blipLegendSectors.style(`opacity`, 1);
    }
    let focusSector = (sector) => {
        if(!onlyOneSectorDisplayed){
            sectors.style(`opacity`, 0.25);
            radarDiv.select(`g#${sector.idText}`).style(`opacity`, 1);
            blipLegendSectors.style(`opacity`, 0.25);
            radarDiv.select(`div#${sector.idText}_legend`).style(`opacity`, 1);
        }       
    }
    //#endregion ************************************************************************

    //#region event functions ring ******************************************************
    let focusRing = (ring) => {        
        segments.style(`opacity`, 0.25)
        segments.filter(seg => seg.index == ring.index).style(`opacity`, 1)        
    }
    let focusAllRings = () => segments.style(`opacity`, 1);
    //#endregion ************************************************************************

    //#region event functions blip ******************************************************
    let blipClick = (blip) => {
        let blipData = radarData.blips.find(data => data.id == blip.id);
        if (blipData.focused){
            window.open(blipData.link);
        }
        else blipData.focused = true;
    }
    
    let focusAllBlips = () => {
        radarData.blips.forEach(blip => blip.focused = false);
        blips.style(`opacity`, 1);
        radarDiv.selectAll(`.blipLegendBlip`).classed(`active`, false);
        hideBubble(); 
    }

    let focusBlip = (blip) => {
        radarData.blips.find(data => data.id == blip.id).focused = true;
        blips.filter(data => data.sectorID == blip.sectorID).style(`opacity`, 0.25);
        radarDiv.select(`g#${blip.idText}`).style(`opacity`, 1);
        blipLegendBlips.filter(data => data.id == blip.id).classed(`active`, true);
        showBubble(blip);
    }

    let focusBlipByState = (state) => {
        blips.style(`opacity`, 0.25);
        blips.filter(data => data.stateID == state.index).style(`opacity`, 1);
        blipLegendBlips.filter(data => data.stateID == state.index).classed(`active`, true);
    }

    let focusBlipByMovement = (movementValue) => {
        blips.style(`opacity`, 0.25);
        if(movementValue > 0) {
            blips.filter(data => data.moved > 0).style(`opacity`, 1);
            blipLegendBlips.filter(data => data.moved > 0).classed(`active`, true);
        }
        if(movementValue < 0) {
            blips.filter(data => data.moved < 0).style(`opacity`, 1);
            blipLegendBlips.filter(data => data.moved < 0).classed(`active`, true);
        }
        if(movementValue == 0) {
            blips.filter(data => data.moved == 0).style(`opacity`, 1);
            blipLegendBlips.filter(data => data.moved == 0).classed(`active`, true);
        }
    }
    //#endregion ************************************************************************
    
    //#region event functions bubble ****************************************************
    let showBubble = (blip) => {
        bubble.style(`display`, `block`);
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
    let hideBubble = () => 
        radarDiv.select(`g#${radarId}_bubble`).style(`display`, `none`);
    //#endregion ************************************************************************

    //#region d3-components radar -------------------------------------------------------
    let makeSector = (selection) => {
        selection           
            .attr(`id`, sector => `${sector.idText}`)
            .on(`mouseover`, sector => focusSector(sector))
            .on(`mouseout`, focusAllSector)
            .on(`click`, sector => { 
                displaySector(sector);
                changeSvgViewbox(sector.idText); 
            });        
        if(config.sector.showName){
            let name = selection.append(`g`)
                .attr(`class`, `sectorName`)
            name.append(`path`)
                .attr(`id`, data => `${data.idText}_name`)
                .attr(`d`, data => arcOuterLine(data.segments[data.segments.length-1]))
                .attr(`fill`, `none`);
            name.append(`text`).append(`textPath`)
                .attr(`href`, data => `#${data.idText}_name`, `http://www.w3.org/1999/xlink`)
                .attr(`startOffset`, `50%`)
                .attr(`style`, `text-anchor:middle;`)
                .text(data => data.name);
        }                           
    }    

    let makeSegment = (selection) => {
        selection            
            .attr(`id`, segment => `${segment.idText}`) 
            .classed(`segment`, true)
            .append(`path`)  
                .classed(`radarLines`, true)                     
                .attr(`d`, segment => arc(segment))
                .attr(`fill`, segment => segment.color);
    }

    let makeBlip = (selection) => {
        selection
            .attr(`id`, data => `${data.idText}`)
            .classed(`blip`, true)
            .attr(`transform`, data => translate(data.x, data.y))
            .on(`click`, data => blipClick(data))
            .on(`mouseover`, data => focusBlip(data))
            .on(`mouseout`, data => focusAllBlips(data));             
        // blip outer ring
        selection.append(`circle`)
            .attr(`r`, config.blip.outerCircleRadius)
            .attr(`fill`, `rgba(0, 0, 0, 0)`)
            .attr(`stroke-width`, config.blip.strokeWidth)
            .attr(`stroke`, getBlipRingColor);    
        // blip indicater for movement    
        selection.append(`path`)
            .attr(`d`, getBlipMovedIndicator)
            .attr(`fill`, `none`)
            .attr(`stroke-width`, config.blip.strokeWidth)
            .attr(`stroke`, getBlipColor);
        // blip innerCircle
        selection.append('circle')
            .attr('r', config.blip.innerCircleRadius)
            .attr('fill', getBlipColor); 
        // blip text
        selection.append('text')
            .classed('blipText', true)
            .attr('y', config.blip.fontSize/3)
            .attr('text-anchor', 'middle')
            .style(`font-size`, config.blip.fontSize)
            .text(data => data.id); 
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
    //#endregion ------------------------------------------------------------------------
    
    //#region d3-components radar legend ------------------------------------------------
    let makeLegendBlipStates = (selection) => {
        selection.append(`span`)
            .classed(`stateColor`, true)
            .style(`background-color`, data => data.color);
        selection.append(`span`)
            .classed(`paddingText`, true) 
            .text(data => data.name);
    }

    let makeLegendBlipMovement = (selection) => {
        selection.append(`span`)
            .classed(`movementIndicator`, true)
            .classed(`in`, data => data.value > 0)
            .classed(`out`, data => data.value < 0);
        selection.append(`span`)
            .classed(`paddingText`, true) 
            .text(data => data.name);
    }

    let makeLegendRings = (selection) => {
        selection.append(`span`)
            .classed(`text`, true) 
            .text(data => `${data.index+1}. ${data.name}`);
    }
    //#endregion ------------------------------------------------------------------------
    
    //#region d3-components radar blip legend -------------------------------------------
    let makeBlipLegendSector = (selection) => {
        selection            
            .attr(`id`, sector => `${sector.idText}_legend`)
            .classed(`blipLegendSector card`, true)            
            .on(`click, mouseover`, sector => focusSector(sector))
            .on(`mouseout`, focusAllSector)
            .text(sector => sector.name);
    }

    let makeBlipLegendSegment = (selection) => {
        selection
            .attr(`id`, segment => `${segment.idText}_legend`)
            .classed(`blipLegendSegment subCard`, true)
            .text(segment => segment.name);
    }

    let makeBlipLegendBlip = (selection) => {
        selection
            .attr(`id`, blip => `${blip.idText}_legend`)
            .classed(`blipLegendBlip cardItem`, true)
            .on(`click`, blip => blipClick(blip))
            .on(`mouseover`, blip => focusBlip(blip))
            .on(`mouseout`, blip => focusAllBlips(blip))
            .text(blip => `${blip.id} ${blip.name}`);
    }
    //#endregion ------------------------------------------------------------------------

    //#region generate selection ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let selectionDropdownText = radarDiv.select(`.radarSelection`)
        .on(`click`, ()=> {
            document.getElementById(`${radarId}_selectionDropdown`)
                .classList.toggle(`active`);
        })
        .append(`span`)
            .classed(`dropdownText`, true)
            .text(config.radar.showAllSectorsText);
    
    // append a dropdown content div to add the dropdown options
    let selectionDropdownContent = radarDiv.select(`.radarSelection`)
        .append(`div`)
        .classed(`dropdownContent`, true);
    
    // append the first dropdown option to show the whole radar
    selectionDropdownContent
        .append(`div`)
        .classed(`selectionButton`, true)
        .style(`display`, (mobileMode) ? `none` : `block`)
        .text(config.radar.showAllSectorsText)
        .on(`click`, () => {    
            displayAllSectors();
            changeSvgViewbox(`${radarId}_radarContent`);
            selectionDropdownText.text(config.radar.showAllSectorsText);
        });        
    
    // append a dropdown option for each sector in radar
    selectionDropdownContent.selectAll(null)
        .data(radarData.sectors)
        .enter()
        .append(`div`)
            .classed(`selectionButton`, true)
            .text(sector => sector.name)
            .on(`click`, sector => {    
                displaySector(sector);
                changeSvgViewbox(sector.idText);
                selectionDropdownText.text(sector.name);
            });            
    //#endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //#region generate radar ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    let sectors = d3.select(`g#${radarId}_radarContent`)
        .selectAll(`g`)
        .data(radarData.sectors)
        .enter()
        .append(`g`)
        .call(makeSector);

    let segments = sectors.selectAll(`.segment`)
        .data(sector => sector.segments )
        .enter()
        .append(`g`)
        .call(makeSegment);

    let blips = segments.selectAll(`g`)
        .data(segment => segment.blips)
        .enter()
        .append(`g`)        
        .call(makeBlip);

    let bubble = d3.select(`g#${radarId}_radarContent`)
        .append(`g`)
        .call(makeBubble);
    //#endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //#region generate radar legend +++++++++++++++++++++++++++++++++++++++++++++++++++++
    let radarLegendContainer = radarDiv.select(`.radarLegend`)
        .append(`div`)
        .attr(`id`, `${radarId}_radarLegendContainer`)
        .classed(`dropdownContent`, true);

    // generate entry states legend
    let entryStatesLegend = radarLegendContainer.append(`div`)
        .classed(`card`, true)
    entryStatesLegend.append(`div`)
        .classed(`cardTitle`, true)
        .text(structure.entryStates.legendTitle);
    entryStatesLegend.selectAll(null)
        .data(structure.entryStates.list)
        .enter()
        .append(`div`)
            .classed(`cardItem`, true)
            .call(makeLegendBlipStates)
            .on(`mouseover`, (data)=> focusBlipByState(data))
            .on(`mouseout`, data => focusAllBlips(data));    

    // generate entry movement legend
    let entryMovementLegend = radarLegendContainer.append(`div`)
        .classed(`card`, true);
    entryMovementLegend.append(`div`)
        .classed(`cardTitle`, true)
        .text(structure.entryMovement.legendTitle);
    entryMovementLegend.selectAll(null)
        .data(structure.entryMovement.list)
        .enter()
        .append(`div`)
            .classed(`cardItem`, true)
            .call(makeLegendBlipMovement)
            .on(`mouseover`, (data)=> focusBlipByMovement(data.value))
            .on(`mouseout`, data => focusAllBlips(data));

    // generate ring legend
    let ringLegend = radarLegendContainer.append(`div`)
        .classed(`card`, true);
    ringLegend.append(`div`)
        .classed(`cardTitle`, true)
        .text(structure.rings.legendTitle);
    ringLegend.selectAll(null)
        .data(radarData.rings)
        .enter()
        .append(`div`)
            .classed(`cardItem`, true)
            .call(makeLegendRings)
            .on(`mouseover`, (data)=> focusRing(data))
            .on(`mouseout`, ()=> focusAllRings());
    //#endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //#region generate radar blip legend ++++++++++++++++++++++++++++++++++++++++++++++++
    let blipLegendSectors = radarDiv.select(`.radarBlipLegend`).selectAll(null)
        .data(radarData.sectors)
        .enter()
        .append(`div`)
        .call(makeBlipLegendSector);

    let blipLegendSegments = blipLegendSectors.selectAll(null)
        .data(sector => sector.segments.filter(segment => segment.blips.length != 0))
        .enter()
        .append(`div`)
        .call(makeBlipLegendSegment);

    let blipLegendBlips = blipLegendSegments.selectAll(null)
        .data(segment => segment.blips)
        .enter()
        .append(`div`)
        .call(makeBlipLegendBlip)
    //#endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //#region forceSimulation %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
    //#endregion %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    update();
    console.log(radarData);
}