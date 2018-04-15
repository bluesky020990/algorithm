/*
*
* Giai thuat nay trinh bay nhu sau :
*
* Ta se duyet tu dau day den cuoi day, ta se so sanh 2 phan tu ke nhau va swap no de gia tri lon nhat ra sau.
* */

class BubbleSort extends SortArrayData{
    constructor(paper) {
        super(paper);
    }

    sortArray = () => {
        for (let i = 0; i < this.listObject.length - 1; i++) {
            for (let j = 0; j < this.listObject.length - i - 1; j++) {
                this.animateStackHandle.setAnimation(this.listObject[j], ANIMATION_TYPE.compareTo, this.listObject[j + 1]);

                // if  current > next object == swap ;
                if (this.compareTwoObjects(this.listObject[j], this.listObject[j + 1])  > 0) {
                    this.swapTwoObjects(j, j + 1);
                    this.animateStackHandle.setAnimation(this.listObject[j], ANIMATION_TYPE.swapPosition, this.listObject[j + 1]);
                }
            }

            this.showCurrentData(i);

            this.animateStackHandle.setAnimation(this.listObject[this.listObject.length - i - 1], ANIMATION_TYPE.finished, null);
        }
        this.animateStackHandle.setAnimation(this.listObject[0], ANIMATION_TYPE.finished, null);


        this.animateStackHandle.playListAnimate(this.numberCompare, this.numberSwap);
    }

}