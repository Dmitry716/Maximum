import { dayOfWeekLabels } from "@/types/constants"
import { Group } from "@/types/type"
import { Button } from "./ui/button"


export const ScheduleGroup = ({
  groups,
  deleteGroup,
  isDeletingGroup,
  handleSelectGroup
}: {
  groups: Group[],
  isDeletingGroup?: boolean,
  deleteGroup?: (id: string) => void,
  handleSelectGroup?: (group: Group) => void
}) => {

  return (
    groups.map((group, index) => (
      <div key={index} className="border rounded-md p-4">
        <h3 className="font-semibold text-lg mb-2">{group.groupNumber}</h3>
        <p className="text-sm mb-2">Возраст: {group.ageRange}</p>
        <div className="space-y-1">
          {group.schedule.map((schedule) => (
            <div key={schedule.id}
              className={`grid grid-cols-1 md:grid-cols-2 border-b py-1 space-y-1 md:space-y-0 text-sm`}>
              <span className="font-medium">
                {dayOfWeekLabels[schedule.dayOfWeek]}:
              </span>
              <span>
                {schedule.startTime?.slice(0, 5)} - {schedule.endTime?.slice(0, 5)}
              </span>
            </div>
          ))}
        </div>
        {handleSelectGroup ? <p className="text-sm mt-2">
          Студенты: {group.currentStudents} / {group.maxStudents}
        </p>
          : <p className="text-sm mt-2">
            Группа: до {group.maxStudents} человек
          </p>}
        {handleSelectGroup && <Button
          disabled={isDeletingGroup}
          onClick={(e) => {
            e.preventDefault();
            handleSelectGroup(group)
          }}
          className="mt-2 mr-2"
          variant="outline"
        >
          Редактировать
        </Button>}
        {deleteGroup && <Button
          disabled={isDeletingGroup}
          onClick={(e) => {
            e.preventDefault();
            deleteGroup(String(group.id))
          }}
          className="mt-2"
          variant={!isDeletingGroup ? "destructive" : "outline"}
        >
          Удалить группу
        </Button>}
      </div>
    ))
  )
}