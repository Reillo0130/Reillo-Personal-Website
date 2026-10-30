// 等待DOM文档结构完全加载完成后执行（无需等待图片等资源）
document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.collapsible-container');

  containers.forEach((container) => {
    const header = container.querySelector('.collapsible-header');
    const content = container.querySelector('.collapsible-content');
    const triangle = container.querySelector('.triangle');
    const chevron = container.querySelector('.chevron');

    if (!header || !content || !triangle || !chevron) {
      return;
    }

    if (header.tagName !== 'BUTTON' && !header.hasAttribute('role')) {
      header.setAttribute('role', 'button');
    }
    if (header.tagName !== 'BUTTON' && !header.hasAttribute('tabindex')) {
      header.setAttribute('tabindex', '0');
    }
    if (!header.hasAttribute('aria-expanded')) {
      header.setAttribute('aria-expanded', content.style.maxHeight && content.style.maxHeight !== '0px' ? 'true' : 'false');
    }
    if (!header.hasAttribute('aria-controls') && content.id) {
      header.setAttribute('aria-controls', content.id);
    }

    const setExpanded = (isExpanded) => {
      content.style.maxHeight = isExpanded ? `${content.scrollHeight}px` : '0px';
      content.style.opacity = isExpanded ? '1' : '0';
      content.setAttribute('aria-hidden', String(!isExpanded));
      content.inert = !isExpanded;
      triangle.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      chevron.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      header.setAttribute('aria-expanded', String(isExpanded));
    };

    const toggle = () => {
      setExpanded(header.getAttribute('aria-expanded') !== 'true');
    };

    header.addEventListener('click', toggle);
    if (header.tagName !== 'BUTTON') {
      header.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    }

    setExpanded(header.getAttribute('aria-expanded') === 'true');
    window.addEventListener('resize', () => {
      if (header.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
});