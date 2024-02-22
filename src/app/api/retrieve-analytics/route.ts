import { NextResponse } from "next/server"
import { analytics } from '@/utils/analytics'

export async function POST(req: Request) {
	const track_options = await req.json()
	const pageviews = await analytics.retrieveDays('pageview', track_options.TRACKING_DAYS)
	const leads = await analytics.retrieveDays('lead', track_options.TRACKING_DAYS)
	return NextResponse.json({ pageviews, leads});
}