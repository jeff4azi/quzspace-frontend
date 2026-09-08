import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function WeakAreasTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineExclamationTriangle}
      title="Weak Area Detection"
      description="Smart analytics pinpoint topics you struggle with so you can target review efficiently."
    />
  );
}
