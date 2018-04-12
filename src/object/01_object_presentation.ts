interface IObjectRepresent {
    getBBox : () => {};
    transform: (dx: number, dy: number) => void,
    selected: () => void,
    unselected: () => void,
    swapPosition : (target : IObjectRepresent) => void,
    updatePosition: (position: {}) => void,

    compareToAnimation: (IObjectRepresent) => void,
    adjustPositionAnimation: (position: {}) => void,
}

class AbstractObjectRepresent {
    paper: any;
    object: any;
    label: any;

    getBBox = () => {
        return this.object._getBBox();
    };

    transform = (dx: number, dy: number) => {
        this.object.transform("t" + dx + "," + dy);
        this.label.transform("t" + dx + "," + dy);
    };

    selected = () => {
        this.object.attr("opacity", 0.5);
        this.label.attr("opacity", 0.5);
    };

    unselected = () => {
        this.object.attr("opacity", 1);
        this.label.attr("opacity", 1);
    };
}


class CircleObject extends AbstractObjectRepresent implements IObjectRepresent {
    constructor(params) {
        super();
        let [paper, cx, cy, radius, value, color, labelColor] = params;
        this.paper = paper;

        let _object = this.paper.circle(cx, cy, radius).attr({fill: color, stroke: "#000", 'stroke-width': 1});
        let _label = this.paper.text(cx, cy, value).attr({fill: labelColor, 'font-size': 16});

        this.object = _object;
        this.label = _label;
    }

    swapPosition = (target) => {
        let objectBBox = this.getBBox();
        let targetBBox = target.getBBox();

        let object_position = {cx : targetBBox.x + targetBBox.width / 2, cy : targetBBox.y + targetBBox.height / 2};
        let target_position = {cx : objectBBox.x + objectBBox.width / 2, cy : objectBBox.y + objectBBox.height / 2};

        this.updatePosition(object_position);
        target.updatePosition(target_position);
    };

    updatePosition = (position) => {
        this.object.attr("cx", position.cx);
        this.object.attr("cy", position.cy);

        this.label.attr("x", position.cx);
        this.label.attr("y", position.cy);
    };

    compareToAnimation = (_object) => {

    };

    adjustPositionAnimation = (position) => {
        let animation = RaphaelJs.animation({'cx': position.cx, 'cy': position.cy}, 1000, "easeInOut", function () {

        });

        let animationLabel = RaphaelJs.animation({'x': position.cx, 'y': position.cy}, 1000, "easeInOut", function () {

        });

        this.object.animate(animation);
        this.label.animate(animationLabel);
    };
}

class SquareObject extends AbstractObjectRepresent implements IObjectRepresent {
    constructor(...params) {
        super();

        let [paper, x, y, width, height, value, color, labelColor] = params;
        this.paper = paper;

        let _object = paper.rect(x, y, width, height).attr({fill: color, stroke: "#000", 'stroke-width': 1});
        let _label = paper.text(x + width / 2, y + height + 20, value).attr({fill: labelColor, 'font-size': 16});

        this.object = _object;
        this.label = _label;
    }

    swapPosition = (target) => {
        let objectBBox = this.getBBox();
        let targetBBox = target.getBBox();

        this.updatePosition(targetBBox);
        target.updatePosition(objectBBox);
    };

    updatePosition = (position) => {
        let bBox = this.object._getBBox();
        this.object.attr("x", position.x);
        this.object.attr("y", position.y);

        this.label.attr("x", position.x + bBox.width / 2);
        this.label.attr("y", position.y + bBox.height + 20);
    };

    compareToAnimation = (_object) => {

    };

    adjustPositionAnimation = (position) => {
        let animation = RaphaelJs.animation({'x': position.x, 'y': position.y}, 1000, "easeInOut", function () {

        });

        let animationLabel = RaphaelJs.animation({'x': position.x, 'y': position.y}, 1000, "easeInOut", function () {

        });

        this.object.animate(animation);
        this.label.animate(animationLabel);
    };
}


class ObjectRepresentFactory {
    static getObjectPresent = (type: string, params) => {
        if (type == "circle") {
            return new CircleObject(params);
        } else if (type == "rect") {
            return new SquareObject(params);
        }
    }
}