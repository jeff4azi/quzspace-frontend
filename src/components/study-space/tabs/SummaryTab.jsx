import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineDocumentText } from "react-icons/hi2";

export default function SummaryTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineDocumentText}
      title="AI Core Summaries"
      description="Structured outlines, key formulas, and essential definitions generated from your study materials."
    />
  );
}
