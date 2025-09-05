const addToCart=(cart, item)=>{
    cart.push(item);
}
const calculateTotal=(cart)=>{
    var val=cart.reduce((acc,x)=>acc+x,0);
    return val;
}

const applyDiscount=(total, discountPercentage)=>{
    return total-((discountPercentage*total)/100);
}

module.exports={addToCart,calculateTotal,applyDiscount};