// @ts-ignore
var GMHighLight;
(function (GMHighLight) {
    var ColorList = ["lightcoral", "lightgreen", "lightseagreen",
        "lightpink", "goldenrod", "lightskyblue", "lightyellow",
        "cadetblue", "coral", "darkkhaki", "darkorchid", "darkgreen", "thistle"];
    function init() {
        var elementList = Array.from(document.getElementsByTagName("code"));
        elementList.forEach(function (e) {
            var newContent = "";
            var colorMap = new Map();
            var colorIndex = 0;
            e.innerHTML.split("\n").forEach(function (line, index, arr) {
                if (index < arr.length - 1) {
                    line += "\n";
                }
                var name = parseName(line);
                if (name == "") {
                    newContent += line;
                    return;
                }
                var color = colorMap.get(name) || "";
                if (color == "") {
                    color = ColorList[colorIndex];
                    colorMap.set(name, color);
                    colorIndex = (colorIndex + 1) % ColorList.length;
                }
                //添加标签
                //replace函数默认只替换一次，正好满足我们的需要
                var newline = line.replace(name, "<span style=\"background-color: ".concat(color, ";\">").concat(name, "</span>"));
                newContent += newline;
            });
            e.innerHTML = newContent;
        });
    }
    GMHighLight.init = init;
    /**
     * 解析人名，特征是：
     * 1，人名在行开头；
     * 2，人名不能超过2个空格；
     * 3，人名后面有个英文冒号，冒号后面有个空格。
     */
    function parseName(line) {
        //?表示最短匹配
        //人名可能包含法语特殊字符，没办法列举
        var mlist = line.match(/^([^:]+): /);
        //匹配不到的不处理
        if (mlist != null) {
            var name_1 = mlist[1];
            //多于3个空格的不算人名
            var space = name_1.match(/ /g);
            if (space == null || space.length < 4) {
                return name_1;
            }
        }
        return "";
    }
})(GMHighLight || (GMHighLight = {}));
// 使用以下命令生成gm_highlight.js
// tsc gm_highlight.ts --target "es5" --lib "es2015,dom" --downlevelIteration
