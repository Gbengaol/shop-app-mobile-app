import { useReactNavigationQuery } from "./useReactNavigationQuery";
import { apiEndpoints } from "../../apis/apiEndpoints";
import { getData } from "../../apis/apiMethods";
import { IOrder } from "../../interfaces/order";

type paramProps = {
  userId?: string;
};

const getOrders = async ({ queryKey }: any) => {
  const { userId } = queryKey[1];
  const data = await getData(`${apiEndpoints.ORDERS}/${userId}.json`);

  const result: Array<IOrder> = [];
  for (const key in data) {
    result.push({
      id: key,
      totalAmount: data[key].totalAmount,
      items: data[key].items,
      date: data[key].date,
    });
  }
  return result;
};

export default function useOrders({ userId }: paramProps) {
  return useReactNavigationQuery(["getOrders", { userId }], getOrders, {
    refetchOnWindowFocus: true,
    enabled: userId?.length ? true : false,
  });
}
