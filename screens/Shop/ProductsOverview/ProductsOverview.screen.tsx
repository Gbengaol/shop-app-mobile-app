import React, { FC, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  Text,
} from "react-native";
import ProductItem from "../../../components/ProductItem/ProductItem.component";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useActions } from "../../../hooks/redux-hooks/useActions";
import CustomHeaderButton from "../../../components/HeaderButton/HeaderButton.component";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Colors from "../../../constants/Colors";
import useProducts from "../../../hooks/http-hooks/useProducts";
import { errorHandler } from "../../../helpers/errorHandler";

interface ProductsOverviewProps {}

type ProductDetailNavigatorProps = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

const ProductsOverview: FC<ProductsOverviewProps> = () => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const navigation: any = useNavigation<ProductDetailNavigatorProps>();
  const { addToCart } = useActions();

  const selectHandler = (id: string) => {
    navigation.navigate("ProductDetail", {
      productId: id,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="cart"
            iconName="ios-cart"
            onPress={() => navigation.navigate("Cart")}
          />
        </HeaderButtons>
      ),
      headerTitle: "Products",
    });
  }, [navigation]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{errorHandler(error)}</Text>
        <Button
          title="Try Again"
          onPress={() => refetch()}
          color={Colors.tint}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.tint} size="large" />
        </View>
      ) : !products?.length ? (
        <View style={styles.centered}>
          <Text>No products found. Start adding products</Text>
        </View>
      ) : (
        <FlatList
          onRefresh={refetch}
          refreshing={isLoading}
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ProductItem
                product={item}
                onSelect={() => selectHandler(item.id)}
              >
                <Button
                  title="View Details"
                  onPress={() => selectHandler(item.id)}
                  color={Colors.primary}
                />
                <Button
                  title="To Cart"
                  onPress={() => addToCart(item)}
                  color={Colors.tint}
                />
              </ProductItem>
            );
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ProductsOverview;
