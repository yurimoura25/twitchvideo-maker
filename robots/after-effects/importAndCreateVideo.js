main();
function main() {
    app.beginUndoGroup("Main");
        var folder = new Folder("C:/Users/y2mou/OneDrive/Documentos/twitch-videomaker/robots/videos/");
        var files = folder.getFiles();
        var importedItems = [];
        for(var i = 0; i < files.length; i++) {
            if(files[i].name.indexOf(".mp4") != -1) {
                importedItems.push(app.project.importFile(new ImportOptions(files[i])));
                }
            }
      createVideo(importedItems);
    app.endUndoGroup();

    aep_template_path = "C:/Users/y2mou/OneDrive/Documentos/twitch-videomaker/robots/after-effects/template.aep";
    app.project.save(File(aep_template_path));
    }


function createVideo(items) {
    $.evalFile("C:/Users/y2mou/OneDrive/Documentos/twitch-videomaker/robots/after-effects/after-effects.js");
    var comp = app.project.items.addComp('Main',  c.height,  c.width, 1 , (c.duration+items.length), c.framerate); 
    var layers = [];
    var start = 0;
    for(var i = 0; i < items.length; i++) {
        layers.push(comp.layers.add(items[i]));
        layers[i].selected = true;
        layers[i].startTime = start;
        start += layers[i].outPoint - layers[i].inPoint;
        }
    comp.workAreaDuration = layers[layers.length-1].outPoint;
    comp.openInViewer();
}