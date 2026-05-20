CREATE INDEX "courses_search_vector_idx" ON "courses" USING gin ((
        setweight(to_tsvector('english', "course_title"), 'A') ||
        setweight(to_tsvector('english', "intro_summary"), 'B')
    ));