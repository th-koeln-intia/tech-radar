---
layout: default
title: Einbettung
parent: Verwendung
grand_parent: Dokumentation
nav_order: 1
---

# {{page.title}}

Im Radar wird die D3.js-Bibliothek verwendet, um Komponenten in Vektorgrafiken zu erstellen/handhaben und eine Kollisionssimulation laufen zu lassen. Zu diesem Zweck muss die Bibliothek importiert werden. 

Außerdem muss das CSS-Stylesheet des Radars noch importiert werden.

{% highlight html %}
<script src="https://d3js.org/d3.v4.min.js"></script>
<link rel="stylesheet" href="/src/radar/radar.css" />
{% endhighlight %}

Das Radar wird in einem `<div>`-Tag generiert, dieser muss erstellt werden mit einer `id`. Durch den `<div>`-Tag kann bestimmt werden wo das Radar positioniert werden soll.

{% highlight html %}
<div id="initaRadar"></div>
{% endhighlight %}