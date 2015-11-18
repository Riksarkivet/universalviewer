import BaseCommands = require("../uv-shared-module/BaseCommands");
import RightPanel = require("../uv-shared-module/RightPanel");

class MoreInfoRightPanel extends RightPanel {

    limitType = "lines";
    limit = 4;
    $items: JQuery;
    $canvasItems: JQuery;
    $noData: JQuery;
    moreInfoItemTemplate: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('moreInfoRightPanel');

        super.create();

        if (this.config.options.textLimitType) {
            this.limitType = this.config.options.textLimitType;
        }
        if (this.limitType === "lines") {
            this.limit = this.config.options.textLimit ? this.config.options.textLimit : 4;
        } else if (this.limitType === "chars") {
            this.limit = this.config.options.textLimit ? this.config.options.textLimit : 130;
        }

        this.moreInfoItemTemplate = $('<div class="item">\
                                           <div class="header"></div>\
                                           <div class="text"></div>\
                                       </div>');

        this.$items = $('<div class="items"></div>');
        this.$main.append(this.$items);

        this.$canvasItems = $('<div class="items"></div>');
        this.$main.append(this.$canvasItems);

        this.$noData = $('<div class="noData">' + this.content.noData + '</div>');
        this.$main.append(this.$noData);

        this.$expandButton.attr('tabindex', '4');
        this.$collapseButton.attr('tabindex', '4');

        this.$title.text(this.content.title);
        this.$closedTitle.text(this.content.title);

        $.subscribe(BaseCommands.CANVAS_INDEX_CHANGED, (e, canvasIndex) => {
            var canvas: Manifesto.ICanvas = this.provider.getCanvasByIndex(canvasIndex);

            this.displayCanvasInfo(canvas.getMetadata());
        });
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isUnopened) {
            this.getInfo();
        }
    }

    getInfo(): void {

        // show loading icon.
        this.$main.addClass('loading');

        var data = this.provider.getMetadata();
        this.displayInfo(data);
    }

    displayInfo(data: any): void {
        this.$main.removeClass('loading');

        if (!data){
            this.$noData.show();
            return;
        }

        this.$noData.hide();

        this.renderElement(this.$items, data, this.content.manifestHeader);
    }

    displayCanvasInfo(data: any) {
        if (!data) 
            return;

        this.renderElement(this.$canvasItems, data, this.content.canvasHeader);
    }

    renderElement(element: JQuery, data: any, header: string) {
        element.empty();

        if (data.length !== 0) {
            if (header)
                element.append(this.buildHeader(header));

            _.each(data, (item: any) => {
                var built = this.buildItem(item);
                element.append(built);
                if (this.limitType === "lines") {
                    built.find('.text').toggleExpandTextByLines(this.limit, this.content.less, this.content.more);
                } else if (this.limitType === "chars") {
                    built.find('.text').ellipsisHtmlFixed(this.limit, null);
                }
            });
        }
    }

    buildHeader(label: string): JQuery {
        var $header = $('<div class="header"></div>');
        $header.html(this.provider.sanitize(label));

        return $header;
    }

    buildItem(item: any): any {
        var $elem = this.moreInfoItemTemplate.clone();
        var $header = $elem.find('.header');
        var $text = $elem.find('.text');

        item.label = this.provider.sanitize(item.label);
        item.value = this.provider.sanitize(item.value);

        switch(item.label.toLowerCase()){
            case "attribution":
                item.label = this.content.attribution;
                break;
            case "description":
                item.label = this.content.description;
                break;
            case "license":
                item.label = this.content.license;
                break;
        }

        // replace \n with <br>
        item.value = item.value.replace('\n', '<br>');

        $header.html(item.label);
        $text.html(item.value);
        $text.targetBlank();

        item.label = item.label.trim();
        item.label = item.label.toLowerCase();

        $elem.addClass(item.label.toCssClass());

        return $elem;
    }

    resize(): void {
        super.resize();

        this.$main.height(this.$element.height() - this.$top.height() - this.$main.verticalMargins());
    }
}

export = MoreInfoRightPanel;