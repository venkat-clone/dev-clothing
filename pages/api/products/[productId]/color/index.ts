import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';
import colorSchema from '@/schema/color';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { productId } = req.query;
    if (req.method === 'GET') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            if (isNaN(parsedProductId)) return res.status(400).json({ error: 'Invalid product ID' });

            const colors = await prisma.color.findMany({
                where: { productint: parsedProductId },
            });

            return res.status(200).json(colors);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error retrieving colors' });
        }
    }
    else if (req.method === 'POST') {
        try {
            const parsedProductId = parseInt(productId as string, 10);
            if (isNaN(parsedProductId)) return res.status(400).json({ error: 'Invalid product ID' });

            const validationResult = colorSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            const newcolor = await prisma.color.create({
                data: {
                    color: validationResult.data.color,
                    colorGuid: validationResult.data.colorGuid,
                    product: { connect: { id: parsedProductId } },
                },
            });

            return res.status(201).json(newcolor);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error creating color' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
