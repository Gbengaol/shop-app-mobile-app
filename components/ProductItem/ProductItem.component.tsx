import React, { FC } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { IProduct } from "../../interfaces/product";
import Card from "../Card/Card.component";
import TouchableComponent from "../TouchableComponent/TouchableComponent.component";

interface ProductItemProps {
  product: IProduct;
  onSelect: () => void;
}

const ProductItem: FC<ProductItemProps> = ({ product, onSelect, children }) => {
  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableComponent onPress={onSelect}>
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: product?.imageUrl }} style={styles.image} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{product?.title}</Text>
              <Text style={styles.price}>
                ${Number(product?.price).toFixed(2)}
              </Text>
            </View>
            <View style={styles.actions}>{children}</View>
          </View>
        </TouchableComponent>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  touchable: {
    overflow: "hidden",
    borderRadius: 10,
  },
  imageContainer: {
    height: "60%",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  image: {
    overflow: "hidden",
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
    fontFamily: "open-sans-bold",
  },
  price: {
    fontSize: 14,
    color: "#888",
    fontFamily: "open-sans",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
});
export default ProductItem;
