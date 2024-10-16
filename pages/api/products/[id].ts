// /pages/api/products/[id].ts

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product'+error });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, price, discount, images } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseInt(price),
          discount: parseInt(discount),
          images,
        },
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).end();
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
