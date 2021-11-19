import React, { FC, Fragment } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from "react-native";
import { Controller } from "react-hook-form";

interface CustomTextInputProps {
  label: string;
  name: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: ReturnKeyTypeOptions;
  control: any;
  error: any;
  secureTextEntry?: boolean;
}

const CustomTextInput: FC<CustomTextInputProps> = ({
  label,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  control,
  name,
  error,
  secureTextEntry,
}) => {
  return (
    <View style={styles.formControl}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Fragment>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType={keyboardType || "default"}
              autoCapitalize={autoCapitalize}
              returnKeyType={returnKeyType}
              secureTextEntry={secureTextEntry}
            />
          </Fragment>
        )}
      />
      {error && (
        <View style={styles.errorField}>
          <Text style={styles.errorText}>
            {error.message || "This field is invalid"}
          </Text>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  label: {
    marginVertical: 8,
    fontFamily: "open-sans-bold",
  },
  formControl: {
    width: "100%",
  },
  errorField: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    fontFamily: "open-sans",
    fontSize: 14,
  },
});
export default CustomTextInput;
