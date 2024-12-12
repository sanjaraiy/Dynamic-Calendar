import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EventModal from '../components/EventModel'
import EventList from '../components/EventList'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState({})
  const [showEventModal, setShowEventModal] = useState(false)
  const [showEventList, setShowEventList] = useState(false)
  const [filterKeyword, setFilterKeyword] = useState('')

  useEffect(() => {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events))
  }, [events])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setShowEventList(true)
  }

  const handleAddEvent = () => {
    setShowEventModal(true)
  }

  const handleSaveEvent = (newEvent) => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents }
      if (!updatedEvents[dateKey]) {
        updatedEvents[dateKey] = []
      }
      updatedEvents[dateKey].push(newEvent)
      return updatedEvents
    })
    setShowEventModal(false)
  }

  const handleDeleteEvent = (eventToDelete) => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    setEvents(prevEvents => {
      const updatedEvents = { ...prevEvents }
      updatedEvents[dateKey] = updatedEvents[dateKey].filter(event => event !== eventToDelete)
      return updatedEvents
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateKey = date.toISOString().split('T')[0]
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString()
      const hasEvents = events[dateKey] && events[dateKey].length > 0

      days.push(
        <div
          key={day}
          className={`p-2 border cursor-pointer ${isToday ? 'bg-blue-100' : ''} ${isSelected ? 'bg-blue-200' : ''} ${hasEvents ? 'font-bold' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      )
    }

    return days
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={handlePrevMonth}><ChevronLeft /></Button>
          <h2 className="text-2xl font-bold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <Button onClick={handleNextMonth}><ChevronRight /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold text-center">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
        {selectedDate && (
          <div className="mt-4">
            <Button onClick={handleAddEvent}>Add Event</Button>
          </div>
        )}
        {showEventModal && (
          <EventModal
            onClose={() => setShowEventModal(false)}
            onSave={handleSaveEvent}
          />
        )}
        {showEventList && selectedDate && (
          <EventList
            events={events[selectedDate.toISOString().split('T')[0]] || []}
            onClose={() => setShowEventList(false)}
            onDelete={handleDeleteEvent}
            filterKeyword={filterKeyword}
            setFilterKeyword={setFilterKeyword}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default Calendar

