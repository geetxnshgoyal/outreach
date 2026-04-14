"use client";

import { useState, useEffect } from "react";
import { getEvents, processCSV } from "@/lib/actions";
import { Upload, CheckCircle2, AlertCircle, Loader2, FileSpreadsheet } from "lucide-react";

export default function AdminUploadPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !file) {
      setError("Please select an event and a file.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const text = await file.text();
      const res = await processCSV(selectedEvent, file.name, text);
      setResult({ added: res.addedCount, skipped: res.skippedCount });
      setFile(null);
      // Reset input
      const input = document.getElementById("csv-upload") as HTMLInputElement;
      if (input) input.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card glass p-8 rounded-2xl border border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Import Registrations</h2>
            <p className="text-muted-foreground text-sm">Upload event CSV files to update outreach data.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl mb-6 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">Upload Successful!</p>
              <p className="text-xs opacity-80">
                Added/Updated {result.added} participants. {result.skipped} rows were skipped.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Target Event</label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="">Select an Event</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">CSV File</label>
            <div className="relative group">
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-10 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 transition-colors mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {file ? file.name : "Click to select or drag and drop CSV"}
                </span>
                <span className="text-xs text-muted-foreground mt-2">Maximum file size: 10MB</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {loading ? "Processing Data..." : "Start Import"}
          </button>
        </form>
      </div>
      
      <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-blue-500 font-bold text-sm mb-2">Pro Tip</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ensure your CSV headers match the exact names used in the original template (e.g., &quot;Candidate&apos;s Email&quot;).
          Duplicates are automatically handled based on Email and Event ID.
        </p>
      </div>
    </div>
  );
}
