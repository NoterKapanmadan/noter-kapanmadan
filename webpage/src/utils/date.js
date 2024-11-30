const { format } = require("date-fns");

export async function formatDate(date) {
  const formattedDate = format(date, "dd/MM/yyyy");

  return formattedDate;
}
