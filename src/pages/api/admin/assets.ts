import { withAdmin } from "@utils/session"
import multer from "multer"
import appConfig from "@config"
import { Storage } from "@google-cloud/storage"
import { AssetResponse } from "@models/api/asset"
import crypto from "crypto"
import { NextApiRequest, NextApiResponse } from "next"

export default withAdmin(async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "POST":
      return post(req, res)
    case "DELETE":
      return del(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
})

const upload = multer({
  storage: multer.memoryStorage(),
})

const storage = new Storage()
const bucket = storage.bucket(appConfig.bucketName)

async function post(req: any, res: any) {
  // Read asset from file upload
  const multerMiddleware = upload.single("file")
  multerMiddleware(req, res, async function (err) {
    if (err) {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    }

    // Write asset to Google Cloud Storage
    const file = req.file
    const filename = file.originalname as string
    const ext = filename.split(".").pop()
    const randomFilename = crypto.randomUUID() + "." + ext

    const remoteFile = bucket.file(randomFilename)
    const stream = remoteFile.createWriteStream()
    stream.write(file.buffer, (error) => {
      if (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" })
      }
      stream.end()
    })

    // Wait for upload to complete and return
    await new Promise((resolve, reject) => {
      stream.on("error", reject)
      stream.on("finish", resolve)
    })
      .then(() => {
        const response: AssetResponse = {
          publicUrl: remoteFile.publicUrl(),
        }
        res.json(response)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).json({ message: "Internal server error" })
      })
  })

  return
}

async function del(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid query, missing id param" })
  }

  const file = bucket.file(id)

  return file
    .delete()
    .then(() => {
      res.status(204).send("")
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ message: "Internal server error" })
    })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
