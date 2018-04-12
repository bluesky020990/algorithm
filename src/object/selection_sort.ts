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

                if(min_object.compareTo(_object) > 0){

                    // 3. compare the object with other
                    this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.selected, _object);

                    min_idx = j;
                    min_object = _object;
                }

                //4. unselected the object and find next
                this.animateStackHandle.setAnimation(_object, ANIMATION_TYPE.unselected, null);
            }

            // 5. unselected the object
            this.animateStackHandle.setAnimation(min_object, ANIMATION_TYPE.unselected, null);

            if(min_idx != i){
                let target_object  = this.listObject[min_idx];

                // swap position for object
                this.animateStackHandle.setAnimation(current_object, ANIMATION_TYPE.swapPosition, target_object);

                current_object.swapPosition(target_object);

                this.listObject[i] = target_object;
                this.listObject[min_idx] = current_object;
            }
        }

        this.animateStackHandle.playListAnimate();
    }
}
