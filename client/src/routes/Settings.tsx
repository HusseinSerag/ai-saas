import Heading from "../components/custom/Heading";
import { Settings as SettingsIcon } from "lucide-react";
import useApiLimit from "../query/useApiLimit";
import SubscrptionButton from "../components/custom/SubscrptionButton";
export default function Settings() {
  const { data } = useApiLimit();
  const { isPro } = data!;
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings"
        icon={SettingsIcon}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="space-y-4 px-4 lg:px-8">
        <div className="text-sm text-muted-foreground">
          You are currently on a {isPro ? "pro" : "free"} plan
        </div>
        <SubscrptionButton />
      </div>
    </div>
  );
}
