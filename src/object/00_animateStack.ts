const ANIMATION_TIME = 100;

enum ANIMATION_TYPE {
    selected = "SELECTED",
    unselected = "UNSELECTED",
    transform = "TRANSFORM",
    rotate = "ROTATE",
    compareTo = "COMPARE_TO",
    swapPosition = "SWAP"
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
        this.listAnimate.push([animates]);
    };

    setAnimation = (object: IPoint, action, target : IPoint) => {
        let listAnimate = [];

        if(action == ANIMATION_TYPE.selected){
            let animation = this.generateAnimate({opacity: 0.6}, "ease-out", null, object);
            listAnimate.push(animation);

        } else if (action == ANIMATION_TYPE.unselected){
            let animation = this.generateAnimate({opacity: 1}, "ease-out", null, object);
            listAnimate.push(animation);

        } else if (action == ANIMATION_TYPE.swapPosition){
            let swapPosition = object.getSwapPosition(target);

            let animation1 = this.generateAnimate(swapPosition.focus, "ease-out", null, object);
            let animation2 = this.generateAnimate(swapPosition.target, "ease-out", null, target);

            listAnimate.push(animation1);
            listAnimate.push(animation2);

        } else if(action == ANIMATION_TYPE.compareTo){
            
        }

        this.addListAnimate(listAnimate);
    };

    playListAnimate = () =>{
        let currentCallBackFunc = null;
        for(let i = this.listAnimate.length - 1; i >= 0; i --){
            let animateData = this.listAnimate[i];

            if(i > 0){
                currentCallBackFunc = this.generateCallBackFunction (animateData, currentCallBackFunc);
            } else {
                console.log(currentCallBackFunc);
                this.playAnimate(animateData, currentCallBackFunc);
            }
        }
    };

    playAnimate = (animateData, callBackFunc) => {
        animateData.object.animate(animateData.properties, animateData.type, ANIMATION_TIME, callBackFunc);
    };

    generateCallBackFunction = (animateData, callBackFunc) => {
        if(callBackFunc == null){
            return () => {
                let raphael_animation = RaphaelJs.animation(animateData.properties, ANIMATION_TIME, animateData.type);
                return animateData.object.animate(raphael_animation);
            }
        } else {
            return ()=> {
                let raphael_animation = RaphaelJs.animation(animateData.properties, ANIMATION_TIME, animateData.type, callBackFunc);
                return animateData.object.animate(raphael_animation);
            }
        }
    };


    generateAnimate = (properties, type, time, object) =>{
        return {
            properties, type, time, object
        }
    }
}

