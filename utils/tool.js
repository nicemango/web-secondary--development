export default {
    /**
     * 将平台返回数据转化为对象数组的形式
     * @param {Array} originTableData 平台接口查询回来的数据
     * @returns {Array} 返回对象数组 形如[{name:"小红",age:23},{name:"小刚",age:23}]
     */
    translatePlatformDataToJsonArray(originTableData) {
        let originTableHeader = originTableData.data[0];
        let tableHeader = [];
        originTableHeader.forEach((item) => {
            tableHeader.push(item.col_name);
        });
        let tableBody = originTableData.data[1];
        let tableData = [];
        tableBody.forEach((tableItem) => {
            let temp = {};
            tableItem.forEach((item, index) => {
                temp[tableHeader[index]] = item;
            });
            tableData.push(temp);
        });
        return tableData;
    },
    /**
     * 判断两个数组是否包含相同的元素
     * @param {Array} arr1 
     * @param {Array} arr2 
     * @returns {Boolean}
     */
    arrayContainsSame: function (arr1, arr2) {
        let result = arr1.concat(arr2)
        let set = new Set(result);
        if (set.size == result.length) {
            return false;
        }
        return true;
    },
}