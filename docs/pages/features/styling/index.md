---
title: Radar-Styling
layout: default
nav_order: 5
parent: Funktionen
---

# {{page.title}}

Das Radar kann individuell gestaltet werden in dem eine Kopie des Radar-Stylesheets gemacht wird. Das Radar-Stylesheet ist so geschrieben, dass alles Notwendige einfach angepasst werden kann in dem man an oberster Stelle im Stylesheet die CSS-Variablen anpasst.

{% highlight css %}
:root {
/* Generel */
    --fontFamily: "Arial";
    --borderRadius: 0;
    --lineWidth: 1; 
    --spacing: 0.5rem;
    --textPadding: 0.25em;
    --dropdownBoxShadow: 0 5px 20px rgba(0,0,0,0.1);
/* FontSizes */
    --radarDropdown: 16px;
    --radarCardTitle: 16px;
    --radarCardItem: 14px;
    --radarName: 30px;  
    --radarSelectionButton: 14px;
    --radarSectorName: 16px;
    --radarSegmentName: 11px;
    --radarLegendCardItemText: 14px;
    --radarBlipLegendSector: 14px;
    --radarBlipLegendSegment: 12px;
    --radarBlipLegendBlip: 10px;
/* Colors */
    --primaryFontColor: #000000;
    --secondaryFontColor: #ffffff;
    --cardBackgroundColor: #ffffff;
    --buttonHoverColor: #ecf0f1;
    --lineColor: rgba(178, 190, 195,1.0);
    --bubbleColor: rgba(178, 190, 195,1.0);
} 
...
{% endhighlight %}