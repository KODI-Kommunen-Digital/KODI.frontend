//var baseUrl = "www.someapi.com"
var priceAndDiscountObj = {

    "prices": [
        {
            id: 1,
            originalPrice: 179.99,
            discountPrice: 150.00
        }

    ]
};

export async function getPriceAndDiscountData() {
    return priceAndDiscountObj;
}

export async function updatePriceAndDiscountData(newPriceAndDiscountObj) {
    priceAndDiscountObj = newPriceAndDiscountObj;
}