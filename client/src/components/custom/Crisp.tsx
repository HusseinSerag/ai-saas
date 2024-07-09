import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";
export default function CrispChat() {
  useEffect(function () {
    Crisp.configure("f2961caf-dcbb-4b56-8599-7e095cd78d4f");
  }, []);

  return null;
}
