import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const EventList = ({ events, onClose, onDelete, filterKeyword, setFilterKeyword }) => {
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    event.description.toLowerCase().includes(filterKeyword.toLowerCase())
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Filter events..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          className="mb-4"
        />
        {filteredEvents.length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          <ul className="space-y-2">
            {filteredEvents.map((event, index) => (
              <li key={index} className="border p-2 rounded">
                <h3 className="font-bold">{event.name}</h3>
                <p>{event.startTime} - {event.endTime}</p>
                <p>{event.description}</p>
                <Button onClick={() => onDelete(event)} variant="destructive" size="sm" className="mt-2">
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EventList

