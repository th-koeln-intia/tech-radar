---
title: Darstellung
layout: default
nav_order: 6
parent: Funktionen
---

# {{page.title}}

## Desktop/Tablet Darstellung
Das Radar passt sich an den Bildschirm an. Auf dem Desktop oder einem großen Tablet sieht das Layout des Radars wie folgt aus.

![Radar Div Layout Desktop](/assets/radar-div-layout-desktop.png "Radar Div Layout Desktop")


## Mobile Darstellung

Auf Smartphones oder Geräten mit kleineren Displays ändert sich die Darstellung wie folgt.

![Radar Div Layout Mobil](/assets/radar-div-layout-mobil.png "Radar Div Layout Mobil")


## Grenze für die Desktop/Tablet Darstellung

Als minimale Display breite für die Desktop/Tablet Darstellung wurden 800px gewählt. Dieser Wert wurde gewählt, wegen dem auf dieser Seite verwendeten Design. 

Wird die Seite mit einem Display aufgerufen was größer ist als 800px wird die Navigation auf der rechten Seite angezeigt. Wird sie mit einem Display aufgrufen was kleiner als 800px ist wird von einem Mobilenendgerät ausgegangen und die Navigation wird oben als Menü platziert.

## Grenze anpassen

Sollte eine andere Grenze bevorzugt werden, sollte das Stylsheet für das Radar kopiert werden. In der Kopie kann dann ganz unten die `min-width`-Pixel angepasst werden. Anschließend kann dann einfach die Kopie in die Seite importiert werden.

{% highlight css %}
...
@media screen and (min-width: 800px){
    .radarContainer{
        display: grid;
        grid-template:
            'radarTitle radarTitle'
            'radarSelection radarSelection'
            'radarBlipLegend radar';
        grid-template-columns: 0.4fr 0.6fr;
        grid-template-rows: min-content min-content 0fr;
    }    
}
{% endhighlight %}
