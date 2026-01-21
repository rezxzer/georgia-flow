import { z } from 'zod';

export const eventSchema = z.object({
    name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
    description: z.string().max(2000, 'Description is too long').optional(),
    event_type: z.enum(['concert', 'festival', 'tour', 'other']),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    location: z.string().min(1, 'Location is required'),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type EventInput = z.infer<typeof eventSchema>;
