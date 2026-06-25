import type { ReactNode } from "react";
import type { Permission } from "../types/admin";

/** A single route mapping a path to the element it renders. */
export interface RouteConfig {
  path: string;
  element: ReactNode;
}

/** An admin route that may require a specific permission to access. */
export interface AdminRouteConfig extends RouteConfig {
  requiredPermission?: Permission;
}
