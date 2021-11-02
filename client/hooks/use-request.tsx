import { useState, ReactElement } from "react";
import axios from "axios";

export function useRequest<T>({
  url,
  method,
  body,
  onSuccess
}: {
  url: string;
  method: "get" | "post";
  body?: Record<string, any>;
  onSuccess?: (res: T) => any | Promise<any>;
}) {
  const [errors, setErrors] = useState<ReactElement | null>(null);

  const doRequest = async (props: Record<string, any> = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        await onSuccess(response.data as T);
      }
      return response.data;
    } catch (err: any) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err: { message: string }) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}
