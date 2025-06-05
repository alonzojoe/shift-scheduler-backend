const moment = require("moment");

const isOverlapping = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

const validateShift = (newShift, existingShifts) => {
  const start = moment(newShift.start);
  const end = moment(newShift.end);

  if (!start.isValid() || !end.isValid()) {
    return "Invalid start or end datetime format";
  }

  if (!end.isAfter(start)) {
    return "Shift end must be after start";
  }

  const durationHours = end.diff(start, "hours", true);

  if (durationHours > 12) {
    return "Shift duration cannot exceed 12 hours";
  }

  for (const shift of existingShifts) {
    if (isOverlapping(newShift.start, newShift.end, shift.start, shift.end)) {
      return "Shift overlaps with existing shift";
    }
  }
  return null;
};

module.exports = validateShift
