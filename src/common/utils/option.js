const getSelectId = (option, id) => {
  const { showOtherOption } = option;
  if (showOtherOption) {
    const selectId = `${id},下拉框`;
    const selectOtherOptionId = `${id},其他选项`;
    return [selectId, selectOtherOptionId];
  } else {
    return [id, undefined];
  }
};

export { getSelectId };
