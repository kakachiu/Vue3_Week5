export default {
  data() {
    return {};
  },
  props: ["temp", "modal"],
  template: `
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ temp.title }}</span>
        </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="temp.imageUrl" alt="">
        </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{ temp.category }}</span>
              <p>商品描述：{{ temp.description }}</p>
              <p>商品內容：{{ temp.content }}</p>
              <h5 v-if="temp.price === temp.origin_price "> {{ temp.price }}</h5>
              <div v-else>
                <del class="h6">原價 {{ temp.origin_price }} 元</del>
                <div class="h5">現在只要 {{ temp.price }} 元</div>
              </div>
              <div>
                <div class="input-group">
                  <input type="number" class="form-control" min="1" :value="1" ref="numInput">
                  <button type="button" class="btn btn-primary" @click="addCard(temp.id)">加入購物車</button>
              </div>
            </div>
          </div>
          </div>
          </div>
      </div>
    </div>

  `,
  methods: {
    addCard(id) {
      const url = "https://vue3-course-api.hexschool.io/v2";
      const path = "kakachiu";
      const addCart = {
        product_id: id,
        qty: parseInt(this.$refs.numInput.value)
      };
      axios
        .post(`${url}/api/${path}/cart`, { data: addCart })
        .then(res => {
          alert(res.data.message);
          this.modal.hide();
          this.$emit("getCart");
        })
        .catch(error => {
          alert(error.response.data.message);
        });
    }
  }
};
