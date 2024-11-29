'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { FILE_SERVER_URL } from '@/utils/constants'
import { saveFilesPublic } from '@/utils/file'

export default function ImageUploader({ jwt }) {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState(null)
    const fileInputRef = useRef(null)

    const handleFileChange = useCallback((e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setSelectedFiles(filesArray)

            const previewUrls = filesArray.map(file => URL.createObjectURL(file))
            setPreviews(previewUrls)
        }
    }, [])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (selectedFiles.length === 0) return

        setUploading(true)
        setUploadStatus('Uploading...')

        const formData = new FormData()
        selectedFiles.forEach(file => formData.append('files', file))

        formData.append('jwt', jwt)

        try {
            // upload images to request pool
            const result = await fetch(`${FILE_SERVER_URL}/clientStorage/uploadBatch`, {
                method: 'POST',
                // Send JWT and Form Data
                body: formData,
            });

            const data = await result.json();




            if (result.success) {
                setUploadStatus(`Successfully uploaded ${data.path}`);
                setSelectedFiles([])
                setPreviews([])
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        } catch (error) {
            setUploadStatus('Error uploading images')
            console.error('Upload error:', error)
        } finally {
            setUploading(false)
        }
    }, [selectedFiles])

    const savePublic = useCallback(async () => {
        const path = await saveFilesPublic(jwt);
        setUploadStatus(`Successfully saved ${path}`);
    }
        , [jwt]);


    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (Select multiple files)</p>
                        </div>
                        <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </label>
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={uploading || selectedFiles.length === 0}
                    className="w-full"
                >
                    {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`}
                </Button>
                <Button onClick={savePublic}>Save permanently</Button>
            </form>

            {uploadStatus && (
                <p className={`mt-4 text-center ${uploadStatus.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {uploadStatus}
                </p>
            )}
        </div>
    )
}

