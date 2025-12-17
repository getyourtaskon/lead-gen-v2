# Lead Gen Machine - Technical Specifications & Tech Stack

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.35
- **Runtime**: React 18.3.1
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.3.0
- **UI Components**: Lucide React (icons)
- **Build Tool**: Next.js built-in (Webpack)

### Backend
- **Runtime**: Node.js (via Next.js)
- **API**: Next.js API Routes
- **Framework**: Next.js (full-stack)

### AI/ML Integration
- **AI Provider**: Anthropic Claude
- **SDK**: @anthropic-ai/sdk 0.16.0
- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)

### File Processing
- **CSV Parsing**: papaparse 5.4.1
- **Excel Parsing**: xlsx 0.18.5
- **File Handling**: Browser File API

### Development Tools
- **Linting**: ESLint 8.50.0
- **Type Checking**: TypeScript strict mode
- **Code Formatting**: Configured via ESLint
- **Package Manager**: npm

## System Architecture

```
┌─────────────────────────────────────────────┐
│         Client Browser (React 18)           │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │   Next.js App Router (Pages)         │  │
│  │  - /                (Main UI)        │  │
│  │  - /api/generate    (Backend API)    │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │   React Components (Client-side)     │  │
│  │  - FileUpload                        │  │
│  │  - DataPreview                       │  │
│  │  - TemplateBuilder                   │  │
│  │  - GenerateMessages                  │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │   Custom Hooks                       │  │
│  │  - useMessageGeneration              │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│         Next.js Server Runtime              │
├─────────────────────────────────────────────┤
│  POST /api/generate                        │
│  - Receives template + data                │
│  - Generates personalized messages         │
│  - Optional AI enhancement                 │
│  - Returns JSON response                   │
└─────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────┐
│         External APIs                       │
├─────────────────────────────────────────────┤
│  - Anthropic Claude API (optional)         │
│    POST https://api.anthropic.com/...      │
└─────────────────────────────────────────────┘
```

## File Structure

```
lead-gen-machine/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Message generation endpoint
│   ├── layout.tsx                # Root HTML layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
│
├── components/
│   ├── FileUpload.tsx            # File upload interface
│   ├── DataPreview.tsx           # Data preview table
│   ├── TemplateBuilder.tsx       # Template creation
│   └── GenerateMessages.tsx      # Generation & export
│
├── hooks/
│   └── useMessageGeneration.ts   # Message generation logic
│
├── public/                       # Static assets (if needed)
│
├── .next/                        # Next.js build output
├── node_modules/                 # Dependencies
├── package.json                  # Project metadata
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── postcss.config.js             # PostCSS config
├── next.config.js                # Next.js config
├── README.md                     # Project documentation
├── MVP.md                        # MVP specification
├── SPECS.md                      # This file
├── TIMELINE.md                   # Project timeline
└── .gitignore                    # Git ignore rules
```

## Component Specifications

### 1. FileUpload Component
**File**: `components/FileUpload.tsx`

**Props**:
```typescript
interface FileUploadProps {
  onDataUploaded: (data: Record<string, unknown>[]) => void;
}
```

**Features**:
- Drag and drop file upload
- Click to browse file system
- Accepts: .csv, .xlsx, .xls
- Validates file before processing
- Shows loading state
- Error handling with user messages

**State**:
- `isLoading`: boolean
- `error`: string

**Functions**:
- `handleFileUpload(file: File)`: Processes uploaded file

---

### 2. DataPreview Component
**File**: `components/DataPreview.tsx`

**Props**:
```typescript
interface DataPreviewProps {
  data: Record<string, unknown>[];
  onNext: () => void;
  onBack: () => void;
}
```

**Features**:
- Display data in table format
- Show row count and column count
- Display first 5 rows
- Navigation buttons
- Responsive table scrolling

---

### 3. TemplateBuilder Component
**File**: `components/TemplateBuilder.tsx`

**Props**:
```typescript
interface TemplateBuilderProps {
  data: Record<string, unknown>[];
  onNext: (template: string, fields: PersonalizationField[]) => void;
  onBack: () => void;
}
```

**Features**:
- Available fields panel (clickable)
- Template textarea with real-time editing
- Personalization field management
- Live preview with sample data
- Validation (template required)

**State**:
- `template`: string
- `personalizationFields`: PersonalizationField[]
- `selectedColumn`: string

**Data Model**:
```typescript
interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string; // e.g., "{name}"
}
```

---

### 4. GenerateMessages Component
**File**: `components/GenerateMessages.tsx`

**Props**:
```typescript
interface GenerateMessagesProps {
  template: string;
  personalizationFields: PersonalizationField[];
  data: Record<string, unknown>[];
  onBack: () => void;
}
```

**Features**:
- AI enhancement toggle (requires API key)
- Generate button with progress tracking
- View original vs enhanced messages
- Copy to clipboard functionality
- Export to CSV, Excel, text
- Individual message cards with metadata

**State**:
- `isLoading`: boolean
- `error`: string
- `messages`: GeneratedMessage[]
- `useAI`: boolean
- `viewMode`: 'original' | 'enhanced'
- `copiedIndex`: number | null

**Data Model**:
```typescript
interface GeneratedMessage {
  original: string;
  enhanced?: string;
  row: Record<string, unknown>;
}
```

---

