"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNiconico = void 0;
var react_1 = require("react");
var useDimensions_1 = require("./useDimensions");
function useNiconico(options) {
    var _a = __assign({ displayMillis: 5000, fontSize: 36, lineWidth: 4 }, options), displayMillis = _a.displayMillis, fontSize = _a.fontSize, lineWidth = _a.lineWidth;
    var ref = react_1.useRef(null);
    var _b = useDimensions_1.useDimensions(ref), width = _b.width, height = _b.height;
    var _c = react_1.useState({
        fn: function (_) {
            console.warn("Could not find canvas");
        },
    }), emitText = _c[0], setEmitText = _c[1];
    var calcCommentX = function (ctx, comment, timestamp) {
        var canvasWidth = ctx.canvas.width;
        var textWidth = ctx.measureText(comment.text).width;
        var percentage = (timestamp - comment.timestamp) / displayMillis;
        var dx = (canvasWidth + textWidth) * percentage;
        return canvasWidth - dx;
    };
    react_1.useEffect(function () {
        var _a;
        if (ref.current === null) {
            return;
        }
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var maxRows = Math.floor(height / fontSize);
        var comments = [];
        setEmitText({
            fn: function (text) {
                var reservedRowNumbers = new Set();
                var now = Date.now();
                comments.forEach(function (comment) {
                    var displayEndTime = comment.timestamp + displayMillis;
                    var x = calcCommentX(ctx, { text: text, timestamp: now }, displayEndTime);
                    if (x < 0) {
                        // case of the comment catches up with previous comment
                        reservedRowNumbers.add(comment.rowNumber);
                        return;
                    }
                    var endOfCommentX = calcCommentX(ctx, comment, now) +
                        ctx.measureText(comment.text).width;
                    if (endOfCommentX > width) {
                        // case of the end of comment is not displayed
                        reservedRowNumbers.add(comment.rowNumber);
                        return;
                    }
                });
                for (var rowNumber = 0; rowNumber < maxRows; ++rowNumber) {
                    if (!reservedRowNumbers.has(rowNumber)) {
                        comments.push({ text: text, timestamp: now, rowNumber: rowNumber });
                        break;
                    }
                }
            },
        });
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = "absolute";
        canvas.style.top = ref.current.offsetTop + "px";
        canvas.style.left = ref.current.offsetLeft + "px";
        canvas.style.pointerEvents = "none";
        ctx.font = "bold " + fontSize + "px sans-serif";
        ctx.lineWidth = lineWidth;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.strokeStyle = "#8c8c8c";
        ctx.fillStyle = "#fff";
        var frame = function () {
            ctx.clearRect(0, 0, width, height);
            var nextComments = [];
            var now = Date.now();
            comments.forEach(function (comment) {
                var x = calcCommentX(ctx, comment, now);
                var textWidth = ctx.measureText(comment.text).width;
                if (x + textWidth < 0) {
                    return;
                }
                var y = fontSize * comment.rowNumber;
                ctx.strokeText(comment.text, x, y);
                ctx.fillText(comment.text, x, y);
                nextComments.push(comment);
            });
            comments = nextComments;
            return requestAnimationFrame(frame);
        };
        var handle = frame();
        (_a = ref.current.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(canvas, ref.current);
        return function () {
            var _a, _b;
            cancelAnimationFrame(handle);
            (_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(canvas);
        };
    }, [displayMillis, fontSize, lineWidth, ref, setEmitText, width, height]);
    return [ref, emitText.fn];
}
exports.useNiconico = useNiconico;
