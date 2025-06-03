import { logout } from "@/features/auth/Auth";
import { baseApiUrl, isJson } from "./utils";
import { APIError } from "./APIError";

/**
 * Retrieves the CSRF token from the document's cookies.
 *
 * @returns {string|null} The CSRF token if found in the cookies, or null if not present.
 */
function getCSRFToken() {
  return document.cookie
    .split(";")
    .filter((cookie) => cookie.trim().startsWith("csrftoken="))
    .map((cookie) => cookie.split("=")[1])
    .pop();
}

export interface fetchAPIOptions {
  logoutOn401?: boolean;
}

export const fetchAPI = async (
  input: string,
  init?: RequestInit & { params?: Record<string, string> },
  options?: fetchAPIOptions
) => {
  // Check for fake login mode
  if (
    init?.params?.fakeLogin &&
    localStorage.getItem("fakeLoginActive") === "true"
  ) {
    const response = await fetch("https://mocki.io/v1/3eb19480-642a-471c-b315-cf6a3ec4b9b8");
    if (response.ok) {
      return response;
    }
  }

  const apiUrl = new URL(`${baseApiUrl("1.0")}${input}`);
  if (init?.params) {
    Object.entries(init.params).forEach(([key, value]) => {
      apiUrl.searchParams.set(key, value);
    });
  }
  const csrfToken = getCSRFToken();

  const response = await fetch(apiUrl, {
    ...init,
    credentials: "include",
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
      ...(csrfToken && { "X-CSRFToken": csrfToken }),
    },
  });

  if ((options?.logoutOn401 ?? true) && response.status === 401) {
    logout();
  }

  if (response.ok) {
    return response;
  }

  const data = await response.text();
  if (isJson(data)) {
    throw new APIError(response.status, JSON.parse(data));
  }
  throw new APIError(response.status);
};
