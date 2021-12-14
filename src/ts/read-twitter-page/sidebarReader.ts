const isHomeSidebar = () => {
  const sugHome = document.getElementsByClassName('sug_home');
  if (sugHome.length > 0) {
    if (sugHome[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};
const isFloatSidebar = () => {
  const sugCompose = document.getElementsByClassName('sug_compose');
  if (sugCompose.length > 0) {
    if (sugCompose[0].children.length > 0) {
      return true;
    }
  } else {
    return false;
  }
  return false;
};

export function isSidebar(mode) {
  switch (mode) {
    case 'home':
      return document.getElementsByClassName('sug_home').length > 0;
    case 'compose':
      return isFloatSidebar();
    default:
      return false;
  }
}
