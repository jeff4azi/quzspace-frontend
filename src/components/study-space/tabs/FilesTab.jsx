import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineFolderOpen } from "react-icons/hi2";

export default function FilesTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineFolderOpen}
      title="Files & Source Materials"
      description="View, manage, and upload additional documents, slides, and notes for this study space."
    />
  );
}
