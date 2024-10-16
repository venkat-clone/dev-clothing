// import * as dateFn from "date-fns";
// import formidable from "formidable";
import { Fields, Files, IncomingForm } from "formidable";
import { mkdir, stat } from "fs/promises";
import mime from "mime";
import type { NextApiRequest } from "next";
import { join } from "path";

// export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {

  return new Promise(async (resolve, reject) => {
    const uploadDir = join(
      process.env.ROOT_DIR || process.cwd(),
      `/uploads/${Date.now()}`
    );

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(e);
        reject(e);
        return;
      }
    }

    const form = new IncomingForm({
      maxFiles: 2,
      maxFileSize: 1024 * 1024, // 1mb
      uploadDir,
      filename: (_name, _ext, part) => {
        const uniqueSuffix = `${_name}${Math.round(Math.random() * 1e9)}`;
        const filename = `${part.name || "unknown"}-${uniqueSuffix}.png`;
        return filename;
      },

    });
    form.parse(req, function (err, fields, files) {
      console.log(files);
      if (err) reject(err);
      else resolve({ fields, files });
    });
    form.addListener("*", (err) => {
      console.log(err);
    });


  });
};