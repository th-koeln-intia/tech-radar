---
title: Radar skalierung
layout: default
nav_order: 3
grand_parent: Dokumentation
parent: Aufbau
---

# {{page.title}}

Für eine gute Darstellung auf verschiedenen Endgeräten ist es wichtig, dass sich das Radar passend zu dem gegebenen Platz skaliert.

## SVG-Tag

Im ``SVG``-Tag des Radars werden dafür folgende Attribute gesetzt:

```html
<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 1000"></svg>
```

Das `viewBox`-Attribut ist ein wesentlicher Bestandteil von SVG, der sie skalierbar macht. Es definiert das Seitenverhältnis, die innere Skalierung der Objektlängen und -koordinaten sowie die Achsenkoordinaten (x und y), von denen das SVG ausgehen soll.

Das ``preserveAspectRatio``-Attribut bestimmt, wie der Name schon sagt, ob das SVG skaliert werden soll, wenn das in ``viewBox`` definierte Seitenverhältnis nicht mit dem Verhältnis im übergeordneten Container übereinstimmt. Aufgrund dieser Beziehung erfordert ``preserveAspectRatio``, dass das ``viewBox``-Attribut ebenfalls gesetzt sein muss.

## CSS-Styling

Der Container des ``SVG``-Tags muss folgende CSS-Attribute haben:

```css
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
}
```

Das ``SVG``-Tag selbst muss dann noch die folgenden CSS-Attribute haben:

```css
.svg {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
}
```