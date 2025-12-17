# Lead Gen Machine

A personalized messaging template builder for sales teams. Generate highly customized outreach messages at scale using data from CSV/Excel files.

## Features

- **File Upload**: Upload CSV or Excel files with lead data
- **Data Preview**: See your data before processing
- **Template Builder**: Create message templates with personalization tags
- **Message Generation**: Generate personalized messages for all leads
- **AI Enhancement**: Optional Claude API integration to enhance messages
- **Export Options**: Export generated messages as CSV, Excel, or plain text
- **Copy to Clipboard**: Quickly copy individual messages

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API (optional)
- **File Processing**: PapaParse (CSV), XLSX (Excel)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd lead-gen-machine
npm install
```

### Environment Setup

Create a `.env.local` file in the project root (optional, for AI features):

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### Running the App

Development mode:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

Production build:

```bash
npm run build
npm start
```

## Usage

1. **Upload Data**: Click the upload area and select your CSV or Excel file
   - Columns will become available for personalization

2. **Preview Data**: Review your uploaded data in the preview screen

3. **Build Template**:
   - Click available fields to insert placeholders
   - Create personalization combinations (e.g., Name + Company)
   - View live preview with sample data

4. **Generate Messages**:
   - Choose whether to enhance with AI (requires API key)
   - Click "Generate" to create personalized messages
   - View, copy, or export individual messages

5. **Export**:
   - Download as CSV, Excel, or text file
   - Each message is associated with the original row data

## Sample Data Format

Your CSV/Excel file should have columns like:

| name | company | linkedin_profile | email |
|------|---------|------------------|-------|
| John Smith | Acme Corp | linkedin.com/in/jsmith | john@acme.com |
| Jane Doe | Tech Inc | linkedin.com/in/janedoe | jane@tech.com |

## API Endpoints

### `POST /api/generate`

Generate personalized messages.

**Request:**
```json
{
  "template": "Hi {name}, I noticed your work at {company}...",
  "personalizationFields": [
    { "id": "1", "column": "name", "placeholder": "{name}" },
    { "id": "2", "column": "company", "placeholder": "{company}" }
  ],
  "data": [...],
  "useAI": false
}
```

**Response:**
```json
{
  "success": true,
  "count": 100,
  "messages": [
    {
      "original": "Hi John Smith, I noticed your work at Acme Corp...",
      "enhanced": "Hi John, I was impressed by your leadership at Acme...",
      "row": { "name": "John Smith", "company": "Acme Corp", ... }
    }
  ]
}
```

## Features Coming Soon (V2)

- Template library and marketplace
- Team collaboration and sharing
- Advanced personalization (dynamic content generation)
- Direct integrations (LinkedIn, Gmail)
- Campaign analytics and tracking
- Database storage for templates and campaigns
- A/B testing functionality

## Architecture

```
/app
  /api/generate          - Message generation endpoint
  /layout.tsx            - Root layout
  /page.tsx              - Main application page
  /globals.css           - Global styles

/components
  FileUpload.tsx         - File upload interface
  DataPreview.tsx        - Data preview table
  TemplateBuilder.tsx    - Template creation
  GenerateMessages.tsx   - Message generation & export

/hooks
  useMessageGeneration.ts - Generation logic hook
```

## Development Notes

- All components are client-side (marked with 'use client')
- CSV parsing with PapaParse handles various formats
- Excel support via XLSX library
- Tailwind CSS for styling
- Icons from lucide-react
- API route handles bulk processing efficiently

## Notes

- AI enhancement requires a valid Anthropic API key in `.env.local`
- If no API key is provided, messages are generated with placeholders only
- Generated messages are processed on the client side for CSV/Excel export
- File size limits are browser dependent (typically 100MB+)

## License

MIT
