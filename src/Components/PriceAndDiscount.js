import {React , useState, useEffect} from "react";
import {getPriceAndDiscountData} from "../Services/PriceAndDiscountData";

const PriceAndDiscount = () => {
  const [PriceAndDiscountData, setPriceAndDiscountData] = useState({ prices: [] });
  useEffect(() => {
    getPriceAndDiscountData().then((response) => {
      setPriceAndDiscountData(response);
    });
    document.title = "PriceAndDiscount";
  }, []);

  return (
    <div className="flex space-x-10">
      <label for="place" class="block font-medium text-sm text-gray-600">
              You can find the best prices here :
            </label>
      {PriceAndDiscountData.prices.map((price) => (
        <>
        <span className="text-lg font-bold text-teal-500">Best Price : €{price.discountPrice}</span>
        <span className="line-through font-bold text-red-600">Original Price : €{price.originalPrice}</span>
        </>
      ))}
    </div>
  );
};

export default PriceAndDiscount;
