import BaseCommands = require("../uv-shared-module/BaseCommands");
import Commands = require("../../extensions/uv-seadragon-extension/Commands");
import HeaderPanel = require("../uv-shared-module/HeaderPanel");
import HelpDialogue = require("../uv-dialogues-module/HelpDialogue");
import ISeadragonExtension = require("../../extensions/uv-seadragon-extension/ISeadragonExtension");
import Mode = require("../../extensions/uv-seadragon-extension/Mode");

class PagingHeaderPanel extends HeaderPanel {

    $firstButton: JQuery;
    $imageModeLabel: JQuery;
    $imageModeOption: JQuery;
    $lastButton: JQuery;
    $modeOptions: JQuery;
    $nextButton: JQuery;
    $nextOptions: JQuery;
    $pageModeLabel: JQuery;
    $pageModeOption: JQuery;
    $prevButton: JQuery;
    $prevOptions: JQuery;
    $nextFiveButton: JQuery;
    $prevFiveButton: JQuery;
    $dropdownOptions: JQuery;
    $imageDropdown: JQuery;
    $search: JQuery;
    $searchButton: JQuery;
    $searchText: JQuery;
    $total: JQuery;

    firstButtonEnabled: boolean = false;
    lastButtonEnabled: boolean = false;
    nextButtonEnabled: boolean = false;
    prevButtonEnabled: boolean = false;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('pagingHeaderPanel');

