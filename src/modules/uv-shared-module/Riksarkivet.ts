import {RiksarkivetCommands} from "./RiksarkivetCommands";

export class Riksarkivet {
    public GetBildIdFromCanvas(canvas: Manifesto.ICanvas) {
        var firstImage = canvas.getImages()[0];
        var imageResource: Manifesto.Resource | null = firstImage ? firstImage.getResource() : null;
        var resourceService = imageResource ? imageResource.getServices() : null;
        if (resourceService == null) {
            return null;
        }
        var bildid = resourceService[0].id;
        var datasource = bildid.substr(bildid.lastIndexOf("/") + 1).split('!')[0];
        if (datasource === "arkis") {
            datasource = "";
        }
        else {
            datasource = datasource.substr(0, 1).toUpperCase() + datasource.substr(1) + "_";
        }
        bildid = datasource + bildid.substr(bildid.indexOf("!") + 1);
        return bildid;
    }

    public GetShortcutEvent(e: JQueryKeyEventObject) {
        if (e.ctrlKey && e.shiftKey && e.keyCode === KeyCodes.KeyDown.c) 
            return RiksarkivetCommands.COPY_SOURCE_REFERENCE;
        return null;
    }
}
