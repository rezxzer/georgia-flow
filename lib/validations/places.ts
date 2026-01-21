import { z } from 'zod';

export const placeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
    description: z.string().max(2000, 'Description is too long').optional(),
    category: z.enum(['restaurant', 'park', 'museum', 'nature', 'winery', 'other']),
    region: z.string().min(1, 'Region is required'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export type PlaceInput = z.infer<typeof placeSchema>;
