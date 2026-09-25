// 检查是否为首页，是则提示，否则跳转
function checkHomePage() {
  // 获取当前页面的路径（不含域名）
  const currentPath = window.location.pathname;
  
  // 首页常见路径（根据你的实际首页路径修改，如index.html、/ 等）
  const homePaths = ['/index.html'];
  
  // 判断当前页面是否是首页
  if (homePaths.includes(currentPath)) {
    // 显示“已经是主页”的提示
    alert('这已经是主页了');
    return false; // 阻止跳转
  } else {
    return true; // 允许跳转
  }
}
