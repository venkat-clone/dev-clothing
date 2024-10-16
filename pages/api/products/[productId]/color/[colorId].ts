import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';
import colorSchema from '@/schema/color';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId, colorId } = req.query;

    if (req.method === 'PUT') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            const parsedcolorId = parseInt(colorId as string, 10);
            if (isNaN(parsedProductId) || isNaN(parsedcolorId)) {
                return res.status(400).json({ error: 'Invalid IDs' });
            }

            const validationResult = colorSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            const updatedcolor = await prisma.color.update({
                where: { id: parsedcolorId },
                data: {
                    color: validationResult.data.color,
                    colorGuid: validationResult.data.colorGuid,
                },
            });

            return res.status(200).json(updatedcolor);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error updating color' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const parsedcolorId = parseInt(colorId as string, 10);
            if (isNaN(parsedcolorId)) {
                return res.status(400).json({ error: 'Invalid color ID' });
            }

            await prisma.color.delete({
                where: { id: parsedcolorId },
            });

            return res.status(204).end(); // No content response
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error deleting color' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
