import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <SignUp
      signInForceRedirectUrl={"/dashboard"}
      fallbackRedirectUrl={"/dashboard"}
      path="/sign-up"
    />
  );
}
