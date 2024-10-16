import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';
import sizeSchema from '@/schema/size';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId } = req.query;
    if (req.method === 'GET') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            if (isNaN(parsedProductId)) return res.status(400).json({ error: 'Invalid product ID' });

            const sizes = await prisma.size.findMany({
                where: { productint: parsedProductId },
            });

            return res.status(200).json(sizes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error retrieving sizes' });
        }
    }
    else if (req.method === 'POST') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            if (isNaN(parsedProductId)) return res.status(400).json({ error: 'Invalid product ID' });

            const validationResult = sizeSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            const newSize = await prisma.size.create({
                data: {
                    size: validationResult.data.size,
                    sizeGuid: validationResult.data.sizeGuid,
                    product: { connect: { id: parsedProductId } },
                },
            });

            return res.status(201).json(newSize);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating size' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
