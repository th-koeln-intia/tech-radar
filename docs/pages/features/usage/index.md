---
title: Verwendung
layout: default
nav_order: 1
parent: Funktionen
---

# {{page.title}}

## Einbettung

Im Radar wird die D3.js-Bibliothek verwendet, um Komponenten in Vektorgrafiken zu erstellen/handhaben und eine Kollisionssimulation laufen zu lassen. Zu diesem Zweck muss die Bibliothek importiert werden. 

Außerdem muss das CSS-Stylesheet des Radars und das Radar-Script an sich noch importiert werden. Diese beiden Dateien können einfach von dieser Seite aus importiert werden.

{% highlight html %}
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://flnkln.github.io/src/radar/radar.js"></script>
<link rel="stylesheet" href="https://flnkln.github.io/src/radar/radar.css" />
{% endhighlight %}

## Inizierung

Das Radar wird in einem `<div>`-Tag generiert, dieser muss erstellt werden mit einer `id`. Durch den `<div>`-Tag kann bestimmt werden wo das Radar positioniert werden soll auf der Seite.

{% highlight html %}
<div id="initaRadar"></div>
{% endhighlight %}

Das Radar wird iniziiert durch den Aufruf der Funktion `createRadar` aus der oben Importierten `radar.js`. Diese Funktion erwartet drei Übergabe Parameter, diese **drei** Parameter werden als JSON-Objekt erwartet, welche die _Konfiguration, Struktur_ und _Einträge_ des Radars beinhalten.

WICHTIG: Die ID von dem zuvor erstellten `<div>`-Tag und die Radar ID in der Konfigurations JSON müssen übereinstimmen!

Das Radar ist in purem JavaScript geschrieben, daher wurde für die Übergabe Parameter das JSON-Format gewählt. Das bietet eine große Flexibilität der Herkunft der Radar Daten.

Im Rahmen dieses Projekts wird das Radar in einer Jekyll-Seite dargestellt und bekommt die Daten Jekyll üblich aus dem `data`-Ordner im YAML-Format. Diese Daten müssen erstmal in JSON konvertiert werden.

{% highlight html %}
<script>{% raw %} 
    var config = {{ site.data.intiaRadarConfig | jsonify }};
    var structure = {{ site.data.intiaRadarStructure | jsonify }};
    var entries = {{ site.data.intiaRadarEntries | jsonify }};
    {% endraw %}
    createRadar(config, structure, entries);
</script>
{% endhighlight %}