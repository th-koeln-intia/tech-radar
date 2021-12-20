export default class Bubble {

    constructor(radar, svgGroup) {
        let fontSize = radar.CONFIG.blip.size/2;
        const bubble = svgGroup.append('g');
        bubble
            .attr('class', 'bubble')
            .attr('id', 'bubble')
            .attr('x', 0)
            .attr('y', 0);
        bubble.append('rect')
            .attr('class', 'bubbleBackgroundColor')
            .attr('rx', 4)
            .attr('ry', 4);
        bubble.append('text')
            .attr('class', 'bubbleText')
            .attr(`y`, -fontSize/9)
            .style(`font-size`, fontSize);
        bubble.append('path')
            .attr('class', 'bubbleBackgroundColor')
            .attr('d', 'M 0,0 10,0 5,8 z');
    }
}