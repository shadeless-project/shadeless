// Simple sdk
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB) {
  alert("Your browser doesn't support a stable version of IndexedDB. Please use new browser to use this service");
}
window.copyToClipboard = (str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
if (location.pathname === '/') location = '/projects';
window.formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  let month = (1 + dateObj.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = dateObj.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return day + '/' + month + '/' + year;
}
window.getUser = () => {
  const auth = localStorage.getItem('authorization') || '';
  try {
    const splitted = auth.split('.');
    if (splitted.length !== 3) return '';
    return JSON.parse(atob(splitted[1]));
  } catch (err) {
    return {};
  }
}
window.getUserRole = () => {
  const auth = localStorage.getItem('authorization') || '';
  try {
    const splitted = auth.split('.');
    if (splitted.length !== 3) return '';
    return JSON.parse(atob(splitted[1])).role;
  } catch (err) {
    return '';
  }
}
