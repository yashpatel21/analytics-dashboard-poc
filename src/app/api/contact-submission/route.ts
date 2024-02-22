import { analytics } from "@/utils/analytics"

export async function POST(req: Request) {
	
	const leadData = await req.json()

	try {
		analytics.track('lead', {
			date: leadData.date,
			event: {
				page: '/contact',
			}
		})
	  } catch (err) {
		// fail silently to not affect request
		console.error(err)
	  }

	return new Response("", {status: 200})
}