"use client";

import * as React from "react";
import { Bell, Plus, Trash2 } from "lucide-react";
import type { Alert, AlertFrequency } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Checkbox, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/shared/toast";
import { makeId, formatDate } from "@/lib/utils";

const watchOptions: Alert["watch"][number][] = [
  "buyers",
  "suppliers",
  "prices",
  "competitors",
  "markets",
];

export function AlertsManager({ initial }: { initial: Alert[] }) {
  const { toast } = useToast();
  const [alerts, setAlerts] = React.useState<Alert[]>(initial);
  const [open, setOpen] = React.useState(false);

  // New-alert form state
  const [name, setName] = React.useState("");
  const [frequency, setFrequency] = React.useState<AlertFrequency>("weekly");
  const [watch, setWatch] = React.useState<Alert["watch"]>(["buyers"]);
  const [email, setEmail] = React.useState(true);

  function toggleWatch(w: Alert["watch"][number]) {
    setWatch((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w],
    );
  }

  function create() {
    if (!name.trim()) {
      toast({ title: "Give the alert a name", tone: "warning" });
      return;
    }
    const alert: Alert = {
      id: makeId("al"),
      name: name.trim(),
      query: name.trim(),
      frequency,
      channels: email ? ["email", "in-app"] : ["in-app"],
      createdAt: new Date().toISOString().slice(0, 10),
      active: true,
      watch: watch.length ? watch : ["markets"],
    };
    setAlerts((prev) => [alert, ...prev]);
    setOpen(false);
    setName("");
    toast({ title: "Alert created (demo)", description: "Stored locally for this session.", tone: "success" });
  }

  function toggleActive(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    );
  }

  function remove(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Alert removed", tone: "info" });
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" aria-hidden /> Create alert
        </Button>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={<Bell className="size-6" />}
          title="No alerts yet"
          description="Create an alert to be notified about new buyers, price moves, competitors or market shifts."
          action={<Button onClick={() => setOpen(true)}>Create your first alert</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {alerts.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Bell className="size-5 text-primary" aria-hidden />
                    <h3 className="font-semibold text-navy">{a.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label={`Delete ${a.name}`}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="neutral" className="capitalize">
                    {a.frequency}
                  </Badge>
                  {a.watch.map((w) => (
                    <Badge key={w} tone="primary" className="capitalize">
                      {w}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">Created {formatDate(a.createdAt)}</span>
                  <Checkbox
                    checked={a.active}
                    onChange={() => toggleActive(a.id)}
                    label={a.active ? "Active" : "Paused"}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create an alert"
        description="We’ll note changes for this query (demonstration — no email is actually sent)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={create}>Create alert</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="alert-name" required className="mb-1 block">
              Alert name
            </Label>
            <Input
              id="alert-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New honey buyers in UAE"
            />
          </div>
          <div>
            <Label htmlFor="alert-freq" className="mb-1 block">
              Frequency
            </Label>
            <Select
              id="alert-freq"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as AlertFrequency)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-muted-strong">
              Watch for changes in
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {watchOptions.map((w) => (
                <Checkbox
                  key={w}
                  checked={watch.includes(w)}
                  onChange={() => toggleWatch(w)}
                  label={<span className="capitalize">{w}</span>}
                />
              ))}
            </div>
          </fieldset>
          <Checkbox
            checked={email}
            onChange={(e) => setEmail(e.target.checked)}
            label="Also notify me by email (illustrative)"
          />
        </div>
      </Modal>
    </div>
  );
}
