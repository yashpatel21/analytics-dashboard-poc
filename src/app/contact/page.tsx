'use client'
import { formatDate } from '@/utils'
import { useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'

const ContactForm = () => {
	'use client'

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [showError, setShowError] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault() // Prevents default form submission behavior
		// Log or perform actions with form data
		const formSubmission = { name, email, message }
		for (const [key, value] of Object.entries(formSubmission)) {
			console.log(value)
			if (value.trim() === '') {
				setShowError(true)
				setShowSuccess(false)
				return
			}
		}

		setShowError(false)
		setShowSuccess(true)
		// Clear form fields
		setName('')
		setEmail('')
		setMessage('')

		const currentDate = formatDate(new Date())

		const ContactAnalyticsData = { date: currentDate }
		fetch('/api/contact-submission', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(ContactAnalyticsData),
		})
	}

	return (
		<div className="w-2/5 min-w-96 bg-[#020817] shadow-md rounded-md text-white border-2 pt-4 px-4 border-slate-800">
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="name" className="block text-sm font-medium float-left mb-2">
						Name:
					</label>
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="mt-1 p-2 block w-full rounded-md bg-gray-800 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-medium float-left mb-2">
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mt-1 p-2 block w-full rounded-md bg-gray-800 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="message" className="block text-sm font-medium float-left mb-2">
						Message:
					</label>
					<textarea
						id="message"
						name="message"
						rows={8}
						cols={50}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="mt-1 p-2 block w-full rounded-md bg-gray-800 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<button
					// onClick={}
					type="submit"
					className="w-full mb-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Submit
				</button>

				{showError && (
					<div className="flex flex-row justify-center items-center mb-4">
						<h3 className="text-sm bg-red-900/50 text-red-400 ring-red-400/25 rounded-md px-2 py-1 ring-2 ring-inset w-1/2">
							Please fill out all the fields.
						</h3>
					</div>
				)}

				{showSuccess && (
					<div className="flex flex-row justify-center items-center mb-4">
						<h3 className="text-sm bg-green-900/50 text-green-400 ring-green-400/25 rounded-md px-2 py-1 ring-2 ring-inset w-1/2">
							We will be contacting you shortly!
						</h3>
					</div>
				)}
			</form>
		</div>
	)
}
export default function Home() {
	const [isClient, setIsClient] = useState(false)
	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<main className="min-h-screen min-w-screen flex">
			<div className="text-white flex flex-row justify-center min-w-full items-center">
				<div className="flex flex-col text-center min-w-full h-screen">
					<div className="h-20 flex flex-row justify-end items-center gap-5 pr-5">
						<Link href="/" className="hover:underline">
							Home
						</Link>
						<Link href="/contact" className="hover:underline">
							Contact Us
						</Link>
					</div>
					<div className="mt-3">
						<div className="h-min flex flex-row justify-center items-center gap-4">
							<h1 className="text-5xl">Contact Us</h1>
							<h3 className="text-sm bg-green-900/50 text-green-400 ring-green-400/25 rounded-md px-2 py-1 ring-2 ring-inset">
								Demo
							</h3>
						</div>
					</div>
					<div className="grow-[0.5] flex flex-col justify-center">
						<div className="h-min flex flex-row justify-center items-center gap-4">
							<p className="text-sm text-slate-500">
								We do not record the actual content of the form submissions. This is for demo purposes.
							</p>
						</div>
					</div>
					<div className="flex flex-col justify-center">
						<div className="flex flex-row justify-center w-screen">{isClient && <ContactForm />}</div>
					</div>
				</div>
			</div>
		</main>
	)
}
