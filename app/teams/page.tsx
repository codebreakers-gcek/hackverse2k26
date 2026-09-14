"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scan,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  User,
  Camera,
  CameraOff,
  Flashlight,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Barcode,
  QrCode,
  LogOut,
  Smartphone,
  ChevronLeft,
  Search,
} from "lucide-react";
import { MarqueeBanner } from "@/components/layout/MarqueeBanner";
import Image from "next/image";
import { toast } from "sonner";
import clsx from "clsx";

export default function TeamsScannerPortal() {
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [verifierName, setVerifierName] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [deviceToken, setDeviceToken] = useState<string>("");
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Scanner State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [manualTicketInput, setManualTicketInput] = useState<string>("");
  const [lastScannedResult, setLastScannedResult] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);

  const html5QrCodeRef = useRef<any>(null);
  const scannerContainerId = "hackverse-qr-barcode-reader";

  // Web Audio Beep on successful scan
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("hackverse_scanner_session");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.verifierName && parsed?.deviceToken) {
          setVerifierName(parsed.verifierName);
          setPin(parsed.pin || "");
          setDeviceToken(parsed.deviceToken);
          setIsAuthenticated(true);

          // Verify token validity with backend
          fetch(`/api/teams/auth?token=${encodeURIComponent(parsed.deviceToken)}`)
            .then((r) => r.json())
            .then((data) => {
              if (data && !data.valid) {
                localStorage.removeItem("hackverse_scanner_session");
                setIsAuthenticated(false);
                toast.error("Your device session was revoked by Admin. Please enter a fresh PIN.");
              }
            })
            .catch(() => {});
        }
      }
    } catch {}
  }, []);

  // Handle PIN Authentication
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifierName.trim()) {
      setAuthError("Please enter your Full Name (Judge / Organizer).");
      return;
    }
    if (!pin.trim()) {
      setAuthError("Please enter the 5-Minute Authorization PIN.");
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/teams/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verifierName: verifierName.trim(),
          pin: pin.trim(),
          deviceToken: deviceToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        setIsAuthenticating(false);
        return;
      }

      // Save session
      const sessionData = {
        verifierName: data.verifierName,
        pin: pin.trim(),
        deviceToken: data.deviceToken,
        expiresAt: data.expiresAt,
      };
      localStorage.setItem("hackverse_scanner_session", JSON.stringify(sessionData));

      // Also set for teams/[id] page compatibility
      sessionStorage.setItem("hackverse_auth_pin", pin.trim());
      sessionStorage.setItem("hackverse_auth_name", data.verifierName);

      setVerifierName(data.verifierName);
      setDeviceToken(data.deviceToken);
      setSessionExpiresAt(data.expiresAt);
      setIsAuthenticated(true);
      toast.success("Authorized! 1D/2D Camera Scanner is active.");
    } catch (err: any) {
      setAuthError(err.message || "Network error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Start Camera Scanner (2D QR + 1D Barcodes)
  const startScanner = async (cameraId?: string) => {
    setCameraError(null);
    setIsScanning(true);

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      // Stop existing instance if running
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.stop();
        } catch {}
      }

      // Initialize scanner supporting both 2D (QR) & 1D (Barcodes)
      const html5QrCode = new Html5Qrcode(scannerContainerId, {
        formatsToSupport: [
          // 2D Formats
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.AZTEC,
          // 1D Barcode Formats
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
        ],
        verbose: false,
      });

      html5QrCodeRef.current = html5QrCode;

      // Get list of available cameras
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        const targetCameraId =
          cameraId ||
          devices.find((d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"))?.id ||
          devices[0].id;

        setSelectedCameraId(targetCameraId);

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minDim = Math.min(viewfinderWidth, viewfinderHeight);
            return {
              width: Math.floor(minDim * 0.82),
              height: Math.floor(minDim * 0.65), // Oblong scanning box perfect for both 1D Barcodes and 2D QR
            };
          },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          targetCameraId,
          config,
          (decodedText: string) => {
            handleScanSuccess(decodedText);
          },
          () => {}
        );

        // Check if torch is supported
        try {
          const capabilities = html5QrCode.getRunningTrackCapabilities?.();
          if (capabilities && "torch" in capabilities) {
            setTorchSupported(true);
          }
        } catch {}
      } else {
        setCameraError("No camera hardware detected on this device.");
        setIsScanning(false);
      }
    } catch (err: any) {
      console.error("Camera startup error:", err);
      setCameraError(
        err?.message || "Failed to initialize camera. Please allow camera permissions."
      );
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current) return;
    try {
      const newState = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: newState }],
      });
      setTorchOn(newState);
    } catch (e) {
      toast.error("Flashlight control not supported on this browser/camera.");
    }
  };

  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    if (!decodedText || decodedText === lastScannedResult) return;
    setLastScannedResult(decodedText);
    playBeep();

    // Parse Ticket ID from URL or raw text
    // E.g.: "https://hackverse.codebreakersgcek.tech/teams/HV26-824682" -> "HV26-824682"
    // E.g.: "HV26-824682" -> "HV26-824682"
    let ticketId = decodedText.trim();

    if (ticketId.includes("/teams/")) {
      const parts = ticketId.split("/teams/");
      ticketId = parts[parts.length - 1].split("?")[0].split("#")[0].trim();
    }

    // Strip out quotes or clean
    ticketId = ticketId.replace(/[^a-zA-Z0-9-_]/g, "");

    toast.success(`Scanned: ${ticketId}`);

    // Pre-cache verifier credentials so [id] page unlocks immediately
    sessionStorage.setItem("hackverse_auth_pin", pin);
    sessionStorage.setItem("hackverse_auth_name", verifierName);

    // Stop scanner and navigate
    stopScanner().then(() => {
      router.push(`/teams/${encodeURIComponent(ticketId)}`);
    });
  };

  // Handle manual ticket submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTicketInput.trim()) return;

    let ticketId = manualTicketInput.trim();
    if (ticketId.includes("/teams/")) {
      const parts = ticketId.split("/teams/");
      ticketId = parts[parts.length - 1].split("?")[0].trim();
    }
    ticketId = ticketId.replace(/[^a-zA-Z0-9-_]/g, "");

    sessionStorage.setItem("hackverse_auth_pin", pin);
    sessionStorage.setItem("hackverse_auth_name", verifierName);

    stopScanner().then(() => {
      router.push(`/teams/${encodeURIComponent(ticketId)}`);
    });
  };

  const handleLogoutSession = () => {
    stopScanner();
    localStorage.removeItem("hackverse_scanner_session");
    sessionStorage.removeItem("hackverse_auth_pin");
    sessionStorage.removeItem("hackverse_auth_name");
    setIsAuthenticated(false);
    setPin("");
    toast.info("Scanner session signed out.");
  };

  // Auto-start camera when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-black overflow-hidden font-sans">
      {/* Background Graphic Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="/minecraft/documentbg.webp"
          alt="HackVerse Background"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center">
          {!isAuthenticated ? (
            /* ========================================================= */
            /* 1. PIN & VERIFIER NAME AUTHORIZATION MODAL                */
            /* ========================================================= */
            <div className="w-full max-w-md bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 border-b-3 border-black pb-4 mb-5">
                <div className="w-12 h-12 bg-amber-400 border-2 border-black flex items-center justify-center shadow-neo-sm">
                  <Scan className="w-6 h-6 stroke-[2.5px] text-black" />
                </div>
                <div>
                  <h1 className="font-mono font-black text-xl text-black uppercase tracking-tight">
                    SCANNER ACCESS
                  </h1>
                  <p className="font-mono text-xs text-neutral-600">
                    5-Minute Admin PIN Gate (Max 8 Devices)
                  </p>
                </div>
              </div>

              {authError && (
                <div className="mb-5 p-3.5 bg-rose-100 border-2 border-rose-600 text-rose-950 font-mono text-xs font-bold flex items-start gap-2 shadow-neo-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthenticate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Your Full Name (Judge / Organizer) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Mohanty / Judge 01"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black font-mono text-sm font-bold text-black focus:bg-white focus:outline-none shadow-neo-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>5-Minute Authorization PIN *</span>
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    required
                    placeholder="Enter Admin Generated PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border-2 border-black font-mono text-lg font-black text-black tracking-widest text-center focus:bg-white focus:outline-none shadow-neo-xs"
                  />
                  <p className="font-mono text-[10px] text-neutral-500">
                    ★ PIN is dynamically generated by the Admin desk and valid for 5 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full mt-2 py-3 px-4 bg-amber-400 hover:bg-amber-500 text-black border-3 border-black font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neo cursor-pointer active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AUTHENTICATING DEVICE...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 stroke-[2.5px]" />
                      <span>UNLOCK 1D/2D SCANNER</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t-2 border-dashed border-black/20 flex items-center justify-between text-[11px] font-mono text-neutral-600">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Max 8 devices
                </span>
                <span>Session: 5 Minutes</span>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* 2. CAMERA SCANNER INTERFACE (1D BARCODE & 2D QR)          */
            /* ========================================================= */
            <div className="w-full max-w-2xl bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
              {/* Active Session Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-100 border-2 border-black p-3 shadow-neo-xs">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black text-black uppercase">{verifierName}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-200 border border-black text-[10px] font-bold text-emerald-950">
                    SCANNER ONLINE
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-emerald-300 px-2.5 py-1 border border-black shadow-neo-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    <span className="font-black text-black">DEVICE LOGGED IN</span>
                  </div>

                  <button
                    onClick={handleLogoutSession}
                    title="Sign Out Session"
                    className="p-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-black font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-neo-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SIGN OUT</span>
                  </button>
                </div>
              </div>

              {/* Camera Scanner Viewport */}
              <div className="space-y-3">
                <div className="relative bg-black border-3 border-black overflow-hidden aspect-square max-h-[380px] w-full mx-auto flex flex-col items-center justify-center">
                  {/* HTML5 QR/Barcode Video Mount */}
                  <div
                    id={scannerContainerId}
                    className="w-full h-full object-cover [&_video]:object-cover [&_video]:w-full [&_video]:h-full"
                  />

                  {/* Scanning HUD Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6">
                    {/* Top HUD */}
                    <div className="w-full flex items-center justify-between font-mono text-[10px] font-black text-emerald-400 bg-black/60 px-3 py-1 border border-emerald-400/40">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5" />
                        <span>2D QR</span>
                        <span className="text-white">/</span>
                        <Barcode className="w-3.5 h-3.5" />
                        <span>1D BARCODE</span>
                      </div>
                      <span className="animate-pulse">● LIVE VIEW</span>
                    </div>

                    {/* Viewfinder Reticle with Laser Beam */}
                    <div className="relative w-64 h-48 border-2 border-dashed border-emerald-400/80 rounded-md flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-3 border-l-3 border-emerald-400 -mt-0.5 -ml-0.5" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-3 border-r-3 border-emerald-400 -mt-0.5 -mr-0.5" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-3 border-l-3 border-emerald-400 -mb-0.5 -ml-0.5" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-3 border-r-3 border-emerald-400 -mb-0.5 -mr-0.5" />

                      {/* Moving Laser Beam Animation */}
                      <div className="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-bounce" />
                    </div>

                    {/* Bottom HUD info */}
                    <div className="font-mono text-[10px] font-bold text-white bg-black/70 px-3 py-1 border border-white/20">
                      Align badge code inside the box
                    </div>
                  </div>

                  {cameraError && (
                    <div className="absolute inset-0 bg-neutral-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <CameraOff className="w-10 h-10 text-rose-500" />
                      <p className="font-mono text-xs font-bold text-white max-w-xs">{cameraError}</p>
                      <button
                        onClick={() => startScanner(selectedCameraId)}
                        className="px-4 py-2 bg-amber-400 text-black border-2 border-black font-mono text-xs font-black uppercase cursor-pointer"
                      >
                        Retry Camera
                      </button>
                    </div>
                  )}
                </div>

                {/* Camera Controls Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  {/* Camera Switcher */}
                  {cameras.length > 1 && (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-black">CAMERA:</span>
                      <select
                        value={selectedCameraId}
                        onChange={(e) => {
                          setSelectedCameraId(e.target.value);
                          startScanner(e.target.value);
                        }}
                        className="px-2.5 py-1.5 bg-neutral-100 border-2 border-black font-mono text-xs font-bold text-black focus:outline-none"
                      >
                        {cameras.map((cam, idx) => (
                          <option key={cam.id} value={cam.id}>
                            {cam.label || `Camera ${idx + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Flashlight button */}
                  {torchSupported && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={clsx(
                        "px-3 py-1.5 border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-neo-xs",
                        torchOn ? "bg-amber-300 text-black" : "bg-white text-black"
                      )}
                    >
                      <Flashlight className="w-3.5 h-3.5" />
                      <span>{torchOn ? "TORCH ON" : "TORCH OFF"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => startScanner(selectedCameraId)}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer shadow-neo-xs ml-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>RELOAD CAMERA</span>
                  </button>
                </div>
              </div>

              {/* Manual Ticket Input Fallback */}
              <div className="border-t-3 border-black pt-4 space-y-2">
                <label className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Manual Ticket ID Lookup (Fallback)</span>
                </label>
                <form onSubmit={handleManualSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Ticket ID (e.g. HV26-824682)"
                    value={manualTicketInput}
                    onChange={(e) => setManualTicketInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-50 border-2 border-black font-mono text-xs font-bold text-black uppercase focus:bg-white focus:outline-none shadow-neo-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono font-black text-xs uppercase border-2 border-black cursor-pointer shadow-neo-xs flex items-center gap-1.5"
                  >
                    <span>LOOKUP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
