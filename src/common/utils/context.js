import jsonp from 'jsonp';

const APP_NAMES = {
  /**
   * intl.get('EVEN.CAN')
   */
  MEETING: 'MEETING',
  /**
   * OneMind{intl.get('EVEN.BDPAN')}
   */
  ONEMIND: 'ONEMIND',
  /**
   * intl.get('EVEN.LOTEAN')
   */
  UNKOWN: 'UNKOWN',
};

export const { origin, hostname } = window.location;

/**
 * intl.get('EVEN.DTCAATTDN')
 */
const currentApplication = (() => {
  if (hostname === 'www.meeting1010.com') {
    return APP_NAMES.MEETING;
  } else if (hostname === 's3.sdata1010.cn') {
    return APP_NAMES.ONEMIND;
  }
  return APP_NAMES.UNKOWN;
})();

export const meetingApiContextPath = `${
  location.protocol
}//www.meeting1010.com/`;
export const onemindApiContextPath = `${location.protocol}//s3.sdata1010.cn/`;

/**
 * intl.get('EVEN.DWIIACA')
 */
export function isMeetingApp() {
  return currentApplication === APP_NAMES.MEETING;
}

/**
 * 判断是否是OneMind{intl.get('APP.APPLICATION')}
 */
export function isOneMindApp() {
  return currentApplication === APP_NAMES.ONEMIND;
}

/**
 * 如果无法判断应用类型，{intl.get('APP.RETURN')}true
 */
export function isUnkownApp() {
  return currentApplication === APP_NAMES.UNKOWN;
}

export const routePrefix = PREFIX ? `/${PREFIX}` : '';

/**
 * apiintl.get('EVEN.CPF')
 */
export const apiContextPath = `${origin}${routePrefix}`;

export const originBaseUrl = `${origin}${routePrefix}/sdata/rest`;

export const baseUrl = `${routePrefix}/sdata/rest`;

/**
 * intl.get('APP.SIGN_IN')URL
 */
export const loginUrl = PREFIX ? `/${PREFIX}/login` : '/login';

/**
 * intl.get('EVEN.SYNCHRONOUS_LOGIN')Token
 */
export const syncToken = token => {
  if (isMeetingApp()) {
    jsonp(
      `${onemindApiContextPath}${baseUrl}/system/authority/setCookie?token=${token}`
    );
  } else if (isOneMindApp()) {
    jsonp(
      `${meetingApiContextPath}${baseUrl}/system/authority/setCookie?token=${token}`
    );
  }
};

/**
 * intl.get('EVEN.SYNCHRONOUS_LOGOUT')Token
 */
export const syncLogout = () => {
  if (isMeetingApp()) {
    jsonp(`${onemindApiContextPath}${baseUrl}/system/authority/logout`);
  } else if (isOneMindApp()) {
    jsonp(`${meetingApiContextPath}${baseUrl}/system/authority/logout`);
  }
};

export const imgServerContextPath =
  'https://sdata-s3-pictures.oss-cn-zhangjiakou.aliyuncs.com';

const imagePathFactory = type => (creator, id, t = Date.now()) =>
  isUnkownApp()
    ? `${apiContextPath}/storage_area/image/${type}_thumbnails/${creator}/${id}.png?t=${t}`
    : `${imgServerContextPath}/${type}-thumbnail/${creator}/${id}?t=${t}`;

export const ImagePaths = {
  bigscreen: imagePathFactory('bigscreen'),
  document: imagePathFactory('dashboard'),
  analyzer: imagePathFactory('analysis'),
};
