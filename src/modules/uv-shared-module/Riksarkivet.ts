class Riksarkivet {
    public GetBildIdFromCanvas(canvas: Manifesto.ICanvas) {
        var bildid = canvas.getImages()[0].getResource().getServices()[0].id;
        bildid = bildid.substr(bildid.indexOf("!") + 1);

        return bildid;
    }
}

export = Riksarkivet;