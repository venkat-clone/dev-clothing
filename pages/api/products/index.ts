// /pages/api/products/index.ts

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseForm } from '../../../lib/parse-form';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { search } = req.query;
      const products = await prisma.product.findMany({
        where: {
          name: {
            contains: search as string || '',
            mode: 'insensitive', // Case-insensitive search
          },
        },
      });
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else if (req.method === 'POST') {

    try {


      // Extract fields and files
      const { name, description, price, discount, imagePaths } = req.body;

      // Create the product in the database
      const product = await prisma.product.create({
        data: {
          name: name as unknown as string,
          description: description as unknown as string,
          price: parseFloat(price as unknown as string),
          discount: parseFloat(discount as unknown as string),
          images: imagePaths,
        },
      });
      console.log('Product created successfully');
      return res.status(201).json(product);
    } catch (error: any) {

      console.error(error);
      return res.status(500).json({ error: 'Error creating product', message: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}







