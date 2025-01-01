import { v4 as uuidv4 } from 'uuid';

let sessions = {};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const code = uuidv4().toString(36).substring(0, 5);
    sessions[code] = { file: null };
    res.status(200).json({ code });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export { sessions };
