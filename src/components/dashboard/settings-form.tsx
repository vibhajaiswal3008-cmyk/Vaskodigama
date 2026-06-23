"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/toast";

/** Demonstration settings. Saved to localStorage only. */
export function SettingsForm() {
  const { toast } = useToast();

  function save(e: React.FormEvent) {
    e.preventDefault();
    toast({ title: "Settings saved (demo)", description: "Stored locally for this session.", tone: "success" });
  }

  return (
    <form onSubmit={save} className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle as="h2">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="s-name" className="mb-1 block">Full name</Label>
            <Input id="s-name" defaultValue="Demo user" />
          </div>
          <div>
            <Label htmlFor="s-company" className="mb-1 block">Company</Label>
            <Input id="s-company" defaultValue="Demo Trading Co." />
          </div>
          <div>
            <Label htmlFor="s-email" className="mb-1 block">Work email</Label>
            <Input id="s-email" type="email" defaultValue="demo@example.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="s-units" className="mb-1 block">Default unit</Label>
            <Select id="s-units" defaultValue="kg">
              <option value="kg">Kilogram (kg)</option>
              <option value="ton">Metric ton</option>
              <option value="unit">Unit</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="s-market" className="mb-1 block">Default market</Label>
            <Select id="s-market" defaultValue="AE">
              <option value="AE">United Arab Emirates</option>
              <option value="US">United States</option>
              <option value="DE">Germany</option>
            </Select>
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-muted-strong">Notifications</legend>
            <Checkbox defaultChecked label="Weekly digest email (illustrative)" />
            <Checkbox defaultChecked label="In-app alerts" />
            <Checkbox label="Product update emails" />
          </fieldset>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
