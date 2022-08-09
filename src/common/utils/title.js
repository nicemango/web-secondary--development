import React from "react";
import { Tooltip } from "antd";
import styles from "../style/utils.module.less";

const getTitle = (title) => {
  const { label, hideTitle, hideTitleArea, isTitleWrap, wrapTitle } = title;
  const colon = ":";
  if (hideTitleArea) {
    return null;
  }
  if (hideTitle) {
    return <span className={styles.hide}>{label}</span>;
  }

  let wrapTitleList = wrapTitle ? JSON.parse(wrapTitle) : [];
  wrapTitleList = wrapTitleList.filter((v) => v);
  const len = wrapTitleList.length;
  if (isTitleWrap && len === 2) {
    return (
      <Tooltip title={label} className={styles.noWrap}>
        {wrapTitleList.map((t, i) => {
          return (
            <span key={i}>
              {t}
              {i === len - 1 && colon}
            </span>
          );
        })}
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={label}>
        <span className={styles.wrapLine}>
          <span>{`${label}${colon}`}</span>
        </span>
      </Tooltip>
    );
  }
};

const getChildTableTitle = (title) => {
  const { label, hideTitle, hideTitleArea } = title;

  if (hideTitleArea) {
    return null;
  }
  if (hideTitle) {
    return <span className={styles.hide}>{label}</span>;
  }
  return label;
};

export { getTitle, getChildTableTitle };
