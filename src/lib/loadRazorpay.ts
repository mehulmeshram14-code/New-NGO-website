/**
 * Client-side utility to reliably load the official Razorpay Checkout SDK.
 * Ensures the script is only loaded once and resolves cleanly before opening checkout.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadRazorpayCheckoutScript(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Razorpay Checkout cannot be loaded in a server environment."));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return resolve((window as any).Razorpay);
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolve((window as any).Razorpay);
      });
      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Razorpay Checkout SDK script."));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).Razorpay);
    };
    script.onerror = () => {
      reject(new Error("Failed to load Razorpay Checkout SDK. Please check your internet connection."));
    };
    document.body.appendChild(script);
  });
}
