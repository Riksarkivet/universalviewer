import BaseAdjustDialogue = require("../../modules/uv-dialogues-module/AdjustDialogue");
import ISeadragonExtension = require("./ISeadragonExtension");

class AdjustDialogue extends BaseAdjustDialogue {

    $contrastSlider: JQuery;
    $contrastSliderLabel: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create() : void {
        this.setConfig('adjustDialogue');

        super.create();
        
        this.$contrastSliderLabel = $('<label for="contrastSlider">' + this.content.contrast + '</label>');
        this.$contrast.append(this.$contrastSliderLabel);
        
        this.$contrastSlider = $('<input id="contrastSlider" type="range", min="0", max="100" step="1" value="50">');
        this.$contrast.append(this.$contrastSlider);
        this.$contrastSlider.rangeslider({
            polyfill: false,
            onSlide: (position, value) => {
                this.adjustContrast(value);
            }
        });
    }

    open(): void {
        super.open();
    }

}

export = AdjustDialogue;