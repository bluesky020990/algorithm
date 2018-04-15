let RaphaelJs = null;

interface IPoint {
    value: number;
    objectType : string;

    compareTo: (IPoint) => number,
    swapPosition: (IPoint) => void,
    getSwapPosition: (IPoint) => any,

    move: (dx: number, dy: number) => void,
    updatePosition: (cx, cy) => void,

    isSelected: () => boolean,
    selected: () => void,
    unselected: () => void,
    getRepresentObject: () => {},
}

class AbstractArrayPoint {
    paper: any;
    value: number;
    objectType : string;
    object: IObjectRepresent;
    label: IObjectRepresent;
    izSelected: boolean;

    constructor(paper: any, objectType) {
        this.paper = paper;
        this.objectType = objectType;
    }
}

class ArrayPoint extends AbstractArrayPoint implements IPoint {
    constructor(paper, value, objectType, position) {
        super(paper, objectType);

        if (objectType == "circle") {
            let object_param = ObjectRepresentFactory.getCircleRepresentObjectParam(paper, position.cx, position.cy, 20, COLOR_ARRAY.red);
            this.object = ObjectRepresentFactory.getRepresentObjectByType(objectType, object_param);

            let label_param = ObjectRepresentFactory.getTextRepresentObjectParam(paper, position.cx, position.cy, value, COLOR_ARRAY.white);
            this.label = ObjectRepresentFactory.getRepresentObjectByType("label", label_param);

        } else {
            let object_param = ObjectRepresentFactory.getCircleRepresentObjectParam(paper, position.cx, position.cy, 20, COLOR_ARRAY.red);
            this.object = ObjectRepresentFactory.getRepresentObjectByType(objectType, object_param);

            let object_label  = [paper, position.cx, position.cy, 20, value, COLOR_ARRAY.white, COLOR_ARRAY.white];
            this.label = ObjectRepresentFactory.getRepresentObjectByType("label", object_label)
        }

        this.value = value;
        this.izSelected = false;
    }

    getSwapPosition = (target: ArrayPoint) => {
        return this.object.getSwapPosition(target.object);
    };

    getRepresentObject = () => {
        return this.object.getRepresentObject();
    };

    getRepresentLabel = () => {
        return this.label.getRepresentObject();
    };

    compareTo = (point: ArrayPoint) => {
        return this.value - point.value;
    };

    swapPosition = (point: ArrayPoint) => {
        this.object.swapPosition(point.object);
    };

    updatePosition = (position) => {
        this.object.updatePosition(position)
    };

    move = (dx, dy) => {
        this.object.transform(dx, dy);
    };

    isSelected = () => {
        return this.izSelected;
    };

    selected = () => {
        this.object.selected();
        this.izSelected = true;
    };

    unselected = () => {
        this.object.unselected();
        this.izSelected = false;
    };
}


interface ISortArray {
    listObject: IPoint[];
    createArray: (totalItem: number, isDuplicated: boolean, range) => void;
    sortArray: () => void;
}

interface ArrayRange {
    min: number,
    max: number,
    step: number
}


class SortArrayData implements ISortArray {
    numberCompare = 0;
    numberSwap = 0;

    animateStackHandle: AnimateStackHandle;
    listObject: IPoint[];
    paper: any;

    constructor(paper) {
        this.paper = paper;
        this.animateStackHandle = new AnimateStackHandle();
    }

    createArray = (totalItem: number, isDuplicated: boolean, range) => {
        if (range == null) range = {min: 1, max: totalItem, step: 1};

        let objectArray;
        if (isDuplicated) {
            objectArray = this.createDuplicatedArray(range);
        } else {
            objectArray = this.createUniqueArray(range);
        }

        this.renderListObject(objectArray);
    };

    createDuplicatedArray = (range: ArrayRange) => {
        let objectArray = new Array();
        for (let i = range.min; i <= range.max; i++) {
            let currentValue = this.randomBetweenTwoNumber(range.min, range.max);
            objectArray.push(currentValue);
        }
        return objectArray;
    };

    createUniqueArray = (range: ArrayRange) => {
        let temp_array = new Array();

        for (let i = range.min; i <= range.max; i++) {
            temp_array.push(i);
        }

        let objectArray = new Array();
        let total_item = temp_array.length;

        for (let i = 0; i < total_item; i++) {
            let randomIndex = this.randomBetweenTwoNumber(0, temp_array.length - 1);
            objectArray.push(temp_array[randomIndex]);
            temp_array.splice(randomIndex, 1);
        }

        return objectArray;
    };

    renderListObject = (objectArray: number[]) => {
        let _listObject = new Array();

        let padding = {x: 30, y: 50};
        let begin_cx = padding.x;
        let begin_cy = 50;
        let unit_range = (this.paper.width - (padding.x * 2)) / objectArray.length;

        for (let value of objectArray) {
            let object = new ArrayPoint(this.paper, value, "circle", {cx: begin_cx, cy: begin_cy});

            _listObject.push(object);
            begin_cx += unit_range;
        }

        this.listObject = _listObject;
    };


    // if object > target point : return  > 0 else return < 0;
    compareTwoObjects =  (object : IPoint, target: IPoint) => {
        this.numberCompare += 1;
        return object.compareTo(target);
    };

    swapTwoObjects =  (objectIndex : number, targetIndex: number) => {
        this.numberSwap += 1;

        let object = this.listObject[objectIndex];
        let target  = this.listObject[targetIndex];

        // swap position for object
        this.listObject[targetIndex] = object;
        this.listObject[objectIndex] = target;
    };

    showCurrentData = (index) =>{
        let message = new Array();
        for(let i = 0; i < this.listObject.length; i++){
            message.push(" " + this.listObject[i].value + " ");

            if(i == index){
                message.push(" | ");
            }
        }
        console.log(message.join(""));
    };

    sortArray = () => {
        // let implement do it
    };

    randomBetweenTwoNumber = (begin, end) => {
        return begin + Math.floor(Math.random() * (end - begin))
    }
}

enum SORT_TYPE {
    SelectionSort = "SELECTION_SORT",
    BubbleSort = "BUBBLE_SORT"
}

class SortArrayFactory {
    getObject = (paper, type: string) => {
        switch (type){
            case SORT_TYPE.SelectionSort : return new SelectionSort(paper);
            case SORT_TYPE.BubbleSort    : return new BubbleSort(paper);

            default : return new SortArrayData(paper);
        }
    }
}


function triggerSortEvent(raphael, paper, sortType, ...params) {
    RaphaelJs = raphael;
    let totalNumber = params[0];
    let sortArrayFactory = new SortArrayFactory();
    let arrayObject = sortArrayFactory.getObject(paper, sortType);
    arrayObject.createArray(totalNumber, false, null);
    return arrayObject;
}