import { z } from 'zod';

const sizeSchema = z.object({
    size: z.string(),
    sizeGuid: z.string(),
});

export default sizeSchema;