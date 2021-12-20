---
layout: default
title: Inizierung
parent: Verwendung
grand_parent: Dokumentation
nav_order: 2
---

# {{page.title}}

Das Radar wird iniziiert durch den Aufruf der Funktion `createRadar`. Diese Funktion benötigt drei Übergabe Parameter, diese **drei** Parameter werden als JSON-Objekt erwartet, welche die _Konfiguration, Struktur_ und _Einträge_ des Radars beinhalten.

Das Radar ist in purem JavaScript geschrieben, daher wurde für die Übergabe Parameter das JSON-Format gewählt. Das bietet eine große Flexibilität der Herkunft der Radar Daten.

Im Rahmen dieses Projekts wird das Radar in einer Jekyll-Seite dargestellt und bekommt die Daten Jekyll üblich aus dem `data`-Ordner im YAML-Format. Diese Daten müssen erstmal in JSON konvertiert werden.

<!-- WICHTIG: Die ID´s von dem zuvor erstellten `<div>`-Tag und der in der Config-Datei müssen übereinstimmen! -->

{% highlight html %}
<script type="module">{% raw %} 
    var config = {{ site.data.intiaRadarConfig | jsonify }};
    var entries = {{ site.data.intiaRadarEntries | jsonify }};
    var structure = {{ site.data.intiaRadarStructure | jsonify }};
    {% endraw %}
    import {createRadar} from "/src/radar/radar.js";
    createRadar(config, entries, structure);
</script>
{% endhighlight %}