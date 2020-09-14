const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const dateSort = (a, b) => {
  let sort_field = "end_date";
  if (typeof a.degree_date !== "undefined") {
    sort_field = "degree_date";
  }

  const [dateAMonth, dateAYear] = a[sort_field].split('/');
  const dateA = new Date(dateAYear, dateAMonth - 1, 1);
  const [dateBMonth, dateBYear] = b[sort_field].split('/');
  const dateB = new Date(dateBYear, dateBMonth - 1, 1);

  if (dateAMonth.toLowerCase() === "present") {
    return 1;
  }
  if (dateBMonth.toLowerCase() === "present") {
    return -1;
  }

  return dateA - dateB;
}

export const displayDate = (d) => {
  if (d.toLowerCase() === "present") {
    return d;
  } else {
    const [m, y] = d.split('/');
    return months[parseInt(m) - 1] + ', ' + y;
  }
}

export const ApiRequest = (API_ENDPOINT) => {
  return fetch(API_ENDPOINT)
           .then(response => {
             if (response.ok) {
               return response.json();
             } else {
               console.log(response);
               throw new Error('Something went wrong ...');
             }
           });
}
