class Riksarkivet {
    public GetBildIdFromCanvas(canvas: Manifesto.ICanvas) {
        var bildid = canvas.getImages()[0].getResource().getServices()[0].id;
        bildid = bildid.substr(bildid.indexOf("!") + 1);

        return bildid;
    }


    public printImage(imageUri: string, title: string, canvas: Manifesto.ICanvas) {
        var UVContainerIdWithHash = "#app";
        var printContainerId = 'invisibleImageDiv';
        var printContainerIdWithHash = '#' + printContainerId;
        var printContainerClassName = 'invisible-screen';
        var printSourceTextId = 'printSourceText';
        var printSourceTextIdWithHash = '#' + printSourceTextId;
        var printImageId = "printImage";
        var printImageIdWithHash = '#' + printImageId;
        var printSourceTextHeightInPixels = 20;

        if ($(printContainerIdWithHash).length > 0) {
            $(printContainerIdWithHash).remove();
        }

        var bildid = this.GetBildIdFromCanvas(canvas);
        var sourceText = title + ' - ' + bildid;
        var that = this;

        var img = $('<img id="' + printImageId + '" />').attr('src', imageUri)
            .on('load', function () {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    alert('broken image!');
                }
                else {
                    var imageWidth = this.width;
                    var imageHeight = this.height + printSourceTextHeightInPixels;
                    var containerDivHeight = imageHeight + printSourceTextHeightInPixels;
                    var whRatio = parseFloat(imageWidth) / parseFloat(containerDivHeight);
                    var widthPercentageLandscape = that.calculateWidthPercentageForLandscape(whRatio);
                    var widthPercentagePortrait = that.calculateWidthPercentageForPortrait(whRatio);
                    that.setPrintStyles(widthPercentageLandscape, widthPercentagePortrait, printContainerIdWithHash, printSourceTextIdWithHash, printSourceTextHeightInPixels, printImageIdWithHash, UVContainerIdWithHash)
                    window.print();
                }
            });

        var img_div = $('<div id="' + printContainerId + '" class="' + printContainerClassName + '" >');
        img_div.append('<div id="' + printSourceTextId + '"><h5>' + sourceText + '<h5></div>')
        img_div.append(img);
        $('body').append(img_div);
    }

    private calculateWidthPercentageForLandscape(WHRatio) {
        //The height/width ratio for A4 is 297/210 but it has to be adjusted in landscape mode 
        //for some reason. We use 1.5. If you increase this value the page will be shrinked even more.
        var breakpointRatio = 1.5;
        var ratioFactor = WHRatio / breakpointRatio;
        var defaultWidthPercentage = 40;
        var fullPercentage = 100;
        var widthPercentage;
                
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

    private calculateWidthPercentageForPortrait(WHRatio) {
        //If you need to shrink the page even more encrease the value of the breakpointRatio.
        var whRatioA4 = 210 / 297;
        var breakpointRatio = whRatioA4;
        var ratioFactor = WHRatio / breakpointRatio;
        var defaultWidthPercentage = 40;
        var fullPercentage = 100;
        var widthPercentage;
                
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

    private setPrintStyles(widthPercentageLandscape, widthPercentagePortrait, printContainerIdWithHash, printSourceTextIdWithHash, printSourceTextHeightInPixels, printImageIdWithHash, UVContainerIdWithHash) {
        $('style').each(function (index, element) {
            var styleContent = $(element).text();
            if (styleContent.indexOf('print') >= 0 && styleContent.indexOf('landscape') >= 0) {
                $(element).remove();
            }
            if (styleContent.indexOf('print') >= 0 && styleContent.indexOf('portrait') >= 0) {
                $(element).remove();
            }
            if (styleContent.indexOf('screen') >= 0 && styleContent.indexOf(printContainerIdWithHash) >= 0) {
                $(element).remove();
            }
        });

        var fullWidthLandscape = 100;
        var fullWidthPortrait = 100;
        var containerLandscapeStyle = printContainerIdWithHash + ' { width: ' + widthPercentageLandscape + '%; } ';
        var containerPortraitStyle = printContainerIdWithHash + ' { width: ' + widthPercentagePortrait + '%; } ';
        var sourceTextLandscapeStyle = printSourceTextIdWithHash + ' { width: ' + fullWidthLandscape + '%; height: ' + printSourceTextHeightInPixels + 'px;} ';
        var sourceTextPortraitStyle = printSourceTextIdWithHash + ' { width: ' + fullWidthPortrait + '%; height: ' + printSourceTextHeightInPixels + 'px;} ';
        var imageLandscapeStyle = printImageIdWithHash + ' { width: ' + fullWidthLandscape + '%;  vertical-align: top; } ';
        var imagePortraitStyle = printImageIdWithHash + ' { width: ' + fullWidthPortrait + '%;  vertical-align: top; } ';
        var hidePrintContainer = printContainerIdWithHash + ' { display:none; } ';
        var hideUVContainer = UVContainerIdWithHash + ' { display:none; } ';
        var bodyStyle = "body { width:auto !important; height:auto !important;}";
        var landscapeStyle = bodyStyle + containerLandscapeStyle + sourceTextLandscapeStyle + imageLandscapeStyle + hideUVContainer;
        var portraitStyle = bodyStyle + containerPortraitStyle + sourceTextPortraitStyle + imagePortraitStyle + hideUVContainer;

        $('head').append('<style type="text/css">@media screen { ' + hidePrintContainer + ' }</style>');
        $('body').prepend('<style type="text/css">@media print and (orientation:landscape) { ' + landscapeStyle + ' }</style>');
        $('body').prepend('<style type="text/css">@media print and (orientation:portrait) { ' + portraitStyle + ' }</style>');
    }


}

export = Riksarkivet;