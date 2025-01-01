"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createSession,
  fetchSessions,
  fetchQrCode,
  fetchSessionInfo,
  sessionAction,
  fetchScreenshot,
  deleteSession,
} from "@/components/wahaAction";
import { RotateCcw, RotateCw } from "lucide-react";

export default function Dashboard() {
  const [response, setResponse] = useState(null);
  const [sessionName, setSessionName] = useState("");
  const [sessionTell, setSessionTell] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [sessions, setSessions] = useState([]); // State to store session data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState<string>(
    () => sessions[0]?.name || "", // Initialize with the first session name if available
  );
  const [message, setMessage] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  // const prevStatus = useRef<string | null>(null);

  const handleFetchQrCode = () => {
    const sessionStatus = sessionInfo?.status;
    if (sessionStatus === "SCAN_QR_CODE") {
      fetchQrCode(selectedSession, setQrLoading, setQrCode, setQrError);
      console.log(qrLoading);
    }
  };

  const handleFetchScreenshot = () => {
    if (selectedSession) {
      fetchScreenshot(selectedSession, setScreenshot, setError, setLoading);
      // console.log(screenshot);
    } else {
      if (!screenshot) {
        setError("Select a session first");
      }
    }
  };

  useEffect(() => {
    if (selectedSession) {
      fetchSessionInfo(
        selectedSession,
        setInfoLoading,
        setSessionInfo,
        setInfoError,
      );
      console.log("lestining to selectedSession");
    }
    handleFetchQrCode();
    handleFetchScreenshot();
  }, [selectedSession]);

  useEffect(() => {
    if (sessionInfo?.status === "SCAN_QR_CODE" && !qrCode) {
      handleFetchQrCode();
      console.log("lestining to session.status");
    }
  }, [sessionInfo?.status]);

  // Effect to fetch sessions and apply auto-selection or saved selection
  useEffect(() => {
    // Get saved session from localStorage
    const savedSession = localStorage.getItem("selectedSession");

    // Fetch sessions
    fetchSessions(setSessions, setLoading, setError);

    // Auto-select or use saved session
    if (sessions.length > 0) {
      const initialSession = savedSession || sessions[0].name;

      if (!selectedSession || selectedSession !== initialSession) {
        setSelectedSession(initialSession); // Update selected session
        localStorage.setItem("selectedSession", initialSession); // Save to localStorage
      }
      // const sessionStatus = sessionInfo?.status;
      // if (sessionStatus === "WORKING") {
      //   setQrLoading(true);
      // }

      console.log("Listening to sessions");
    }
  }, [sessions]); // Depend on sessions

  return (
    <>
      <div className="grid w-full auto-rows-min gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-muted/50">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Create session</CardTitle>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission
                createSession(
                  sessionName,
                  sessionTell,
                  sessionEmail,
                  setResponse,
                );
              }}
            >
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Session Name</Label>
                    <Input
                      id="name"
                      placeholder="default"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Tell</Label>
                    <Input
                      id="tell"
                      placeholder="252615983417"
                      value={sessionTell}
                      onChange={(e) => setSessionTell(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Email</Label>
                    <Input
                      id="email"
                      placeholder="email@example.com"
                      value={sessionEmail}
                      onChange={(e) => setSessionEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-between gap-4">
                <Button className="w-full text-white" type="submit">
                  Create
                </Button>
                {response && (
                  <div
                    className={`border-l-4 px-4 ${
                      response.error
                        ? "border-red-500 text-red-500"
                        : "border-green-500 text-green-500"
                    }`}
                  >
                    <p>{response.message}</p>
                  </div>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
        <div className="rounded-xl bg-muted/50">
          <Card className="h-full w-full">
            <CardHeader>
              <CardTitle>Live Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {!sessions ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Session</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-left">Tell</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {session.name}
                        </TableCell>
                        <TableCell>{session.status}</TableCell>
                        <TableCell>
                          {session.config && session.config.metadata
                            ? session.config.metadata["session.email"]
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {session.config && session.config.metadata
                            ? session.config.metadata["session.tell"]
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <Card>
            <form>
              <CardHeader>
                <CardTitle>Manage Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="session">Session</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedSession(value); // Update state
                        localStorage.setItem("selectedSession", value); // Save to localStorage
                      }}
                      value={selectedSession}
                    >
                      <SelectTrigger id="session">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session, index) => (
                          <SelectItem key={index} value={session.name}>
                            {session.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardContent className="flex gap-4">
                <div className="h-72 w-72 content-center rounded-md border text-center">
                  {qrLoading ? (
                    <p>Loading...</p>
                  ) : sessionInfo?.status === "SCAN_QR_CODE" && qrCode ? (
                    <Image
                      src={qrCode}
                      alt="QR Code"
                      width={400}
                      height={400}
                    />
                  ) : sessionInfo?.status === "WORKING" ? (
                    <p className="text-green-600">
                      {qrError || "Session is working"}
                    </p>
                  ) : sessionInfo?.status === "STOPPED" ? (
                    <p className="text-gray-600">
                      {qrError || "Session is stopped"}
                    </p>
                  ) : sessionInfo?.status === "STARTING" ? (
                    <p className="text-blue-600">
                      {qrError || "Session is starting"}
                    </p>
                  ) : sessionInfo?.status === "FAILED" ? (
                    <p className="text-red-600">
                      {qrError || "Session is failed"}
                    </p>
                  ) : (
                    <p>{qrError || "QR code not available"}</p>
                  )}
                </div>
                <div className=" w-1/2 ">
                  {infoLoading ? (
                    <p>Loading session info...</p>
                  ) : sessionInfo ? (
                    <div className="flex flex-col gap-4">
                      <p>
                        <strong>Status:</strong> {sessionInfo.status}
                      </p>
                      <p>
                        <strong>Phone Number:</strong>{" "}
                        {sessionInfo.me
                          ? sessionInfo.me.id.replace("@c.us", "")
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Name:</strong>{" "}
                        {sessionInfo.me?.pushName || "N/A"}
                      </p>
                    </div>
                  ) : (
                    <p>{error || "Session info not available"}</p>
                  )}
                  <button className="absolute mt-4" onClick={handleFetchQrCode}>
                    <RotateCw />
                  </button>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  onClick={() =>
                    sessionAction("start", selectedSession, setMessage)
                  }
                  type="button"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Start
                </Button>
                <Button
                  onClick={() =>
                    sessionAction("stop", selectedSession, setMessage)
                  }
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Stop
                </Button>
                <Button
                  onClick={() =>
                    sessionAction("restart", selectedSession, setMessage)
                  }
                  type="button"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Restart
                </Button>
                <Button
                  onClick={() =>
                    sessionAction("logout", selectedSession, setMessage)
                  }
                  type="button"
                  className="bg-orange-500 text-white hover:bg-orange-600"
                >
                  Logout
                </Button>
                <Button
                  onClick={
                    () =>
                      deleteSession(selectedSession, setInfoError, setLoading) // Pass parameters
                  }
                  type="button"
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </Button>
              </CardFooter>
              {message && (
                <div className="mt-4 text-center">
                  <p>{message}</p>
                </div>
              )}
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
          </Card>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50">
          <Card>
            <CardHeader>
              <CardTitle>Session Screenshot</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : screenshot ? (
                <Image
                  alt="session screenshot"
                  src={screenshot}
                  width={200}
                  height={200}
                  className="h-fit w-fit"
                />
              ) : (
                <p>No screenshot available</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <CardDescription>
                Screenshot of the latest WhatsApp Chats
              </CardDescription>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
