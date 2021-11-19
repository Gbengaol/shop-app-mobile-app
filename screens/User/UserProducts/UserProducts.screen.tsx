import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../../components/HeaderButton/HeaderButton.component";
import ProductItem from "../../../components/ProductItem/ProductItem.component";
import Colors from "../../../constants/Colors";
import { UserStackParamList } from "../../../types";
import useProducts from "../../../hooks/http-hooks/useProducts";
import { errorHandler } from "../../../helpers/errorHandler";
import { deleteData } from "../../../apis/apiMethods";
import { useQueryClient } from "react-query";
import { useTypedSelector } from "../../../hooks/redux-hooks/useTypedSelector";

interface UserProductsProps {}

type ProductDetailNavigatorProps = NativeStackNavigationProp<
  UserStackParamList,
  "UserProducts"
>;

const UserProducts: FC<UserProductsProps> = ({}) => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const userId = useTypedSelector((state) => state.auth?.userId);
  const navigation: any = useNavigation<ProductDetailNavigatorProps>();
  const userProducts = products?.filter(
    (product) => product.ownerId === userId
  );

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const queryClient = useQueryClient();
  const token = useTypedSelector((state) => state.auth?.token);

  const deleteProduct = async (productId: string) => {
    try {
      setIsError("");
      setLoading(true);
      await deleteData(`/products/${productId}.json?auth=${token}`, {});
      queryClient.invalidateQueries(["getProduct", { productId }]);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setIsError(errorHandler(error));
      setLoading(false);
    }
  };

  const deleteHandler = (id: string) => {
    Alert.alert("Are you sure", "Do you want to delete this item?", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => deleteProduct(id),
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Products",
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Menu"
              iconName="ios-menu"
              onPress={() => navigation.toggleDrawer()}
            />
          </HeaderButtons>
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Menu"
              iconName="ios-create"
              onPress={() => navigation.navigate("EditProduct")}
            />
          </HeaderButtons>
        );
      },
    });
  }, [navigation]);

  if (error || isError) {
    return (
      <View style={styles.centered}>
        <Text>{errorHandler(error || isError)}</Text>
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
      {isLoading || loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.tint} size="large" />
        </View>
      ) : !userProducts?.length ? (
        <View style={styles.centered}>
          <Text>No products found. Start adding products</Text>
        </View>
      ) : (
        <FlatList
          data={userProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem product={item} onSelect={() => {}}>
              <Button
                title="Edit"
                onPress={() =>
                  navigation.navigate("EditProduct", {
                    productId: item.id,
                  })
                }
                color={Colors.primary}
              />
              <Button
                title="Delete"
                onPress={() => deleteHandler(item.id)}
                color={Colors.tint}
              />
            </ProductItem>
          )}
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
export default UserProducts;
