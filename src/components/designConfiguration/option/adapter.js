import {
  OPTION_DATA_TYPE,
  OPTION_SHOW_LABEL__SHOW,
  OPTION_SHOW_PIC__SHOW,
  OPTION_SHOW_TYPE__ENABLED,
} from '@/data-form/form/common/constants/config-values';
const fromServer = component => {
  const {
    columnStyle,
    form_id,
    modelId,
    columnMappingList = [],
    columnLinkDetailList = [],
    columnRequiredDetailList = [],
    mapping_associated,
  } = component;
  const {
    option_type,
    show_flag,
    option_value,
    show_other_option,
    word_limit,
    option_dict,
    option_show_type,
    option_show_dict_pic,
    option_dict_name,
    show_icon,
    option_asset_id,
    option_asset_name,
    option_asset_param,
    option_key_column,
    option_key_column_data_type,
    option_value_column,
    option_parent_column,
    option_asset_show_columns,
    option_value_column_data_type,
    key_column_unique,
    can_add,
    can_edit,
    preview_show_by_hyperlink,
    option_sorts,
    add_form_id,
    ext_form_info,
    columnLinkClearDataFlag,
    relationList,
  } = columnStyle;

  const optionType = option_type;

  const result = {
    _name: '数据选项',
    optionType, // 数据选项类型 "1"|"3"|"4"
    columnMappingList, // 数据绑定映射
    columnLinkDetailList, // 选项关联组件显示
    columnLinkClearDataFlag, // 隐藏时清空数据
    columnRequiredDetailList, // 选项关联组件必填
    mappingAssociated: mapping_associated, // 数据绑定？
    relationList: relationList && JSON.parse(relationList), // 把本组件作为数据条件的其他组件
    options: option_value, // 选项列表
  };

  if (optionType === OPTION_DATA_TYPE.STATIC) {
    Object.assign(result, {
      showLabel: show_flag === OPTION_SHOW_LABEL__SHOW, // 显示标签 "0"|"1"
      showOtherOption: show_other_option, // 其他选项：会在下拉选项底部增加一项：其他选项
      maxLength: word_limit, // 其他选项文本输入字数限制
    });
  }

  if (optionType === OPTION_DATA_TYPE.DICTIONARY) {
    Object.assign(result, {
      dictSaveLabel: option_show_type === OPTION_SHOW_TYPE__ENABLED, // 打开此选项时实际数据存储字典项名称，关闭此选项时实际数据存储字典项的值
      dictShowIcon: option_show_dict_pic === OPTION_SHOW_PIC__SHOW, // 显示图标
      dictShowIconOnly: show_icon, // 只显示图标
      dictId: option_dict, // 数据字典 ID
      dictName: option_dict_name, // 数据字典 名称
    });
  }

  if (optionType === OPTION_DATA_TYPE.ASSET) {
    let extFormInfo = {};
    if (ext_form_info) {
      extFormInfo = JSON.parse(ext_form_info);
    }
    Object.assign(result, {
      formId: form_id || modelId, // 表单 ID
      assetId: option_asset_id, // 资产 ID
      assetName: option_asset_name, // 资产名称
      filters: option_asset_param, // 数据条件
      valueColumn: option_key_column, // 存储字段
      valueColumnDataType: option_key_column_data_type, // 存储字段名称
      valueColumnUnique: key_column_unique, // 存储字段的值唯一
      labelColumn: option_value_column, // 显示字段
      labelColumnDataType: option_value_column_data_type, // 显示字段名称
      canAdd: can_add, // 允许直接新增
      canEdit: can_edit, // 允许直接编辑
      showLink: Boolean(preview_show_by_hyperlink), // 允许超链接查看
      sorts: option_sorts, // 排序条件
      addFormId: add_form_id,
      extFormInfo,
      // primaryKey: extFormInfo.primaryKey,
      parentColumnKey: option_parent_column, // 父节点展示字段
      optionAssetShowColumns: option_asset_show_columns, // 弹窗显示字段
    });
  }

  return result;
};

export { fromServer };
