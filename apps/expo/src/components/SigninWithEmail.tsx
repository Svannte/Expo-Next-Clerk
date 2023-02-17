import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";

const SigninWithEmail = () => {
  const { signIn, setSession, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password: password,
      });
      await setSession(completeSignIn.createdSessionId);
    } catch (err) {
      // @ts-ignore
      console.log("Error:> " + (err.errors ? err.errors[0].message : err));
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
      <Button title="Login With Email" onPress={onSignInPress} />

    </View>
  );
};

export default SigninWithEmail;
