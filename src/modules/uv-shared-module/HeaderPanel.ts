import {BaseEvents} from "./BaseEvents";
import {BaseView} from "./BaseView";
import {ILocale} from "../../ILocale";
import {Information} from "../uv-shared-module/Information";
import {InformationAction} from "../uv-shared-module/InformationAction";
import {InformationArgs} from "../uv-shared-module/InformationArgs";
import {InformationFactory} from "../uv-shared-module/InformationFactory";
import {RiksarkivetPrint} from "../../modules/uv-shared-module/RiksarkivetPrint";
import {ISeadragonExtension} from "../../extensions/uv-seadragon-extension/ISeadragonExtension";
import {CroppedImageDimensions} from "../../extensions/uv-seadragon-extension/CroppedImageDimensions";


export class HeaderPanel extends BaseView {

    $centerOptions: JQuery;
    $helpButton: JQuery;
    $informationBox: JQuery;
    $localeToggleButton: JQuery;
    $options: JQuery;
    $headerBorder: JQuery;
    $rightOptions: JQuery;
    $settingsButton: JQuery;
    $downloadButton: JQuery;
    $printButton: JQuery;
    $fullScreenBtn: JQuery;
    $linkOldImageViewer: JQuery;
    information: Information;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('headerPanel');

        super.create();

        $.subscribe(BaseEvents.SETTINGS_CHANGED, () => {
            this.updateButton(this.$downloadButton, "downloadEnabled");
            this.updateButton(this.$printButton, "printEnabled");
        });

        $.subscribe(BaseEvents.SHOW_INFORMATION, (e: any, args: InformationArgs) => {
            this.showInformation(args);
        });

        $.subscribe(BaseEvents.HIDE_INFORMATION, () => {
            this.hideInformation();
        });

        $.subscribe(BaseEvents.TOGGLE_FULLSCREEN, () => {
            this.updateFullScreenButton();
            this.updateOldImageViewerLink();
        });

        this.$options = $('<div class="options"></div>');
        this.$element.append(this.$options);

        this.$headerBorder = $('<div class="headerBorder"></div>');
        this.$element.append(this.$headerBorder);

        this.$centerOptions = $('<div class="centerOptions"></div>');
        this.$options.append(this.$centerOptions);

        this.$rightOptions = $('<div class="rightOptions"></div>');
        this.$options.append(this.$rightOptions);

        //this.$helpButton = $('<a href="#" class="action help">' + this.content.help + '</a>');
        //this.$rightOptions.append(this.$helpButton);

        this.$localeToggleButton = $('<a class="localeToggle" tabindex="0"></a>');
        this.$rightOptions.append(this.$localeToggleButton);

        //Link to old image viewer
        var url = parent.document.URL;

