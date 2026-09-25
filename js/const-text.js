// 延迟100毫秒后执行打字效果逻辑（预留页面元素加载时间）
setTimeout(function() {
    // 获取id为type-text的元素（用于显示打字效果的容器）
    const typeEl = document.getElementById('type-text');
    
    // 要显示的完整文本内容
    const fullText = "雷破云涛惊破浪，洛水千山润锦川。";
    // 存储当前正在显示的文本
    let currentText = "";
    // 记录当前要处理的文本索引位置
    let index = 0;

    // 打字速度参数设置（数值越大速度越慢）
    const typeSpeed = 200; // 每个字符的输入间隔（毫秒）
    const deleteSpeed = 100; // 每个字符的删除间隔（毫秒）
    const pauseTime = 2000; // 文本完全显示后的停顿时间（毫秒）

    // 打字函数：负责逐个添加字符
    function type() {
        // 检查打字容器元素是否存在
        if (!typeEl) {
            alert("找到问题了：页面里没有#type-text元素！");
            return; // 元素不存在时终止函数
        }
        
        // 如果尚未输入完所有字符
        if (index < fullText.length) {
            // 将当前索引的字符添加到当前文本中
            currentText += fullText[index];
            // 更新显示容器的内容
            typeEl.textContent = currentText;
            // 打印日志，方便调试观察当前显示内容
            console.log("当前显示：", currentText);
            // 索引递增，准备处理下一个字符
            index++;
            // 延迟typeSpeed毫秒后继续执行打字
            setTimeout(type, typeSpeed);
        } else {
            // 所有字符输入完成后，延迟pauseTime毫秒执行删除函数
            setTimeout(deleteText, pauseTime);
        }
    }

    // 删除函数：负责逐个删除字符
    function deleteText() {
        // 如果当前文本还有内容
        if (currentText.length > 0) {
            // 移除当前文本的最后一个字符
            currentText = currentText.slice(0, -1);
            // 更新显示容器的内容
            typeEl.textContent = currentText;
            // 打印日志，方便调试观察当前显示内容
            console.log("当前显示：", currentText);
            // 延迟deleteSpeed毫秒后继续执行删除
            setTimeout(deleteText, deleteSpeed);
        } else {
            // 所有字符删除完成后，重置索引并延迟开始新一轮打字
            index = 0;
            setTimeout(type, typeSpeed);
        }
    }

    // 启动打字效果
    type();
}, 100);