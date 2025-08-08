// API Proxy utility to handle mixed content issues
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);

    // If it's a mixed content error, provide a helpful message
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      console.error(
        "Mixed content error detected. Please ensure HTTPS is properly configured."
      );
    }

    throw error;
  }
};

export const makeApiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) => {
  const options: RequestInit = {
    method,
    ...(body && { body: JSON.stringify(body) }),
  };

  return apiCall(endpoint, options);
};
