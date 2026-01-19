-- AI Course Analysis Storage Table
-- This table stores AI-analyzed course curriculum results to avoid re-analyzing
-- and to persist editable changes

CREATE TABLE IF NOT EXISTS ai_course_analysis (
  id BIGSERIAL PRIMARY KEY,
  course_id VARCHAR(100) NOT NULL UNIQUE,
  subject_name VARCHAR(255),
  subject_code VARCHAR(50),
  
  -- AI Analysis Results (stored as JSON for flexibility)
  course_outcomes JSONB,                    -- Array of course outcomes
  program_outcomes JSONB,                   -- Array of program outcomes
  co_po_mapping JSONB,                      -- Mapping between COs and POs
  lectures JSONB,                           -- Lecture plan details
  practicals JSONB,                         -- Practical/lab session details
  pbl_activities JSONB,                     -- Problem-based learning activities
  justifications JSONB,                     -- CO-PO mapping justifications
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100),
  
  -- Indexing for performance
  CONSTRAINT fk_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX idx_ai_analysis_course_id ON ai_course_analysis(course_id);
CREATE INDEX idx_ai_analysis_created_at ON ai_course_analysis(created_at DESC);
CREATE INDEX idx_ai_analysis_updated_at ON ai_course_analysis(updated_at DESC);

-- Create a view for easy querying
CREATE OR REPLACE VIEW ai_analysis_summary AS
SELECT 
  id,
  course_id,
  subject_name,
  subject_code,
  (course_outcomes->>0)::text as first_co,
  jsonb_array_length(course_outcomes) as total_cos,
  jsonb_array_length(program_outcomes) as total_pos,
  jsonb_array_length(lectures) as total_lectures,
  created_at,
  updated_at
FROM ai_course_analysis;

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE ai_course_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - customize based on your auth setup)
-- Policy to allow users to read their own course analysis
CREATE POLICY "Users can read their course analysis" ON ai_course_analysis
  FOR SELECT
  USING (
    course_id IN (
      SELECT id FROM courses WHERE faculty_id = auth.uid()
    )
  );

-- Policy to allow users to insert their own course analysis
CREATE POLICY "Users can insert course analysis" ON ai_course_analysis
  FOR INSERT
  WITH CHECK (
    course_id IN (
      SELECT id FROM courses WHERE faculty_id = auth.uid()
    )
  );

-- Policy to allow users to update their own course analysis
CREATE POLICY "Users can update their course analysis" ON ai_course_analysis
  FOR UPDATE
  USING (
    course_id IN (
      SELECT id FROM courses WHERE faculty_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER ai_analysis_updated_at_trigger
BEFORE UPDATE ON ai_course_analysis
FOR EACH ROW
EXECUTE FUNCTION update_ai_analysis_updated_at();

-- Sample queries for reference:

-- Get all analysis for a course
-- SELECT * FROM ai_course_analysis WHERE course_id = 'CS101';

-- Get recent analyses
-- SELECT * FROM ai_course_analysis ORDER BY updated_at DESC LIMIT 10;

-- Update analysis result
-- UPDATE ai_course_analysis 
-- SET lectures = '...new_json...' 
-- WHERE course_id = 'CS101';

-- Delete old analysis (older than 6 months)
-- DELETE FROM ai_course_analysis WHERE updated_at < NOW() - INTERVAL '6 months';
