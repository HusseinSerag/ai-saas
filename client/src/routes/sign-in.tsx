import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <>
      <SignIn fallbackRedirectUrl={"/dashboard"} path="/sign-in" />
    </>
  );
}