        if (url.indexOf("?") > -1) {
            url = url.substr(0, url.indexOf("?"));
        }
        var checkMobile = false;
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            checkMobile = true;
        }
        var checkOnlyUVViewer = false;
        if (url.indexOf("Folk_") !== -1 || url.indexOf("Sdhk_") !== -1 || url.indexOf("BRFV_") !== -1 || url.indexOf("Brev_") !== -1) {
            checkOnlyUVViewer = true;
        }
        if (!checkMobile && !checkOnlyUVViewer) {
            this.$linkOldImageViewer = $('<a class="linkOldImageViewer" target="_top" tabindex="2" title="' + this.content.backOldImageViewer + '" href="' + url + '?viewer=DjVu">' + this.content.backOldImageViewer + '</a>');
            this.$rightOptions.append(this.$linkOldImageViewer);
        }
        //END Link to old image viewer

        this.$settingsButton = $(`
          <button class="btn imageBtn settings" tabindex="0" title="${this.content.settings}">
            <i class="uv-icon-settings" aria-hidden="true"></i>${this.content.settings}
          </button>
        `);
        this.$settingsButton.attr('title', this.content.settings);
        this.$rightOptions.append(this.$settingsButton);        

        this.$downloadButton = $('<a class="download" tabindex="4" title="' + this.content.download + '"><span /></a>');
        this.$rightOptions.append(this.$downloadButton);
        
        this.$printButton = $('<a class="print" tabindex="5" title="' + this.content.print + '"><span /></a>');
        this.$rightOptions.append(this.$printButton);
        
        this.$fullScreenBtn = $('<a href="#" class="fullScreen" tabindex="6" title="' + this.content.fullScreen + '"><span /></a>');
        this.$rightOptions.append(this.$fullScreenBtn);
        
        if(!Utils.Device.isTouch()){
            this.$rightOptions.children().addClass("no-touch");
        }

        this.updateButton(this.$downloadButton, "downloadEnabled");
        this.updateButton(this.$printButton, "printEnabled");
        this.updateFullScreenButton();
        
        this.$informationBox = $('<div class="informationBox" aria-hidden="true"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <button type="button" class="close" aria-label="Close"> \
                                        <span aria-hidden="true">&times;</span>\
                                    </button> \
                                  </div>');

        this.$element.append(this.$informationBox);

        this.$informationBox.hide();
        this.$informationBox.find('.close').attr('title', this.content.close);
        this.$informationBox.find('.close').on('click', (e) => {
            e.preventDefault();
            $.publish(BaseEvents.HIDE_INFORMATION);
        });

        this.$localeToggleButton.on('click', () => {
            this.extension.changeLocale(String(this.$localeToggleButton.data('locale')));
        });

        this.$settingsButton.onPressed(() => {
            $.publish(BaseEvents.SHOW_SETTINGS_DIALOGUE);
        });

        this.$printButton.onPressed(() => {
            var canvas = this.extension.helper.getCurrentCanvas();
            var viewer = (<ISeadragonExtension>this.extension).getViewer();
            var imageUri;
            if (this.isImageZoomed(canvas, viewer)) {
                imageUri = (<ISeadragonExtension>this.extension).getCroppedImageUri(canvas, viewer);
            }
            else {
                //TODO Ungefär samma funktion finns i DownloadDialaogue. kan den användas istället?
                imageUri = canvas.getCanonicalImageUri(canvas.getWidth());
                var uri_parts: string [] = imageUri.split('/');
                var rotation: number | null = (<ISeadragonExtension>this.extension).getViewerRotation();
                uri_parts[ uri_parts.length - 2 ] = String(rotation);
                imageUri = uri_parts.join('/');                
            }
            var title = this.extension.helper.getLabel();
            var ra: RiksarkivetPrint = new RiksarkivetPrint();
            ra.printImage(imageUri, title, canvas);
        });

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseEvents.SHOW_DOWNLOAD_DIALOGUE);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseEvents.TOGGLE_FULLSCREEN);
        });

        if (!Utils.Bools.getBool(this.options.centerOptionsEnabled, true)) {
            this.$centerOptions.hide();
        }

        this.updateLocaleToggle();
        this.updateSettingsButton();
    }

    private isImageZoomed(canvas: Manifesto.ICanvas, viewer: any): boolean {
        var dimensions: CroppedImageDimensions | null = (<ISeadragonExtension>this.extension).getCroppedImageDimensions(canvas, viewer);
        if (!CroppedImageDimensions) {
            return false;
        }
        var currentWidth: number = (<CroppedImageDimensions>dimensions).size.width;
        var currentHeight: number = (<CroppedImageDimensions>dimensions).size.height;
        var wholeWidth: number = canvas.getWidth();
        var wholeHeight: number = canvas.getHeight();

        var percentageWidth: number = (currentWidth / wholeWidth) * 100;
        var percentageHeight: number = (currentHeight / wholeHeight) * 100;

        var disabledPercentage: number = 90;
        if (this.extension.data.config.modules.downloadDialogue &&
            this.extension.data.config.modules.downloadDialogue.options &&
            this.extension.data.config.modules.downloadDialogue.options.currentViewDisabledPercentage) {
            disabledPercentage = this.extension.data.config.modules.downloadDialogue.options.currentViewDisabledPercentage;
        }

        // if over disabledPercentage of the size of whole image then not zoomed
        if (percentageWidth >= disabledPercentage && percentageHeight >= disabledPercentage) {
            return false;
        } else {
            return true;
        }
    }

    updateLocaleToggle(): void {
        if (!this.localeToggleIsVisible()) {
            this.$localeToggleButton.hide();
            return;
        }

        const alternateLocale: any = this.extension.getAlternateLocale();
        const text: string = alternateLocale.name.split('-')[0].toUpperCase();

        this.$localeToggleButton.data('locale', alternateLocale.name);
        this.$localeToggleButton.attr('title', alternateLocale.label);
        this.$localeToggleButton.text(text);
    }

    updateSettingsButton(): void {
        const settingsEnabled: boolean = Utils.Bools.getBool(this.options.settingsButtonEnabled, true);
        if (!settingsEnabled){
            this.$settingsButton.hide();
        } else {
            this.$settingsButton.show();
        }
    }

    localeToggleIsVisible(): boolean {
        const locales: ILocale[] | null = this.extension.data.locales;

        if (locales) {
            return locales.length > 1 && Utils.Bools.getBool(this.options.localeToggleEnabled, false);
        }
        
        return false;
    }

    showInformation(args: InformationArgs): void {
        const informationFactory: InformationFactory = new InformationFactory(this.extension);
        this.information = informationFactory.Get(args);
        var $message = this.$informationBox.find('.message');
        $message.html(this.information.message).find('a').attr('target', '_top');
        var $actions = this.$informationBox.find('.actions');
        $actions.empty();

        for (let i = 0; i < this.information.actions.length; i++) {
            const action: InformationAction = this.information.actions[i];
            const $action: JQuery = $('<a href="#" class="btn btn-default">' + action.label + '</a>');
            $action.on('click', action.action);
            $actions.append($action);
        }

        this.$informationBox.attr('aria-hidden', 'false');
        this.$informationBox.show();
        this.$element.addClass('showInformation');
        this.extension.resize();
    }

    hideInformation(): void {
        this.$element.removeClass('showInformation');
        this.$informationBox.attr('aria-hidden', 'true');
        this.$informationBox.hide();
        this.extension.resize();
    }

    getSettings(): ISettings {
        return this.extension.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.extension.updateSettings(settings);
        $.publish(BaseEvents.UPDATE_SETTINGS, [settings]);
    }

    resize(): void {
        super.resize();

        const headerWidth: number = this.$element.width();
        const center: number = headerWidth / 2;
        const containerWidth: number = this.$centerOptions.outerWidth();
        const pos: number = center - (containerWidth / 2);

        this.$centerOptions.css({
            left: pos
        });

        if (this.$informationBox.is(':visible')) {
            const $actions: JQuery = this.$informationBox.find('.actions');
            const $message: JQuery = this.$informationBox.find('.message');
            $message.width(Math.floor(this.$element.width()) - Math.ceil($message.horizontalMargins()) - Math.ceil($actions.outerWidth(true)) - Math.ceil(this.$informationBox.find('.close').outerWidth(true)) - 2);
            $message.ellipsisFill(this.information.message);
        }

        // hide toggle buttons below minimum width
        if (this.extension.width() < this.extension.data.config.options.minWidthBreakPoint) {
            if (this.localeToggleIsVisible()) this.$localeToggleButton.hide();
        } else {
            if (this.localeToggleIsVisible()) this.$localeToggleButton.show();
        }
    }

    updateFullScreenButton(): void {
        if (!Utils.Bools.getBool(this.options.fullscreenEnabled, true) || !Utils.Documents.supportsFullscreen()) {
            this.$fullScreenBtn.hide();
            return;
        }

        if (this.extension.data.isLightbox) {
            this.$fullScreenBtn.addClass('lightbox');
        }

        if (this.extension.isFullScreen()) {
            this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
            this.$fullScreenBtn.find('i').swapClass('uv-icon-fullscreen', 'uv-icon-exit-fullscreen');
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
            this.$fullScreenBtn.find('i').swapClass('uv-icon-exit-fullscreen', 'uv-icon-fullscreen');
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    updateOldImageViewerLink(): void {
        if (this.extension.isFullScreen()) {
            this.$linkOldImageViewer.hide();
        } else {
            this.$linkOldImageViewer.show();
        }
    }

    updateButton($button: JQuery, buttonEnabled: string) {
        var configEnabled = Utils.Bools.getBool(this.options[buttonEnabled], true);

        if (configEnabled) {
           $button.show();
        } else {
            $button.hide();
        }
    }    

}
