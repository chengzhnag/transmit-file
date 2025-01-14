import { v4 as uuidv4 } from 'uuid';
import cache from '../../lib/catch';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const code = uuidv4().toString(36).substring(0, 5);
    const globalSeesion = cache.get('globalSeesion') || {};
    globalSeesion[code] = { filePath: null };
    cache.set('globalSeesion', globalSeesion);
    res.status(200).json({ code });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
