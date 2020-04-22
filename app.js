Vue.component("product-create",{
    template: '#productCreateTemplate',
    data() {
        return {
            productName: "",
            productPrice: "",
            productImage: "",   
            productItems: [],
            editProduct: false,
            addProduct: true,
        }
    },
    methods: {
        addNewProduct() {
            let incrementValue = 0;
            if (this.productName && this.productPrice) {
                incrementValue = incrementValue + 1;
                this.errors = [];
                this.productItems.push({id: incrementValue,name: this.productName,price: this.productPrice,image: this.productImage});
                this.productPrice = "";
                this.productName = "";
                this.productImage = "";
            }
            else{
                this.errors = [];
                
                if (!this.productName) {
                    this.errors.push("Name Required....");
                }
                
                if (!this.productPrice) {
                    this.errors.push("Price Required....");
                }

                if (!this.productImage) {
                    this.errors.push("Image Required....");
                }
            }
        }
    },
});

Vue.component("product-retrive", {
    props: {
        productItems: {
            type: Array,
            Required: true
        }
    },
    template: '#productRetriveTemplate',
    data() {
        return {
            id: "",
            editProduct: false,
            editProductPrice: "",
            editProductName: "",
            editProductImage: "",
            cartCheckVariable: "",
            cartCheckQuantity: "",
            cartItems: [],
            finalSubTotal: "",
        }
    },
    created() {
        this.totalAmountDisplay();
    },
    methods: {
        deleteProduct: function(index){
            this.productItems.splice(index,1);
        },

        updateProduct(index) {
            this.arrayIndex = index;
            this.id = this.productItems[index]['id'];
            this.editProductName = this.productItems[index]['name'];
            this.editProductPrice = this.productItems[index]['price'];
            this.editProductImage = this.productItems[index]['image'];
            this.editProduct = true;
        },

        productButtonEdit: function(){
            Vue.set(this.productItems, this.arrayIndex, {id:this.id, name:this.editProductName, price:this.editProductPrice, image:this.editProductImage});
            this.editProductName = "";
            this.editProductPrice = "";
            this.editproductImage = "";
            this.editProduct = false;
        },

        addToCart: function(index) {
            let cartProductName = this.productItems[index]['name'];
            let cartProductPrice = this.productItems[index]['price'];
            let cartProductImage = this.productItems[index]['image'];
            let cartProductQuantity = 1;

            this.cartItems.filter(obj => {
                if (obj.name === cartProductName) {
                    this.cartCheckVariable = obj.name;
                }
            });

            if (this.cartCheckVariable) {
                for (i=0; i < this.cartItems.length; i++) {
                  if (this.cartItems[i].name == this.cartCheckVariable) {
                      var tempCartProductQuantity = this.cartItems[i].quantity + 1;
                      Vue.set(this.cartItems, i, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:tempCartProductQuantity});
                  }
                }
                this.cartCheckVariable = "";
            }
            else {
                this.cartItems.push(
                    {
                        name:cartProductName,
                        price:cartProductPrice,
                        image:cartProductImage,
                        quantity:cartProductQuantity
                    }
                )
            }
            this.totalAmountDisplay();
        },
        totalAmountDisplay: function() {
            if (this.cartItems.length) {
                this.finalSubTotal = 0;
                for (let i = 0; i < this.cartItems.length; i++) {
                    this.finalSubTotal += this.cartItems[i].quantity * this.cartItems[i].price;
                }
            }   
            
        },
    }
});

Vue.component("cart-Component", {
    props: {
        cartItems: {
            type: Array,
            required: true,
        },
    },
    template: '#addToCartTemplate',
    data() {
        return {
            finalSubTotal: "",
            finalShipping: "",
            finalTotal: "",
            finalTax: "",
            fianlPayable: "",
        }
    },
    created() {
        this.checkSubtotal();
    },
    computed: {
        subTotal() {
            let subTotal = 0;
            this.cartItems.forEach(item => {
                subTotal += (item.price * item.quantity);
            });

            this.finalSubTotal = subTotal;

            return '$' + subTotal.toFixed(2);
        },
        shippingCharge() {
            let shipping = 0
            if (this.finalSubTotal > 0 && this.finalSubTotal <= 100) {
                this.shippingValue = true;
                shipping = this.finalSubTotal * 4 / 100;
                this.finalShipping = shipping;

                return '$' + shipping.toFixed(2);
            } else {
                this.finalShipping = 0;
                this.shippingValue = false;
            }
        },
        total() {
            let total = 0;

            if (this.finalSubTotal <= 100) {
                total = this.finalSubTotal;
            } else {
                total = this.finalSubTotal;
            }

            this.finalTotal = total;

            return '$' + total.toFixed(2);
        },
        tax() {
            let subTotal = 0;
            let tax = 0;

            this.cartItems.forEach(item => {
                subTotal += (item.price * item.quantity);
            });

            if (subTotal <= 100) {
                tax = this.finalTotal * 4 / 100;
                this.finalTax = tax;
            } else {
                tax = subTotal * 4 / 100;
                this.finalTax = tax;
            }

            return '$' + tax.toFixed(2);
        },
        payable() {
            let payable = this.finalTotal;

            return '$' + payable.toFixed(2);
        }
    },
    methods: {
        checkSubtotal() {
            
            if (this.subTotals) {
                this.shippingCharge = this.subTotal < 1000 ? 100 : 0;
                this.total = parseInt(this.shippingCharge) + parseInt(this.subTotal);
                this.tax = 18;
                this.payable = parseInt(this.total) + parseInt(this.tax);
            }
            else {
                this.subTotal = 0;
                this.shippingCharge = 0;
                this.total = 0;
                this.tax = 0;
                this.payable = 0;
            }
        },
        addProductCartQuantity: function(index) {
            let cartProductName = this.cartItems[index]['name'];
            let cartProductPrice = this.cartItems[index]['price'];
            let cartProductImage = this.cartItems[index]['image'];
            let cartProductQuantity = this.cartItems[index]['quantity'] + 1;

            Vue.set(this.cartItems, index, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:cartProductQuantity});
            // this.totalAmountDisplay();
            this.checkSubtotal();
        },

        subtractProductCartQuantity: function(index) {
            let cartProductName = this.cartItems[index]['name'];
            let cartProductPrice = this.cartItems[index]['price'];
            let cartProductImage = this.cartItems[index]['image'];
            let cartProductQuantity = this.cartItems[index]['quantity'] - 1;

            this.cartItems.filter(obj => {
                if (obj.name === cartProductName) {
                    this.cartCheckQuantity = obj.quantity;
                }
            });
            if (this.cartCheckQuantity <= 1) {
                this.cartItems.splice(index,1);
            }
            else {
                Vue.set(this.cartItems, index, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:cartProductQuantity});
            }
            this.totalAmountDisplay();
        },

        deleteProductCart: function(index) {
            this.cartItems.splice(index,1);
            this.totalAmountDisplay();
        },
        totalAmountDisplay: function() {
            console.log(this.subTotal);
            
            if (this.cartItems.length) {
                this.subTotal = 0;
                for (let i = 0; i < this.cartItems.length; i++) {
                    this.subTotal += this.cartItems[i].quantity * this.cartItems[i].price;
                }
                this.shippingCharge = this.subTotal < 1000 ? 100 : 0;
                this.total = parseInt(this.shippingCharge) + parseInt(this.subTotal);
                this.tax = 18;
                this.payable = parseInt(this.total) + parseInt(this.tax);
            }
            
        },
    }
});

let app = new Vue({ 
    el: '#app'
});
