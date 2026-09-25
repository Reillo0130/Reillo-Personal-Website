// 等待DOM文档结构完全加载完成后执行（无需等待图片等资源）
document.addEventListener('DOMContentLoaded', function() {
  // 获取可折叠容器的各个关键元素
  const container = document.querySelector('.collapsible-container'); // 整个可折叠容器
  const header = container.querySelector('.collapsible-header'); // 标题栏（点击触发折叠/展开）
  const content = container.querySelector('.collapsible-content'); // 内容区域（需要折叠/展开的部分）
  const triangle = container.querySelector('.triangle'); // 三角形指示器（用于显示展开/折叠状态）
  const chevron = container.querySelector('.chevron'); // 箭头图标（用于显示展开/折叠状态）
  
  // 给标题栏添加点击事件监听，触发折叠/展开逻辑
  header.addEventListener('click', () => {
    // 判断当前内容区域是否处于展开状态
    // 条件：内容区域的maxHeight不等于0px且有值（初始状态可能未设置，所以需要双重判断）
    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight;
    
    if (isExpanded) {
      // 若当前是展开状态，则执行折叠操作
      content.style.maxHeight = '0px'; // 将最大高度设为0，触发收缩动画
      content.style.opacity = '0'; // 透明度设为0，隐藏内容
      // 旋转指示器，恢复初始状态（三角形和箭头朝上）
      triangle.style.transform = 'rotate(0deg)';
      chevron.style.transform = 'rotate(0deg)';
    } else {
      // 若当前是折叠状态，则执行展开操作
      // 先获取内容区域的实际高度（scrollHeight包含所有内容高度），再设置为maxHeight触发展开动画
      content.style.maxHeight = content.scrollHeight + 'px';
      content.style.opacity = '1'; // 透明度设为1，显示内容
      // 旋转指示器，切换为展开状态（三角形和箭头朝下）
      triangle.style.transform = 'rotate(180deg)';
      chevron.style.transform = 'rotate(180deg)';
    }
  });
});