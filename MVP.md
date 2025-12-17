# Lead Gen Machine - MVP Overview

## Project Purpose

A personalized messaging template builder designed for sales teams to generate highly customized outreach messages at scale using data from CSV/Excel files and optional AI enhancement.

## MVP Goals

- Reduce time spent manually writing personalized cold outreach messages
- Enable batch generation of personalized content for multiple leads
- Support multiple data formats (CSV, Excel)
- Provide optional AI-powered message enhancement
- Allow easy export and distribution of generated messages

## Core Features (MVP Phase)

### 1. Data Upload & Processing
- Drag-and-drop file upload interface
- Support for CSV and Excel (.xlsx, .xls) files
- Automatic data parsing and validation
- Error handling for malformed files

### 2. Data Preview
- Display uploaded data in table format
- Show row count and column information
- Scroll through data before proceeding
- Validate data integrity

### 3. Template Builder
- Create message templates with natural language
- Add personalization placeholders using available data columns
- Visual tag system for inserted placeholders
- Live preview of personalized message using first row data
- Support for multiple personalization combinations

### 4. Message Generation
- Batch generation of personalized messages for all leads
- Optional AI enhancement using Claude API
- Real-time progress tracking
- Error handling for generation failures

### 5. Message Review & Export
- View generated messages one by one
- Copy individual messages to clipboard
- Switch between original and AI-enhanced versions
- Export options:
  - CSV (with metadata)
  - Excel spreadsheet
  - Plain text file

### 6. User Experience
- Multi-step workflow with clear navigation
- Progress indicators showing current step
- Responsive design that works on desktop and tablet
- Clear error messages and validation feedback
- Loading states and progress bars

## User Workflow

```
1. Upload File
   ↓
2. Preview Data
   ↓
3. Build Template
   ↓
4. Generate Messages (with optional AI)
   ↓
5. Review & Export
```

## Out of Scope (V2+)

- User authentication and accounts
- Database storage of templates
- Template library/marketplace
- Team collaboration features
- Campaign tracking and analytics
- Direct API integrations (LinkedIn, Gmail, etc.)
- A/B testing
- Scheduled sending
- Webhook support

## Success Metrics

### For MVP Launch
- ✅ All core features functional
- ✅ Build succeeds without errors
- ✅ Can upload CSV/Excel files
- ✅ Generate personalized messages
- ✅ Export in multiple formats
- ✅ Optional AI enhancement works

### User Experience
- Intuitive 5-step workflow
- Under 2 minutes to generate 100 messages
- Clear error messages
- Responsive on desktop/tablet

## Technical Constraints

- Client-side file processing (no backend storage)
- Single-threaded message generation
- API calls sequential (for rate limiting)
- No authentication required
- Stateless between sessions

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## File Size Limits

- CSV: Up to 50MB
- Excel: Up to 50MB
- Typical usage: 100-10,000 leads per file

## Data Requirements

Users must provide a CSV/Excel file with at least one column. Recommended columns:
- `name` - Lead's name
- `company` - Company name
- `email` - Email address
- `linkedin_profile` - LinkedIn URL
- `website` - Company website
- Custom fields supported

## Deployment Target

- Vercel (recommended for Next.js)
- Self-hosted Node.js server
- Docker container support

## Performance Targets

- File upload: < 2 seconds (50MB)
- Data preview: Instant
- Template preview: Instant (< 100ms)
- Batch generation (100 leads):
  - Without AI: < 1 second
  - With AI: 30-60 seconds (depends on API)
- Export generation: < 2 seconds

## Known Limitations (MVP)

1. No persistence between sessions
2. Generation happens sequentially
3. No batch API calls to AI (one message at a time)
4. No rate limiting for API calls
5. File upload size dependent on browser
6. No offline mode

## Future Improvements (V2)

- Database integration for template storage
- User accounts and team management
- Template library with pre-built templates
- Advanced personalization (conditional logic)
- Batch AI API requests for faster generation
- Campaign tracking and delivery
- A/B testing capabilities
- Direct integrations (LinkedIn, Gmail, Outreach.io)
- Mobile app version

## Definition of Done (MVP)

- [ ] All features implemented and tested
- [ ] Code builds without errors
- [ ] README with setup instructions
- [ ] Example CSV file provided
- [ ] Responsive design verified
- [ ] Error handling tested
- [ ] Code pushed to GitHub
- [ ] Deployed to live URL (optional)

## Estimated Development Time

- Project Setup: 1 hour
- UI Components: 4 hours
- File Upload & Processing: 2 hours
- Template Builder: 3 hours
- Generation & Export: 3 hours
- AI Integration: 2 hours
- Testing & Fixes: 2 hours
- Documentation: 1 hour

**Total: ~18 hours**

With the current approach, this MVP was completed in approximately 2-3 hours of development time.
