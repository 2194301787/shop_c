import {
  menuMenuList,
  componentHomePage,
  componentPage,
  componentFootList,
  componentFootText,
  componentPageUrl,
  componentFootPage,
  componentTextSize,
  componentMenuPreviewList,
} from './index';
import { post } from './request';

const langEn = { lang: 'en_US' };

const getMenuMenuList = (data = {}) => {
  return post(menuMenuList, {
    ...langEn,
    ...data,
  });
};

const getComponentHomePage = (data = {}) => {
  return post(componentHomePage, {
    ...langEn,
    ...data,
  });
};

const getComponentPage = (data = {}) => {
  return post(componentPage, {
    ...langEn,
    ...data,
  });
};

const getComponentFootList = (data = {}) => {
  return post(componentFootList, {
    ...langEn,
    ...data,
  });
};

const getComponentFootText = (data = {}) => {
  return post(componentFootText, {
    ...langEn,
    ...data,
  });
};

const getComponentPageUrl = (data = {}) => {
  return post(componentPageUrl, {
    ...langEn,
    ...data,
  });
};

const getComponentFootPage = (data = {}) => {
  return post(componentFootPage, {
    ...langEn,
    ...data,
  });
};

const getComponentTextSize = (data = {}) => {
  return post(componentTextSize, {
    ...langEn,
    ...data,
  });
};

const getComponentFootPageDetail = (data = {}) => {
  return post(`${componentFootPage}/${data.title}`, {
    ...langEn,
  });
};

const getComponentMenuPreviewList = (data = {}) => {
  return post(componentMenuPreviewList, {
    ...langEn,
    ...data,
  });
};

export {
  getMenuMenuList,
  getComponentHomePage,
  getComponentPage,
  getComponentFootList,
  getComponentFootText,
  getComponentPageUrl,
  getComponentFootPage,
  getComponentTextSize,
  getComponentFootPageDetail,
  getComponentMenuPreviewList,
};
