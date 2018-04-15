const ANIMATION_TIME = 50;

enum ANIMATION_TYPE {
    selected = "SELECTED",
    unselected = "UNSELECTED",
    transform = "TRANSFORM",
    rotate = "ROTATE",
    compareTo = "COMPARE_TO",
    swapPosition = "SWAP",
    finished = "FINISHED"
}

interface IAnimateStackData {
    properties : {},
    type : string,
    time : number, // ms,
    object : any
}



class AnimateStackHandle {
    listAnimate = new Array();

    addListAnimate = (animates : IAnimateStackData[]) => {
        this.listAnimate= this.listAnimate.concat(animates);
    };

    setAnimation = (object: IPoint, action, target : IPoint) => {
        let listAnimate = [];
        let animation = this.generateAnimateData(action, object, target, action == ANIMATION_TYPE.swapPosition ? 400 : null);
        listAnimate.push(animation);
        this.addListAnimate(listAnimate);
    };

    playListAnimate = () =>{
        let currentCallBackFunc = null;
        for(let i = this.listAnimate.length - 1; i >= 0; i --){
            let animateData = this.listAnimate[i];
            if(i > 0){
                currentCallBackFunc = this.generateCallBackFunction (animateData, currentCallBackFunc);
            } else {
                this.playAnimate(animateData, currentCallBackFunc);
            }
        }
    };

    playAnimate = (animateData, callBackFunc) => {
        let object = animateData.object.getRepresentObject();
        let label = animateData.object.getRepresentLabel();

        let properties = this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);

        object.animate(properties.objectProperties, animateData.type, animateData.time, ()=>{
            label.attr(properties.labelProperties);
            callBackFunc();
        });
    };

    generateCallBackFunction = (animateData, callBackFunc) => {
        let object = animateData.object.getRepresentObject();
        let target = animateData.target != null ? animateData.target.getRepresentObject() : null;

        let label = animateData.object.getRepresentLabel();
        let targetLabel = animateData.target != null ? animateData.target.getRepresentLabel() : null;

        return ()=> {
            if (animateData.animationType == ANIMATION_TYPE.swapPosition){
                let focus_properties = this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);
                let target_properties = this.generateAnimationProperties(animateData.animationType, animateData.target, animateData.object);

                let object_animation = RaphaelJs.animation(focus_properties.objectProperties, animateData.time, animateData.type, () => {
                    label.attr(focus_properties.labelProperties);

                    if(callBackFunc != null){
                        callBackFunc();
                    }
                });

                let target_animation = RaphaelJs.animation(target_properties.objectProperties, animateData.time, animateData.type, () => {
                    targetLabel.attr(target_properties.labelProperties);
                });

                object.animate(object_animation);
                target.animate(target_animation);
            } else {
                let properties = this.generateAnimationProperties(animateData.animationType, animateData.object, animateData.target);
                let raphael_animation = RaphaelJs.animation(properties.objectProperties, animateData.time, animateData.type, () => {
                    label.attr(properties.labelProperties);

                    if(callBackFunc != null){
                        callBackFunc();
                    }
                });

                object.animate(raphael_animation);
            }
        }
    };

    generateAnimateData = (animationType : string, object: IPoint, target : IPoint, time : number) =>{
        return {
            animationType, object, target, type : "ease-out", time : time == null ? ANIMATION_TIME : time
        }
    };

    generateAnimationProperties = (action, object, target) => {
        let properties = null;
        let objectType = object.objectType;

        if(action == ANIMATION_TYPE.selected){
            properties = this.generatePropertiesData ({opacity: 0.6}, {opacity: 0.6});

        } else if (action == ANIMATION_TYPE.unselected){
            properties = this.generatePropertiesData ({opacity: 1}, {opacity: 1});

        } else if (action == ANIMATION_TYPE.swapPosition){
            if(objectType == "circle"){
                let objectProperties = {cx : target.getRepresentObject().attr("cx"), cy : target.getRepresentObject().attr("cy")};
                let labelProperties =  {x : target.getRepresentLabel().attr("x"), y : target.getRepresentLabel().attr("y")};

                properties = this.generatePropertiesData (objectProperties, labelProperties);
            } else {
                let objectProperties = {x : target.getRepresentObject().attr("x"), y : target.getRepresentObject().attr("y")};
                let labelProperties =  {x : target.getRepresentLabel().attr("x"), y : target.getRepresentLabel().attr("y")};

                properties = this.generatePropertiesData (objectProperties, labelProperties);
            }

        } else if(action == ANIMATION_TYPE.compareTo){
            properties = this.generatePropertiesData ({opacity: 1}, {opacity: 1});

        } else if(action == ANIMATION_TYPE.finished){
            properties = this.generatePropertiesData ({fill: COLOR_ARRAY.blue, transform: "t" + "0" + "," + 120}, {fill: COLOR_ARRAY.white, transform: "t" + "0" + "," + 120});
        }

        return properties;
    };

    generatePropertiesData = (objectProperties, labelProperties) => {
        return {objectProperties, labelProperties}
    };
};

