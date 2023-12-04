const _apiPath = "cd131423";
const productList = document.querySelector(".productWrap");
const cartList = document.querySelector(".shoppingCart-table");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfo = document.querySelector("#orderInfo");
const orderInfoInputs = document.querySelectorAll(".orderInfo-input");
const orderInfoMsgs = document.querySelectorAll(".orderInfo-message");
const productSelect = document.querySelector(".productSelect");

let productsData = [];
let cartsList = [];
let cartFinalTotal = 0;

//取得產品列表(Get)
function getProductsData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/products`
    )
    .then(function (res) {
      productsData = res.data.products;
      console.log(productsData);
      renderProductsData(productsData);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
//取得購物車列表(Get)
function getCartData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/carts`
    )
    .then(function (res) {
      cartsList = res.data.carts;
      cartFinalTotal = res.data.finalTotal;
      console.log(cartsList);
      renderCartsList();
    })
    .catch(function (error) {
      console.log(error);
    });
}
//加入購物車(POST)
function addCart(id) {
  let obj = {
    data: {
      productId: id,
      quantity: 1,
    },
  };

  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/carts`,
      obj
    )
    .then(function (res) {
      alert("恭喜成功加入購物車喔！");
      getCartData();

      //renderCartsList();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}
//清除購物車內全部產品(DELETE)
function deleteAll() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/carts`
    )
    .then(function (res) {
      getCartData();
      //renderCartsList();
    })
    .catch(function (error) {
      if (
        error.response.data.message ===
        "購物車內已經沒有商品了 RRR ((((；゜Д゜)))"
      ) {
        alert(error.response.data.message);
      }
      console.log(error);
    });
}
//刪除購物車內特定產品(DELETE)
function deleteItem(id) {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/carts/${id}`
    )
    .then(function (res) {
      getCartData();
    })
    .catch(function (error) {
      console.log(error);
    });
}
//監聽篩選器選項
productSelect.addEventListener("change", function (e) {
  console.log(e.target.value);
  //將篩選的資料賦予至新的變數資料上
  const filterProductData = productsData.filter(
    (item) => e.target.value == item.category
  );
  console.log(filterProductData);
  if (e.target.value == "全部") {
    renderProductsData(productsData);
  } else if (e.target.value !== "全部" && filterProductData.length == 0) {
    renderNoResult();
  } else {
    renderProductsData(filterProductData);
  }
});

//渲染篩選器無內容
function renderNoResult() {
  productList.innerHTML = "<h2>目前沒有符合篩選條件的商品</h2>";
}

//渲染商品列表
function renderProductsData(Data) {
  let str = "";
  Data.forEach((item) => {
    str += ` 
    <li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src="${item.images}"
      alt=""
    />
    <a href="#" class="addCartBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>`;
  });
  productList.innerHTML = str;
  const addCartBtn = document.querySelectorAll(".addCartBtn");
  addCartBtn.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      addCart(e.target.dataset.id);
    });
  });
}

//渲染購物車列表
function renderCartsList() {
  let str = "";

  let title = `<tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
   </tr>`;
  let end = `<td>
<a href="#" class="discardAllBtn">刪除所有品項</a>
</td>
<td></td>
<td></td>
<td>
<p>總金額</p>
</td>
   <td>NT$${cartFinalTotal}</td>`;
  cartsList.forEach((item) => {
    str += `
    <tr >
            <td>
              <div class="cardItem-title">
                <img
                  src="${item.product.images}"
                  alt=""
                />
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>${item.product.price}</td>
           <td class="quantityNum "> 
           <input type = "button" value=" - " class="quantityBtn -btn" data-id = "${
             item.id
           }" data-item = "${item.quantity}">
           ${item.quantity} 
           <input type = "button" value=" + " class="quantityBtn +btn" data-id = "${
             item.id
           }" data-item = "${item.quantity}"></td>
            <td>${item.product.price * item.quantity}
            </td>
            <td class="discardBtn">
              <a href="#" class="material-icons discardBtn-dom" data-id = "${
                item.id
              }" > clear </a>
            </td>
          </tr>`;
  });

  cartList.innerHTML = title + str + end;
  const discardBtn = document.querySelectorAll(".discardBtn-dom");
  const discardAllBtn = document.querySelector(".discardAllBtn");
  const quantityBtn = document.querySelectorAll(".quantityBtn");
  const quantityNum = document.querySelectorAll(".quantityNum");
  //監聽刪除所有品項按鈕
  discardAllBtn.addEventListener("click", function (e) {
    e.preventDefault();
    deleteAll();
  });
  //監聽x按鈕
  discardBtn.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      deleteItem(e.target.dataset.id);
    });
  });
  //監聽改變數量按鈕
  quantityBtn.forEach((item) => {
    item.addEventListener("click", function (e) {
      const itemId = e.target.dataset.id;
      let itemNum = e.target.dataset.item;
      e.target.value == " + " ? itemNum++ : itemNum--;
      updateQuantity(itemId, itemNum);
    });
  });
}
//更新產品數量
function updateQuantity(id, itemNum) {
  axios
    .patch(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/carts`,
      {
        data: { id: id, quantity: itemNum },
      }
    )
    .then(function (res) {
      console.log(res.data);
      getCartData();
    })
    .catch(function (err) {
      console.log(err);
      if (
        err.response.data.message == "產品數量不可小於 1 RRR ((((；゜Д゜)))"
      ) {
        alert("數量不可以少於一件");
      }
    });
}
//監聽送出訂單按鈕
let userInfo = {};
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  userInfo = {
    data: {
      user: {
        name: customerName.value,
        tel: customerPhone.value,
        email: customerEmail.value,
        address: customerAddress.value,
        payment: tradeWay.value,
      },
    },
  };
  addAlertMsg();
  deliverOrder();
});
//送出訂單(POST)
function deliverOrder() {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/orders`,
      userInfo
    )
    .then(function (res) {
      alert("成功送出訂單");
      getCartData();
      clearUserInfo();
    })
    .catch(function (error) {
      console.log(error);
      if (
        error.response.data.message ==
        "當前購物車內沒有產品，所以無法送出訂單 RRR ((((；゜Д゜)))"
      ) {
        alert("購物車內沒有東西喔！快去買吧！");
      }
    });
}
//渲染必填訊息
function addAlertMsg() {
  orderInfoInputs.forEach((item, i) => {
    //精簡寫法
    orderInfoMsgs[i].textContent =
      item.value.trim() === "" ? `${orderInfoMsgs[i].dataset.message}必填` : "";
    // if (item.value.trim() === "") {
    //   orderInfoMsgs[i].textContent = `${orderInfoMsgs[i].dataset.message}必填`;
    // } else if (orderInfoMsgs[i]) {
    //   orderInfoMsgs[i].textContent = "";
    // }
  });
}
//清空用戶欄位資料
function clearUserInfo() {
  orderInfoInputs.forEach((item, i) => {
    item.value = "";
    tradeWay.value = "ATM";
  });
}
//獲取訂單資料(GET)
function getOrderData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${_apiPath}/orders`
    )
    .then(function (res) {
      console.log(res.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

getProductsData();
getCartData();
