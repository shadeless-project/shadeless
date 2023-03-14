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
  const user = JSON.parse(localStorage.getItem('account') || '{}');
  return user;
}
window.getUserRole = () => {
  const user = window.getUser();
  return user?.role;
}
window.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
window.escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
