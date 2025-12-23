import { NextRequest, NextResponse } from 'next/server';

const WINDMILL_URL = process.env.NEXT_PUBLIC_WINDMILL_URL || 'http://localhost:8000';
const WINDMILL_WORKSPACE = process.env.NEXT_PUBLIC_WINDMILL_WORKSPACE || 'blueprint';
const WINDMILL_TOKEN = process.env.WINDMILL_API_TOKEN || 'FmYFqLYfOX7yyt8N9a1TOxbHMtkqyKsx';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, args } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Flow path is required' },
        { status: 400 }
      );
    }

    // Submit job to Windmill
    const response = await fetch(
      `${WINDMILL_URL}/api/w/${WINDMILL_WORKSPACE}/jobs/run/f/${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WINDMILL_TOKEN}`,
        },
        body: JSON.stringify(args || {}),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Windmill API error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const jobId = await response.text();
    const cleanJobId = jobId.replace(/"/g, '');

    // Poll for job completion
    const maxAttempts = 120; // 60 seconds (120 * 500ms)
    const pollInterval = 500;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));

      // Try the completed endpoint first (faster when job is done)
      let statusResponse = await fetch(
        `${WINDMILL_URL}/api/w/${WINDMILL_WORKSPACE}/jobs/completed/get/${cleanJobId}`,
        {
          headers: {
            'Authorization': `Bearer ${WINDMILL_TOKEN}`,
          },
        }
      );

      // If not found in completed, check general job status
      if (!statusResponse.ok) {
        statusResponse = await fetch(
          `${WINDMILL_URL}/api/w/${WINDMILL_WORKSPACE}/jobs/get/${cleanJobId}`,
          {
            headers: {
              'Authorization': `Bearer ${WINDMILL_TOKEN}`,
            },
          }
        );
      }

      if (statusResponse.ok) {
        const jobStatus = await statusResponse.json();

        // Check if job has completed (has result field)
        if (jobStatus.success === true && jobStatus.result !== undefined) {
          return NextResponse.json(jobStatus.result);
        }

        if (jobStatus.success === false) {
          return NextResponse.json(
            { error: 'Job failed', details: jobStatus.result },
            { status: 500 }
          );
        }

        // Job still running or queued - continue polling
      }
    }

    return NextResponse.json(
      { error: 'Job timeout - exceeded maximum polling attempts' },
      { status: 408 }
    );
  } catch (error) {
    console.error('Windmill proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
