const { addToCart,calculateTotal,applyDiscount } = require("./cartUtils");
var carts=[];

for(let i=1;i<=10;i++){
    addToCart(carts,i);
}
console.log("cart: ",carts);
console.log("TOTAL cost",calculateTotal(carts));
console.log("Discounted cost",applyDiscount(calculateTotal(carts),50));