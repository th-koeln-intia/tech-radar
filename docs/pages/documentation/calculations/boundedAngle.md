---
layout: default
title: Begrenzter Winkel
parent: Berechnungen
grand_parent: Dokumentation
nav_order: 2
use_math: true
---

# {{page.title}}

![boundedAngle](/assets/boundedAngle.svg "boundedAngle")

Im folgenden möchte ich erklären wie ich die Berechnung des Abstandswinkels(im folgenden Offsetwinkel genannt) zu den Winkelgrenzen der Sektoren realisiert habe. Auf bei der Umsetztung aufkommende Probleme gehe ich hier([Probleme/Begrenzter-Winkel]) genauer drauf ein.

Um diesen Offsetwinkel zu berechnen, müssen folgende Dinge der Funktion `boundedAngle` übergeben werden:
- Aktuelle Blip Position
- Sektor in dem der Blip liegen soll
- Die Konfigurations JSON

Zu aller Erst wird der aktuelle Radius zu der Blip Position berechnet. 

$$
blipRadius = \sqrt{x^2 + y^2}
$$

Danach wird zu dem erechneten Radius der Offsetwinkel berechnet mit dem Satz des Pythagoras. (Die $$blipSize$$ und das $$segmentPadding$$ wird aus dem Konfiguration entnommen.)

![offsetAngle](/assets/offsetAngle.svg "offsetAngle"){: .center-image }

$$
a = blipRadius
$$

$$
b = \frac{blipSize}{2} + segmentPadding
$$

$$
c = \sqrt{a^2 + b^2}
$$

$$
\alpha = asin(\frac{a}{b}) * \frac{180}{\pi}
$$

$$\alpha$$ ist dann der Offsetwinkel zu dem aktuellen Blip Radius.

Der Offsetwinkel wird nun auf den Startwinkel des Sektors addiert und vom Endwinkel des Sektors substraiert. So erhält man ein Interval in dem der Blip liegen darf.

Um zu überprüfen ob der Blip innerhalb dieses Intervalls liegt, wird der aktuelle Winkel des Blips anhand der Position berechnet.

$$
blipWinkel = 
\begin{Bmatrix} 
atan2(y, x) * \frac{180}{\pi} &, y \geq 0; \\ 
360 - | atan2(y, x) * \frac{180}{\pi} | &, y < 0; 
\end{Bmatrix} 
$$

<br>
<br>

Bei der Prüfung kann der Blip ...<br>
- ... unterhalb des Intervalls liegen, dann wird zu dem Unteren Winkel des Intervalls eine neue Position berechnet und zurückgegeben.
- ... oberhalb des Intervalls liegen, dann wird zu dem Oberen Winkel des Intervalls eine neue Position berechnet und zurückgegeben.
- ... innerhalb des Intervalls liegen, dann wird die aktuelle Position zurückgegeben.

Muss eine neue Position berechnet werde, so erfolgt das wie folgt:

$$
\begin{pmatrix}
x = \cos(winkel) * \frac{\pi}{180} * radius \\
y = \sin(winkel) * \frac{\pi}{180} * radius
\end{pmatrix}
$$



<!-- Damit die Blips in ihrem Segment bleiben und nicht an den Seiten aus ihrem Segment kommen können, musste eine Begrenzung gefunden werden die auch funktioniert wenn im Radar ___mehr___ oder ___weniger___ als **vier** Sektoren dargestellt werden.

Ich habe mich dafür entschieden, die Begrenzung der Sektoren mit einem Startwinkels und einem Endwinkels zu realisieren. Dies zu realisieren war relativ einfach, allerdings hat dies zu ein paar Problemen geführt. Auf diese Probleme gehe ich auf einer Seperaten Seite ein (TODO Link zur Seite).  -->

[Probleme/Begrenzter-Winkel]: /pages/documentation/problems/boundedAngle.html