import { useReactNavigationQuery } from "./useReactNavigationQuery";
import { getData } from "../../apis/apiMethods";

type paramProps = {
  productId?: string;
};

const getProduct = async ({ queryKey }: any) => {
  const { productId } = queryKey[1];
  const data = await getData(`/products/${productId}.json`);
  return data;
};

export default function useProduct({ productId }: paramProps) {
  return useReactNavigationQuery(["getProduct", { productId }], getProduct, {
    enabled: productId?.length ? true : false,
  });
}
