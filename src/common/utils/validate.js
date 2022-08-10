const Validate = {
  rules: (precision, min, max) => {
    return [
      {
        validator: (_, value) => {
          if (value === "" || value === undefined) {
            return Promise.resolve();
          } else {
            if (!/(^\-?[0-9]*$)|(^\-?[0-9]+\.[0-9]+$)/.test(value)) {
              return Promise.reject(new Error("请输入数字"));
            } else {
              if (
                Number(value) >= Number(min) &&
                Number(value) <= Number(max)
              ) {
                if (precision) {
                  const regExp =
                    precision === 0
                      ? /^\-?[0-9]+$/
                      : new RegExp(`^\-?[0-9]+\.?[0-9]{0,${precision}}$`);
                  if (regExp.test(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(`小数位数不能超过${precision}位`);
                  }
                }
              } else {
                return Promise.reject(`请输入${min}~${max}范围之内的数字`);
              }
            }
          }
        },
      },
    ];
  },
};

export default Validate;
