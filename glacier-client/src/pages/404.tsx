import { useEffect, useState } from "react";

export default function NotFound() {
  const [isUV, setIsUV] = useState(true);
  useEffect(() => {
    if (window.location.pathname.includes('uv/')) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 400);

      fetch('/isUV', { signal: controller.signal })
        .then(response => {
          clearTimeout(timeout);
          if (!response.ok) throw new Error('Network response was not ok');
          setIsUV(true);
        })
        .catch(error => {
          setIsUV(false);
          if (error.name === 'AbortError') {
            console.error('Request timed out');
          } else {
            console.error('Fetch error:', error);
          }
        });
    }
  }, []);
  return (
    <div>
      {isUV ? <h1>404 Page Not Found</h1> : <>
        <h1>NoUV Glacier</h1>
        <p>This instance of glacier does not support UV as it is running fully static.</p>
      </>}
    </div>
  );
}