'use client'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import { getDate } from '@/utils'
import { useEffect, useRef, useState } from 'react'

const Page = () => {
	const TRACKING_DAYS = 7
	const [pageviews, setPageviews] = useState([{ date: '', events: [{ '': 0 }] }])
	const [leads, setLeads] = useState([{ date: '', events: [{ '': 0 }] }])
	const [avgVisitorsPerDay, setAvgVisitorsPerDay] = useState('')
	const [amtVisitorsToday, setAmtVisitorsToday] = useState(0)
	const [avgLeadsPerDay, setAvgLeadsPerDay] = useState('')
	const [amtLeadsToday, setAmtLeadsToday] = useState(0)
	const [topCountries, setTopCountries] = useState<[string, number][]>([])

	const initialized = useRef(false)

	const fetchAnalyticsData = () => {
		return new Promise((resolve, reject) => {
			fetch('/api/retrieve-analytics', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ TRACKING_DAYS }),
			})
				.then((response) => response.json())
				.then((analyticsResults) => {
					setPageviews(analyticsResults.pageviews)
					setLeads(analyticsResults.leads)
					// Resolve the promise with a meaningful value once the state is updated
					resolve({ pageviews: analyticsResults.pageviews, leads: analyticsResults.leads })
				})
				.catch((error) => {
					console.error('Error fetching analytics data:', error)
					reject(error) // Reject the promise if there's an error
				})
		})
	}

	const updateMetrics = () => {
		fetchAnalyticsData().then((value) => {
			const { pageviews, leads } = value as { pageviews: any; leads: any }

			const totalPageviews = pageviews.reduce((acc: number, curr: any) => {
				return (
					acc +
					curr.events.reduce((acc: number, curr: any) => {
						return acc + Number(Object.values(curr)[0])
					}, 0)
				)
			}, 0)

			const totalLeads = leads.reduce((acc: number, curr: any) => {
				return (
					acc +
					curr.events.reduce((acc: number, curr: any) => {
						return acc + Number(Object.values(curr)[0])
					}, 0)
				)
			}, 0)

			setAvgVisitorsPerDay((totalPageviews / TRACKING_DAYS).toFixed(1))
			setAvgLeadsPerDay((totalLeads / TRACKING_DAYS).toFixed(1))
			setAmtVisitorsToday(
				pageviews
					.filter((ev: { date: string }) => ev.date === getDate())
					.reduce((acc: number, curr: { events: any[] }) => {
						return (
							acc +
							Number(
								curr.events.reduce(
									(acc: string, curr: { [s: string]: unknown } | ArrayLike<unknown>) =>
										String(Number(acc) + Number(Object.values(curr)[0])),
									0
								)
							)
						)
					}, 0)
			)

			setAmtLeadsToday(
				leads
					.filter((ev: { date: string }) => ev.date === getDate())
					.reduce((acc: number, curr: { events: any[] }) => {
						return (
							acc +
							Number(
								curr.events.reduce(
									(acc: string, curr: { [s: string]: unknown } | ArrayLike<unknown>) =>
										String(Number(acc) + Number(Object.values(curr)[0])),
									0
								)
							)
						)
					}, 0)
			)

			const topCountriesMap = new Map<string, number>()

			for (let i = 0; i < pageviews.length; i++) {
				const day = pageviews[i]
				if (!day) continue

				for (let j = 0; j < day.events.length; j++) {
					const event = day.events[j]
					if (!event) continue

					const key = Object.keys(event)[0]! as string
					const value = Object.values(event)[0]! as number
					try {
						const parsedKey = JSON.parse(key)
						const country = parsedKey?.country
						if (country) {
							if (topCountriesMap.has(country)) {
								const prevValue = topCountriesMap.get(country)!
								topCountriesMap.set(country, prevValue + value)
							} else {
								topCountriesMap.set(country, value)
							}
						}
					} catch (e) {
						console.log(e)
						continue
					}
				}
			}

			setTopCountries(
				[...topCountriesMap.entries()]
					.sort((a, b) => {
						if (a[1] > b[1]) return -1
						else return 1
					})
					.slice(0, 5)
			)
		})
	}

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true
			updateMetrics()

			setInterval(updateMetrics, 5000)
		}
	}, [])

	// const pageviews = await analytics.retrieveDays('pageview', TRACKING_DAYS)
	// const leads = await analytics.retrieveDays('lead', TRACKING_DAYS)

	return (
		<div className="min-h-screen w-full py-12 flex flex-col justify-center items-center gap-16">
			<div className="flex flex-row justify-center items-center">
				<h1 className="text-white text-4xl">Analytics Dashboard</h1>
			</div>
			<div className="relative w-full max-w-6xl mx-auto text-white">
				<AnalyticsDashboard
					avgVisitorsPerDay={avgVisitorsPerDay}
					amtVisitorsToday={amtVisitorsToday}
					avgLeadsPerDay={avgLeadsPerDay}
					amtLeadsToday={amtLeadsToday}
					timeseriesPageviews={pageviews}
					topCountries={topCountries}
				/>
			</div>
		</div>
	)
}

export default Page
