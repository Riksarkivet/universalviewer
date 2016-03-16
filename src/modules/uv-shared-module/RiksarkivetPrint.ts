import Riksarkivet = require("./Riksarkivet");
class RiksarkivetPrint {
    UVContainerIdWithHash: string;
    printSourceTextId: string;
    printSourceTextIdWithHash: string;
    printImageId: string;
    printImageIdWithHash: string;
    printSourceLeftMarginsInPixels: number;
    printSourceTopMarginsInPixels: number;
    printSourceBottomMarginsInPixels: number;
    printSourceTextHeightInPixels: number;
    printSourceText: string;
    imageUri: string;
    riksarkivet: Riksarkivet;


    constructor() {
        this.UVContainerIdWithHash = "#app";
        this.printSourceTextId = 'printSourceText';
        this.printSourceTextIdWithHash = '#' + this.printSourceTextId;
        this.printImageId = "printImage";
        this.printImageIdWithHash = '#' + this.printImageId;
        this.printSourceLeftMarginsInPixels = 30;
        this.printSourceTopMarginsInPixels = 20;
        this.printSourceBottomMarginsInPixels = 20;
        this.printSourceTextHeightInPixels = 20;
        this.riksarkivet = new Riksarkivet();
    }

    public printImage(imageUri: string, title: string, canvas: Manifesto.ICanvas) {
        var that = this;

        var bildid = this.riksarkivet.GetBildIdFromCanvas(canvas);
        this.printSourceText = title + ' - ' + bildid + ' (Riksarkivet)';
        this.imageUri = imageUri;

        var img = new Image();
        //The callback function is declared as an ordinary js-function in order to access the image element with "this". The current object is accessed with "that".
        img.onload = function () {
            var imageWidth = this.width + that.printSourceLeftMarginsInPixels;
            var imageHeight = this.height + that.printSourceTextHeightInPixels + that.printSourceTopMarginsInPixels + that.printSourceBottomMarginsInPixels;
            var containerDivHeight = imageHeight + that.printSourceTextHeightInPixels;
            var whRatio = parseFloat(imageWidth) / parseFloat(imageHeight);
            var widthPercentageLandscape = that.calculateWidthPercentageForLandscape(whRatio);
            var widthPercentagePortrait = that.calculateWidthPercentageForPortrait(whRatio);
            that.printIframe(widthPercentageLandscape, widthPercentagePortrait)
        }

        img.src = imageUri;

    };

    private getPrintStyles(widthPercentageLandscape, widthPercentagePortrait) {
        var fullWidthLandscape = 100;
        var fullWidthPortrait = 100;
        var sourceTextLandscapeStyle = this.printSourceTextIdWithHash + ' { width: ' + fullWidthLandscape + '%; height: ' + this.printSourceTextHeightInPixels + 'px; vertical-align:top; margin-left: ' + this.printSourceLeftMarginsInPixels + 'px; max-width: 90% } ';
        var sourceTextPortraitStyle = this.printSourceTextIdWithHash + ' { width: ' + fullWidthPortrait + '%; height: ' + this.printSourceTextHeightInPixels + 'px; vertical-align:top; margin-left: ' + this.printSourceLeftMarginsInPixels + 'px; max-width: 90% } ';
        var imageLandscapeStyle = this.printImageIdWithHash + ' { width: ' + widthPercentageLandscape + '%; vertical-align: top; margin-top: 20px; margin-left: ' + this.printSourceLeftMarginsInPixels + 'px; }';
        var imagePortraitStyle = this.printImageIdWithHash + ' { width: ' + widthPercentagePortrait + '%; vertical-align: top; margin-top: 20px; margin-left: ' + this.printSourceLeftMarginsInPixels + 'px; }';
        var hideUVContainer = this.UVContainerIdWithHash + ' { display:none; } ';
        var landscapeStyle = sourceTextLandscapeStyle + imageLandscapeStyle + hideUVContainer;
        var portraitStyle = sourceTextPortraitStyle + imagePortraitStyle + hideUVContainer;

        var styleArray = new Array();

        var ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || ua.indexOf("rv:11") > 0 || ua.indexOf("Edge") > 0) { var pageStyle = ' @page { margin: 5mm; size: auto; } '; }
        else {  var pageStyle = ' @page { margin: 0mm; } '; }
        if (Math.floor(widthPercentageLandscape * 297) >= Math.floor(widthPercentagePortrait) * 210)
            styleArray.push('<style type="text/css">@media print { ' + landscapeStyle + ' } ' + pageStyle + '</style>');
        else
            styleArray.push('<style type="text/css">@media print { ' + portraitStyle + ' } ' + pageStyle + '</style>');

        //styleArray.push('<style type="text/css">@media print and (orientation:landscape) { ' + landscapeStyle + ' }</style>');
        //styleArray.push('<style type="text/css">@media print and (orientation:portrait) { ' + portraitStyle + ' }</style>');

        return styleArray.join("");

    }

    public getHtmlContent(objFrame) {

        var printContainerId = 'invisibleImageDiv';
        var printContainerIdWithHash = '#' + printContainerId;
        var printContainerClassName = 'invisible-screen';
        var printSourceTextId = 'printSourceText';
        var printImageId = "printImage";

        if ($(printContainerIdWithHash).length > 0) {
            $(printContainerIdWithHash).remove();
        }

        var img = $('<img id="' + printImageId + '" crossorigin="use-credentials" />').attr('src', this.imageUri)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                }
                else {
                    var ua = window.navigator.userAgent;
                    if (ua.indexOf("MSIE ") > 0 || ua.indexOf("rv:11") > 0 || ua.indexOf("Edge") > 0)
                    {
                        objFrame.document.execCommand('print', false, null);
                    }
                    else {
                        objFrame.focus();
                        objFrame.print();
                    }
                }
            });

        var img_div = $('<div id="' + printContainerId + '" class="' + printContainerClassName + '" >');
        img_div.append('<div id="' + printSourceTextId + '"><h5>' + this.printSourceText + '</h5></div>')
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
            .css("margin-left", "20px")
            .css("margin-bottom", "0px")
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
        var breakpointRatio = 297 / 210;
        var ratioFactor = WHRatio / breakpointRatio;
        var defaultWidthPercentage = 40;
        var fullPercentage = 100;
        var widthPercentage: number;
                
        //Something wrong with the ratio
        if (WHRatio <= 0) {
            return defaultWidthPercentage;
        }

        if (WHRatio < breakpointRatio) {
            widthPercentage = Math.floor(ratioFactor * fullPercentage) - 8;
        }
        else {
            widthPercentage = fullPercentage - 8;
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
            widthPercentage = Math.floor(ratioFactor * fullPercentage) - 8;
        }
        else {
            widthPercentage = fullPercentage - 8;
        }

        return widthPercentage

    }
}

export = RiksarkivetPrint;