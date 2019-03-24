### 关于流程图类别
- Text: 文字笔划；  
- Arrow, Terminator, Data, Process, Decision 分别如下图：
![spec](./public/flowchart_spec.png)

### 交互介绍
* 选中
   * 多选：在空白处按下鼠标并拖动以形成`矩形框`，所有点全包含于该选框内的笔划将被选中；或按住ctrl并点击某笔划以将加入选中组。
   * 选中单个笔划：在该笔划上`单击`。
* 标记：若图中有笔划被选中，则在该区域`双击`后会弹出类别列表（仅可单选），点选某项以将当前笔划加入该类别。
* Check & Double-check
   * 点击类别菜单，点击则进入类别查看模式。此时不可操作。
   * 全部标记完后，将进入double-check流程。依次显示各个类别的笔划以供检查，无误则进入下一类别；否则退出并修改，直至全部无误即完成该幅图的标记。

### 关于标记流程
这里提供一个较有效率的流程参考。
1. 把所有arrow标出来。
2. 用矩形框选中某个符号及其内文字的所有笔划，标为该符号的类别；再用矩形框选中其内的文字笔划，标为text。重复此步。
3. 若有遗漏或错标，可单独选中并重新标记（期间可自由缩放画布，或切至check模式检查）。另外，一些难以辨明类别的笔划（如某些绘制者习惯在画完一个符号后在旁边顿一个点等；通常较短），统一标识为text即可。
---
若有bug或其他问题，欢迎邮箱联系我：mg1632001@smail.nju.edu.cn  
感谢参与*😶*