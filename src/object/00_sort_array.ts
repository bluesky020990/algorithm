let RaphaelJs = null;

interface IPoint {
    cx: number,
    cy: number,
    value: number,
    object: any,

    compareTo: (IPoint) => number,
    swapPosition: (IPoint) => void,
    move: (dx: number, dy: number) => void,
    updatePosition: (cx, cy) => void,


    isSelected: () => boolean,
    selected: () => void,
    unselected: () => void,
    adjustPosition: () => void,


}

class ArrayPoint implements IPoint {
    cx: number;
    cy: number;
    value: number;
    object: any;
    label: any;
    izSelected: boolean;

    constructor(cx, cy, value, paper) {
        this.cx = cx;
        this.cy = cy;
        this.value = value;
        this.object = paper.circle(this.cx, this.cy, 20).attr({"fill": "red", "stroke": "#000", "stroke-width": 1});
        this.label = paper.text(this.cx, this.cy, this.value).attr({"font-size": 16});
        this.izSelected = false;
    }

    compareTo = function (point: ArrayPoint) {
        return this.value - point.value;
    };

    swapPosition = function (point: ArrayPoint) {
        var temp = {cx: this.cx, cy: this.cy};
        this.updatePosition(point.cx, point.cy);
        point.updatePosition(temp.cx, temp.cy);
    };

    updatePosition = (cx, cy) => {
        this.cx = cx;
        this.cy = cy;
        this.adjustPosition();
    };

    move = (dx, dy) => {
        this.object.transform("t" + dx + "," + dy);
    };


    isSelected = () => {
        return this.izSelected;
    };

    selected = () => {
        this.object.attr("opacity", 0.7);
        this.izSelected = true;
    };

    unselected = () => {
        this.object.attr("opacity", 1);
        this.izSelected = false;
    };

    adjustPosition = () => {
        let animation = RaphaelJs.animation({'cx': this.cx, 'cy': this.cy}, 1000, "easeInOut", function(){

        });

        let animationLabel = RaphaelJs.animation({'x': this.cx, 'y': this.cy}, 1000, "easeInOut", function (){

        });

        this.object.animate(animation);
        this.label.animate(animationLabel);
        //
        // this.object.attr("cx", this.cx);
        // this.object.attr("cy", this.cy);
        // this.label.attr("x", this.cx);
        // this.label.attr("y", this.cy);
    };
}


interface ISortArray {
    totalNumber: number;
    isDuplicated: boolean;
    range: { min: number, max: number, step: number };
    listObject: IPoint[];

    createArray: (totalItem: number, isDuplicated: boolean, range) => void;
    sortArray: () => void;
}

class SortArrayData implements ISortArray {
    totalNumber: number;
    isDuplicated: boolean;
    range: { min: number; max: number; step: number };
    listObject: IPoint[];

    paper: any;

    constructor(paper) {
        this.paper = paper;
    }

    createArray = (totalItem: number, isDuplicated: boolean, range) => {
        let objectArray = new Array();

        if (range == null) range = {min: 1, max: totalItem, step: 1};

        if (isDuplicated) {
            for (let i = range.min; i <= range.max; i++) {
                let currentValue = this.randomBetweenTwoNumber(range.min, range.max);
                objectArray.push(currentValue);
            }
        } else {
            let temp_array = new Array();

            for (let i = range.min; i <= range.max; i++) {
                temp_array.push(i);
            }

            let total_item = temp_array.length;
            for (let i = 0; i < total_item; i++) {
                let randomIndex = this.randomBetweenTwoNumber(0, temp_array.length - 1);
                objectArray.push(temp_array[randomIndex]);
                temp_array.splice(randomIndex, 1);
            }
        }

        this.createObjectArray(objectArray);
    };

    createObjectArray = (objectArray: number[]) => {
        let _listObject = new Array();

        let padding = {x: 30, y: 50};
        let begin_cx = padding.x;
        let begin_cy = 50;
        let unit_range = (this.paper.width - (padding.x * 2)) / objectArray.length;

        for (let value of objectArray) {
            let object = new ArrayPoint(begin_cx, begin_cy, value, this.paper);
            _listObject.push(object);
            begin_cx += unit_range;
        }

        this.listObject = _listObject;
    };

    sortArray = () => {
        // let implement do it
    };

    randomBetweenTwoNumber = (begin, end) => {
        return begin + Math.floor(Math.random() * (end - begin))
    }
}


class SortArrayFactory {
    getObject = (type: string, paper) => {
        if (type == "SELECTION_SORT") {
            return new SelectionSort(paper)
        } else {
            return new SortArrayData(paper);
        }
    }
}


class SelectionSort extends SortArrayData{
    sortArray = () => {
        // One by one move boundary of unsorted subarray
        for (let i = 0; i < this.listObject.length - 1; i++) {
            console.log("check index : " + i);
            let current_object = this.listObject[i];

            let min_idx = i;
            let min_object = current_object;

            for (let j = i + 1; j < this.listObject.length; j++) {
                let _object = this.listObject[j];

                if(min_object.compareTo(_object) > 0){
                    min_idx = j;
                    min_object = _object;
                }
            }

            if(min_idx != i){
                let target_object  = this.listObject[min_idx];
                current_object.swapPosition(target_object);

                this.listObject[i] = target_object;
                this.listObject[min_idx] = current_object;
            }
        }
    }
}

function triggerSortEvent(raphael, sortType, paper, ...params) {
    RaphaelJs = raphael;

    let totalNumber = params[0];
    let sortArrayFactory = new SortArrayFactory();
    let arrayObject = sortArrayFactory.getObject(sortType, paper);
    arrayObject.createArray(totalNumber, false, null);
    return arrayObject;
}