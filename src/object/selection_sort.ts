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
