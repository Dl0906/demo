/*
 * @Author: donglei
 * @Date: 2021-12-06 21:27:48
 * @LastEditors: donglei
 * @LastEditTime: 2021-12-07 10:29:15
 * @Description: file content
 * @FilePath: \TEST\canvas练习\transformCSS.js
 */

// 解决translate，rotate，scale接收两个值的情况
;
(function (w) {
    function transformCSS(el, style, value1, value2) {
        // 初始化参数
        el = (typeof el === 'object') ? el : document.querySelector(el)
        // 值应该保存在对象中
        if (!el.store) {
            el.store = {}
        }
        // 判断传入参数个数
        if (arguments.length == 2) {
            // 获取属性值
            if (el.store[style]) {
                return el.store[style]
            } else {
                return 0
            }

        } else if (arguments.length === 3) {
            // 设置属性值
            el.store[style] = value1
            el.htmlStr = ''
            // 将更新后的store对象重新添加到内联样式中
            for (const prop in el.store) {
                let unit = judgeUnit(prop)
                el.htmlStr += `${prop}(${el.store[prop]}${unit})`
            }
            el.style.transform = el.htmlStr
        } else if (arguments.length === 4) {
            el.store[style] = value1 + ',' + value2
            el.htmlStr = ''
            let reg = /(translate)?(rotate)?(scale)?/g
            for (const prop in el.store) {
                let unit = judgeUnit(prop)
                if (reg.test(prop)) {
                    let val = el.store[prop]
                    let value1 = val.slice(0, val.indexOf(','))
                    let value2 = val.slice(val.indexOf(','), val.length)
                    el.htmlStr += `${prop}(${value1}${unit} ${value2}${unit})`
                    el.style.transform = el.htmlStr
                    continue
                }
                el.htmlStr += `${prop}(${el.store[prop]}${unit})`
                el.style.transform = el.htmlStr
            }
        }

        function judgeUnit(prop) {
            switch (prop) {
                case 'translate':
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    return 'px'
                    break
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'rotateZ':
                    return 'deg'
                    break
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'scaleZ':
                    return ''
                    break
                default :
                    console.error('传入的style参数有误，请检查并重新输入')
            }
        }
    }
    w.transformCSS = transformCSS
})(window)