/*
*
* Giai thuat nay trinh bay nhu sau :
*
* Ta se duyet qua tung phan tu cua day va so sanh no voi phan con lai. Neu ma co mot gia tri nao do ton tai ma no nho hon
* gia tri hien tai thi ta swap gia tri dau tien cho no.
* */

class SelectionSort extends SortArrayData{
    constructor(paper) {
        super(paper);
    }

    sortArray = () => {
        // One by one move boundary of unsorted subarray

        for (let i = 0; i < this.listObject.length - 1; i++) {
            let current_object = this.listObject[i];
            let min_idx = i;

            //1. selected the object
            let min_object = current_object;
            this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.selected, null);

            for (let j = i + 1; j < this.listObject.length; j++) {
                let _object = this.listObject[j];

                //2. selected the current object
                this.animateStackHandle.setAnimation(_object, ANIMATION_TYPE.selected, null);

                if(this.compareTwoObjects(min_object, _object) > 0){
                    // 3. compare the object with other
                    this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.compareTo, _object);

                    min_idx = j;
                    min_object = _object;
                }

                //4. unselected the object and find next
                this.animateStackHandle.setAnimation(_object, ANIMATION_TYPE.unselected, null);
            }

            // 5. unselected the object
            this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.unselected, null);

            if(min_idx != i){
                this.swapTwoObjects(i, min_idx);
                this.animateStackHandle.setAnimation(this.listObject[i], ANIMATION_TYPE.swapPosition, this.listObject[min_idx]);
                this.animateStackHandle.setAnimation(this.listObject[i], ANIMATION_TYPE.finished, null);
            } else {
                this.animateStackHandle.setAnimation(this.listObject[i], ANIMATION_TYPE.finished, null);
            }

            this.showCurrentData(i);
        }

        this.animateStackHandle.setAnimation(this.listObject[this.listObject.length - 1], ANIMATION_TYPE.finished, null);

        this.animateStackHandle.playListAnimate(this.numberCompare, this.numberSwap);


    }
}
