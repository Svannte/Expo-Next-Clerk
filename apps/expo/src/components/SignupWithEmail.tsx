import { View, Text, Button, TextInput } from "react-native";
import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";

const SignupWithEmail = () => {
  const { signUp, setSession, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const createAccount = await signUp.create({
        emailAddress: email,
        password: password,
      });
      console.log(createAccount.status);
      console.log(email, password);
      console.log(createAccount.createdSessionId);
      //await setCreateSession(createAccount.createdSessionId);
    } catch (err) {
      // @ts-ignore
      console.log("Error:> " + (err.errors ? err.errors[0].message : err));
      // @ts-ignore
      console.log("error", err.errors[0].longMessage);
      // @ts-ignore
      console.log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  };

  return (
    <View className="flex-1">
      <TextInput
        className="my-1 border-2 text-center"
        placeholder="EMAIL"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="my-1 border-2 text-center"
        placeholder="PASSOWRD"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text className="m-1">{signUp?.status}</Text>
      <Button title="Register With Email" onPress={onSignUpPress} />
    </View>
  );
};

export default SignupWithEmail;