        super.create();

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            this.canvasIndexChanged(canvasIndex);
        });

        $.subscribe(BaseCommands.SETTINGS_CHANGED, (e) => {
            this.modeChanged();
        });

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGE_FAILED, (e) => {
            this.setSearchFieldValue(this.provider.canvasIndex);
        });

        this.$prevOptions = $('<div class="prevOptions"></div>');
        this.$centerOptions.append(this.$prevOptions);

        this.$firstButton = $('<a class="imageBtn first" tabindex="15"></a>');
        this.$prevOptions.append(this.$firstButton);

        this.$prevFiveButton = $('<a class="imageBtn prev-five" tabindex="16"></a>');
        this.$prevOptions.append(this.$prevFiveButton);

        this.$prevButton = $('<a class="imageBtn prev" tabindex="17"></a>');
        this.$prevOptions.append(this.$prevButton);

        this.$modeOptions = $('<div class="mode"></div>');
        this.$centerOptions.append(this.$modeOptions);

        this.$imageModeLabel = $('<label for="image">' + this.content.image + '</label>');
        this.$modeOptions.append(this.$imageModeLabel);
        this.$imageModeOption = $('<input type="radio" id="image" name="mode" tabindex="18"/>');
        this.$modeOptions.append(this.$imageModeOption);

        this.$pageModeLabel = $('<label for="page"></label>');
        this.$modeOptions.append(this.$pageModeLabel);
        this.$pageModeOption = $('<input type="radio" id="page" name="mode" tabindex="19"/>');
        this.$modeOptions.append(this.$pageModeOption);

        this.$search = $('<div class="search"></div>');
        this.$centerOptions.append(this.$search);

        this.$searchText = $('<input class="searchText" maxlength="50" type="text" tabindex="20"/>');
        this.$search.append(this.$searchText);

        if (this.options.imageDropdownEnabled === true) {
            this.$dropdownOptions = $('<div class="image-dropdown-options"></div>');
            this.$centerOptions.append(this.$dropdownOptions);
            this.$imageDropdown = $('<select class="image-dropdown" name="image-select" tabindex="21" ></select>');
            this.$dropdownOptions.append(this.$imageDropdown);
            for (var imageIndex = 0; imageIndex < this.provider.getTotalCanvases(); imageIndex++) {
                var canvas = this.provider.getCanvasByIndex(imageIndex);
                var label = canvas.getLabel();
                this.$imageDropdown.append('<option value=' + (imageIndex) + '>' + label + '</option>')
            }

            this.$imageDropdown.change(() => {
                var valdIndex = parseInt(this.$imageDropdown.val());
                $.publish(Commands.IMAGE_SEARCH, [valdIndex]);
            });
        }

        this.$total = $('<span class="total"></span>');
        this.$search.append(this.$total);

        this.$searchButton = $('<a class="go btn btn-primary" tabindex="22">' + this.content.go + '</a>');
        this.$search.append(this.$searchButton);

        this.$nextOptions = $('<div class="nextOptions"></div>');
        this.$centerOptions.append(this.$nextOptions);

        this.$nextButton = $('<a class="imageBtn next" tabindex="1"></a>');
        this.$nextOptions.append(this.$nextButton);

        this.$nextFiveButton = $('<a class="imageBtn next-five" tabindex="2"></a>');
        this.$nextOptions.append(this.$nextFiveButton);

        this.$lastButton = $('<a class="imageBtn last" tabindex="3"></a>');
        this.$nextOptions.append(this.$lastButton);

        if (this.isPageModeEnabled()) {
            this.$pageModeOption.attr('checked', 'checked');
            this.$pageModeOption.removeAttr('disabled');
            this.$pageModeLabel.removeClass('disabled');
        } else {
            this.$imageModeOption.attr('checked', 'checked');
            // disable page mode option.
            this.$pageModeOption.attr('disabled', 'disabled');
            this.$pageModeLabel.addClass('disabled');
        }

        if (this.provider.getManifestType().toString() === manifesto.ManifestType.manuscript().toString()){
            this.$pageModeLabel.text(this.content.folio);
        } else {
            this.$pageModeLabel.text(this.content.page);
        }

        this.setTitles();

        this.setTotal();

        // check if the book has more than one page, otherwise hide prev/next options.
        if (this.provider.getTotalCanvases() === 1) {
            this.$centerOptions.hide();
        }

        // ui event handlers.
        this.$firstButton.onPressed(() => {
            $.publish(Commands.FIRST);
        });

        this.$prevButton.onPressed(() => {
            $.publish(Commands.PREV);
        });

        this.$prevFiveButton.onPressed(() => {
            $.publish(Commands.PREV_FIVE);
        });

        this.$nextFiveButton.onPressed(() => {
            $.publish(Commands.NEXT_FIVE);
        });

        this.$nextButton.onPressed(() => {
            $.publish(Commands.NEXT);
        });

        // If page mode is disabled, we don't need to show radio buttons since
        // there is only one option:
        if (!this.config.options.pageModeEnabled || this.provider.hasNoPageNumbers) {
            this.$imageModeOption.hide();
            this.$pageModeLabel.hide();
            this.$pageModeOption.hide();
        } else {
            // Only activate click actions for mode buttons when controls are
            // visible, since otherwise, clicking on the "Image" label can
            // trigger unexpected/undesired side effects.
            this.$imageModeOption.on('click', (e) => {
                $.publish(Commands.MODE_CHANGED, [Mode.image.toString()]);
            });

            this.$pageModeOption.on('click', (e) => {
                $.publish(Commands.MODE_CHANGED, [Mode.page.toString()]);
            });
        }

        this.$searchText.onEnter(() => {
            this.$searchText.blur();
            this.search();
        });

        this.$searchText.click(function() {
            $(this).select();
        });

        this.$searchButton.onPressed(() => {
            this.search();
        });

        this.$lastButton.onPressed(() => {
            $.publish(Commands.LAST);
        });

        //Mode options are shown as default
        if (this.options.modeOptionsEnabled === false){
            this.$modeOptions.hide();
            this.$centerOptions.addClass('modeOptionsDisabled');
        }

        //Search is shown as default
        if (this.options.searchOptionsEnabled === false) {
            this.$search.hide();
        }

        //Previous och next 5 buttons are hidden as default
        if (!(this.options.prevNextFiveButtonsEnabled === true)) {
            this.$prevFiveButton.hide();
            this.$nextFiveButton.hide();
        }

        if (this.options.helpEnabled === false) {
            this.$helpButton.hide();
        }

        //Get visible element in centerOptions with greatest tabIndex
        var maxTabIndex: number = 1;
        var $elementWithGreatestTabIndex: JQuery = this.$searchButton;
        this.$centerOptions.find('*:visible[tabindex]').each(function (idx, el: HTMLElement) {
            var tIndex = parseInt($(el).attr('tabindex'));
            if (tIndex > maxTabIndex) {
                maxTabIndex = tIndex;
                $elementWithGreatestTabIndex = $(el);
            }
        });
        // cycle focus back to start.
        $elementWithGreatestTabIndex.blur(() => {
            if (this.extension.tabbing && !this.extension.shifted){
                this.$nextButton.focus();
            }
        });

        this.$nextButton.blur(() => {
            if (this.extension.tabbing && this.extension.shifted) {
                setTimeout(() => {
                    $elementWithGreatestTabIndex.focus();
                }, 100);
            }
        });

        //this.$nextButton.blur(() => {
        //    if (this.extension.shifted) {
        //        setTimeout(() => {
        //            this.$searchButton.focus();
        //        }, 100);
        //    }
        //});
    }

    isPageModeEnabled(): boolean {
        return this.config.options.pageModeEnabled && !this.provider.hasNoPageNumbers && (<ISeadragonExtension>this.extension).getMode().toString() === Mode.page.toString();
    }

    setTitles(): void {

        if (this.isPageModeEnabled()){
            this.$firstButton.prop('title', this.content.firstPage);
            this.$prevButton.prop('title', this.content.previousPage);
            this.$nextButton.prop('title', this.content.nextPage);
            this.$prevFiveButton.prop('title', this.content.previousFivePages);
            this.$nextFiveButton.prop('title', this.content.nextFivePages);
            this.$lastButton.prop('title', this.content.lastPage);
        } else {
            this.$firstButton.prop('title', this.content.firstImage);
            this.$prevButton.prop('title', this.content.previousImage);
            this.$prevFiveButton.prop('title', this.content.previousFivePages);
            this.$nextFiveButton.prop('title', this.content.nextFivePages);
            this.$nextButton.prop('title', this.content.nextImage);
            this.$lastButton.prop('title', this.content.lastImage);
        }

        this.$searchButton.prop('title', this.content.go);
    }

    setTotal(): void {

        var of = this.content.of;

        if (this.isPageModeEnabled()) {
            this.$total.html(String.format(of, this.provider.getLastCanvasLabel(true)));
        } else {
            this.$total.html(String.format(of, this.provider.getTotalCanvases()));
        }
    }

    setSearchFieldValue(index): void {

        var canvas = this.provider.getCanvasByIndex(index);

        if (this.isPageModeEnabled()) {

            var orderLabel = canvas.getLabel();

            if (orderLabel === "-") {
                this.$searchText.val("");
            } else {
                this.$searchText.val(orderLabel);
            }
        } else {
            index += 1;
            this.$searchText.val(index);
        }
    }

    search(): void {

        var value = this.$searchText.val();

        if (!value) {

            this.extension.showMessage(this.content.emptyValue);
            $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);

            return;
        }

        if (this.isPageModeEnabled()) {
            $.publish(Commands.PAGE_SEARCH, [value]);
        } else {
            var index = parseInt(this.$searchText.val(), 10);

            index -= 1;

            if (isNaN(index)){
                this.extension.showMessage(this.provider.config.modules.genericDialogue.content.invalidNumber);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            var asset = this.provider.getCanvasByIndex(index);

            if (!asset){
                this.extension.showMessage(this.provider.config.modules.genericDialogue.content.pageNotFound);
                $.publish(BaseCommands.CANVAS_INDEX_CHANGE_FAILED);
                return;
            }

            $.publish(Commands.IMAGE_SEARCH, [index]);
        }
    }

    canvasIndexChanged(index): void {
        this.setSearchFieldValue(index);

        if (this.options.imageDropdownEnabled === true) {
            this.$imageDropdown.val(index);
        }

        if (this.provider.isFirstCanvas()){
            this.disableFirstButton();
            this.disablePrevButton();
        } else {
            this.enableFirstButton();
            this.enablePrevButton();
        }

        if (this.provider.isLastCanvas()){
            this.disableLastButton();
            this.disableNextButton();
        } else {
            this.enableLastButton();
            this.enableNextButton();
        }
    }

    disableFirstButton () {
        this.firstButtonEnabled = false;
        this.$firstButton.disable();
    }

    enableFirstButton () {
        this.firstButtonEnabled = true;
        this.$firstButton.enable();
    }

    disableLastButton () {
        this.lastButtonEnabled = false;
        this.$lastButton.disable();
    }

    enableLastButton () {
        this.lastButtonEnabled = true;
        this.$lastButton.enable()
    }

    disablePrevButton () {
        this.prevButtonEnabled = false;
        this.$prevButton.disable();
    }

    enablePrevButton () {
        this.prevButtonEnabled = true;
        this.$prevButton.enable();
    }

    disableNextButton () {
        this.nextButtonEnabled = false;
        this.$nextButton.disable();
    }

    enableNextButton () {
        this.nextButtonEnabled = true;
        this.$nextButton.enable();
    }

    modeChanged(): void {
        this.setSearchFieldValue(this.provider.canvasIndex);
        this.setTitles();
        this.setTotal();
    }

    resize(): void {
        super.resize();
    }
}

export = PagingHeaderPanel;