// @ts-ignore
namespace GMHighLight {
    let ColorList: string[] = ["lightcoral", "lightgreen", "lightseagreen",
        "lightpink", "goldenrod", "lightskyblue", "lightyellow",
        "cadetblue", "coral", "darkkhaki", "darkorchid", "darkgreen", "thistle"];

    export function init(): void {
        let elementList = Array.from(document.getElementsByTagName("code"));
        elementList.forEach((e) => {
            let newContent = "";
            let colorMap = new Map<string, string>();
            let colorIndex = 0;
            e.innerHTML.split("\n").forEach((line, index, arr) => {
                if (index < arr.length - 1) {
                    line += "\n";
                }
                let name = parseName(line);
                if (name == "") {
                    newContent += line;
                    return
                }
                let color = colorMap.get(name) || "";
                if (color == "") {
                    color = ColorList[colorIndex];
                    colorMap.set(name, color);
                    colorIndex = (colorIndex + 1) % ColorList.length;
                }
                //添加标签
                //replace函数默认只替换一次，正好满足我们的需要
                let newline = line.replace(name,
                    `<span style="background-color: ${color};">${name}</span>`);
                newContent += newline;
            })
            e.innerHTML = newContent;
        })
    }

    /**
     * 解析人名，特征是：
     * 1，人名在行开头；
     * 2，人名不能超过2个空格；
     * 3，人名后面有个英文冒号，冒号后面有个空格。
     */
    function parseName(line: string): string {
        //?表示最短匹配
        //人名可能包含法语特殊字符，没办法列举
        let mlist = line.match(/^([^:]+): /);
        //匹配不到的不处理
        if (mlist != null) {
            let name = mlist[1];
            //多于3个空格的不算人名
            let space = name.match(/ /g);
            if (space == null || space.length < 4) {
                return name;
            }
        }
        return "";
    }
}

// 使用以下命令生成gm_highlight.js
// tsc gm_highlight.ts --target "es5" --lib "es2015,dom" --downlevelIteration