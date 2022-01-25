---
title: D3-Komponenten
layout: default
nav_order: 2
parent: Implementation
---

# {{page.title}}

Die D3-Bibliothek erlaubt es eigene Komponenten zu definieren. Definiert werden diese Komponenten als Funktion. Diese Funktion kann dann aus einer D3-Selektion aus aufgerufen werden.

Als Beispiel dient hier das Erstellen der Sektoren im Radar.

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

Als ersten Übergabe Parameter bekommen die Komponenten-Funktionen immer eine D3-Selektion. Der Aufruf einer solchen Komponente sieht dann wie folgt aus:

{% highlight js %}
let sectors = d3.select(`g#${radarId}_radarContent`)
        .selectAll(`g`)
        .data(radarData.sectors)
        .enter()
        .append(`g`)
        .call(makeSector);
{% endhighlight %}

In einer D3-Selektion ist es möglich Daten an DOM-Elemente zu binden mit der `.data()`-Funktion. Die kann man sich vorstellen wie eine `forEach`-Schleife.


Aufgerufen wird die Komponenten-Funktionen dur die call-Funktion von D3. Die call-Funktion kann nur in einer Selektion benutzt werden. 