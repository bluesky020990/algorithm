interface IObjectRepresent {
    getRepresentObject : () => any;
    getBBox : () => {};
    transform: (dx: number, dy: number) => void;
    selected: () => void;
    unselected: () => void;

    swapPosition : (target : IObjectRepresent) => void;
    getSwapPosition : (target) => {};
    updatePosition: (position: {}) => void;

    compareToAnimation: (IObjectRepresent) => void;
    adjustPositionAnimation: (position: {}) => void;
    validateRepresent : () => void;
}

class AbstractObjectRepresent {
    paper: any;
    object: any;

    getBBox = () => {
        return this.object._getBBox();
    };

    transform = (dx: number, dy: number) => {
        this.object.transform("t" + dx + "," + dy);
    };

    selected = () => {
        this.object.attr("opacity", 0.5);
    };

    unselected = () => {
        this.object.attr("opacity", 1);
    };

    getRepresentObject  = () =>{
        return this.object;
    };
}

class LabelObject extends AbstractObjectRepresent implements IObjectRepresent {
    constructor(params) {
        super();
        let [paper, cx, cy, label, color] = params;
        this.paper = paper;
        this.object = this.paper.text(cx, cy, label).attr({fill: color, 'font-size': 16});
    }

    swapPosition = (target) => {
        let objectBBox = this.object.getBBox();
        let targetBBox = target.object.getBBox();

        let object_position = {cx : targetBBox.x + targetBBox.width / 2, cy : targetBBox.y + targetBBox.height / 2};
        let target_position = {cx : objectBBox.x + objectBBox.width / 2, cy : objectBBox.y + objectBBox.height / 2};

        this.updatePosition(object_position);
        target.updatePosition(target_position);
    };

    getSwapPosition = (target) => {
        let objectBBox = this.object.getBBox();
        let targetBBox = target.object.getBBox();

        let object_position = {cx : targetBBox.x + targetBBox.width / 2, cy : targetBBox.y + targetBBox.height / 2};
        let target_position = {cx : objectBBox.x + objectBBox.width / 2, cy : objectBBox.y + objectBBox.height / 2};

        return {
            focus : object_position, target : target_position
        }
    };

    updatePosition = (position) => {
        this.object.attr("x", position.cx);
        this.object.attr("y", position.cy);

    };

    adjustPositionAnimation = (position) => {
        let animation = RaphaelJs.animation({'x': position.x, 'y': position.y}, 1000, "easeInOut",  () => {

        });

        this.object.animate(animation);
    };

    compareToAnimation = (_object) => {

    };

    validateRepresent = () => {

    }
}


class CircleObject extends AbstractObjectRepresent implements IObjectRepresent {
    constructor(params) {
        super();
        let [paper, cx, cy, radius, color] = params;
        this.paper = paper;
        this.object = this.paper.circle(cx, cy, radius).attr({fill: color, stroke: "#000", 'stroke-width': 1});
    }

    swapPosition = (target) => {
        let objectBBox = this.object.getBBox();
        let targetBBox = target.object.getBBox();

        let object_position = {cx : targetBBox.x + targetBBox.width / 2, cy : targetBBox.y + targetBBox.height / 2};
        let target_position = {cx : objectBBox.x + objectBBox.width / 2, cy : objectBBox.y + objectBBox.height / 2};

        this.updatePosition(object_position);
        target.updatePosition(target_position);
    };

    getSwapPosition = (target) => {
        let objectBBox = this.object.getBBox();
        let targetBBox = target.object.getBBox();

        let object_position = {cx : targetBBox.x + targetBBox.width / 2, cy : targetBBox.y + targetBBox.height / 2};
        let target_position = {cx : objectBBox.x + objectBBox.width / 2, cy : objectBBox.y + objectBBox.height / 2};

        return {
            focus : object_position, target : target_position
        }
    };

    updatePosition = (position) => {
        this.object.attr("cx", position.cx);
        this.object.attr("cy", position.cy);
    };

    adjustPositionAnimation = (position) => {
        let animation = RaphaelJs.animation({'cx': position.cx, 'cy': position.cy}, 1000, "easeInOut", () => {

        });

        this.object.animate(animation);
    };

    compareToAnimation = (_object) => {

    };

    validateRepresent = () => {

    }
}

class SquareObject extends AbstractObjectRepresent implements IObjectRepresent {
    constructor(...params) {
        super();
        let [paper, x, y, width, height, color] = params;
        this.paper = paper;
        this.object = paper.rect(x, y, width, height).attr({fill: color, stroke: "#000", 'stroke-width': 1});
    }

    swapPosition = (target) => {
        let objectBBox = this.getBBox();
        let targetBBox = target.getBBox();

        this.updatePosition(targetBBox);
        target.updatePosition(objectBBox);
    };

    getSwapPosition = (target) => {
        let objectBBox = this.getBBox();
        let targetBBox = target.getBBox();

        return {
            focus : objectBBox, target : targetBBox
        }
    };

    updatePosition = (position) => {
        let bBox = this.object._getBBox();
        this.object.attr("x", position.x);
        this.object.attr("y", position.y);
    };

    compareToAnimation = (_object) => {

    };

    adjustPositionAnimation = (position) => {
        let animation = RaphaelJs.animation({'x': position.x, 'y': position.y}, 1000, "easeInOut", function () {

        });

        this.object.animate(animation);
    };

    validateRepresent = () => {

    }
}


class ObjectRepresentFactory {
    static getRepresentObjectByType = (type: string, params) => {
        if (type == "circle") {
            return new CircleObject(params);
        } else if (type == "rect") {
            return new SquareObject(params);
        }  else if (type == "label") {
            return new LabelObject(params);
        }
    };

    static getCircleRepresentObjectParam = (paper, cx, cy, radius, color) => {
        return [paper, cx, cy, radius, color]
    };

    static getRectRepresentObjectParam = (paper, x, y, width, height, color) => {
        return [paper, x, y, width, height, color]
    };

    static getTextRepresentObjectParam = (paper, cx, cy, label, color) => {
        return [paper, cx, cy, label, color]
    };
}