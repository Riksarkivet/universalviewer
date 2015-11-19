import BaseCommands = require("./BaseCommands");
import BaseView = require("./BaseView");
import BootstrapParams = require("../../BootstrapParams");
import Information = require("../uv-shared-module/Information");
import InformationAction = require("../uv-shared-module/InformationAction");
import InformationArgs = require("../uv-shared-module/InformationArgs");
import InformationFactory = require("../uv-shared-module/InformationFactory");
import SettingsDialogue = require("../uv-dialogues-module/SettingsDialogue");
import RiksarkivetPrint = require("../../modules/uv-shared-module/RiksarkivetPrint");
import ISeadragonExtension = require("../../Extensions/uv-seadragon-extension/ISeadragonExtension");
import ISeadragonProvider = require("../../Extensions/uv-seadragon-extension/ISeadragonProvider");

class HeaderPanel extends BaseView {

    $centerOptions: JQuery;
    $helpButton: JQuery;
    $informationBox: JQuery;
    $localeToggleButton: JQuery;
    $options: JQuery;
    $headerBorder: JQuery;
    $pagingToggleButton: JQuery;
    $rightOptions: JQuery;
    $settingsButton: JQuery;
    $downloadButton: JQuery;
    $fullScreenBtn: JQuery;
    information: Information;

    constructor($element: JQuery) {
        super($element, false, false);
    }

    create(): void {

        this.setConfig('headerPanel');

        super.create();

        $.subscribe(BaseCommands.SETTINGS_CHANGED, () => {
            this.updatePagingToggle();
            this.updateDownloadButton();
        });

        $.subscribe(BaseCommands.SHOW_INFORMATION, (e, args: InformationArgs) => {
            this.showInformation(args);
        });

        $.subscribe(BaseCommands.HIDE_INFORMATION, () => {
            this.hideInformation();
        });

        $.subscribe(BaseCommands.TOGGLE_FULLSCREEN, () => {
            this.updateFullScreenButton();
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

        this.$pagingToggleButton = $('<a class="imageBtn pagingToggle"></a>');
        this.$rightOptions.append(this.$pagingToggleButton);

        this.$localeToggleButton = $('<a class="localeToggle"></a>');
        this.$rightOptions.append(this.$localeToggleButton);
 
        var $printButton = $('<a class="imageBtn print" tabindex="3"></a>');
        $printButton.attr('title', 'skriv ut sidan'); //handle different languages
        this.$rightOptions.append($printButton);
 
        this.$downloadButton = $('<a class="download" tabindex="4" title="' + this.content.download + '"></a>');
        this.$rightOptions.append(this.$downloadButton);

        this.$settingsButton = $('<a class="settings" tabindex="3" title="' + this.content.settings + '"></a>');
        this.$settingsButton.attr('title', this.content.settings);
        this.$rightOptions.append(this.$settingsButton);
        
        this.$fullScreenBtn = $('<a href="#" class="fullScreen" tabindex="5" title="' + this.content.fullScreen + '"></a>');
        this.$rightOptions.append(this.$fullScreenBtn);

        this.updateDownloadButton();
        this.updateFullScreenButton();
        

        this.$informationBox = $('<div class="informationBox"> \
                                    <div class="message"></div> \
                                    <div class="actions"></div> \
                                    <div class="close"></div> \
                                  </div>');

        this.$element.append(this.$informationBox);

        this.$informationBox.hide();
        this.$informationBox.find('.close').attr('title', this.content.close);
        this.$informationBox.find('.close').on('click', (e) => {
            e.preventDefault();
            $.publish(BaseCommands.HIDE_INFORMATION);
        });

        this.updatePagingToggle();

        this.updateLocaleToggle();

        this.$pagingToggleButton.on('click', () => {
            var settings: ISettings = this.getSettings();
            settings.pagingEnabled = !settings.pagingEnabled;
            this.updateSettings(settings);
        });

        this.$localeToggleButton.on('click', () => {
            this.provider.changeLocale(String(this.$localeToggleButton.data('locale')));
        });

        this.$settingsButton.onPressed(() => {
            $.publish(BaseCommands.SHOW_SETTINGS_DIALOGUE);
        });

        $printButton.onPressed(() => {
            var canvas = this.provider.getCurrentCanvas();
            var viewer = (<ISeadragonExtension>this.extension).getViewer();
            var imageUri = (<ISeadragonProvider>this.provider).getCroppedImageUri(canvas, viewer, true);
            var imageUriTmp = imageUri.substring(0, imageUri.indexOf('/0/default.jpg'));
            imageUri = imageUri.substring(0, imageUriTmp.lastIndexOf('/')) + '/full/0/default.jpg';
            var title = this.extension.provider.getTitle();
            var ra: RiksarkivetPrint = new RiksarkivetPrint();
            ra.printImage(imageUri, title, canvas);
        });

        this.$downloadButton.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseCommands.SHOW_DOWNLOAD_DIALOGUE);
        });

