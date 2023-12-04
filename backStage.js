const _apiPath = "cd131423";
const apiKey = "8ysxoVAZSXNFWQAdYb6PiNTWUkD3";
const orderPageList = document.querySelector(".orderPage-body");
const discardAllBtn = document.querySelector(".discardAllBtn");

let orderData = [];
let orderDataProducts = [];
//獲取訂單資料(GET)
function getOrderData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${_apiPath}/orders`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    )
    .then(function (res) {
      orderData = res.data.orders;
      renderOrderData();
      orderData.forEach((item) => {
        let orderDataProducts = item.products;
        getChartData(orderDataProducts);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}
// [
//   ["Louvre 雙人床架", 1],
//   ["Antony 雙人床架", 2],
//   ["Anty 雙人床架", 3],
//   ["其他", 4],
// ],

//整理圖表所有格式
function getChartData(orderDataProducts) {
  let obj = {};
  let chartData = [];
  let categoryArr = [];
  let colorArr = ["#501ad9", " #815ae4", " #a387ea", "#b39ee9"];

  orderDataProducts.forEach((item) => {
    if (obj[item.category] === undefined) {
      obj[item.category] = item.quantity;
    } else {
      obj[item.category] += item.quantity;
    }
    chartData = Object.entries(obj);
    colorKeys = Object.keys(obj);
  });
  console.log(colorKeys);
  let resultObj = {};
  function getColor(category, color) {
    category.forEach((item, index) => {
      resultObj[item] = color[index];
    });
  }
  let colorPalete = getColor(colorKeys, colorArr);
  console.log(resultObj);

  let chart = c3.generate({
    bindto: "#chart-category", // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartData,
      colors: resultObj,
    },
  });
  let chart2 = c3.generate({
    bindto: "#chart-title", // HTML 元素綁定
    data: {
      type: "pie",
      columns: chartData,
      colors: resultObj,
    },
  });
}
//渲染訂單資料畫面
function renderOrderData() {
  let str = "";
  orderData.forEach((item) => {
    if (item.paid == false) {
      orderStatusContent = "未處理";
    } else if (item.paid == true) {
      orderStatusContent = "已處理";
    }

    str += ` <tr>
    <td>${item.id}</td>
    <td>
      <p>${item.user.name}</p>
      <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
      <p>${item.products[0].title}</p>
    </td>
    <td>2021/03/08</td>
    <td class="orderStatus" >
      <a href="#" data-id="${item.id}" data-content="${item.paid}" >${orderStatusContent}</a>
    </td>
    <td>
      <input type="button" data-id="${item.id}" class="delSingleOrder-Btn" value="刪除" />
    </td>
  </tr>`;
  });
  orderPageList.innerHTML = str;
  const orderStatus = document.querySelectorAll(".orderStatus");
  const delSingleOrderBtn = document.querySelectorAll(".delSingleOrder-Btn");
  //監聽訂單狀態按鈕
  orderStatus.forEach((item) => {
    item.addEventListener("click", changeStatus);
  });
  //監聽刪除按鈕
  delSingleOrderBtn.forEach((item) => {
    item.addEventListener("click", deleteSingleOrder);
  });
}
//更改訂單狀態（PUT)
function changeStatus(e) {
  e.preventDefault();
  // console.log(e.target.dataset.id);
  //原本為字串要轉為布林值
  // console.log(!JSON.parse(e.target.dataset.content));

  let orderStatusData = {
    id: e.target.dataset.id,
    paid: !JSON.parse(e.target.dataset.content),
  };
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${_apiPath}/orders`,
      { data: orderStatusData },
      {
        headers: {
          Authorization: apiKey,
        },
      }
    )
    .then(function (res) {
      console.log(res.data);
      getOrderData();
    });
}
//刪除單筆訂單資料(DELETE)
function deleteSingleOrder(e) {
  e.preventDefault();
  console.log(e.target.dataset.id);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${_apiPath}/orders/${e.target.dataset.id}`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    )
    .then(function (res) {
      getOrderData();
      alert("刪除成功");
    })
    .catch(function (err) {
      console.log(err);
    });
}
//監聽刪除全部訂單按鈕
discardAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteAllOrder();
});
//刪除全部訂單資料(DELETE)
function deleteAllOrder() {
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${_apiPath}/orders`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    )
    .then(function (res) {
      console.log(res.data);
      getOrderData();
      alert("訂單已全部清空");
    })
    .catch(function (error) {
      console.log(error);
      if (error.response.status === 400) {
        alert("目前訂單內沒有東西喔！");
      }
    });
}

getOrderData();
