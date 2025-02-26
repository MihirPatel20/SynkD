import { formatDistanceToNow } from "date-fns";

// Format date as "2 days ago", "3 months ago", etc.
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "";
  }
};
