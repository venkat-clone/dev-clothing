import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';
import sizeSchema from '@/schema/size';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId, sizeId } = req.query;

    if (req.method === 'PUT') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            const parsedSizeId = parseInt(sizeId as string, 10);
            if (isNaN(parsedProductId) || isNaN(parsedSizeId)) {
                return res.status(400).json({ error: 'Invalid IDs' });
            }

            const validationResult = sizeSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            const updatedSize = await prisma.size.update({
                where: { id: parsedSizeId },
                data: {
                    size: validationResult.data.size,
                    sizeGuid: validationResult.data.sizeGuid,
                },
            });

            return res.status(200).json(updatedSize);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error updating size' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const parsedSizeId = parseInt(sizeId as string, 10);
            if (isNaN(parsedSizeId)) {
                return res.status(400).json({ error: 'Invalid size ID' });
            }

            await prisma.size.delete({
                where: { id: parsedSizeId },
            });

            return res.status(204).end(); // No content response
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error deleting size' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
