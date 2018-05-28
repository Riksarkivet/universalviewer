import {Dialogue} from "../uv-shared-module/Dialogue";
import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Shell} from "../uv-shared-module/Shell";

export class AdjustDialogue extends Dialogue {

    isSliding = false;
    
    $title: JQuery;
    $contrast: JQuery;
    $contrastSlider: JQuery;
    $contrastSliderLabel: JQuery;
    $brightness: JQuery;
    $brightnessSlider: JQuery;
    $brightnessSliderLabel: JQuery;
    $reset: JQuery;
    $resetButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('adjustDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_ADJUST_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_ADJUST_DIALOGUE;

        $.subscribe(this.openCommand, (e: any, params: any) => {
            this.open();
        });

        $.subscribe(this.closeCommand, (e: any) => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);
        this.$title.text(this.content.title);

        this.$contrast = $('<div class="contrast"></div>');
        this.$content.append(this.$contrast);
        this.$contrastSliderLabel = $('<label for="contrastSlider">' + this.content.contrast + '</label>');
        this.$contrast.append(this.$contrastSliderLabel);

        this.$contrastSlider = $('<input id="contrastSlider" type="range", min="0", max="100" step="5" value="50">');
        this.$contrast.append(this.$contrastSlider);
        this.$contrastSlider.rangeslider({
            polyfill: false,
            onSlide: (position, value) => {
                this.startSliding();
            },
            onSlideEnd: (position, value) => {
                this.adjustContrast(value);
                this.stopSliding();
            }
        });

        this.$brightness = $('<div class="brightness"></div>');
        this.$content.append(this.$brightness);
        
        this.$brightnessSliderLabel = $('<label for="brightnessSlider">' + this.content.brightness + '</label>');
        this.$brightness.append(this.$brightnessSliderLabel);
        
        this.$brightnessSlider = $('<input id="brightnessSlider" type="range", min="0", max="100" step="5" value="50">');
        this.$brightness.append(this.$brightnessSlider);
        this.$brightnessSlider.rangeslider({
            polyfill: false,
            onSlide: (position, value) => {
                this.startSliding();
            },
            onSlideEnd: (position, value) => {
                this.adjustBrightness(value);
                this.stopSliding();
            }
        });
         
        this.$reset = $('<div class="reset"></div>');
        this.$content.append(this.$reset);
        this.$resetButton = $('<button type="button">' + this.content.reset + '</button>');
        this.$reset.append(this.$resetButton);
        
        this.$resetButton.on("click", e => {
            this.setValues(50, 50);
        })

        this.$element.hide();
        
        
        var settings = this.extension.getSettings();
        this.setValues(
            settings.contrastPercent ? settings.contrastPercent : 50, 
            settings.brightnessPercent ? settings.brightnessPercent : 50)
    }
    
    setValues(contrast: number, brightness: number) {
        this.$contrastSlider.val(contrast.toString()).change();
        this.adjustContrast(contrast);
        
        this.$brightnessSlider.val(brightness.toString()).change();
        this.adjustBrightness(brightness);
        
        this.stopSliding();
    }
    
    startSliding() {
        this.isSliding = true;
    }
    
    stopSliding() {
        setTimeout(() => {
            this.isSliding = false;    
        }, 50);
    }
    
    adjustContrast(value: number) {
        $.publish(BaseEvents.ADJUST_CONTRAST, [value]);
        this.extension.updateSettings({ contrastPercent: value});
    }
    
    adjustBrightness(value: number) {
        $.publish(BaseEvents.ADJUST_BRIGHTNESS, [value]);
        this.extension.updateSettings({ brightnessPercent: value});
    }

    open(): void {
        Shell.$overlays.css('background', 'none');
        super.open();
    }
    
    close(): void {
        Shell.$overlays.css('background', '');          
        if (!this.isSliding) {            
            super.close();
            
            $.publish(BaseEvents.ADJUST_FINALIZE);
        }              
    }

    resize(): void {
        super.resize();
    }
}