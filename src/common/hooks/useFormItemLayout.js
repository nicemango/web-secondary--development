const useFormItemLayout = (labelAlignMode) => {
  switch (labelAlignMode) {
    case "left":
      return {
        labelAlign: "left",
        labelCol: { flex: "130px" },
      };
    case "right":
      return {
        labelAlign: "right",
        labelCol: { flex: "130px" },
      };
    case "top":
      return {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
      };
  }
};

export default useFormItemLayout;
