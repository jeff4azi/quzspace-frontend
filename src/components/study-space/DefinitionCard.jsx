import { HiOutlineBookmark } from "react-icons/hi2";

export default function DefinitionCard({ term, definition }) {
  return (
    <div className="bg-white rounded-xl border border-muted/30 p-4 sm:p-5 space-y-1.5 shadow-xs hover:border-brand/40 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-2 text-brand">
        <HiOutlineBookmark className="w-4 h-4 text-brand shrink-0" />
        <h4 className="text-sm font-extrabold tracking-tight">
          {term}
        </h4>
      </div>
      <p className="text-xs sm:text-sm text-gray leading-relaxed pl-6">
        {definition}
      </p>
    </div>
  );
}
