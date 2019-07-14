let PYG = {};               //防止函数污染
PYG.littleCar = function () {               //防止函数污染
    let dataString = localStorage.getItem('myshopcar');     //获得本地数据库
    let shopArr = JSON.parse(dataString) || [];
    let number = 0;
    shopArr.forEach(function (e) {
        number += e.number;                             //遍历数组,将其中元素的number属性累加
    })
    $('.shopcar .count').text(number);                              //修改小红点
}