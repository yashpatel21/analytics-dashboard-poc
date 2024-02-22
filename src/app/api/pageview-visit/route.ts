import { analytics } from "@/utils/analytics"

export async function POST(req: Request) {
	
	const visitorData = await req.json()

	try {
		analytics.track('pageview', {
			date: visitorData.date,
			event: {
				page: '/',
				country: visitorData.country
			}
		})
	  } catch (err) {
		// fail silently to not affect request
		console.error(err)
	  }

	return new Response("", {status: 200})
}