import React from "react";

import { View, SafeAreaView } from "react-native";
import SigninWithEmail from "../components/SigninWithEmail";

import SignInWithOAuth from "../components/SignInWithOAuth";
import SigninWithOAuthGoogle from "../components/SigninWithOAuthGoogle";
import SignupWithEmail from "../components/SignupWithEmail";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="bg-[#2e026d]">
      <View className="h-full w-full p-4">
        <SignInWithOAuth />
        <SigninWithOAuthGoogle />
      </View>
    </SafeAreaView>
  );
};
