function Swiper(selector, options) {
    /**
     * @ignore =============================
     * @file swiper.js
     * @desc 实现幻灯片效果
     * @todo 完成 '/get' 路由的读取功能
     * @todo 完成 '/delete' 路由的删除功能
     * @author donglei
     * @createDate 2021-1-1
     * @example new Swiper('#swiper-container',{
     * ********     auto:false, // 自动滚动
     * ********     loop:false, // 无缝滚动
     * ********     pagination:true // 导航点
     * ******** })
     * @dependence transformCSS.js
     * @ignore =============================
     */
    // 是否自动播放,默认自动播放
    let auto = options && options.auto !== undefined ? options.auto : true
    // 是否无缝滚动,默认无缝滚动
    let loop = options && options.loop !== undefined ? options.loop : true
    // 设置自动播放延时时间,默认3000ms
    let delay = options && options.delay !== undefined ? options.delay : 3000
    // 设置是否配置导航点,默认配置
    let pagination = options && options.pagination !== undefined ? options.pagination : true
    // 获取images的src属性值
    let imagesArr = options && options.images !== undefined ? options.images : []
    if (imagesArr.length === 0) return console.error('options.images shouldn\'t be an empty array')

    let oContainer = document.querySelector(selector)


    oContainer.createDOM = function () {
        let oWrapper = document.createElement('div')
        oWrapper.classList.add('swiper-wrapper')
        this.appendChild(oWrapper)
        for (let i = 0; i < imagesArr.length; i++) {
            let oSlide = document.createElement('div')
            oSlide.classList.add('swiper-slide')
            let oImg = document.createElement('img')
            oImg.setAttribute('src', imagesArr[i])
            oSlide.appendChild(oImg)
            oWrapper.appendChild(oSlide)
        }
        if (pagination) {
            let oPagination = document.createElement('div')
            oPagination.classList.add('swiper-pagination')
            oContainer.appendChild(oPagination)
            for (let i = 0; i < imagesArr.length; i++) {
                let oSpan = document.createElement('span')
                if (i === 0) oSpan.classList.add('active')
                oPagination.appendChild(oSpan)
            }
        }
    }
    oContainer.createDOM()

    // 预设参数
    let timeStamp = 300 // 小于此时间,执行快速切换

    // 获取元素
    let oWrapper = oContainer.querySelector('.swiper-wrapper')
    // 无缝滚动复制DOM前的length
    let len = oWrapper.querySelectorAll('.swiper-slide').length
    // 无缝滚动才允许增加
    if (loop) {
        oWrapper.innerHTML += oWrapper.innerHTML
    }
    // 无缝滚动复制后的length长度, 在loop===false的情况下length与len值相等
    let length = oWrapper.querySelectorAll('.swiper-slide').length
    let aSlide = oWrapper.querySelectorAll('.swiper-slide')
    if (pagination) var aPageSpan = oContainer.querySelectorAll('.swiper-pagination>span')

    let iNow = 0
    let w, ratio, timer1

    // 初始设置
    oContainer.init = function () {
        // 禁止点击穿透
        app.addEventListener('touchstart', function (e) {
            e.preventDefault()
        }, false)
        // 设置oContainer的高度
        window.onresize = fnResize
        fnResize()

        function fnResize() {
            w = oContainer.offsetWidth
            let oImg = aSlide[0].querySelector('img')
            oImg.onload = function () {
                ratio = this.naturalHeight / this.naturalWidth
                oContainer.style.height = w * ratio + 'px'
            }
            if (ratio) {
                oContainer.style.height = w * ratio + 'px'
            }
            oWrapper.style.width = length * w + 'px'
            for (let i = 0; i < aSlide.length; i++) {
                aSlide[i].style.width = w + 'px'
            }

            // oWrapper.style.left = -iNow * w + 'px'
            transformCSS(oWrapper, 'translateX', -iNow * w)
            oWrapper.style.transition = 'all .5s'
        }
    }
    oContainer.init()

    // 触摸开始
    oContainer.addEventListener('touchstart', function (e) {
        oWrapper.style.transition = ''
        if (timer1) {
            clearInterval(timer1)
            timer1 = null
        }
        if (loop) oContainer.switchSlide()
        this.startX = e.targetTouches[0].clientX
        this.timeStart = Date.now()
        this.initOffset = transformCSS(oWrapper, 'translateX')
    }, false)

    // 触摸移动
    oContainer.addEventListener('touchmove', function (e) {
        this.curX = e.targetTouches[0].clientX
        this.curOffset = this.curX - this.startX + this.initOffset

        // 没有无缝滚动时执行边界检查
        let minOffset = -(oWrapper.offsetWidth - oContainer.offsetWidth)
        let maxOffset = 0;
        !loop && (this.curOffset = this.curOffset < minOffset ? minOffset : this.curOffset);
        !loop && (this.curOffset = this.curOffset > maxOffset ? maxOffset : this.curOffset)
        transformCSS(oWrapper, 'translateX', this.curOffset)
    }, false)

    // 触摸结束
    oContainer.addEventListener('touchend', function (e) {
        this.endX = e.changedTouches[0].clientX
        this.endOffset = this.endX - this.initX + this.initOffset
        this.timeEnd = Date.now()
        let dis = this.endX - this.startX
        let time = this.timeEnd - this.timeStart

        // 时间判断
        if (time > timeStamp) {
            oWrapper.style.transition = 'all .5s'
        }

        distanceJudge(dis)

        if (auto) oContainer.autoRun()

        function distanceJudge(dis) {
            if (Math.abs(dis) <= w * 0.3) {
                transformCSS(oWrapper, 'translateX', -iNow * w)
            } else if (Math.abs(dis) > w * 0.3) {
                // 前往其它页
                if (dis > 0) iNow--
                else if (dis < 0) iNow++
                else return
                if (iNow === -1) iNow = length - 1
                else if (iNow === length) iNow = 0
                if (pagination) {
                    oContainer.pageChange()
                }
                transformCSS(oWrapper, 'translateX', -iNow * w)
            }
        }
    }, false)

    // 控制底部导航的显示
    oContainer.pageChange = function () {
        for (let i = 0; i < aPageSpan.length; i++) {
            aPageSpan[i].classList.remove('active')
        }
        iPage = iNow % len
        aPageSpan[iPage].classList.add('active')
    }

    oContainer.autoRun = function () {
        timer1 = setInterval(() => {
            if (oWrapper.style.transition === '') oWrapper.style.transition = 'all .5s'
            iNow++
            if (iNow === -1) iNow = 0
            else if (iNow === length) iNow = 0
            if (pagination) oContainer.pageChange()
            transformCSS(oWrapper, 'translateX', -iNow * w)
        }, delay)
        if (loop) {
            oWrapper.addEventListener('transitionend', function () {
                oContainer.switchSlide()
            }, false)
        }
    }
    if (auto) oContainer.autoRun()

    // 为了达到无缝滚动目的,inow为0或length-1时立刻跳转
    oContainer.switchSlide = function () {
        if (iNow === length - 1 || iNow === 0) {
            console.log('处于第一张或者最后一张 取消transition 立即跳转')
            oWrapper.style.transition = ''
        }
        if (iNow === length - 1) iNow = length / 2 - 1
        if (iNow === 0) iNow = length / 2
        console.log('跳转到' + iNow)
        // oWrapper.style.left = -iNow * w + 'px'
        transformCSS(oWrapper, 'translateX', -iNow * w)
    }
}