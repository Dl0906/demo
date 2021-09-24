(function (w) {
    /**
     * @ignore =============================
     * @func transformCSS
     * @desc 设置或获取transform的值
     * @param [Obj] el 对象
     * @param [Str] prop 属性
     * @param [Str] val 属性值
     * @example transform(el,translateX,300)
     * @return [Str|Num] 结果
     * @ignore =============================
     */

    function transformCSS(el, prop, val) {
        let reg = /^(translate|rotate|scale)(X|Y|Z)?$/
        let cssStr = ''
        if (el.store === undefined) {
            el.store = {}
        }
        // 判断长度
        if (arguments.length === 2) {
            // 获取值
            if (reg.test(prop)) return el.store[prop]
        } else if (arguments.length === 3) {
            // 设置值
            if (reg.test(prop)) el.store[prop] = val
            for (const propName in el.store) {
                let unit = chkUnit(propName, reg)
                cssStr += `${propName}(${el.store[propName]}${unit})`
            }
            el.style.transform = cssStr
        }
    }

    function chkUnit(propName, reg) {
        let unit
        switch (reg.exec(propName)[1]) {
            case 'translate':
                unit = 'px'
                break
            case 'rotate':
                unit = 'deg'
                break
            case 'scale':
                unit = ''
                break
            default:
                unit = ''
                break
        }
        return unit
    }
    w.transformCSS = transformCSS
})(window)

// 匹配 translate,translateX,translateY,translateZ, rotate, rotateX,rotateY,