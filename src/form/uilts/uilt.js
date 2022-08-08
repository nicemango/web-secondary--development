const formatFn = (headerData, bodyData) => {
    // console.log(headerData);
    let tableData = bodyData.map(x => {
        let ret = {};
        x.forEach((item, index) => {
            ret[headerData[index].col_name] = item;
        });
        return ret
    })
    return tableData
}

export default formatFn;
