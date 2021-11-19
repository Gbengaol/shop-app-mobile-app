// This is a wrapper around react query that solves refetchOnFocus issue in react native

import { useFocusEffect } from "@react-navigation/core";
import { useCallback } from "react";
import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

export function useReactNavigationQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const useQueryReturn = useQuery(queryKey, queryFn, options);

  useFocusEffect(
    useCallback(() => {
      if (
        ((options?.refetchOnWindowFocus && useQueryReturn.isStale) ||
          options?.refetchOnWindowFocus === "always") &&
        options.enabled !== false
      )
        useQueryReturn.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options?.enabled, options?.refetchOnWindowFocus])
  );

  return useQueryReturn;
}
