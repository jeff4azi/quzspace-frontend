import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

export default function ProgressTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineArrowTrendingUp}
      title="Mastery & Analytics"
      description="Track quiz history, score trends, and study streak statistics over time."
    />
  );
}
