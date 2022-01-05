/* Custom Hook -- purpose: DRY code */
const useFetch = async (
  url: string,
  didToken: string = '',
  method: string = 'POST',
  values?: object
): Promise<any> => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(didToken !== '' && { Authorization: `Bearer ${didToken}` }),
    },
    ...(method !== 'GET' && { body: JSON.stringify({ ...values }) }),
  });
  return res.json();
};

export default useFetch;
