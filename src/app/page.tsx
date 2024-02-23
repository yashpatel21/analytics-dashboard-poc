'use client'
import { formatDate } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
	const initialized = useRef(false)
	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true

			fetch('/api/get-ipreg-key', {
				method: 'GET',
			}).then(async function (response) {
				const res = await response.json()
				fetch(`https://api.ipregistry.co/?key=${res.key}`)
					.then(function (response) {
						return response.json()
					})
					.then(function (payload) {
						const countryCode = payload.location.country.code
						const currentDate = formatDate(new Date())

						const visitorAnalyticsData = { country: countryCode, date: currentDate }
						fetch('/api/pageview-visit', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify(visitorAnalyticsData),
						})
					})
			})
		}
	}, [])
	return (
		<main className="min-h-screen min-w-screen flex">
			<div className="text-white flex flex-row justify-center min-w-full items-center">
				<div className="flex flex-col text-center min-w-full gap-3 h-screen">
					<div className="h-20 flex flex-row justify-end items-center gap-5 pr-5">
						<Link href="/" className="hover:underline">
							Home
						</Link>
						<Link href="/contact" className="hover:underline">
							Contact Us
						</Link>
					</div>
					<div className="grow-[0.75]">
						<div className="h-min flex flex-row justify-center items-center gap-4">
							<h1 className="text-5xl">Analytics Dashboard</h1>
							<h3 className="text-sm bg-green-900/50 text-green-400 ring-green-400/25 rounded-md px-2 py-1 ring-2 ring-inset">
								Demo
							</h3>
						</div>
					</div>
					<div className="w-full flex justify-center items-center grow-0 sm:px-8 md:px-6 lg:px-4">
						<div className="relative rounded-lg overflow-hidden">
							<Link href="/analytics">
								<div className="cursor-pointer absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500  from-indigo-300 z-0 opacity-20 hover:opacity-25 transition-opacity"></div>
							</Link>
							<Image
								src="/analytics-demo.png"
								width={838}
								height={450}
								alt="showcase analytics dashboard"
								quality={100}
								className="z-50"
							/>
						</div>
					</div>

					<div className="grow flex justify-center items-center">
						<Link href="/analytics">
							<button className="w-48 h-12 bg-indigo-800 rounded hover:bg-indigo-700 active:bg-indigo-800 transition-colors flex flex-row justify-center items-center gap-2">
								<span className="text-lg">Try it</span>
								<ArrowRight className="w-5 h-5" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}
