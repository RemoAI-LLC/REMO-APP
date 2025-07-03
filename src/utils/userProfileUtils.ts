// src/utils/userProfileUtils.ts
import { usePrivy } from "@privy-io/react-auth";

// Use ReturnType to extract the actual user type
type UserType = NonNullable<ReturnType<typeof usePrivy>["user"]>;

export const getUserImage = (user: UserType | null): string | null => {
  if (!user) return null;

  const imageSources = [
   
    user.twitter?.profilePictureUrl,
   
  ];

  for (const src of imageSources) {
    if (typeof src === "string" && src.trim() !== "") {
      return src;
    }
  }

  return null;
};

export const getUserInitial = (user: UserType | null): string => {
  if (!user) return "?";

  const nameSources = [
    user.google?.name,
    user.linkedin?.name,
    user.twitter?.name,
    user.discord?.username,
    user.github?.name,
    user.email?.address?.split("@")[0],
  ];

  for (const name of nameSources) {
    if (typeof name === "string" && name.trim() !== "") {
      return name.trim().charAt(0).toUpperCase();
    }
  }

  return "?";
};
