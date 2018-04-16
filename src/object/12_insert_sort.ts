/*
*
* Giai thuat nay trinh bay nhu sau :
*
* Copy vi thay cai naay kha thu vi
* Sắp xếp chèn (insertion sort) là một thuật toán sắp xếp bắt chước cách sắp xếp quân bài của những người chơi bài.
* Muốn sắp một bộ bài theo trật tự người chơi bài rút lần lượt từ quân thứ 2, so với các quân đứng trước nó để chèn
 * vào vị trí thích hợp.
* */

class InsertSort extends SortArrayData{
    constructor(paper) {
        super(paper);
    }

    sortArray = () => {
        for (let i = 1; i < this.listObject.length; i++) {
            let j = i - 1;
            let current = this.listObject[i];
            while (j >= 0 && this.compareTwoObjects(this.listObject[i], this.listObject[j]) < 0) {
                this.listObject[j + 1] = this.listObject[j];
                j--;
            }

            this.listObject[j + 1] = current;

            this.showCurrentData(i);
        }
    }

}