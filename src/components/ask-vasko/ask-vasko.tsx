"use client";

import * as React from "react";
import { Sparkles, Send, CheckCircle2, FileSearch } from "lucide-react";
import {
  askVaskoResponses,
  askVaskoSuggestions,
  matchAskVasko,
  type AskVaskoResponse,
} from "@/data/mock/askVasko";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ComparisonBar } from "@/components/charts/charts";
import { IllustrativeBadge } from "@/components/shared/illustrative";
import { formatDate } from "@/lib/utils";

/**
 * Ask Vasko — a LOCAL demonstration assistant. It does not call any AI API; it
 * matches the question to a pre-written response. Every answer shows supporting
 * evidence, a confidence indicator and a data date.
 */
export function AskVasko({ compact = false }: { compact?: boolean }) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState<AskVaskoResponse | null>(
    compact ? null : askVaskoResponses[0],
  );
  const [thinking, setThinking] = React.useState(false);

  function ask(q: string) {
    setQuestion(q);
    setThinking(true);
    // Brief delay to mimic processing; purely cosmetic.
    window.setTimeout(() => {
      setAnswer(matchAskVasko(q));
      setThinking(false);
    }, 350);
  }

  return (
    <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-base font-semibold text-navy">Ask Vasko</h3>
            <p className="text-xs text-muted">
              Demonstration assistant · evidence-led answers
            </p>
          </div>
        </div>
        <IllustrativeBadge />
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask(question);
        }}
      >
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about markets, buyers, prices…"
          aria-label="Ask Vasko a question"
        />
        <Button type="submit" aria-label="Send question" disabled={thinking}>
          <Send className="size-4" aria-hidden />
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {askVaskoSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-border-strong px-2.5 py-1 text-left text-xs text-muted-strong hover:bg-surface"
          >
            {s}
          </button>
        ))}
      </div>

      {thinking ? (
        <p className="mt-4 text-sm text-muted" role="status">
          Looking through the illustrative records…
        </p>
      ) : answer ? (
        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-navy">{answer.answer}</p>

          {!compact ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-muted-strong">
                  Suggested markets
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {answer.markets.map((m) => (
                    <li key={m.country} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                      <span>
                        <span className="font-medium text-navy">{m.country}</span>{" "}
                        <span className="text-muted">— {m.reason}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-strong">
                  Opportunity by market
                </p>
                <div className="mt-1">
                  <ComparisonBar
                    height={160}
                    data={answer.chart.map((c) => ({ name: c.label, value: c.value }))}
                    label={`Opportunity by market: ${answer.chart.map((c) => `${c.label} ${c.value}`).join(", ")}.`}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs font-semibold text-muted-strong">Supporting evidence</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-muted">
              {answer.evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={answer.confidence === "high" ? "success" : "warning"} className="capitalize">
                Confidence: {answer.confidence}
              </Badge>
              <Badge tone="neutral">Data date: {formatDate(answer.dataDate)}</Badge>
              <Badge tone="neutral">Price range: {answer.priceRange}</Badge>
              <Button variant="link" size="sm" className="h-auto">
                <FileSearch className="size-4" aria-hidden /> View supporting records
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
