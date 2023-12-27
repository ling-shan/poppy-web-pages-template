let pageName = '';

export function getPageName() {
  return pageName;
}

export function setPageName(value: string) {
  if (typeof value !== 'string') {
    pageName = ''
    return;
  }

  pageName = value;
}
