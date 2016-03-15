class Riksarkivet {
    public GetBildIdFromCanvas(canvas: Manifesto.ICanvas) {
        var bildid = canvas.getImages()[0].getResource().getServices()[0].id;
        var datasource = bildid.substr(bildid.lastIndexOf("/") + 1).split('!')[0];
        if (datasource == "arkis") {
            datasource = "";
        }
        else {
            datasource = datasource.substr(0, 1).toUpperCase() + datasource.substr(1) + "_";
        }
        bildid = datasource + bildid.substr(bildid.indexOf("!") + 1);
        return bildid;
    }
}

export = Riksarkivet;