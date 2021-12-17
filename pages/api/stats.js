import jwt from 'jsonwebtoken';

export default async function stats(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const token = req.cookes.token;
    if (!token) return res.status(403).send('Forbidden');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log({ decoded });

    res.send({ msg: 'it works', decoded });
  } catch (ex) {
    console.error('Error occurred /stats', ex);
    res.status(500).send({ done: false, error: ex.message });
  }

  console.log({ cookies: req.cookies });

  res.send('It works!');
}