        this.$fullScreenBtn.on('click', (e) => {
            e.preventDefault();
            $.publish(BaseCommands.TOGGLE_FULLSCREEN);
        });

        if (this.options.localeToggleEnabled === false){
            this.$localeToggleButton.hide();
        }

        if (this.options.pagingToggleEnabled === false){
            this.$pagingToggleButton.hide();
        }
    }

    updatePagingToggle(): void {
        if (!this.pagingToggleIsVisible()){
            this.$pagingToggleButton.hide();
            return;
        }

        if (this.provider.isPagingSettingEnabled()){
            this.$pagingToggleButton.removeClass('two-up');
            this.$pagingToggleButton.addClass('one-up');
            this.$pagingToggleButton.prop('title', this.content.oneUp);
        } else {
            this.$pagingToggleButton.removeClass('one-up');
            this.$pagingToggleButton.addClass('two-up');
            this.$pagingToggleButton.prop('title', this.content.twoUp);
        }
    }

    updateLocaleToggle(): void {
        if (!this.localeToggleIsVisible()){
            this.$localeToggleButton.hide();
            return;
        }

        var alternateLocale = this.provider.getAlternateLocale();
        var text = alternateLocale.name.split('-')[0].toUpperCase();

        this.$localeToggleButton.data('locale', alternateLocale.name);
        this.$localeToggleButton.attr('title', alternateLocale.label);
        this.$localeToggleButton.text(text);
    }

    localeToggleIsVisible(): boolean {
        return this.provider.getLocales().length > 1 && this.options.localeToggleEnabled;
    }

    pagingToggleIsVisible(): boolean {
        return this.options.pagingToggleEnabled && this.provider.isPagingAvailable();
    }

    showInformation(args: InformationArgs): void {

        var informationFactory: InformationFactory = new InformationFactory(this.provider);

        this.information = informationFactory.Get(args);
        var $message = this.$informationBox.find('.message');
        $message.html(this.information.message).find('a').attr('target', '_top');
        var $actions = this.$informationBox.find('.actions');
        $actions.empty();

        for (var i = 0; i < this.information.actions.length; i++) {
            var action: InformationAction = this.information.actions[i];

            var $action = $('<a href="#" class="btn btn-default">' + action.label + '</a>');
            $action.on('click', action.action);

            $actions.append($action);
        }

        this.$informationBox.show();
        this.$element.addClass('showInformation');
        this.extension.resize();
    }

    hideInformation(): void {
        this.$element.removeClass('showInformation');
        this.$informationBox.hide();
        this.extension.resize();
    }

    getSettings(): ISettings {
        return this.provider.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.provider.updateSettings(settings);

        $.publish(BaseCommands.UPDATE_SETTINGS, [settings]);
    }

    resize(): void {
        super.resize();

        var headerWidth = this.$element.width();
        var center = headerWidth / 2;
        var containerWidth = this.$centerOptions.outerWidth();
        var pos = center - (containerWidth / 2);

        this.$centerOptions.css({
            left: pos
        });

        if (this.$informationBox.is(':visible')){
            var $actions = this.$informationBox.find('.actions');
            var $message = this.$informationBox.find('.message');
            $message.width(this.$element.width() - $message.horizontalMargins() - $actions.outerWidth(true) - this.$informationBox.find('.close').outerWidth(true) - 1);
            $message.ellipsisFill(this.information.message);
        }

        // hide toggle buttons below minimum width
        if (this.extension.width() < this.provider.config.options.minWidthBreakPoint){
            if (this.pagingToggleIsVisible()) this.$pagingToggleButton.hide();
            if (this.localeToggleIsVisible()) this.$localeToggleButton.hide();
        } else {
            if (this.pagingToggleIsVisible()) this.$pagingToggleButton.show();
            if (this.localeToggleIsVisible()) this.$localeToggleButton.show();
        }
    }

    updateFullScreenButton(): void {
        if (!Utils.Bools.GetBool(this.options.fullscreenEnabled, true)) {
            this.$fullScreenBtn.hide();
        }

        if (this.provider.isLightbox) {
            this.$fullScreenBtn.addClass('lightbox');
        }

        if (this.extension.isFullScreen()) {
            this.$fullScreenBtn.swapClass('fullScreen', 'exitFullscreen');
            //this.$fullScreenBtn.text(this.content.exitFullScreen);
            this.$fullScreenBtn.attr('title', this.content.exitFullScreen);
        } else {
            this.$fullScreenBtn.swapClass('exitFullscreen', 'fullScreen');
            //this.$fullScreenBtn.text(this.content.fullScreen);
            this.$fullScreenBtn.attr('title', this.content.fullScreen);
        }
    }

    updateDownloadButton() {
        var configEnabled = Utils.Bools.GetBool(this.options.downloadEnabled, true);

        if (configEnabled) {
            this.$downloadButton.show();
        } else {
            this.$downloadButton.hide();
        }
    }
}

export = HeaderPanel;