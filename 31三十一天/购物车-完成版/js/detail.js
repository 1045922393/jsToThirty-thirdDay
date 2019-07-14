$(function () {
  let id = location.search;
  // console.log(location)
  id = id.slice(4);
  let showTarget = phoneData.find(function (e) {

    return e.pID.toString() == id;
  })    //寻找id等于pID的对象
  $('.sku-name').text(showTarget.name)
  $('.preview-img img').attr('src', showTarget.imgSrc)
  // $('.big').hide()
  $('.summary-price em').text(`￥${showTarget.price}`)

  $('.preview-img').on('mouseover', function () {
    // $('.zoom').on('mouseover', function () {
    $('.big').css('visibility', 'visible')
    $('.mask').show()
  })
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
    $('.big').html(`<img src=${showTarget.imgSrc}>`)
  })

  $('.preview-img').on('mouseleave', function () {
    // $('.zoom').on('mouseout', function () {
    $('.big').css('visibility', 'hidden');
    // console.log(123);
    $('.mask').hide()
  })


  $('.add').on('click', function () {
    $('.reduce').removeClass('disabled');
    let chooseNum = parseInt($('.choose-number').val())
    chooseNum++;
    $('.choose-number').val(chooseNum)
  })
  $('.choose-number').on('keydown', function (e) {
    e.preventDefault();
  })
  $('.reduce').on('click', function () {
    if (parseInt($('.choose-number').val()) == 1) {
      return;
    }
    let chooseNum = parseInt($('.choose-number').val())
    chooseNum--;
    if (chooseNum == 1) {
      $('.reduce').addClass('disabled');
    }
    $('.choose-number').val(chooseNum)
  })
  let localData = localStorage.getItem('myshopcar');
  let localDataArr;
  if (localData) {
    localDataArr = JSON.parse(localData);
  } else {
    localDataArr = new Array();
    // console.log(localDataArr)
  }

  // console.log(localData)
  // let localDataArr = JSON.parse(localData);
  // let localData = [];
  // localData.push()
  $('.addshopcar').on('click', function () {
    showTarget.number = $('.choose-number').val();
    localDataArr.push(showTarget);
    let myShopCar = JSON.stringify(localDataArr);
    localStorage.setItem('myshopcar', myShopCar);
  })


  $('.addshopcar').attr('href', `./cart.html`);








})