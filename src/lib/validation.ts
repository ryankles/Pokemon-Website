import { z } from "zod";

export const storesQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusMi: z.coerce.number().min(1).max(100).default(10),
  placeType: z.enum(["lgs", "big_box", "vending", "event"]).optional(),
  hasSingles: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  hostsEvents: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
});

export const stockReportSchema = z.object({
  storeId: z.string().uuid(),
  reporterName: z.string().trim().min(1).max(80).optional(),
  productNote: z.string().trim().min(2).max(200),
  inStock: z.boolean(),
  confidence: z.number().int().min(1).max(5).default(3),
});
