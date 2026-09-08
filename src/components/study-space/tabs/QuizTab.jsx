import TabPlaceholder from "./TabPlaceholder";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

export default function QuizTab() {
  return (
    <TabPlaceholder
      icon={HiOutlineQuestionMarkCircle}
      title="Smart Practice Quizzes"
      description="Multiple choice and short answer quizzes generated to test exam readiness."
    />
  );
}
