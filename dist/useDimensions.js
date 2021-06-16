"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDimensions = void 0;
var react_1 = require("react");
function useDimensions(ref) {
    var _a = react_1.useState({ width: 0, height: 0 }), dimensions = _a[0], setDimensions = _a[1];
    react_1.useEffect(function () {
        if (ref.current === null) {
            return;
        }
        var resizeObserver = new ResizeObserver(function (entries) {
            if (entries.length === 0) {
                return;
            }
            var _a = entries[0].contentRect, width = _a.width, height = _a.height;
            setDimensions({ width: width, height: height });
        });
        resizeObserver.observe(ref.current);
        return function () {
            resizeObserver.disconnect();
        };
    }, [ref, setDimensions]);
    return dimensions;
}
exports.useDimensions = useDimensions;
