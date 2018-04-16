
enum SORT_TYPE {
    SelectionSort = "SELECTION_SORT",
    BubbleSort = "BUBBLE_SORT",
    InsertSort = "INSERT_SORT"
}

class SortArrayFactory {
    getObject = (paper, type: string) => {
        switch (type){
            case SORT_TYPE.SelectionSort : return new SelectionSort(paper);
            case SORT_TYPE.BubbleSort    : return new BubbleSort(paper);
            case SORT_TYPE.InsertSort    : return new InsertSort(paper);
            default : return new SortArrayData(paper);
        }
    }
}


function generateArrayData(raphael, paper) {
    let totalNumber = 20;
    let sortType = SORT_TYPE.SelectionSort;
    let isDuplicated = false;
    let range = null; // using default

    RaphaelJs = raphael;
    let sortArrayFactory = new SortArrayFactory();

    let arrayObject = sortArrayFactory.getObject(paper, sortType);
    arrayObject.createArray(totalNumber, isDuplicated, range);
    return arrayObject;
}