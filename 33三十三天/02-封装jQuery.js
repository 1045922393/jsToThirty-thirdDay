(function () {
    window.$ = window.jQuery = jQuery;
    function jQuery(selector) {
        return new Sel(selector);
    }
    function Sel(selector) {        //自定义构造函数
        let temp = document.querySelectorAll(selector);
        for (let i = 0; i < temp.length; i++) {
            this[i] = temp[i];
        }
        this['length'] = temp['length'];
    }

    Sel.prototype.each = function (fn) {
        for (let j = 0; j < this.length; j++) {
            let i = j;
            let e = this[j];
            fn(i, e);
        }
        //return this;    //this指向调用此方法的jq对象
    }

    Sel.prototype.css = function (property, value) {
        console.log(this)       //此时this已经是$('.box li')
        this.each((i, e) => {
            e.style[property] = value;
        })
    }
})()