import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { FC, useLayoutEffect, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { UserStackParamList } from "../../../types";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../../components/HeaderButton/HeaderButton.component";
import CustomTextInput from "../../../components/TextInput/TextInput.component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { yupValidators } from "../../../helpers/yupValidators";
import { postData, patchData } from "../../../apis/apiMethods";
import { apiEndpoints } from "../../../apis/apiEndpoints";
import Colors from "../../../constants/Colors";
import { errorHandler } from "../../../helpers/errorHandler";
import useProduct from "../../../hooks/http-hooks/useProduct";
import { useQueryClient } from "react-query";
import { useTypedSelector } from "../../../hooks/redux-hooks/useTypedSelector";
import usePushNotificationHandler, {
  registerForPushNotificationsAsync,
} from "../../../notifications/PushNotificationHandler";

interface EditProductProps {}

type ProductEditRouteProps = RouteProp<UserStackParamList, "EditProduct">;
type ProductEditNavigatorProps = NativeStackNavigationProp<
  UserStackParamList,
  "EditProduct"
>;

const schema = yup.object().shape({
  title: yupValidators.genericRequired({
    message: "Enter product title",
    min: 2,
    max: 64,
  }),
  imageUrl: yupValidators.genericRequired({
    message: "Enter product image URL",
  }),
  price: yupValidators.genericRequiredNumber({
    message: "Enter product price",
  }),
  description: yupValidators.genericRequired({
    message: "Enter product description",
    min: 5,
    max: 256,
  }),
});

type FormData = {
  title: string;
  imageUrl: string;
  price: string;
  description: string;
};

const EditProduct: FC<EditProductProps> = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState("");

  const queryClient = useQueryClient();

  const { params } = useRoute<ProductEditRouteProps>();
  const navigation = useNavigation<ProductEditNavigatorProps>();
  const productId = params?.productId;
  const auth = useTypedSelector((state) => state.auth);

  const {
    data: productToEdit,
    isLoading,
    error,
    refetch,
  } = useProduct({ productId });

  const submitProduct = async (data: FormData) => {
    const { title, imageUrl, price, description } = data;
    const token = await registerForPushNotificationsAsync();

    setIsError("");
    setLoading(true);

    try {
      const newProduct = {
        title: title,
        imageUrl,
        price: Number(price),
        description: description,
        ownerId: auth?.userId,
        ownerPushToken: token,
      };
      if (productId) {
        await patchData(
          `/products/${productId}.json?auth=${auth?.token}`,
          newProduct
        );
        queryClient.invalidateQueries(["getProduct", { productId }]);
      } else {
        await postData(
          `${apiEndpoints.PRODUCTS}?auth=${auth?.token}`,
          newProduct
        );
        queryClient.invalidateQueries(["getProducts"]);
      }
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setIsError(errorHandler(error));
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: productId ? "Edit Product" : "Create Product",
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Save"
              iconName="ios-checkmark"
              onPress={handleSubmit(submitProduct)}
            />
          </HeaderButtons>
        );
      },
    });
  }, [productId]);

  useEffect(() => {
    if (productId && productToEdit) {
      setValue("title", productToEdit?.title);
      setValue("description", productToEdit?.description);
      setValue("imageUrl", productToEdit?.imageUrl);
      setValue("price", productToEdit?.price.toString());
    }
  }, [productToEdit]);

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      {isLoading || loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.tint} size="large" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.form}>
            <CustomTextInput
              label="Title"
              name="title"
              autoCapitalize="sentences"
              returnKeyType="next"
              control={control}
              error={errors.title}
            />
            <CustomTextInput
              label="Image URL"
              name="imageUrl"
              returnKeyType="next"
              control={control}
              error={errors.imageUrl}
            />
            <CustomTextInput
              label="Price"
              name="price"
              control={control}
              error={errors.price}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
            <CustomTextInput
              label="Description"
              control={control}
              error={errors.description}
              name="description"
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default EditProduct;
