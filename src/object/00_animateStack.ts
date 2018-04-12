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

    addAnimate = (animate : IAnimateStackData) => {
        this.listAnimate.push(animate);
    };

    setAnimation = (object, action, target) => {

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

