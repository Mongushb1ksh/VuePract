Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
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
            
            <product-details :details="details"></product-details>

            <p>Shipping: {{ shipping }}</p>
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
            <button v-on:click="deleteToCart">Add to cart</button>

            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>

        </div>
        <a :href="link">More products like this</a>
    </div>
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

            cart: 0,
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        deleteToCart() {
            this.cart -= 1
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
        
    }
});
