# PrivoSend - Anonymous File Sharing

A secure, anonymous file sharing web application that allows users to share files instantly without requiring registration or personal information.

## Features

- **Anonymous Sharing**: No email, phone, or account required - just your first name
- **Secure File Transfer**: Files are encrypted and stored temporarily
- **Share Code System**: Simple 8-character alphanumeric codes for easy sharing
- **Automatic Expiration**: Files are automatically deleted after 24 hours
- **Rate Limiting**: Built-in protection against abuse
- **Progress Indicators**: Real-time upload progress and status updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **File Storage**: Local filesystem (configurable for cloud storage)
- **Encryption**: AES-256 encryption for file security
- **ZIP Creation**: JSZip for bundling multiple files

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd privosend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Senders:
1. Go to the upload page
2. Enter your first name
3. Drag and drop files or click to browse
4. Click "Get Share Code"
5. Copy the generated share code and give it to the recipient

### For Recipients:
1. Go to the download page
2. Enter the share code
3. View file information and download all files as a ZIP archive

## Configuration

### Environment Variables

- `ENCRYPTION_KEY`: Secret key for file encryption (generate a secure random key)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 100MB)
- `UPLOAD_EXPIRATION_HOURS`: File expiration time (default: 24 hours)

### Rate Limiting

- **Uploads**: 10 uploads per IP per hour
- **Downloads**: 50 downloads per IP per hour

### File Limits

- Maximum file size: 100MB per file
- Maximum downloads per share code: 10
- Default expiration: 24 hours

## Security Features

- **File Encryption**: All files are encrypted using AES-256
- **Temporary Storage**: Files are automatically deleted after expiration
- **Rate Limiting**: Prevents abuse through IP-based rate limiting
- **No Personal Data**: Only first name is collected, no email/phone required
- **Session Management**: Secure session handling with automatic cleanup

## API Endpoints

### POST /api/upload
Upload files and create a share session.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Fields: senderName (string), files (File[])

**Response:**
```json
{
  "shareCode": "A9F-KQ21",
  "expiresAt": "2024-01-01T00:00:00.000Z",
  "fileCount": 3
}
```

### GET /api/validate?code={shareCode}
Validate a share code and get file information.

**Response:**
```json
{
  "senderName": "John",
  "files": [
    {
      "name": "document.pdf",
      "size": 1024000
    }
  ],
  "totalSize": 1024000,
  "expiresAt": "2024-01-01T00:00:00.000Z",
  "downloadCount": 0,
  "maxDownloads": 10
}
```

### GET /api/download?code={shareCode}
Download files as a ZIP archive.

**Response:**
- Content-Type: application/zip
- Content-Disposition: attachment; filename="files-{shareCode}.zip"

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Considerations

1. **Storage**: Replace local filesystem with cloud storage (S3, Cloudflare R2)
2. **Database**: Replace in-memory storage with PostgreSQL or MongoDB
3. **CDN**: Use a CDN for better performance
4. **SSL**: Ensure HTTPS is enabled
5. **Monitoring**: Add logging and monitoring
6. **Backups**: Implement backup strategy for critical data

## Development

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── download/      # Download endpoint
│   │   ├── upload/        # Upload endpoint
│   │   └── validate/      # Validation endpoint
│   ├── download/          # Download page
│   ├── upload/           # Upload page
│   └── layout.tsx        # Root layout
├── lib/                   # Utility libraries
│   ├── crypto.ts         # Encryption utilities
│   ├── rate-limit.ts     # Rate limiting
│   └── session.ts        # Session management
└── components/           # React components
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Security

For security issues, please email security@privosend.com instead of using the issue tracker.

## Support

- Documentation: [https://docs.privosend.com](https://docs.privosend.com)
- Issues: [GitHub Issues](https://github.com/your-username/privosend/issues)
- Email: support@privosend.com