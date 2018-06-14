define(['../lib/openseadragon.min'], function() {
    return function(formats: string[]) {
        return {
            async: ['iiif-tree-component', 'iiif-gallery-component', 'iiif-metadata-component', 'openseadragon.min', 'openseadragon-filtering', 'rangeslider', 'ra-uv-custom']
        };
    }
});
