class RiksarkivetPrint {
    UVContainerIdWithHash: string;
    printSourceTextId: string;
    printSourceTextIdWithHash: string;
    printImageId: string;
    printImageIdWithHash: string;
    printSourceTextHeightInPixels: number;
    printSourceText: string;
    imageUri: string;


    constructor() {
        this.UVContainerIdWithHash = "#app";
        this.printSourceTextId = 'printSourceText';
        this.printSourceTextIdWithHash = '#' + this.printSourceTextId;
        this.printImageId = "printImage";
        this.printImageIdWithHash = '#' + this.printImageId;
        this.printSourceTextHeightInPixels = 20;
    }

    public printImage(imageUri: string, title: string, canvas: Manifesto.ICanvas) {
        var that = this;

        var bildid = this.getBildIdFromCanvas(canvas);
        this.printSourceText = title + ' - ' + bildid;
        this.imageUri = imageUri;

        var img = new Image();
        //The callback function is declared as an ordinary js-function in order to access the image element with "this". The current object is accessed with "that".
        img.onload = function () {
            var imageWidth = this.width;
            var imageHeight = this.height + that.printSourceTextHeightInPixels;
            var containerDivHeight = imageHeight + that.printSourceTextHeightInPixels;
            var whRatio = parseFloat(imageWidth) / parseFloat(containerDivHeight);
            var widthPercentageLandscape = that.calculateWidthPercentageForLandscape(whRatio);
            var widthPercentagePortrait = that.calculateWidthPercentageForPortrait(whRatio);
            that.printIframe(widthPercentageLandscape, widthPercentagePortrait)
        }

        img.src = imageUri;

    };

    private getBildIdFromCanvas(canvas: Manifesto.ICanvas) {
        var bildid = canvas.getImages()[0].getResource().getServices()[0].id;
        bildid = bildid.substr(bildid.indexOf("!") + 1);

        return bildid;
    }

    private getPrintStyles(widthPercentageLandscape, widthPercentagePortrait) {
        var fullWidthLandscape = 100;
        var fullWidthPortrait = 100;
        var sourceTextLandscapeStyle = this.printSourceTextIdWithHash + ' { width: ' + fullWidthLandscape + '%; height: ' + this.printSourceTextHeightInPixels + 'px;} ';
        var sourceTextPortraitStyle = this.printSourceTextIdWithHash + ' { width: ' + fullWidthPortrait + '%; height: ' + this.printSourceTextHeightInPixels + 'px;} ';
        var imageLandscapeStyle = this.printImageIdWithHash + ' { width: ' + widthPercentageLandscape + '%;  vertical-align: top; } ';
        var imagePortraitStyle = this.printImageIdWithHash + ' { width: ' + widthPercentagePortrait + '%;  vertical-align: top; } ';
        var hideUVContainer = this.UVContainerIdWithHash + ' { display:none; } ';
        var landscapeStyle = sourceTextLandscapeStyle + imageLandscapeStyle + hideUVContainer;
        var portraitStyle = sourceTextPortraitStyle + imagePortraitStyle + hideUVContainer;

        var styleArray = new Array();
        styleArray.push('<style type="text/css">@media print and (orientation:landscape) { ' + landscapeStyle + ' }</style>');
        styleArray.push('<style type="text/css">@media print and (orientation:portrait) { ' + portraitStyle + ' }</style>');

        return styleArray.join("");

    }

    private getHtmlContent(objFrame) {

        var printContainerId = 'invisibleImageDiv';
        var printContainerIdWithHash = '#' + printContainerId;
        var printContainerClassName = 'invisible-screen';
        var printSourceTextId = 'printSourceText';
        var printImageId = "printImage";

        if ($(printContainerIdWithHash).length > 0) {
            $(printContainerIdWithHash).remove();
        }

        var img = $('<img id="' + printImageId + '" />').attr('src', this.imageUri)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                }
                else {
                    objFrame.print();
                }
            });

        var img_div = $('<div id="' + printContainerId + '" class="' + printContainerClassName + '" >');
        img_div.append('<div id="' + printSourceTextId + '"><h5>' + this.printSourceText + '<h5></div>')
        img_div.append(img);

        return img_div;
    };

    private printIframe(widthPercentageLandscape: number, widthPercentagePortrait: number) {

        var strFrameId = ("iframeForPrinting");
        var oldFrame = $('#' + strFrameId);
        if (oldFrame.length > 0) {
            oldFrame.remove();
        }

        var strFrameName = ("printer-" + (new Date()).getTime());
        var jFrame = $("<iframe id='" + strFrameId + "' name='" + strFrameName + "'>");
        jFrame
            .css("width", "auto")
            .css("height", "auto")
            .css("position", "absolute")
            .css("left", "-9999px")
            .appendTo($("body:first"))
        ;
        var objFrame = window.frames[strFrameName];
        var objDoc = objFrame.document;

        var printStyles = this.getPrintStyles(widthPercentageLandscape, widthPercentagePortrait);
        var htmlContent = this.getHtmlContent(objFrame)[0].outerHTML;

        var htmlArray = new Array();
        htmlArray.push("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">");
        htmlArray.push("<html>");
        htmlArray.push("<head>");
        htmlArray.push("<title>");
        htmlArray.push(document.title);
        htmlArray.push("</title>");
        htmlArray.push(printStyles);
        htmlArray.push("</head>");
        htmlArray.push("<body>");
        htmlArray.push(htmlContent);
        htmlArray.push("</body>");
        htmlArray.push("</html>");

        objDoc.open();
        objDoc.write(htmlArray.join(""));
        objDoc.close();
    }

    private calculateWidthPercentageForLandscape(WHRatio): number {
        //The height/width ratio for A4 is 297/210 but it has to be adjusted in landscape mode for some reason.
        //We use 1.5. If you increase this value the page will be shrinked even more.
        var breakpointRatio = 1.5;
        var ratioFactor = WHRatio / breakpointRatio;
        var defaultWidthPercentage = 40;
        var fullPercentage = 100;
        var widthPercentage: number;
                
        //Something wrong with the ratio
        if (WHRatio <= 0) {
            return defaultWidthPercentage;
        }

        if (WHRatio < breakpointRatio) {
            widthPercentage = Math.floor(ratioFactor * fullPercentage);
        }
        else {
            widthPercentage = fullPercentage;
        }

        return widthPercentage

    }

    private calculateWidthPercentageForPortrait(WHRatio): number {
        //If you need to shrink the page even more encrease the value of the breakpointRatio.
        var whRatioA4 = 210 / 297;
        var breakpointRatio = whRatioA4;
        var ratioFactor = WHRatio / breakpointRatio;
        var defaultWidthPercentage = 40;
        var fullPercentage = 100;
        var widthPercentage: number;
                
        //Something wrong with the ratio
        if (WHRatio <= 0) {
            return defaultWidthPercentage;
        }

        if (WHRatio < breakpointRatio) {
            widthPercentage = Math.floor(ratioFactor * fullPercentage);
        }
        else {
            widthPercentage = fullPercentage;
        }

        return widthPercentage

    }

}

export = RiksarkivetPrint;