window.onload = function () {
    let oContainer = $('container')
    let oLeftBtn = getByClass(oContainer, 'leftArea')[0]
    let oRightBtn = getByClass(oContainer, 'rightArea')[0]
    let oRotationChart = getByClass(oContainer, 'rotationChart')[0]
    let aItem = getByClass(oRotationChart, 'item')
    let oControlBtn = getByClass(oContainer, 'controlBtn')[0]
    let aConBtnLi = oControlBtn.getElementsByTagName('li')

    let iNow = 0
    let iPre = 0
    let timer = null

    bindNav()
    btnNav()
    autoNav()

    aItem[0].classList.add('show')

    function bindNav() {
        let aLi = aConBtnLi
        for (let i = 0; i < aLi.length; i++) {
            aLi[i].index = i
            aLi[i].onclick = function () {
                iPre = iNow
                iNow = this.index
                toMove(iNow)
            }
        }
    }


    function btnNav() {
        oLeftBtn.onmousedown = function () {
            iPre = iNow
            iNow--
            if (iNow === -1) {
                iNow = aItem.length - 1
            }
            toMove(iNow)
        }

        oRightBtn.onmousedown = function () {
            iPre = iNow
            iNow++
            if (iNow === aItem.length) {
                iNow = 0
            }
            toMove(iNow)
        }
    }


    function autoNav() {
        oContainer.onmouseover = function () {
            clearInterval(timer)
            timer = null
        }
        oContainer.onmouseout = function () {
            timer = setInterval(() => {
                iPre = iNow
                iNow++
                if (iNow === aItem.length) {
                    iNow = 0
                }
                toMove(iNow)
            }, 3000);
        }
        if (!timer) {
            timer = setInterval(() => {
                iPre = iNow
                iNow++
                if (iNow === aItem.length) {
                    iNow = 0
                }
                toMove(iNow)
            }, 3000);
        }
    }

    function toMove(iNow) {
        if (aItem[0].classList.contains('show')) {
            aItem[0].classList.remove('show')
        }
        if (iNow < iPre) {
            aItem[iNow].className = 'leftShow'
            aItem[iPre].className = 'rightHide'
        } else if (iNow > iPre) {
            aItem[iNow].className = 'rightShow'
            aItem[iPre].className = 'leftHide'
        } else if (iNow === iPre) {
            return
        }
        for (let i = 0; i < aConBtnLi.length; i++) {
            aConBtnLi[i].className = ''
        }
        aConBtnLi[iNow].className = 'active'
    }



    function $(id) {
        return document.getElementById(id)
    }

    function getByClass(oParent, sClass) {
        let aElem = oParent.getElementsByTagName('*')
        let arr = []
        for (let i = 0; i < aElem.length; i++) {
            if (aElem[i].className === sClass) {
                arr.push(aElem[i])
            }
        }
        return arr
    }

    function setStyle(obj, attr, value) {
        obj.style[attr] = value
        obj.styel['webkit' + attr.toString(0, 1).toUpperCase() + attr.toString(1)] = value
    }
}