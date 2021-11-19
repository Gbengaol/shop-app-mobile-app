import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  Image,
} from "react-native";
import Colors from "../../../constants/Colors";
import { useTypedSelector } from "../../../hooks/redux-hooks/useTypedSelector";
import { RootStackParamList } from "../../../types";
import { useActions } from "../../../hooks/redux-hooks/useActions";
import useProduct from "../../../hooks/http-hooks/useProduct";

interface ProductDetailProps {}

type ProductDetailRouteProps = RouteProp<RootStackParamList, "ProductDetail">;
type ProductDetailNavigatorProps = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

const ProductDetail: FC<ProductDetailProps> = ({}) => {
  const { params } = useRoute<ProductDetailRouteProps>();
  const navigation = useNavigation<ProductDetailNavigatorProps>();
  const productId = params?.productId;
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProduct({ productId });
  const { addToCart } = useActions();
  const cart = useTypedSelector((state) => state.cart);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: product?.title,
    });
  }, [navigation, params]);
  return (
    <ScrollView style={styles.screen}>
      <Image style={styles.image} source={{ uri: product?.imageUrl }} />
      <View style={styles.actions}>
        <Button
          title="Add to Cart"
          onPress={() => product && addToCart(product)}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.price}>{product?.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product?.description}</Text>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
  actions: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    height: 300,
    width: "100%",
  },
  price: {
    fontSize: 20,
    color: Colors.primary,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "open-sans-bold",
  },
  description: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
    marginVertical: 20,
    marginHorizontal: 20,
    fontFamily: "open-sans",
  },
});
export default ProductDetail;
