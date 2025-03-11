

let eventBus = new Vue()

// Vue.component('product-detail-shipping', {
//     props:{
//         details: {
//             type: Array,
//             required: false
//         },
//         shipping: {
//             type: Array,
//             required: false
//         }
//     },
//
//     template: `
//     <div class="tab">
//          <ul>
//             <span class="tab"
//                   :class="{'activeTab': selectedTab === tab}"
//                   v-for="(tab, index) in tabs"
//                   :key="index"
//                   @click="selectedTab = tab"
//             >{{ tab }}</span>
//          </ul>
//          <div v-show="selectedTab === 'Details'">
//             <product-details :details="details"></product-details>
//          </div>
//          <div v-show="selectedTab === 'Shipping'">
//             <p>{{ shipping }}</p>
//          </div>
//
//     </div>
//     `,
//     data() {
//         return {
//             tabs: ['Details', 'Shipping'],
//             selectedTab: 'Details',
//         }
//     },
// })

Vue.component('product-tabs', {
    props: {
      reviews: {
          type: Array,
          required: false,
      },
        details: {
            type: Array,
            required: false
        },
        shipping: {
            type: Array,
            required: false
        }
    },

    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               :key="index"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              </li>
            </ul>

       </div>
       <div v-show="selectedTab === 'Make a Review'"> 
            <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Details'">
            <product-details :details="details"></product-details>
         </div>
         <div v-show="selectedTab === 'Shipping'">
            <p>{{ shipping }}</p>
         </div>
     </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Details', 'Shipping'],
            selectedTab: 'Reviews',
        }
    },
})


Vue.component('product-review', {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
     
        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>
            <label for="recommend">Would you recommend this product?></label><br>
            <input type="radio" id="yes" value="Yes" v-model="recommend"> Yes
            <input type="radio" id="no" value="No" v-model="recommend"> No
        </p>

        <p>
          <input type="submit" value="Submit">
        </p>
      </form>
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        recommend: null,
        errors: [],
      };
    },
    methods: {
      onSubmit() {
        if(this.name && this.review && this.rating) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating

            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
        } else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.errors.push("Recommendation required.");
        }
      },
    },
  });



Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :alt="altText" :src="image">
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p :class="{ textOut: !inStock }" v-else>Out of stock</p>
            <span>{{ onSale }}</span>
            
            
            
            <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{ backgroundColor:variant.variantColor }"
                 @mouseover="updateProduct(index)">
            </div>
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
                Add to cart
            </button>
            <button v-on:click="deleteToCart">Delete to cart</button>
           
        </div>
        
        <product-tabs :reviews="reviews" :details="details" :shipping="shipping"></product-tabs>
        

        
    </div>
    <a :href="link">More products like this</a>
    `,
    data () {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.",
            onSale: "On Sale",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,

                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,

                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
            this.variants[this.selectedVariant].variantId);
        },
        deleteToCart() {
            this.$emit('delete-to-cart',
            this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },
    computed: {
        title(){
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping(){
            if(this.premium){
                return "Free";
            }else{
                return 2.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }

});

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
        },
    },
    template:`
        <ul>
            <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
    `,
});





let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],        
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        delCart(id){
            this.cart.pop(id);
        },
    }
});
