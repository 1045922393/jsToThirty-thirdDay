$(function () {


  let jsonStr = localStorage.getItem('myshopcar');
  let sqlArr = JSON.parse(jsonStr) || [];   //定义数据库的数组

  if (sqlArr.length == 0) {                 //判断本地数据库是否为空
    $('.cart-header').addClass('hidden');     //将该有的显示,不该有的隐藏
    $('.item-list').addClass('hidden');
    $('.empty-tip').show();       //将该有的显示,不该有的隐藏
    $('.total-of').addClass('hidden');
    PYG.littleCar();
  } else {
    $('.empty-tip').hide();       //将该有的显示,不该有的隐藏
    $('.total-of').removeClass('hidden');
    PYG.littleCar();
    let aaa = '';                              //将本地数据库的数组转化为结构输出
    sqlArr.forEach(function (e) {                 //遍历数组,添加本地库中的信息
      aaa += `<div class="item" data-id=${e.pID}>   
      <div class="row">
        <div class="cell col-1 row">
          <div class="cell col-1">
            <input type="checkbox" class="item-ck" checked="true">
          </div>
          <div class="cell col-4">
            <img src=${e.imgSrc} alt="">
          </div>
        </div>
        <div class="cell col-4 row">
          <div class="item-name">${e.name}</div>
        </div>
        <div class="cell col-1 tc lh70">
          <span>￥</span>
          <em class="price">${e.price}</em>
        </div>
        <div class="cell col-1 tc lh70">
          <div class="item-count">
            <a href="javascript:void(0);" class="reduce fl">-</a>
            <input autocomplete="off" type="text" class="number fl" value=${e.number}>
            <a href="javascript:void(0);" class="add fl">+</a>
          </div>
        </div>
        <div class="cell col-1 tc lh70">
          <span>￥</span>
          <em class="computed">${e.price * e.number}</em>
        </div>
        <div class="cell col-1">
          <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
        </div>
      </div>
    </div>`;
    })
    $('.item-list').html(aaa);
    computting();                     //加载完毕,调用函数,计算总和

    $('.pick-all').on('click', function () {
      let selectAll = $(this).prop('checked');
      $('.item-ck').prop('checked', selectAll);     //点击全选后,所有子按钮被全选同步赋值
      $('.pick-all').prop('checked', selectAll);      //其余的全选按钮也被赋值
      computting();                 //点击全选,计算总和
    })
    $('.item-list').on('click', '.item-ck', function () {         //事件委托
      // $('.item-ck').on('click', function () {
      let selectEach = $('.item-ck').length == $('.item-ck:checked').length;        //判断被选定长度是否与列表长度一样
      $('.pick-all').prop('checked', selectEach);   //将结果存进变量,然后赋予所有全选按钮
      computting();                                   //点击一次,计算总和一次
    })
    $('.number').on('keydown', function (e) {               //禁止键盘输入数量
      e.preventDefault();
    })
    $('.number').each(function (i, e) {                 //加载完毕判断是否键按钮可以使用
      if ($(e).val() <= 1) {                          //当文本框的值<=1
        $(e).siblings('.reduce').addClass('disabled')       //满足条件的兄弟节点添加类名禁用
      }
    })
    // if ($('.number').val() <= 1) {
    //   $('number').siblings('.reduce').addClass('disabled')
    // }
    // console.log($('.number').val())
    $('.item-list').on('click', '.add', function () {       //增加按钮
      numb = $(this).siblings('input').val();
      numb++;
      $(this).siblings('.reduce').removeClass('disabled');      //点击后一定大于1,减少键禁用接触
      $(this).siblings('input').val(numb);                      //文本框显示改变
      let tmp = $(this);                                      //防止下一步的this改变,先利用第三方暂存
      let obj = sqlArr.find(function (e) {                    //利用点击的父元素的存放信息data-id来获取对应数组的对象
        return e.pID == tmp.parents('.item').attr('data-id');
      })
      obj.number = numb;                                    //修改对象,也修改数组
      $(this).parents('.item').find('.computed').text(obj.number * obj.price);    //修改单项商品累加的金额
      // console.log(obj)
      let jsonString = JSON.stringify(sqlArr);                      //更新本地数据库
      localStorage.setItem('myshopcar', jsonString);
      computting();                         //更新总价和数量
      PYG.littleCar();              //更新小红点
    })

    $('.item-list').on('click', '.reduce', function () {              //减少按钮
      numb = $(this).siblings('input').val();                     //获取当前文本值
      if (numb <= 1) {                          //如果已经等于1了,禁用改变
        $(this).addClass('disabled');
        return;
      }
      numb--;                                         //大于1了,虚拟数字键
      if (numb <= 1) {                                 //减完后判断是否等于1,如果是,禁用       
        $(this).addClass('disabled');
      }
      $(this).siblings('input').val(numb);                //赋值显示框
      let tmp = $(this)                             //防止下步的this改变,暂存一个变量中
      let obj = sqlArr.find(function (e) {                //获得点击对象对应的对象
        return e.pID == tmp.parents('.item').attr('data-id')
      })
      obj.number = numb;
      $(this).parents('.item').find('.computed').text(obj.number * obj.price);
      // console.log(obj)
      let jsonString = JSON.stringify(sqlArr);
      localStorage.setItem('myshopcar', jsonString);
      computting();
      PYG.littleCar();
    })

    //删除功能
    // $('.item-list').on('click', '.item-del', function () {
    //   let productID = $(this).parents('.item').attr('data-id');
    //   $(this).parents('.item').remove();
    //   let obj = sqlArr.find(function (e) {
    //     return e.pID == productID
    //   })
    //   let delIndex = sqlArr.indexOf(obj);             //数组.indexOf(元素)    返回一个对应的数字类型索引
    //   sqlArr.splice(delIndex, 1);
    //   let jsonString = JSON.stringify(sqlArr);
    //   localStorage.setItem('myshopcar', jsonString);
    //   PYG.littleCar();
    //   if (sqlArr.length == 0) {                 //判断本地数据库是否为空
    //     $('.cart-header').addClass('hidden');     //将该有的显示,不该有的隐藏
    //     $('.item-list').addClass('hidden');
    //     $('.empty-tip').removeClass('hidden');       //将该有的显示,不该有的隐藏
    //     $('.total-of').addClass('hidden');
    //   }
    // })
    $('.item-list').on('click', '.item-del', function () {            //删除功能
      let delBtn = this;                            // 每次点击时候可以先暂存一个变量来知道点击了谁
      $("#dialog-confirm").dialog({                       //调用jquery.ui.js的确认框插件
        resizable: false,
        height: 140,
        modal: true,
        buttons: {
          "确认": function () {
            $(this).dialog("close");
            let productID = $(delBtn).parents('.item').attr('data-id');           //获取存在父元素的id信息,以便对对应的本地数据库进行操作 
            $(delBtn).parents('.item').remove();              //表面删除操作
            let obj = sqlArr.find(function (e) {          //获得对象
              return e.pID == productID
            })
            let delIndex = sqlArr.indexOf(obj);             //数组.indexOf(元素)    返回一个对应的数字类型索引
            sqlArr.splice(delIndex, 1);                     //可以直接使用      数组.findIndex(function(){return 条件})     来简化
            let jsonString = JSON.stringify(sqlArr);            //更新存库
            localStorage.setItem('myshopcar', jsonString);
            PYG.littleCar();                          //更新小红点
            if (sqlArr.length == 0) {                 //删除操作后判断本地数据库是否为空
              $('.cart-header').addClass('hidden');     //将该有的显示,不该有的隐藏
              $('.item-list').addClass('hidden');
              $('.empty-tip').show();                     //将该有的显示,不该有的隐藏
              $('.total-of').addClass('hidden');
            }
          },
          "取消": function () {
            $(this).dialog("close");
          }
        }
      });
    });
  }


  function computting() {                           //封装计算总和
    let selectedCount = 0;
    let selectedMoney = 0;
    $('.item-ck:checked').each((i, e) => {              //遍历被选中的商品,计算总和
      // console.log()
      let selectID = $(e).parents('.item').attr('data-id')        //对每个选中的商品携带的商品id信息保存到变量
      let obj = sqlArr.find(function (e) {              //从本地数据库中查找对应的id,得到一个对象
        return e.pID == selectID
      })
      selectedCount += obj.number;                        //  将数量和价格累加
      selectedMoney += obj.number * obj.price;
    })
    $('.total-of .selected').text(selectedCount);         //修改数字
    $('.total-of .total-money').text(selectedMoney);
  }
})