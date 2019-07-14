$(function () {
  PYG.littleCar();      //调用小红购物车的函数,更新数据

  let id = location.search;       //获得地址栏的信息  ?id=
  // console.log(location)
  id = parseInt(id.slice(4));       //截取,装换数字
  let showTarget = phoneData.find(function (e) {          //从data.js的数组中获得id==pID的对象
    return e.pID.toString() == id;
  })    //寻找id等于pID的对象
  $('.sku-name').text(showTarget.name);                //将获得的对象的名字数字
  $('.preview-img img').attr('src', showTarget.imgSrc);   //将图片显示更换
  // $('.big').hide()
  $('.summary-price em').text(`￥${showTarget.price}`)     //将价格更换

  $('.preview-img').on('mouseover', function () {
    // $('.zoom').on('mouseover', function () {
    // $('.big').css('visibility', 'visible')
    $('.mask').show()
  })
  //遮罩移动
  $('.preview-img').on('mousemove', function (e) {
    // $('.preview-img img').width()
    // $('.preview-img img').height()
    // e.pageX
    // e.pageY
    // $('.preview-img')[0].offsetTop
    // $('.preview-img')[0].offsetLeft
    // $('.mask').width()
    // $('.mask').height()
    // console.log()
    let maskMoveX = e.pageX - $('.preview-img')[0].offsetLeft - $('.mask').width() / 2;
    let maskMoveY = e.pageY - $('.preview-img')[0].offsetTop - $('.mask').height() / 2;
    let maskXMax = $('.preview-img img').width() - $('.mask').width();
    let maskYMax = $('.preview-img img').height() - $('.mask').height();
    maskMoveX = maskMoveX <= 0 ? 0 : maskMoveX;
    maskMoveY = maskMoveY <= 0 ? 0 : maskMoveY;
    maskMoveX = maskMoveX >= maskXMax ? maskXMax : maskMoveX;
    maskMoveY = maskMoveY >= maskYMax ? maskYMax : maskMoveY;
    $('.mask').css('left', `${maskMoveX}px`);
    $('.mask').css('top', `${maskMoveY}px`);
    // $('.big').html(`<img src=${showTarget.imgSrc}>`)
  })

  $('.preview-img').on('mouseleave', function () {
    // $('.zoom').on('mouseout', function () {
    // $('.big').css('visibility', 'hidden');
    // console.log(123);
    $('.mask').hide();
  })

  //增加键改变数量
  $('.add').on('click', function () {
    $('.reduce').removeClass('disabled');               //加后去掉减的禁用类名
    let chooseNum = parseInt($('.choose-number').val())       //从文本框获得原来数量
    chooseNum++;                                 //数量累加
    $('.choose-number').val(chooseNum)                  //将累加的值设置更换到原来文本框值
  })
  $('.choose-number').on('keydown', function (e) {    //禁止键盘输入
    e.preventDefault();
  })
  //减少键改变数量
  $('.reduce').on('click', function () {
    if (parseInt($('.choose-number').val()) == 1) {     //如果文本框的值在点击时是1了,不执行,返回
      return;
    }
    let chooseNum = parseInt($('.choose-number').val())     //从文本框获得原来数量
    chooseNum--;                                 //虚拟数量累减
    if (chooseNum == 1) {                         //减完后如果虚拟数量等于1,禁用
      $('.reduce').addClass('disabled');
    }
    $('.choose-number').val(chooseNum)          //赋值
  })
  //从本地存库拿出数据
  let localData = localStorage.getItem('myshopcar');      //从本地数据库拿去数据,字符串
  let localDataArr = JSON.parse(localData) || new Array();    //转为数组
  // if (localData) {
  //   localDataArr = JSON.parse(localData);
  // } else {
  //   localDataArr = new Array();
  //   // console.log(localDataArr)
  // }
  // console.log(localData)
  // let localDataArr = JSON.parse(localData);
  // let localData = [];
  // localData.push()
  $('.addshopcar').on('click', function () {                    //给添加到购物车添加行为
    if (localDataArr.length == 0) {     //判断是否本地库有无数据
      showTarget.number = parseInt($('.choose-number').val());    //将此时的文本值赋予给对象的Number属性
      localDataArr.push(showTarget);                                //添加到变量数组
      let myShopCar = JSON.stringify(localDataArr);
      localStorage.setItem('myshopcar', myShopCar);               //变量数组上传到本地数据库
    } else {
      localData = localStorage.getItem('myshopcar');            //如果本来就有数据了,再获取一次本地数据
      localDataArr = JSON.parse(localData);                   //更新本地数据库
      let obj = localDataArr.find(function (e) {              //查找一下本地库是否已经有本欲购买的商品
        return e.pID === id;
      })

      if (obj) {                                            //如果存在
        let num = parseInt($('.choose-number').val());            //将此时的文本框值获取
        obj.number = parseInt(obj.number) + num;              //已经在购物车里面的数量获取和累加上行的文本值
        let myShopCar = JSON.stringify(localDataArr);           //对象改变,虚拟数组也随着改变,将虚拟数组上传至本地库
        localStorage.setItem('myshopcar', myShopCar);
      } else {
        showTarget.number = parseInt($('.choose-number').val());      //如果不存在已有对象
        localDataArr.push(showTarget);                              //直接将值赋予给对象number属性然后添加进虚拟数组
        let myShopCar = JSON.stringify(localDataArr);           //将更新后的数组上传至本地库
        localStorage.setItem('myshopcar', myShopCar);
      }



      // localDataArr.forEach(function (e) {
      //   if (e.pID === id) {
      //     let num = parseInt($('.choose-number').val());
      //     e.number = parseInt(e.number) + num;
      //     let myShopCar = JSON.stringify(localDataArr);
      //     localStorage.setItem('myshopcar', myShopCar);
      //   } else {
      //     showTarget.number = parseInt($('.choose-number').val());
      //     localDataArr.push(showTarget);
      //     let myShopCar = JSON.stringify(localDataArr);
      //     localStorage.setItem('myshopcar', myShopCar);
      //   }
      // })
    }
  })


  $('.addshopcar').attr('href', `./cart.html`);         //将点击地址改变








})