import React from "react";
import { CurrentUser } from "../../types/current-user";

export const UserContext = React.createContext<CurrentUser | null>(null);

export const UserContextSlot: React.FC<{ currentUser: CurrentUser | null }> = ({ currentUser, children }) => {
  return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>;
};
