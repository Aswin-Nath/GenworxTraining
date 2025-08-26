def discount_based_coupon(Cart_Products,Products_list,discount):
    total_price=0
    for Product,Count in Cart_Products:
        Product_Price=Product.get_price()
        individual_price=Product_Price-((discount/100)*Product_Price)
        total_price+=individual_price*Count
    return total_price
