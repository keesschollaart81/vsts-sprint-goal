define(function() { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./dist/js/widgetconfig.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dist/js/SprintGoalApplicationInsightsWrapper.js":
/*!*********************************************************!*\
  !*** ./dist/js/SprintGoalApplicationInsightsWrapper.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var SprintGoalApplicationInsightsWrapper = /** @class */ (function () {\n        function SprintGoalApplicationInsightsWrapper() {\n            var _this = this;\n            this.load = function () {\n                _this.isLoaded = true;\n                _this.context = VSS.getExtensionContext();\n                _this.webContext = VSS.getWebContext();\n                var appInsights = window[\"appInsights\"] || function (a) {\n                    function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b); }); }; }\n                    var c = { config: a }, d = document, e = window;\n                    setTimeout(function () { var b = d.createElement(\"script\"); b.src = a.url || \"https://az416426.vo.msecnd.net/scripts/a/ai.0.js\", d.getElementsByTagName(\"script\")[0].parentNode.appendChild(b); });\n                    try {\n                        c.cookie = d.cookie;\n                    }\n                    catch (a) { }\n                    c.queue = [];\n                    for (var f = [\"Event\", \"Exception\", \"Metric\", \"PageView\", \"Trace\", \"Dependency\"]; f.length;)\n                        b(\"track\" + f.pop());\n                    if (b(\"setAuthenticatedUserContext\"), b(\"clearAuthenticatedUserContext\"), b(\"startTrackEvent\"), b(\"stopTrackEvent\"), b(\"startTrackPage\"), b(\"stopTrackPage\"), b(\"flush\"), !a.disableExceptionTracking) {\n                        f = \"onerror\", b(\"_\" + f);\n                        var g = e[f];\n                        e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c[\"_\" + f](a, b, d, e, h), i; };\n                    }\n                    return c;\n                }({\n                    instrumentationKey: \"<<AppInsightsInstrumentationKey>>\"\n                });\n                window[\"appInsights\"] = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();\n                window[\"appInsights\"].setAuthenticatedUserContext(_this.webContext.user.id, _this.webContext.collection.id);\n            };\n            this.trackPageView = function (title) {\n                if (!_this.isLoaded)\n                    _this.load();\n                window[\"appInsights\"].trackPageView(title, window.location.pathname, _this.getDefaultProps());\n            };\n            this.trackEvent = function (name, properties, measurements) {\n                if (!_this.isLoaded)\n                    _this.load();\n                var joinedProps = __assign({}, _this.getDefaultProps(), properties);\n                window[\"appInsights\"].trackEvent(name, joinedProps, measurements);\n            };\n            this.trackException = function (exception) {\n                if (!_this.isLoaded)\n                    _this.load();\n                window[\"appInsights\"].trackException(exception, \"unhandled\", _this.getDefaultProps());\n            };\n            this.getDefaultProps = function () {\n                return {\n                    accountName: _this.webContext.account.name,\n                    accountId: _this.webContext.account.id,\n                    extensionId: _this.context.extensionId,\n                    version: _this.context.version,\n                    teamName: _this.webContext.team.name\n                };\n            };\n            this.isLoaded = false;\n        }\n        return SprintGoalApplicationInsightsWrapper;\n    }());\n    exports.SprintGoalApplicationInsightsWrapper = SprintGoalApplicationInsightsWrapper;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./dist/js/SprintGoalApplicationInsightsWrapper.js?");

/***/ }),

/***/ "./dist/js/settings.js":
/*!*****************************!*\
  !*** ./dist/js/settings.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    var SprintGoalWidgetSettings = /** @class */ (function () {\n        function SprintGoalWidgetSettings(foregroundColor, backgroundColor, fontSize) {\n            this.backgroundColor = backgroundColor;\n            this.fontsize = fontSize;\n            this.foregroundColor = foregroundColor;\n        }\n        SprintGoalWidgetSettings.DefaultSettings = new SprintGoalWidgetSettings(\"FFFFFF\", \"191EBF\", 13);\n        return SprintGoalWidgetSettings;\n    }());\n    exports.SprintGoalWidgetSettings = SprintGoalWidgetSettings;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./dist/js/settings.js?");

/***/ }),

/***/ "./dist/js/widgetconfig.js":
/*!*********************************!*\
  !*** ./dist/js/widgetconfig.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./settings */ \"./dist/js/settings.js\"), __webpack_require__(/*! ./SprintGoalApplicationInsightsWrapper */ \"./dist/js/SprintGoalApplicationInsightsWrapper.js\")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, settings_1, SprintGoalApplicationInsightsWrapper_1) {\n    \"use strict\";\n    Object.defineProperty(exports, \"__esModule\", { value: true });\n    VSS.require([\"TFS/Dashboards/WidgetHelpers\"], function (WidgetHelpers) {\n        WidgetHelpers.IncludeWidgetConfigurationStyles();\n        VSS.register(\"SprintGoalWidget.Configuration\", function () {\n            return new SprintGoalWidgetConfiguration(WidgetHelpers, new SprintGoalApplicationInsightsWrapper_1.SprintGoalApplicationInsightsWrapper());\n        });\n        VSS.notifyLoadSucceeded();\n    });\n    var SprintGoalWidgetConfiguration = /** @class */ (function () {\n        function SprintGoalWidgetConfiguration(WidgetHelpers, ai) {\n            var _this = this;\n            this.WidgetHelpers = WidgetHelpers;\n            this.ai = ai;\n            this.onSave = function () {\n                var customSettings = _this.getCustomSettings();\n                try {\n                    _this.ai.trackEvent(\"Save widget settings\", {\n                        foregroundColor: $(\"#foreground-color-input\").val(),\n                        backgroundColor: $(\"#background-color-input\").val(),\n                        fontSize: $(\"#font-size-input\").val(),\n                        cols: _this.widgetSettings.size.columnSpan.toString(),\n                        rows: _this.widgetSettings.size.columnSpan.toString(),\n                        title: _this.widgetSettings.name\n                    });\n                }\n                catch (e) {\n                    //swallow\n                }\n                return _this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);\n            };\n            this.setDefaultColors = function (settings) {\n                var defaultSettings = settings_1.SprintGoalWidgetSettings.DefaultSettings;\n                if (!settings)\n                    settings = defaultSettings;\n                if (!settings.foregroundColor)\n                    settings.foregroundColor = defaultSettings.foregroundColor;\n                if (!settings.backgroundColor)\n                    settings.backgroundColor = defaultSettings.backgroundColor;\n                if (!settings.fontsize)\n                    settings.fontsize = defaultSettings.fontsize;\n                return settings;\n            };\n            this.notifyChange = function (widgetConfigurationContext) {\n                widgetConfigurationContext.notify(_this.WidgetHelpers.WidgetEvent.ConfigurationChange, _this.WidgetHelpers.WidgetEvent.Args(_this.getCustomSettings()));\n            };\n            this.getCustomSettings = function () {\n                var fontSize = parseInt($(\"#font-size-input\").val());\n                var customSettings = {\n                    data: JSON.stringify(new settings_1.SprintGoalWidgetSettings($(\"#foreground-color-input\").val(), $(\"#background-color-input\").val(), fontSize))\n                };\n                return customSettings;\n            };\n            this.validateNameTextInput = function ($nameInput, $errorSingleLineInput) {\n                if ($nameInput.val() == \"\") {\n                    $errorSingleLineInput.text(\"Please enter a value\");\n                    $errorSingleLineInput.css(\"visibility\", \"visible\");\n                    return;\n                }\n                $errorSingleLineInput.css(\"visibility\", \"hidden\");\n                return true;\n            };\n        }\n        SprintGoalWidgetConfiguration.prototype.load = function (widgetSettings, widgetConfigurationContext) {\n            var _this = this;\n            try {\n                this.widgetSettings = widgetSettings;\n                var settings = JSON.parse(widgetSettings.customSettings.data);\n                settings = this.setDefaultColors(settings);\n                $(\"#foreground-color-input\").val(settings.foregroundColor);\n                $(\"#background-color-input\").val(settings.backgroundColor);\n                $(\"#font-size-input\").val(settings.fontsize);\n                $(\"#foreground-color-input\").on(\"change paste keyup\", function () {\n                    if (_this.validateNameTextInput($(\"#foreground-color-input\"), $(\".foreground-color-input-validation\"))) {\n                        _this.notifyChange(widgetConfigurationContext);\n                    }\n                });\n                $(\"#background-color-input\").on(\"change paste keyup\", function () {\n                    if (_this.validateNameTextInput($(\"#background-color-input\"), $(\".background-color-input-validation\"))) {\n                        _this.notifyChange(widgetConfigurationContext);\n                    }\n                });\n                $(\"#font-size-input\").on(\"change paste keyup\", function () {\n                    if (_this.validateNameTextInput($(\"#font-size-input\"), $(\".font-size-input-validation\"))) {\n                        _this.notifyChange(widgetConfigurationContext);\n                    }\n                });\n                return this.WidgetHelpers.WidgetStatusHelper.Success();\n            }\n            catch (e) {\n                this.ai.trackException(e);\n            }\n        };\n        return SprintGoalWidgetConfiguration;\n    }());\n    exports.SprintGoalWidgetConfiguration = SprintGoalWidgetConfiguration;\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));\n\n\n//# sourceURL=webpack:///./dist/js/widgetconfig.js?");

/***/ })

/******/ })});;