$(function () {
  // 判断购物车是否为空
  // var cartListData = localStorage.getItem('shopCart');
  // var arr = JSON.parse(cartListData);
  // if(!arr){
  //   arr = [];
  // }
  var arr = loadData('shopCart');
  // 如果我们处理过了数据，就是当数组的长度为0的时候，没有数据
  if (arr.length !== 0) {
    // 有数据
    // 把空空如也隐藏
    $('.empty-tip').addClass('hidden');
    // 把总计的部分显示
    $('.total-of').removeClass('hidden');
  } else {
    // 没有数据
    // 把表头和表格数据隐藏
    $('.cart-header,.item-list').addClass('hidden');
  }

  // 把读取到的数据，使用遍历的方式，生成表格结构
  arr.forEach(function (e) {
    var html =
      `<div class="item" data-id="${e.pID}">
    <div class="row">
      <div class="cell col-1 row">
        <div class="cell col-1">
          <input type="checkbox" class="item-ck" checked>
        </div>
        <div class="cell col-4">
          <img src="${e.imgSrc}" alt="">
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
          <input autocomplete="off" type="text" class="number fl" value="${e.number}">
          <a href="javascript:void(0);" class="add fl">+</a>
        </div>
      </div>
      <div class="cell col-1 tc lh70">
        <span>￥</span>
        <em class="computed">${e.number*e.price}</em>
      </div>
      <div class="cell col-1">
        <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
      </div>
    </div>
  </div>`

    // 把生成的结构，放到item-list这div里面
    $(".item-list").append(html); // append这个方法，你给他一个满足html格式的字符串，会自动解析为html标签
  });
  // 计算一次总件数和总价
  sumMoney();


  // 全选和单选功能
  $('.pick-all').on('click', function () {
    // 把其他的每一项都改成和我一样
    var status = $(this).prop('checked');
    // 获取每个商品的checkbox
    $('.item-ck').prop('checked', status);
    // 控制另一个全选
    $(".pick-all").prop('checked', status);
    // 调用封装好的计算总价的方法
    sumMoney();
  });

  // 需要使用委托的方式注册
  $(".item-list").on('click', '.item-ck', function () {
    var cks = $('.item-list .item-ck:checked');
    var ck = $('.item-list .item-ck');
    var flag = cks.length === ck.length;
    $('.pick-all').prop('checked', flag);

    sumMoney();
  });


  // 因为计算总价和总件数在多个地方都用到了，把这些代码封装起来，直接调用
  function sumMoney() {
    // 1 获取哪些商品是选中的
    var checked = $(".item-list .item-ck:checked");
    // 2 得到勾选的id
    var ids = [];
    checked.each(function (i, e) {
      var id = parseInt($(e).parents('.item').attr('data-id'));
      ids.push(id);
    });
    // console.log(ids);
    // 获取到了勾选的id，需要到localStorage里面获取对应的数据
    var arr = loadData('shopCart');
    // 准备一个临时存储勾选的数据的数组
    var temp = [];
    arr.forEach(function (e) {
      // 判断e.pID是否和我们勾选的商品的id一致，如果一致就把对应的商品数据筛选出来
      ids.forEach(function (id) {
        if (id === e.pID) {
          // 把对应的e获取到，然后计算总价
          temp.push(e);
        }
      });
    });
    // console.log(temp);
    // 开始计算总的数量和总的价格
    var totalNumber = 0;
    var totoMoney = 0;
    temp.forEach(function (e) {
      totalNumber += e.number;
      totoMoney += e.number * e.price
    });
    // 把总价和总件数，修改到页面中
    $(".selected").text(totalNumber);
    $(".total-money").text(totoMoney);
  }


  // 删除
  $(".item-list").on('click', '.item-del', function () {
    // 得到要删除的数据的id
    var id = parseInt($(this).parents('.item').attr('data-id'));
    // 确定的回掉函数里面的this不是我们想要的this了，需要我们在外面先存储一下，在里面使用
    var _this = this;

    // 把遮罩和确认框显示出来
    $('.mask').removeClass('hidden');
    $(function () {
      $("#dialog-confirm").dialog({
        resizable: false,
        height: 180,
        modal: true,
        buttons: {
          "确定": function () {
            $(this).dialog("close");
            // 删除数据
            //根据id到localStorage里面删除数据
            // 先读取出来
            var arr = loadData('shopCart');
            // 遍历数组找到要删除的那一个
            arr.forEach(function (e, i) {
              if (e.pID === id) {
                arr.splice(i, 1);
              }
            });
            // console.log(arr);
            // 重新覆盖
            saveData('shopCart', arr);
            // 把对应的商品结构，从页面中删除
            $(_this).parents('.item').remove();
            //重新计算件数和总价
            sumMoney();
            $('.mask').addClass('hidden');
          },
          "取消": function () {
            $('.mask').addClass('hidden');
            $(this).dialog("close");
          }
        }
      });
    });

    // console.log(id);


    // 判断如果全都删除了，还要重新显示空空如也，把之前一开始判断的代码封装一下，直接调用

    // 当然有一个简单粗暴的方法————这个是极其不推荐的——直接刷新
    // location.reload();
  });

  // 处理页面里面的购物车商品的总件数
  $('.count').text(total());

  // 加号的点击
  /**
   * 1.给加号注册事件
   * 2.把数量++
   * 3.总件数和总价的计算
   * 4.把数据同步到本地存储
   */
  $(".item-list").on('click', '.add', function () {
    // 把数量++
    var number = parseInt($(this).prev().val());
    if (isNaN(number)) {
      alert('您的件数不是数组，请检查'); // 尽量不要使用alert - 吃藕
      return;
    }
    number++;
    if (number > 1) {
      $(this).prev().prev().removeClass('disabled');
    }
    $(this).prev().val(number);
    // 把数据更新到本地存储里面
    var id = parseInt($(this).parents('.item').attr('data-id'));
    // console.log(id);
    var arr = loadData('shopCart');
    var good = arr.find(function (e) {
      return e.pID === id;
    });
    // console.log(good);
    good.number = number;
    // 存到本地存储里面
    saveData('shopCart', arr);
    // 计算总件数和总价 - 之前约定好了，计算总价和总件数，是从本地存储中取数据
    sumMoney();
  });

  // 减号的逻辑几乎是和加号是一样的，不同的地方在于，这个地方是减，还有如果件数减到1，就不能再减
  $(".item-list").on('click', '.reduce', function () {
    // 如果减号按钮上有一个class 叫 disabled ，就不继续执行下面的代码了
    if ($(this).hasClass('disabled')) {
      return;
    }
    // 把数量++
    var number = parseInt($(this).next().val());
    if (isNaN(number)) {
      alert('您的件数不是数组，请检查'); // 尽量不要使用alert - 吃藕
      return;
    }
    // 如果件数减到1了，把减号按钮禁用 -本质没有禁用，只是加了一个class    
    number--;
    if (number === 1) {
      $(this).addClass('disabled');
    }

    $(this).next().val(number);
    // 把数据更新到本地存储里面
    var id = parseInt($(this).parents('.item').attr('data-id'));
    // console.log(id);
    var arr = loadData('shopCart');
    var good = arr.find(function (e) {
      return e.pID === id;
    });
    // console.log(good);
    good.number = number;
    // 存到本地存储里面
    saveData('shopCart', arr);
    // 计算总件数和总价 - 之前约定好了，计算总价和总件数，是从本地存储中取数据
    sumMoney();
  });


  // 给数量输入框加功能： 可以手动修改件数  修改之后，鼠标失焦，回车都可以更新件数和总价
  /**
   *  步骤：
   *  1.注册事件 - blur,keydown
   *  2.获取新的件数，重新计算件数和总价
   */
  $('.item-list').on('blur keydown', '.number', function (e) {
    if (e.keyCode == 13 || e.type === 'focusout') {
      //获取修改后的数量
      var number = parseInt($(this).val());
      if (isNaN(number)) {
        alert('数量必须是数字');
        return;
      }
      // 把数据更新到本地存储里面
      var id = parseInt($(this).parents('.item').attr('data-id'));
      var arr = loadData('shopCart');
      var good = arr.find(function (e) {
        return e.pID === id;
      });
      // console.log(good);
      good.number = number;
      // 存到本地存储里面
      saveData('shopCart', arr);
      // 计算总件数和总价 - 之前约定好了，计算总价和总件数，是从本地存储中取数据
      sumMoney();
    }

  });
});