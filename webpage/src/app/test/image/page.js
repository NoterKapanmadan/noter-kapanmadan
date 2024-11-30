import { SERVER_URL } from "@/utils/constants";
import ImageUploader from "./ImageUploader";
import { getFileUploadToken } from "@/utils/file";

export default async function Home() {

    const jwt = await getFileUploadToken();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Image Uploader</h1>
      </div>
      <ImageUploader jwt={jwt} />
    </main>
  )
}

