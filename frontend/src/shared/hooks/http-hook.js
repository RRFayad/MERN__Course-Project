import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    // useCallback here to avoid rerender cycles
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      // This works for cancelling a request when user change the page while thje request is still running
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // clean up function: Before the useEffect runs again, or when the component unmount
      // eslint-disable-next-line
      activeHttpRequests.current.forEach((aborCtrl) => aborCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError };
};
