import { mockStudySpaces } from "./mockStudySpaces";

export const mockActiveSpace = {
  id: "cs-301",
  title: "Computer Networks & Protocols",
  subject: "Computer Science",
  fileCount: 8,
  lastAccessed: "2 hours ago",
  createdDate: "Aug 14, 2026",
  progressPercent: 85,
  categoryBadge: "CS301",
  badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
};

export function getSpaceById(id) {
  const found = mockStudySpaces.find((space) => space.id === id);
  if (found) {
    return {
      ...found,
      createdDate: "Aug 14, 2026",
    };
  }
  return mockActiveSpace;
}
