---
title: D3-Komponenten
layout: default
nav_order: 2
parent: Implementation
---

# {{page.title}}

Die D3-Bibliothek erlaubt es eigene Komponenten zu definieren. Definiert werden diese Komponenten als Funktion. Diese Funktion kann dann aus einer D3-Selektion aus aufgerufen werden.

{% highlight js %}
let sectors = d3.select(`g#${radarId}_radarContent`)
        .selectAll(`g`)
        .data(radarData.sectors)
        .enter()
        .append(`g`)
        .call(makeSector);
{% endhighlight %}


{% highlight js %}
let makeSector = (selection) => {
    selection           
        .attr(`id`, sector => `${sector.idText}`)
        .on(`mouseover`, sector => focusSector(sector))
        .on(`mouseout`, focusAllSector)
        .on(`click`, sector => { 
            displaySector(sector);
            changeSvgViewbox(sector.idText); 
        });   
}
{% endhighlight %}