import productModal from "./product_modal.js";

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "kakachiu";

// 加入全部規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 加入多國語系
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true // 調整為輸入字元立即進行驗證
});

const app = Vue.createApp({
  data() {
    return {
      products: [],
      carts: {},
      modal: "",
      temp: {},
      disable: "", // disabled
      detailLoading: false, // 查看更多讀取效果
      addLoading: false, // 加入購物車讀取效果
      user: {
        email: "",
        name: "",
        tel: "",
        address: ""
      },
      message: ""
    };
  },
  components: {
    productModal
  },
  methods: {
    // 電話驗證
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
    //送出表單
    sendForm() {
      // 當購物車無品項時跳出提示並清空輸入框
      if (this.carts.carts.length < 1) {
        alert("購物車無商品");
        // this.user = {}; 使用此方法會再次觸發驗證，會變成紅一片
        this.$refs.form.resetForm(); // 清空欄位，resetForm() 為 veevalidate 的方法
        return;
      }

      this.sendOrder(); // 訂單成立後購物車會清空
      this.$refs.form.resetForm(); // 表單成功送出清空欄位，resetForm() 為 veevalidate 的方法
    },
    // 送出訂單
    sendOrder() {
      const orderInfo = {
        user: this.user,
        message: this.message
      };
      axios
        .post(`${url}/api/${path}/order`, { data: orderInfo })
        .then(res => {
          alert(res.data.message);
          this.getCarts();
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 取得客戶端所有產品
    getProducts() {
      axios
        .get(`${url}/api/${path}/products/all`)
        .then(res => {
          this.products = res.data.products;
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 加入購物車
    addCard(id) {
      this.disable = id; // 將 disabled 變數指向當前 id
      this.addLoading = true; //  讀取資料開啟 loading 效果
      const cart = {
        product_id: id,
        qty: 1
      };
      axios
        .post(`${url}/api/${path}/cart`, { data: cart })
        .then(res => {
          alert(res.data.message);
          this.getCarts();
          this.disable = ""; // 資料讀取完畢清空 id
          this.addLoading = false; // 資料讀取完成關閉 loading 效果
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 獲取全部購物車
    getCarts() {
      axios
        .get(`${url}/api/${path}/cart`)
        .then(res => {
          this.carts = res.data.data;
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 刪除單一購物車品項
    delCard(id) {
      axios
        .delete(`${url}/api/${path}/cart/${id}`)
        .then(res => {
          alert(res.data.message);
          this.getCarts();
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 刪除全部購物車
    delAllCarts() {
      axios
        .delete(`${url}/api/${path}/carts`)
        .then(res => {
          alert(res.data.message);
          this.getCarts();
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 更新購物車數量
    update(item, index) {
      // 將完整品項內容帶入
      this.disable = item.id; // 將 disabled 變數指向當前 id
      const upsateCart = {
        product_id: item.product_id, // 注意: 這裡帶入產品的 id
        qty: parseInt(this.$refs.numInput[index].value) // 另一種方式 item.qty
      };
      axios
        .put(`${url}/api/${path}/cart/${item.id}`, { data: upsateCart })
        .then(res => {
          alert(res.data.message);
          this.getCarts();
          this.disable = ""; // 資料讀取完畢清空 id
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    },
    // 查看單一產品
    productDetail(id) {
      this.disable = id; // 將 disabled 變數指向當前 id
      this.detailLoading = true; // 讀取資料開啟 loading 效果
      axios
        .get(`${url}/api/${path}/product/${id}`)
        .then(res => {
          this.temp = res.data.product;
          console.log(this.temp);
          this.modal.show(); // 取得單一產品資訊再打開 modal
          this.disable = ""; // 資料讀取完畢清空 id
          this.detailLoading = false; // 資料讀取結束關閉 loading 效果
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    }
  },
  created() {
    this.getProducts();
    this.getCarts();
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: "static"
    });
  }
});

// 註冊全域的表單驗證元件
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

app.mount("#app");
