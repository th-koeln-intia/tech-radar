export default class Bubble {

    constructor(svgGroup) {
        const bubble = 
            svgGroup.append('g')
                .attr('class', 'bubble')
                .attr('id', 'bubble')
                .attr('x', 0)
                .attr('y', 0);
        bubble.append('rect')
            .attr('class', 'bubbleBackgroundColor')
            .attr('rx', 4)
            .attr('ry', 4);
        bubble.append('text')
            .attr('class', 'bubbleText');
        bubble.append('path')
            .attr('class', 'bubbleBackgroundColor')
            .attr('d', 'M 0,0 10,0 5,8 z');
    }
}