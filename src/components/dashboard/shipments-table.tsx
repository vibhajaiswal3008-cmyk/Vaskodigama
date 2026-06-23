"use client";

import * as React from "react";
import type { ShipmentRecord } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import { makeShipmentColumns } from "@/components/tables/columns";

export function ShipmentsTable({ shipments }: { shipments: ShipmentRecord[] }) {
  const columns = React.useMemo(() => makeShipmentColumns(), []);
  return (
    <DataTable
      columns={columns}
      data={shipments}
      caption="Illustrative shipment records"
      searchPlaceholder="Filter shipments…"
      pageSize={10}
    />
  );
}
