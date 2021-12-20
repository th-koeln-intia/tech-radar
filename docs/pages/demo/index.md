---
title: Demo
layout: default
nav_order: 3
# has_children: true
---

# {{page.title}}

Auf dieser Seite kann man das Radar Testen, z.B. wie und was die einzelnen Sachen in der Konfigurations Datei machen.

Im folgenden sind die Drei Dateinen als JSON editierbar.

### Konfigurations Datei:
<textarea id="configInput" style="width: 100%; min-height: 12rem; max-height: 24rem; resize: vertical;"></textarea>

### Struktur Datei:
<textarea id="structurInput" style="width: 100%; min-height: 12rem; max-height: 24rem; resize: vertical;"></textarea>

### Einträge Datei:
<textarea id="entriesInput" style="width: 100%; min-height: 12rem; max-height: 24rem; resize: vertical;"></textarea>

<button id="testBtn">Testen</button>

<script>
    let config = {{ site.data.intiaRadarConfig | jsonify }};
    let configInput = document.getElementById("configInput");
    configInput.value = JSON.stringify(config, "    ", " ");

    let structur = {{ site.data.intiaRadarStructure | jsonify }};
    let structurInput = document.getElementById("structurInput");
    structurInput.value = JSON.stringify(structur, "    ", " ");

    let entries = {{ site.data.intiaRadarEntries | jsonify }};
    let entriesInput = document.getElementById("entriesInput");
    entriesInput.value = JSON.stringify(entries, "    ", " ");

    let testBtn = document.getElementById("testBtn");
    testBtn.addEventListener("click", ()=>{
        try{
            let testConfig = JSON.parse(configInput.value);
            let testStructur = JSON.parse(structurInput.value);
            let testEntries = JSON.parse(entriesInput.value);
        }catch(err){
            alert("JSON Syntax Error!\nReload Page for working JSON");
        }        
    });
</script>