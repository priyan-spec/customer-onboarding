import { useEffect, useRef, useState } from 'react'

const documentTypes = ['ID Proof', 'Business Certificate', 'Address Proof', 'Other']

const initialFiles = [
  {
    id: 'sample-1',
    name: 'id-proof.png',
    size: '860 KB',
    type: 'image/png',
    category: 'ID Proof',
    progress: 86,
    url: '',
  },
  {
    id: 'sample-2',
    name: 'business-certificate.pdf',
    size: '2.4 MB',
    type: 'application/pdf',
    category: 'Business Certificate',
    progress: 100,
    url: '',
  },
]

function formatSize(size) {
  if (!size) return '0 KB'
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function FileUpload() {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState(initialFiles)
  const fileInputRef = useRef(null)
  const objectUrlsRef = useRef([])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFiles((items) =>
        items.map((item) => ({
          ...item,
          progress: item.progress >= 100 ? 100 : Math.min(item.progress + 7, 100),
        })),
      )
    }, 700)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function addFiles(fileList) {
    const nextFiles = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: formatSize(file.size),
      type: file.type || 'application/octet-stream',
      category: 'Other',
      progress: 12,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }))

    objectUrlsRef.current = [
      ...objectUrlsRef.current,
      ...nextFiles.map((file) => file.url).filter(Boolean),
    ]

    setFiles((items) => [...nextFiles, ...items])
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  function updateCategory(id, category) {
    setFiles((items) => items.map((item) => (item.id === id ? { ...item, category } : item)))
  }

  return (
    <div>
      <div
        className={`upload-zone d-flex flex-column align-items-center justify-content-center text-center p-4 ${dragging ? 'dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <span className="role-icon mb-3">
          <i className="bi bi-cloud-arrow-up" aria-hidden="true"></i>
        </span>
        <h3 className="h5 fw-bold mb-2">Drag and drop documents here</h3>
        <p className="text-secondary mb-3">Upload multiple files, images, and PDFs for onboarding review.</p>
        <input
          ref={fileInputRef}
          className="d-none"
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(event) => addFiles(event.target.files)}
        />
        <button className="btn btn-outline-primary" type="button" onClick={() => fileInputRef.current?.click()}>
          <i className="bi bi-paperclip me-2" aria-hidden="true"></i>
          Browse files
        </button>
      </div>

      <div className="row g-3 mt-1">
        {files.map((file) => (
          <div className="col-12 col-md-6" key={file.id}>
            <div className="file-preview p-3">
              <div className="d-flex gap-3">
                <span className="preview-thumb">
                  {file.url ? (
                    <img src={file.url} alt="" />
                  ) : (
                    <i className={`bi ${file.type.includes('pdf') ? 'bi-file-earmark-pdf' : 'bi-file-earmark-image'}`} aria-hidden="true"></i>
                  )}
                </span>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div>
                      <h4 className="h6 fw-semibold mb-1 text-truncate">{file.name}</h4>
                      <p className="small text-secondary mb-2">{file.size}</p>
                    </div>
                    <span className="badge badge-soft-blue rounded-pill">{file.type.includes('pdf') ? 'PDF' : 'Image'}</span>
                  </div>
                  <select
                    className="form-select form-select-sm mb-2"
                    value={file.category}
                    onChange={(event) => updateCategory(file.id, event.target.value)}
                    aria-label={`Document type for ${file.name}`}
                  >
                    {documentTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  <div className="progress" role="progressbar" aria-label={`${file.name} upload progress`} aria-valuenow={file.progress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${file.progress}%` }}></div>
                  </div>
                  <div className="small text-secondary mt-1">{file.progress}% uploaded</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUpload
