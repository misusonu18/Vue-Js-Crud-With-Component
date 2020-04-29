Vue.component("product-create",{
    template: '#productCreateTemplate',
    data() {
        return {
            productName: "",
            productPrice: "",
            productImage: "",   
            Items: [],
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
                this.Items.push({id: incrementValue,name: this.productName,price: this.productPrice,image: this.productImage});
                this.$emit("productitem",this.Items);
                this.Items = [];
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
        productitems: {
            type: Array,
            Required: true
        },
        cartitems: {
            type: Array
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
            // cartItems: [],
            finalSubTotal: "",
        }
    },
    created() {
        this.totalAmountDisplay();
    },
    methods: {
        deleteProduct: function(index){
            this.productitems.splice(index,1);
        },

        updateProduct(index) {
            this.arrayIndex = index;
            this.id = this.productitems[index]['id'];
            this.editProductName = this.productitems[index]['name'];
            this.editProductPrice = this.productitems[index]['price'];
            this.editProductImage = this.productitems[index]['image'];
            this.editProduct = true;
        },

        productButtonEdit: function(){
            Vue.set(this.productitems, this.arrayIndex, {id:this.id, name:this.editProductName, price:this.editProductPrice, image:this.editProductImage});
            this.editProductName = "";
            this.editProductPrice = "";
            this.editproductImage = "";
            this.editProduct = false;
        },

        addToCart: function(index) {
            let cartProductName = this.productitems[index]['name'];
            let cartProductPrice = this.productitems[index]['price'];
            let cartProductImage = this.productitems[index]['image'];
            let cartProductQuantity = 1;

            this.cartitems.filter(obj => {
                if (obj.name === cartProductName) {
                    this.cartCheckVariable = obj.name;
                }
            });

            if (this.cartCheckVariable) {
                for (i=0; i < this.cartitems.length; i++) {
                  if (this.cartitems[i].name == this.cartCheckVariable) {
                      var tempCartProductQuantity = this.cartitems[i].quantity + 1;
                      Vue.set(this.cartitems, i, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:tempCartProductQuantity});
                  }
                }
                this.cartCheckVariable = "";
            }
            else {
                this.cartitems.push(
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
            if (this.cartitems.length) {
                this.finalSubTotal = 0;
                for (let i = 0; i < this.cartitems.length; i++) {
                    this.finalSubTotal += this.cartitems[i].quantity * this.cartitems[i].price;
                }
            }   
            
        },
    }
});

Vue.component("cart-component", {
    props: {
        cartitems: {
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
            this.cartitems.forEach(item => {
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

            this.cartitems.forEach(item => {
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
        payable: function() {
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
            let cartProductName = this.cartitems[index]['name'];
            let cartProductPrice = this.cartitems[index]['price'];
            let cartProductImage = this.cartitems[index]['image'];
            let cartProductQuantity = this.cartitems[index]['quantity'] + 1;

            Vue.set(this.cartitems, index, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:cartProductQuantity});
            // this.totalAmountDisplay();
            this.checkSubtotal();
        },

        subtractProductCartQuantity: function(index) {
            let cartProductName = this.cartitems[index]['name'];
            let cartProductPrice = this.cartitems[index]['price'];
            let cartProductImage = this.cartitems[index]['image'];
            let cartProductQuantity = this.cartitems[index]['quantity'] - 1;

            this.cartitems.filter(obj => {
                if (obj.name === cartProductName) {
                    this.cartCheckQuantity = obj.quantity;
                }
            });
            if (this.cartCheckQuantity <= 1) {
                this.cartitems.splice(index,1);
            }
            else {
                Vue.set(this.cartitems, index, {name:cartProductName, price:cartProductPrice, image:cartProductImage, quantity:cartProductQuantity});
            }
            this.totalAmountDisplay();
        },

        deleteProductCart: function(index) {
            this.cartitems.splice(index,1);
            this.totalAmountDisplay();
        },
        totalAmountDisplay: function() {
            console.log(this.subTotal);
            
            if (this.cartitems.length) {
                this.subTotal = 0;
                for (let i = 0; i < this.cartitems.length; i++) {
                    this.subTotal += this.cartitems[i].quantity * this.cartitems[i].price;
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
    el: '#app',
    data: {
        productItems: [],
        cartItems: [],
    },
    methods: {
        updateProduct:function(e) {
            let id = e[0]['id'];
            let name = e[0]['name'];
            let price = e[0]['price'];
            let image = e[0]['image'];
            this.productItems.push({id:id,name:name,price:price,image:image});
        }
    },
});
