---
title: Segment Grenzen
layout: default
nav_order: 3
parent: Implementation
---

# {{page.title}}

![Segment Grenzen](/assets/segment_padding.svg "Segment Grenzen")

Auf dieser Seite werde ich darauf eingehen, wie Blips in ihrem Segment bleiben. Auch mit einem Einstellbaren Abstand zum Rand des Segments.

Dazu ist erstmal wichtig, dass ein Segment folgende Eigenschaften besitzt:
- Den Start- und Endwinkel des Sektors, in dem sich das Segment befindet.
- Den Minimalen und Maximalen Radius für Blips, des Rings in dem sich das Segment befindet.


Da die Größe aller Blips im Radar und auch der Abstand zum Rand einstellbar ist, kann man die Distanz vom Rand zum Blipmittelpunkt wie folgt berechnen:
$$
blipDistanz = blipGröße / 2 + randAbstand
$$




## Begrenzung durch den Radius

![Begrenzung durch Radius](/assets/boundedRadius.svg "Begrenzung durch Radius")

Die Begrenzung durch den Radius ist sehr simpel. Jedes Segment ist ein Teil eines Rings im Radar, ein Ring hat einen inneren- und äußeren Radius. 

Für jeden Ring im Radar wird die blipDistanz einmal auf den Inneren Radius addiert und einmal vom Äußeren Radius subtrahiert. So erhält jeder Ring einen Radius Intervall in dem  Blips im Ring liegen dürfen. 

Da ein Segment ein Teil eines Ringes ist „erbt“ das Segment diese Eigenschaften vom Ring, so werden diese Grenzen auch nur einmal berechnet.




## Begrenzung durch den Winkel

![Begrenzung durch Winkel](/assets/boundedAngle.svg "Begrenzung durch Winkel")

Die Begrenzung durch den Winkel ist leider nicht so einfach, aber erlaubt es im Radar kleinere oder größere Sektoren zu haben und nicht nur Quadranten.

Die Winkel Grenze kann nicht wie bei der Begrenzung durch den Radius für einen Sektor festgelegt werden sondern muss abhängig von dem aktuellen Radius eines Blips berechnet werden. 

![Begrenzung durch festen Winkel](/assets/boundedAngle1.svg "Begrenzung durch festen Winkel")

Würde man die Winkelgrenze vorher festlegen, würde der Abstand zum Segment Rand nach außen hin immer größer werden wie im oberen Bild zu sehen ist.

Den Abstandwinkel den ein Bilp im Segment haben darf lässt sich mit hilfe eines rechtwinkligen Dreiecks berechen (Pythagoras).

![Berechnung des Abstandwinkels](/assets/offsetAngle.svg "Berechnung des Abstandwinkels")

Der Winkel kann berechnet werden, wenn man die beiden Katheten a und b kennt. 
- a ist der blipRadius (kann mit Hilfe der X- und Y-Koordinaten  berechnet werden). 
- b ist der Abstand zum Segment Rand (blipDistanz wie oben berechnet).

$$
a = \sqrt{x^2 + y^2} \\
\alpha = atan(\frac{b}{a}) 
$$

!!Wichtig!! Winkel im Radar werden im Bogenmaß berechnet, um weitere Umrechnungen in Gradmaß zu sparen.

Hat man $$\alpha$$ ausgerechnet wird temporär wie beim Begrenzen Radius, einmal $$\alpha$$ auf den Startwinkel addiert und einmal vom Endwinkel subtrahiert. So bekommt man ein Intervall in dem der Blip liegen darf. 

Um zu prüfen ob der Blip einen Winkel hat der im Intervall liegt, wird der Winkel des Blips zu den X- und Y-Koordinaten berechnet.

$$
blipWinkel = 
\begin{Bmatrix} 
atan2(y, x)  &, y \geq 0; \\ 
\pi*2 + atan2(y, x) &, y < 0; 
\end{Bmatrix} 
$$



## Intervall Prüfung

Wenn ein Bilp beispielsweise einen größeren Winkel hat als das Intervall es vorgibt, werden die Blip X- und Y-Koordinaten auf den Punkt vom Intervall maximum gesetzt. Das gleiche Schema dann für den Fall, dass das Intervall unterschritten wird.

Die X- und Y-Koordinaten werden dann einfach wie folgt berechnet:

$$
x = cos(winkel) * radius \\
y = sin(winkel) * radius
$$
