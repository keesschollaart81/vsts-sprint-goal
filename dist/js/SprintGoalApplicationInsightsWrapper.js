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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoalApplicationInsightsWrapper = /** @class */ (function () {
        function SprintGoalApplicationInsightsWrapper() {
            var _this = this;
            this.load = function () {
                _this.isLoaded = true;
                _this.context = VSS.getExtensionContext();
                _this.webContext = VSS.getWebContext();
                var appInsights = window["appInsights"] || function (a) {
                    function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b); }); }; }
                    var c = { config: a }, d = document, e = window;
                    setTimeout(function () { var b = d.createElement("script"); b.src = a.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js", d.getElementsByTagName("script")[0].parentNode.appendChild(b); });
                    try {
                        c.cookie = d.cookie;
                    }
                    catch (a) { }
                    c.queue = [];
                    for (var f = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; f.length;)
                        b("track" + f.pop());
                    if (b("setAuthenticatedUserContext"), b("clearAuthenticatedUserContext"), b("startTrackEvent"), b("stopTrackEvent"), b("startTrackPage"), b("stopTrackPage"), b("flush"), !a.disableExceptionTracking) {
                        f = "onerror", b("_" + f);
                        var g = e[f];
                        e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c["_" + f](a, b, d, e, h), i; };
                    }
                    return c;
                }({
                    instrumentationKey: "4a71e7ad-d598-40c2-930b-2d571f6f149f"
                });
                window["appInsights"] = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();
                window["appInsights"].setAuthenticatedUserContext(_this.webContext.user.id, _this.webContext.collection.id);
            };
            this.trackPageView = function (title) {
                if (!_this.isLoaded)
                    _this.load();
                window["appInsights"].trackPageView(title, window.location.pathname, _this.getDefaultProps());
            };
            this.trackEvent = function (name, properties, measurements) {
                if (!_this.isLoaded)
                    _this.load();
                var joinedProps = __assign({}, _this.getDefaultProps(), properties);
                window["appInsights"].trackEvent(name, joinedProps, measurements);
            };
            this.trackException = function (exception) {
                if (!_this.isLoaded)
                    _this.load();
                window["appInsights"].trackException(exception, "unhandled", _this.getDefaultProps());
            };
            this.getDefaultProps = function () {
                return {
                    accountName: _this.webContext.account.name,
                    accountId: _this.webContext.account.id,
                    extensionId: _this.context.extensionId,
                    version: _this.context.version,
                    teamName: _this.webContext.team.name
                };
            };
            this.isLoaded = false;
        }
        return SprintGoalApplicationInsightsWrapper;
    }());
    exports.SprintGoalApplicationInsightsWrapper = SprintGoalApplicationInsightsWrapper;
});
