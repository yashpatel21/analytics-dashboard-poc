import { format, subDays } from 'date-fns'

export const formatDate = (date: Date) => {
	const month: number = date.getMonth() + 1
	const day: number = date.getDate()
	const year: number = date.getFullYear()

	const formattedMonth: string = month < 10 ? '0' + month : String(month)
	const formattedDay: string = day < 10 ? '0' + day : String(day)

	return formattedMonth + '/' + formattedDay + '/' + year
}

export const getDate = (sub: number = 0) => {
  const dateXDaysAgo = subDays(new Date(), sub)

  return format(dateXDaysAgo, 'MM/dd/yyyy')
}
