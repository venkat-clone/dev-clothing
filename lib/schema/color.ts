
import { z } from 'zod';
const colorSchema = z.object({
    color: z.string(),
    colorGuid: z.string(),
});

export default colorSchema;