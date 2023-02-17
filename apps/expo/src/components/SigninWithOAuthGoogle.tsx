import { View, Text, Button } from "react-native";
import React from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { makeRedirectUri, startAsync } from "expo-auth-session";

const SigninWithOAuthGoogle = () => {
  const { signIn, setSession, isLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const onPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      // Create a redirect url for the current platform and environment.
      //
      // This redirect URL needs to be whitelisted for your instance via
      // https://clerk.dev/docs/reference/backend-api/tag/Redirect-URLs#operation/CreateRedirectURL
      //
      // For more information go to:
      // https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturi
      const redirectUrl = makeRedirectUri({
        path: "/oauth-native-callback",
      });

      await signIn.create({
        strategy: "oauth_google",
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      const result = await startAsync({
        authUrl: externalVerificationRedirectURL!.toString(),
        returnUrl: redirectUrl,
      });

      // @ts-ignore
      const { type, params } = result || {};

      // Check all the possible AuthSession results
      // https://docs.expo.dev/versions/latest/sdk/auth-session/#returns-7
      if (type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        console.log(
          "Didn't have an account transferring, following through with new account sign up",
        );

        // Create user
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: rotatingTokenNonce,
        });
        await setSession(signUp.createdSessionId);
      }

      //await setSession(createdSessionId);
      return;
    } catch (err: any) {
      console.log("Error:> " + err?.status || "");
      console.log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  }, []);

  return (
    <View className="m-10 flex-1">
      <Button title="Continue with Google" onPress={onPress} />
    </View>
  );
};

export default SigninWithOAuthGoogle;