### 5. useMessageGeneration Hook
**File**: `hooks/useMessageGeneration.ts`

**Interface**:
```typescript
function useMessageGeneration() {
  const {
    isLoading,
    error,
    messages,
    progress,
    generate
  } = useMessageGeneration();
}
```

**Parameters**:
```typescript
generate(
  template: string,
  personalizationFields: PersonalizationField[],
  data: Record<string, unknown>[],
  useAI: boolean = false
)
```

---

## API Specifications

### POST /api/generate

**Purpose**: Generate personalized messages

**Request**:
```typescript
interface GenerateRequest {
  template: string;
  personalizationFields: Array<{
    id: string;
    column: string;
    placeholder: string;
  }>;
  data: Record<string, unknown>[];
  useAI: boolean;
}
```

**Response**:
```typescript
interface GenerateResponse {
  success: boolean;
  count: number;
  messages: Array<{
    original: string;
    enhanced?: string;
    row: Record<string, unknown>;
  }>;
}
```

**Error Response**:
```typescript
{
  error: string;
}
```

**Status Codes**:
- 200: Success
- 400: Bad request (missing template or data)
- 500: Server error

**Processing Logic**:
1. Validate template and data
2. Loop through each data row
3. Replace placeholders with row values
4. If `useAI: true`, call Claude API for enhancement
5. Handle API failures gracefully (return original)
6. Return all generated messages

---

## Data Flow

### Upload Flow
```
User selects file
  ↓
FileUpload validates file
  ↓
PapaParse or XLSX.js parses data
  ↓
Returns Record<string, unknown>[]
  ↓
Stored in parent component state
```

### Template Building Flow
```
User clicks field button
  ↓
Inserts placeholder (e.g., {name})
  ↓
TemplateBuilder stores template
  ↓
Preview updates in real-time
  ↓
User submits template
```

### Generation Flow
```
User clicks Generate
  ↓
Calls /api/generate with:
  - template
  - personalizationFields
  - data
  - useAI flag
  ↓
API loops through data:
  - Replace placeholders
  - Call Claude API (if useAI)
  - Handle errors
  ↓
Return array of GeneratedMessage
  ↓
Display in UI
```

### Export Flow
```
User clicks Export button
  ↓
Prepare data array with messages
  ↓
PapaParse (CSV) or XLSX.js (Excel)
  ↓
Create blob
  ↓
Trigger download
```

## Environment Variables

### Required for AI Features
```bash
ANTHROPIC_API_KEY=sk-...
```

### Optional
```bash
# Build configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Type Definitions

```typescript
// Main data type
type Row = Record<string, unknown>;

// Personalization field
interface PersonalizationField {
  id: string;
  column: string;
  placeholder: string;
}

// Generated message
interface GeneratedMessage {
  original: string;
  enhanced?: string;
  row: Row;
}

// API request
interface GenerateRequest {
  template: string;
  personalizationFields: PersonalizationField[];
  data: Row[];
  useAI: boolean;
}

// API response
interface GenerateResponse {
  success: boolean;
  count: number;
  messages: GeneratedMessage[];
}
```

## Performance Specifications

### Frontend Performance
- Initial page load: < 2 seconds
- File upload processing: < 2 seconds (50MB)
- Template preview update: < 100ms
- UI interactions: < 50ms

### Backend Performance
- Generate endpoint response time:
  - Without AI: < 1 second (100 leads)
  - With AI: 30-60 seconds (depends on API)
- API call timeout: 30 seconds
- Max concurrent AI requests: 1

### File Handling
- Max file size: Browser limit (typically 100MB+)
- Supported formats: CSV, XLSX, XLS
- Character encoding: UTF-8
- Max rows per file: Unlimited (tested up to 10,000)

## Security Considerations

### Data Handling
- No data is stored on server
- No authentication required for MVP
- Sensitive data (email, phone) not logged
- API keys stored in .env.local (not committed)

### Input Validation
- File type validation
- CSV/Excel parsing error handling
- Template length limits
- Data sanitization for CSV export

### API Security
- ANTHROPIC_API_KEY in environment only
- No sensitive data sent to Claude
- Error messages don't expose internals
- Rate limiting depends on API provider

## Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

## Responsive Design

- Desktop (1024px+): Full layout
- Tablet (768px-1024px): Adjusted layout
- Mobile (< 768px): Single column (not optimized)

## Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.2.35 | Framework |
| react | 18.3.1 | UI Library |
| typescript | 5.x | Type Safety |
| tailwindcss | 3.3.0 | Styling |
| papaparse | 5.4.1 | CSV parsing |
| xlsx | 0.18.5 | Excel parsing |
| @anthropic-ai/sdk | 0.16.0 | Claude API |
| lucide-react | 0.263.1 | Icons |

## Build & Deployment

### Build Process
```bash
npm run build
```
- Compiles TypeScript
- Bundles React components
- Optimizes for production
- Generates static pages

### Deployment Platforms
- Vercel (recommended)
- Node.js server
- Docker container
- AWS Lambda (with adapters)

### Environment Setup
```bash
cp .env.local.example .env.local
# Add ANTHROPIC_API_KEY if using AI
npm install
npm run build
npm start
```

## Testing Strategy (Future)

- Unit tests: Jest + React Testing Library
- Integration tests: API route testing
- E2E tests: Playwright or Cypress
- Type safety: TypeScript strict mode
