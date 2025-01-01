require("dotenv").config();
import { createClClient } from "@/utils/supabase/client";

const WAHA_API = process.env.NEXT_PUBLIC_WAHA_API;

export const createSession = async (
  sessionName: string,
  sessionTell: string,
  sessionEmail: string,
  setResponse: (response: { error: boolean; message: string }) => void,
) => {
  try {
    const supabase = createClClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      throw new Error("Failed to fetch user data");
    }

    const res = await fetch(WAHA_API + "/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: sessionName,
        start: true,
        config: {
          metadata: {
            "user.id": user.id, // Store Supabase user ID
            "user.email": user.email,
            "session.email": sessionEmail,
            "session.tell": sessionTell,
          },
          proxy: null,
          debug: false,
          noweb: {
            store: {
              enabled: true,
              fullSync: false,
            },
          },
          webhooks: [
            {
              url: "https://webhook.site/11111111-1111-1111-1111-11111111",
              events: ["message", "session.status"],
              hmac: null,
              retries: null,
              customHeaders: null,
            },
          ],
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setResponse({
        error: true,
        message: data.message || "An error occurred",
      });
      return;
    }

    setResponse({
      error: false,
      message: "Success! Your session has been created.",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    setResponse({
      error: true,
      message: "Error: Could not complete the request.",
    });
  }
};

export const fetchSessions = async (
  setSessions: (sessions: any[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
) => {
  setLoading(true);
  setError(null);

  try {
    const supabase = createClClient();
    // Get the logged-in user from Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      throw new Error("Failed to fetch user data");
    }

    // Fetch all sessions
    const res = await fetch(WAHA_API + "/api/sessions?all=true");
    if (!res.ok) {
      throw new Error("Failed to fetch sessions");
    }

    const data = await res.json();

    // Filter sessions by logged-in user ID
    const filteredSessions = data.filter(
      (session: any) =>
        session.config.metadata &&
        session.config.metadata["user.id"] === user.id,
    );

    setSessions(filteredSessions); // Set filtered sessions
  } catch (error) {
    console.error("Error fetching sessions:", error);
    setError("Failed to fetch live sessions");
  } finally {
    setLoading(false);
  }
};

export const fetchQrCode = async (
  sessionName: string | undefined,
  setQrLoading: (loading: boolean) => void,
  setQrCode: (url: string | null) => void,
  setQrError: (error: string | null) => void,
) => {
  // console.log(sessionName);

  if (!sessionName) {
    setQrError("Please select a session");
    return;
  }

  setQrLoading(true);
  setQrError(null);

  try {
    const response = await fetch(
      `${WAHA_API}/api/${sessionName}/auth/qr?format=image`,
    );

    // console.log("response:" + response);
    if (!response.ok) throw new Error("Failed to fetch QR code");

    const blob = await response.blob();

    // console.log("blob:" + blob);
    const qrCodeUrl = URL.createObjectURL(blob);
    // console.log(qrCodeUrl);

    // console.log("qrCodeUrl:" + qrCodeUrl);
    setQrCode(qrCodeUrl);
    setQrLoading(false);
  } catch (err: any) {
    console.error("Error fetching QR code:", err);
    setQrError(err.message);
  } finally {
    setQrLoading(false);
  }
};

export const fetchSessionInfo = async (
  sessionName: string | undefined,
  setInfoLoading: (loading: boolean) => void,
  setSessionInfo: (url: string | null) => void,
  setInfoError: (error: string | null) => void,
) => {
  if (!sessionName) {
    setInfoError("Please select a session");
    return;
  }
  setInfoLoading(true);
  setInfoError("");
  try {
    const response = await fetch(`${WAHA_API}/api/sessions/${sessionName}`);
    if (!response.ok) throw new Error("Failed to fetch session info");
    const info = await response.json();
    setSessionInfo(info);
  } catch (err) {
    setInfoError(err.message);
  } finally {
    setInfoLoading(false);
  }
};

export const sessionAction = async (
  action: string,
  selectedSession: string | null,
  setMessage: (message: string) => void,
): Promise<void> => {
  if (!selectedSession) {
    setMessage("Please select a session.");
    return;
  }

  try {
    const res = await fetch(
      `${WAHA_API}/api/sessions/${selectedSession}/${action}`,
      {
        method: "POST",
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to ${action} session`);
    }

    window.location.reload();
    setMessage(`Session ${selectedSession} ${action}ed successfully.`);
  } catch (error: any) {
    console.error(`Error ${action}ing session:`, error);
    setMessage(`Failed to ${action} session.`);
  }
};

export const fetchScreenshot = async (
  selectedSession: string | null,
  setScreenshot: (url: string | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      `${WAHA_API}/api/screenshot?session=${selectedSession}`,
    );
    // console.log(response);
    if (!response.ok) {
      setError("Failed to fetch screenshot");
    }
    const data = await response.json(); // Expect JSON with image URL
    // console.log(data.data);

    if (data && data.data) {
      // Convert Base64 string to data URL
      const base64String = data.data; // Extract base64 string
      const mimeType = "image/png"; // Set the MIME type (adjust based on your image type)
      const dataUrl = `data:${mimeType};base64,${base64String}`;
      setScreenshot(dataUrl); // Set the data URL
    } else {
      setError("No image data in response");
    }
  } catch (err: any) {
    console.error("Error fetching screenshot:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

export const deleteSession = async (
  sessionName: string | undefined,
  setInfoError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  if (!sessionName) {
    setInfoError("Please select a session");
    return;
  }
  setLoading(true);
  setInfoError(null); // Clear previous errors

  try {
    const res = await fetch(
      `${WAHA_API}/api/sessions/${sessionName}`, // Fixed URL
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error("Failed to delete session");

    // Optional: Reload the page
    window.location.reload();
  } catch (err: any) {
    setInfoError(err.message || "An error occurred while deleting session");
  } finally {
    setLoading(false);
  }
};
