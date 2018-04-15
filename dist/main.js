var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ANIMATION_TIME = 50;
var ANIMATION_TYPE;
(function (ANIMATION_TYPE) {
    ANIMATION_TYPE["selected"] = "SELECTED";
    ANIMATION_TYPE["unselected"] = "UNSELECTED";
    ANIMATION_TYPE["transform"] = "TRANSFORM";
    ANIMATION_TYPE["rotate"] = "ROTATE";
    ANIMATION_TYPE["compareTo"] = "COMPARE_TO";
    ANIMATION_TYPE["swapPosition"] = "SWAP";
    ANIMATION_TYPE["finished"] = "FINISHED";
})(ANIMATION_TYPE || (ANIMATION_TYPE = {}));
var AnimateStackHandle = /** @class */ (function () {
    function AnimateStackHandle() {
        var _this = this;
        this.listAnimate = new Array();
        this.addListAnimate = function (animates) {
            _this.listAnimate = _this.listAnimate.concat(animates);
        };
        this.setAnimation = function (object, action, target) {
            var listAnimate = [];
            var animation = _this.generateAnimateData(action, object, target, action == ANIMATION_TYPE.swapPosition ? 400 : null);
            listAnimate.push(animation);
            _this.addListAnimate(listAnimate);
        };
        this.playListAnimate = function (numberCompare, numberSwap) {
            var currentCallBackFunc = function () {
                alert("The sort function takes " + numberCompare + " compares and " + numberSwap + " swaps function");
            };
            for (var i = _this.listAnimate.length - 1; i >= 0; i--) {
                var animateData = _this.listAnimate[i];
                if (i > 0) {
                    currentCallBackFunc = _this.generateCallBackFunction(animateData, currentCallBackFunc);
                }
                else {
                    _this.playAnimate(animateData, currentCallBackFunc);
                }
            }
        };
        this.playAnimate = function (animateData, callBackFunc) {
            var object = animateData.object.getRepresentObject();
            var label = animateData.object.getRepresentLabel();
            var properties = _this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);
            object.animate(properties.objectProperties, animateData.type, animateData.time, function () {
                label.attr(properties.labelProperties);
                callBackFunc();
            });
        };
        this.generateCallBackFunction = function (animateData, callBackFunc) {
            var object = animateData.object.getRepresentObject();
            var target = animateData.target != null ? animateData.target.getRepresentObject() : null;
            var label = animateData.object.getRepresentLabel();
            var targetLabel = animateData.target != null ? animateData.target.getRepresentLabel() : null;
            return function () {
                if (animateData.animationType == ANIMATION_TYPE.swapPosition) {
                    var focus_properties_1 = _this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);
                    var target_properties_1 = _this.generateAnimationProperties(animateData.animationType, animateData.target, animateData.object);
                    var object_animation = RaphaelJs.animation(focus_properties_1.objectProperties, animateData.time, animateData.type, function () {
                        label.attr(focus_properties_1.labelProperties);
                        if (callBackFunc != null) {
                            callBackFunc();
                        }
                    });
                    var target_animation = RaphaelJs.animation(target_properties_1.objectProperties, animateData.time, animateData.type, function () {
                        targetLabel.attr(target_properties_1.labelProperties);
                    });
                    object.animate(object_animation);
                    target.animate(target_animation);
                }
                else {
                    var properties_1 = _this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);
                    var raphael_animation = RaphaelJs.animation(properties_1.objectProperties, animateData.time, animateData.type, function () {
                        label.attr(properties_1.labelProperties);
                        if (callBackFunc != null) {
                            callBackFunc();
                        }
                    });
                    object.animate(raphael_animation);
                }
            };
        };
        this.generateAnimateData = function (animationType, object, target, time) {
            return {
                animationType: animationType, object: object, target: target, type: "ease-out", time: time == null ? ANIMATION_TIME : time
            };
        };
        this.generateAnimationProperties = function (action, object, target) {
            var properties = null;
            var objectType = object.objectType;
            if (action == ANIMATION_TYPE.selected) {
                properties = _this.generatePropertiesData({ opacity: 0.6 }, { opacity: 0.6 });
            }
            else if (action == ANIMATION_TYPE.unselected) {
                properties = _this.generatePropertiesData({ opacity: 1 }, { opacity: 1 });
            }
            else if (action == ANIMATION_TYPE.swapPosition) {
                if (objectType == "circle") {
                    var objectProperties = { cx: target.getRepresentObject().attr("cx"), cy: target.getRepresentObject().attr("cy") };
                    var labelProperties = { x: target.getRepresentLabel().attr("x"), y: target.getRepresentLabel().attr("y") };
                    properties = _this.generatePropertiesData(objectProperties, labelProperties);
                }
                else {
                    var objectProperties = { x: target.getRepresentObject().attr("x"), y: target.getRepresentObject().attr("y") };
                    var labelProperties = { x: target.getRepresentLabel().attr("x"), y: target.getRepresentLabel().attr("y") };
                    properties = _this.generatePropertiesData(objectProperties, labelProperties);
                }
            }
            else if (action == ANIMATION_TYPE.compareTo) {
                properties = _this.generatePropertiesData({ opacity: 1 }, { opacity: 1 });
            }
            else if (action == ANIMATION_TYPE.finished) {
                properties = _this.generatePropertiesData({ fill: "#0474BB" /* blue */, transform: "t" + "0" + "," + 120 }, { fill: "#FFFFFF" /* white */, transform: "t" + "0" + "," + 120 });
            }
            return properties;
        };
        this.generatePropertiesData = function (objectProperties, labelProperties) {
            return { objectProperties: objectProperties, labelProperties: labelProperties };
        };
    }
    return AnimateStackHandle;
}());
;
;
var RaphaelJs = null;
var AbstractArrayPoint = /** @class */ (function () {
    function AbstractArrayPoint(paper, objectType) {
        this.paper = paper;
        this.objectType = objectType;
    }
    return AbstractArrayPoint;
}());
var ArrayPoint = /** @class */ (function (_super) {
    __extends(ArrayPoint, _super);
    function ArrayPoint(paper, value, objectType, position) {
        var _this = _super.call(this, paper, objectType) || this;
        _this.getSwapPosition = function (target) {
            return _this.object.getSwapPosition(target.object);
        };
        _this.getRepresentObject = function () {
            return _this.object.getRepresentObject();
        };
        _this.getRepresentLabel = function () {
            return _this.label.getRepresentObject();
        };
        _this.compareTo = function (point) {
            return _this.value - point.value;
        };
        _this.swapPosition = function (point) {
            _this.object.swapPosition(point.object);
        };
        _this.updatePosition = function (position) {
            _this.object.updatePosition(position);
        };
        _this.move = function (dx, dy) {
            _this.object.transform(dx, dy);
        };
        _this.isSelected = function () {
            return _this.izSelected;
        };
        _this.selected = function () {
            _this.object.selected();
            _this.izSelected = true;
        };
        _this.unselected = function () {
            _this.object.unselected();
            _this.izSelected = false;
        };
        if (objectType == "circle") {
            var object_param = ObjectRepresentFactory.getCircleRepresentObjectParam(paper, position.cx, position.cy, 20, "#ED1F24" /* red */);
            _this.object = ObjectRepresentFactory.getRepresentObjectByType(objectType, object_param);
            var label_param = ObjectRepresentFactory.getTextRepresentObjectParam(paper, position.cx, position.cy, value, "#FFFFFF" /* white */);
            _this.label = ObjectRepresentFactory.getRepresentObjectByType("label", label_param);
        }
        else {
            var object_param = ObjectRepresentFactory.getCircleRepresentObjectParam(paper, position.cx, position.cy, 20, "#ED1F24" /* red */);
            _this.object = ObjectRepresentFactory.getRepresentObjectByType(objectType, object_param);
            var object_label = [paper, position.cx, position.cy, 20, value, "#FFFFFF" /* white */, "#FFFFFF" /* white */];
            _this.label = ObjectRepresentFactory.getRepresentObjectByType("label", object_label);
        }
        _this.value = value;
        _this.izSelected = false;
        return _this;
    }
    return ArrayPoint;
}(AbstractArrayPoint));
var SortArrayData = /** @class */ (function () {
    function SortArrayData(paper) {
        var _this = this;
        this.numberCompare = 0;
        this.numberSwap = 0;
        this.createArray = function (totalItem, isDuplicated, range) {
            if (range == null)
                range = { min: 1, max: totalItem, step: 1 };
            var objectArray;
            if (isDuplicated) {
                objectArray = _this.createDuplicatedArray(range);
            }
            else {
                objectArray = _this.createUniqueArray(range);
            }
            _this.renderListObject(objectArray);
        };
        this.createDuplicatedArray = function (range) {
            var objectArray = new Array();
            for (var i = range.min; i <= range.max; i++) {
                var currentValue = _this.randomBetweenTwoNumber(range.min, range.max);
                objectArray.push(currentValue);
            }
            return objectArray;
        };
        this.createUniqueArray = function (range) {
            var temp_array = new Array();
            for (var i = range.min; i <= range.max; i++) {
                temp_array.push(i);
            }
            var objectArray = new Array();
            var total_item = temp_array.length;
            for (var i = 0; i < total_item; i++) {
                var randomIndex = _this.randomBetweenTwoNumber(0, temp_array.length - 1);
                objectArray.push(temp_array[randomIndex]);
                temp_array.splice(randomIndex, 1);
            }
            return objectArray;
        };
        this.renderListObject = function (objectArray) {
            var _listObject = new Array();
            var padding = { x: 30, y: 50 };
            var begin_cx = padding.x;
            var begin_cy = 50;
            var unit_range = (_this.paper.width - (padding.x * 2)) / objectArray.length;
            for (var _i = 0, objectArray_1 = objectArray; _i < objectArray_1.length; _i++) {
                var value = objectArray_1[_i];
                var object = new ArrayPoint(_this.paper, value, "circle", { cx: begin_cx, cy: begin_cy });
                _listObject.push(object);
                begin_cx += unit_range;
            }
            _this.listObject = _listObject;
        };
        // if object > target point : return  > 0 else return < 0;
        this.compareTwoObjects = function (object, target) {
            _this.numberCompare += 1;
            return object.compareTo(target);
        };
        this.swapTwoObjects = function (objectIndex, targetIndex) {
            _this.numberSwap += 1;
            var object = _this.listObject[objectIndex];
            var target = _this.listObject[targetIndex];
            // swap position for object
            _this.listObject[targetIndex] = object;
            _this.listObject[objectIndex] = target;
        };
        this.showCurrentData = function (index) {
            var message = new Array();
            for (var i = 0; i < _this.listObject.length; i++) {
                message.push(" " + _this.listObject[i].value + " ");
                if (i == index) {
                    message.push(" | ");
                }
            }
            console.log(message.join(""));
        };
        this.sortArray = function () {
            // let implement do it
        };
        this.randomBetweenTwoNumber = function (begin, end) {
            return begin + Math.floor(Math.random() * (end - begin));
        };
        this.paper = paper;
        this.animateStackHandle = new AnimateStackHandle();
    }
    return SortArrayData;
}());
var SORT_TYPE;
(function (SORT_TYPE) {
    SORT_TYPE["SelectionSort"] = "SELECTION_SORT";
    SORT_TYPE["BubbleSort"] = "BUBBLE_SORT";
})(SORT_TYPE || (SORT_TYPE = {}));
var SortArrayFactory = /** @class */ (function () {
    function SortArrayFactory() {
        this.getObject = function (paper, type) {
            switch (type) {
                case SORT_TYPE.SelectionSort: return new SelectionSort(paper);
                case SORT_TYPE.BubbleSort: return new BubbleSort(paper);
                default: return new SortArrayData(paper);
            }
        };
    }
    return SortArrayFactory;
}());
function triggerSortEvent(raphael, paper, sortType) {
    var params = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        params[_i - 3] = arguments[_i];
    }
    RaphaelJs = raphael;
    var totalNumber = params[0];
    var sortArrayFactory = new SortArrayFactory();
    var arrayObject = sortArrayFactory.getObject(paper, sortType);
    arrayObject.createArray(totalNumber, false, null);
    return arrayObject;
}
var AbstractObjectRepresent = /** @class */ (function () {
    function AbstractObjectRepresent() {
        var _this = this;
        this.getBBox = function () {
            return _this.object._getBBox();
        };
        this.transform = function (dx, dy) {
            _this.object.transform("t" + dx + "," + dy);
        };
        this.selected = function () {
            _this.object.attr("opacity", 0.5);
        };
        this.unselected = function () {
            _this.object.attr("opacity", 1);
        };
        this.getRepresentObject = function () {
            return _this.object;
        };
    }
    return AbstractObjectRepresent;
}());
var LabelObject = /** @class */ (function (_super) {
    __extends(LabelObject, _super);
    function LabelObject(params) {
        var _this = _super.call(this) || this;
        _this.swapPosition = function (target) {
            var objectBBox = _this.object.getBBox();
            var targetBBox = target.object.getBBox();
            var object_position = { cx: targetBBox.x + targetBBox.width / 2, cy: targetBBox.y + targetBBox.height / 2 };
            var target_position = { cx: objectBBox.x + objectBBox.width / 2, cy: objectBBox.y + objectBBox.height / 2 };
            _this.updatePosition(object_position);
            target.updatePosition(target_position);
        };
        _this.getSwapPosition = function (target) {
            var objectBBox = _this.object.getBBox();
            var targetBBox = target.object.getBBox();
            var object_position = { cx: targetBBox.x + targetBBox.width / 2, cy: targetBBox.y + targetBBox.height / 2 };
            var target_position = { cx: objectBBox.x + objectBBox.width / 2, cy: objectBBox.y + objectBBox.height / 2 };
            return {
                focus: object_position, target: target_position
            };
        };
        _this.updatePosition = function (position) {
            _this.object.attr("x", position.cx);
            _this.object.attr("y", position.cy);
        };
        _this.adjustPositionAnimation = function (position) {
            var animation = RaphaelJs.animation({ 'x': position.x, 'y': position.y }, 1000, "easeInOut", function () {
            });
            _this.object.animate(animation);
        };
        _this.compareToAnimation = function (_object) {
        };
        _this.validateRepresent = function () {
        };
        var paper = params[0], cx = params[1], cy = params[2], label = params[3], color = params[4];
        _this.paper = paper;
        _this.object = _this.paper.text(cx, cy, label).attr({ fill: color, 'font-size': 16 });
        return _this;
    }
    return LabelObject;
}(AbstractObjectRepresent));
var CircleObject = /** @class */ (function (_super) {
    __extends(CircleObject, _super);
    function CircleObject(params) {
        var _this = _super.call(this) || this;
        _this.swapPosition = function (target) {
            var objectBBox = _this.object.getBBox();
            var targetBBox = target.object.getBBox();
            var object_position = { cx: targetBBox.x + targetBBox.width / 2, cy: targetBBox.y + targetBBox.height / 2 };
            var target_position = { cx: objectBBox.x + objectBBox.width / 2, cy: objectBBox.y + objectBBox.height / 2 };
            _this.updatePosition(object_position);
            target.updatePosition(target_position);
        };
        _this.getSwapPosition = function (target) {
            var objectBBox = _this.object.getBBox();
            var targetBBox = target.object.getBBox();
            var object_position = { cx: targetBBox.x + targetBBox.width / 2, cy: targetBBox.y + targetBBox.height / 2 };
            var target_position = { cx: objectBBox.x + objectBBox.width / 2, cy: objectBBox.y + objectBBox.height / 2 };
            return {
                focus: object_position, target: target_position
            };
        };
        _this.updatePosition = function (position) {
            _this.object.attr("cx", position.cx);
            _this.object.attr("cy", position.cy);
        };
        _this.adjustPositionAnimation = function (position) {
            var animation = RaphaelJs.animation({ 'cx': position.cx, 'cy': position.cy }, 1000, "easeInOut", function () {
            });
            _this.object.animate(animation);
        };
        _this.compareToAnimation = function (_object) {
        };
        _this.validateRepresent = function () {
        };
        var paper = params[0], cx = params[1], cy = params[2], radius = params[3], color = params[4];
        _this.paper = paper;
        _this.object = _this.paper.circle(cx, cy, radius).attr({ fill: color, stroke: "#000", 'stroke-width': 1 });
        return _this;
    }
    return CircleObject;
}(AbstractObjectRepresent));
var SquareObject = /** @class */ (function (_super) {
    __extends(SquareObject, _super);
    function SquareObject() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.swapPosition = function (target) {
            var objectBBox = _this.getBBox();
            var targetBBox = target.getBBox();
            _this.updatePosition(targetBBox);
            target.updatePosition(objectBBox);
        };
        _this.getSwapPosition = function (target) {
            var objectBBox = _this.getBBox();
            var targetBBox = target.getBBox();
            return {
                focus: objectBBox, target: targetBBox
            };
        };
        _this.updatePosition = function (position) {
            var bBox = _this.object._getBBox();
            _this.object.attr("x", position.x);
            _this.object.attr("y", position.y);
        };
        _this.compareToAnimation = function (_object) {
        };
        _this.adjustPositionAnimation = function (position) {
            var animation = RaphaelJs.animation({ 'x': position.x, 'y': position.y }, 1000, "easeInOut", function () {
            });
            _this.object.animate(animation);
        };
        _this.validateRepresent = function () {
        };
        var paper = params[0], x = params[1], y = params[2], width = params[3], height = params[4], color = params[5];
        _this.paper = paper;
        _this.object = paper.rect(x, y, width, height).attr({ fill: color, stroke: "#000", 'stroke-width': 1 });
        return _this;
    }
    return SquareObject;
}(AbstractObjectRepresent));
var ObjectRepresentFactory = /** @class */ (function () {
    function ObjectRepresentFactory() {
    }
    ObjectRepresentFactory.getRepresentObjectByType = function (type, params) {
        if (type == "circle") {
            return new CircleObject(params);
        }
        else if (type == "rect") {
            return new SquareObject(params);
        }
        else if (type == "label") {
            return new LabelObject(params);
        }
    };
    ObjectRepresentFactory.getCircleRepresentObjectParam = function (paper, cx, cy, radius, color) {
        return [paper, cx, cy, radius, color];
    };
    ObjectRepresentFactory.getRectRepresentObjectParam = function (paper, x, y, width, height, color) {
        return [paper, x, y, width, height, color];
    };
    ObjectRepresentFactory.getTextRepresentObjectParam = function (paper, cx, cy, label, color) {
        return [paper, cx, cy, label, color];
    };
    return ObjectRepresentFactory;
}());
/*
*
* Giai thuat nay trinh bay nhu sau :
*
* Ta se duyet qua tung phan tu cua day va so sanh no voi phan con lai. Neu ma co mot gia tri nao do ton tai ma no nho hon
* gia tri hien tai thi ta swap gia tri dau tien cho no.
* */
var SelectionSort = /** @class */ (function (_super) {
    __extends(SelectionSort, _super);
    function SelectionSort(paper) {
        var _this = _super.call(this, paper) || this;
        _this.sortArray = function () {
            // One by one move boundary of unsorted subarray
            for (var i = 0; i < _this.listObject.length - 1; i++) {
                var current_object = _this.listObject[i];
                var min_idx = i;
                //1. selected the object
                var min_object = current_object;
                _this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.selected, null);
                for (var j = i + 1; j < _this.listObject.length; j++) {
                    var _object = _this.listObject[j];
                    //2. selected the current object
                    _this.animateStackHandle.setAnimation(_object, ANIMATION_TYPE.selected, null);
                    if (_this.compareTwoObjects(min_object, _object) > 0) {
                        // 3. compare the object with other
                        _this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.compareTo, _object);
                        min_idx = j;
                        min_object = _object;
                    }
                    //4. unselected the object and find next
                    _this.animateStackHandle.setAnimation(_object, ANIMATION_TYPE.unselected, null);
                }
                // 5. unselected the object
                _this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.unselected, null);
                if (min_idx != i) {
                    _this.swapTwoObjects(i, min_idx);
                    _this.animateStackHandle.setAnimation(_this.listObject[i], ANIMATION_TYPE.swapPosition, _this.listObject[min_idx]);
                    _this.animateStackHandle.setAnimation(_this.listObject[i], ANIMATION_TYPE.finished, null);
                }
                else {
                    _this.animateStackHandle.setAnimation(_this.listObject[i], ANIMATION_TYPE.finished, null);
                }
                _this.showCurrentData(i);
            }
            _this.animateStackHandle.setAnimation(_this.listObject[_this.listObject.length - 1], ANIMATION_TYPE.finished, null);
            _this.animateStackHandle.playListAnimate(_this.numberCompare, _this.numberSwap);
        };
        return _this;
    }
    return SelectionSort;
}(SortArrayData));
/*
*
* Giai thuat nay trinh bay nhu sau :
*
* Ta se duyet tu dau day den cuoi day, ta se so sanh 2 phan tu ke nhau va swap no de gia tri lon nhat ra sau.
* */
var BubbleSort = /** @class */ (function (_super) {
    __extends(BubbleSort, _super);
    function BubbleSort(paper) {
        var _this = _super.call(this, paper) || this;
        _this.sortArray = function () {
            for (var i = 0; i < _this.listObject.length - 1; i++) {
                for (var j = 0; j < _this.listObject.length - i - 1; j++) {
                    _this.animateStackHandle.setAnimation(_this.listObject[j], ANIMATION_TYPE.compareTo, _this.listObject[j + 1]);
                    // if  current > next object == swap ;
                    if (_this.compareTwoObjects(_this.listObject[j], _this.listObject[j + 1]) > 0) {
                        _this.swapTwoObjects(j, j + 1);
                        _this.animateStackHandle.setAnimation(_this.listObject[j], ANIMATION_TYPE.swapPosition, _this.listObject[j + 1]);
                    }
                }
                _this.showCurrentData(i);
                _this.animateStackHandle.setAnimation(_this.listObject[_this.listObject.length - i - 1], ANIMATION_TYPE.finished, null);
            }
            _this.animateStackHandle.setAnimation(_this.listObject[0], ANIMATION_TYPE.finished, null);
            _this.animateStackHandle.playListAnimate(_this.numberCompare, _this.numberSwap);
        };
        return _this;
    }
    return BubbleSort;
}(SortArrayData));
