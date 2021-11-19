import { apiEndpoints } from "../../apis/apiEndpoints";
import { getData } from "../../apis/apiMethods";
import { IProduct } from "../../interfaces/product";
import { useReactNavigationQuery } from "./useReactNavigationQuery";

const getProducts = async () => {
  const data = await getData(apiEndpoints.PRODUCTS);

  const result: Array<IProduct> = [];
  for (const key in data) {
    result.push({
      id: key,
      title: data[key].title,
      imageUrl: data[key].imageUrl,
      description: data[key].description,
      price: data[key].price,
      ownerId: data[key].ownerId,
      ownerPushToken: data[key].ownerPushToken,
    });
  }
  return result;
};

export default function useProducts() {
  return useReactNavigationQuery(["getProducts"], getProducts, {
    refetchOnWindowFocus: true,
  });
}
